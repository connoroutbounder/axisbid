import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendShopWelcomeEmail } from '@/lib/notifications'

const CreateShopSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  yearsInBusiness: z.number().int().optional(),
  employeeCount: z.number().int().optional(),
  certifications: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  maxPartSize: z.string().optional(),
})

const ShopFilterSchema = z.object({
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rating: z.number().optional(),
  material: z.string().optional(),
  limit: z.number().int().positive().default(20).optional(),
  offset: z.number().int().nonnegative().default(0).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = ShopFilterSchema.parse({
      isVerified: searchParams.get('isVerified') ? searchParams.get('isVerified') === 'true' : undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : true,
      rating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      material: searchParams.get('material') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    })

    const where: any = {}

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified
    }

    if (filters.rating !== undefined) {
      where.rating = { gte: filters.rating }
    }

    if (filters.material) {
      where.materials = { has: filters.material }
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
          machines: true,
        },
        orderBy: { rating: 'desc' },
        take: filters.limit!,
        skip: filters.offset!,
      }),
      prisma.shop.count({ where }),
    ])

    return NextResponse.json({
      shops,
      total,
      limit: filters.limit!,
      offset: filters.offset!,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Get shops error:', error)
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a shop
    const existingShop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
    })

    if (existingShop) {
      return NextResponse.json(
        { error: 'You already have a shop profile' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = CreateShopSchema.parse(body)

    // Update user role to SHOP_OWNER
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'SHOP_OWNER' },
    })

    const shop = await prisma.shop.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        website: data.website,
        yearsInBusiness: data.yearsInBusiness,
        employeeCount: data.employeeCount,
        certifications: data.certifications || [],
        materials: data.materials || [],
        maxPartSize: data.maxPartSize,
      },
    })

    // Send welcome email
    try {
      await sendShopWelcomeEmail(user.email, shop.name)
    } catch (notifError) {
      console.error('Failed to send welcome email:', notifError)
    }

    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create shop error:', error)
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 })
  }
}
