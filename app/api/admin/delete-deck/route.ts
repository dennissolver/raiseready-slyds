// app/api/admin/delete-deck/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const deckId = searchParams.get('deckId')

    if (!deckId) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
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

    // Get deck file URL before deletion
    const { data: deck } = await supabase
      .from('pitch_decks')
      .select('file_url')
      .eq('id', deckId)
      .single()

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    // Delete deck from database
    const { error: deleteError } = await supabase
      .from('pitch_decks')
      .delete()
      .eq('id', deckId)

    if (deleteError) {
      console.error('Error deleting deck:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete deck', details: deleteError.message },
        { status: 500 }
      )
    }

    // Delete from storage
    if (deck.file_url) {
      try {
        const url = new URL(deck.file_url)
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/)

        if (pathMatch) {
          const filePath = pathMatch[2]
          const { error: storageError } = await supabase.storage
            .from('pitch-decks')
            .remove([filePath])

          if (storageError) {
            console.error('Error deleting storage file:', storageError)
            // Don't fail the request if storage cleanup fails
          }
        }
      } catch (urlError) {
        console.error('Error parsing file URL:', urlError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Deck deleted successfully'
    })

  } catch (error) {
    console.error('Error in delete deck route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}