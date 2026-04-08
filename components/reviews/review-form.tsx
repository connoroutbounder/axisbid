'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ReviewFormProps {
  jobId: string
  shopName: string
  onSubmitted: () => void
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-0.5 transition-colors"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hover || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ReviewForm({ jobId, shopName, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [quality, setQuality] = useState(0)
  const [timeliness, setTimeliness] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please provide an overall rating')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          rating,
          quality: quality || undefined,
          timeliness: timeliness || undefined,
          communication: communication || undefined,
          comment: comment.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      toast.success('Review submitted successfully!')
      onSubmitted()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Review {shopName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Share your experience to help other customers
          </p>
        </div>

        <div className="space-y-4">
          <StarRating
            label="Overall Rating"
            value={rating}
            onChange={setRating}
          />
          <StarRating
            label="Part Quality"
            value={quality}
            onChange={setQuality}
          />
          <StarRating
            label="Timeliness"
            value={timeliness}
            onChange={setTimeliness}
          />
          <StarRating
            label="Communication"
            value={communication}
            onChange={setCommunication}
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={rating === 0}
          className="w-full"
        >
          Submit Review
        </Button>
      </form>
    </Card>
  )
}
