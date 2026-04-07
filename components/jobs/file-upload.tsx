'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [error, setError] = useState<string>('')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('')

      if (acceptedFiles.length === 0) {
        setError('Please upload a valid STEP file')
        return
      }

      const file = acceptedFiles[0]

      // Validate file type
      const validExtensions = ['.step', '.stp', '.STEP', '.STP']
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.endsWith(ext)
      )

      if (!hasValidExtension) {
        setError('Please upload a STEP file (.step or .stp)')
        return
      }

      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        return
      }

      onFileSelect(file)
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/step': ['.step', '.stp'],
      'application/step': ['.step', '.stp'],
    },
    maxSize: 100 * 1024 * 1024,
    maxFiles: 1,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-brand-blue bg-blue-50'
            : selectedFile
              ? 'border-brand-green bg-green-50'
              : 'border-gray-300 hover:border-brand-blue hover:bg-blue-50'
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mb-4">
              <File className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-gray-900 text-lg">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatFileSize(selectedFile.size)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault()
                // Will be handled by parent
              }}
            >
              Change File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-brand-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Drag your STEP file here
            </p>
            <p className="text-sm text-gray-600 mt-2">
              or click to browse from your computer
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: .step, .stp (max 100MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
