import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Upload, MessageSquare, Users, Award, TrendingUp, Sparkles } from 'lucide-react'
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-amber-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              $2B+ raised for 500+ startups
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Want to be the next <span className="text-primary">UNICORN</span>?
          </h1>
          <p className="text-3xl font-semibold text-primary mb-4">
            Become a STORYTELLER.
          </p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Submit your pitch deck to SlydS and get AI-powered coaching from India's leading fundraising advisory.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/founder/upload">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                <Upload className="w-5 h-5 mr-2" />
                Submit Your Pitch
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/5">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            New founder? <Link href="/signup/founder" className="text-primary hover:underline font-medium">Create your account</Link>
          </p>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Startups Coached</p>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
            <div>
              <p className="text-3xl font-bold text-primary">$2B+</p>
              <p className="text-sm text-muted-foreground">Total Raised</p>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
            <div>
              <p className="text-3xl font-bold text-primary">Since 2013</p>
              <p className="text-sm text-muted-foreground">Helping Founders</p>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
            <div>
              <p className="text-3xl font-bold text-primary">Seed → IPO</p>
              <p className="text-sm text-muted-foreground">All Stages</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">From pitch to investor-ready in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                Step 1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Deck</h3>
              <p className="text-muted-foreground">
                Submit your pitch deck PDF. Our AI analyzes your story, structure, and investor-readiness.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                Step 2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get AI Coaching</h3>
              <p className="text-muted-foreground">
                Practice your pitch with our AI coach. Get feedback on storytelling, delivery, and investor Q&A.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-3">
                Step 3
              </div>
              <h3 className="text-xl font-semibold mb-2">SlydS Review</h3>
              <p className="text-muted-foreground">
                Our team reviews your polished pitch. If there's a fit, we'll reach out to discuss next steps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coaching Features */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Pitch Coaching</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on the methodology that has helped 500+ startups raise $2B+
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Sparkles, text: 'Storytelling analysis - transform data into compelling narratives' },
              { icon: Award, text: 'Investor-readiness score across key pitch areas' },
              { icon: MessageSquare, text: 'Interactive AI coach for pitch practice' },
              { icon: Users, text: 'Simulated investor Q&A sessions' },
              { icon: TrendingUp, text: 'Track your progress and improvement' },
              { icon: CheckCircle, text: 'Unlimited practice until you\'re confident' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/signup/founder">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Practicing Your Pitch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why SlydS */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why SlydS?</h2>
              <p className="text-xl text-muted-foreground">
                India's leading fundraising advisory since 2013
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  We've helped startups from Seed to Series C and beyond. Our clients include companies that have gone on to become unicorns.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Storytelling Experts</h3>
                <p className="text-muted-foreground">
                  Great pitches aren't about data - they're about stories. We help you transform your vision into a narrative that investors can't ignore.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-semibold mb-3">AI + Human Expertise</h3>
                <p className="text-muted-foreground">
                  Our AI coach is trained on what actually works. Combined with our team's expertise, you get the best of both worlds.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Investor Network</h3>
                <p className="text-muted-foreground">
                  We work with top VCs and angels across India and globally. When you're ready, we can help you connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Perfect Your Pitch?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join 500+ founders who have transformed their pitch with SlydS
          </p>
          <Link href="/founder/upload">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Upload className="w-5 h-5 mr-2" />
              Submit Your Pitch Deck
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}