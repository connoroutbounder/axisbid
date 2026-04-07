import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const UpdateShopSchema = z.object({
  name: z.string().min(3).optional(),
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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        machines: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    return NextResponse.json(shop)
  } catch (error) {
    console.error('Get shop error:', error)
    return NextResponse.json({ error: 'Failed to fetch shop' }, { status: 500 })
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

    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    // Check authorization
    if (shop.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const data = UpdateShopSchema.parse(body)

    const updated = await prisma.shop.update({
      where: { id: params.id },
      data: {
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
        certifications: data.certifications,
        materials: data.materials,
        maxPartSize: data.maxPartSize,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update shop error:', error)
    return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 })
  }
}
