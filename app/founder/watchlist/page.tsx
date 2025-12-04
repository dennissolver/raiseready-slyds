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
import { safeDate } from '@/lib/utils/date'
import { Database } from '@/types/supabase'
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
import { useToast } from '@/hooks/use-toast'
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
type WatchlistItem = Database['public']['Tables']['founder_watchlist']['Row'] & {
  target: any // Will be either investor_profiles or pitch_decks
}

export default function FounderWatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [activeTab, setActiveTab] = useState<'investors' | 'projects'>('investors');
  const [notesText, setNotesText] = useState('');

  const supabase = createClient();
  const { toast } = useToast();
  const { isLoading: authLoading, user } = useAuth({
    requireAuth: true,
    requiredRole: 'founder',
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
    loadWatchlist();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, selectedTag, sortBy, activeTab]);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('founder_watchlist')
        .select('*')
        .eq('founder_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      // Load target details for each item
      const itemsWithDetails = await Promise.all(
        (data || []).map(async (item) => {
          if (item.target_type === 'investor') {
            const { data: investor } = await supabase
              .from('investor_profiles')
              .select('*')
              .eq('id', item.target_id)
              .single();

            return { ...item, target: investor };
          } else {
            const { data: project } = await supabase
              .from('pitch_decks')
              .select('*')
              .eq('founder_id', item.target_id)
              .eq('is_latest', true)
              .single();

            return { ...item, target: project };
          }
        })
      );

      setItems(itemsWithDetails.filter(item => item.target));
    } catch (error) {
      console.error('Error loading watchlist:', error);
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
    let filtered = items.filter(item => item.target_type === activeTab.slice(0, -1));

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const target = item.target;
        let searchableText = '';

        if (item.target_type === 'investor') {
          searchableText = [
            target?.name,
            target?.firm,
            target?.organization_name,
            ...(target?.sectors || target?.focus_areas || []),
          ].filter(Boolean).join(' ').toLowerCase();
        } else {
          searchableText = [
            target?.title,
            target?.one_liner,
            ...(target?.sectors || []),
          ].filter(Boolean).join(' ').toLowerCase();
        }

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
          const nameA = a.target_type === 'investor'
            ? (a.target?.organization_name || a.target?.firm || a.target?.name || '')
            : (a.target?.title || '');
          const nameB = b.target_type === 'investor'
            ? (b.target?.organization_name || b.target?.firm || b.target?.name || '')
            : (b.target?.title || '');
          return nameA.localeCompare(nameB);

        case 'recent':
        default:
          return safeDate(b.added_at).getTime() - safeDate(a.added_at).getTime();
      }
    });

    setFilteredItems(filtered);
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  };

  const updateNotes = async (watchlistId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('founder_watchlist')
        .update({ notes })
        .eq('id', watchlistId);

      if (error) throw error;

      setItems(prev =>
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

  const removeFromWatchlist = async (watchlistId: string) => {
    try {
      const { error } = await supabase
        .from('founder_watchlist')
        .delete()
        .eq('id', watchlistId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== watchlistId));

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
  const investorCount = items.filter(i => i.target_type === 'investor').length;
  const projectCount = items.filter(i => i.target_type === 'project').length;

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
              Track investors and projects you're following
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{investorCount}</div>
                <div className="text-sm text-muted-foreground">Investors Following</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{projectCount}</div>
                <div className="text-sm text-muted-foreground">Projects Following</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="mb-6">
              <TabsTrigger value="investors">
                Investors ({investorCount})
              </TabsTrigger>
              <TabsTrigger value="projects">
                Projects ({projectCount})
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
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
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="investors" className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No investors in watchlist</h3>
                    <p className="text-muted-foreground mb-4">
                      Start following investors you're interested in
                    </p>
                    <Button asChild>
                      <a href="/investors">Browse Investors</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Investor Card */}
                          <div className="flex-1">
                            <InvestorCard
                              investor={item.target}
                              isPublicView={false}
                              showWatchlist={false}
                              userRole="founder"
                              variant="compact"
                            />
                          </div>

                          {/* Watchlist Actions */}
                          <div className="lg:w-80 space-y-4">
                            {/* Added Date */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Added {safeDate(item.added_at).toLocaleDateString()}
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
                                    <DialogTitle>Notes</DialogTitle>
                                    <DialogDescription>
                                      Add private notes about this investor
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
                              onClick={() => removeFromWatchlist(item.id)}
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
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-96" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No projects in watchlist</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow other projects for inspiration or competitive analysis
                    </p>
                    <Button asChild>
                      <a href="/projects">Browse Projects</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Project Card */}
                          <div className="flex-1">
                            <ProjectCard
                              project={item.target}
                              isPublicView={false}
                              showWatchlist={false}
                              userRole="founder"
                              variant="compact"
                            />
                          </div>

                          {/* Watchlist Actions */}
                          <div className="lg:w-80 space-y-4">
                            {/* Added Date */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Added {safeDate(item.added_at).toLocaleDateString()}
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
                                    <DialogTitle>Notes</DialogTitle>
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
                              onClick={() => removeFromWatchlist(item.id)}
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
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}