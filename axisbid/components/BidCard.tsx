'use client'

import { Star, Zap, CheckCircle, Calendar } from 'lucide-react'

interface BidCardProps {
  shopName: string
  rating: number
  reviewCount: number
  bidPrice: number
  estimatedDelivery: string
  completedJobs: number
  keyMachines: string[]
  certifications: string[]
  onAccept: () => void
}

export default function BidCard({
  shopName,
  rating,
  reviewCount,
  bidPrice,
  estimatedDelivery,
  completedJobs,
  keyMachines,
  certifications,
  onAccept,
}: BidCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{shopName}</h3>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-brand-orange">${bidPrice}</p>
          <p className="text-xs text-gray-500">Quote total</p>
        </div>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-brand-accent-blue" />
          <div>
            <p className="text-xs text-gray-600">Estimated Delivery</p>
            <p className="font-semibold text-gray-800">{estimatedDelivery}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-brand-accent-blue" />
          <div>
            <p className="text-xs text-gray-600">Completed Jobs</p>
            <p className="font-semibold text-gray-800">{completedJobs}</p>
          </div>
        </div>
      </div>

      {/* Machines */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Equipment</p>
        <div className="flex flex-wrap gap-2">
          {keyMachines.map((machine, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              {machine}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Certifications</p>
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
              <CheckCircle size={14} />
              {cert}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onAccept}
        className="w-full btn-primary"
      >
        Accept Bid
      </button>
    </div>
  )
}
