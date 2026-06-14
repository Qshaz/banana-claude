import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { JournalEntry } from '../types';

export function useJournal(userId: string | null) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async (visibility?: 'private' | 'community' | 'all') => {
    if (!userId) return;
    setLoading(true);
    let q = supabase.from('journal_entries').select('*').order('created_at', { ascending: false });
    if (visibility === 'community') q = q.eq('visibility', 'community');
    else if (visibility === 'private') q = q.eq('user_id', userId).eq('visibility', 'private');
    else q = q.eq('user_id', userId);
    const { data } = await q.limit(50);
    setEntries((data ?? []) as JournalEntry[]);
    setLoading(false);
  }, [userId]);

  const saveEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return null;
    const { data } = await supabase.from('journal_entries').insert({ ...entry, user_id: userId }).select().single();
    if (data) {
      await supabase.rpc('increment_entry_count', { user_id: userId }).catch(() => {});
    }
    return data as JournalEntry | null;
  };

  return { entries, loading, fetchEntries, saveEntry };
}
