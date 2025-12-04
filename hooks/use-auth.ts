// hooks/use-auth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthOptions {
  requireAuth?: boolean;
  requiredRole?: 'founder' | 'investor' | 'superadmin';
  redirectTo?: string;
}

export function useAuth(options: AuthOptions = {}) {
  const {
    requireAuth = false,
    requiredRole,
    redirectTo = '/login'
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get current user
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();

      if (error || !currentUser) {
        if (requireAuth) {
          router.push(redirectTo);
          return;
        }
        setIsLoading(false);
        return;
      }

      setUser(currentUser);

      // Get user role if needed
      if (requiredRole) {
        const role = await getUserRole(currentUser.id);
        setUserRole(role);

        // Check if user has required role
        if (role !== requiredRole && role !== 'superadmin') {
          // Redirect to appropriate dashboard
          if (role === 'investor') {
            router.push('/slyds/dashboard');
          } else {
            router.push('/founder/dashboard');
          }
          return;
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      if (requireAuth) {
        router.push(redirectTo);
      }
      setIsLoading(false);
    }
  };

  const getUserRole = async (userId: string): Promise<'founder' | 'investor' | 'superadmin'> => {
    // Check superadmin first
    const { data: superadmin } = await supabase
      .from('superadmins')
      .select('id')
      .eq('id', userId)
      .eq('is_active', true)
      .maybeSingle(); // Changed from .single() to .maybeSingle() to avoid errors

    if (superadmin) return 'superadmin';

    // Check founders table
    const { data: founder } = await supabase
      .from('founders')
      .select('user_role')
      .eq('id', userId)
      .maybeSingle(); // Changed from .single()

    if (founder?.user_role) {
      const role = founder.user_role;
      if (role === 'founder' || role === 'investor' || role === 'superadmin') {
        return role;
      }
    }

    // Check investor_profiles
    const { data: investor } = await supabase
      .from('investor_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Changed from .single()

    if (investor) return 'investor';

    // Default to founder
    return 'founder';
  };

  return {
    isLoading,
    user,
    userRole,
    isAuthenticated: !!user,
  };
}