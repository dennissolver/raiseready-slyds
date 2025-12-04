'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  TrendingUp,
  Activity,
  Settings,
  FileText,
  Flag,
  Database,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

interface DashboardMetrics {
  totalUsers: number;
  totalFounders: number;
  totalInvestors: number;
  totalProjects: number;
  activeUsers7d: number;
  activeUsers30d: number;
  newSignupsToday: number;
  totalMatches: number;
  totalWatchlistItems: number;
  totalNotifications: number;
}

export default function AdminDashboard() {  // ✅ Fixed: Capitalized component name
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperadmin, setIsSuperadmin] = useState(false);  // ✅ Fixed: Correct state name

  const supabase = createClient();
  const router = useRouter();

  const { isLoading: authLoading, user } = useAuth({
    requireAuth: true,
    requiredRole: 'superadmin',  // ✅ Keep as 'superadmin' - this is the database role
  });

  useEffect(() => {
    checkSuperadminAccess();  // ✅ Fixed: Correct function name
  }, []);

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

  const checkSuperadminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is superadmin
      const { data: superadmin, error } = await supabase
        .from('superadmins')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

      if (error || !superadmin) {
        router.push('/');
        return;
      }

      setIsSuperadmin(true);
      loadMetrics();
    } catch (error) {
      console.error('Error checking superadmin access:', error);
      router.push('/');
    }
  };

  const loadMetrics = async () => {
    try {
      setIsLoading(true);

      // Get latest metrics
      const { data: latestMetrics } = await supabase
        .from('system_metrics' as any)
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();

      if (latestMetrics) {
        setMetrics({
          totalUsers: latestMetrics.total_users || 0,
          totalFounders: latestMetrics.total_founders || 0,
          totalInvestors: latestMetrics.total_investors || 0,
          totalProjects: latestMetrics.total_projects || 0,
          activeUsers7d: latestMetrics.active_users_7d || 0,
          activeUsers30d: latestMetrics.active_users_30d || 0,
          newSignupsToday: latestMetrics.new_signups_today || 0,
          totalMatches: latestMetrics.total_matches || 0,
          totalWatchlistItems: latestMetrics.total_watchlist_items || 0,
          totalNotifications: latestMetrics.total_notifications_sent || 0,
        });
      } else {
        // If no metrics exist, get counts directly
        const { count: usersCount } = await supabase
          .from('founders')
          .select('*', { count: 'exact', head: true });

        const { count: foundersCount } = await supabase
          .from('founders')
          .select('*', { count: 'exact', head: true })
          .eq('user_role', 'founder');

        const { count: investorsCount } = await supabase
          .from('investor_profiles')
          .select('*', { count: 'exact', head: true });

        const { count: projectsCount } = await supabase
          .from('pitch_decks')
          .select('*', { count: 'exact', head: true });

        setMetrics({
          totalUsers: usersCount || 0,
          totalFounders: foundersCount || 0,
          totalInvestors: investorsCount || 0,
          totalProjects: projectsCount || 0,
          activeUsers7d: 0,
          activeUsers30d: 0,
          newSignupsToday: 0,
          totalMatches: 0,
          totalWatchlistItems: 0,
          totalNotifications: 0,
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>  {/* ✅ Changed title */}
                <p className="text-sm text-muted-foreground">Full system access and control</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              ADMIN
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : metrics?.totalUsers}
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics?.newSignupsToday} new today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Founders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : metrics?.totalFounders}
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics?.totalProjects} projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Investors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : metrics?.totalInvestors}
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics?.totalWatchlistItems} watchlist items
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active (7d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : metrics?.activeUsers7d}
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics?.activeUsers30d} active (30d)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild className="h-24" variant="outline">
                  <Link href="/admin/users">  {/* ✅ Changed from /superadmin/users */}
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-semibold">All Users</div>
                      <div className="text-xs text-muted-foreground">View all users</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild className="h-24" variant="outline">
                  <Link href="/admin/founders">  {/* ✅ Added founders link */}
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-semibold">Manage Founders</div>
                      <div className="text-xs text-muted-foreground">View & delete founders</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild className="h-24" variant="outline">
                  <Link href="/admin/investors">  {/* ✅ Added investors link */}
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-semibold">Manage Investors</div>
                      <div className="text-xs text-muted-foreground">View & delete investors</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild className="h-24" variant="outline">
                  <Link href="/admin/settings">  {/* ✅ Changed from /superadmin/settings */}
                    <div className="text-center">
                      <Settings className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-semibold">Global Settings</div>
                      <div className="text-xs text-muted-foreground">Configure system</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold">Database</div>
                      <div className="text-sm text-muted-foreground">Operational</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold">API</div>
                      <div className="text-sm text-muted-foreground">All endpoints responding</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold">Storage</div>
                      <div className="text-sm text-muted-foreground">Within limits</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

