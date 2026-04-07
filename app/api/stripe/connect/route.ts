import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { createConnectedAccount, createAccountLink } from '@/lib/stripe'

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const shop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { email: true } } },
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    // Check if already has Stripe account
    if (shop.stripeAccountId) {
      return NextResponse.json(
        { error: 'Shop already has a Stripe account' },
        { status: 400 }
      )
    }

    // Create Stripe connected account
    const stripeAccountId = await createConnectedAccount({
      email: shop.user.email,
      name: shop.name,
      url: shop.website || undefined,
    })

    // Save account ID to shop
    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: { stripeAccountId },
    })

    // Create onboarding link
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shop/stripe/connect`
    const accountLink = await createAccountLink(stripeAccountId, refreshUrl)

    return NextResponse.json({
      stripeAccountId,
      onboardingUrl: accountLink,
      shop: updated,
    })
  } catch (error) {
    console.error('Create Stripe account error:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe account' },
      { status: 500 }
    )
  }
}
