'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload } from 'lucide-react'

interface Job {
  id: string
  title: string | null
  status: string
  material: string
  quantity: number
  createdAt: string
  bids: { id: string }[]
}

const statusVariant: Record<string, string> = {
  PENDING: 'pending',
  BIDDING: 'active',
  AWARDED: 'accepted',
  IN_PRODUCTION: 'active',
  SHIPPED: 'active',
  DELIVERED: 'success',
  COMPLETED: 'completed',
  CANCELLED: 'default',
}

const statusLabel: Record<string, string> = {
  PENDING: 'Pending',
  BIDDING: 'Accepting Bids',
  AWARDED: 'Awarded',
  IN_PRODUCTION: 'In Production',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export default function JobsListPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!session?.user?.id) return
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs')
        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs || [])
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [session?.user?.id])

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter)

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Bidding', value: 'BIDDING' },
    { label: 'Awarded', value: 'AWARDED' },
    { label: 'In Production', value: 'IN_PRODUCTION' },
    { label: 'Completed', value: 'COMPLETED' },
  ]

  return (
    <DashboardLayout userRole="customer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <Link href="/quote/new">
            <Button variant="primary" className="gap-2">
              <Upload className="w-4 h-4" /> New Quote
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Card>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
          </Card>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No jobs found</p>
              <Link href="/quote/new">
                <Button variant="primary">Upload Your First Part</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Part Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Material</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bids</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{job.title || job.material}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{job.material}</td>
                      <td className="px-6 py-4 text-gray-900">{job.quantity}</td>
                      <td className="px-6 py-4">
                        <Badge variant={(statusVariant[job.status] || 'default') as any}>
                          {statusLabel[job.status] || job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue bg-opacity-10 text-brand-blue font-semibold">
                          {job.bids.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
