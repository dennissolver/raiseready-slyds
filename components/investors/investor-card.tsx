'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist/watchlist-button';
import { Database } from '@/types/supabase';
import {
  Building2,
  DollarSign,
  MapPin,
  Target,
  ExternalLink,
  Eye,
  Globe,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

type InvestorProfile = Database['public']['Tables']['investor_profiles']['Row'];

interface InvestorCardProps {
  investor: InvestorProfile;
  isPublicView?: boolean;
  showWatchlist?: boolean;
  userRole?: 'founder' | 'investor';
  variant?: 'default' | 'compact';
}

export function InvestorCard({
  investor,
  isPublicView = false,
  showWatchlist = false,
  userRole,
  variant = 'default'
}: InvestorCardProps) {

  // Format ticket size
  const formatTicketSize = (min?: number, max?: number) => {
    const minAmount = min || investor.check_size_min;
    const maxAmount = max || investor.check_size_max;

    if (!minAmount && !maxAmount) return 'Not specified';

    const format = (amount: number) => {
      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
      return `$${amount}`;
    };

    if (minAmount && maxAmount) {
      return `${format(minAmount)} - ${format(maxAmount)}`;
    }
    if (minAmount) return `From ${format(minAmount)}`;
    if (maxAmount) return `Up to ${format(maxAmount)}`;
    return 'Not specified';
  };

  // Determine what to show based on visibility and user status
  const showFullDetails = !isPublicView || investor.profile_visibility === 'public';
  const showContactInfo = showFullDetails && investor.show_contact_info;

  // Get display name
  const displayName = investor.organization_name || investor.firm || investor.name || 'Anonymous Investor';
  const displayType = investor.investor_type || 'Impact Investor';

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href={`/investors/${investor.id}`}
                className="hover:underline"
              >
                <h3 className="font-semibold text-lg truncate">
                  {displayName}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">
                {displayType}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-2">
            {(investor.sectors || investor.focus_areas)?.slice(0, 2).map((sector) => (
              <Badge key={sector} variant="secondary" className="text-xs">
                {sector}
              </Badge>
            ))}
            {((investor.sectors || investor.focus_areas)?.length || 0) > 2 && (
              <Badge variant="outline" className="text-xs">
                +{((investor.sectors || investor.focus_areas)?.length || 0) - 2} more
              </Badge>
            )}
          </div>
        </CardContent>

        {showWatchlist && userRole && showFullDetails && (
          <CardFooter className="pt-3">
            <WatchlistButton
              targetId={investor.id}
              targetType="investor"
              userRole={userRole}
              variant="outline"
              size="sm"
              showLabel={false}
            />
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/investors/${investor.id}`}
              className="hover:underline"
            >
              <h3 className="font-semibold text-xl truncate">
                {displayName}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {displayType}
            </p>
          </div>

          {showFullDetails && (
            <div className="flex gap-2">
              {investor.website_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={investor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {investor.linkedin_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={investor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Investment Focus Areas */}
        <div className="flex flex-wrap gap-2">
          {(investor.sectors || investor.focus_areas)?.map((sector) => (
            <Badge key={sector} variant="secondary">
              {sector}
            </Badge>
          ))}
        </div>

        {/* Key Details */}
        {showFullDetails && (
          <div className="space-y-2 text-sm">
            {investor.stages && investor.stages.length > 0 && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Stages: </span>
                  <span>{investor.stages.join(', ')}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>
                {formatTicketSize(investor.min_ticket_size ?? undefined, investor.max_ticket_size ?? undefined)}
              </span>
            </div>

            {investor.geographies && investor.geographies.length > 0 && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Regions: </span>
                  <span>{investor.geographies.slice(0, 3).join(', ')}</span>
                  {investor.geographies.length > 3 && (
                    <span> +{investor.geographies.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SDGs */}
        {showFullDetails && investor.priority_sdgs && investor.priority_sdgs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Priority UN SDGs:
            </p>
            <div className="flex flex-wrap gap-1">
              {investor.priority_sdgs.slice(0, 5).map((sdg) => (
                <Badge
                  key={sdg}
                  variant="outline"
                  className="text-xs"
                >
                  SDG {sdg}
                </Badge>
              ))}
              {investor.priority_sdgs.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{investor.priority_sdgs.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {showContactInfo && investor.email && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {investor.email}
            </p>
          </div>
        )}

        {/* Public View Teaser */}
        {isPublicView && investor.profile_visibility !== 'public' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground italic flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Sign in to view full profile
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/investors/${investor.id}`}>
            View Profile
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {showWatchlist && userRole && showFullDetails && (
          <WatchlistButton
            targetId={investor.id}
            targetType="investor"
            userRole={userRole}
            variant="outline"
            size="default"
            showLabel={false}
          />
        )}
      </CardFooter>
    </Card>
  );
}
