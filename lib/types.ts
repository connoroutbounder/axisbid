// Types based on schema - imported from generated Prisma types when available
export type UserRole = 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN'

export type JobStatusType = 'PENDING' | 'QUOTING' | 'BIDDING' | 'AWARDED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'

export type BidStatusType = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED'

export type MachineTypeValue = 'CNC_MILL' | 'CNC_LATHE' | 'CNC_ROUTER' | 'EDM_WIRE' | 'EDM_SINKER' | 'SURFACE_GRINDER' | 'CYLINDRICAL_GRINDER' | 'FIVE_AXIS' | 'SWISS_LATHE' | 'OTHER'

export interface GeometryData {
  boundingBox: {
    x: number
    y: number
    z: number
  }
  volume: number
  surfaceArea: number
  faceCount: number
  edgeCount: number
  holeCount: number
  pocketCount: number
}

export interface AIQuoteInput {
  material: string
  tolerance: string
  quantity: number
  boundingBox: {
    x: number
    y: number
    z: number
  }
  volume: number
  surfaceArea: number
  faceCount: number
  edgeCount: number
  holeCount: number
  pocketCount: number
  complexity?: string
}

export interface AIQuoteResult {
  low: number
  mid: number
  high: number
  confidence: number
  reasoning: string
}

export interface BidWithRelations {
  id: string
  jobId: string
  shopId: string
  price: number
  estimatedDays: number
  notes: string | null
  approach: string | null
  status: BidStatusType
  createdAt: Date
  updatedAt: Date
  expiresAt: Date | null
  shop?: {
    id: string
    name: string
    rating: number
    completedJobs: number
    isVerified: boolean
  }
}

export interface JobWithRelations {
  id: string
  userId: string
  title: string | null
  status: JobStatusType
  material: string
  surfaceFinish: string | null
  tolerance: string
  quantity: number
  neededBy: Date | null
  notes: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  boundingBox: any
  volume: number | null
  surfaceArea: number | null
  faceCount: number | null
  edgeCount: number | null
  holeCount: number | null
  pocketCount: number | null
  complexity: string | null
  renderUrls: string[]
  aiEstimateLow: number | null
  aiEstimateHigh: number | null
  aiEstimateMid: number | null
  aiConfidence: number | null
  aiReasoning: string | null
  acceptedBidId: string | null
  acceptedAt: Date | null
  totalPrice: number | null
  platformFee: number | null
  shopPayout: number | null
  stripePaymentId: string | null
  paidAt: Date | null
  shippedAt: Date | null
  deliveredAt: Date | null
  trackingNumber: string | null
  createdAt: Date
  updatedAt: Date
  bidDeadline: Date | null
  bids?: BidWithRelations[]
}

export interface ShopWithRelations {
  id: string
  userId: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  phone: string | null
  website: string | null
  yearsInBusiness: number | null
  employeeCount: number | null
  certifications: string[]
  materials: string[]
  maxPartSize: string | null
  rating: number
  totalJobs: number
  completedJobs: number
  onTimeRate: number
  isVerified: boolean
  isActive: boolean
  stripeAccountId: string | null
  stripeOnboarded: boolean
  createdAt: Date
  updatedAt: Date
}
