import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  parseWebhookEvent,
  isPaymentSucceeded,
  isPaymentFailed,
} from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    const body = await request.text()

    let event

    try {
      event = parseWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    if (isPaymentSucceeded(event)) {
      const paymentIntent = event.data.object
      const jobId = paymentIntent.metadata?.jobId

      if (jobId) {
        // Update job to mark as paid
        await prisma.job.update({
          where: { id: jobId },
          data: {
            paidAt: new Date(),
            status: 'IN_PRODUCTION',
          },
        })

        console.log(`Payment succeeded for job ${jobId}`)
      }

      return NextResponse.json({ received: true })
    }

    if (isPaymentFailed(event)) {
      const paymentIntent = event.data.object as any
      const jobId = paymentIntent.metadata?.jobId

      if (jobId) {
        // Revert job status
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: 'AWARDED',
          },
        })

        console.log(`Payment failed for job ${jobId}`)
      }

      return NextResponse.json({ received: true })
    }

    // Handle other event types
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
