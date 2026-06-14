import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const FAQS = [
  {
    q: 'What is Tadabur?',
    a: 'Tadabur (تدبر) means deep, contemplative reflection on the Quran — not just reading, but sitting with a verse, pondering its meaning, and letting it speak to your life. Hikmah guides you through this process step by step.',
  },
  {
    q: 'How do I start a session?',
    a: 'Tap the Tadabur tab at the bottom. Search for what you\'re feeling (e.g. "anxiety") or pick a category from the grid. You\'ll be shown relevant verses — tap one to begin. You can then read tafsir, listen to recitation, explore hadiths, and write your reflection.',
  },
  {
    q: 'What are the categories?',
    a: 'There are 20 life themes — Patience, Hope, Anxiety, Depression, Stress, Trust in Allah, Grief, Forgiveness, Healing, Loneliness, Rizq, and more. Each is mapped to relevant verses, hadiths, and scholar clips. You can also create your own custom category.',
  },
  {
    q: 'How do I create a custom category?',
    a: 'In the Tadabur screen, tap the + button (top right) or the "Create your own" link at the bottom. Give it a name, optional description, and choose an emoji. It appears in your grid alongside the built-in categories.',
  },
  {
    q: 'What are the session tabs (Verses, Tafsir, Hadith, Community, Motivation)?',
    a: 'Each tab gives you a different way to engage with your chosen category:\n\n• Verses — pick a verse and write your reflection\n• Tafsir — read Ibn Kathir\'s commentary on the selected verse\n• Hadith — related sayings of the Prophet ﷺ\n• Community — read what others have shared publicly\n• Motivation — short clips from trusted scholars on this topic',
  },
  {
    q: 'How does the journal work?',
    a: 'After reflecting on a verse, you\'re invited to write freely — whatever is in your heart. You can type or use the voice recorder (it transcribes automatically). Choose Private (only you can see it) or Community (shared anonymously with other users).',
  },
  {
    q: 'Can I record my voice instead of typing?',
    a: 'Yes. In the journal step, tap the microphone button and speak. Your words are automatically transcribed and added to your journal entry. You\'ll need to grant microphone permission the first time.',
  },
  {
    q: 'What is the Community tab?',
    a: 'When you save a journal entry as "Community", it\'s shared with other Hikmah users anonymously. In any category\'s Community tab, you can read how others have reflected on similar experiences. It\'s a space of shared vulnerability and spiritual solidarity.',
  },
  {
    q: 'What is the streak counter?',
    a: 'Your streak counts how many consecutive days you\'ve completed a tadabur session. It resets if you miss a day. Set a daily reminder in your Profile to help keep your streak going.',
  },
  {
    q: 'What is the Inspiration tab?',
    a: 'The Inspiration tab (the play button in the nav) is a library of short clips from trusted scholars — Nouman Ali Khan, Tim Humble, Belal Assad, Abu Bakr Zoud, Dr Haifa Younis, Saad Tasleem, Suleiman Hani, Iram bint Safia, and Aaisha Aamir. Browse by category or by speaker. Clips open in the YouTube app.',
  },
  {
    q: 'How do I set a daily reminder?',
    a: 'Go to Profile → Daily reminder. Toggle it on and set your preferred time. You\'ll receive a gentle notification each day at that time inviting you to sit with the Quran.',
  },
  {
    q: 'Is my journal private?',
    a: 'By default, all journal entries are Private — only you can see them. You choose to share an entry with the community at the time of saving. You cannot change visibility after saving.',
  },
  {
    q: 'How does the Verse of the Day work?',
    a: 'A new verse is featured on your Home screen each day, chosen to nourish the heart. Tap it to begin a full tadabur session on that verse.',
  },
  {
    q: 'What is the Hadith tab powered by?',
    a: 'Hadith are sourced from sunnah.com — the most trusted digital hadith reference — via their official API. Each category has curated, verified hadith from Sahih Bukhari, Sahih Muslim, Tirmidhi, Abu Dawud, and other major collections.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const sendFeedback = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    const { error } = await supabase.from('feedback').insert({
      user_id: userId ?? null,
      message: feedback.trim(),
    });
    setSending(false);
    if (error) {
      Alert.alert('Could not send', 'Please try emailing us at support@hikmah.app');
    } else {
      setFeedback('');
      Alert.alert('JazakAllah khair', 'Your feedback has been received. We read every message.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqItem}
            onPress={() => toggle(i)}
            activeOpacity={0.7}
          >
            <View style={styles.faqRow}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqChevron}>{openIndex === i ? '▲' : '▼'}</Text>
            </View>
            {openIndex === i && (
              <Text style={styles.faqA}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact & Review */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Get in touch</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Linking.openURL('mailto:support@hikmah.app')}
        >
          <Text style={styles.actionIcon}>✉️</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionLabel}>Email us</Text>
            <Text style={styles.actionSub}>support@hikmah.app</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() =>
            Linking.openURL(
              'https://apps.apple.com/app/id000000000?action=write-review'
            )
          }
        >
          <Text style={styles.actionIcon}>⭐</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionLabel}>Leave a review</Text>
            <Text style={styles.actionSub}>Your review helps more Muslims find Hikmah</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Feedback form */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Send feedback</Text>
        <Text style={styles.feedbackHint}>
          Feature requests, bug reports, content suggestions — we want to hear it all.
        </Text>
        <TextInput
          style={styles.feedbackInput}
          multiline
          placeholder="Tell us what you think or what you'd like to see…"
          placeholderTextColor={Colors.TEXT_MUTED}
          value={feedback}
          onChangeText={setFeedback}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!feedback.trim() || sending) && styles.sendBtnDisabled]}
          onPress={sendFeedback}
          disabled={!feedback.trim() || sending}
        >
          <Text style={styles.sendBtnText}>{sending ? 'Sending…' : 'Send feedback'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  back: { marginRight: 12 },
  backText: { fontSize: 15, color: Colors.PRIMARY, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.TEXT },
  container: { padding: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: Colors.TEXT_MUTED,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  faqItem: {
    backgroundColor: Colors.SURFACE, borderRadius: 12, padding: 16,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.BORDER,
  },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  faqQ: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.TEXT, lineHeight: 22 },
  faqChevron: { fontSize: 11, color: Colors.TEXT_MUTED, marginTop: 2 },
  faqA: {
    marginTop: 12, fontSize: 14, color: Colors.TEXT_MUTED,
    lineHeight: 22, borderTopWidth: 1, borderTopColor: Colors.BORDER, paddingTop: 12,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.SURFACE, borderRadius: 12, padding: 16,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.BORDER,
  },
  actionIcon: { fontSize: 22 },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 15, fontWeight: '600', color: Colors.TEXT },
  actionSub: { fontSize: 13, color: Colors.TEXT_MUTED, marginTop: 2 },
  arrow: { fontSize: 20, color: Colors.TEXT_MUTED },
  feedbackHint: { fontSize: 14, color: Colors.TEXT_MUTED, marginBottom: 12, lineHeight: 20 },
  feedbackInput: {
    backgroundColor: Colors.SURFACE, borderWidth: 1, borderColor: Colors.BORDER,
    borderRadius: 14, padding: 16, fontSize: 15, color: Colors.TEXT,
    minHeight: 120, lineHeight: 24, marginBottom: 12,
  },
  sendBtn: {
    backgroundColor: Colors.PRIMARY, borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { color: Colors.SURFACE, fontSize: 16, fontWeight: '600' },
});
