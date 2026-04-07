import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const CreateMachineSchema = z.object({
  name: z.string(),
  type: z.string(),
  axes: z.number().int().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  maxTravel: z.string().optional(),
  tolerance: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const machines = await prisma.machine.findMany({
      where: { shopId: params.id },
    })

    return NextResponse.json(machines)
  } catch (error) {
    console.error('Get machines error:', error)
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 })
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
    const data = CreateMachineSchema.parse(body)

    const machine = await prisma.machine.create({
      data: {
        shopId: params.id,
        name: data.name,
        type: data.type as any,
        axes: data.axes,
        brand: data.brand,
        model: data.model,
        maxTravel: data.maxTravel,
        tolerance: data.tolerance,
      },
    })

    return NextResponse.json(machine, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create machine error:', error)
    return NextResponse.json({ error: 'Failed to add machine' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const machineId = searchParams.get('machineId')

    if (!machineId) {
      return NextResponse.json({ error: 'Machine ID required' }, { status: 400 })
    }

    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
    })

    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 })
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

    if (machine.shopId !== params.id) {
      return NextResponse.json({ error: 'Machine does not belong to this shop' }, { status: 400 })
    }

    await prisma.machine.delete({
      where: { id: machineId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete machine error:', error)
    return NextResponse.json({ error: 'Failed to delete machine' }, { status: 500 })
  }
}
