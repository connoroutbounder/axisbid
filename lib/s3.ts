import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.S3_BUCKET || 'axisbid-files'
const EXPIRATION_TIME = 3600 // 1 hour

export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: EXPIRATION_TIME })
  return signedUrl
}

export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await s3Client.send(command)

  // Return the S3 URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
}

export async function deleteFile(fileUrl: string): Promise<void> {
  // Extract key from S3 URL
  const urlParts = fileUrl.split(`${BUCKET_NAME}.s3.`)
  if (urlParts.length !== 2) {
    throw new Error('Invalid S3 URL format')
  }

  const keyPart = urlParts[1].split('/').slice(1).join('/')
  const key = decodeURIComponent(keyPart)

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

export async function getDownloadUrl(fileUrl: string): Promise<string> {
  const urlParts = fileUrl.split(`${BUCKET_NAME}.s3.`)
  if (urlParts.length !== 2) {
    throw new Error('Invalid S3 URL format')
  }

  const keyPart = urlParts[1].split('/').slice(1).join('/')
  const key = decodeURIComponent(keyPart)

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: EXPIRATION_TIME })
  return signedUrl
}
