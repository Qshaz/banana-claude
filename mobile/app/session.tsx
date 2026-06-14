import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, FlatList,
  StyleSheet, SafeAreaView, ActivityIndicator, Alert, Linking, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { useSessionStore } from '../stores/session';
import { Colors } from '../constants/colors';
import { Fonts, Radii } from '../constants/typography';
import { getCategoryBySlug } from '../constants/categories';
import { VerseCard } from '../components/VerseCard';
import { TafsirSection } from '../components/TafsirSection';
import { AudioPlayer } from '../components/AudioPlayer';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ReflectionPrompt } from '../components/ReflectionPrompt';
import { ClipCard } from '../components/ClipCard';
import { searchVerses, getTafsir } from '../lib/quran-api';
import { fetchCategoryHadith } from '../lib/hadith-api';
import { getClipsForCategory } from '../constants/speakers';
import { supabase } from '../lib/supabase';
import type { Verse } from '../types';
import type { Hadith } from '../lib/hadith-api';
import type { Clip } from '../constants/speakers';

type TabId = 'verses' | 'tafsir' | 'hadith' | 'community' | 'motivation';

const TABS: { id: TabId; label: string }[] = [
  { id: 'verses', label: 'Verses' },
  { id: 'tafsir', label: 'Tafsir' },
  { id: 'hadith', label: 'Hadith' },
  { id: 'community', label: 'Community' },
  { id: 'motivation', label: 'Motivation' },
];

interface CommunityEntry {
  id: string;
  journal_text: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
}

