# AxisBid - CNC Machining Bid Marketplace MVP

A modern, production-quality Next.js application connecting engineers with vetted machine shops for fast, transparent CNC machining quotes.

## Overview

AxisBid is a bid-to-quote marketplace where:
- Engineers upload STEP files for their parts
- Get instant AI-powered price estimates
- Receive competitive bids from vetted local machine shops
- Choose the best option based on price, turnaround time, and capabilities

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **3D Viewer**: Three.js
- **Language**: TypeScript
- **API Integration**: Ready for Anthropic Claude API
- **Icons**: Lucide React

## Features

### For Engineers
- **Landing Page**: Hero, how it works, value props, social proof
- **Quote Upload**: Drag-and-drop STEP file upload with file validation
- **3D Preview**: Three.js-based 3D part viewer with geometry analysis
- **Specifications Form**: Material, finish, tolerance, quantity, timeline
- **AI Estimate**: Instant price range based on part analysis (mock for MVP)
- **Shop Bids**: Real-time display of incoming bids from competing shops
- **Responsive Design**: Fully mobile-optimized

### For Machine Shops
- **Dashboard**: Overview of available jobs, active bids, won jobs, earnings
- **Job Browser**: Filter and view open jobs with full specifications
- **Bid Submission**: Submit competitive bids with delivery dates and notes
- **Job Detail**: Full part preview, specs, and customer notes

### Admin/Platform
- **API Routes**: RESTful API for quote generation and estimation
- **Mock Data**: Pre-built datasets for development and testing

## Project Structure

```
axisbid/
├── app/
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global Tailwind styles
│   ├── page.tsx                  # Landing page
│   ├── api/
│   │   └── quote/
│   │       └── route.ts          # Quote estimation API
│   ├── quote/
│   │   ├── page.tsx              # Quote upload & form
│   │   └── [id]/
│   │       └── page.tsx          # Quote detail with bids
│   ├── shop/
│   │   ├── page.tsx              # Shop dashboard
│   │   └── job/
│   │       └── [id]/
│   │           └── page.tsx      # Job detail for bidding
│   └── about/
│       └── page.tsx              # Company about page
├── components/
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer
│   ├── FileUpload.tsx            # Drag-drop file upload
│   ├── PartViewer.tsx            # 3D part viewer (Three.js)
│   ├── BidCard.tsx               # Shop bid card component
│   ├── JobCard.tsx               # Job listing card
│   ├── PriceEstimate.tsx         # AI estimate display
│   └── MaterialSelector.tsx      # Material dropdown
├── data/
│   ├── mockBids.ts               # Mock bid data
│   └── mockJobs.ts               # Mock job data
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind customization
├── next.config.js                # Next.js config
├── postcss.config.js             # PostCSS setup
├── .env.example                  # Environment variables template
└── README.md                      # This file
```

## Installation & Setup

