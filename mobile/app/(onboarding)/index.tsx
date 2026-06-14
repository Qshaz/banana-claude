import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';
import { Fonts, Radii } from '../../constants/typography';

function OnboardingProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
      {[1, 2, 3, 4].map((s, i) => (
        <React.Fragment key={s}>
          <View style={{
            width: 10, height: 10, borderRadius: 5,
            backgroundColor: s <= step ? Colors.PRIMARY : Colors.BORDER,
          }} />
          {i < 3 && (
            <View style={{
              width: 28, height: 1.5,
              backgroundColor: s < step ? Colors.PRIMARY : Colors.BORDER,
            }} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default function OnboardingWelcome() {
  const [name, setName] = useState('');
  const router = useRouter();

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
          A space for deep Quranic reflection — finding verses that speak to your heart,
          understanding them through tafsir, and writing what Allah brings to your mind.
        </Text>
        <Text style={styles.label}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={Colors.TEXT_MUTED}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { flex: 1, justifyContent: 'center', padding: 28 },
  bismillah: { fontFamily: Fonts.ARABIC, fontSize: 22, textAlign: 'center', color: Colors.PRIMARY, marginBottom: 24 },
  title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 28, color: Colors.TEXT, textAlign: 'center', marginBottom: 16 },
  desc: { fontFamily: Fonts.BODY, fontSize: 15, lineHeight: 24, color: Colors.TEXT_MUTED, textAlign: 'center', marginBottom: 36 },
  label: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 16, color: Colors.TEXT, marginBottom: 10 },
  input: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    fontFamily: Fonts.BODY,
    fontSize: 18,
    color: Colors.TEXT,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radii.button,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
});
