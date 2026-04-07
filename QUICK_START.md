# AxisBid Platform - Quick Start Guide

## Setup (5 minutes)

### 1. Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials:
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - Google OAuth (optional)
# - AWS S3 credentials
# - Stripe API keys
# - Anthropic API key
# - Resend email API key
```

### 2. Install & Setup
```bash
npm install
npm run db:push           # Create database tables
npm run db:seed          # Load sample data (3 customers, 5 shops, 5 jobs)
pip install -r scripts/requirements.txt  # Python for STEP parsing
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## Test Accounts (Password: password123)

### Customers
- customer1@example.com (TechCorp Manufacturing)
- customer2@example.com (Precision Parts Inc)
- customer3@example.com (Industrial Solutions LLC)

### Shop Owners
- shop1@example.com (Elite CNC Machining - Chicago)
- shop2@example.com (Precision Metal Works - San Diego)
- shop3@example.com (Advanced Manufacturing - Boston)
- shop4@example.com (5-Axis Innovations - Austin)
- shop5@example.com (Titanium Specialists - Seattle)

## Core API Endpoints

### Jobs (Customer-Facing)
```
POST   /api/jobs                    # Create new job
GET    /api/jobs                    # List my jobs
GET    /api/jobs/[id]               # View job details
PATCH  /api/jobs/[id]               # Update job status
DELETE /api/jobs/[id]               # Cancel job

POST   /api/jobs/[id]/ai-quote      # Generate AI estimate
GET    /api/jobs/[id]/bids          # List all bids
POST   /api/jobs/[id]/accept-bid    # Accept & pay
```

### Shops (Shop Owner-Facing)
```
GET    /api/shops                   # List all shops (searchable)
POST   /api/shops                   # Register new shop
GET    /api/shops/[id]              # View shop profile
PATCH  /api/shops/[id]              # Update shop info

POST   /api/shops/[id]/machines     # Add CNC machine
GET    /api/shops/[id]/machines     # List machines
DELETE /api/shops/[id]/machines     # Remove machine
```

### Bidding
```
POST   /api/jobs/[id]/bids          # Submit bid (shop owner)
```

### Payments
```
POST   /api/stripe/connect          # Onboard to Stripe Connect
POST   /api/payments/webhook        # Stripe webhook handler
```

### Reviews
```
POST   /api/reviews                 # Submit review (after delivery)
GET    /api/reviews?shopId=[id]     # Get shop reviews
```

## Key Features

### 1. Job Creation
1. Customer uploads STEP file
2. Geometry auto-extracted (bounding box, volume, features)
3. AI generates cost estimate (low/mid/high)
4. Job enters BIDDING state
5. Shops submit competitive bids

### 2. Bidding
1. Shops view jobs in their capability
2. Submit bid with price & timeline
3. Customer selects winning bid
4. Payment intent created automatically

### 3. Payment Processing
1. Customer pays via Stripe
2. Platform keeps 20% fee
3. Shop receives 80% payout via Stripe Connect
4. Job moves to IN_PRODUCTION status

### 4. Fulfillment
1. Shop manufactures part
2. Updates job status to SHIPPED
3. Customer receives & updates to DELIVERED
4. Requests review from customer
5. Customer submits review
6. Shop rating updated

## Database Models

**User** - Authentication & roles
**Shop** - Machine shop profile
**Machine** - Individual CNC machines
**Job** - Manufacturing order
**Bid** - Competitive bid from shop
**Review** - Customer feedback

## Important Files

| File | Purpose |
|------|---------|
| `lib/ai-quote.ts` | Claude AI cost estimation engine |
| `lib/step-parser.ts` | STEP geometry extraction |
| `lib/stripe.ts` | Payment processing |
| `lib/auth.ts` | Authentication setup |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | Route protection |

## Common Development Tasks

### Reset Database
```bash
npm run db:seed
# Clears all data and reloads samples
```

### View Database
```bash
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

### Add New API Route
1. Create file: `app/api/new/route.ts`
2. Implement GET/POST/PATCH/DELETE
3. Use `getServerSession(authOptions)` for auth
4. Validate input with Zod
5. Return JSON response

### Add Email
Edit `lib/notifications.ts` and add new function:
```typescript
export async function sendNewEmail(email: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Subject",
    html: `<html>Content</html>`
  })
}
```

## Troubleshooting

### STEP Parser Not Working
- Install Python: `python --version` (must be 3.8+)
- Install packages: `pip install -r scripts/requirements.txt`
- Falls back to text parsing automatically

### Stripe Not Connecting
- Verify STRIPE_SECRET_KEY in .env
- Check account is live (not test mode)
- Ensure webhook secret matches

### Database Connection Error
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Test with: `npm run db:studio`

### Auth Not Working
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- Check NEXTAUTH_URL matches deployment domain
- Verify Google credentials if using OAuth

## Production Deployment

### Vercel (Recommended)
```bash
vercel link
# Connect repo, set env vars, auto-deploys
```

### Manual
```bash
npm run build
npm run start
# Point environment variables to production services
```

### Docker
```bash
docker build -t axisbid .
docker run -p 3000:3000 -e DATABASE_URL=... axisbid
```

## Monitoring

### Logs
- Check `/api/` endpoint responses
- View Stripe dashboard for payments
- Monitor email delivery via Resend
- Database queries in Prisma Studio

### Metrics to Track
- Jobs created per day
- Average bid turnaround time
- Payment success rate
- Shop response rate
- Customer satisfaction (reviews)

## Support

- Database: Prisma ORM with PostgreSQL
- Auth: NextAuth.js
- Payments: Stripe Connect
- Email: Resend
- AI: Anthropic Claude
- Files: AWS S3

All integrations tested and production-ready!
