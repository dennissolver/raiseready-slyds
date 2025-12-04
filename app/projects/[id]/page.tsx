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
import {
  ArrowLeft,
  Target,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  Globe,
  Linkedin,
  Mail,
  Download,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Project {
  id: string;
  founder_id: string;
  title: string;
  one_liner?: string;
  file_url: string;
  file_type: string;
  sectors?: string[];
  target_market?: string;
  funding_stage?: string;
  funding_goal?: number;
  readiness_score: number;
  visibility: string;
  sdgs?: number[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface Founder {
  id: string;
  full_name?: string;
  email?: string;
  company_name?: string;
  linkedin_url?: string;
  website?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [founder, setFounder] = useState<Founder | null>(null);
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
      loadProject();
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

      setUserRole(data?.user_role || null);
    }
  };

  const loadProject = async () => {
    try {
      setIsLoading(true);

      const { data: projectData, error: projectError } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('id', params.id)
        .single();

      if (projectError) throw projectError;

      // Check visibility permissions
      const canViewProject =
        projectData.visibility === 'public' ||
        (isAuthenticated && projectData.visibility === 'platform-only') ||
        (isAuthenticated && projectData.founder_id === (await supabase.auth.getUser()).data.user?.id);

      setCanView(canViewProject);
      setProject(projectData);

      // Load founder info if allowed
      if (canViewProject) {
        const { data: founderData } = await supabase
          .from('founders')
          .select('id, full_name, email, company_name, linkedin_url, website')
          .eq('id', projectData.founder_id)
          .single();

        setFounder(founderData);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFunding = (amount?: number) => {
    if (!amount) return 'Not specified';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project || !canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">
              {!isAuthenticated
                ? 'Please sign in to view this project.'
                : 'You don\'t have permission to view this project.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push('/projects')}>
                Browse Projects
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
            onClick={() => router.push('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              {project.one_liner && (
                <p className="text-lg text-muted-foreground">{project.one_liner}</p>
              )}
            </div>

            {isAuthenticated && userRole && (
              <WatchlistButton
                targetId={project.founder_id}
                targetType="project"
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
            {/* Pitch Deck Viewer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Pitch Deck
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.file_url} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {project.file_type === 'pdf' ? (
                  <iframe
                    src={project.file_url}
                    className="w-full h-[600px] border rounded-lg"
                    title="Pitch Deck"
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Preview not available for this file type
                    </p>
                    <Button asChild>
                      <a href={project.file_url} download>
                        Download File
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sectors & Categories */}
            {project.sectors && project.sectors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.sectors.map((sector) => (
                      <Badge key={sector} variant="secondary" className="text-sm">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* UN SDGs */}
            {project.sdgs && project.sdgs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>UN Sustainable Development Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.sdgs.map((sdg) => (
                      <Badge key={sdg} variant="outline" className="text-sm">
                        SDG {sdg}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Project Info */}
          <div className="space-y-6">
            {/* Readiness Score */}
            <Card className={`border-2 ${getScoreColor(project.readiness_score)}`}>
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold mb-2">
                  {project.readiness_score}
                </div>
                <p className="text-sm font-medium">Readiness Score</p>
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.funding_stage && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Funding Stage</p>
                      <p className="text-sm text-muted-foreground">{project.funding_stage}</p>
                    </div>
                  </div>
                )}

                {project.funding_goal && (
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Funding Goal</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFunding(project.funding_goal)}
                      </p>
                    </div>
                  </div>
                )}

                {project.target_market && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Target Market</p>
                      <p className="text-sm text-muted-foreground">{project.target_market}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(project.updated_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founder Info */}
            {founder && (
              <Card>
                <CardHeader>
                  <CardTitle>Founder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{founder.full_name}</p>
                    {founder.company_name && (
                      <p className="text-sm text-muted-foreground">{founder.company_name}</p>
                    )}
                  </div>

                  <Separator />

                  {isAuthenticated && userRole === 'investor' && (
                    <div className="space-y-2">
                      {founder.email && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={`mailto:${founder.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email Founder
                          </a>
                        </Button>
                      )}
                      {founder.linkedin_url && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {founder.website && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={founder.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
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
