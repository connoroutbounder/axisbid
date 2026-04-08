'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BidFormProps {
  jobId: string
  onSubmitted: () => void
}

export function BidForm({ jobId, onSubmitted }: BidFormProps) {
  const [price, setPrice] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const [approach, setApproach] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(price),
          estimatedDays: parseInt(estimatedDays),
          approach: approach || undefined,
          notes: notes || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to submit bid')
      }

      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Bid</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Your Price ($)"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 3200"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="Estimated Days"
            type="number"
            min="1"
            placeholder="e.g. 7"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Approach
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            rows={4}
            placeholder="Describe how you'll manufacture this part, which machines you'll use, etc."
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            rows={2}
            placeholder="Any additional notes or conditions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={isSubmitting || !price || !estimatedDays}
        >
          Submit Bid
        </Button>
      </form>
    </Card>
  )
}
