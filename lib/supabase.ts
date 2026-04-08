import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

// Lazy-init to avoid crashing at build time when env vars aren't set
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

const BUCKET_NAME = 'step-files'

export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`

  const { error } = await getSupabase().storage
    .from(BUCKET_NAME)
    .upload(key, fileBuffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`)
  }

  const { data } = getSupabase().storage.from(BUCKET_NAME).getPublicUrl(key)
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
  const { error } = await getSupabase().storage.from(BUCKET_NAME).remove([key])
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
  const { data, error } = await getSupabase().storage
    .from(BUCKET_NAME)
    .createSignedUrl(key, 3600)

  if (error || !data) {
    throw new Error(`Failed to generate download URL: ${error?.message}`)
  }

  return data.signedUrl
}
