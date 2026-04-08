import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { uploadFile } from '@/lib/supabase'
import { parseSTEPFile, estimateComplexity } from '@/lib/step-parser'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = (formData.get('type') as string) || 'step'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type based on upload type
    if (fileType === 'drawing') {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Drawing must be a PDF file (.pdf)' },
          { status: 400 }
        )
      }
    } else {
      if (!file.name.toLowerCase().endsWith('.step') && !file.name.toLowerCase().endsWith('.stp')) {
        return NextResponse.json(
          { error: 'Only STEP files (.step, .stp) are supported' },
          { status: 400 }
        )
      }
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase Storage
    const fileUrl = await uploadFile(file.name, buffer, file.type || 'application/octet-stream')

    // Parse STEP file for geometry data (only for STEP files)
    let geometryData = null
    let complexity = null

    if (fileType !== 'drawing') {
      try {
        geometryData = await parseSTEPFile(buffer)
        complexity = estimateComplexity(geometryData)
      } catch (parseError) {
        console.warn('Failed to parse STEP geometry:', parseError)
      }
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        url: fileUrl,
      },
      geometry: geometryData ? {
        boundingBox: geometryData.boundingBox,
        volume: geometryData.volume,
        surfaceArea: geometryData.surfaceArea,
        faceCount: geometryData.faceCount,
        edgeCount: geometryData.edgeCount,
        holeCount: geometryData.holeCount,
        pocketCount: geometryData.pocketCount,
        complexity,
      } : null,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
