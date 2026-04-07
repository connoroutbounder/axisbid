# AxisBid MVP - Complete Setup Guide

## Quick Start (2 minutes)

```bash
# 1. Navigate to project
cd axisbid

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

## Detailed Installation

### System Requirements
- Node.js 18+ 
- npm 9+ or yarn/pnpm
- 500MB disk space

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- Next.js 14 with React 18
- Tailwind CSS for styling
- Three.js for 3D visualization
- TypeScript for type safety
- Lucide React for icons
- Anthropic SDK (for future Claude integration)

### Step 2: Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_api_key_here  # Optional for MVP
```

### Step 3: Development Server
```bash
npm run dev
```

Navigate to: http://localhost:3000

### Step 4: Build for Production
```bash
npm run build
npm start
```

Production build available at: http://localhost:3000

## Project Features Overview

### Landing Page (/)
- **Hero Section**: Headline, subheadline, main CTA
- **How It Works**: 3-step process visualization
- **Value Props**: 4 key differentiators with icons
- **Social Proof**: Stats and customer testimonial
- **Footer**: Links and contact info

### Quote Upload (/quote)
- **File Upload**: Drag-and-drop STEP file upload
- **Form**: Material, finish, tolerance, quantity, deadline, notes
- **3D Preview**: Right-side preview of uploaded part
- **Validation**: File type and size checking
- **Submit**: Generate AI estimate and receive bids

### Quote Results (/quote/[id])
- **AI Estimate**: Price range with "Buy Now" CTA
- **Shop Bids**: Real-time incoming bids from shops
- **Bid Cards**: Full shop information and acceptance button
- **Job Summary**: Recap of specifications
- **Confidence Meter**: Estimate confidence level

### Shop Dashboard (/shop)
- **Dashboard Stats**: Available jobs, active bids, won jobs, earnings
- **Tabbed Interface**: Browse jobs, view active bids, won jobs, completed work
- **Job Cards**: Each job shows key details and bid count
- **Status Indicators**: Open, awarded, completed status badges

### Job Detail for Shops (/shop/job/[id])
- **3D Preview**: Full part visualization
- **Specs**: Material, quantity, tolerance, deadline
- **Customer Notes**: Context about their needs
- **Bid Form**: Price, delivery date, notes about capabilities
- **Bid Summary**: Current bids and price range

### About Page (/about)
- **The Problem**: Pain points in current quoting process
- **The Solution**: AxisBid's approach with 3 pillars
- **Team**: Founder bios and backgrounds
- **Why**: Company mission and values

## Component Documentation

### FileUpload
Location: `components/FileUpload.tsx`

Features:
- Drag-and-drop zone with visual feedback
- File type validation (.step, .stp only)
- Size limit checking (50MB)
- Loading state while processing
- Error messages for invalid files

Usage:
```tsx
<FileUpload 
  onFileSelect={handleFileSelect}
  isLoading={isLoading}
/>
```

### PartViewer
Location: `components/PartViewer.tsx`

Features:
- Three.js 3D visualization
- Animated rotating part preview
- Geometry data summary cards
- Auto-calculated bounding box display
- Real-time updates on file change

Usage:
```tsx
<PartViewer 
  fileName="part.step"
  geometry={mockGeometry}
/>
```

### BidCard
Location: `components/BidCard.tsx`

Features:
- Shop name and star rating
- Bid price display
- Delivery timeline
- Equipment and certifications
- Accept bid button

### JobCard
Location: `components/JobCard.tsx`

Features:
- Part name and material
- Quantity and deadline
- Status badges (Open, Awarded, Completed)
- Bid count or lowest bid
- Click handler for details

### PriceEstimate
Location: `components/PriceEstimate.tsx`

Features:
- Min/max price range visualization
- Most likely price highlight
- Savings vs industry average
- Shop bids notification
- Buy Now CTA button

### MaterialSelector
Location: `components/MaterialSelector.tsx`

Features:
- 10+ material options
- Grouped by category
- Semantic HTML select
- Easy form integration

### Navbar & Footer
- Responsive navigation
- Mobile menu toggle
- Brand consistency
- Social links

## API Reference

### Quote Estimation
**POST /api/quote**

Request geometry data, material, tolerance, quantity and get price estimate.

```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "geometry": {
      "boundingBox": {"x": 120, "y": 100, "z": 80},
      "volume": 384000,
      "surfaceArea": 40000,
      "faces": 24,
      "edges": 48
    },
    "material": "al6061",
    "tolerance": "Standard ±0.005\"",
    "quantity": 5
  }'
```

Response:
```json
{
  "quoteId": "quote_xxx",
  "estimate": {
    "minPrice": 340,
    "mostLikelyPrice": 400,
    "maxPrice": 480,
    "estimatedHours": 8,
    "materialCost": 140,
    "explanation": "..."
  },
  "generatedAt": "2024-12-07T...",
  "confidence": 0.87
}
```

## Mock Data

### Bids (data/mockBids.ts)
4 pre-configured machine shop bids with:
- Shop names and ratings
- Realistic price ranges
- Different delivery timeframes
- Equipment and certifications

### Jobs (data/mockJobs.ts)
6 sample jobs across all statuses:
- Open jobs awaiting bids
- Awarded jobs with selected shops
- Completed jobs for reference

Modify in `data/mockBids.ts` and `data/mockJobs.ts`

## Styling & Customization

### Tailwind Config
Location: `tailwind.config.ts`

Custom colors:
```typescript
colors: {
  brand: {
    'dark-blue': '#1B3A5C',
    'accent-blue': '#2E86C1',
    'orange': '#E67E22',
    'light-bg': '#F4F6F8',
  }
}
```

### Custom CSS Classes
Location: `app/globals.css`

- `.btn-primary` - Orange CTA buttons
- `.btn-secondary` - Outlined buttons
- `.btn-ghost` - Text-only buttons
- `.shadow-card` - Card shadow effect
- `.gradient-brand` - Brand color gradient
- `.container-responsive` - Max-width container

### Font
Inter font from Google Fonts, set up in `app/layout.tsx`

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### 3D viewer not loading
- Check browser console for errors
- Ensure JavaScript is enabled
- Try different browser (Chrome recommended)

### Tailwind classes not applying
```bash
# Rebuild Tailwind
npm run build
```

## Performance Tips

1. **Images**: Use Next.js Image component for optimization
2. **Components**: Lazy load heavy components with dynamic imports
3. **API**: Add request caching headers
4. **Database** (future): Use connection pooling
5. **Monitoring**: Add error tracking (Sentry, LogRocket)

## Next Steps

### For MVP Testing
1. Upload test STEP files
2. Walk through quote submission
3. View AI estimates
4. Check shop bid display
5. Test shop bidding flow

### For Production
1. Add authentication (NextAuth.js)
2. Set up PostgreSQL database
3. Implement real file storage (S3)
4. Add Stripe payment processing
5. Set up email notifications
6. Add analytics (Mixpanel, Amplitude)
7. Implement STEP file parsing
8. Connect real Claude API
9. Set up monitoring and logging

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Three.js Guide](https://threejs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check the README.md for overview
2. Review component documentation
3. Inspect browser console for errors
4. Check Network tab for API issues

## File Size Summary

Total project: ~50-80 MB (with node_modules)
Production build: ~2-3 MB

---

**Created**: 2024
**AxisBid MVP Setup v0.1**
