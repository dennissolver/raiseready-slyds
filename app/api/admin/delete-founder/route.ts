
// app/api/admin/delete-founder/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const founderId = searchParams.get('founderId')

    if (!founderId) {
      return NextResponse.json(
        { error: 'Founder ID is required' },
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

    // Get founder's deck file URLs before deletion (for storage cleanup)
    const { data: decks } = await supabase
      .from('pitch_decks')
      .select('file_url, file_name')
      .eq('founder_id', founderId)

    // Delete founder (should cascade to related tables if FK constraints set up properly)
    const { error: deleteError } = await supabase
      .from('founders')
      .delete()
      .eq('id', founderId)

    if (deleteError) {
      console.error('Error deleting founder:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete founder', details: deleteError.message },
        { status: 500 }
      )
    }

    // Clean up storage files if they exist
    if (decks && decks.length > 0) {
      const filePaths = decks
        .map(d => {
          // Extract path from file_url (e.g., "bucket/path/to/file.pdf")
          if (d.file_url) {
            const url = new URL(d.file_url)
            const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/)
            if (pathMatch) {
              return pathMatch[2] // Return just the file path within bucket
            }
          }
          return null
        })
        .filter(Boolean) as string[]

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('pitch-decks')
          .remove(filePaths)

        if (storageError) {
          console.error('Error deleting storage files:', storageError)
          // Don't fail the request if storage cleanup fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Founder and all related data deleted successfully'
    })

  } catch (error) {
    console.error('Error in delete founder route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}