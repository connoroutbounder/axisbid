'use client'

import { useEffect, useState, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import {
  TrendingUp,
  Users,
  Briefcase,
  ShieldCheck,
  Loader2,
} from 'lucide-react'

interface Stats {
  totalJobs: number
  activeJobs: number
  totalShops: number
  verifiedShops: number
  totalRevenue: number
  totalGMV: number
}

interface Shop {
  id: string
  name: string
  isVerified: boolean
  isActive: boolean
  rating: number
  employeeCount: number | null
  machines: { id: string }[]
  createdAt: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingShops, setLoadingShops] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }, [])

  const fetchShops = useCallback(async () => {
    try {
      const res = await fetch('/api/shops')
      if (res.ok) {
        setShops(await res.json())
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error)
    } finally {
      setLoadingShops(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchShops()
  }, [fetchStats, fetchShops])

  async function handleVerify(shopId: string, action: 'approve' | 'reject') {
    setVerifyingId(shopId)
    try {
      const res = await fetch('/api/admin/shops/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, action }),
      })

      if (res.ok) {
        await Promise.all([fetchStats(), fetchShops()])
      }
    } catch (error) {
      console.error('Failed to verify shop:', error)
    } finally {
      setVerifyingId(null)
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Platform Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor platform activity and metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loadingStats ? (
            <div className="col-span-4 flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : stats ? (
            <>
              <StatCard
                label="Total Jobs"
                value={String(stats.totalJobs)}
                icon={<Briefcase className="w-8 h-8" />}
              />
              <StatCard
                label="Active Jobs"
                value={String(stats.activeJobs)}
                icon={<Briefcase className="w-8 h-8" />}
              />
              <StatCard
                label="Total Shops"
                value={`${stats.verifiedShops} / ${stats.totalShops}`}
                icon={<Users className="w-8 h-8" />}
              />
              <StatCard
                label="Revenue (20%)"
                value={formatPrice(stats.totalRevenue)}
                icon={<TrendingUp className="w-8 h-8" />}
              />
            </>
          ) : null}
        </div>

        {/* GMV stat if available */}
        {stats && stats.totalGMV > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              label="Total GMV"
              value={formatPrice(stats.totalGMV)}
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </div>
        )}

        {/* Shops Table */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
              <h2 className="text-lg font-bold text-gray-900">
                Shop Management
              </h2>
            </div>
          }
        >
          {loadingShops ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : shops.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No shops found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Shop Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Machines
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr
                      key={shop.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{shop.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        {shop.isVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : shop.isActive ? (
                          <Badge variant="pending">Pending</Badge>
                        ) : (
                          <Badge variant="rejected">Rejected</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">
                          {shop.rating > 0 ? shop.rating.toFixed(1) : '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">
                          {shop.machines?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">
                          {shop.employeeCount ?? '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {!shop.isVerified && shop.isActive && (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={verifyingId === shop.id}
                                onClick={() => handleVerify(shop.id, 'reject')}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={verifyingId === shop.id}
                                isLoading={verifyingId === shop.id}
                                onClick={() => handleVerify(shop.id, 'approve')}
                              >
                                Approve
                              </Button>
                            </>
                          )}
                          {shop.isVerified && (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={verifyingId === shop.id}
                              onClick={() => handleVerify(shop.id, 'reject')}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
