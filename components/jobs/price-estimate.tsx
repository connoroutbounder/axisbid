import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface PriceEstimateProps {
  lowEstimate: number
  midEstimate: number
  highEstimate: number
  confidence: 'high' | 'medium' | 'low'
}

export function PriceEstimate({
  lowEstimate,
  midEstimate,
  highEstimate,
  confidence,
}: PriceEstimateProps) {
  const confidenceConfig = {
    high: { label: 'High Confidence', color: 'success' },
    medium: { label: 'Medium Confidence', color: 'warning' },
    low: { label: 'Low Confidence', color: 'error' },
  }

  const config = confidenceConfig[confidence]

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI Price Estimate
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Based on your part geometry and specifications
          </p>
        </div>
        <div className="w-12 h-12 bg-brand-orange bg-opacity-10 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-brand-orange" />
        </div>
      </div>

      {/* Price Range Visualization */}
      <div className="mb-8">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-end">
            <p className="text-xs font-medium text-gray-600">Low Estimate</p>
            <p className="text-sm font-bold text-gray-900">
              {formatPrice(lowEstimate)}
            </p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-orange via-brand-blue to-brand-green"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Price Points */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Low</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(lowEstimate)}
            </p>
          </div>
          <div className="text-center p-4 bg-brand-blue bg-opacity-10 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Mid</p>
            <p className="text-lg font-bold text-brand-blue">
              {formatPrice(midEstimate)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">High</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(highEstimate)}
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Level */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase mb-2">
            Estimate Confidence
          </p>
          <Badge variant={config.color as any}>{config.label}</Badge>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Recommended Budget</p>
          <p className="text-2xl font-bold text-brand-orange">
            {formatPrice(midEstimate * 1.2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">(+20% for contingency)</p>
        </div>
      </div>
    </Card>
  )
}
