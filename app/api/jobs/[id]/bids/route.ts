import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendNewBidNotification } from '@/lib/notifications'

const CreateBidSchema = z.object({
  price: z.number().positive(),
  estimatedDays: z.number().int().positive(),
  notes: z.string().optional(),
  approach: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const bids = await prisma.bid.findMany({
      where: { jobId: params.id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bids)
  } catch (error) {
    console.error('Get bids error:', error)
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a shop owner
    const shop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Only shop owners can submit bids' },
        { status: 403 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true } } },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if job is open for bidding
    if (!['PENDING', 'BIDDING'].includes(job.status)) {
      return NextResponse.json(
        { error: 'This job is not accepting bids' },
        { status: 400 }
      )
    }

    // Check if shop already bid
    const existingBid = await prisma.bid.findUnique({
      where: {
        jobId_shopId: {
          jobId: params.id,
          shopId: shop.id,
        },
      },
    })

    if (existingBid) {
      return NextResponse.json(
        { error: 'You have already submitted a bid for this job' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = CreateBidSchema.parse(body)

    // Create bid
    const bid = await prisma.bid.create({
      data: {
        jobId: params.id,
        shopId: shop.id,
        price: data.price,
        estimatedDays: data.estimatedDays,
        notes: data.notes,
        approach: data.approach,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
      },
    })

    // Update job status to BIDDING if it was PENDING
    if (job.status === 'PENDING') {
      await prisma.job.update({
        where: { id: params.id },
        data: { status: 'BIDDING' },
      })
    }

    // Send notification to customer
    try {
      await sendNewBidNotification(params.id, job.user.email, shop.name, data.price)
    } catch (notifError) {
      console.error('Failed to send bid notification:', notifError)
    }

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create bid error:', error)
    return NextResponse.json({ error: 'Failed to submit bid' }, { status: 500 })
  }
}
