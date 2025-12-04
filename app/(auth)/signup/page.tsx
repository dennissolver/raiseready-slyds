'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, Filter, Eye, Clock } from 'lucide-react'

export default function InvestorSignupPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        // Create both founder profile (for compatibility) and investor profile
        const { error: founderError } = await supabase
          .from('founders')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            user_role: 'investor',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (founderError) {
          console.error('Error creating founder profile:', founderError)
        }

        // Create investor profile
        const { error: investorError } = await supabase
          .from('investor_profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email
          }, {
            onConflict: 'id'
          })

        if (investorError) {
          console.error('Error creating investor profile:', investorError)
        }

        // Redirect to investor dashboard
        router.push('/investor/dashboard')
        router.refresh()
      }
    })
    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left: Benefits */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Impact Investor Benefits</h1>
                <p className="text-muted-foreground">Mission-aligned deal flow with complete privacy and control</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complete Privacy & Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is never shared with founders. You remain anonymous until you choose to reach out. No cold calls, no spam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Filter className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Impact-First Filtering</h3>
                    <p className="text-sm text-muted-foreground">
                      Filter by SDG alignment, ESG criteria, impact thesis, and geographic focus. Only see social enterprises that match YOUR mission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Review Impact Metrics First</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse theory of change, impact metrics, and financial sustainability. Only reach out when you see values alignment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Save Time on Impact Sourcing</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI pre-scores every social enterprise for impact readiness and financial viability. Only see mission-aligned, investor-ready founders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-900">
                  <strong>💡 How it works:</strong> After signup, you'll chat with our AI impact investment coach to define your thesis - including SDG priorities, patient capital preferences, and social return expectations. We'll use that to match you with mission-aligned founders.
                </p>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg lg:sticky lg:top-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Create Impact Investor Account</h2>
                <p className="text-muted-foreground">Join mission-driven investors using RaiseReady Impact</p>
              </div>

              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                view="sign_up"
                providers={[]}
              />

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Are you a founder? <a href="/signup/founder" className="text-primary hover:underline">Sign up here</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}