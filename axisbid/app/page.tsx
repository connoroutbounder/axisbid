import Link from 'next/link'
import { Check, Zap, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-brand text-white py-20 md:py-28">
          <div className="container-responsive text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Competitive<br />
              CNC Bids in Hours,<br />
              Not Days
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Upload your STEP file, get an instant AI-powered estimate, and receive competitive bids from vetted local machine shops.
            </p>
            <Link
              href="/quote"
              className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
            >
              Upload Your Part
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="bg-brand-light-bg rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white rounded-full font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Upload Your Part</h3>
                <p className="text-gray-600">
                  Drag and drop your STEP file. Our system analyzes geometry, complexity, and material requirements in seconds.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-brand-light-bg rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white rounded-full font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI Estimate</h3>
                <p className="text-gray-600">
                  Get an instant price range powered by machine learning trained on thousands of quotes. Know your baseline immediately.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-brand-light-bg rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white rounded-full font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Shop Bids</h3>
                <p className="text-gray-600">
                  Vetted local shops review your job and submit competitive bids. Choose the best fit for your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16 md:py-24 bg-brand-light-bg">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
              Why Choose AxisBid
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Prop 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <Zap className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">20% Cheaper</h3>
                  <p className="text-gray-700">
                    Direct access to local shops means no middleman markup. Save significantly compared to national suppliers.
                  </p>
                </div>
              </div>

              {/* Prop 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <Shield className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Vetted Shops</h3>
                  <p className="text-gray-700">
                    Every machine shop is verified for quality, certifications, and reliability. We stand behind every quote.
                  </p>
                </div>
              </div>

              {/* Prop 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <Check className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Transparent Pricing</h3>
                  <p className="text-gray-700">
                    No hidden fees. See exactly what each shop charges, their turnaround time, and capabilities.
                  </p>
                </div>
              </div>

              {/* Prop 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <Zap className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Estimates</h3>
                  <p className="text-gray-700">
                    Get instant price ranges before any shop quotes. Baseline pricing powered by machine learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-responsive text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              Trusted by Engineers & Manufacturers
            </h2>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { number: '2,300+', label: 'Parts Quoted' },
                { number: '450+', label: 'Active Shops' },
                { number: '$12M', label: 'Jobs Completed' },
                { number: '4.8★', label: 'Average Rating' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-brand-light-bg rounded-lg p-6">
                  <p className="text-3xl font-bold text-brand-orange">{stat.number}</p>
                  <p className="text-gray-700 font-medium mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-light-bg rounded-lg p-8 text-left max-w-2xl mx-auto">
              <p className="text-lg text-gray-800 italic mb-4">
                "AxisBid cut our sourcing time from a week to a few hours. The quality of local bids is exceptional, and we're saving 15-20% compared to our old supplier."
              </p>
              <p className="font-semibold text-gray-800">James Chen</p>
              <p className="text-gray-600 text-sm">Engineering Manager, TechFlow Manufacturing</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-brand-dark-blue text-white">
          <div className="container-responsive text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Part Quoted?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Upload your STEP file now and get an AI estimate in under a minute.
            </p>
            <Link
              href="/quote"
              className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
            >
              Start Your Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
