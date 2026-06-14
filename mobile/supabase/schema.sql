-- Hikmah: Tadabur Journal — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  notification_time text default '08:00',
  notification_enabled boolean default true,
  onboarding_complete boolean default false,
  categories_of_interest text[] default '{}',
  goals text[] default '{}',
  streak_count integer default 0,
  last_tadabur_date date,
  total_entries integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- ============================================================
-- JOURNAL ENTRIES
-- ============================================================
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  surah_number integer not null,
  ayah_number integer not null,
  verse_arabic text,
  verse_translation text,
  tafsir_excerpt text,
  category text not null,
  reflection_questions text[],
  journal_text text,
  audio_url text,
  mood text,
  visibility text default 'private' check (visibility in ('private', 'community')),
  created_at timestamptz default now()
);

create index journal_entries_user_id_idx on public.journal_entries(user_id);
create index journal_entries_created_at_idx on public.journal_entries(created_at desc);
create index journal_entries_category_idx on public.journal_entries(category);

-- ============================================================
-- VERSE OF DAY
-- ============================================================
create table public.verse_of_day (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  surah_number integer not null,
  ayah_number integer not null,
  theme text,
  note text
);

-- ============================================================
-- CLIPS
-- ============================================================
create table public.clips (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text not null,
  speaker text not null,
  duration_seconds integer,
  categories text[] default '{}',
  thumbnail_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create index clips_categories_idx on public.clips using gin(categories);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.verse_of_day enable row level security;
alter table public.clips enable row level security;

-- Profiles: users can only manage their own
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id);

-- Journal entries: users manage their own; community entries visible to all
create policy "Users manage own entries"
  on public.journal_entries for all
  using (auth.uid() = user_id);

create policy "Community entries readable by all"
  on public.journal_entries for select
  using (visibility = 'community' or auth.uid() = user_id);

-- Verse of day: readable by all authenticated users
create policy "Verse of day readable by all"
  on public.verse_of_day for select
  using (true);

-- Clips: readable by all when active
create policy "Clips readable by all"
  on public.clips for select
  using (active = true);

-- ============================================================
-- SAMPLE VERSE OF DAY DATA (optional seed)
-- ============================================================
-- Insert a few verses of the day so the app has data to show
-- Format: surah_number, ayah_number, theme
-- You can add more via the Supabase dashboard

insert into public.verse_of_day (date, surah_number, ayah_number, theme, note) values
  (current_date, 2, 286, 'Allah does not burden a soul beyond that it can bear', 'A verse of reassurance for all hardships'),
  (current_date + 1, 94, 5, 'With hardship comes ease', 'The promise of relief after difficulty'),
  (current_date + 2, 3, 173, 'Allah is sufficient for us', 'Complete trust in Allah'),
  (current_date + 3, 2, 153, 'Seek help through patience and prayer', 'The tools of the believer'),
  (current_date + 4, 65, 3, 'Whoever relies on Allah, He is sufficient', 'Tawakkul — reliance on Allah')
on conflict (date) do nothing;
