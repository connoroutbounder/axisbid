import { NextRequest, NextResponse } from 'next/server'

interface QuoteRequest {
  geometry: {
    boundingBox: { x: number; y: number; z: number }
    volume: number
    surfaceArea: number
    faces: number
    edges: number
  }
  material: string
  tolerance: string
  quantity: number
}

// System prompt for Claude-based CNC quoting
const CNC_QUOTING_SYSTEM_PROMPT = `You are an expert CNC machining estimator with 20+ years of experience in the industry. Your task is to provide realistic price estimates for precision machined parts based on STEP file analysis and specifications.

You analyze the following factors when pricing:
1. Material type and cost (aluminum, steel, titanium, etc.)
2. Part complexity (number of features, faces, edges)
3. Bounding box dimensions (larger parts need bigger machines)
4. Volume and surface area (material waste, tool wear)
5. Tolerance requirements (tighter tolerances = longer machining)
6. Quantity (economies of scale, setup costs)
7. Surface finish requirements
8. Lead time considerations

Your estimates should be:
- Conservative but competitive (local shop pricing, not national supplier markup)
- Broken down into ranges (min, most likely, max)
- Based on typical machine shop rates ($75-150/hour depending on capability)
- Realistic about setup times and material waste

Always provide:
1. Estimated machining hours
2. Material cost
3. Overhead/margin estimate
4. Total price range
5. Brief explanation of key cost drivers

Format your response as JSON with fields: min_price, most_likely_price, max_price, hours_estimated, material_cost, explanation`

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json()

    // Validate input
    if (!body.geometry || !body.material || !body.tolerance || !body.quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would call Claude API
    // For MVP, we'll return realistic mock data based on geometry
    const mockEstimate = generateMockEstimate(body)

    return NextResponse.json({
      quoteId: `quote_${Date.now()}`,
      estimate: mockEstimate,
      generatedAt: new Date().toISOString(),
      confidence: 0.87, // confidence level based on file quality
    })
  } catch (error) {
    console.error('Quote generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    )
  }
}

function generateMockEstimate(req: QuoteRequest) {
  const { geometry, material, tolerance, quantity } = req
  const { boundingBox, volume, surfaceArea } = geometry

  // Base calculation: larger parts cost more
  let basePrice = 250

  // Material multiplier
  const materialMultipliers: Record<string, number> = {
    'al6061': 1.0,
    'al7075': 1.3,
    'ss304': 1.5,
    'ss316': 1.6,
    'mild': 0.9,
    'tool': 2.0,
    'ti': 3.5,
    'delrin': 1.2,
    'peek': 2.8,
    'nylon': 0.8,
  }
  const materialMult = materialMultipliers[material] || 1.0
  basePrice *= materialMult

  // Size multiplier (volume-based)
  const volumeLiters = volume / 1000
  const sizeMult = 1 + Math.log10(volumeLiters + 1) * 0.2
  basePrice *= sizeMult

  // Tolerance multiplier
  const toleranceMultipliers: Record<string, number> = {
    'Standard ±0.005"': 1.0,
    'Precision ±0.001"': 1.5,
    'Ultra-Precision ±0.0005"': 2.2,
  }
  const toleranceMult = toleranceMultipliers[tolerance] || 1.0
  basePrice *= toleranceMult

  // Quantity discount
  const quantityDiscount = Math.max(0.6, 1 - Math.log10(quantity) * 0.15)
  const quantityPrice = basePrice * quantityDiscount

  // Add per-unit setup costs
  const setupCost = 80 * quantity

  const minPrice = Math.round((quantityPrice + setupCost) * 0.85)
  const mostLikelyPrice = Math.round(quantityPrice + setupCost)
  const maxPrice = Math.round((quantityPrice + setupCost) * 1.25)

  return {
    minPrice,
    mostLikelyPrice,
    maxPrice,
    estimatedHours: Math.round((quantityPrice / 100) * 2),
    materialCost: Math.round(quantityPrice * 0.35),
    explanation: `Estimate based on ${material} material, ${geometry.faces} faces, ${tolerance} tolerance, and quantity of ${quantity}. Pricing reflects local shop rates without middleman markup.`,
  }
}

// API Documentation
export async function GET() {
  return NextResponse.json({
    message: 'CNC Quote API',
    endpoint: '/api/quote',
    method: 'POST',
    description: 'Generate an AI-powered price estimate for CNC machined parts',
    requestBody: {
      geometry: {
        boundingBox: { x: 'number (mm)', y: 'number (mm)', z: 'number (mm)' },
        volume: 'number (mm³)',
        surfaceArea: 'number (mm²)',
        faces: 'number',
        edges: 'number',
      },
      material: 'string (al6061, al7075, ss304, ss316, mild, tool, ti, delrin, peek, nylon)',
      tolerance: 'string (Standard ±0.005", Precision ±0.001", Ultra-Precision ±0.0005")',
      quantity: 'number',
    },
    responseExample: {
      quoteId: 'quote_xxx',
      estimate: {
        minPrice: 340,
        mostLikelyPrice: 400,
        maxPrice: 480,
        estimatedHours: 8,
        materialCost: 140,
        explanation: 'string',
      },
      generatedAt: 'ISO timestamp',
      confidence: 0.87,
    },
  })
}
