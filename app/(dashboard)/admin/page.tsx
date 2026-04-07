import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, Users, Briefcase, AlertCircle } from 'lucide-react'

const mockJobs = [
  {
    id: '1',
    customerName: 'Acme Manufacturing',
    partName: 'Aluminum Bracket',
    status: 'active',
    bids: 5,
    value: 3500,
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    customerName: 'TechCorp',
    partName: 'Steel Component',
    status: 'pending',
    bids: 2,
    value: 2100,
    createdAt: '2026-03-30',
  },
  {
    id: '3',
    customerName: 'Precision Inc',
    partName: 'Titanium Part',
    status: 'completed',
    bids: 7,
    value: 8900,
    createdAt: '2026-03-20',
  },
]

const pendingShops = [
  {
    id: '1',
    name: 'Summit CNC Works',
    submittedAt: '2026-04-03',
    machines: 8,
    employees: 15,
  },
  {
    id: '2',
    name: 'Precision Machining',
    submittedAt: '2026-04-01',
    machines: 5,
    employees: 8,
  },
]

export default function AdminDashboardPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor platform activity and metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Total GMV"
            value="$487,200"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            label="Revenue (20%)"
            value="$97,440"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            label="Active Jobs"
            value="34"
            icon={<Briefcase className="w-8 h-8" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Registered Shops"
            value="287"
            icon={<Users className="w-8 h-8" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Recent Jobs */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Part Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Bids
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Est. Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.customerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{job.partName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          job.status === 'active'
                            ? 'active'
                            : job.status === 'pending'
                              ? 'pending'
                              : 'completed'
                        }
                      >
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue bg-opacity-10 text-brand-blue font-semibold">
                        {job.bids}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(job.value)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Shop Verification Queue */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-brand-orange" />
                <h2 className="text-lg font-bold text-gray-900">
                  Shop Verification Queue
                </h2>
                <Badge variant="warning">{pendingShops.length} pending</Badge>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {pendingShops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{shop.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {shop.machines} machines • {shop.employees} employees
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {new Date(shop.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
