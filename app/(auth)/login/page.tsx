'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isChecking, setIsChecking] = useState(true)

  const getUserRole = async (userId: string): Promise<string> => {
    // Check founders table first
    const { data: founder, error: founderError } = await supabase
      .from('founders')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (!founderError && founder) {
      return (founder as any).user_role
    }

     // Check investor_profiles table
    const { data: investor, error: investorError } = await supabase
      .from('investor_profiles')
      .select('id')
      .eq('id', userId)
      .single() as { data: { user_role: string } | null, error: any }

    if (!investorError && investor) {
      return 'investor'
    }

    // Check pitch_decks table (if user created a pitch, they're a founder)
    const { data: pitchDeck, error: pitchError } = await supabase
      .from('pitch_decks')
      .select('founder_id')
      .eq('founder_id', userId)
      .limit(1)
      .single()

    if (!pitchError && pitchDeck) {
      return 'founder'
    }

    // Default to founder if no role found
    return 'founder'
  }

  const redirectToDashboard = async (userId: string) => {
    const role = await getUserRole(userId)

    console.log('User role detected:', role)

    if (role === 'investor') {
      console.log('Redirecting to investor dashboard')
      router.push('/investor/dashboard')
    } else {
      console.log('Redirecting to founder dashboard')
      router.push('/founder/dashboard')
    }
    router.refresh()
  }

  useEffect(() => {
    // Check if already logged in on mount
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('Already logged in, redirecting...')
        await redirectToDashboard(session.user.id)
      }
      setIsChecking(false)
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)

      if (event === 'SIGNED_IN' && session) {
        await redirectToDashboard(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your RaiseReady Impact account</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view="sign_in"
          providers={[]}
        />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  )
}