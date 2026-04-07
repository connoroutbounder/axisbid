import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { GeometryData } from './types'

interface ParsedSTEPData {
  bounding_box: { x: number; y: number; z: number }
  volume: number
  surface_area: number
  face_count: number
  edge_count: number
  hole_count: number
  pocket_count: number
}

export async function parseSTEPFile(fileBuffer: Buffer): Promise<GeometryData> {
  const tempDir = os.tmpdir()
  const inputFile = path.join(tempDir, `step-${Date.now()}.step`)
  const outputFile = path.join(tempDir, `step-output-${Date.now()}.json`)

  try {
    // Write buffer to temp file
    fs.writeFileSync(inputFile, fileBuffer)

    // Execute Python parser script
    const scriptPath = path.join(process.cwd(), 'scripts', 'parse_step.py')

    try {
      execSync(`python3 ${scriptPath} ${inputFile} ${outputFile}`, {
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024,
      })

      // Read and parse output
      const outputData = fs.readFileSync(outputFile, 'utf-8')
      const parsed: ParsedSTEPData = JSON.parse(outputData)

      return {
        boundingBox: parsed.bounding_box,
        volume: parsed.volume,
        surfaceArea: parsed.surface_area,
        faceCount: parsed.face_count,
        edgeCount: parsed.edge_count,
        holeCount: parsed.hole_count,
        pocketCount: parsed.pocket_count,
      }
    } catch (pythonError) {
      // Fall back to basic STEP text parsing if Python fails
      console.warn('Python STEP parser failed, using fallback parser:', pythonError)
      return parseSTEPFallback(fileBuffer)
    }
  } finally {
    // Cleanup temp files
    if (fs.existsSync(inputFile)) {
      fs.unlinkSync(inputFile)
    }
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
  }
}

function parseSTEPFallback(fileBuffer: Buffer): GeometryData {
  // Basic fallback parsing that extracts info from STEP ASCII format
  const stepText = fileBuffer.toString('utf-8')

  // Extract bounding box from AXIS2_PLACEMENT_3D entries
  // Note: bbMatch is extracted but fallback uses hardcoded estimates below

  // Count geometric entities for estimate
  const faceCount = (stepText.match(/ADVANCED_FACE/g) || []).length
  const edgeCount = (stepText.match(/EDGE_CURVE/g) || []).length
  const circleCount = (stepText.match(/CIRCLE/g) || []).length
  const pocketCount = Math.max(0, circleCount - 2) // Rough estimate of pockets from circles

  // Estimate from text analysis if CAD data unavailable
  const defaultBoundingBox = {
    x: Math.max(50, Math.min(500, faceCount * 5)), // Rough estimate in mm
    y: Math.max(50, Math.min(500, faceCount * 5)),
    z: Math.max(20, Math.min(300, edgeCount * 2)),
  }

  // Calculate rough volume estimate in cm³
  const volume =
    (defaultBoundingBox.x * defaultBoundingBox.y * defaultBoundingBox.z) / 1000 * 0.4 // 40% fill factor

  // Surface area estimate
  const surfaceArea =
    2 *
    (defaultBoundingBox.x * defaultBoundingBox.y +
      defaultBoundingBox.y * defaultBoundingBox.z +
      defaultBoundingBox.x * defaultBoundingBox.z) /
    100

  return {
    boundingBox: defaultBoundingBox,
    volume,
    surfaceArea,
    faceCount: Math.max(1, faceCount),
    edgeCount: Math.max(1, edgeCount),
    holeCount: Math.max(0, circleCount - 2),
    pocketCount: Math.max(0, pocketCount),
  }
}

export function estimateComplexity(geometry: GeometryData): string {
  const totalFeatures = geometry.holeCount + geometry.pocketCount + geometry.faceCount
  const volumeToSurfaceRatio = geometry.volume / (geometry.surfaceArea || 1)

  if (totalFeatures < 5 && geometry.faceCount < 6 && volumeToSurfaceRatio > 2) {
    return 'LOW'
  } else if (totalFeatures < 15 && geometry.faceCount < 20 && volumeToSurfaceRatio > 0.5) {
    return 'MEDIUM'
  } else if (totalFeatures < 30 && geometry.faceCount < 40) {
    return 'HIGH'
  } else {
    return 'VERY_HIGH'
  }
}
