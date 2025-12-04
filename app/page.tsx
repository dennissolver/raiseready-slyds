// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, FileText, Target, Sparkles, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Slyd<span className="text-red-500">S</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="https://slyds.com" className="text-sm text-gray-400 hover:text-white transition">
              About SlydS
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup/founder">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <p className="text-gray-400 mb-4 text-lg">Take your next big leap with us</p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Want to be the next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                UNICORN
              </span>
              ,<br />
              become a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                STORYTELLER
              </span>
              .
            </h1>

            <p className="text-xl text-gray-300 mb-4 max-w-2xl">
              Or hire SlydS because we have created pitch decks that have closed millions
              in investments for leading startups and billion-dollar unicorns.
            </p>

            <p className="text-red-400 font-semibold text-lg mb-8">Time is nigh!</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup/founder">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-20 right-10 hidden lg:block">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-bold text-red-400">$2B+</div>
            <div className="text-gray-400">Raised for startups</div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Vision.<br />
              Our Expertise.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Infinite Possibilities.
              </span>
            </h2>
            <p className="text-xl text-gray-400 mt-6">
              From Seed to IPO: Engineering Growth Capital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-red-500/50 transition">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Deck Analysis</h3>
              <p className="text-gray-400">
                Upload your pitch deck and get instant, actionable feedback powered by AI trained on thousands of successful raises.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-red-500/50 transition">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Mic className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Pitch Practice</h3>
              <p className="text-gray-400">
                Practice your pitch with Shamini, your AI coach. Get real-time feedback on delivery, clarity, and investor readiness.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-red-500/50 transition">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Story Discovery</h3>
              <p className="text-gray-400">
                Uncover the compelling narrative in your startup through guided AI sessions that help you articulate your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Startups Helped</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-red-400 mb-2">$2B+</div>
              <div className="text-gray-400">Total Raised</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Your journey to becoming investor-ready</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Upload Deck', desc: 'Share your pitch deck' },
              { step: '2', title: 'Get Analysis', desc: 'AI reviews your pitch' },
              { step: '3', title: 'Story Discovery', desc: 'Find your narrative' },
              { step: '4', title: 'Refine Materials', desc: 'Improve with AI coaching' },
              { step: '5', title: 'Practice Pitch', desc: 'Voice practice with AI' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-900/50 to-orange-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to tell your story?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of founders who have transformed their pitches and raised successfully with SlydS.
          </p>
          <Link href="/signup/founder">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-lg font-semibold">
              Start Your Journey
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold mb-4">
                Slyd<span className="text-red-500">S</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's leading fundraising advisory. From Seed to IPO.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Investment Decks</li>
                <li>Valuation Model</li>
                <li>Teasers</li>
                <li>Financial Model</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://slyds.com" className="hover:text-white">Successes</Link></li>
                <li><Link href="https://slyds.com" className="hover:text-white">Solutions</Link></li>
                <li><Link href="https://slyds.com" className="hover:text-white">Spotlight</Link></li>
                <li><Link href="https://slyds.com" className="hover:text-white">Specialists</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">India</h4>
              <p className="text-sm text-gray-400 mb-4">
                4th floor, #102 Sanctuary 2nd Cross,<br />
                36th Main Rd, KAS Officers Colony,<br />
                BTM 2nd Stage, Bengaluru, Karnataka 560068
              </p>
              <h4 className="font-semibold mb-2">USA</h4>
              <p className="text-sm text-gray-400">
                12020 Sunrise Valley Drive Suite 100<br />
                Reston, VA 20191
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SlydS. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="https://slyds.com" className="text-sm text-gray-500 hover:text-white">
                slyds.com
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}