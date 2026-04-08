import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      totalJobs,
      activeJobs,
      totalShops,
      verifiedShops,
      revenueResult,
      gmvResult,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({
        where: {
          status: {
            in: ['BIDDING', 'AWARDED', 'IN_PRODUCTION', 'SHIPPED'],
          },
        },
      }),
      prisma.shop.count(),
      prisma.shop.count({ where: { isVerified: true } }),
      prisma.job.aggregate({
        _sum: { platformFee: true },
        where: { paidAt: { not: null } },
      }),
      prisma.job.aggregate({
        _sum: { totalPrice: true },
        where: { paidAt: { not: null } },
      }),
    ])

    return NextResponse.json({
      totalJobs,
      activeJobs,
      totalShops,
      verifiedShops,
      totalRevenue: revenueResult._sum.platformFee ?? 0,
      totalGMV: gmvResult._sum.totalPrice ?? 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
