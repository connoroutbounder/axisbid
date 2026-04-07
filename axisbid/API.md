# AxisBid API Documentation

## Overview

The AxisBid API provides endpoints for quote estimation, part analysis, and bid management. Built with Next.js App Router and TypeScript for type safety and production readiness.

## Base URL

Development: `http://localhost:3000`
Production: `https://axisbid.com`

## Authentication

Currently, the MVP does not require authentication. Production version will implement:
- JWT tokens
- OAuth 2.0 via Auth0 or similar
- API key pairs for shop integrations

## Endpoints

### Quote Estimation

#### Generate Price Estimate
**POST** `/api/quote`

Generate an AI-powered price estimate for a CNC machined part based on geometry analysis and specifications.

**Request Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "geometry": {
    "boundingBox": {
      "x": 120.5,
      "y": 100.25,
      "z": 80.75
    },
    "volume": 384000,
    "surfaceArea": 40000,
    "faces": 24,
    "edges": 48
  },
  "material": "al6061",
  "tolerance": "Standard ±0.005\"",
  "quantity": 5
}
```

**Field Descriptions**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| geometry.boundingBox | Object | Yes | Part dimensions in millimeters |
| geometry.boundingBox.x | Number | Yes | Width in mm |
| geometry.boundingBox.y | Number | Yes | Height in mm |
| geometry.boundingBox.z | Number | Yes | Depth in mm |
| geometry.volume | Number | Yes | Part volume in cubic millimeters |
| geometry.surfaceArea | Number | Yes | Surface area in square millimeters |
| geometry.faces | Number | Yes | Number of faces/surfaces |
| geometry.edges | Number | Yes | Number of edges |
| material | String | Yes | Material code (see Material Codes below) |
| tolerance | String | Yes | Tolerance class (see Tolerance Codes below) |
| quantity | Number | Yes | Quantity to be machined (1+) |

**Material Codes**
```
al6061       - Aluminum 6061 (standard)
al7075       - Aluminum 7075 (high strength)
ss304        - Stainless Steel 304
ss316        - Stainless Steel 316
mild         - Mild Steel
tool         - Tool Steel
ti           - Titanium Grade 5
delrin       - Delrin (Acetal)
peek         - PEEK (Polyetheretherketone)
nylon        - Nylon
```

**Tolerance Codes**
```
Standard ±0.005"        - General tolerance
Precision ±0.001"       - Tight tolerance
Ultra-Precision ±0.0005" - Very tight tolerance
```

**Response (200 OK)**
```json
{
  "quoteId": "quote_1701875234",
  "estimate": {
    "minPrice": 340,
    "mostLikelyPrice": 400,
    "maxPrice": 480,
    "estimatedHours": 8,
    "materialCost": 140,
    "explanation": "Estimate based on al6061 material, 24 faces, Standard ±0.005\" tolerance, and quantity of 5. Pricing reflects local shop rates without middleman markup."
  },
  "generatedAt": "2024-12-07T14:23:54.000Z",
  "confidence": 0.87
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| quoteId | String | Unique identifier for this estimate |
| estimate.minPrice | Number | Minimum expected price in USD |
| estimate.mostLikelyPrice | Number | Most probable price in USD |
| estimate.maxPrice | Number | Maximum expected price in USD |
| estimate.estimatedHours | Number | Estimated machine time in hours |
| estimate.materialCost | Number | Raw material cost in USD |
| estimate.explanation | String | Human-readable explanation of pricing |
| generatedAt | String | ISO 8601 timestamp of generation |
| confidence | Number | Confidence score 0.0-1.0 (0.87 = 87% confident) |

**Error Response (400 Bad Request)**
```json
{
  "error": "Missing required fields",
  "details": "geometry.boundingBox.x is required"
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "error": "Failed to generate quote",
  "message": "An unexpected error occurred"
}
```

**Example Request (cURL)**
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

**Example Request (JavaScript)**
```javascript
const estimate = await fetch('/api/quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    geometry: {
      boundingBox: { x: 120, y: 100, z: 80 },
      volume: 384000,
      surfaceArea: 40000,
      faces: 24,
      edges: 48
    },
    material: 'al6061',
    tolerance: 'Standard ±0.005"',
    quantity: 5
  })
}).then(r => r.json());

console.log(`Quote: $${estimate.estimate.mostLikelyPrice}`);
```

**Rate Limiting**

Currently unlimited for MVP. Production will implement:
- 100 requests/minute per IP
- 1000 requests/day per user

**Cache Headers**

Responses include:
```
Cache-Control: no-store (always fresh)
X-Request-ID: unique-request-id
```

---

#### Get API Documentation
**GET** `/api/quote`

Returns documentation about the quote estimation endpoint.

**Response**
```json
{
  "message": "CNC Quote API",
  "endpoint": "/api/quote",
  "method": "POST",
  "description": "Generate an AI-powered price estimate for CNC machined parts",
  "requestBody": { ... },
  "responseExample": { ... }
}
```

---

## Future Endpoints

### Jobs API
```
GET /api/jobs                 - List all open jobs
POST /api/jobs               - Create new job (engineer)
GET /api/jobs/[id]          - Get job details
PUT /api/jobs/[id]          - Update job (engineer)
```

### Bids API
```
GET /api/jobs/[id]/bids      - Get bids for a job
POST /api/jobs/[id]/bids     - Submit a bid (shop)
PUT /api/bids/[id]           - Update bid (shop)
DELETE /api/bids/[id]        - Withdraw bid (shop)
```

### Quotes API
```
GET /api/quotes/[id]         - Get quote details
POST /api/quotes/[id]/accept - Accept a quote
```

### Users API
```
GET /api/users/me            - Current user profile
PUT /api/users/me            - Update profile
POST /api/users/verify-email - Verify email
```

### Shops API
```
GET /api/shops               - List all shops
GET /api/shops/[id]         - Shop profile & reviews
POST /api/shops/verify      - Shop verification
```

---

## Error Handling

All API responses follow this error format:

```json
{
  "error": "Error code or title",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": "Additional context if available"
}
```

**Common Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 429 | Too many requests (rate limited) |
| 500 | Server error |

---

## Data Validation

### Geometry Validation

- All measurements must be positive numbers
- Volume = length × width × height (in mm)
- Surface area calculated from geometry
- Bounding box represents minimum space needed

### Material Validation

Only these materials are accepted:
```
al6061, al7075, ss304, ss316, mild, tool, ti, delrin, peek, nylon
```

### Quantity Validation

- Must be integer >= 1
- Maximum: 10,000 units per order

### Tolerance Validation

Only these tolerances accepted:
```
Standard ±0.005"
Precision ±0.001"
Ultra-Precision ±0.0005"
```

---

## Real Claude API Integration

The quote endpoint is structured to integrate with Claude API:

**Current (MVP)**
- Mock estimation based on geometry and material
- Deterministic pricing calculation
- Fast response (<100ms)

**Production Integration**

```typescript
// Would be implemented in /api/quote/route.ts
const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  system: CNC_QUOTING_SYSTEM_PROMPT,
  messages: [
    {
      role: "user",
      content: `Estimate a CNC quote for:
        - Material: ${material}
        - Volume: ${geometry.volume}mm³
        - Surface area: ${geometry.surfaceArea}mm²
        - Complexity: ${geometry.faces} faces
        - Tolerance: ${tolerance}
        - Quantity: ${quantity}`
    }
  ]
});
```

**System Prompt** (in `/api/quote/route.ts`)
```
You are an expert CNC machining estimator with 20+ years of experience...
[Full prompt included in route.ts]
```

To enable real Claude integration:
1. Add `ANTHROPIC_API_KEY` to `.env.local`
2. Install `@anthropic-ai/sdk`: `npm install @anthropic-ai/sdk`
3. Uncomment Claude call in `/api/quote/route.ts`
4. Implement response parsing

---

## WebSocket/Real-time (Future)

For real-time bid notifications:

```typescript
// Future WebSocket endpoint
ws://localhost:3000/ws/jobs/[id]

// Client subscribes to bid updates
const ws = new WebSocket('ws://localhost:3000/ws/jobs/quote_123');
ws.onmessage = (event) => {
  const bid = JSON.parse(event.data);
  console.log(`New bid: $${bid.price} from ${bid.shopName}`);
};
```

---

## Pagination

For endpoints returning lists:

```
GET /api/jobs?page=1&limit=20

Response includes:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasMore": true,
    "nextPage": 2
  }
}
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const quote = await axios.post('/api/quote', {
  geometry: { ... },
  material: 'al6061',
  tolerance: 'Standard ±0.005"',
  quantity: 5
});
```

### Python (Future)
```python
import axisbid

quote = axisbid.estimate(
    geometry=...,
    material='al6061',
    tolerance='Standard ±0.005"',
    quantity=5
)
```

---

## Rate Limiting (Production)

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/quote | 100 | per minute |
| /api/jobs | 50 | per minute |
| /api/bids | 50 | per minute |

Response headers indicate limits:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701875400
```

---

## Testing the API

### Using Postman
1. Create new POST request
2. Set URL: `http://localhost:3000/api/quote`
3. Set body (JSON): Paste example from above
4. Click Send

### Using curl
See examples above in each endpoint section

### Using REST Client VS Code Extension
Create `test.rest` file:
```
POST http://localhost:3000/api/quote
Content-Type: application/json

{
  "geometry": {...},
  "material": "al6061",
  ...
}
```

---

## Webhooks (Future)

Register webhooks for real-time events:

```bash
POST /api/webhooks

{
  "url": "https://myapp.com/webhooks/bids",
  "events": ["bid.submitted", "bid.accepted", "job.completed"]
}
```

Events sent as POST to registered URL:
```json
{
  "event": "bid.submitted",
  "data": {
    "jobId": "job_123",
    "bidId": "bid_456",
    "shopName": "Precision Works",
    "price": 395,
    "timestamp": "2024-12-07T14:23:54Z"
  }
}
```

---

## Version History

**v0.1.0** (Current - MVP)
- Quote estimation endpoint
- Mock data and pricing
- Documentation endpoint

**v1.0.0** (Planned)
- Authentication
- Full CRUD for jobs and bids
- User accounts
- Real Claude API integration

**v2.0.0** (Roadmap)
- WebSocket real-time updates
- Webhooks
- Analytics endpoints
- Advanced filtering

---

**Last Updated**: December 2024
**API Version**: 0.1.0-mvp
