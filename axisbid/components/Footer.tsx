'use client'

import Link from 'next/link'
import { Mail, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-dark-blue text-white">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              Axis<span className="text-brand-orange">Bid</span>
            </div>
            <p className="text-gray-300 text-sm">
              Fast, transparent CNC machining quotes from vetted local shops.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/quote" className="hover:text-brand-orange transition-colors">Upload Part</Link></li>
              <li><Link href="/shop" className="hover:text-brand-orange transition-colors">For Shops</Link></li>
              <li><a href="#pricing" className="hover:text-brand-orange transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-brand-orange transition-colors">About</Link></li>
              <li><a href="#blog" className="hover:text-brand-orange transition-colors">Blog</a></li>
              <li><a href="#careers" className="hover:text-brand-orange transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-brand-orange transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-brand-orange transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p className="text-sm text-gray-300">
              &copy; 2024 AxisBid. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#twitter" className="text-gray-300 hover:text-brand-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#linkedin" className="text-gray-300 hover:text-brand-orange transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:hello@axisbid.com" className="text-gray-300 hover:text-brand-orange transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
