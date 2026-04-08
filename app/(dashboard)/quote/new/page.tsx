'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/stepper'
import { FileUpload } from '@/components/jobs/file-upload'
import { PartSpecsForm, type PartSpecs } from '@/components/jobs/part-specs-form'
import { AlertCircle, CheckCircle } from 'lucide-react'

const steps = [
  { label: 'Upload File', value: 'upload' },
  { label: 'Part Details', value: 'details' },
  { label: 'Review', value: 'review' },
]

const toleranceMap: Record<string, string> = {
  standard: '±0.005"',
  precision: '±0.0005"',
  ultra: '±0.0001"',
}

export default function NewQuotePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [partSpecs, setPartSpecs] = useState<PartSpecs | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleSpecsSubmit = (specs: PartSpecs) => {
    setPartSpecs(specs)
    setCurrentStep(2)
  }

  const handleSubmitQuote = async () => {
    if (!selectedFile || !partSpecs) return
    setIsSubmitting(true)

    try {
      // Step 1: Upload file to S3
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'File upload failed')
      }

      const uploadData = await uploadRes.json()

      // Step 2: Create job
      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedFile.name.replace(/\.(step|stp)$/i, ''),
          material: partSpecs.material,
          surfaceFinish: partSpecs.surfaceFinish,
          tolerance: toleranceMap[partSpecs.tolerance] || partSpecs.tolerance,
          quantity: partSpecs.quantity,
          neededBy: partSpecs.neededByDate ? new Date(partSpecs.neededByDate).toISOString() : undefined,
          notes: partSpecs.notes || undefined,
          fileName: uploadData.file.name,
          fileUrl: uploadData.file.url,
          fileSize: uploadData.file.size,
        }),
      })

      if (!jobRes.ok) {
        const err = await jobRes.json()
        throw new Error(err.error || 'Failed to create job')
      }

      const job = await jobRes.json()
      toast.success('Quote request submitted! Shops will start bidding soon.')
      router.push(`/jobs/${job.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout userRole="customer">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Get a Quote</h1>
          <p className="text-gray-600 mt-2">
            Upload your STEP file and let us find you the best manufacturing partners
          </p>
        </div>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />

        {/* Step 1: File Upload */}
        {currentStep === 0 && (
          <Card>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Step 1: Upload Your CAD File
            </h2>

            <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />

            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="outline"
                disabled
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(1)}
                disabled={!selectedFile}
              >
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Part Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <PartSpecsForm onSubmit={handleSpecsSubmit} />

            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(0)}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 2 && selectedFile && partSpecs && (
          <div className="space-y-6">
            <Card header={<h2 className="text-lg font-semibold">Review Your Quote Request</h2>}>
              <div className="space-y-6">
                {/* File Summary */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">File Details</h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specs Summary */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Part Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">Material</p>
                      <p className="text-gray-900 font-medium mt-1">{partSpecs.material}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">Finish</p>
                      <p className="text-gray-900 font-medium mt-1">{partSpecs.surfaceFinish}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">Tolerance</p>
                      <p className="text-gray-900 font-medium mt-1 capitalize">{partSpecs.tolerance}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">Quantity</p>
                      <p className="text-gray-900 font-medium mt-1">{partSpecs.quantity}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">Needed By</p>
                      <p className="text-gray-900 font-medium mt-1">{partSpecs.neededByDate}</p>
                    </div>
                    {partSpecs.notes && (
                      <div className="p-4 bg-gray-50 rounded-lg md:col-span-3">
                        <p className="text-xs text-gray-600 uppercase font-semibold">Notes</p>
                        <p className="text-gray-900 font-medium mt-1">{partSpecs.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex gap-3 p-4 bg-brand-blue bg-opacity-10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-blue mb-1">What happens next?</p>
                    <p className="text-sm text-gray-700">
                      Once you submit, your job will be posted to our network of vetted machine shops. Expect competitive bids within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitQuote}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Quote Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
