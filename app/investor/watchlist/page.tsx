// app/investor/watchlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProjectCard } from '@/components/projects/project-card';
import { InvestorCard } from '@/components/investors/investor-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { safeDate } from '@/lib/utils/date';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookmarkCheck,
  Search,
  StickyNote,
  Tag,
  Trash2,
  Calendar
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { Database } from '@/types/database';

type WatchlistItem = Database['public']['Tables']['investor_watchlist']['Row'] & {
  projects: Database['public']['Tables']['pitch_decks']['Row'] | null;
};

type NetworkWatchlistItem = Database['public']['Tables']['investor_network_watchlist']['Row'] & {
  investor_profiles: Database['public']['Tables']['investor_profiles']['Row'] | null;
};

export default function InvestorWatchlistPage() {
  const [projects, setProjects] = useState<WatchlistItem[]>([]);
  const [investors, setInvestors] = useState<NetworkWatchlistItem[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<WatchlistItem[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<NetworkWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'name'>('recent');
  const [activeTab, setActiveTab] = useState('projects');
  const [notesText, setNotesText] = useState('');

  const supabase = createClient();
  const { toast } = useToast();
  const { isLoading: authLoading } = useAuth({
    requireAuth: true,
    requiredRole: 'investor',
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadWatchlists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, investors, searchQuery, selectedTag, sortBy, activeTab]);

  const loadWatchlists = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Load watched projects with manual join
      const { data: projectsData, error: projectsError } = await supabase
        .from('investor_watchlist')
        .select('*, pitch_decks!investor_watchlist_founder_id_fkey(*)')
        .eq('investor_id', user.id)
        .order('added_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Map to proper structure - Supabase returns pitch_decks as array, we need single object
      const validProjects = (projectsData || [])
        .map(item => ({
          ...item,
          projects: Array.isArray(item.pitch_decks) && item.pitch_decks.length > 0
            ? item.pitch_decks.find(pd => pd.is_latest) || item.pitch_decks[0]
            : null
        })) as WatchlistItem[];

      setProjects(validProjects.filter(p => p.projects));

      // Load watched investors (network)
      const { data: investorsData, error: investorsError } = await supabase
        .from('investor_network_watchlist')
        .select('*, investor_profiles!investor_network_watchlist_target_investor_id_fkey(*)')
        .eq('investor_id', user.id)
        .order('added_at', { ascending: false });

      if (investorsError) throw investorsError;

      // Map to proper structure
      const validInvestors = (investorsData || [])
        .map(item => ({
          ...item,
          investor_profiles: Array.isArray(item.investor_profiles) && item.investor_profiles.length > 0
            ? item.investor_profiles[0]
            : null
        })) as NetworkWatchlistItem[];

      setInvestors(validInvestors.filter(i => i.investor_profiles));
    } catch (error) {
      console.error('Error loading watchlists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load watchlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (activeTab === 'projects') {
      let filtered = [...projects];

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const project = item.projects;
          if (!project) return false;

          const searchableText = [
            project.title,
            project.one_liner,
            ...(project.sectors || []),
          ].filter(Boolean).join(' ').toLowerCase();

          return searchableText.includes(query);
        });
      }

      // Apply tag filter
      if (selectedTag !== 'all') {
        filtered = filtered.filter(item =>
          item.tags?.includes(selectedTag)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.projects?.title || '').localeCompare(b.projects?.title || '');
          case 'score':
            return (b.projects?.readiness_score || 0) - (a.projects?.readiness_score || 0);
          case 'recent':
          default:
            return safeDate(b.added_at).getTime() - safeDate(a.added_at).getTime();
        }
      });

      setFilteredProjects(filtered);
    } else {
      let filtered = [...investors];

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const investor = item.investor_profiles;
          if (!investor) return false;

          const searchableText = [
            investor.name,
            investor.firm,
            investor.organization_name,
            ...(investor.sectors || []),
          ].filter(Boolean).join(' ').toLowerCase();

          return searchableText.includes(query);
        });
      }

      setFilteredInvestors(filtered);
    }
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    projects.forEach(item => {
      item.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  };

  const updateNotes = async (watchlistId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('investor_watchlist')
        .update({ notes })
        .eq('id', watchlistId);

      if (error) throw error;

      setProjects(prev =>
        prev.map(item =>
          item.id === watchlistId ? { ...item, notes } : item
        )
      );

      toast({
        title: 'Notes updated',
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive',
      });
    }
  };

  const removeFromWatchlist = async (watchlistId: string, type: 'project' | 'investor') => {
    try {
      const table = type === 'project' ? 'investor_watchlist' : 'investor_network_watchlist';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', watchlistId);

      if (error) throw error;

      if (type === 'project') {
        setProjects(prev => prev.filter(p => p.id !== watchlistId));
      } else {
        setInvestors(prev => prev.filter(i => i.id !== watchlistId));
      }

      toast({
        title: 'Removed from watchlist',
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from watchlist',
        variant: 'destructive',
      });
    }
  };

  const allTags = getAllTags();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <BookmarkCheck className="w-8 h-8" />
              <h1 className="text-4xl font-bold">My Watchlist</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Track projects and investors you're interested in
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Projects Watching</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {projects.filter(p => (p.projects?.readiness_score || 0) >= 80).length}
                </div>
                <div className="text-sm text-muted-foreground">Investment Ready</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{investors.length}</div>
                <div className="text-sm text-muted-foreground">Investors Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="projects">
                Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="investors">
                Investor Network ({investors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {allTags.length > 0 && (
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map((tag: string) => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="score">Highest Score</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-96" />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No projects in watchlist</h3>
                    <p className="text-muted-foreground mb-4">
                      Start adding projects you're interested in
                    </p>
                    <Button asChild>
                      <a href="/projects">Browse Projects</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredProjects.map((item) => {
                    if (!item.projects) return null;

                    return (
                      <Card key={item.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Project Card */}
                            <div className="flex-1">
                              <ProjectCard
                                project={item.projects}
                                isPublicView={false}
                                showWatchlist={false}
                                userRole="investor"
                                variant="compact"
                              />
                            </div>

                            {/* Watchlist Actions */}
                            <div className="lg:w-80 space-y-4">
                              {/* Added Date */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Added {item.added_at ? safeDate(item.added_at).toLocaleDateString() : 'Unknown'}
                              </div>

                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {item.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Notes */}
                              <div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full">
                                      <StickyNote className="w-4 h-4 mr-2" />
                                      {item.notes ? 'Edit Notes' : 'Add Notes'}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Notes for {item.projects.title}</DialogTitle>
                                      <DialogDescription>
                                        Add private notes about this project
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Textarea
                                      placeholder="Your private notes..."
                                      defaultValue={item.notes || ''}
                                      onChange={(e) => setNotesText(e.target.value)}
                                      rows={6}
                                    />
                                    <DialogFooter>
                                      <Button onClick={() => {
                                        updateNotes(item.id, notesText);
                                        setNotesText('');
                                      }}>
                                        Save Notes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={() => removeFromWatchlist(item.id, 'project')}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          {/* Display Notes if exists */}
                          {item.notes && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium mb-1">Your Notes:</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="investors" className="space-y-6">
              {/* Investor Network List */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              ) : filteredInvestors.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No investors in network</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow other investors for co-investment opportunities
                    </p>
                    <Button asChild>
                      <a href="/investors">Browse Investors</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredInvestors.map((item) => {
                    if (!item.investor_profiles) return null;

                    return (
                      <Card key={item.id}>
                        <CardContent className="p-6">
                          <InvestorCard
                            investor={item.investor_profiles}
                            isPublicView={false}
                            showWatchlist={false}
                            userRole="investor"
                          />
                          <div className="mt-4 flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromWatchlist(item.id, 'investor')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Unfollow
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}