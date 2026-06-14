import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useJournal } from '../../hooks/useJournal';
import { Colors } from '../../constants/colors';
import { VerseOfDay } from '../../components/VerseOfDay';
import { StatsRow } from '../../components/StatsRow';
import { JournalEntryCard } from '../../components/JournalEntryCard';
import { getVerse } from '../../lib/quran-api';
import type { Verse } from '../../types';

// Hardcoded verse of day pool — override from Supabase if available
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
    if (h < 12) return 'Good morning';
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}, {profile?.display_name ?? 'friend'} 👋</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <Text style={styles.logoSmall}>حكمة</Text>
        </View>

        <VerseOfDay verse={votd} loading={votdLoading} />

        <StatsRow stats={[
          { label: 'Total entries', value: profile?.total_entries ?? 0, icon: '📖' },
          { label: 'Day streak', value: profile?.streak_count ?? 0, icon: '🔥' },
          { label: 'Categories', value: Object.keys(categoryBreakdown).length, icon: '🗂' },
        ]} />

        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your most explored themes</Text>
            {topCategories.map(([slug, count]) => (
              <View key={slug} style={styles.catRow}>
                <Text style={styles.catName}>{slug}</Text>
                <View style={[styles.bar, { width: `${Math.min(100, (count / entries.length) * 100)}%` }]} />
                <Text style={styles.catCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.cta} onPress={() => router.push('/(tabs)/tadabur')}>
          <Text style={styles.ctaText}>✦  Begin Tadabur Session</Text>
        </TouchableOpacity>

        {entries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent reflections</Text>
            {entries.slice(0, 3).map((e) => (
              <JournalEntryCard key={e.id} entry={e} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 20, fontWeight: '700', color: Colors.TEXT },
  date: { fontSize: 13, color: Colors.TEXT_MUTED, marginTop: 2 },
  logoSmall: { fontSize: 24, color: Colors.PRIMARY },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.TEXT, marginBottom: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  catName: { width: 110, fontSize: 13, color: Colors.TEXT, textTransform: 'capitalize' },
  bar: { height: 6, backgroundColor: Colors.PRIMARY, borderRadius: 3, flex: 0 },
  catCount: { fontSize: 12, color: Colors.TEXT_MUTED, marginLeft: 4 },
  cta: {
    backgroundColor: Colors.ACCENT,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaText: { color: Colors.SURFACE, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});
