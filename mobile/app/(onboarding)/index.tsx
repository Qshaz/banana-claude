import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { Fonts, Radii } from '../../constants/typography';

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
    container: { flex: 1, justifyContent: 'center', padding: 28 },
    bismillah: { fontFamily: Fonts.ARABIC, fontSize: 18, color: C.TEXT_MUTED, textAlign: 'center', marginBottom: 24 },
    title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 28, color: C.TEXT, textAlign: 'center', marginBottom: 16 },
    desc: { fontFamily: Fonts.BODY, fontSize: 15, lineHeight: 24, color: C.TEXT_MUTED, textAlign: 'center', marginBottom: 36 },
    label: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 16, color: C.TEXT, marginBottom: 10 },
    input: {
      backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER,
      borderRadius: 12, padding: 14, fontFamily: Fonts.BODY, fontSize: 18, color: C.TEXT, marginBottom: 20,
    },
    btn: { backgroundColor: C.PRIMARY, borderRadius: Radii.button, padding: 16, alignItems: 'center' },
    btnDisabled: { opacity: 0.4 },
    btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
  });
}

export default function OnboardingWelcome() {
  const [name, setName] = useState('');
  const router = useRouter();
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const next = async () => {
    if (!name.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ display_name: name.trim() }).eq('id', user.id);
    router.push('/(onboarding)/goals');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <OnboardingProgress step={1} />
        <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        <Text style={styles.title}>Welcome to Hikmah</Text>
        <Text style={styles.desc}>
          A space for Tadabur & Tawakkul — sit with the Quran, reflect deeply,
          and learn to trust Allah with what's in your heart.
        </Text>
        <Text style={styles.label}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={C.TEXT_MUTED}
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <TouchableOpacity style={[styles.btn, !name.trim() && styles.btnDisabled]} onPress={next} disabled={!name.trim()}>
          <Text style={styles.btnText}>Continue →</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
