import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { useSessionStore } from '../stores/session';
import { Colors } from '../constants/colors';
import { getCategoryBySlug } from '../constants/categories';
import { VerseCard } from '../components/VerseCard';
import { TafsirSection } from '../components/TafsirSection';
import { AudioPlayer } from '../components/AudioPlayer';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ReflectionPrompt } from '../components/ReflectionPrompt';
import { searchVerses, getVerse, getTafsir } from '../lib/quran-api';
import type { Verse } from '../types';

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

  const [loading, setLoading] = useState(false);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cat = category ? getCategoryBySlug(category) : null;
  const prompts = cat?.reflectionPrompts ?? [
    'What does this verse mean to you today?',
    'How does it speak to what you\'re going through?',
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

  // ── STEP: VERSES ──
  if (step === 'verses') {
    return (
      <SafeAreaView style={styles.safe}>
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
      </SafeAreaView>
    );
  }

  // ── STEP: VERSE DETAIL ──
  if (step === 'verse-detail' && selectedVerse) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <VerseCard verse={selectedVerse} showFull />
          <AudioPlayer surah={selectedVerse.surah_number} ayah={selectedVerse.ayah_number} />
          <TafsirSection tafsir={tafsir} loading={tafsirLoading} />
          <TouchableOpacity style={styles.btn} onPress={() => setStep('reflection')}>
            <Text style={styles.btnText}>Begin Reflection →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── STEP: REFLECTION ──
  if (step === 'reflection') {
    const done = currentQuestionIndex >= prompts.length;
    return (
      <SafeAreaView style={styles.safe}>
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
                  {currentQuestionIndex < prompts.length - 1 ? 'Next question →' : 'I\'m ready to write →'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── STEP: JOURNAL ──
  if (step === 'journal') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
              <Text style={[styles.visBtnText, visibility === 'private' && styles.visBtnTextActive]}>🔒 Private</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.visBtn, visibility === 'community' && styles.visBtnActive]}
              onPress={() => setVisibility('community')}
            >
              <Text style={[styles.visBtnText, visibility === 'community' && styles.visBtnTextActive]}>🌍 Community</Text>
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
      </SafeAreaView>
    );
  }

  // ── STEP: COMPLETE ──
  if (step === 'complete') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.completeCentre}>
          <Text style={styles.completeIcon}>🤲</Text>
          <Text style={styles.completeTitle}>MashaAllah</Text>
          <Text style={styles.completeSub}>
            Your reflection on {selectedVerse?.surah_name} {selectedVerse?.verse_key} has been saved.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/journal')}>
            <Text style={styles.btnText}>View Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => { router.replace('/(tabs)/tadabur'); }}>
            <Text style={styles.btnOutlineText}>New session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { padding: 20, paddingBottom: 40 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  categoryIcon: { fontSize: 28 },
  categoryName: { fontSize: 18, fontWeight: '700', color: Colors.TEXT },
  stepTitle: { fontSize: 24, fontWeight: '700', color: Colors.TEXT, marginBottom: 6 },
  stepSub: { fontSize: 14, color: Colors.TEXT_MUTED, marginBottom: 20 },
  empty: { fontSize: 15, color: Colors.TEXT_MUTED, textAlign: 'center', marginTop: 40 },
  btn: { backgroundColor: Colors.PRIMARY, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: Colors.SURFACE, fontSize: 16, fontWeight: '600' },
  btnOutline: { borderWidth: 1.5, borderColor: Colors.PRIMARY, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  btnOutlineText: { color: Colors.PRIMARY, fontSize: 16, fontWeight: '600' },
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
  visBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.BORDER, alignItems: 'center' },
  visBtnActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_ULTRA_LIGHT },
  visBtnText: { fontSize: 14, color: Colors.TEXT_MUTED, fontWeight: '500' },
  visBtnTextActive: { color: Colors.PRIMARY, fontWeight: '700' },
  skipBtn: { alignItems: 'center', marginTop: 12 },
  skipBtnText: { fontSize: 13, color: Colors.TEXT_MUTED, textDecorationLine: 'underline' },
  completeCentre: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 16 },
  completeIcon: { fontSize: 64 },
  completeTitle: { fontSize: 30, fontWeight: '700', color: Colors.PRIMARY },
  completeSub: { fontSize: 15, color: Colors.TEXT_MUTED, textAlign: 'center', lineHeight: 24 },
});
