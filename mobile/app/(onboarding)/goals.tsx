import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

const GOALS = [
  { id: 'comfort', label: 'Find comfort in hardship', icon: '🤲' },
  { id: 'connection', label: 'Deepen my connection with Allah', icon: '💚' },
  { id: 'habit', label: 'Build a daily Quran habit', icon: '📅' },
  { id: 'grief', label: 'Process grief or loss', icon: '🕊️' },
  { id: 'answers', label: 'Find answers in the Quran', icon: '💡' },
  { id: 'community', label: 'Share with a community', icon: '🌍' },
];

export default function GoalsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const next = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ goals: selected }).eq('id', user.id);
    router.push('/(onboarding)/categories');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.step}>2 of 4</Text>
        <Text style={styles.title}>What brings you here?</Text>
        <Text style={styles.sub}>Select all that apply</Text>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[styles.item, selected.includes(g.id) && styles.selected]}
            onPress={() => toggle(g.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.goalIcon}>{g.icon}</Text>
            <Text style={[styles.goalLabel, selected.includes(g.id) && styles.selectedText]}>{g.label}</Text>
            {selected.includes(g.id) && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.btn} onPress={next}>
          <Text style={styles.btnText}>{selected.length > 0 ? 'Continue →' : 'Skip for now →'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { padding: 28, paddingBottom: 40 },
  step: { fontSize: 12, color: Colors.TEXT_MUTED, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.TEXT, marginBottom: 6 },
  sub: { fontSize: 14, color: Colors.TEXT_MUTED, marginBottom: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SURFACE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    gap: 12,
  },
  selected: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_ULTRA_LIGHT },
  goalIcon: { fontSize: 22 },
  goalLabel: { flex: 1, fontSize: 15, color: Colors.TEXT },
  selectedText: { color: Colors.PRIMARY, fontWeight: '600' },
  check: { fontSize: 16, color: Colors.PRIMARY },
  btn: { backgroundColor: Colors.PRIMARY, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: Colors.SURFACE, fontSize: 16, fontWeight: '600' },
});
