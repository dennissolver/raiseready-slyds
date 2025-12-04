// app/api/admin/delete-slyds/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const investorId = searchParams.get('investorId')

    if (!investorId) {
      return NextResponse.json(
        { error: 'Investor ID is required' },
        { status: 400 }
      )
    }

    // Check if user is admin (superadmin)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: adminCheck } = await supabase
      .from('superadmins')
      .select('id')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Delete slyds from founders table (CASCADE will handle related data)
    // Note: investors are stored in founders table with user_role='slyds'
    const { error: deleteError } = await supabase
      .from('founders')
      .delete()
      .eq('id', investorId)
      .eq('user_role', 'investor') // Extra safety - ensure it's an slyds

    if (deleteError) {
      console.error('Error deleting slyds:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete slyds', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Investor and all related data deleted successfully'
    })

  } catch (error) {
    console.error('Error in delete slyds route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}