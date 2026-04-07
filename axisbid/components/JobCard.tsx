'use client'

import { Calendar, Box, Users, Clock } from 'lucide-react'

interface JobCardProps {
  id: string
  partName: string
  material: string
  quantity: number
  deadline: string
  submittedAt: string
  status: 'open' | 'awarded' | 'completed'
  bidCount?: number
  lowestBid?: number
  onClick: () => void
}

export default function JobCard({
  id,
  partName,
  material,
  quantity,
  deadline,
  submittedAt,
  status,
  bidCount = 0,
  lowestBid,
  onClick,
}: JobCardProps) {
  const statusColors = {
    open: 'bg-blue-50 text-blue-700 border border-blue-200',
    awarded: 'bg-green-50 text-green-700 border border-green-200',
    completed: 'bg-gray-50 text-gray-700 border border-gray-200',
  }

  const statusLabels = {
    open: 'Open for Bids',
    awarded: 'Bid Accepted',
    completed: 'Completed',
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{partName}</h3>
          <p className="text-sm text-gray-600">{material}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Quantity</p>
            <p className="font-semibold text-gray-800">{quantity} pcs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Needed By</p>
            <p className="font-semibold text-gray-800">{deadline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Submitted</p>
            <p className="font-semibold text-gray-800">{submittedAt}</p>
          </div>
        </div>
        {status === 'open' && (
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Bids</p>
              <p className="font-semibold text-gray-800">{bidCount}</p>
            </div>
          </div>
        )}
        {status === 'awarded' && lowestBid && (
          <div>
            <p className="text-xs text-gray-600">Awarded Price</p>
            <p className="font-semibold text-brand-orange text-lg">${lowestBid}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <button className="text-brand-accent-blue hover:text-brand-dark-blue font-semibold text-sm transition-colors">
          {status === 'open' ? 'View & Bid' : 'View Details'} →
        </button>
      </div>
    </div>
  )
}
