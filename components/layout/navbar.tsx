'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthenticated = false // Will be replaced with actual auth session
  const userRole = null // 'customer' | 'shop' | null

  return (
    <nav className="bg-brand-navy text-white shadow-lg sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 border-2 border-brand-orange rounded" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-brand-orange" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-orange" />
          </div>
          AxisBid
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthenticated ? (
            <>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-brand-orange rounded-lg hover:bg-orange-500 transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : userRole === 'customer' ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-brand-orange transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs"
                className="hover:text-brand-orange transition-colors"
              >
                My Jobs
              </Link>
              <Link
                href="/quote/new"
                className="px-4 py-2 bg-brand-orange rounded-lg hover:bg-orange-500 transition-colors"
              >
                Get Quote
              </Link>
            </>
          ) : userRole === 'shop' ? (
            <>
              <Link
                href="/shop"
                className="hover:text-brand-orange transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/shop"
                className="hover:text-brand-orange transition-colors"
              >
                Available Jobs
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-blue">
          <div className="container py-4 space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 bg-brand-orange rounded-lg hover:bg-orange-500 transition-colors text-center"
                >
                  Get Started
                </Link>
              </>
            ) : userRole === 'customer' ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  My Jobs
                </Link>
                <Link
                  href="/quote/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 bg-brand-orange rounded-lg hover:bg-orange-500 transition-colors text-center"
                >
                  Get Quote
                </Link>
              </>
            ) : userRole === 'shop' ? (
              <>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-brand-orange transition-colors"
                >
                  Available Jobs
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}
