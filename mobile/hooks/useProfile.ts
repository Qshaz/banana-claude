import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data as UserProfile | null);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    const { data } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    if (data) setProfile(data as UserProfile);
  };

  return { profile, loading, refetch: fetch, update };
}
