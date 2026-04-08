import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendJobStatusUpdate } from '@/lib/notifications'

const UpdateStatusSchema = z.object({
  status: z.enum(['IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'COMPLETED']),
  trackingNumber: z.string().optional(),
})

const allowedTransitions: Record<string, string[]> = {
  AWARDED: ['IN_PRODUCTION'],
  IN_PRODUCTION: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
}

export async function PATCH(
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
      include: {
        user: { select: { email: true } },
        acceptedBid: {
          include: {
            shop: { select: { userId: true } },
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = UpdateStatusSchema.parse(body)

    // Check allowed transitions
    const allowed = allowedTransitions[job.status] || []
    if (!allowed.includes(data.status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${job.status} to ${data.status}` },
        { status: 400 }
      )
    }

    // Authorization: shop owner can mark SHIPPED, customer can mark DELIVERED/COMPLETED
    const isShopOwner = job.acceptedBid?.shop.userId === session.user.id
    const isCustomer = job.userId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (data.status === 'SHIPPED' && !isShopOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only the shop can mark as shipped' }, { status: 403 })
    }
    if (['DELIVERED', 'COMPLETED'].includes(data.status) && !isCustomer && !isAdmin) {
      return NextResponse.json({ error: 'Only the customer can confirm delivery' }, { status: 403 })
    }

    const updateData: any = { status: data.status }
    if (data.status === 'SHIPPED') {
      updateData.shippedAt = new Date()
      if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber
    }
    if (data.status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    }

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
    })

    // Send email notification
    try {
      await sendJobStatusUpdate(params.id, job.user.email, data.status)
    } catch (notifError) {
      console.error('Failed to send status update email:', notifError)
    }

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update status error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
