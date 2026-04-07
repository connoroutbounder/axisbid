import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Users, Lightbulb, Target } from 'lucide-react'

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-light-bg">
        {/* Hero */}
        <section className="bg-gradient-brand text-white py-20">
          <div className="container-responsive text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AxisBid</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Transforming how engineers and manufacturers source precision parts
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">The Problem</h2>

            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg mb-8">
              <p className="text-lg text-gray-800 mb-4">
                Getting CNC machining quotes is painfully slow and expensive.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Engineers spend hours manually emailing different shops</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>National suppliers charge 20-30% markups over local shops</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Quotes take 2-5 days, when you need answers in hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>No transparency into shop capabilities or quality</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Hidden fees and unclear pricing until the very end</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 text-lg">
              Local machine shops exist in nearly every region, but they're invisible to engineers. They work through relationships and reputation, leaving engineers to guess about quality and price.
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section className="py-16 md:py-24 bg-brand-light-bg">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">The AxisBid Solution</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-card p-8">
                <Lightbulb className="text-brand-orange mb-4" size={40} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-700">
                  Upload a STEP file and get an instant price estimate using machine learning trained on thousands of real quotes.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-card p-8">
                <Target className="text-brand-orange mb-4" size={40} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Competitive Bids</h3>
                <p className="text-gray-700">
                  Vetted local shops compete for your business. Get multiple options in hours, not days, with full transparency.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-card p-8">
                <Users className="text-brand-orange mb-4" size={40} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Direct Relationships</h3>
                <p className="text-gray-700">
                  Work directly with shop owners who care about quality. No middlemen, no hidden fees, just competitive pricing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Meet the Team</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Co-founder & CEO',
                  bio: 'Former manufacturing engineer at Tesla. Built machining sourcing systems for supply chain ops.',
                },
                {
                  name: 'James Rodriguez',
                  role: 'Co-founder & CTO',
                  bio: 'ML engineer with 8 years building predictive pricing models. Ex-Stripe, ex-Google.',
                },
                {
                  name: 'Marcus Thompson',
                  role: 'VP of Operations',
                  bio: 'Ran a machine shop for 15 years. Now vetting our shop network and ensuring quality.',
                },
              ].map((member, idx) => (
                <div key={idx} className="bg-brand-light-bg rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-brand rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                  <p className="text-brand-accent-blue font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-700 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We're Doing This */}
        <section className="py-16 md:py-24 bg-blue-50">
          <div className="container-responsive">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Why We're Doing This</h2>

            <div className="bg-white rounded-lg shadow-card p-8 max-w-3xl">
              <p className="text-lg text-gray-800 mb-4">
                We believe manufacturing shouldn't be complicated. Engineers should be able to get instant quotes from shops that can actually do the work, at prices that reflect real competition.
              </p>

              <p className="text-lg text-gray-800 mb-4">
                Local machine shops are the backbone of American manufacturing. They're nimble, high-quality, and competitive. But they're hidden. AxisBid makes them visible.
              </p>

              <p className="text-lg text-gray-800">
                By connecting engineers directly with local shops, we're building trust, transparency, and competitive pricing into the supply chain. Everyone wins.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-brand-dark-blue text-white">
          <div className="container-responsive text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start sourcing faster, smarter, and cheaper
            </p>
            <a
              href="/quote"
              className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
            >
              Upload Your Part
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
