import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const VerifyShopSchema = z.object({
  shopId: z.string(),
  action: z.enum(['approve', 'reject']),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { shopId, action } = VerifyShopSchema.parse(body)

    const shop = await prisma.shop.findUnique({ where: { id: shopId } })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data:
        action === 'approve'
          ? { isVerified: true }
          : { isVerified: false, isActive: false },
    })

    return NextResponse.json(updatedShop)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Shop verification error:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
}
