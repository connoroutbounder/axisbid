import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { MachineList } from '@/components/shops/machine-list'
import { CertificationBadges } from '@/components/shops/certification-badges'
import { CheckCircle, MapPin, Award } from 'lucide-react'
import Link from 'next/link'

const mockShop = {
  id: '1',
  name: 'Precision CNC Works',
  verified: true,
  rating: 4.9,
  reviewCount: 87,
  location: 'San Francisco, CA',
  yearsInBusiness: 12,
  employees: 24,
  description:
    'High-precision CNC machining with expertise in aerospace, medical, and automotive applications. ISO 9001 and AS9100 certified.',
  onTimeRate: 98,
  completedJobs: 342,
  machines: [
    {
      type: 'CNC Mill',
      brand: 'Haas',
      model: 'VF4',
      axes: 5,
      maxTravel: '60" x 40" x 25"',
    },
    {
      type: 'CNC Lathe',
      brand: 'Okuma',
      model: 'LU300',
      axes: 3,
      maxTravel: '12" dia x 20"',
    },
    {
      type: 'CNC Plasma',
      brand: 'Hypertherm',
      model: 'XPression',
      axes: 2,
      maxTravel: '12\' x 25\'',
    },
  ],
  certifications: ['ISO 9001', 'AS9100'],
  materialsWorkedWith: [
    'Aluminum',
    'Steel',
    'Stainless Steel',
    'Titanium',
    'Brass',
    'Plastics',
  ],
}

export default function ShopProfilePage({
  params: _params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />

      <div className="container py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {mockShop.name}
                  </h1>
                  {mockShop.verified && (
                    <CheckCircle className="w-8 h-8 text-brand-green" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={mockShop.rating} showText size="md" />
                  <span className="text-gray-600">
                    ({mockShop.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-5 h-5" />
                  {mockShop.location}
                </div>

                <p className="text-gray-700 mt-4 max-w-2xl">
                  {mockShop.description}
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-64">
                <div className="bg-brand-light rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      In Business
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {mockShop.yearsInBusiness}+ years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Employees
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {mockShop.employees}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Jobs Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {mockShop.completedJobs}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      On-Time Rate
                    </p>
                    <p className="text-2xl font-bold text-brand-green mt-1">
                      {mockShop.onTimeRate}%
                    </p>
                  </div>
                </div>

                <Link href="/quote/new">
                  <Button variant="primary" size="lg" className="w-full mt-4">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MachineList machines={mockShop.machines} />
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <CertificationBadges certifications={mockShop.certifications} />

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-brand-orange" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Materials
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockShop.materialsWorkedWith.map((material) => (
                    <Badge key={material} variant="default">
                      {material}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            <div className="space-y-6">
              {[
                {
                  author: 'John Smith',
                  rating: 5,
                  date: '2026-03-15',
                  text: 'Excellent work. Parts arrived on time and with perfect quality. Will definitely order again.',
                },
                {
                  author: 'Sarah Johnson',
                  rating: 4.5,
                  date: '2026-03-10',
                  text: 'Great shop! Fast turnaround. Only minor note: communication could be slightly better but overall highly satisfied.',
                },
                {
                  author: 'Mike Chen',
                  rating: 5,
                  date: '2026-02-28',
                  text: 'Top-notch precision. Tolerances were spot-on. This is our go-to shop for critical aerospace components.',
                },
              ].map((review, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
