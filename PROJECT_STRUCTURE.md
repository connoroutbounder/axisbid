# AxisBid Frontend - Next.js 14 Project Structure

## Overview
Complete production-ready Next.js 14 frontend for AxisBid, a CNC machining bid-to-quote marketplace.

## Directory Structure

```
axisbid-platform/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind directives
│   ├── layout.tsx               # Root layout with metadata and providers
│   ├── page.tsx                 # Landing page (/)
│   ├── (auth)/                  # Auth routes layout
│   │   ├── layout.tsx           # Centered auth layout
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Registration with role selector
│   └── (dashboard)/             # Protected dashboard routes
│       ├── dashboard/page.tsx       # Customer dashboard
│       ├── quote/new/page.tsx       # Upload & quote form (3-step stepper)
│       ├── jobs/[id]/page.tsx       # Job detail & bid view (customer)
│       ├── shop/
│       │   ├── page.tsx             # Shop dashboard with tabs
│       │   └── register/page.tsx    # Multi-step shop registration
│       └── admin/page.tsx           # Admin dashboard
│   └── shops/[id]/page.tsx      # Public shop profile page
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button with variants (primary, secondary, outline, ghost, danger)
│   │   ├── input.tsx            # Styled input with label, error, helper text
│   │   ├── select.tsx           # Select dropdown
│   │   ├── badge.tsx            # Status badges (color-coded)
│   │   ├── card.tsx             # Card container
│   │   ├── modal.tsx            # Modal/dialog
│   │   ├── tabs.tsx             # Tab navigation
│   │   ├── stepper.tsx          # Multi-step form stepper
│   │   ├── star-rating.tsx      # Star rating display (1-5)
│   │   ├── stat-card.tsx        # Dashboard stat card
│   │   ├── alert.tsx            # Alert messages
│   │   └── loading-spinner.tsx  # Loading indicator
│   ├── layout/                  # Layout components
│   │   ├── navbar.tsx           # Responsive navbar with auth state
│   │   ├── footer.tsx           # Footer with links
│   │   ├── sidebar.tsx          # Collapsible dashboard sidebar
│   │   └── dashboard-layout.tsx # Dashboard wrapper with sidebar
│   ├── jobs/                    # Job/quote components
│   │   ├── file-upload.tsx      # Drag-drop STEP file upload
│   │   ├── part-specs-form.tsx  # Material, finish, tolerance, qty form
│   │   ├── geometry-card.tsx    # Parsed CAD geometry display
│   │   ├── price-estimate.tsx   # AI estimate with range visualization
│   │   ├── status-timeline.tsx  # Horizontal job lifecycle timeline
│   │   └── part-viewer.tsx      # Three.js 3D part viewer
│   ├── bids/                    # Bidding components
│   │   ├── bid-card.tsx         # Shop bid display card
│   │   └── bid-form.tsx         # Shop bid submission form
│   └── shops/                   # Shop components
│       ├── shop-card.tsx        # Shop profile preview
│       ├── machine-list.tsx     # Machines grid with specs
│       └── certification-badges.tsx # Certification display
├── lib/
│   └── utils.ts                # Utility functions (formatPrice, formatDate, getInitials, etc.)
├── next.config.js              # Next.js config with S3 image remotePatterns
├── postcss.config.js           # PostCSS with Tailwind & Autoprefixer
├── tailwind.config.ts          # Tailwind config with brand colors
├── tsconfig.json               # TypeScript strict mode config
└── .gitignore                  # Git ignore rules
```

## Key Features

### Landing Page (/)
- Hero section with CTA
- "How It Works" section (3 steps)
- "Why AxisBid" value props
- Stats banner
- Materials section
- CTA banner
- Full responsive footer

### Authentication
- Login page with email/password + Google OAuth
- Registration with role selector (Customer/Shop)
- Centered card layout for auth pages

### Customer Features
- **Dashboard**: Stats cards, recent jobs table, quick upload button
- **Upload Page**: 3-step stepper
  1. STEP file drag-drop upload (max 100MB)
  2. Part specs (material, finish, tolerance, quantity, date, notes)
  3. Review & submit
- **Job Detail**: Status timeline, 3D viewer, geometry data, AI estimate, bids list
- **Shop Search**: Browse and view shop profiles

### Shop Features
- **Registration**: Multi-step form with business info, machines, certifications
- **Dashboard**: Stats, 4 tabs (Available Jobs, My Bids, Active Jobs, Completed)
- **Available Jobs**: Browse and place bids
- **My Bids**: View bid status (pending/accepted/rejected)
- **Active Jobs**: Production status tracking
- **Completed Jobs**: Earnings history

### Admin Features
- Platform stats (GMV, revenue, active jobs, registered shops)
- Recent jobs list
- Shop verification queue with approve/reject

### Public Shop Profiles
- Shop info, certifications, machines, materials
- Customer reviews and ratings
- On-time delivery rate
- Past job statistics

## Component Highlights

### UI Components
- **Button**: 5 variants (primary, secondary, outline, ghost, danger) + sizes + loading state
- **Input**: Label, error, helper text, icon support
- **Select**: Grouped dropdowns with label
- **Badge**: Status colors matching JobStatus enum
- **Stepper**: Visual progress indicator with step numbers
- **StarRating**: Interactive 1-5 star display

### Features
- Fully responsive (mobile-first)
- Professional dark navy + orange brand colors
- Proper semantic HTML
- Loading states and error boundaries
- TypeScript strict mode
- Tailwind CSS only (no CSS modules)
- Lucide React icons throughout
- Sonner toast notifications integration
- date-fns for date formatting

## Styling

- **Colors**: Brand navy (#1B3A5C), bright blue (#2E86C1), orange (#E67E22), green (#27AE60), light BG (#F4F6F8), dark (#0D1B2A)
- **Font**: Inter from Google Fonts
- **CSS**: Tailwind CSS with custom brand color palette
- **Icons**: Lucide React library

## API Integration Notes

All pages have been built with placeholder/mock data. The following API endpoints will need to be connected:

- `POST /api/jobs` - Submit new job
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs` - List user jobs
- `POST /api/bids` - Submit bid
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/shops/:id` - Shop profile
- `POST /api/shops/register` - Shop registration
- Authentication state from `next-auth` session

## Next Steps

1. Install dependencies:
   ```bash
   npm install react-dropzone @react-three/fiber @react-three/drei @react-three/postprocessing next-auth sonner date-fns lucide-react clsx tailwind-merge
   ```

2. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   ```

3. Connect backend API endpoints
4. Integrate authentication with next-auth
5. Wire up file upload to S3
6. Implement WebSocket for real-time updates
7. Add error boundaries and loading states

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari 12+
- Android Chrome 80+

## Performance Optimizations

- Server components by default, client components where needed
- Image optimization via Next.js
- Code splitting at route boundaries
- CSS-in-JS optimization via Tailwind
- Responsive lazy loading for 3D viewer
