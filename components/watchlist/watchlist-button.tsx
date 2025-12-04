'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WatchlistButtonProps {
  targetId: string;
  targetType: 'project' | 'investor';
  userRole: 'founder' | 'investor';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  onToggle?: (isWatched: boolean) => void;
}

export function WatchlistButton({
  targetId,
  targetType,
  userRole,
  variant = 'outline',
  size = 'default',
  showLabel = true,
  onToggle,
}: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  // Get context-aware button text
  const getButtonText = () => {
    if (userRole === 'investor' && targetType === 'project') {
      return isWatched ? 'Saved' : 'Save Project';
    }
    if (userRole === 'founder' && targetType === 'investor') {
      return isWatched ? 'Following' : 'Follow';
    }
    if (userRole === 'founder' && targetType === 'project') {
      return isWatched ? 'Following' : 'Follow Project';
    }
    if (userRole === 'investor' && targetType === 'investor') {
      return isWatched ? 'Following' : 'Follow Investor';
    }
    return isWatched ? 'Saved' : 'Save';
  };

  // Check if already watching on mount
  useEffect(() => {
    checkWatchlistStatus();
  }, [targetId, targetType, userRole]);

  const checkWatchlistStatus = async () => {
    try {
      setIsChecking(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsChecking(false);
        return;
      }

      let data = null;
      let error = null;

      if (userRole === 'investor' && targetType === 'project') {
        // Check investor_watchlist
        const result = await supabase
          .from('investor_watchlist')
          .select('id')
          .eq('investor_id', user.id)
          .eq('founder_id', targetId)
          .single();

        data = result.data;
        error = result.error;
      } else if (userRole === 'founder') {
        // Check founder_watchlist
        const result = await supabase
          .from('founder_watchlist')
          .select('id')
          .eq('founder_id', user.id)
          .eq('target_type', targetType)
          .eq('target_id', targetId)
          .single();

        data = result.data;
        error = result.error;
      } else if (userRole === 'investor' && targetType === 'investor') {
        // Check investor_network_watchlist
        const result = await supabase
          .from('investor_network_watchlist')
          .select('id')
          .eq('investor_id', user.id)
          .eq('target_investor_id', targetId)
          .single();

        data = result.data;
        error = result.error;
      }

      // If error is 'PGRST116', it means no row found (not watching)
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking watchlist status:', error);
      }

      setIsWatched(!!data);
    } catch (error) {
      console.error('Error in checkWatchlistStatus:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to use the watchlist feature.',
          variant: 'destructive',
        });
        return;
      }

      if (isWatched) {
        // Remove from watchlist
        await removeFromWatchlist(user.id);
      } else {
        // Add to watchlist
        await addToWatchlist(user.id);
      }

      const newStatus = !isWatched;
      setIsWatched(newStatus);

      if (onToggle) {
        onToggle(newStatus);
      }

      toast({
        title: newStatus ? 'Added to watchlist' : 'Removed from watchlist',
        description: newStatus
          ? `You'll receive alerts about updates.`
          : 'You will no longer receive alerts.',
      });

    } catch (error) {
      console.error('Error toggling watchlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update watchlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async (userId: string) => {
    if (userRole === 'investor' && targetType === 'project') {
      const { error } = await supabase
        .from('investor_watchlist')
        .insert({
          investor_id: userId,
          founder_id: targetId,
          added_at: new Date().toISOString(),
        });

      if (error) throw error;
    } else if (userRole === 'founder') {
      const { error } = await supabase
        .from('founder_watchlist')
        .insert({
          founder_id: userId,
          target_type: targetType,
          target_id: targetId,
          added_at: new Date().toISOString(),
        });

      if (error) throw error;
    } else if (userRole === 'investor' && targetType === 'investor') {
      const { error } = await supabase
        .from('investor_network_watchlist')
        .insert({
          investor_id: userId,
          target_investor_id: targetId,
          added_at: new Date().toISOString(),
        });

      if (error) throw error;
    }
  };

  const removeFromWatchlist = async (userId: string) => {
    if (userRole === 'investor' && targetType === 'project') {
      const { error } = await supabase
        .from('investor_watchlist')
        .delete()
        .eq('investor_id', userId)
        .eq('founder_id', targetId);

      if (error) throw error;
    } else if (userRole === 'founder') {
      const { error } = await supabase
        .from('founder_watchlist')
        .delete()
        .eq('founder_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId);

      if (error) throw error;
    } else if (userRole === 'investor' && targetType === 'investor') {
      const { error } = await supabase
        .from('investor_network_watchlist')
        .delete()
        .eq('investor_id', userId)
        .eq('target_investor_id', targetId);

      if (error) throw error;
    }
  };

  if (isChecking) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={isWatched ? 'default' : variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isWatched ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {showLabel && !isLoading && getButtonText()}
    </Button>
  );
}