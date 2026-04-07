# AxisBid Platform — Claude Code Project Guide

## What is this?
AxisBid is a CNC machining bid-to-quote marketplace. Engineers upload STEP files, get AI-powered instant price estimates via Claude Opus, then vetted local machine shops bid competitively. AxisBid takes 20%.

## Architecture
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js (credentials + Google OAuth)
- **Payments**: Stripe Connect (marketplace model, 80/20 split)
- **File Storage**: AWS S3 (STEP files + rendered views)
- **AI Quoting**: Anthropic Claude Opus API (lib/ai-quote.ts is the core IP)
- **STEP Parsing**: occt-import-js (browser) + CadQuery Python fallback (server)
- **Email**: Resend + React Email
- **Styling**: Tailwind CSS
- **State**: Zustand for client state

## Key Directories
```
app/                    # Next.js App Router pages + API routes
  (auth)/               # Login, register pages
  (dashboard)/          # Protected dashboard pages (customer, shop, admin)
  api/                  # 18 REST API endpoints
components/
  ui/                   # Reusable UI primitives (button, input, card, modal, etc.)
  layout/               # Navbar, footer, sidebar, dashboard layout
  jobs/                 # Job-related components (upload, viewer, specs, timeline)
  bids/                 # Bid card, bid form
  shops/                # Shop card, machine list, certifications
lib/
  ai-quote.ts           # ★ CORE IP — Claude AI quoting engine with CNC-specific system prompt
  auth.ts               # NextAuth config
  prisma.ts             # Database client
  s3.ts                 # File storage
  stripe.ts             # Payment processing
  step-parser.ts        # STEP file geometry extraction
  notifications.ts      # Email system
  types.ts              # Shared TypeScript types
  utils.ts              # Helpers (cn, formatPrice, formatDate)
prisma/
  schema.prisma         # 9 models: User, Shop, Machine, Job, Bid, Review, etc.
  seed.ts               # Development seed data
scripts/
  parse_step.py         # Python CadQuery STEP parser (server fallback)
```

## Database Models
User → Shop (1:1 for shop owners), User → Jobs (1:many), Job → Bids (1:many), Bid → Shop (many:1), Job → Review (1:1)

## Job Lifecycle
PENDING → QUOTING → BIDDING → AWARDED → IN_PRODUCTION → SHIPPED → DELIVERED → COMPLETED

## API Endpoints
- `POST /api/upload` — Upload STEP file to S3, trigger parsing
- `POST /api/jobs` — Create job from parsed file + specs
- `POST /api/jobs/[id]/ai-quote` — Generate Claude AI estimate
- `POST /api/jobs/[id]/bids` — Shop submits bid
- `POST /api/jobs/[id]/accept-bid` — Customer accepts bid, triggers payment
- `POST /api/payments/webhook` — Stripe webhook handler
- `POST /api/reviews` — Submit post-delivery review

## Environment Variables
Copy `.env.example` to `.env` and fill in: DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY, AWS creds, STRIPE keys, RESEND_API_KEY

## Development
```bash
docker-compose up -d          # Start PostgreSQL
npm install                   # Install deps
npx prisma db push            # Create tables
npx prisma db seed            # Seed sample data
npm run dev                   # Start dev server at localhost:3000
```

## Deployment
Optimized for Vercel (frontend) + Supabase or Railway (PostgreSQL). Docker support included for self-hosted.

## Key Design Decisions
1. **Bid model over instant quote**: Shops set their own prices based on real capacity. More accurate than algorithmic pricing.
2. **AI estimates as anchors**: Claude provides a price range in seconds as a reference point. Shops bid around it. Over time, bid data trains the AI to be more accurate.
3. **Local-first network**: Starting in CT manufacturing corridor. Proximity = faster delivery + ability to personally vet shops.
4. **Transparent marketplace**: Customers see who's bidding. Shops control their pricing. 20% take rate is honest and sustainable.
