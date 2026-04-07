import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusTimeline } from '@/components/jobs/status-timeline'
import { PartViewer } from '@/components/jobs/part-viewer'
import { GeometryCard } from '@/components/jobs/geometry-card'
import { PriceEstimate } from '@/components/jobs/price-estimate'
import { BidCard } from '@/components/bids/bid-card'
import { Tabs } from '@/components/ui/tabs'
import { FileText, Download, Copy } from 'lucide-react'

const mockJob = {
  id: '1',
  name: 'Aluminum Bracket Assembly',
  status: 'active',
  material: 'Aluminum 6061',
  quantity: 50,
  neededBy: '2026-05-01',
  createdAt: '2026-04-01',
  geometry: {
    dimensions: {
      length: 150.5,
      width: 75.25,
      height: 45.3,
    },
    volume: 514.2,
    surfaceArea: 325.8,
    complexity: 'medium' as const,
  },
  aiEstimate: {
    lowEstimate: 2500,
    midEstimate: 3500,
    highEstimate: 5000,
    confidence: 'high' as const,
  },
  bids: [
    {
      id: '1',
      shopName: 'Precision CNC Works',
      verified: true,
      rating: 4.9,
      reviewCount: 87,
      price: 3200,
      deliveryDays: 7,
      approach: 'We will start with a rough operation on our Haas VF4 to establish the main shape, then use the Okuma LU300 for the side pocket operations.',
      certifications: ['ISO 9001', 'AS9100'],
      machineCapabilities: ['Haas VF4 CNC Mill', 'Okuma LU300 Lathe', 'CNC Plasma'],
      accepted: true,
    },
    {
      id: '2',
      shopName: 'Summit Manufacturing',
      verified: true,
      rating: 4.6,
      reviewCount: 54,
      price: 3800,
      deliveryDays: 5,
      approach: 'Quick turnaround using our automated cell. Parts will be fixture mounted and run efficiently across our Mazak Mill and Lathe combo.',
      certifications: ['ISO 9001'],
      machineCapabilities: ['Mazak Integrex', 'CNC EDM'],
    },
    {
      id: '3',
      shopName: 'Local Fabrication Services',
      verified: false,
      rating: 4.3,
      reviewCount: 32,
      price: 2900,
      deliveryDays: 10,
      approach: 'Manual setup with CNC execution. Good quality at competitive pricing. Estimated time includes QA inspection.',
      certifications: [],
      machineCapabilities: ['Bridgeport CNC Mill', 'Manual Lathe'],
    },
  ],
}

const timelineSteps = [
  { label: 'Uploaded', status: 'completed' as const },
  { label: 'AI Analyzed', status: 'completed' as const },
  { label: 'Shops Bidding', status: 'current' as const },
  { label: 'Bid Accepted', status: 'pending' as const },
  { label: 'In Production', status: 'pending' as const },
]

export default function JobDetailPage({
  params: _params,
}: {
  params: { id: string }
}) {
  const tabs = [
    {
      label: 'Overview',
      value: 'overview',
      content: (
        <div className="space-y-6">
          {/* Part Info */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Part Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Material</p>
                <p className="text-gray-900 font-medium mt-1">{mockJob.material}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Quantity</p>
                <p className="text-gray-900 font-medium mt-1">{mockJob.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Status</p>
                <Badge variant="active" className="mt-1">Active</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase font-semibold">Needed By</p>
                <p className="text-gray-900 font-medium mt-1">{mockJob.neededBy}</p>
              </div>
            </div>
          </Card>

          {/* Part Viewer */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">3D Preview</h3>
            <PartViewer />
          </Card>

          {/* Geometry Data */}
          <GeometryCard {...mockJob.geometry} />

          {/* AI Estimate */}
          <PriceEstimate {...mockJob.aiEstimate} />
        </div>
      ),
    },
    {
      label: `Bids (${mockJob.bids.length})`,
      value: 'bids',
      content: (
        <div className="space-y-4">
          {mockJob.bids.map((bid) => (
            <BidCard
              key={bid.id}
              shopName={bid.shopName}
              verified={bid.verified}
              rating={bid.rating}
              reviewCount={bid.reviewCount}
              price={bid.price}
              deliveryDays={bid.deliveryDays}
              approach={bid.approach}
              certifications={bid.certifications}
              machineCapabilities={bid.machineCapabilities}
              isAccepted={bid.accepted}
            />
          ))}
        </div>
      ),
    },
    {
      label: 'Details',
      value: 'details',
      content: (
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            File & Project Details
          </h3>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h4 className="font-semibold text-gray-900 mb-4">CAD File</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue rounded flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">bracket_assy_rev2.step</p>
                    <p className="text-sm text-gray-600">2.4 MB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Project ID</h4>
              <p className="text-gray-600 font-mono">JOB-2026-004521</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
              <p className="text-gray-600">April 1, 2026 at 10:23 AM</p>
            </div>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <DashboardLayout userRole="customer">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mockJob.name}</h1>
              <p className="text-gray-600 mt-1">Project ID: JOB-2026-004521</p>
            </div>
            <Badge variant="active">Active</Badge>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <StatusTimeline steps={timelineSteps} />
        </Card>

        {/* Main Content */}
        <Tabs tabs={tabs} />
      </div>
    </DashboardLayout>
  )
}
