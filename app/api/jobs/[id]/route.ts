import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const UpdateJobSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  neededBy: z.string().datetime().optional(),
  trackingNumber: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        bids: {
          include: {
            shop: {
              select: {
                id: true,
                name: true,
                rating: true,
                completedJobs: true,
                isVerified: true,
                certifications: true,
              },
            },
          },
        },
        review: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization
    if (job.userId !== session?.user?.id && session?.user?.role !== 'ADMIN') {
      // Allow shop owners to see their own bids
      const shopBid = job.bids.find((bid: any) => bid.shopId === (session?.user as any)?.shopId)
      if (!shopBid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
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
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization
    if (job.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const data = UpdateJobSchema.parse(body)

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: data.title,
        status: data.status,
        notes: data.notes,
        neededBy: data.neededBy ? new Date(data.neededBy) : undefined,
        trackingNumber: data.trackingNumber,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update job error:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization
    if (job.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Can only delete if not awarded
    if (job.status !== 'PENDING' && job.status !== 'QUOTING') {
      return NextResponse.json(
        { error: 'Cannot delete job that has been awarded or is in production' },
        { status: 400 }
      )
    }

    await prisma.job.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json({ error: 'Failed to cancel job' }, { status: 500 })
  }
}
