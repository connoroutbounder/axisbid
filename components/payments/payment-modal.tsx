'use client'

import { PaymentForm } from './payment-form'
import { formatPrice } from '@/lib/utils'
import { X } from 'lucide-react'

interface PaymentModalProps {
  shopName: string
  price: number
  deliveryDays: number
  clientSecret: string
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({
  shopName,
  price,
  deliveryDays,
  clientSecret,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shop</span>
            <span className="font-medium text-gray-900">{shopName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium text-gray-900">{deliveryDays} days</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-brand-orange text-lg">{formatPrice(price)}</span>
          </div>
        </div>

        <PaymentForm
          clientSecret={clientSecret}
          onSuccess={onSuccess}
          onError={(msg) => {
            // Error is displayed by Stripe Elements
            console.error('Payment error:', msg)
          }}
        />
      </div>
    </div>
  )
}
