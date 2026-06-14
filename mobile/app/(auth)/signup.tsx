import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { Fonts, Radii } from '../../constants/typography';

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.BACKGROUND },
    container: { flex: 1, justifyContent: 'center', padding: 28 },
    header: { alignItems: 'center', marginBottom: 40 },
    bismillah: {
      fontFamily: Fonts.ARABIC, fontSize: 18,
      color: C.TEXT_MUTED, textAlign: 'center', marginBottom: 20,
    },
    logo: { fontFamily: Fonts.ARABIC, fontSize: 52, color: C.PRIMARY, marginBottom: 4 },
    title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 28, color: C.TEXT, marginBottom: 6 },
    subtitle: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT_MUTED, textAlign: 'center' },
    form: { gap: 14 },
    input: {
      backgroundColor: C.SURFACE,
      borderWidth: 1, borderColor: C.BORDER,
      borderRadius: 12, padding: 14,
      fontFamily: Fonts.BODY, fontSize: 16, color: C.TEXT,
    },
    btn: { backgroundColor: C.PRIMARY, borderRadius: Radii.button, padding: 16, alignItems: 'center', marginTop: 4 },
    btnDisabled: { opacity: 0.6 },
    btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
    link: { alignItems: 'center', marginTop: 8 },
    linkText: { fontFamily: Fonts.BODY, fontSize: 14, color: C.TEXT_MUTED },
    linkBold: { color: C.PRIMARY, fontFamily: Fonts.BODY_MEDIUM },
  });
}

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const signup = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, onboarding_complete: false });
    }
    setLoading(false);
    if (error) Alert.alert('Sign up failed', error.message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.logo}>حكمة</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Begin your Tadabur journey</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={C.TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 8 characters)"
            placeholderTextColor={C.TEXT_MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={signup} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
