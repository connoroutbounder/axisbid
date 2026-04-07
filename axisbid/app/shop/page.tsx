'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import { mockJobs } from '@/data/mockJobs'
import { BarChart3, TrendingUp, Briefcase, DollarSign } from 'lucide-react'

export default function ShopDashboard() {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'won' | 'completed'>(
    'available'
  )

  const openJobs = mockJobs.filter((j) => j.status === 'open')
  const activeBids = mockJobs.filter((j) => j.status === 'open')
  const wonJobs = mockJobs.filter((j) => j.status === 'awarded')
  const completedJobs = mockJobs.filter((j) => j.status === 'completed')

  const totalEarnings = wonJobs.reduce((sum, j) => sum + (j.lowestBid || 0), 0)

  const tabs = [
    { id: 'available', label: 'Available Jobs', count: openJobs.length },
    { id: 'active', label: 'Your Active Bids', count: activeBids.length },
    { id: 'won', label: 'Won Jobs', count: wonJobs.length },
    { id: 'completed', label: 'Completed', count: completedJobs.length },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-light-bg py-12">
        <div className="container-responsive">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shop Dashboard</h1>
            <p className="text-gray-600">Find jobs to bid on and manage your bids</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Available Jobs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{openJobs.length}</p>
                </div>
                <Briefcase className="text-brand-orange" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Bids</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{activeBids.length}</p>
                </div>
                <BarChart3 className="text-brand-accent-blue" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Won Jobs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{wonJobs.length}</p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold text-brand-orange mt-2">
                    ${totalEarnings.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="text-brand-orange" size={32} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-6 py-4 font-semibold text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'text-brand-orange border-b-2 border-brand-orange'
                        : 'text-gray-600 border-b-2 border-transparent hover:text-brand-accent-blue'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'available' && (
                <div className="space-y-6">
                  {openJobs.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        Review these jobs and submit your bids. The fastest and most competitive bids usually win.
                      </p>
                      {openJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          partName={job.partName}
                          material={job.material}
                          quantity={job.quantity}
                          deadline={job.deadline}
                          submittedAt={job.submittedAt}
                          status={job.status}
                          bidCount={job.bidCount}
                          onClick={() => alert(`Viewing job ${job.id}`)}
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-12">No available jobs at the moment</p>
                  )}
                </div>
              )}

              {activeTab === 'active' && (
                <div className="space-y-6">
                  {activeBids.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        You have active bids on these jobs. Check back to see if you've won!
                      </p>
                      {activeBids.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          partName={job.partName}
                          material={job.material}
                          quantity={job.quantity}
                          deadline={job.deadline}
                          submittedAt={job.submittedAt}
                          status={job.status}
                          bidCount={job.bidCount}
                          onClick={() => alert(`Viewing job ${job.id}`)}
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-12">You haven't placed any bids yet</p>
                  )}
                </div>
              )}

              {activeTab === 'won' && (
                <div className="space-y-6">
                  {wonJobs.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        These are your won jobs. Congratulations! Start production and deliver on time.
                      </p>
                      {wonJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          partName={job.partName}
                          material={job.material}
                          quantity={job.quantity}
                          deadline={job.deadline}
                          submittedAt={job.submittedAt}
                          status={job.status}
                          lowestBid={job.lowestBid}
                          onClick={() => alert(`Viewing job ${job.id}`)}
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-12">You haven't won any jobs yet</p>
                  )}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="space-y-6">
                  {completedJobs.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        Jobs you've completed. Great work! Leave a note for the customer.
                      </p>
                      {completedJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          partName={job.partName}
                          material={job.material}
                          quantity={job.quantity}
                          deadline={job.deadline}
                          submittedAt={job.submittedAt}
                          status={job.status}
                          lowestBid={job.lowestBid}
                          onClick={() => alert(`Viewing job ${job.id}`)}
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-12">No completed jobs yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
