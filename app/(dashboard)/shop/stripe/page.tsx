'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ExternalLink } from 'lucide-react'

export default function StripeConnectPage() {
  const { data: session } = useSession()
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null)
  const [stripeOnboarded, setStripeOnboarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    async function fetchShopStatus() {
      try {
        const shopRes = await fetch('/api/shops?isActive=true&limit=100')
        if (shopRes.ok) {
          const data = await shopRes.json()
          const myShop = data.shops?.find((s: any) => s.userId === session!.user.id)
          if (myShop) {
            setStripeAccountId(myShop.stripeAccountId)
            setStripeOnboarded(myShop.stripeOnboarded)
          }
        }
      } catch (error) {
        console.error('Failed to fetch shop status:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchShopStatus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to connect Stripe')
      }
      const data = await res.json()
      window.location.href = data.onboardingUrl
    } catch (error) {
      console.error('Stripe connect error:', error)
      setConnecting(false)
    }
  }

  return (
    <DashboardLayout userRole="shop">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Connect</h1>
          <p className="text-gray-600 mt-2">
            Connect your Stripe account to receive payments from customers.
          </p>
        </div>

        <Card>
          {loading ? (
            <div className="animate-pulse h-32 bg-gray-100 rounded" />
          ) : stripeOnboarded ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Stripe Connected</h2>
              <p className="text-gray-600">
                Your Stripe account is connected and ready to receive payments.
              </p>
            </div>
          ) : stripeAccountId ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Setup</h2>
              <p className="text-gray-600 mb-6">
                Your Stripe account was created but onboarding is incomplete.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConnect}
                isLoading={connecting}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Resume Stripe Setup
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Stripe</h2>
              <p className="text-gray-600 mb-6">
                To receive payments, you need to connect a Stripe account.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConnect}
                isLoading={connecting}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Connect Stripe Account
              </Button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
