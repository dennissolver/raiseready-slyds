import { InvestorManagementTable } from '@/components/admin/investor-management-table'
import { createClient } from '@/lib/supabase/server'

export default async function AdminInvestorsPage() {
  const supabase = await createClient()

  // Fetch all investors (from founders table where user_role = 'investor')
  const { data: investorsData, error } = await supabase
    .from('founders')
    .select(`
      id,
      email,
      name,
      created_at,
      user_role
    `)
    .eq('user_role', 'investor')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching investors:', error)
  }

  // Get investor profiles for additional data
  const investorIds = investorsData?.map(i => i.id) || []

  const { data: profilesData } = await supabase
    .from('investor_profiles')
    .select('founder_id, organization_name, investor_type, priority_sdgs')
    .in('founder_id', investorIds)

  // Create a map of profiles by founder_id
  const profilesMap = profilesData?.reduce((acc, profile) => {
    acc[profile.founder_id] = profile
    return acc
  }, {} as Record<string, any>) || {}

  // Get watchlist counts for each investor
  const { data: watchlistData } = await supabase
    .from('investor_watchlist')
    .select('investor_id')
    .in('investor_id', investorIds)

  const watchlistCountMap = watchlistData?.reduce((acc, item) => {
    acc[item.investor_id] = (acc[item.investor_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Format data for the table
  const investors = investorsData?.map(investor => {
    const profile = profilesMap[investor.id] || {}
    return {
      id: investor.id,
      email: investor.email,
      name: investor.name || undefined,
      organization_name: profile.organization_name || undefined,
      investor_type: profile.investor_type || undefined,
      priority_sdgs: profile.priority_sdgs || undefined,
      created_at: investor.created_at,
      watchlist_count: watchlistCountMap[investor.id] || 0,
    }
  }) || []

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Manage Investors</h1>
        <p className="text-muted-foreground">
          View, manage, and delete investor accounts and their associated data
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total Investors: <span className="font-semibold">{investors.length}</span>
        </div>
      </div>

      <InvestorManagementTable investors={investors} />
    </div>
  )
}