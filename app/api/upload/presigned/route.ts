import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { generatePresignedUploadUrl } from '@/lib/s3'

const PresignedUrlSchema = z.object({
  fileName: z.string(),
  contentType: z.string().default('application/octet-stream'),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get('fileName')
    const contentType = searchParams.get('contentType') || 'application/octet-stream'

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
    }

    const data = PresignedUrlSchema.parse({
      fileName,
      contentType,
    })

    const presignedUrl = await generatePresignedUploadUrl(data.fileName, data.contentType)

    return NextResponse.json({
      presignedUrl,
      fileName: data.fileName,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Presigned URL error:', error)
    return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 })
  }
}
