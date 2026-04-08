'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusTimeline } from '@/components/jobs/status-timeline'
import { GeometryCard } from '@/components/jobs/geometry-card'
import { BidCard } from '@/components/bids/bid-card'
import { BidForm } from '@/components/bids/bid-form'
import { Tabs } from '@/components/ui/tabs'
import MessageThread from '@/components/messages/message-thread'
import { FileText, Download, FileBox } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Job {
  id: string
  title: string | null
  status: string
  material: string
  surfaceFinish: string | null
  tolerance: string
  quantity: number
  neededBy: string | null
  notes: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  boundingBox: any
  volume: number | null
  surfaceArea: number | null
  complexity: string | null
  acceptedBidId: string | null
  createdAt: string
  bids: Bid[]
}

interface Bid {
  id: string
  price: number
  estimatedDays: number
  approach: string | null
  notes: string | null
  status: string
  shop: {
    id: string
    name: string
    rating: number
    completedJobs: number
    isVerified: boolean
    certifications: string[]
    machines: { name: string }[]
  }
}

function getTimelineSteps(status: string) {
  const statusOrder = ['BIDDING', 'AWARDED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED']
  const labels = ['Shops Bidding', 'Bid Accepted', 'In Production', 'Shipped', 'Delivered']
  const currentIdx = statusOrder.indexOf(status)

  return labels.map((label, idx) => ({
    label,
    status: idx < currentIdx ? 'completed' as const
      : idx === currentIdx ? 'current' as const
      : 'pending' as const,
  }))
}

const statusVariant: Record<string, string> = {
  PENDING: 'pending',
  BIDDING: 'active',
  AWARDED: 'accepted',
  IN_PRODUCTION: 'active',
  SHIPPED: 'active',
  DELIVERED: 'success',
  COMPLETED: 'completed',
}

const statusLabel: Record<string, string> = {
  PENDING: 'Pending',
  BIDDING: 'Accepting Bids',
  AWARDED: 'Awarded',
  IN_PRODUCTION: 'In Production',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'overview'
  const { data: session } = useSession()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [_accepting, setAccepting] = useState<string | null>(null)

  const userRole = session?.user?.role === 'SHOP_OWNER' ? 'shop' : 'customer'

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`)
        if (res.ok) {
          const data = await res.json()
          setJob(data)
        }
      } catch (error) {
        console.error('Failed to fetch job:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchJob()
  }, [id])

  const handleAcceptBid = async (bidId: string) => {
    setAccepting(bidId)
    try {
      const res = await fetch(`/api/jobs/${id}/accept-bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to accept bid')
      }

      toast.success('Bid accepted! The shop will send over payment instructions via messages.')
      const refreshRes = await fetch(`/api/jobs/${id}`)
      if (refreshRes.ok) setJob(await refreshRes.json())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept bid')
    } finally {
      setAccepting(null)
    }
  }


  if (loading) {
    return (
      <DashboardLayout userRole={userRole}>
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout userRole={userRole}>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Job not found</p>
          </div>
        </Card>
      </DashboardLayout>
    )
  }

  const timelineSteps = getTimelineSteps(job.status)

  const tabs = [
    {
      label: 'Overview',
      value: 'overview',
      content: (
        <div className="space-y-6">
          {job.fileUrl && (
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                    <FileBox className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{job.fileName}</p>
                    <p className="text-sm text-gray-500">
                      STEP File{job.fileSize ? ` \u00B7 ${(job.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                    </p>
                  </div>
                </div>
                <a
                  href={job.fileUrl}
                  download={job.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-navy transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download STEP
                </a>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Part Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Material</p>
                <p className="text-gray-900 font-medium mt-1">{job.material}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Quantity</p>
                <p className="text-gray-900 font-medium mt-1">{job.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Tolerance</p>
                <p className="text-gray-900 font-medium mt-1">{job.tolerance}</p>
              </div>
              {job.neededBy && (
                <div>
                  <p className="text-sm text-gray-600 uppercase font-semibold">Needed By</p>
                  <p className="text-gray-900 font-medium mt-1">{formatDate(job.neededBy)}</p>
                </div>
              )}
              {job.surfaceFinish && (
                <div>
                  <p className="text-sm text-gray-600 uppercase font-semibold">Surface Finish</p>
                  <p className="text-gray-900 font-medium mt-1">{job.surfaceFinish}</p>
                </div>
              )}
            </div>
            {job.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 uppercase font-semibold">Notes</p>
                <p className="text-gray-900 mt-1">{job.notes}</p>
              </div>
            )}
          </Card>

          {job.volume && job.surfaceArea && (
            <GeometryCard
              dimensions={job.boundingBox || { length: 0, width: 0, height: 0 }}
              volume={job.volume}
              surfaceArea={job.surfaceArea}
              complexity={(job.complexity as 'low' | 'medium' | 'high') || 'medium'}
            />
          )}
        </div>
      ),
    },
    {
      label: userRole === 'shop' ? 'Submit Bid' : `Bids (${job.bids.length})`,
      value: 'bids',
      content: (
        <div className="space-y-4">
          {/* Show bid form for shop owners on open jobs */}
          {userRole === 'shop' && ['PENDING', 'BIDDING'].includes(job.status) && !job.acceptedBidId && (
            <BidForm
              jobId={job.id}
              onSubmitted={async () => {
                toast.success('Bid submitted successfully!')
                const refreshRes = await fetch(`/api/jobs/${id}`)
                if (refreshRes.ok) setJob(await refreshRes.json())
              }}
            />
          )}

          {job.bids.length === 0 && userRole !== 'shop' ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600">No bids yet. Shops are reviewing your part.</p>
              </div>
            </Card>
          ) : (
            job.bids.map((bid) => (
              <BidCard
                key={bid.id}
                shopName={bid.shop.name}
                verified={bid.shop.isVerified}
                rating={bid.shop.rating}
                reviewCount={bid.shop.completedJobs}
                price={bid.price}
                deliveryDays={bid.estimatedDays}
                approach={bid.approach || 'No approach description provided.'}
                certifications={bid.shop.certifications}
                machineCapabilities={bid.shop.machines.map((m) => m.name)}
                isAccepted={job.acceptedBidId === bid.id}
                onAccept={
                  !job.acceptedBidId && userRole === 'customer'
                    ? () => handleAcceptBid(bid.id)
                    : undefined
                }
              />
            ))
          )}
        </div>
      ),
    },
    {
      label: 'Messages',
      value: 'messages',
      content: (
        <MessageThread jobId={job.id} />
      ),
    },
    {
      label: 'Details',
      value: 'details',
      content: (
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            File & Project Details
          </h3>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h4 className="font-semibold text-gray-900 mb-4">CAD File</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue rounded flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{job.fileName}</p>
                    <p className="text-sm text-gray-600">
                      {(job.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <a href={job.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Project ID</h4>
              <p className="text-gray-600 font-mono">{job.id}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
              <p className="text-gray-600">{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {job.title || job.fileName}
              </h1>
              <p className="text-gray-600 mt-1">Project ID: {job.id}</p>
            </div>
            <Badge variant={(statusVariant[job.status] || 'default') as any}>
              {statusLabel[job.status] || job.status}
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <StatusTimeline steps={timelineSteps} />
        </Card>

        {/* Main Content */}
        <Tabs tabs={tabs} defaultValue={defaultTab} />
      </div>

    </DashboardLayout>
  )
}
