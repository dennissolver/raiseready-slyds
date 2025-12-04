import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Get user to check their role
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check founder profile for role
      const { data: founder } = await supabase
        .from('founders')
        .select('user_role')
        .eq('id', user.id)
        .single() as { data: { user_role: string } | null }

      // Route based on role
      if (founder?.user_role === 'investor') {
        return NextResponse.redirect(`${requestUrl.origin}/investor/dashboard`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/founder/dashboard`)
      }
    }
  }

  // Default fallback
  return NextResponse.redirect(`${requestUrl.origin}/`)
}