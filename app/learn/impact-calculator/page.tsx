import { ImpactCalculator } from '@/components/learn/impact-calculator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function ImpactCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/learn/impact-valuation">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Impact Framework
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Sign Up to Save Results
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SDG Impact Returns Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Model your project&apos;s financial + impact returns, or define your investment thesis
            using UN Sustainable Development Goals
          </p>
        </div>

        {/* Calculator Component */}
        <ImpactCalculator />

        {/* Methodology Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold">About This Calculator</h2>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mt-4">Methodology</h3>
              <p className="text-muted-foreground">
                This calculator uses SDG valuation data from the <strong>RealChange Impact Index</strong>,
                which assigns dollar values to specific impact outcomes based on societal benefit research.
              </p>

              <h3 className="text-lg font-semibold mt-6">How It Works</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>For Founders:</strong> Define your project&apos;s investment needs, split between
                  profit-generating and impact-focused activities, then model the social value created
                  through specific SDG outcomes.
                </li>
                <li>
                  <strong>For Investors:</strong> Set your target financial return and minimum impact
                  return requirements. The calculator shows what kind of projects match your thesis.
                </li>
                <li>
                  <strong>Blended Returns:</strong> Combines traditional financial IRR with impact value
                  creation to show total value generated per dollar invested.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Example SDG Valuations</h3>
              <div className="bg-slate-50 p-4 rounded-lg mt-2">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>SDG 1 (No Poverty):</strong> $500 per household with property tenure</li>
                  <li>• <strong>SDG 3 (Good Health):</strong> $400 per preventable death avoided</li>
                  <li>• <strong>SDG 4 (Quality Education):</strong> $2,000 per child with quality education access</li>
                  <li>• <strong>SDG 13 (Climate Action):</strong> $20,000 per government policy change</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold mt-6">Why This Matters</h3>
              <p className="text-muted-foreground">
                Impact investors increasingly need standardized ways to compare social/environmental
                returns across different projects. This calculator provides a transparent, SDG-aligned
                framework that both founders and investors can use to communicate value creation.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-purple-900">
                  <strong>💡 Pro Tip:</strong> When pitching to impact investors, show them your
                  blended return calculation. A project offering 8% financial + 5% impact returns
                  (13% total) can compete with traditional 12-15% return projects while creating
                  measurable social good.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect with Aligned Investors?</h2>
            <p className="text-lg mb-6 text-purple-100">
              Save your impact projections and get matched with investors seeking your SDG focus areas
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signup?type=founder">
                <Button size="lg" variant="secondary">
                  I&apos;m a Founder
                </Button>
              </Link>
              <Link href="/auth/signup?type=investor">
                <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-purple-50">
                  I&apos;m an Investor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Impact valuations based on RealChange Impact Index methodology.
            Calculator provided by <strong>RaiseReady</strong> |
            <Link href="/learn/impact-valuation" className="text-purple-600 hover:underline ml-1">
              Learn More About Our Impact Framework
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}