
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  id: string;
  username: string;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      fetchProfile(targetUserId);
    } else {
      setLoading(false);
    }
  }, [userId, user?.id]);

  const fetchProfile = async (targetUserId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    refetch: () => {
      const targetUserId = userId || user?.id;
      if (targetUserId) fetchProfile(targetUserId);
    }
  };
};
