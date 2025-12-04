// app/api/slyds/delete-profile/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an slyds
    const { data: investorCheck } = await supabase
      .from('founders')
      .select('user_role')
      .eq('id', user.id)
      .single()

    if (!investorCheck || investorCheck.user_role !== 'investor') {
      return NextResponse.json(
        { error: 'Only investors can delete their own profile' },
        { status: 403 }
      )
    }

    // Delete slyds profile (CASCADE will handle related data)
    const { error: deleteError } = await supabase
      .from('founders')
      .delete()
      .eq('id', user.id)
      .eq('user_role', 'investor')

    if (deleteError) {
      console.error('Error deleting slyds profile:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete profile', details: deleteError.message },
        { status: 500 }
      )
    }

    // Sign out the user after deleting their profile
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Your profile has been permanently deleted'
    })

  } catch (error) {
    console.error('Error in slyds delete profile route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}