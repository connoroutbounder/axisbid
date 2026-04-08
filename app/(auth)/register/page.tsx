'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { LocationInput } from '@/components/ui/location-input'
import { Mail, Lock, User, Building2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'customer' | 'shop'>('customer')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
  })
  const [location, setLocation] = useState({
    city: '',
    state: '',
    zipCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role === 'shop' ? 'SHOP_OWNER' : 'CUSTOMER',
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          shopName: role === 'shop' ? formData.shopName : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Registration failed')
        return
      }

      // Auto sign-in after registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration succeeded but sign-in failed — redirect to login
        router.push('/login')
      } else {
        router.push(role === 'shop' ? '/shop/register' : '/dashboard')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
        <p className="text-gray-600 mt-2">
          Create your AxisBid account
        </p>
      </div>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            I am a...
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer font-medium ${
                role === 'customer'
                  ? 'border-brand-blue bg-brand-blue bg-opacity-10 text-brand-blue'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('shop')}
              className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer font-medium ${
                role === 'shop'
                  ? 'border-brand-blue bg-brand-blue bg-opacity-10 text-brand-blue'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Machine Shop
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            icon={<User className="w-5 h-5" />}
            required
          />

          {role === 'shop' && (
            <Input
              label="Shop Name"
              type="text"
              placeholder="e.g. Precision Parts LLC"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              icon={<Building2 className="w-5 h-5" />}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            icon={<Lock className="w-5 h-5" />}
            helperText="At least 8 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            icon={<Lock className="w-5 h-5" />}
            required
          />

          <LocationInput value={location} onChange={setLocation} />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-1 rounded border-gray-300 text-brand-blue"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <Link href="#" className="text-brand-blue font-semibold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-brand-blue font-semibold">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Continue with Google
        </Button>
      </Card>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-blue font-semibold hover:text-brand-navy">
          Sign in
        </Link>
      </div>
    </div>
  )
}
