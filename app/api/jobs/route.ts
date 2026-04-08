import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const CreateJobSchema = z.object({
  title: z.string().optional(),
  material: z.string(),
  surfaceFinish: z.string().optional(),
  tolerance: z.string(),
  quantity: z.number().int().positive(),
  neededBy: z.string().datetime().optional(),
  notes: z.string().optional(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
})

const JobFilterSchema = z.object({
  status: z.string().optional(),
  userId: z.string().optional(),
  limit: z.number().int().positive().default(20).optional(),
  offset: z.number().int().nonnegative().default(0).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const searchParams = request.nextUrl.searchParams
    const filters = JobFilterSchema.parse({
      status: searchParams.get('status') || undefined,
      userId: searchParams.get('userId') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    })

    const where: any = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.userId) {
      where.userId = filters.userId
    } else if (session?.user?.role === 'SHOP_OWNER') {
      // Shop owners see all open jobs by default
      if (!filters.status) {
        where.status = { in: ['PENDING', 'BIDDING'] }
      }
    } else if (session?.user?.id) {
      where.userId = session.user.id
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          bids: {
            select: {
              id: true,
              shopId: true,
              price: true,
              estimatedDays: true,
              status: true,
              shop: {
                select: {
                  id: true,
                  name: true,
                  rating: true,
                  isVerified: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters.limit!,
        skip: filters.offset!,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      total,
      limit: filters.limit!,
      offset: filters.offset!,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = CreateJobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        title: data.title,
        material: data.material,
        surfaceFinish: data.surfaceFinish,
        tolerance: data.tolerance,
        quantity: data.quantity,
        neededBy: data.neededBy ? new Date(data.neededBy) : undefined,
        notes: data.notes,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        status: 'BIDDING',
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create job error:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
