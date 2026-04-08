'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, DollarSign, Upload, ArrowRight, Bell } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Job {
  id: string
  title: string | null
  status: string
  material: string
  quantity: number
  createdAt: string
  totalPrice: number | null
  bids: { id: string }[]
}

const statusConfig: Record<string, { label: string; variant: string }> = {
  PENDING: { label: 'Pending', variant: 'pending' },
  BIDDING: { label: 'Accepting Bids', variant: 'active' },
  AWARDED: { label: 'Awarded', variant: 'accepted' },
  IN_PRODUCTION: { label: 'In Production', variant: 'active' },
  SHIPPED: { label: 'Shipped', variant: 'active' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'completed' },
  CANCELLED: { label: 'Cancelled', variant: 'default' },
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

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

  const activeJobs = jobs.filter((j) => ['BIDDING', 'AWARDED', 'IN_PRODUCTION', 'SHIPPED'].includes(j.status))
  const totalBids = jobs.reduce((sum, j) => sum + j.bids.length, 0)
  const completedJobs = jobs.filter((j) => ['COMPLETED', 'DELIVERED'].includes(j.status))
  const totalSpent = jobs.reduce((sum, j) => sum + (j.totalPrice || 0), 0)

  return (
    <DashboardLayout userRole="customer">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Active Jobs"
            value={loading ? '...' : String(activeJobs.length)}
            icon={<FileText className="w-8 h-8" />}
          />
          <StatCard
            label="Total Bids"
            value={loading ? '...' : String(totalBids)}
            icon={<Clock className="w-8 h-8" />}
          />
          <StatCard
            label="Completed"
            value={loading ? '...' : String(completedJobs.length)}
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatCard
            label="Total Spent"
            value={loading ? '...' : formatPrice(totalSpent)}
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* New Bids Notification */}
        {!loading && (() => {
          const jobsWithBids = jobs.filter(
            (j) => j.bids.length > 0 && ['BIDDING', 'PENDING'].includes(j.status)
          )
          if (jobsWithBids.length === 0) return null
          const totalNewBids = jobsWithBids.reduce((sum, j) => sum + j.bids.length, 0)
          return (
            <div className="bg-brand-blue bg-opacity-10 border border-brand-blue border-opacity-30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    You have {totalNewBids} new bid{totalNewBids !== 1 ? 's' : ''} across {jobsWithBids.length} job{jobsWithBids.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobsWithBids.map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}?tab=bids`}>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-brand-blue hover:bg-brand-blue hover:text-white transition-colors cursor-pointer">
                          {job.title || job.material}
                          <span className="bg-brand-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {job.bids.length}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Quick Upload CTA */}
        <Card>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Need another quote?
              </h3>
              <p className="text-gray-600 mt-1">
                Upload a new STEP file to get started
              </p>
            </div>
            <Link href="/quote/new">
              <Button variant="primary" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Upload Part
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
            <Link href="/jobs">
              <Button variant="ghost" size="md" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No jobs yet. Upload your first part to get started!</p>
                <Link href="/quote/new">
                  <Button variant="primary">Upload Part</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Part Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Material</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bids</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 5).map((job) => {
                      const config = statusConfig[job.status] || { label: job.status, variant: 'default' }
                      return (
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
                            <Badge variant={config.variant as any}>{config.label}</Badge>
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
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
