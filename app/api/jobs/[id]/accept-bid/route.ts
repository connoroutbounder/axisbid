import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { createPaymentIntent } from '@/lib/stripe'
import { sendBidAcceptedNotification, sendPaymentConfirmation } from '@/lib/notifications'

const AcceptBidSchema = z.object({
  bidId: z.string(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true } } },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization
    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const data = AcceptBidSchema.parse(body)

    const bid = await prisma.bid.findUnique({
      where: { id: data.bidId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            user: { select: { email: true } },
            stripeAccountId: true,
          },
        },
      },
    })

    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 })
    }

    if (bid.jobId !== params.id) {
      return NextResponse.json({ error: 'Bid does not match job' }, { status: 400 })
    }

    if (bid.status !== 'PENDING') {
      return NextResponse.json({ error: 'Bid is no longer available' }, { status: 400 })
    }

    // Create payment intent
    const amountInCents = Math.round(bid.price * 100)

    if (!bid.shop.stripeAccountId) {
      return NextResponse.json(
        { error: 'Shop has not completed Stripe setup' },
        { status: 400 }
      )
    }

    const paymentIntent = await createPaymentIntent(amountInCents, bid.shop.stripeAccountId, {
      jobId: job.id,
      bidId: bid.id,
      shopId: bid.shop.id,
    })

    // Update job with accepted bid and payment intent ID
    const platformFee = bid.price * 0.2
    const shopPayout = bid.price * 0.8

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        acceptedBidId: bid.id,
        acceptedAt: new Date(),
        totalPrice: bid.price,
        platformFee,
        shopPayout,
        stripePaymentId: paymentIntent.id,
        status: 'AWARDED',
      },
    })

    // Update bid status
    await prisma.bid.update({
      where: { id: bid.id },
      data: { status: 'ACCEPTED' },
    })

    // Reject all other bids for this job
    await prisma.bid.updateMany({
      where: {
        jobId: params.id,
        id: { not: bid.id },
      },
      data: { status: 'REJECTED' },
    })

    // Send notifications
    try {
      await sendBidAcceptedNotification(job.id, bid.shop.user.email, bid.shop.name, bid.price)
      await sendPaymentConfirmation(job.id, job.user.email, bid.price, bid.shop.name)
    } catch (notifError) {
      console.error('Failed to send notifications:', notifError)
    }

    return NextResponse.json({
      job: updated,
      bid: { id: bid.id, status: 'ACCEPTED' },
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Accept bid error:', error)
    return NextResponse.json({ error: 'Failed to accept bid' }, { status: 500 })
  }
}
