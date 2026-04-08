'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { formatPrice, formatDate } from '@/lib/utils'
import { Hammer, Clock, CheckCircle, DollarSign } from 'lucide-react'

interface Job {
  id: string
  title: string | null
  material: string
  quantity: number
  tolerance: string
  neededBy: string | null
  status: string
  bids: { id: string }[]
}

interface ShopBid {
  id: string
  price: number
  estimatedDays: number
  status: string
  createdAt: string
  job: {
    id: string
    title: string | null
    material: string
    status: string
  }
}

export default function ShopDashboardPage() {
  const { data: session } = useSession()
  const [availableJobs, setAvailableJobs] = useState<Job[]>([])
  const [myBids, setMyBids] = useState<ShopBid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    async function fetchData() {
      try {
        const [jobsRes, bidsRes] = await Promise.all([
          fetch('/api/jobs?status=BIDDING'),
          fetch('/api/shops/me/bids'),
        ])

        if (jobsRes.ok) {
          const data = await jobsRes.json()
          setAvailableJobs(data.jobs || [])
        }
        if (bidsRes.ok) {
          const data = await bidsRes.json()
          setMyBids(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [session?.user?.id])

  const pendingBids = myBids.filter((b) => b.status === 'PENDING')
  const acceptedBids = myBids.filter((b) => b.status === 'ACCEPTED')
  const totalEarnings = acceptedBids.reduce((sum, b) => sum + b.price, 0)

  const bidStatusVariant: Record<string, string> = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'default',
    WITHDRAWN: 'default',
    EXPIRED: 'default',
  }

  const tabs = [
    {
      label: 'Available Jobs',
      value: 'available',
      content: loading ? (
        <Card>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded" />)}
          </div>
        </Card>
      ) : availableJobs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs available for bidding right now. Check back soon!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title || job.material}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Material</p>
                      <p className="text-gray-900 font-medium mt-1">{job.material}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Quantity</p>
                      <p className="text-gray-900 font-medium mt-1">{job.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Tolerance</p>
                      <p className="text-gray-900 font-medium mt-1">{job.tolerance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Bids</p>
                      <p className="text-gray-900 font-medium mt-1">{job.bids.length}</p>
                    </div>
                  </div>
                </div>
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="primary" size="lg">View & Bid</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      label: 'My Bids',
      value: 'bids',
      content: loading ? (
        <Card><div className="animate-pulse h-32 bg-gray-100 rounded" /></Card>
      ) : myBids.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">You haven&apos;t submitted any bids yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Your Quote</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {myBids.map((bid) => (
                  <tr key={bid.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{bid.job.title || bid.job.material}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-orange">{formatPrice(bid.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={(bidStatusVariant[bid.status] || 'default') as any}>
                        {bid.status === 'ACCEPTED' ? 'Accepted' : bid.status === 'PENDING' ? 'Pending Review' : bid.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(bid.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/jobs/${bid.job.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <DashboardLayout userRole="shop">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Available Jobs"
            value={loading ? '...' : String(availableJobs.length)}
            icon={<Hammer className="w-8 h-8" />}
          />
          <StatCard
            label="Active Bids"
            value={loading ? '...' : String(pendingBids.length)}
            icon={<Clock className="w-8 h-8" />}
          />
          <StatCard
            label="Won Jobs"
            value={loading ? '...' : String(acceptedBids.length)}
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatCard
            label="Total Earnings"
            value={loading ? '...' : formatPrice(totalEarnings)}
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        <Tabs tabs={tabs} />
      </div>
    </DashboardLayout>
  )
}
