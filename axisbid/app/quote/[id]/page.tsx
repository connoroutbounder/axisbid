'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PartViewer from '@/components/PartViewer'
import PriceEstimate from '@/components/PriceEstimate'
import BidCard from '@/components/BidCard'
import { mockBids } from '@/data/mockBids'

const mockGeometry = {
  boundingBox: { x: 120, y: 100, z: 80 },
  volume: 384000,
  surfaceArea: 40000,
  faces: 24,
  edges: 48,
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function QuoteDetailPage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null)
  const [incomingBids, setIncomingBids] = useState(mockBids.slice(0, 1))

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    // Simulate bids coming in over time
    const timer1 = setTimeout(
      () => setIncomingBids(mockBids.slice(0, 2)),
      2000
    )
    const timer2 = setTimeout(
      () => setIncomingBids(mockBids.slice(0, 3)),
      4000
    )
    const timer3 = setTimeout(
      () => setIncomingBids(mockBids),
      6000
    )

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  if (!id) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-light-bg py-12">
        <div className="container-responsive">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Quote</h1>
            <p className="text-gray-600">Quote ID: {id}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price Estimate */}
              <PriceEstimate
                minPrice={340}
                maxPrice={480}
                mostLikelyPrice={400}
                savingsPercentage={20}
                onBuyNow={() => alert('Redirecting to checkout...')}
              />

              {/* Shop Bids */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Bids</h2>
                <p className="text-gray-600 text-sm mb-6">
                  {incomingBids.length} of {mockBids.length} shops have submitted bids
                </p>

                <div className="space-y-6">
                  {incomingBids.map((bid, idx) => (
                    <BidCard
                      key={idx}
                      shopName={bid.shopName}
                      rating={bid.rating}
                      reviewCount={bid.reviewCount}
                      bidPrice={bid.bidPrice}
                      estimatedDelivery={bid.estimatedDelivery}
                      completedJobs={bid.completedJobs}
                      keyMachines={bid.keyMachines}
                      certifications={bid.certifications}
                      onAccept={() => alert(`Bid from ${bid.shopName} accepted!`)}
                    />
                  ))}
                </div>

                {incomingBids.length < mockBids.length && (
                  <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-blue-800 font-medium mb-2">More bids coming in...</p>
                    <div className="flex justify-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-20">
                <PartViewer
                  fileName="bracket_assembly.step"
                  geometry={mockGeometry}
                />

                {/* Job Summary */}
                <div className="mt-8 bg-white rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Job Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-semibold text-gray-800">Aluminum 6061</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finish:</span>
                      <span className="font-semibold text-gray-800">Anodized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tolerance:</span>
                      <span className="font-semibold text-gray-800">±0.005"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold text-gray-800">5 pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Needed By:</span>
                      <span className="font-semibold text-gray-800">2024-12-20</span>
                    </div>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="mt-8 bg-white rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Estimate Confidence</h3>
                  <div className="mb-4">
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500"
                        style={{ width: '87%' }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">87% - High Confidence</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Based on file quality, complexity, and shop availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
