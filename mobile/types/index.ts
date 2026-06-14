export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  notification_time: string;
  notification_enabled: boolean;
  onboarding_complete: boolean;
  categories_of_interest: string[];
  goals: string[];
  streak_count: number;
  last_tadabur_date: string | null;
  total_entries: number;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number;
  verse_arabic: string | null;
  verse_translation: string | null;
  tafsir_excerpt: string | null;
  category: string;
  reflection_questions: string[] | null;
  journal_text: string | null;
  audio_url: string | null;
  mood: string | null;
  visibility: 'private' | 'community';
  created_at: string;
}

export interface Verse {
  verse_key: string;
  surah_number: number;
  ayah_number: number;
  text_arabic: string;
  translation: string;
  surah_name: string;
}

export interface TafsirData {
  verse_key: string;
  text: string;
}

export type SessionStep = 'verses' | 'verse-detail' | 'reflection' | 'journal' | 'complete';
export type Visibility = 'private' | 'community';
