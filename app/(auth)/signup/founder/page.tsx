'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function FounderSignupPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        // Create founder profile if it doesn't exist
        const { error } = await supabase
          .from('founders')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            user_role: 'founder',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (error) {
          console.error('Error creating founder profile:', error)
        }

        // Redirect to founder dashboard
        router.push('/founder/dashboard')
        router.refresh()
      }
    })
    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>For Impact Founders:</strong> Get AI coaching on your social impact pitch. Refine your theory of change and connect with mission-aligned investors. FREE to use!
          </p>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Founder Account</h1>
          <p className="text-muted-foreground">Start improving your impact pitch today</p>
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
          Are you an impact investor? <a href="/signup/investor" className="text-primary hover:underline">Sign up here</a>
        </div>
      </div>
    </div>
  )
}