'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, Calendar, Zap, Briefcase } from 'lucide-react'

interface BidCardProps {
  shopName: string
  verified: boolean
  rating: number
  reviewCount: number
  price: number
  deliveryDays: number
  approach: string
  certifications: string[]
  machineCapabilities: string[]
  onAccept?: () => void
  isAccepted?: boolean
}

export function BidCard({
  shopName,
  verified,
  rating,
  reviewCount,
  price,
  deliveryDays,
  approach,
  certifications,
  machineCapabilities,
  onAccept,
  isAccepted,
}: BidCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left Section - Shop Info & Price */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {shopName}
                </h3>
                {verified && (
                  <CheckCircle className="w-5 h-5 text-brand-green" />
                )}
              </div>
            </div>
          </div>

          {/* Price Highlight */}
          <div className="bg-brand-orange bg-opacity-10 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Quoted Price</p>
            <p className="text-3xl font-bold text-brand-orange">
              {formatPrice(price)}
            </p>
          </div>

          {/* Timeline & Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600">Delivery</p>
                <p className="text-sm font-semibold text-gray-900">
                  {deliveryDays}d
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600">Lead Time</p>
                <p className="text-sm font-semibold text-gray-900">
                  Quick
                </p>
              </div>
            </div>
          </div>

          {/* Approach/Notes */}
          <div className="bg-gray-50 rounded p-3 mb-4">
            <p className="text-xs font-medium text-gray-600 mb-1 uppercase">
              Shop&apos;s Approach
            </p>
            <p className="text-sm text-gray-900">{approach}</p>
          </div>
        </div>

        {/* Right Section - Capabilities & Certifications */}
        <div className="flex-none w-full md:w-64">
          {/* Machines */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <p className="text-xs font-semibold text-gray-900 uppercase">
                Machines
              </p>
            </div>
            <div className="space-y-1">
              {machineCapabilities.map((machine, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  • {machine}
                </p>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-900 uppercase mb-2">
                Certifications
              </p>
              <div className="flex flex-wrap gap-1">
                {certifications.map((cert, idx) => (
                  <Badge key={idx} variant="default" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {onAccept && !isAccepted && (
            <Button
              onClick={onAccept}
              variant="primary"
              size="md"
              className="w-full"
            >
              Accept Bid
            </Button>
          )}

          {isAccepted && (
            <div className="bg-brand-green bg-opacity-10 rounded-lg p-3 text-center">
              <p className="text-sm font-semibold text-brand-green">
                ✓ Bid Accepted
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
