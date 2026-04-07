export interface Bid {
  id: string
  shopName: string
  rating: number
  reviewCount: number
  bidPrice: number
  estimatedDelivery: string
  completedJobs: number
  keyMachines: string[]
  certifications: string[]
}

export const mockBids: Bid[] = [
  {
    id: 'bid_1',
    shopName: 'Precision Machine Works',
    rating: 4.9,
    reviewCount: 247,
    bidPrice: 385,
    estimatedDelivery: '7 business days',
    completedJobs: 1203,
    keyMachines: ['CNC Milling', '5-axis', 'Grinding'],
    certifications: ['ISO 9001', 'AS9100'],
  },
  {
    id: 'bid_2',
    shopName: 'Advanced Manufacturing Solutions',
    rating: 4.7,
    reviewCount: 156,
    bidPrice: 395,
    estimatedDelivery: '5 business days',
    completedJobs: 847,
    keyMachines: ['CNC Milling', 'Turning', 'EDM'],
    certifications: ['ISO 9001', 'ISO 13485'],
  },
  {
    id: 'bid_3',
    shopName: 'Metro CNC & Fabrication',
    rating: 4.8,
    reviewCount: 189,
    bidPrice: 410,
    estimatedDelivery: '6 business days',
    completedJobs: 925,
    keyMachines: ['CNC Milling', 'Grinding', 'Polishing'],
    certifications: ['ISO 9001', 'ITAR'],
  },
  {
    id: 'bid_4',
    shopName: 'Elite Precision Machining',
    rating: 4.6,
    reviewCount: 103,
    bidPrice: 405,
    estimatedDelivery: '4 business days',
    completedJobs: 542,
    keyMachines: ['5-axis CNC', 'Turning', 'Honing'],
    certifications: ['ISO 9001', 'AS9100', 'NADCAP'],
  },
]
