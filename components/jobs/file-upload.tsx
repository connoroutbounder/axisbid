'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
  mode?: 'drawing' | 'step'
}

const modeConfig = {
  drawing: {
    accept: { 'application/pdf': ['.pdf'] },
    extensions: ['.pdf'],
    errorMsg: 'Please upload a PDF file (.pdf)',
    dragText: 'Drag your PDF drawing here',
    formatText: 'Supported formats: .pdf (max 50MB)',
  },
  step: {
    accept: { 'model/step': ['.step', '.stp'], 'application/step': ['.step', '.stp'] },
    extensions: ['.step', '.stp', '.STEP', '.STP'],
    errorMsg: 'Please upload a STEP file (.step or .stp)',
    dragText: 'Drag your STEP file here',
    formatText: 'Supported formats: .step, .stp (max 50MB)',
  },
}

export function FileUpload({ onFileSelect, selectedFile, mode = 'step' }: FileUploadProps) {
  const [error, setError] = useState<string>('')
  const config = modeConfig[mode]

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('')

      if (acceptedFiles.length === 0) {
        setError(config.errorMsg)
        return
      }

      const file = acceptedFiles[0]

      const hasValidExtension = config.extensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext.toLowerCase())
      )

      if (!hasValidExtension) {
        setError(config.errorMsg)
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }

      onFileSelect(file)
    },
    [onFileSelect, config]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.accept,
    maxSize: 50 * 1024 * 1024,
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
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
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
            <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mb-3">
              <File className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatFileSize(selectedFile.size)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Change File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-brand-blue bg-opacity-10 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-brand-blue" />
            </div>
            <p className="font-semibold text-gray-900">
              {config.dragText}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              or click to browse from your computer
            </p>
            <p className="text-xs text-gray-500 mt-3">
              {config.formatText}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
