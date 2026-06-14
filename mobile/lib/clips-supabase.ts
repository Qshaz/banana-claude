import { supabase } from './supabase';
import type { Clip, Speaker } from '../constants/speakers';

export async function fetchClipsByCategory(slug: string): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .contains('categories', [slug])
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Clip[];
}

export async function fetchClipsBySpeaker(speakerId: string): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('speaker_id', speakerId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Clip[];
}

export async function fetchSpeakers(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .from('speakers')
    .select('*')
    .order('name');
  if (error || !data) return [];
  return data as Speaker[];
}
