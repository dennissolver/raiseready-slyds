import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { ProductRoadmap } from '@/components/landing/product-roadmap'
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            🚀 RaiseReady Impact
          </h1>
          <p className="text-2xl text-muted-foreground mb-4">
            AI-Powered Fundraising Coach for Impact Founders & Investors
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect impact investors with social enterprises through AI-powered matching and coaching.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup/founder">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                🚀 I'm a Founder
              </Button>
            </Link>
            <Link href="/signup/investor">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-purple-500 text-purple-700 hover:bg-purple-50">
                💼 I'm an Investor
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="text-primary hover:underline font-medium">Sign in here</a>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-200">
            <Link href="/learn/impact-valuation">
              <Button size="lg" variant="outline" className="gap-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                How We Value Impact
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Learn about our transparent SDG-based impact valuation framework
            </p>
          </div>
        </div>
      </div>

      {/* Browse Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore the Impact Ecosystem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover impact projects seeking funding and investors backing sustainable ventures
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Browse Projects */}
            <Link href="/projects">
              <div className="group hover:shadow-xl transition-all p-8 rounded-lg border-2 border-blue-100 hover:border-blue-300 cursor-pointer bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Browse Projects</h3>
                  <p className="text-muted-foreground mb-6">
                    Discover impact startups and sustainable ventures seeking investment
                  </p>
                  <Button className="w-full" size="lg">
                    View All Projects →
                  </Button>
                </div>
              </div>
            </Link>

            {/* Browse Investors */}
            <Link href="/investors">
              <div className="group hover:shadow-xl transition-all p-8 rounded-lg border-2 border-purple-100 hover:border-purple-300 cursor-pointer bg-gradient-to-br from-purple-50 to-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Browse Investors</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect with impact investors and find the right funding partners
                  </p>
                  <Button className="w-full" size="lg" variant="outline">
                    View All Investors →
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works - Founders */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">For Impact Founders: How It Works</h2>
            <p className="text-muted-foreground">Get investor-ready in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Your Deck</h3>
              <p className="text-muted-foreground">
                Upload your pitch deck PDF and we'll analyze it for impact storytelling
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get AI Coaching</h3>
              <p className="text-muted-foreground">
                Our AI coach helps you refine your theory of change and impact metrics
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Match with Impact Investors</h3>
              <p className="text-muted-foreground">
                Connect with investors aligned with your SDGs and social mission
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Investors */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">For Impact Investors: Quality Deal Flow</h2>
            <p className="text-muted-foreground">Mission-driven founders matched to your impact thesis</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'AI discovery session to define your impact investment thesis',
              'Filter by SDG alignment and ESG criteria',
              'Only see social enterprises matching YOUR values',
              'Complete privacy - no spam, no cold calls',
              'Review impact metrics and financial sustainability',
              'Track your impact pipeline',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/signup/investor">
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                Join as Impact Investor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* What Founders Get */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Impact Founders Get</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'AI analysis of your impact narrative and theory of change',
              'Readiness score (0-100) across 6 key impact areas',
              'Interactive coaching with impact-focused AI',
              'Guidance on impact metrics and measurement',
              'Unlimited practice sessions',
              'Match with aligned impact investors',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/signup/founder">
              <Button size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Roadmap */}
      <ProductRoadmap />

      {/* Footer - NEW COMPONENT REPLACES OLD FOOTER */}
      <Footer />
    </div>
  )
}