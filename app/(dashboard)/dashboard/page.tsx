import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, DollarSign, Upload, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const mockJobs = [
  {
    id: '1',
    name: 'Aluminum Bracket Assembly',
    status: 'active',
    material: 'Aluminum 6061',
    quantity: 50,
    createdAt: '2026-04-01',
    bids: 3,
  },
  {
    id: '2',
    name: 'Steel CNC Part',
    status: 'pending',
    material: 'Steel 4140',
    quantity: 100,
    createdAt: '2026-03-28',
    bids: 1,
  },
  {
    id: '3',
    name: 'Titanium Aerospace Component',
    status: 'completed',
    material: 'Titanium Gr5',
    quantity: 10,
    createdAt: '2026-03-20',
    bids: 5,
  },
]

const statusConfig = {
  active: { label: 'Active', variant: 'active' as const },
  pending: { label: 'Pending Bids', variant: 'pending' as const },
  completed: { label: 'Completed', variant: 'completed' as const },
}

export default function DashboardPage() {
  return (
    <DashboardLayout userRole="customer">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Active Jobs"
            value="3"
            icon={<FileText className="w-8 h-8" />}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            label="Open Bids"
            value="7"
            icon={<Clock className="w-8 h-8" />}
          />
          <StatCard
            label="Completed"
            value="12"
            icon={<CheckCircle className="w-8 h-8" />}
            trend={{ value: 4, isPositive: true }}
          />
          <StatCard
            label="Total Spent"
            value="$24,500"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

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
            <Link href="/dashboard/quote/new">
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
            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="md" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Part Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Bids
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockJobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{job.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{job.material}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{job.quantity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig[job.status as keyof typeof statusConfig].variant}>
                          {statusConfig[job.status as keyof typeof statusConfig].label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue bg-opacity-10 text-brand-blue font-semibold">
                          {job.bids}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
