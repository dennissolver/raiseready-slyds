'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { InvestorCard } from '@/components/investors/investor-card';
import { FilterSidebar, INVESTOR_FILTERS, ActiveFilters } from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InvestorProfile } from '@/types/watchlist';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { safeDate } from '@/lib/utils/date';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<InvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'ticket_size'>('recent');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'founder' | 'investor' | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    loadInvestors();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [investors, searchQuery, sortBy, activeFilters]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);

    if (user) {
      // Get user role from founders table
      const { data } = await supabase
        .from('founders')
        .select('user_role')
        .eq('id', user.id)
        .single();

      const role = data?.user_role;
      if (role === 'founder' || role === 'investor') {
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    }
  };

  const loadInvestors = async () => {
    try {
      setIsLoading(true);

      // Build query based on authentication status
      let query = supabase
        .from('investor_profiles')
        .select('*');

      // If not authenticated, only show public profiles
      if (!isAuthenticated) {
        query = query.eq('profile_visibility', 'public');
      } else {
        // If authenticated, show public and platform-only
        query = query.in('profile_visibility', ['public', 'platform-only']);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // ✅ FIXED: No type casting needed - Supabase types match perfectly
      setInvestors(data || []);
    } catch (error) {
      console.error('Error loading investors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...investors];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(investor => {
        const searchableText = [
          investor.name,
          investor.firm,
          investor.organization_name,
          investor.investor_type,
          ...(investor.sectors || []),
          ...(investor.focus_areas || []),
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (activeFilters.sectors && activeFilters.sectors.length > 0) {
      filtered = filtered.filter(investor => {
        const investorSectors = investor.sectors || investor.focus_areas || [];
        return activeFilters.sectors.some((sector: string) =>
          investorSectors.includes(sector)
        );
      });
    }

    if (activeFilters.stages && activeFilters.stages.length > 0) {
      filtered = filtered.filter(investor => {
        const investorStages = investor.stages || [];
        return activeFilters.stages.some((stage: string) =>
          investorStages.includes(stage)
        );
      });
    }

    if (activeFilters.geographies && activeFilters.geographies.length > 0) {
      filtered = filtered.filter(investor => {
        const investorGeos = investor.geographies || [];
        return activeFilters.geographies.some((geo: string) =>
          investorGeos.includes(geo)
        );
      });
    }

    if (activeFilters.investor_type && activeFilters.investor_type.length > 0) {
      filtered = filtered.filter(investor =>
        activeFilters.investor_type.includes(investor.investor_type || '')
      );
    }

    if (activeFilters.ticket_size) {
      const [min, max] = activeFilters.ticket_size;
      filtered = filtered.filter(investor => {
        const investorMin = investor.min_ticket_size || investor.check_size_min || 0;
        const investorMax = investor.max_ticket_size || investor.check_size_max || Infinity;

        // Investor range overlaps with filter range
        return investorMin <= max && investorMax >= min;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = a.organization_name || a.firm || a.name || '';
          const nameB = b.organization_name || b.firm || b.name || '';
          return nameA.localeCompare(nameB);

        case 'ticket_size':
          const maxA = a.max_ticket_size || a.check_size_max || 0;
          const maxB = b.max_ticket_size || b.check_size_max || 0;
          return maxB - maxA;

        case 'recent':
        default:
          return safeDate(b.created_at).getTime() - safeDate(a.created_at).getTime();
      }
    });

    setFilteredInvestors(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Impact Investors</h1>
            <p className="text-lg text-muted-foreground">
              {isAuthenticated
                ? 'Connect with investors who share your impact vision'
                : 'Discover our network of impact investors'}
            </p>

            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  🔒 <strong>Sign in</strong> to view full investor profiles, access contact information, and save investors to your watchlist.
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{investors.length}</div>
                <div className="text-sm text-muted-foreground">Active Investors</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {investors.filter(i => (i.sectors || i.focus_areas || []).length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">With Sector Focus</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {investors.filter(i => i.priority_sdgs && i.priority_sdgs.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Impact-First</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={INVESTOR_FILTERS}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                resultCount={filteredInvestors.length}
              />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Search and Sort Controls */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search investors by name, focus area, or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={clearSearch}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {Object.keys(activeFilters).length > 0 && (
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {Object.keys(activeFilters).length}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <FilterSidebar
                        filters={INVESTOR_FILTERS}
                        activeFilters={activeFilters}
                        onFilterChange={setActiveFilters}
                        resultCount={filteredInvestors.length}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort and Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredInvestors.length} of {investors.length} investors
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="ticket_size">Ticket Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Investor Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              ) : filteredInvestors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No investors found matching your criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveFilters({});
                      setSearchQuery('');
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredInvestors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      isPublicView={!isAuthenticated}
                      showWatchlist={isAuthenticated}
                      userRole={userRole || undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}