import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { Fonts, Radii } from '../../constants/typography';

const TIMES = ['06:00', '08:00', '12:00', '16:00', '21:00', '22:00'];
const TIME_LABELS: Record<string, string> = {
  '06:00': 'Fajr time 🌅', '08:00': 'Morning ☀️', '12:00': 'Dhuhr 🌞',
  '16:00': 'Afternoon 🌤', '21:00': 'Evening 🌙', '22:00': 'Night 🌃',
};

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
    container: { flex: 1, padding: 28 },
    title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 26, color: C.TEXT, marginBottom: 6 },
    sub: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT_MUTED, marginBottom: 28 },
    toggle: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.SURFACE, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: C.BORDER,
    },
    toggleLabel: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 15, color: C.TEXT },
    sectionLabel: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT_MUTED, marginBottom: 10 },
    timeBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.SURFACE, borderRadius: 10, padding: 13, marginBottom: 8, borderWidth: 1.5, borderColor: C.BORDER,
    },
    timeBtnSelected: { borderColor: C.PRIMARY, backgroundColor: C.PRIMARY_ULTRA_LIGHT },
    timeLabel: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT },
    timeLabelSelected: { fontFamily: Fonts.BODY_MEDIUM, color: C.PRIMARY },
    check: { fontSize: 14, color: C.PRIMARY },
    btn: { backgroundColor: C.PRIMARY, borderRadius: Radii.button, padding: 16, alignItems: 'center', marginTop: 'auto' },
    btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
  });
}

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState('08:00');
  const router = useRouter();
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const finish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        notification_enabled: enabled,
        notification_time: time,
        onboarding_complete: true,
      }).eq('id', user.id);
    }
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <OnboardingProgress step={4} />
        <Text style={styles.title}>Daily Tadabur Reminder</Text>
        <Text style={styles.sub}>A gentle nudge to reflect with the Quran each day</Text>
        <View style={styles.toggle}>
          <Text style={styles.toggleLabel}>Enable daily reminder</Text>
          <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: C.PRIMARY }} />
        </View>
        {enabled && (
          <>
            <Text style={styles.sectionLabel}>Preferred time</Text>
            {TIMES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeBtn, time === t && styles.timeBtnSelected]}
                onPress={() => setTime(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeLabel, time === t && styles.timeLabelSelected]}>
                  {TIME_LABELS[t]} — {t}
                </Text>
                {time === t && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </>
        )}
        <TouchableOpacity style={styles.btn} onPress={finish}>
          <Text style={styles.btnText}>Start your journey →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
