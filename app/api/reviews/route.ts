import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const CreateReviewSchema = z.object({
  jobId: z.string(),
  rating: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5).optional(),
  timeliness: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const shopId = searchParams.get('shopId')

    if (!shopId) {
      return NextResponse.json({ error: 'shopId is required' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { shopId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = CreateReviewSchema.parse(body)

    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: {
        acceptedBid: {
          select: { shopId: true },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization - only customer can review
    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if job is completed or delivered
    if (!['DELIVERED', 'COMPLETED'].includes(job.status)) {
      return NextResponse.json(
        { error: 'Can only review completed jobs' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { jobId: data.jobId },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this job' },
        { status: 400 }
      )
    }

    if (!job.acceptedBid?.shopId) {
      return NextResponse.json(
        { error: 'No shop assigned to this job' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        jobId: data.jobId,
        userId: session.user.id,
        shopId: job.acceptedBid.shopId,
        rating: data.rating,
        quality: data.quality,
        timeliness: data.timeliness,
        communication: data.communication,
        comment: data.comment,
      },
    })

    // Update shop rating
    const allReviews = await prisma.review.findMany({
      where: { shopId: job.acceptedBid.shopId },
    })

    const averageRating =
      allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length

    await prisma.shop.update({
      where: { id: job.acceptedBid.shopId },
      data: {
        rating: parseFloat(averageRating.toFixed(2)),
      },
    })

    // Mark job as completed
    await prisma.job.update({
      where: { id: data.jobId },
      data: { status: 'COMPLETED' },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
