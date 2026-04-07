'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

interface BidFormProps {
  aiEstimate: number
  onSubmit: (bid: BidSubmission) => void
  isLoading?: boolean
}

export interface BidSubmission {
  price: number
  estimatedDays: number
  approach: string
  machinesSelected: string[]
}

export function BidForm({
  aiEstimate,
  onSubmit,
  isLoading = false,
}: BidFormProps) {
  const [formData, setFormData] = useState<BidSubmission>({
    price: aiEstimate,
    estimatedDays: 5,
    approach: '',
    machinesSelected: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const priceVariance = formData.price
    ? ((formData.price - aiEstimate) / aiEstimate) * 100
    : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900">
          Submit Your Bid
        </h3>

        {/* Price Input */}
        <div className="mb-6">
          <Input
            label="Your Quote Price ($) *"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            helperText={`AI Estimate: $${aiEstimate.toFixed(2)} ${
              priceVariance > 0
                ? `(${priceVariance.toFixed(0)}% above)`
                : `(${Math.abs(priceVariance).toFixed(0)}% below)`
            }`}
          />
        </div>

        {/* Estimated Days */}
        <div className="mb-6">
          <Input
            label="Estimated Days to Completion *"
            type="number"
            min="1"
            max="180"
            value={formData.estimatedDays}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedDays: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        {/* Approach/Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Manufacturing Approach *
          </label>
          <textarea
            value={formData.approach}
            onChange={(e) =>
              setFormData({
                ...formData,
                approach: e.target.value,
              })
            }
            placeholder="Describe your approach to manufacturing this part (setup strategy, operations, QA process, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue focus:ring-opacity-20 focus:outline-none"
            rows={5}
            required
          />
        </div>

        {/* Pricing Alert */}
        {priceVariance > 30 && (
          <Alert variant="warning" className="mb-6">
            <p className="text-sm">
              Your quote is significantly higher than the AI estimate. Consider
              reviewing your approach or pricing.
            </p>
          </Alert>
        )}

        {priceVariance < -20 && (
          <Alert variant="warning" className="mb-6">
            <p className="text-sm">
              Your quote is significantly lower than the AI estimate. Ensure you
              have accounted for all costs and quality requirements.
            </p>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Submit Bid
        </Button>
      </Card>
    </form>
  )
}
