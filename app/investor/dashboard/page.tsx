'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { safeDate } from '@/lib/utils/date'
import {
  TrendingUp,
  Users,
  Settings,
  Target,
  Calculator,
  MessageSquare,
  Edit,
  CheckCircle2,
  AlertCircle,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function InvestorDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const { isLoading: authLoading, user } = useAuth({
    requireAuth: true,
    requiredRole: 'investor',
  });

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [hasCompletedDiscovery, setHasCompletedDiscovery] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

    const loadDashboardData = async () => {
      try {
        if (!user) return;

        // Check if first visit (created within last hour)
        const { data: founder } = await supabase
          .from('founders')
          .select('created_at')
          .eq('id', user.id)
          .single();

        if (founder) {
          const createdAt = safeDate(founder.created_at);
          const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
          setIsFirstVisit(createdAt > hourAgo);
        }

        // Load investor profile
        // ? CHANGE: Use .eq('id', user.id) instead of .eq('investor_id', user.id)
        const { data: profileData } = await supabase
          .from('investor_profiles')
          .select('*')
          .eq('id', user.id)  // ? FIXED: Was 'investor_id'
          .single();

        if (profileData) {
          setProfile(profileData);
          const completion = calculateProfileCompletion(profileData);
          setProfileCompletion(completion);
        } else {
          setIsFirstVisit(true);
        }

        // Check if discovery completed
        // ? CHANGE: Use .maybeSingle() instead of .single() to avoid error when no rows
        const { data: session } = await supabase
          .from('investor_discovery_sessions')
          .select('completed_at, extracted_criteria')
          .eq('investor_id', user.id)  // ? CORRECT: This one IS investor_id
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();  // ? FIXED: Was .single()

        setHasCompletedDiscovery(!!session?.completed_at);

        // Load matches
        if (session?.completed_at) {
          const { data: matchesData } = await supabase
            .from('founder_investor_matches')
            .select(`
              *,
              founders (
                id,
                email,
                name,
                founder_type,
                funding_stage,
                target_market
              ),
              pitch_decks (
                id,
                title,
                readiness_score,
                created_at
              )
            `)
            .eq('investor_id', user.id)
            .order('match_score', { ascending: false })
            .limit(10);

          setMatches(matchesData || []);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

  const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;

    let completed = 0;
    let total = 12;

    // Basic info (4 fields)
    if (profile.organization_name) completed++;
    if (profile.investor_type) completed++;
    if (profile.website_url) completed++;
    if (profile.linkedin_url) completed++;

    // Investment params (5 fields)
    if (profile.min_ticket_size) completed++;
    if (profile.max_ticket_size) completed++;
    if (profile.stages?.length > 0) completed++;
    if (profile.sectors?.length > 0) completed++;
    if (profile.geographies?.length > 0) completed++;

    // Thesis (3 fields)
    if (profile.investment_philosophy) completed++;
    if (profile.deal_breakers) completed++;
    if (profile.ideal_founder_profile) completed++;

    return Math.round((completed / total) * 100);
  };

  const SDG_NAMES: { [key: number]: string } = {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water',
    7: 'Clean Energy',
    8: 'Economic Growth',
    9: 'Infrastructure',
    10: 'Reduced Inequality',
    11: 'Sustainable Cities',
    13: 'Climate Action',
    15: 'Life on Land'
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Investor Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/investor/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="matches" className="gap-2">
              <Users className="w-4 h-4" />
              Matches ({matches.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card - Show on first visit or if profile incomplete */}
            {(isFirstVisit || profileCompletion === 0) && (
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to RaiseReady! ??</CardTitle>
                  <CardDescription>
                    Let&apos;s build your investment thesis in 3 simple steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      To match you with the right founders, we need to understand your investment approach.
                      You can complete these steps in any order, but we recommend this sequence:
                    </p>

                    {/* Step-by-step guide */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Step 2: Profile Form */}
                      <Card className="bg-white border-2 border-blue-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              1
                            </div>
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Fill in your investment parameters: stages, sectors, geography, and ticket size.
                          </p>
                          <Badge className="text-xs bg-blue-600 mb-3">
                            Required � ~5 minutes
                          </Badge>
                          <Link href="/investor/profile">
                            <Button size="sm" className="w-full">
                              Build Profile ?
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Step 3: Calculator */}
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                              2
                            </div>
                            <Calculator className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Impact Calculator</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Define your target financial and impact returns, plus priority SDGs.
                          </p>
                          <Badge variant="secondary" className="text-xs mb-3">
                            Recommended � ~5 minutes
                          </Badge>
                          <Link href="/learn/impact-calculator">
                            <Button size="sm" variant="outline" className="w-full">
                              Use Calculator
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Step 1: AI Coach */}
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                              3
                            </div>
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="font-semibold mb-2">AI Discovery</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Have a conversation with our AI to explore your investment philosophy.
                          </p>
                          <Badge variant="secondary" className="text-xs mb-3">
                            Optional � ~10 minutes
                          </Badge>
                          <Link href="/investor/discovery">
                            <Button size="sm" variant="outline" className="w-full">
                              Start Discovery
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick start option */}
                    <div className="flex gap-3 justify-center">
                      <Link href="/investor/profile">
                        <Button size="lg">
                          Start with Profile Form
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Investment Thesis Summary Card */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Your Investment Thesis
                    </CardTitle>
                    <CardDescription>
                      {profileCompletion < 100
                        ? 'Complete your profile to improve founder matches'
                        : 'Your thesis is complete and active'
                      }
                    </CardDescription>
                  </div>
                  <Link href="/investor/profile">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Profile Completion Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>

                {profile ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Column 1: Returns */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Calculator className="w-4 h-4" />
                        Target Returns
                      </div>
                      {profile.target_financial_return || profile.target_impact_return ? (
                        <>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground">Financial</div>
                            <div className="text-2xl font-bold text-blue-600">
                              {profile.target_financial_return || 0}%
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground">Impact</div>
                            <div className="text-2xl font-bold text-green-600">
                              {profile.target_impact_return || 0}%
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border-2 border-purple-200">
                            <div className="text-xs text-muted-foreground">Total Target</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {(profile.target_financial_return || 0) + (profile.target_impact_return || 0)}%
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bg-white p-4 rounded-lg text-center">
                          <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                          <p className="text-xs text-muted-foreground mb-2">No calculator data yet</p>
                          <Link href="/learn/impact-calculator">
                            <Button size="sm" variant="outline">Use Calculator</Button>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Investment Parameters */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        Investment Criteria
                      </div>
                      <div className="bg-white p-3 rounded-lg space-y-2">
                        {profile.min_ticket_size && profile.max_ticket_size ? (
                          <div>
                            <div className="text-xs text-muted-foreground">Ticket Size</div>
                            <div className="text-sm font-semibold">
                              ${(profile.min_ticket_size / 1000000).toFixed(1)}M - ${(profile.max_ticket_size / 1000000).toFixed(1)}M
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">No ticket size set</div>
                        )}

                        {profile.stages?.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Stages</div>
                            <div className="flex flex-wrap gap-1">
                              {profile.stages.slice(0, 3).map((stage: string) => (
                                <Badge key={stage} variant="secondary" className="text-xs">
                                  {stage}
                                </Badge>
                              ))}
                              {profile.stages.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{profile.stages.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {profile.sectors?.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Sectors</div>
                            <div className="flex flex-wrap gap-1">
                              {profile.sectors.slice(0, 2).map((sector: string) => (
                                <Badge key={sector} variant="outline" className="text-xs">
                                  {sector}
                                </Badge>
                              ))}
                              {profile.sectors.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{profile.sectors.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {(!profile.stages?.length && !profile.sectors?.length && !profile.min_ticket_size) && (
                          <div className="text-center py-2">
                            <AlertCircle className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                            <p className="text-xs text-muted-foreground">Complete your profile</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Column 3: SDGs & Philosophy */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        Impact Focus
                      </div>
                      {profile.priority_sdgs?.length > 0 ? (
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-2">Priority SDGs</div>
                          <div className="flex flex-wrap gap-1">
                            {profile.priority_sdgs.map((sdgNum: number) => (
                              <Badge key={sdgNum} variant="secondary" className="text-xs">
                                SDG {sdgNum}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {profile.priority_sdgs.map((n: number) => SDG_NAMES[n]).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg text-center">
                          <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                          <p className="text-xs text-muted-foreground">No SDGs selected</p>
                        </div>
                      )}

                      {profile.investment_philosophy && (
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Philosophy</div>
                          <p className="text-xs line-clamp-3">{profile.investment_philosophy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold mb-2">Build Your Investment Thesis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete your profile to start receiving matched founders
                    </p>
                    <Link href="/investor/profile">
                      <Button>Create Investment Profile</Button>
                    </Link>
                  </div>
                )}

                {/* Quick Actions */}
                {profile && profileCompletion < 100 && (
                  <div className="mt-6 flex gap-2 justify-center">
                    <Link href="/investor/profile">
                      <Button size="sm" variant="outline">Complete Profile</Button>
                    </Link>
                    <Link href="/learn/impact-calculator">
                      <Button size="sm" variant="outline">
                        <Calculator className="w-4 h-4 mr-2" />
                        Use Calculator
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Matches</CardTitle>
                  <CardDescription>Founders matching your criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{matches.length}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {hasCompletedDiscovery ? 'Ready to review' : 'Complete discovery to see matches'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avg Match Score</CardTitle>
                  <CardDescription>Quality of your matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {matches.length > 0
                      ? Math.round(matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length)
                      : '�'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Out of 100</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Status</CardTitle>
                  <CardDescription>Thesis completeness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{profileCompletion}%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {profileCompletion === 100 ? 'Fully complete' : `${100 - profileCompletion}% remaining`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Link href="/projects">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-xl font-bold mb-2">Browse Projects</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Discover impact startups seeking investment
                    </p>
                    <Button className="w-full" variant="outline">
                      View All Projects ?
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/investors">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <h3 className="text-xl font-bold mb-2">Browse Investors</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See other impact investors on the platform
                    </p>
                    <Button className="w-full" variant="outline">
                      View All Investors ?
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Onboarding CTA */}
            {(profileCompletion < 100 || !hasCompletedDiscovery) && !isFirstVisit && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle>
                    {profileCompletion < 100 ? 'Complete Your Investment Profile' : 'Start AI Discovery'}
                  </CardTitle>
                  <CardDescription>
                    {profileCompletion < 100
                      ? 'Fill out your investment thesis to receive better founder matches'
                      : 'Let our AI help refine your investment criteria through conversation'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileCompletion < 100 ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Your profile is {profileCompletion}% complete. Add your investment parameters,
                        target returns, and philosophy to unlock personalized founder matches.
                      </p>
                      <div className="flex gap-3">
                        <Link href="/investor/profile">
                          <Button size="lg">
                            Complete Profile ?
                          </Button>
                        </Link>
                        <Link href="/learn/impact-calculator">
                          <Button size="lg" variant="outline" className="gap-2">
                            <Calculator className="w-4 h-4" />
                            Use Calculator
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Have a conversation with our AI to further refine your investment thesis.
                        This takes about 10 minutes.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => router.push('/investor/discovery')}
                      >
                        Start AI Discovery Session ?
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            {hasCompletedDiscovery && profileCompletion >= 80 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Your Matches</h2>
                    <p className="text-sm text-muted-foreground">
                      Founders that align with your investment thesis
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push('/investor/profile')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Refine Criteria
                  </Button>
                </div>

                {matches.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We&apos;re actively matching you with founders. Check back soon!
                      </p>
                      <Button onClick={() => router.push('/investor/profile')}>
                        Adjust Your Criteria
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {matches.map((match) => (
                      <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {match.pitch_decks?.title || 'Untitled Pitch'}
                                </h3>
                                <Badge variant="outline">
                                  {Math.round(match.match_score)}% Match
                                </Badge>
                                <Badge>
                                  Score: {match.pitch_decks?.readiness_score}/100
                                </Badge>
                              </div>

                              <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                                <span>{match.founders?.target_market || 'Global'}</span>
                                <span>{match.founders?.founder_type || 'N/A'}</span>
                                <span>{match.founders?.funding_stage || 'Seed'}</span>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm font-medium mb-1">Why this matches:</p>
                                <ul className="text-sm space-y-1">
                                  {match.match_reasons?.map((reason: string, idx: number) => (
                                    <li key={idx} className="text-muted-foreground">• {reason}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => router.push(`/investors/${match.founder_id}`)}
                              >
                                View Profile
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                Pass
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-600" />
                  <h3 className="text-lg font-semibold mb-2">Complete Your Profile First</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profileCompletion < 80
                      ? `Your profile is ${profileCompletion}% complete. Complete it to at least 80% to see founder matches.`
                      : 'Complete the AI discovery session to start seeing matched founders.'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/investor/profile">
                      <Button>Complete Profile</Button>
                    </Link>
                    {profileCompletion >= 80 && (
                      <Button variant="outline" onClick={() => router.push('/investor/discovery')}>
                        Start Discovery
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}