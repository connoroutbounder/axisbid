'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FileUpload from '@/components/FileUpload'
import PartViewer from '@/components/PartViewer'
import MaterialSelector from '@/components/MaterialSelector'
import { AlertCircle } from 'lucide-react'

const mockGeometry = {
  boundingBox: { x: 120, y: 100, z: 80 },
  volume: 384000,
  surfaceArea: 40000,
  faces: 24,
  edges: 48,
}

export default function QuotePage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [material, setMaterial] = useState('')
  const [finish, setFinish] = useState('')
  const [tolerance, setTolerance] = useState('')
  const [quantity, setQuantity] = useState('')
  const [neededBy, setNeededBy] = useState('')
  const [notes, setNotes] = useState('')

  const handleFileSelect = (file: File) => {
    setUploadedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedFile || !material || !finish || !tolerance || !quantity || !neededBy) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock quote ID
    const quoteId = 'quote_' + Math.random().toString(36).substr(2, 9)

    setIsLoading(false)
    router.push(`/quote/${quoteId}`)
  }

  const finishOptions = [
    'As Machined',
    'Bead Blasted',
    'Anodized',
    'Powder Coated',
    'Passivated',
  ]

  const toleranceOptions = [
    'Standard ±0.005"',
    'Precision ±0.001"',
    'Ultra-Precision ±0.0005"',
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-light-bg py-12">
        <div className="container-responsive">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Get Your Part Quoted</h1>
          <p className="text-gray-600 mb-12">Upload your STEP file and fill in the specifications below</p>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* File Upload */}
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Step 1: Upload STEP File</h2>
                  <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      Tip: Upload high-quality STEP files for the most accurate AI estimates. The parser will extract geometry data automatically.
                    </p>
                  </div>
                </div>

                {/* Material & Finish */}
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Step 2: Specifications</h2>
                  <div className="space-y-4">
                    <MaterialSelector value={material} onChange={setMaterial} />

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Surface Finish
                      </label>
                      <select
                        value={finish}
                        onChange={(e) => setFinish(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
                      >
                        <option value="">Select a finish...</option>
                        {finishOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tolerance
                      </label>
                      <select
                        value={tolerance}
                        onChange={(e) => setTolerance(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
                      >
                        <option value="">Select a tolerance...</option>
                        {toleranceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Needed By
                        </label>
                        <input
                          type="date"
                          value={neededBy}
                          onChange={(e) => setNeededBy(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Any special requirements, materials preferences, or other details..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !uploadedFile}
                  className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoading ? 'animate-pulse' : ''
                  }`}
                >
                  {isLoading ? 'Processing Your Part...' : 'Get AI Estimate & Bids'}
                </button>
              </div>

              {/* Right Column */}
              <div>
                <div className="sticky top-20">
                  {uploadedFile ? (
                    <PartViewer fileName={uploadedFile.name} geometry={mockGeometry} />
                  ) : (
                    <div className="bg-white rounded-lg shadow-card p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Part Preview</h3>
                      <div className="h-96 bg-brand-light-bg rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                          Upload a STEP file to see your part preview
                        </p>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p>Once uploaded, we'll show:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>3D part visualization</li>
                          <li>Bounding box dimensions</li>
                          <li>Volume and surface area</li>
                          <li>Feature complexity analysis</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