export default function SessionScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { saveEntry } = useJournal(userId);
  const {
    category, step, candidateVerses, selectedVerse, tafsir,
    currentQuestionIndex, journalText, visibility,
    setStep, setCandidateVerses, setSelectedVerse, setTafsir,
    nextQuestion, setJournalText, appendJournalText, setVisibility,
  } = useSessionStore();

  const [activeTab, setActiveTab] = useState<TabId>('verses');
  const [loading, setLoading] = useState(false);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Hadith tab state
  const [hadithList, setHadithList] = useState<Hadith[]>([]);
  const [hadithLoading, setHadithLoading] = useState(false);
  const [hadithError, setHadithError] = useState(false);
  const hadithFetched = useRef(false);

  // Community tab state
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const communityFetched = useRef(false);

  const cat = category ? getCategoryBySlug(category) : null;
  const prompts = cat?.reflectionPrompts ?? [
    'What does this verse mean to you today?',
    "How does it speak to what you're going through?",
    'What is Allah telling you through this verse?',
  ];

  // Step 1: load verses
  useEffect(() => {
    if (step === 'verses' && category) loadVerses();
  }, [category]);

  const loadVerses = async () => {
    setLoading(true);
    const q = cat?.searchKeywords?.[0] ?? category ?? 'guidance';
    const results = await searchVerses(q).catch(() => []);
    setCandidateVerses(results.slice(0, 6));
    setLoading(false);
  };

  const selectVerse = async (verse: Verse) => {
    setSelectedVerse(verse);
    setStep('verse-detail');
    setTafsirLoading(true);
    const t = await getTafsir(verse.surah_number, verse.ayah_number);
    setTafsir(t?.text ?? null);
    setTafsirLoading(false);
  };

  const save = async () => {
    if (!selectedVerse || !userId) return;
    setSaving(true);
    await saveEntry({
      surah_number: selectedVerse.surah_number,
      ayah_number: selectedVerse.ayah_number,
      verse_arabic: selectedVerse.text_arabic,
      verse_translation: selectedVerse.translation,
      tafsir_excerpt: tafsir?.slice(0, 600) ?? null,
      category: category ?? 'general',
      reflection_questions: prompts.slice(0, 3),
      journal_text: journalText,
      audio_url: null,
      mood: null,
      visibility,
    });
    setSaving(false);
    setStep('complete');
  };

  // Lazy fetch for Hadith tab
  const loadHadith = async () => {
    if (hadithFetched.current || !category) return;
    hadithFetched.current = true;
    setHadithLoading(true);
    setHadithError(false);
    try {
      const results = await fetchCategoryHadith(category);
      setHadithList(results);
    } catch {
      setHadithError(true);
    } finally {
      setHadithLoading(false);
    }
  };

  // Lazy fetch for Community tab
  const loadCommunity = async () => {
    if (communityFetched.current || !category) return;
    communityFetched.current = true;
    setCommunityLoading(true);
    try {
      const { data } = await supabase
        .from('journal_entries')
        .select('id, journal_text, created_at, profiles(display_name)')
        .eq('category', category)
        .eq('visibility', 'community')
        .order('created_at', { ascending: false })
        .limit(20);
      setCommunityEntries((data as CommunityEntry[]) ?? []);
    } finally {
      setCommunityLoading(false);
    }
  };

  const handleTabPress = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'hadith') loadHadith();
    if (tab === 'community') loadCommunity();
  };

  // ── TOP TAB BAR ──
  const TabBar = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBar}
    >
      {TABS.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[styles.tabPill, activeTab === t.id && styles.tabPillActive]}
          onPress={() => handleTabPress(t.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabPillText, activeTab === t.id && styles.tabPillTextActive]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // ── VERSES TAB CONTENT ──
  const renderVersesTab = () => {
    if (step === 'verses') {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{cat?.icon ?? '📖'}</Text>
            <Text style={styles.categoryName}>{cat?.name ?? category}</Text>
          </View>
          <Text style={styles.stepTitle}>Verses for your heart</Text>
          <Text style={styles.stepSub}>Select one to explore in depth</Text>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
          ) : candidateVerses.length > 0 ? (
            candidateVerses.map((v) => (
              <VerseCard key={v.verse_key} verse={v} onPress={() => selectVerse(v)} />
            ))
          ) : (
            <Text style={styles.empty}>No verses found. Try starting a new session.</Text>
          )}
        </ScrollView>
      );
    }

    if (step === 'verse-detail' && selectedVerse) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <VerseCard verse={selectedVerse} showFull />
          <AudioPlayer surah={selectedVerse.surah_number} ayah={selectedVerse.ayah_number} />
          <TafsirSection tafsir={tafsir} loading={tafsirLoading} />
          <TouchableOpacity style={styles.btn} onPress={() => setStep('reflection')}>
            <Text style={styles.btnText}>Begin Reflection →</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (step === 'reflection') {
      const done = currentQuestionIndex >= prompts.length;
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.stepTitle}>Reflect</Text>
          {done ? (
            <>
              <Text style={styles.stepSub}>Take a moment to sit with what came up.</Text>
              <TouchableOpacity style={styles.btn} onPress={() => setStep('journal')}>
                <Text style={styles.btnText}>Write in Journal →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ReflectionPrompt
                question={prompts[currentQuestionIndex]}
                index={currentQuestionIndex}
                total={prompts.length}
              />
              <TouchableOpacity style={styles.btnOutline} onPress={nextQuestion}>
                <Text style={styles.btnOutlineText}>
                  {currentQuestionIndex < prompts.length - 1
                    ? 'Next question →'
                    : "I'm ready to write →"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      );
    }

    if (step === 'journal') {
      return (
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepTitle}>Write your reflection</Text>
          <Text style={styles.stepSub}>This is your private space. Write freely.</Text>
          <TextInput
            style={styles.journalInput}
            multiline
            placeholder="What's in your heart right now…"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
          />
          <VoiceRecorder onTranscribed={appendJournalText} />
          <View style={styles.visibilityRow}>
            <TouchableOpacity
              style={[styles.visBtn, visibility === 'private' && styles.visBtnActive]}
              onPress={() => setVisibility('private')}
            >
              <Text style={[styles.visBtnText, visibility === 'private' && styles.visBtnTextActive]}>
                🔒 Private
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.visBtn, visibility === 'community' && styles.visBtnActive]}
              onPress={() => setVisibility('community')}
            >
              <Text
                style={[styles.visBtnText, visibility === 'community' && styles.visBtnTextActive]}
              >
                🌍 Community
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.btn, saving && styles.btnDisabled]}
            onPress={save}
            disabled={saving || !journalText.trim()}
          >
            <Text style={styles.btnText}>{saving ? 'Saving…' : 'Save reflection ✓'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={save}>
            <Text style={styles.skipBtnText}>Skip writing, just save the verse</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (step === 'complete') {
      return (
        <View style={styles.completeCentre}>
          {/* Decorative watermark */}
          <Text style={styles.completeWatermark}>ما شاء الله</Text>

          <Text style={styles.completeIcon}>🤲</Text>
          <Text style={styles.completeArabic}>ما شاء الله</Text>
          <Text style={styles.completeTitle}>MashaAllah</Text>
          <Text style={styles.completeSub}>
            Your reflection on {selectedVerse?.surah_name} {selectedVerse?.verse_key} has been
            saved.
          </Text>
          <TouchableOpacity
            style={[styles.btn, { marginBottom: 12 }]}
            onPress={() => router.replace('/(tabs)/journal')}
          >
            <Text style={styles.btnText}>View Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => router.replace('/(tabs)/tadabur')}
          >
            <Text style={styles.btnOutlineText}>New session</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // ── TAFSIR TAB CONTENT ──
  const renderTafsirTab = () => {
    if (!selectedVerse) {
      return (
        <View style={styles.centreMessage}>
          <Text style={styles.centreMessageText}>
            Select a verse in the Verses tab to view its tafsir
          </Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.verseRefHeader}>
          <Text style={styles.verseRefText}>
            {selectedVerse.surah_name} — {selectedVerse.verse_key}
          </Text>
        </View>
        <TafsirSection tafsir={tafsir} loading={tafsirLoading} />
      </ScrollView>
    );
  };

  // ── HADITH TAB CONTENT ──
  const renderHadithTab = () => {
    if (hadithLoading) {
      return (
        <View style={styles.centreMessage}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      );
    }
    if (hadithError) {
      return (
        <View style={styles.centreMessage}>
          <Text style={styles.centreMessageText}>
            Could not load hadith. Add your Sunnah API key to .env
          </Text>
        </View>
      );
    }
    if (hadithList.length === 0 && hadithFetched.current) {
      return (
        <View style={styles.centreMessage}>
          <Text style={styles.centreMessageText}>No hadith found for this category.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={hadithList}
        keyExtractor={(h) => `${h.collection}-${h.hadithNumber}`}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.hadithCard}>
            <Text style={styles.hadithRef}>
              {item.collection} · #{item.hadithNumber}
            </Text>
            <Text style={styles.hadithBody}>{item.body}</Text>
            {item.grades.length > 0 && (
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>{item.grades[0].grade}</Text>
              </View>
            )}
          </View>
        )}
      />
    );
  };

  // ── COMMUNITY TAB CONTENT ──
  const renderCommunityTab = () => {
    if (communityLoading) {
      return (
        <View style={styles.centreMessage}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      );
    }
    if (communityEntries.length === 0) {
      return (
        <View style={styles.centreMessage}>
          <Text style={styles.centreMessageText}>
            No community reflections yet for this category. Be the first to share.
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={communityEntries}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const name = item.profiles?.display_name ?? 'Anonymous';
          const initial = name.charAt(0).toUpperCase();
          const date = new Date(item.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return (
            <View style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>{initial}</Text>
                </View>
                <View style={styles.communityMeta}>
                  <Text style={styles.communityName}>{name}</Text>
                  <Text style={styles.communityDate}>{date}</Text>
                </View>
              </View>
              <Text style={styles.communityText} numberOfLines={3}>
                {item.journal_text}
              </Text>
            </View>
          );
        }}
      />
    );
  };

  // ── MOTIVATION TAB CONTENT ──
  const renderMotivationTab = () => {
    const clips: Clip[] = getClipsForCategory(category ?? '');
    if (clips.length === 0) {
      return (
        <View style={styles.centreMessage}>
          <Text style={styles.centreMessageText}>Clips coming soon, in sha Allah</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={clips}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <ClipCard
            clip={item}
            onPress={() => {
              if (item.youtubeId) {
                Linking.openURL(`https://youtube.com/watch?v=${item.youtubeId}`);
              } else {
                Alert.alert('Coming soon', 'Check back after the weekly update, in sha Allah.');
              }
            }}
          />
        )}
      />
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'verses':
        return renderVersesTab();
      case 'tafsir':
        return renderTafsirTab();
      case 'hadith':
        return renderHadithTab();
      case 'community':
        return renderCommunityTab();
      case 'motivation':
        return renderMotivationTab();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TabBar />
      <View style={styles.tabContent}>{renderActiveTab()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
  tabPill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tabPillActive: {
    backgroundColor: Colors.PRIMARY,
  },
  tabPillText: {
    fontFamily: Fonts.BODY,
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
  },
  tabPillTextActive: {
    fontFamily: Fonts.BODY_MEDIUM,
    fontSize: 14,
    color: '#FFFFFF',
  },
  tabContent: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  categoryIcon: { fontSize: 28 },
  categoryName: { fontSize: 18, fontWeight: '700', color: Colors.TEXT },
  stepTitle: { fontSize: 24, fontWeight: '700', color: Colors.TEXT, marginBottom: 6 },
  stepSub: { fontSize: 14, color: Colors.TEXT_MUTED, marginBottom: 20 },
  empty: { fontSize: 15, color: Colors.TEXT_MUTED, textAlign: 'center', marginTop: 40 },
  btn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radii.button,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
    borderRadius: Radii.button,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  btnOutlineText: { fontFamily: Fonts.BODY_MEDIUM, color: Colors.PRIMARY, fontSize: 16 },
  journalInput: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.TEXT,
    minHeight: 180,
    lineHeight: 26,
    marginBottom: 12,
  },
  visibilityRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  visBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    alignItems: 'center',
  },
  visBtnActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_ULTRA_LIGHT },
  visBtnText: { fontSize: 14, color: Colors.TEXT_MUTED, fontWeight: '500' },
  visBtnTextActive: { color: Colors.PRIMARY, fontWeight: '700' },
  skipBtn: { alignItems: 'center', marginTop: 12 },
  skipBtnText: { fontSize: 13, color: Colors.TEXT_MUTED, textDecorationLine: 'underline' },
  completeCentre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    backgroundColor: Colors.BACKGROUND,
  },
  completeWatermark: {
    position: 'absolute',
    fontFamily: Fonts.ARABIC,
    fontSize: 120,
    color: Colors.BORDER,
    opacity: 0.3,
    zIndex: -1,
    textAlign: 'center',
    alignSelf: 'center',
  },
  completeIcon: { fontSize: 48, marginBottom: 24 },
  completeArabic: {
    fontFamily: Fonts.ARABIC,
    fontSize: 36,
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: 8,
  },
  completeTitle: {
    fontFamily: Fonts.HEADING_SEMIBOLD,
    fontSize: 28,
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  completeSub: {
    fontFamily: Fonts.BODY,
    fontSize: 15,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  centreMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  centreMessageText: {
    fontSize: 15,
    color: Colors.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 24,
  },
  verseRefHeader: { marginBottom: 16 },
  verseRefText: { fontSize: 16, fontWeight: '700', color: Colors.TEXT },
  hadithCard: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  hadithRef: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ACCENT,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  hadithBody: {
    fontSize: 15,
    color: Colors.TEXT,
    lineHeight: 24,
  },
  gradeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.PRIMARY_ULTRA_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 10,
  },
  gradeText: { fontSize: 11, fontWeight: '600', color: Colors.PRIMARY },
  communityCard: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  communityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: { fontSize: 15, fontWeight: '700', color: Colors.SURFACE },
  communityMeta: { flex: 1 },
  communityName: { fontSize: 14, fontWeight: '600', color: Colors.TEXT },
  communityDate: { fontSize: 12, color: Colors.TEXT_MUTED, marginTop: 1 },
  communityText: { fontSize: 14, color: Colors.TEXT, lineHeight: 22 },
});
