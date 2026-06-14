import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

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
  bismillah: { fontSize: 22, textAlign: 'center', color: Colors.PRIMARY, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.TEXT, textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 15, lineHeight: 24, color: Colors.TEXT_MUTED, textAlign: 'center', marginBottom: 36 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.TEXT, marginBottom: 10 },
  input: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: Colors.TEXT,
    marginBottom: 20,
  },
  btn: { backgroundColor: Colors.PRIMARY, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: Colors.SURFACE, fontSize: 16, fontWeight: '600' },
});
