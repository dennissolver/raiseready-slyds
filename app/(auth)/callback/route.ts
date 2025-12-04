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
      // Check user_roles table for slyds_admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (roleData?.role === 'slyds_admin') {
        return NextResponse.redirect(`${requestUrl.origin}/slyds/dashboard`)
      }

      // Default to founder
      return NextResponse.redirect(`${requestUrl.origin}/founder/dashboard`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/`)
}