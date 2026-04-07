import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const shop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
    })

    if (!shop || !shop.stripeAccountId) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    // Mark as onboarded
    await prisma.shop.update({
      where: { id: shop.id },
      data: { stripeOnboarded: true },
    })

    // Redirect to shop dashboard
    return NextResponse.redirect(
      new URL('/shop/dashboard?stripeSuccess=true', request.url)
    )
  } catch (error) {
    console.error('Stripe callback error:', error)
    return NextResponse.redirect(
      new URL('/shop/dashboard?stripeError=true', request.url)
    )
  }
}
