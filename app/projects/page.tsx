'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProjectCard } from '@/components/projects/project-card';
import { FilterSidebar, PROJECT_FILTERS, ActiveFilters } from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { PitchDeck } from '@/types/watchlist';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PitchDeck[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PitchDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'name'>('recent');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'founder' | 'investor' | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [projects, searchQuery, sortBy, activeFilters]);

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

  const loadProjects = async () => {
    try {
      setIsLoading(true);

      // Build query based on authentication status
      let query = supabase
        .from('pitch_decks')
        .select('*')
        .eq('is_latest', true); // Only get latest versions

      // If not authenticated, only show public projects
      if (!isAuthenticated) {
        query = query.eq('visibility', 'public');
      } else {
        // If authenticated, show public and platform-only
        query = query.in('visibility', ['public', 'platform-only']);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;

      // ✅ FIXED: No type casting needed - Supabase types match perfectly
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...projects];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        const searchableText = [
          project.title,
          project.one_liner,
          ...(project.sectors || []),
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (activeFilters.sectors && activeFilters.sectors.length > 0) {
      filtered = filtered.filter(project => {
        const projectSectors = project.sectors || [];
        return activeFilters.sectors.some((sector: string) =>
          projectSectors.includes(sector)
        );
      });
    }

    if (activeFilters.funding_stage && activeFilters.funding_stage.length > 0) {
      filtered = filtered.filter(project =>
        activeFilters.funding_stage.includes(project.funding_stage || '')
      );
    }

    if (activeFilters.target_market && activeFilters.target_market.length > 0) {
      filtered = filtered.filter(project =>
        activeFilters.target_market.includes(project.target_market || '')
      );
    }

    if (activeFilters.readiness_score) {
      const [min, max] = activeFilters.readiness_score;
      filtered = filtered.filter(project =>
        (project.readiness_score ?? 0) >= min && (project.readiness_score ?? 0) <= max
      );
    }

    if (activeFilters.sdgs && activeFilters.sdgs.length > 0) {
      filtered = filtered.filter(project => {
        const projectSdgs = project.sdgs || [];
        return activeFilters.sdgs.some((sdg: string) =>
          projectSdgs.includes(parseInt(sdg))
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);

        case 'score':
          return (b.readiness_score ?? 0) - (a.readiness_score ?? 0);

        case 'recent':
        default:
          return safeDate(b.updated_at).getTime() - safeDate(a.updated_at).getTime();
      }
    });

    setFilteredProjects(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Calculate stats
  const avgScore = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.readiness_score ?? 0), 0) / projects.length)
    : 0;

  const highScoreCount = projects.filter(p => (p.readiness_score ?? 0) >= 80).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Impact Projects</h1>
            <p className="text-lg text-muted-foreground">
              {isAuthenticated
                ? 'Discover investment-ready impact projects'
                : 'Explore our showcase of impact projects'}
            </p>

            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  🔒 <strong>Sign in</strong> to view full project details, pitch decks, and save projects to your watchlist.
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{avgScore}</div>
                <div className="text-sm text-muted-foreground">Avg Readiness Score</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{highScoreCount}</div>
                <div className="text-sm text-muted-foreground">Investment Ready (80+)</div>
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
                filters={PROJECT_FILTERS}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                resultCount={filteredProjects.length}
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
                      placeholder="Search projects by name, description, or sector..."
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
                        filters={PROJECT_FILTERS}
                        activeFilters={activeFilters}
                        onFilterChange={setActiveFilters}
                        resultCount={filteredProjects.length}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort and Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="score">Highest Score</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-96" />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No projects found matching your criteria
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
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
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