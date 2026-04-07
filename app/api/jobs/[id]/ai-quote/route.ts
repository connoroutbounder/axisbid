import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { generateAIQuote } from '@/lib/ai-quote'
import { estimateComplexity } from '@/lib/step-parser'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check authorization
    if (job.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if geometry has been parsed
    if (!job.boundingBox || !job.volume) {
      return NextResponse.json(
        { error: 'Geometry data not available. Please wait for file parsing to complete.' },
        { status: 400 }
      )
    }

    const boundingBox = job.boundingBox as {
      x: number
      y: number
      z: number
    }

    const geometry = {
      boundingBox,
      volume: job.volume,
      surfaceArea: job.surfaceArea || 0,
      faceCount: job.faceCount || 1,
      edgeCount: job.edgeCount || 1,
      holeCount: job.holeCount || 0,
      pocketCount: job.pocketCount || 0,
    }

    const complexity = estimateComplexity(geometry)

    const quote = await generateAIQuote({
      material: job.material,
      tolerance: job.tolerance,
      quantity: job.quantity,
      boundingBox,
      volume: job.volume,
      surfaceArea: job.surfaceArea || 0,
      faceCount: job.faceCount || 1,
      edgeCount: job.edgeCount || 1,
      holeCount: job.holeCount || 0,
      pocketCount: job.pocketCount || 0,
      complexity,
    })

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        complexity,
        aiEstimateLow: quote.low,
        aiEstimateMid: quote.mid,
        aiEstimateHigh: quote.high,
        aiConfidence: quote.confidence,
        aiReasoning: quote.reasoning,
        status: 'QUOTING',
      },
    })

    return NextResponse.json({
      jobId: params.id,
      estimate: {
        low: quote.low,
        mid: quote.mid,
        high: quote.high,
        confidence: quote.confidence,
        reasoning: quote.reasoning,
      },
      job: updated,
    })
  } catch (error) {
    console.error('AI quote error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI quote' },
      { status: 500 }
    )
  }
}
