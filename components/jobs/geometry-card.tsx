import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'

interface GeometryCardProps {
  dimensions: {
    length: number
    width: number
    height: number
  }
  volume: number
  surfaceArea: number
  complexity: 'low' | 'medium' | 'high'
}

export function GeometryCard({
  dimensions,
  volume,
  surfaceArea,
  complexity,
}: GeometryCardProps) {
  const complexityConfig = {
    low: { label: 'Low Complexity', color: 'success' },
    medium: { label: 'Medium Complexity', color: 'warning' },
    high: { label: 'High Complexity', color: 'error' },
  }

  const config = complexityConfig[complexity]

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Geometry Data</h3>
          <p className="text-sm text-gray-600 mt-1">Part dimensions and properties</p>
        </div>
        <div className="w-12 h-12 bg-brand-blue bg-opacity-10 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-brand-blue" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase">
              Length
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dimensions.length.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">mm</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase">Width</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dimensions.width.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">mm</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase">Height</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dimensions.height.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">mm</p>
          </div>
        </div>

        {/* Volume & Surface Area */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Volume</p>
            <p className="text-xl font-bold text-gray-900 mt-2">
              {volume.toFixed(2)} cm³
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Surface Area
            </p>
            <p className="text-xl font-bold text-gray-900 mt-2">
              {surfaceArea.toFixed(2)} cm²
            </p>
          </div>
        </div>

        {/* Complexity */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
            Estimated Complexity
          </p>
          <Badge variant={config.color as any}>{config.label}</Badge>
        </div>
      </div>
    </Card>
  )
}
