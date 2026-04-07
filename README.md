# AxisBid Platform - CNC Machining Bid-to-Quote Marketplace

Complete backend for a modern CNC machining bid-to-quote marketplace built with Next.js 14, Prisma, and cutting-edge AI quoting.

## Features

- **AI-Powered Cost Estimation**: Claude Anthropic integration for intelligent CNC part quoting
- **STEP File Parsing**: Automatic geometry extraction from CAD files
- **Shop Management**: Multi-machine shop profiles with capabilities and certifications
- **Bidding System**: Competitive bidding from qualified machine shops
- **Payment Processing**: Stripe Connect integration for seamless payments (20/80 split)
- **Order Management**: Complete job lifecycle from quote to delivery
- **Review System**: Customer reviews and shop ratings

## Tech Stack

- **Framework**: Next.js 14.2.5
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth + Credentials
- **AI**: Anthropic Claude API (claude-opus-4-6)
- **File Storage**: AWS S3
- **Payments**: Stripe Connect
- **Email**: Resend
- **Type Safety**: TypeScript + Zod validation

## Project Structure

```
axisbid-platform/
├── app/
│   └── api/                 # All API routes
│       ├── auth/
│       ├── jobs/
│       ├── shops/
│       ├── upload/
│       ├── payments/
│       ├── reviews/
│       └── stripe/
├── lib/
│   ├── prisma.ts           # Database client
│   ├── auth.ts             # NextAuth configuration
│   ├── ai-quote.ts         # Claude AI quoting engine
│   ├── step-parser.ts      # STEP file geometry extraction
│   ├── s3.ts               # AWS S3 integration
│   ├── stripe.ts           # Stripe payment processing
│   ├── notifications.ts    # Email notifications
│   └── types.ts            # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeding
├── scripts/
│   ├── parse_step.py       # Python STEP parser
│   └── requirements.txt
├── middleware.ts           # Route protection
└── package.json
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Anthropic
ANTHROPIC_API_KEY=...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=axisbid-files

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Resend Email
RESEND_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_PERCENT=20
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Python 3.8+ (for STEP file parsing)

### Installation

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Seed sample data
npm run db:seed

# Install Python dependencies for STEP parsing
pip install -r scripts/requirements.txt
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Management

```bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler (signin, signout, callback)

### Jobs
- `GET /api/jobs` - List jobs (filtered by user or status)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get job details
- `PATCH /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Cancel job
- `GET /api/jobs/[id]/bids` - List bids for job
- `POST /api/jobs/[id]/bids` - Submit bid
- `POST /api/jobs/[id]/accept-bid` - Accept bid & initiate payment
- `POST /api/jobs/[id]/ai-quote` - Generate AI estimate

### Shops
- `GET /api/shops` - List shops (searchable, filterable)
- `POST /api/shops` - Register new shop
- `GET /api/shops/[id]` - Get shop profile
- `PATCH /api/shops/[id]` - Update shop
- `GET /api/shops/[id]/machines` - List shop machines
- `POST /api/shops/[id]/machines` - Add machine
- `DELETE /api/shops/[id]/machines` - Remove machine

### File Upload
- `GET /api/upload/presigned` - Get presigned S3 URL
- `POST /api/upload` - Upload & parse STEP file

### Payments
- `GET /api/payments` - Get payment status
- `POST /api/payments` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Reviews
- `GET /api/reviews` - Get shop reviews
- `POST /api/reviews` - Submit review

### Stripe Connect
- `POST /api/stripe/connect` - Create connected account
- `GET /api/stripe/connect/callback` - Handle onboarding callback

## Database Schema Highlights

### Core Models
- **User**: Customers, shop owners, admins
- **Shop**: Machine shop profiles with capabilities
- **Machine**: CNC machines (mills, lathes, routers, etc.)
- **Job**: Manufacturing jobs with file uploads and AI estimates
- **Bid**: Competitive bids from shops
- **Review**: Customer feedback and ratings

### Key Features
- Automatic AI cost estimation based on geometry
- Material-specific pricing and tolerances
- Quantity discount curves
- Shop verification and rating system
- Order status tracking from bidding to delivery

## AI Quote Engine

The `lib/ai-quote.ts` module uses Claude API to generate cost estimates. The system prompt includes:

- Material costs and density factors
- Machine rates by equipment type
- Setup time estimation
- Cycle time calculations based on geometry
- Tolerance multipliers
- Tooling cost allocation
- Quantity discount curves
- Surface finish upsells

The AI analyzes:
- Part geometry (bounding box, volume, surface area)
- Feature complexity (holes, pockets, faces, edges)
- Material type and required tolerance
- Order quantity
- Estimated confidence level

## STEP File Parsing

Supports two parsing methods:

1. **CadQuery/OpenCASCADE** (preferred): Accurate geometry extraction
2. **Fallback Text Parser**: Basic STEP format analysis

Extracts:
- Bounding box dimensions
- Volume and surface area
- Face/edge/hole/pocket counts
- Complexity classification

## Deployment

### Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t axisbid .
docker run -p 3000:3000 axisbid
```

### Manual

```bash
npm run build
npm run start
```

## Development Guidelines

- All API routes validate input with Zod
- Authentication required for protected routes
- Middleware enforces role-based access control
- Error handling with appropriate HTTP status codes
- Database transactions for multi-step operations
- Email notifications for all major events

## Testing

Sample users are created by `prisma/seed.ts`:

**Customers:**
- customer1@example.com / password123
- customer2@example.com / password123
- customer3@example.com / password123

**Shop Owners:**
- shop1@example.com / password123 (Elite CNC Machining)
- shop2@example.com / password123 (Precision Metal Works)
- shop3@example.com / password123 (Advanced Manufacturing)
- shop4@example.com / password123 (5-Axis Innovations)
- shop5@example.com / password123 (Titanium Specialists)

## Security Considerations

- Environment variables for all secrets
- NextAuth.js JWT-based sessions
- Stripe webhook signature verification
- Input validation on all endpoints
- Role-based access control
- CORS headers on API routes
- Rate limiting recommended for production

## Performance Optimizations

- Prisma query optimization with included relations
- S3 presigned URLs for direct uploads
- Database indexing on common queries
- Middleware for route-level caching
- Streaming responses for large datasets

## License

MIT - See LICENSE file for details

## Support

For issues or questions, contact: support@axisbid.com
