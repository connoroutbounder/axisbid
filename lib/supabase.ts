import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role key (full access)
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'step-files'

export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, fileBuffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key)
  return data.publicUrl
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const url = new URL(fileUrl)
  // Extract path after /object/public/step-files/
  const match = url.pathname.match(/\/object\/public\/step-files\/(.+)/)
  if (!match) {
    throw new Error('Invalid Supabase storage URL')
  }

  const key = decodeURIComponent(match[1])
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([key])
  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

export async function getDownloadUrl(fileUrl: string): Promise<string> {
  const url = new URL(fileUrl)
  const match = url.pathname.match(/\/object\/public\/step-files\/(.+)/)
  if (!match) {
    throw new Error('Invalid Supabase storage URL')
  }

  const key = decodeURIComponent(match[1])
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(key, 3600)

  if (error || !data) {
    throw new Error(`Failed to generate download URL: ${error?.message}`)
  }

  return data.signedUrl
}
