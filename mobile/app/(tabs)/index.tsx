import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useJournal } from '../../hooks/useJournal';
import { Colors } from '../../constants/colors';
import { Fonts, Typography, Spacing, Radii } from '../../constants/typography';
import { VerseOfDay } from '../../components/VerseOfDay';
import { StatsRow } from '../../components/StatsRow';
import { JournalEntryCard } from '../../components/JournalEntryCard';
import { getVerse } from '../../lib/quran-api';
import type { Verse } from '../../types';

const VOTD_FALLBACK = { surah: 2, ayah: 286 };

export default function DashboardScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { profile } = useProfile(userId);
  const { entries, fetchEntries } = useJournal(userId);
  const [votd, setVotd] = useState<Verse | null>(null);
  const [votdLoading, setVotdLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Assalamu alaikum';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchEntries('private');
    loadVotd();
  }, [userId]);

  const loadVotd = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('verse_of_day').select('*').eq('date', today).single();
    const ref = data ?? VOTD_FALLBACK;
    try {
      const v = await getVerse(ref.surah_number ?? ref.surah, ref.ayah_number ?? ref.ayah);
      setVotd(v);
    } catch {}
    setVotdLoading(false);
  };

  const categoryBreakdown = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{profile?.display_name ?? 'dear one'}</Text>
          </View>
          <Text style={styles.logoArabic}>حكمة</Text>
        </View>

        {/* ── Primary CTA — Tadabur is the hero ── */}
        <TouchableOpacity style={styles.tadaburHero} onPress={() => router.push('/(tabs)/tadabur')} activeOpacity={0.85}>
          <Text style={styles.tadaburArabic}>تدبّر</Text>
          <Text style={styles.tadaburTitle}>Begin Tadabur</Text>
          <Text style={styles.tadaburSub}>Sit with the Quran. Reflect. Write.</Text>
          <View style={styles.tadaburBtn}>
            <Text style={styles.tadaburBtnText}>Open session  ›</Text>
          </View>
        </TouchableOpacity>

        {/* Verse of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verse of the day</Text>
          <VerseOfDay verse={votd} loading={votdLoading} />
        </View>

        {/* Stats */}
        <StatsRow stats={[
          { label: 'Reflections', value: profile?.total_entries ?? 0, icon: '📖' },
          { label: 'Day streak', value: profile?.streak_count ?? 0, icon: '🔥' },
          { label: 'Themes', value: Object.keys(categoryBreakdown).length, icon: '◈' },
        ]} />

        {/* Theme breakdown */}
        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your most explored themes</Text>
            {topCategories.map(([slug, count]) => (
              <View key={slug} style={styles.catRow}>
                <Text style={styles.catName}>{slug.replace(/-/g, ' ')}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.min(100, (count / entries.length) * 100)}%` }]} />
                </View>
                <Text style={styles.catCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent reflections */}
        {entries.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent reflections</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
                <Text style={styles.sectionLink}>See all ›</Text>
              </TouchableOpacity>
            </View>
            {entries.slice(0, 3).map((e) => (
              <JournalEntryCard key={e.id} entry={e} />
            ))}
          </View>
        )}

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyArabic}>﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾</Text>
            <Text style={styles.emptyTrans}>Remember Me and I will remember you.</Text>
            <Text style={styles.emptyRef}>Al-Baqarah 2:152</Text>
            <Text style={styles.emptyHint}>Your first tadabur session is waiting.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { padding: Spacing.sm, paddingBottom: 48 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.md,
  },
  greeting: { fontFamily: Fonts.BODY, fontSize: 14, color: Colors.TEXT_MUTED },
  name: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 26, color: Colors.TEXT, marginTop: 2 },
  logoArabic: { fontFamily: Fonts.ARABIC, fontSize: 28, color: Colors.ACCENT },

  // ── Hero tadabur block ────────────────────────────────────────
  tadaburHero: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radii.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  tadaburArabic: {
    fontFamily: Fonts.ARABIC,
    fontSize: 42,
    color: Colors.ACCENT,
    marginBottom: 4,
  },
  tadaburTitle: {
    fontFamily: Fonts.HEADING_SEMIBOLD,
    fontSize: 22,
    color: Colors.SURFACE,
    marginBottom: 6,
  },
  tadaburSub: {
    fontFamily: Fonts.BODY,
    fontSize: 13,
    color: Colors.SURFACE,
    opacity: 0.75,
    marginBottom: 20,
  },
  tadaburBtn: {
    backgroundColor: Colors.SURFACE,
    borderRadius: Radii.button,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  tadaburBtnText: {
    fontFamily: Fonts.BODY_MEDIUM,
    fontSize: 14,
    color: Colors.PRIMARY,
  },

  // ── Sections ─────────────────────────────────────────────────
  section: { marginBottom: Spacing.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: {
    fontFamily: Fonts.HEADING_MEDIUM,
    fontSize: 17,
    color: Colors.TEXT,
    marginBottom: 12,
  },
  sectionLink: { fontFamily: Fonts.BODY, fontSize: 13, color: Colors.PRIMARY },

  // ── Category bar chart ────────────────────────────────────────
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  catName: {
    width: 120, fontFamily: Fonts.BODY, fontSize: 13,
    color: Colors.TEXT_SECONDARY, textTransform: 'capitalize',
  },
  barTrack: { flex: 1, height: 5, backgroundColor: Colors.BORDER, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.PRIMARY, borderRadius: 3 },
  catCount: { fontFamily: Fonts.BODY, fontSize: 12, color: Colors.TEXT_MUTED, width: 16, textAlign: 'right' },

  // ── Empty state ───────────────────────────────────────────────
  emptyState: {
    alignItems: 'center', paddingVertical: 40,
    backgroundColor: Colors.SURFACE, borderRadius: Radii.card,
    borderWidth: 1, borderColor: Colors.BORDER, padding: Spacing.md,
  },
  emptyArabic: {
    fontFamily: Fonts.ARABIC, fontSize: 20, color: Colors.TEXT,
    textAlign: 'center', lineHeight: 36, marginBottom: 8,
  },
  emptyTrans: {
    fontFamily: Fonts.BODY, fontSize: 14, color: Colors.TEXT_SECONDARY,
    fontStyle: 'italic', textAlign: 'center', marginBottom: 4,
  },
  emptyRef: {
    fontFamily: Fonts.BODY, fontSize: 12, color: Colors.ACCENT, marginBottom: 20,
  },
  emptyHint: {
    fontFamily: Fonts.BODY, fontSize: 13, color: Colors.TEXT_MUTED,
  },
});