### 1. Clone the repository
```bash
cd axisbid
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key if needed
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for production
```bash
npm run build
npm start
```

## Page Routes

### Public Pages
- **/** - Landing page with hero, how it works, value props
- **/quote** - Upload STEP file and enter specifications
- **/quote/[id]** - View AI estimate and incoming shop bids
- **/about** - Company story and team information

### Shop Pages
- **/shop** - Dashboard with available jobs and bid management
- **/shop/job/[id]** - Full job details and bid submission form

### API
- **GET /api/quote** - API documentation
- **POST /api/quote** - Generate AI price estimate

## Key Components

### FileUpload
Drag-and-drop interface for STEP files with validation
- Accepts .step and .stp files up to 50MB
- Provides file size feedback
- Error handling for invalid files

### PartViewer
Three.js-based 3D visualization of uploaded parts
- Animated rotating view of placeholder part
- Displays extracted geometry metrics:
  - Bounding box dimensions (X, Y, Z)
  - Volume and surface area
  - Number of faces and edges

### BidCard
Displays machine shop bids with key information
- Shop name and rating (star display)
- Bid price and estimated delivery
- Completed jobs count
- Equipment capabilities
- Certifications

### PriceEstimate
Shows AI-generated price range and CTA
- Min/max price range with most likely estimate
- Visual price range indicator
- "Buy Now" button for instant purchase
- Information on incoming shop bids

### MaterialSelector
Organized dropdown with 10+ material options
- Grouped by category (Aluminum, Steel, Titanium, Plastic)
- Easy selection for specifications form

## Brand & Styling

### Color Scheme
- **Primary Dark Blue**: #1B3A5C (trust, professionalism)
- **Accent Blue**: #2E86C1 (secondary actions, highlights)
- **Accent Orange**: #E67E22 (CTAs, urgency)
- **Light Background**: #F4F6F8 (subtle contrast)
- **White**: Card backgrounds, base elements

### Typography
- Font Family: Inter (Google Fonts)
- Used throughout via Tailwind

### Design System
- Custom Tailwind utilities: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Shadow utilities: `.shadow-card`, `.gradient-brand`
- Responsive breakpoints: sm, md, lg

## API Integration Points

### Quote Estimation API
**Endpoint**: `POST /api/quote`

**Request**:
```typescript
{
  geometry: {
    boundingBox: { x: number, y: number, z: number },
    volume: number,
    surfaceArea: number,
    faces: number,
    edges: number
  },
  material: string,
  tolerance: string,
  quantity: number
}
```

**Response**:
```typescript
{
  quoteId: string,
  estimate: {
    minPrice: number,
    mostLikelyPrice: number,
    maxPrice: number,
    estimatedHours: number,
    materialCost: number,
    explanation: string
  },
  generatedAt: string,
  confidence: number
}
```

### Claude Integration (Ready for Production)
The `/api/quote` route includes:
- System prompt optimized for CNC machining estimation
- Placeholder for real Claude API calls
- Mock data generation for MVP
- Structured JSON response format

To enable real Claude integration:
1. Add ANTHROPIC_API_KEY to .env.local
2. Uncomment Claude API call in /api/quote/route.ts
3. Import Anthropic SDK

## Mock Data

### Mock Bids (data/mockBids.ts)
- 4 different machine shops
- Realistic ratings (4.6-4.9 stars)
- Varying prices ($385-$410)
- Different turnaround times (4-7 business days)
- Authentic certifications and equipment

### Mock Jobs (data/mockJobs.ts)
- 6 different job types
- Various materials and quantities
- Open, awarded, and completed statuses
- Realistic timelines and bid counts

## Development Notes

### STEP File Parser
The MVP uses mock geometry data when files are uploaded. For production:
1. Integrate occt-import-js with WASM binary
2. Parse actual STEP file geometry
3. Extract dimensions, volume, surface area
4. Count features (faces, edges, holes)

### 3D Viewer
Currently shows a placeholder machined bracket. In production:
1. Convert parsed STEP geometry to Three.js mesh
2. Auto-scale camera to fit part
3. Add interaction controls (zoom, rotate)
4. Display bounding box helper

### AI Quoting
Current implementation:
- Mock estimation based on geometry and material
- Realistic pricing calculations
- Ready for real Claude API integration

Production implementation:
1. Call Claude with geometry data
2. Include manufacturing context and constraints
3. Return structured JSON with price ranges
4. Cache estimates for identical files

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Static generation for landing, about pages
- Client-side rendering for interactive pages
- Image optimization via Next.js
- CSS minification via Tailwind
- JavaScript code splitting with App Router

## Future Enhancements

### Phase 2
- User authentication and accounts
- Order management and tracking
- Payment processing
- Real email notifications
- Chat between customers and shops

### Phase 3
- STEP file parser with real geometry extraction
- Real Claude API integration
- Machine learning model training on quotes
- Advanced filtering and shop discovery
- Customer reviews and ratings

### Phase 4
- Mobile app (React Native)
- CAD integration plugins
- Automated production scheduling
- Supply chain analytics
- Custom pricing rules by shop

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000 or use different port
npm run dev -- -p 3001
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Styling issues
```bash
# Rebuild Tailwind
npm run build
```

## Contributing

This is an MVP built by Claude Code. For production use:
1. Add authentication
2. Set up database (PostgreSQL recommended)
3. Implement proper error handling
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Add rate limiting to APIs

## License

Built for AxisBid. All rights reserved.

## Contact

For questions or support regarding this MVP, refer to the AxisBid team.

---

**Last Updated**: 2024
**Version**: 0.1.0 (MVP)
