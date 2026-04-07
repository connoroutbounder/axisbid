'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container-responsive flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold text-brand-dark-blue">
          Axis<span className="text-brand-orange">Bid</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/quote" className="text-gray-700 hover:text-brand-accent-blue font-medium transition-colors">
            Upload Part
          </Link>
          <Link href="/shop" className="text-gray-700 hover:text-brand-accent-blue font-medium transition-colors">
            For Shops
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-brand-accent-blue font-medium transition-colors">
            About
          </Link>
          <button className="btn-primary">Sign In</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            <Link href="/quote" className="text-gray-700 hover:text-brand-accent-blue font-medium">
              Upload Part
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-brand-accent-blue font-medium">
              For Shops
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-brand-accent-blue font-medium">
              About
            </Link>
            <button className="btn-primary w-full">Sign In</button>
          </div>
        </div>
      )}
    </nav>
  )
}
