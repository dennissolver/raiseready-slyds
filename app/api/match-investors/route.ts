import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { deckId, founderId } = await request.json()

    if (!deckId || !founderId) {
      return NextResponse.json({ error: 'Missing deckId or founderId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get deck and analysis
    const { data: deck } = await supabase
      .from('pitch_decks')
      .select('*, deck_analysis(*)')
      .eq('id', deckId)
      .single()

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Get founder data
    const { data: founder } = await supabase
      .from('founders')
      .select('*')
      .eq('id', founderId)
      .single()

    // Get founder profile
    const { data: founderProfile } = await supabase
      .from('founder_profiles')
      .select('*')
      .eq('founder_id', founderId)
      .single()

    // Get all investors WITH their discovery sessions
    const { data: investors } = await supabase
      .from('investors')
      .select(`
        *,
        investor_discovery_sessions(*)
      `)

    if (!investors || investors.length === 0) {
      console.log('No investors in database yet')
      return NextResponse.json({ success: true, matches: [] })
    }

    const analysis = deck.deck_analysis?.[0]
    const matches = []

    // Match algorithm
    for (const investor of investors) {
      let score = 0
      const reasons = []

      // CRITICAL: Check minimum readiness score first
      if ((deck.readiness_score || 0) < (investor.min_readiness_score || 70)) {
        continue // Skip this investor - founder not ready yet
      }

      // Get discovery session data
      const discoverySession = Array.isArray((investor as any).investor_discovery_sessions)
        ? (investor as any).investor_discovery_sessions[0]
        : (investor as any).investor_discovery_sessions
      const extractedCriteria = discoverySession?.extracted_criteria || {}

      // Check deal breakers from investor discovery
      const hasDealBreaker = extractedCriteria.deal_breakers?.some((breaker: string) => {
        const breakerLower = breaker.toLowerCase()

        // Check common deal breakers
        if (breakerLower.includes('no b2c') && founderProfile?.founder_type === 'b2c') {
          return true
        }
        if (breakerLower.includes('must have revenue') && !founder?.has_revenue) {
          return true
        }
        if (breakerLower.includes('no hardware') && founderProfile?.founder_type?.includes('hardware')) {
          return true
        }

        return false
      })

      if (hasDealBreaker) {
        continue // Skip - deal breaker present
      }

      // Geography match (30 points)
      const requiredGeography = extractedCriteria.geography_focus || investor.geography || []
      const deckGeography = founderProfile?.target_market || 'global'
      if (requiredGeography.includes('global') ||
          requiredGeography.includes(deckGeography) ||
          requiredGeography.length === 0) {
        score += 30
        reasons.push(`Invests in ${deckGeography}`)
      }

      // Sector match (25 points)
      const requiredSectors = extractedCriteria.required_sectors || investor.sectors || []
      const deckSector = founderProfile?.founder_type || ''
      const sectorMatch = requiredSectors.some((s: string) =>
        deckSector.includes(s) || s.includes(deckSector)
      )
      if (sectorMatch) {
        score += 25
        reasons.push(`Focuses on your sector`)
      }

      // Stage match (15 points)
      const preferredStages = extractedCriteria.preferred_stages || investor.stage || []
      const fundingStage = founderProfile?.funding_stage || 'seed'
      if (preferredStages.includes(fundingStage)) {
        score += 15
        reasons.push(`Invests at ${fundingStage} stage`)
      }

      // SDG alignment (20 points)
      if (investor.sdgs && investor.sdgs.length > 0) {
        score += 20
        reasons.push(`Aligned on impact goals`)
      }

      // Bonus: Readiness above their threshold
      if ((deck.readiness_score || 0) >= (investor.min_readiness_score || 70) + 10) {
        score += 10
        reasons.push(`Your deck exceeds their quality bar`)
      } else if ((deck.readiness_score || 0) >= (investor.min_readiness_score || 70)) {
        score += 5
        reasons.push(`Meets their quality threshold`)
      }

      // Only save matches with score >= 40
      if (score >= 40) {
        matches.push({
          investor_id: investor.id,
          investor_name: investor.name,
          score,
          reasons
        })

        // Save to database
        await supabase
          .from('founder_investor_matches')
          .upsert({
            founder_id: founderId,
            investor_id: investor.id,
            deck_id: deckId,
            match_score: score,
            match_reasons: reasons,
            status: 'suggested'
          }, {
            onConflict: 'founder_id,investor_id,deck_id'
          })
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score)

    console.log(`Found ${matches.length} investor matches for deck ${deckId}`)

    return NextResponse.json({
      success: true,
      matches: matches.slice(0, 10) // Return top 10
    })

  } catch (error: any) {
    console.error('Investor matching error:', error)
    return NextResponse.json({
      error: error.message || 'Matching failed'
    }, { status: 500 })
  }
}

// GET endpoint to retrieve matches for a founder
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get matches for this founder
    const { data: matches, error } = await supabase
      .from('founder_investor_matches')
      .select(`
        *,
        investors (
          id,
          name,
          description,
          website,
          geography,
          sectors,
          stage,
          ticket_size,
          portfolio_size,
          rating
        )
      `)
      .eq('founder_id', user.id)
      .order('match_score', { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json({ success: true, matches })

  } catch (error: any) {
    console.error('Get matches error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get matches'
    }, { status: 500 })
  }
}