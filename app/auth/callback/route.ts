import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: founder } = await supabase
        .from('founders')
        .select('user_role')
        .eq('id', user.id)
        .single()

      if (founder?.user_role === 'investor') {
        return NextResponse.redirect(`${requestUrl.origin}/investor/dashboard`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/founder/upload`)
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/`)
}