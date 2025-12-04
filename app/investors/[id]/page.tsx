'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { WatchlistButton } from '@/components/watchlist/watchlist-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/types/supabase';
import {
  ArrowLeft,
  Target,
  DollarSign,
  MapPin,
  Building2,
  Globe,
  Linkedin,
  Mail,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

type InvestorProfile = Database['public']['Tables']['investor_profiles']['Row'];

export default function InvestorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [investor, setInvestor] = useState<InvestorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'founder' | 'investor' | null>(null);
  const [canView, setCanView] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      loadInvestor();
    }
  }, [params.id, isAuthenticated]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);

    if (user) {
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

  const loadInvestor = async () => {
    try {
      setIsLoading(true);

      const { data: investorData, error } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      // Check visibility permissions
      const canViewProfile =
        investorData.profile_visibility === 'public' ||
        (isAuthenticated && investorData.profile_visibility === 'platform-only');

      setCanView(canViewProfile);
      setInvestor(investorData);
    } catch (error) {
      console.error('Error loading investor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTicketSize = (min?: number, max?: number) => {
    const minAmount = min || investor?.check_size_min || undefined;
    const maxAmount = max || investor?.check_size_max || undefined;

    if (!minAmount && !maxAmount) return 'Not specified';

    const format = (amount: number) => {
      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
      return `$${amount}`;
    };

    if (minAmount && maxAmount) return `${format(minAmount)} - ${format(maxAmount)}`;
    if (minAmount) return `From ${format(minAmount)}`;
    if (maxAmount) return `Up to ${format(maxAmount)}`;
    return 'Not specified';
  };

  const displayName = investor?.organization_name || investor?.firm || investor?.name || 'Anonymous Investor';
  const displayType = investor?.investor_type || 'Impact Investor';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!investor || !canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">
              {!isAuthenticated
                ? 'Please sign in to view investor profiles.'
                : 'You don\'t have permission to view this profile.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push('/investors')}>
                Browse Investors
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/investors')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investors
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-muted-foreground" />
                <div>
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  <p className="text-lg text-muted-foreground">{displayType}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {investor.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={investor.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {investor.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={investor.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {isAuthenticated && userRole && (
              <WatchlistButton
                targetId={investor.id}
                targetType="investor"
                userRole={userRole}
                variant="default"
                size="lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Focus */}
            {(investor.sectors || investor.focus_areas) && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(investor.sectors || investor.focus_areas || []).map((sector) => (
                      <Badge key={sector} variant="secondary">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Investment Philosophy */}
            {investor.investment_philosophy && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {investor.investment_philosophy}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ideal Founder Profile */}
            {investor.ideal_founder_profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Ideal Founder Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {investor.ideal_founder_profile}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Deal Breakers */}
            {investor.deal_breakers && (
              <Card>
                <CardHeader>
                  <CardTitle>Deal Breakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {investor.deal_breakers}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* UN SDGs */}
            {investor.priority_sdgs && investor.priority_sdgs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Priority UN SDGs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {investor.priority_sdgs.map((sdg) => (
                      <Badge key={sdg} variant="outline">
                        SDG {sdg}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Investment Criteria */}
          <div className="space-y-6">
            {/* Investment Criteria Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ticket Size</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTicketSize(investor.min_ticket_size || undefined, investor.max_ticket_size || undefined)}
                    </p>
                  </div>
                </div>

                {investor.stages && investor.stages.length > 0 && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Investment Stages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investor.stages.map((stage) => (
                          <Badge key={stage} variant="outline" className="text-xs">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {investor.geographies && investor.geographies.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Geographic Focus</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investor.geographies.map((geo) => (
                          <Badge key={geo} variant="outline" className="text-xs">
                            {geo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Target Returns */}
            {(investor.target_financial_return || (investor as any).target_impact_return) && (
              <Card>
                <CardHeader>
                  <CardTitle>Target Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {investor.target_financial_return && (
                    <div>
                      <p className="text-sm font-medium">Financial Return</p>
                      <p className="text-2xl font-bold text-primary">
                        {investor.target_financial_return}x
                      </p>
                    </div>
                  )}
                  {(investor as any).target_impact_return && (
                    <div>
                      <p className="text-sm font-medium">Impact Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(investor as any).target_impact_return}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            {isAuthenticated && userRole === 'founder' && investor.show_contact_info && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {investor.email && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${investor.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                  {!investor.show_contact_info && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Contact information is private
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}