import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { Fonts, Radii } from '../../constants/typography';

const GOALS = [
  { id: 'comfort', label: 'Find comfort in hardship', icon: '🌿' },
  { id: 'connection', label: 'Deepen my connection with Allah', icon: '💚' },
  { id: 'habit', label: 'Build a daily Quran habit', icon: '📅' },
  { id: 'grief', label: 'Process grief or loss', icon: '🌹' },
  { id: 'answers', label: 'Find answers in the Quran', icon: '💡' },
  { id: 'community', label: 'Share with a community', icon: '🌍' },
];

function OnboardingProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  const C = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
      {[1, 2, 3, 4].map((s, i) => (
        <React.Fragment key={s}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s <= step ? C.PRIMARY : C.BORDER }} />
          {i < 3 && <View style={{ width: 28, height: 1.5, backgroundColor: s < step ? C.PRIMARY : C.BORDER }} />}
        </React.Fragment>
      ))}
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.BACKGROUND },
    container: { padding: 28, paddingBottom: 40 },
    title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 26, color: C.TEXT, marginBottom: 6 },
    sub: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT_MUTED, marginBottom: 24 },
    item: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: C.SURFACE,
      borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.BORDER, gap: 12,
    },
    selected: { borderColor: C.PRIMARY, backgroundColor: C.PRIMARY_ULTRA_LIGHT },
    goalIcon: { fontSize: 22 },
    goalLabel: { flex: 1, fontFamily: Fonts.BODY, fontSize: 15, color: C.TEXT },
    selectedText: { fontFamily: Fonts.BODY_MEDIUM, color: C.PRIMARY },
    check: { fontSize: 16, color: C.PRIMARY },
    btn: { backgroundColor: C.PRIMARY, borderRadius: Radii.button, padding: 16, alignItems: 'center', marginTop: 16 },
    btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
  });
}

export default function GoalsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

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
        <OnboardingProgress step={2} />
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
