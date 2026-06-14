import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
          <Text style={styles.logo}>حكمة</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Begin your tadabur journey</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 8 characters)"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={signup} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Sign in</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { flex: 1, justifyContent: 'center', padding: 28 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 52, color: Colors.PRIMARY, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.TEXT, marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.TEXT_MUTED },
  form: { gap: 14 },
  input: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.TEXT,
  },
  btn: { backgroundColor: Colors.PRIMARY, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.SURFACE, fontSize: 16, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 14, color: Colors.TEXT_MUTED },
  linkBold: { color: Colors.PRIMARY, fontWeight: '600' },
});
