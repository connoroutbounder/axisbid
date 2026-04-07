import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ShopCardProps {
  id: string
  name: string
  verified: boolean
  rating: number
  reviewCount: number
  description: string
  location: string
  yearsInBusiness: number
  completedJobs: number
}

export function ShopCard({
  id,
  name,
  verified,
  rating,
  reviewCount,
  description,
  location,
  yearsInBusiness,
  completedJobs,
}: ShopCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              {verified && (
                <CheckCircle className="w-5 h-5 text-brand-green" />
              )}
            </div>
            <p className="text-sm text-gray-600">{location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={rating} showText size="sm" />
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>

        <p className="text-sm text-gray-700 mb-4">{description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded">
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold">
              Years
            </p>
            <p className="text-lg font-bold text-gray-900">
              {yearsInBusiness}+
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold">
              Jobs Done
            </p>
            <p className="text-lg font-bold text-gray-900">{completedJobs}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold">
              Rating
            </p>
            <p className="text-lg font-bold text-brand-orange">
              {rating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <Link href={`/shops/${id}`} className="block">
        <Button variant="outline" className="w-full">
          View Profile
        </Button>
      </Link>
    </Card>
  )
}
