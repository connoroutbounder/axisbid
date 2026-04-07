import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Upload,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Eye,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Get Competitive CNC Bids in Hours, Not Days
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your STEP file. Get an AI estimate in seconds. Receive bids
            from vetted local shops within hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/quote/new">
              <Button variant="primary" size="lg">
                Upload Your Part
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-navy">
                Join as a Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-brand-light">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload STEP File</h3>
              <p className="text-gray-600">
                Drag and drop your CAD file or browse from your computer
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Estimate</h3>
              <p className="text-gray-600">
                Get an instant price estimate powered by machine learning
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Shop Bids</h3>
              <p className="text-gray-600">
                Receive detailed bids from verified machine shops in your area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AxisBid */}
      <section className="section-padding">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Why AxisBid</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-brand-orange bg-opacity-10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-orange" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                  Better Economics
                </h3>
                <p className="text-gray-600">
                  20% take rate vs Xometry's 50%. More money stays in your
                  pocket.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-brand-blue bg-opacity-10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-brand-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                  Transparent Process
                </h3>
                <p className="text-gray-600">
                  See who's making your part. Direct communication with shops.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-brand-green bg-opacity-10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-brand-green" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                  Instant AI Estimates
                </h3>
                <p className="text-gray-600">
                  Get price estimates in seconds, not waiting for emails.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-brand-navy bg-opacity-10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand-navy" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                  Vetted Local Shops
                </h3>
                <p className="text-gray-600">
                  All shops are verified. Support your local manufacturing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-brand-navy text-white py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold">500+</p>
              <p className="text-gray-300 mt-1">Machine Shops</p>
            </div>
            <div>
              <p className="text-4xl font-bold">4.8/5</p>
              <p className="text-gray-300 mt-1">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold">$2M+</p>
              <p className="text-gray-300 mt-1">Jobs Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold">&lt;4hr</p>
              <p className="text-gray-300 mt-1">Avg Bid Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Materials */}
      <section className="section-padding bg-brand-light">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Materials We Work With
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'Aluminum',
              'Stainless Steel',
              'Carbon Steel',
              'Titanium',
              'Brass',
              'Copper',
              'Plastics',
              'Composites',
              'Exotic Alloys',
              'Cast Iron',
            ].map((material) => (
              <div
                key={material}
                className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:border-brand-blue transition-colors"
              >
                <p className="font-semibold text-gray-900">{material}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding bg-gradient-to-r from-brand-blue to-brand-navy text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Upload your STEP file and get bids from local machine shops today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/quote/new">
              <Button
                variant="primary"
                size="lg"
                className="bg-brand-orange hover:bg-orange-500"
              >
                Upload Your Part Now
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-blue">
                Become a Shop Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
