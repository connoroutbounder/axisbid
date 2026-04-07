import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { formatPrice } from '@/lib/utils'
import { Hammer, Clock, CheckCircle, DollarSign } from 'lucide-react'

const availableJobs = [
  {
    id: '1',
    name: 'Aluminum Bracket Assembly',
    material: 'Aluminum 6061',
    quantity: 50,
    aiEstimate: { mid: 3500 },
    bidCount: 3,
    deadline: '2026-05-01',
  },
  {
    id: '2',
    name: 'Steel Mounting Plate',
    material: 'Steel 4140',
    quantity: 25,
    aiEstimate: { mid: 2000 },
    bidCount: 1,
    deadline: '2026-04-28',
  },
]

const myBids = [
  {
    id: '1',
    jobName: 'Stainless Steel Manifold',
    price: 4200,
    status: 'pending',
    submittedAt: '2026-04-05',
  },
  {
    id: '2',
    jobName: 'Titanium Aerospace Part',
    price: 8500,
    status: 'accepted',
    submittedAt: '2026-04-02',
  },
]

const activeJobs = [
  {
    id: '1',
    name: 'Aluminum Bracket Assembly',
    startDate: '2026-04-06',
    estimatedCompletion: '2026-04-13',
    progress: 45,
  },
]

const completedJobs = [
  {
    id: '1',
    name: 'Stainless Steel Manifold',
    earnings: 4200,
    completedAt: '2026-03-28',
    onTime: true,
  },
  {
    id: '2',
    name: 'Aluminum Components',
    earnings: 3100,
    completedAt: '2026-03-15',
    onTime: true,
  },
]

export default function ShopDashboardPage() {
  const tabs = [
    {
      label: 'Available Jobs',
      value: 'available',
      content: (
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">
                        Material
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {job.material}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">
                        Quantity
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {job.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">
                        AI Estimate
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {formatPrice(job.aiEstimate.mid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">
                        Bids
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {job.bidCount}
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="lg">
                  View & Bid
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      label: 'My Bids',
      value: 'bids',
      content: (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Job Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Your Quote
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {myBids.map((bid) => (
                  <tr key={bid.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{bid.jobName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-orange">
                        {formatPrice(bid.price)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          bid.status === 'accepted' ? 'accepted' : 'pending'
                        }
                      >
                        {bid.status === 'accepted'
                          ? 'Accepted'
                          : 'Pending Review'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(bid.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ),
    },
    {
      label: 'Active Jobs',
      value: 'active',
      content: (
        <div className="space-y-4">
          {activeJobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.name}
                </h3>
                <Badge variant="active">In Production</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Start Date
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(job.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Est. Completion
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(job.estimatedCompletion).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Progress
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {job.progress}%
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-blue h-2 rounded-full transition-all"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      label: 'Completed',
      value: 'completed',
      content: (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Job Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-green">
                        {formatPrice(job.earnings)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {job.onTime ? (
                        <Badge variant="success">On Time</Badge>
                      ) : (
                        <Badge variant="warning">Late</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(job.completedAt).toLocaleDateString()}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Available Jobs"
            value="12"
            icon={<Hammer className="w-8 h-8" />}
          />
          <StatCard
            label="Active Bids"
            value="7"
            icon={<Clock className="w-8 h-8" />}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            label="Won Jobs"
            value="8"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatCard
            label="Earnings This Month"
            value="$18,400"
            icon={<DollarSign className="w-8 h-8" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </DashboardLayout>
  )
}
