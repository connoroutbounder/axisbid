'use client'

import { TrendingDown, AlertCircle } from 'lucide-react'

interface PriceEstimateProps {
  minPrice: number
  maxPrice: number
  mostLikelyPrice: number
  savingsPercentage?: number
  onBuyNow: () => void
}

export default function PriceEstimate({
  minPrice,
  maxPrice,
  mostLikelyPrice,
  savingsPercentage = 20,
  onBuyNow,
}: PriceEstimateProps) {
  const recommendedPrice = mostLikelyPrice * 1.1 // 10% markup

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-brand p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">AI-Powered Price Estimate</h2>
        <p className="text-blue-100 text-sm">Based on your STEP file analysis</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price Range */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 font-medium mb-3">Estimated Range</p>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-brand-orange">
                ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Most likely: <span className="font-semibold text-gray-800">${mostLikelyPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Visual range bar */}
          <div className="relative pt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-accent-blue to-brand-orange"
                style={{
                  width: '100%',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Min</span>
              <span>Most likely</span>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 py-6">
          {/* Shop Bids Coming */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 font-medium mb-3 flex items-center gap-2">
              <TrendingDown size={16} className="text-brand-accent-blue" />
              Shop Bids Coming In
            </p>
            <p className="text-sm text-gray-700">
              Local machine shops are reviewing your job. Bids typically come in within 2-4 hours.
            </p>
          </div>

          {/* Savings Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
              <AlertCircle size={16} />
              Save {savingsPercentage}% vs Industry Average
            </p>
            <p className="text-xs text-green-700 mt-1">
              AxisBid connects you with vetted local shops, cutting out middlemen.
            </p>
          </div>
        </div>

        {/* Buy Now CTA */}
        <div className="bg-gradient-brand rounded-lg p-6 text-white">
          <p className="text-sm font-medium mb-2">Get Your Part Today</p>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-4xl font-bold">${recommendedPrice.toLocaleString()}</p>
              <p className="text-blue-100 text-sm mt-1">
                Includes AxisBid handling & overnight shipping
              </p>
            </div>
          </div>
          <button
            onClick={onBuyNow}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Buy Now at ${recommendedPrice.toLocaleString()}
          </button>
          <p className="text-blue-100 text-xs mt-3">
            or wait for shop bids to arrive (usually lower prices)
          </p>
        </div>
      </div>
    </div>
  )
}
