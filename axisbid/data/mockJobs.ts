export interface Job {
  id: string
  partName: string
  material: string
  quantity: number
  deadline: string
  submittedAt: string
  status: 'open' | 'awarded' | 'completed'
  bidCount?: number
  lowestBid?: number
}

export const mockJobs: Job[] = [
  {
    id: 'job_001',
    partName: 'Aluminum Bracket Assembly',
    material: 'Aluminum 6061-T6',
    quantity: 5,
    deadline: '2024-12-20',
    submittedAt: 'Today',
    status: 'open',
    bidCount: 3,
  },
  {
    id: 'job_002',
    partName: 'Steel Motor Mount',
    material: 'Mild Steel',
    quantity: 10,
    deadline: '2024-12-15',
    submittedAt: 'Yesterday',
    status: 'open',
    bidCount: 2,
  },
  {
    id: 'job_003',
    partName: 'Titanium Aerospace Fitting',
    material: 'Titanium Grade 5',
    quantity: 2,
    deadline: '2024-12-28',
    submittedAt: '3 days ago',
    status: 'awarded',
    lowestBid: 1240,
  },
  {
    id: 'job_004',
    partName: 'Stainless Valve Body',
    material: 'Stainless 316',
    quantity: 1,
    deadline: '2024-11-20',
    submittedAt: '2 weeks ago',
    status: 'completed',
    lowestBid: 680,
  },
  {
    id: 'job_005',
    partName: 'Aluminum Heat Sink',
    material: 'Aluminum 7075',
    quantity: 50,
    deadline: '2024-12-10',
    submittedAt: '5 days ago',
    status: 'open',
    bidCount: 4,
  },
  {
    id: 'job_006',
    partName: 'PEEK Bushing',
    material: 'PEEK',
    quantity: 100,
    deadline: '2024-12-22',
    submittedAt: '2 days ago',
    status: 'open',
    bidCount: 1,
  },
]
