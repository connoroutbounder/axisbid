'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PartViewer from '@/components/PartViewer'
import { mockJobs } from '@/data/mockJobs'
import { AlertCircle, CheckCircle } from 'lucide-react'

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

export default function JobDetailPage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null)
  const [bidPrice, setBidPrice] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  const job = mockJobs.find((j) => j.id === id)

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bidPrice || !deliveryDate) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (!id || !job) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-light-bg py-12">
        <div className="container-responsive">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{job.partName}</h1>
            <p className="text-gray-600">Job ID: {job.id}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Part Viewer */}
              <div>
                <PartViewer
                  fileName={job.partName}
                  geometry={mockGeometry}
                />
              </div>

              {/* Job Specifications */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Specifications</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Material</p>
                      <p className="text-lg font-semibold text-gray-800">{job.material}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Quantity</p>
                      <p className="text-lg font-semibold text-gray-800">{job.quantity} pcs</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Surface Finish</p>
                      <p className="text-lg font-semibold text-gray-800">Anodized</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tolerance</p>
                      <p className="text-lg font-semibold text-gray-800">±0.005"</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Needed By</p>
                      <p className="text-lg font-semibold text-gray-800">{job.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Submitted</p>
                      <p className="text-lg font-semibold text-gray-800">{job.submittedAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Notes</h2>
                <p className="text-gray-700">
                  We're looking for a precision aluminum part for an aerospace assembly. Must have excellent surface finish and tight tolerances. We have some flexibility on the delivery date if you can guarantee quality.
                </p>
              </div>

              {/* Bid Form */}
              {!submitted ? (
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Your Bid</h2>

                  <form onSubmit={handleSubmitBid} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Your Bid Price ($)
                      </label>
                      <input
                        type="number"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent text-lg"
                        placeholder="e.g., 395.00"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        AI estimate: $340 - $480. Most likely: $400
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Estimated Delivery Date
                      </label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Notes About Your Capabilities
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Tell the customer about your approach, equipment, certifications, past experience with similar parts, etc."
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-sm text-blue-800">
                        Competitive bids and accurate delivery dates win jobs. Be realistic about your capabilities.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSubmitting ? 'animate-pulse' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting Bid...' : 'Submit Bid'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Bid Submitted!</h3>
                  <p className="text-green-800 mb-6">
                    Your bid has been sent to the customer. You'll receive a notification if they select your bid.
                  </p>
                  <button
                    onClick={() => (window.location.href = '/shop')}
                    className="btn-primary"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-20 bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Bid Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Current Bids</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bid Range</p>
                    <p className="text-lg font-semibold text-gray-800">$380 - $450</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lowest Bid</p>
                    <p className="text-lg font-bold text-brand-orange">$380</p>
                  </div>
                </div>

                <div className="bg-brand-light-bg rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">PRO TIPS</p>
                  <ul className="text-xs text-gray-700 space-y-2">
                    <li>• Fast turnarounds often win</li>
                    <li>• Highlight relevant certifications</li>
                    <li>• Be honest about delivery dates</li>
                    <li>• Lower price doesn't always win</li>
                  </ul>
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
