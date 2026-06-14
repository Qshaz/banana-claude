import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { getCategoryIcon, getCategoryName } from '../../constants/categories';

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.BACKGROUND },
    container: { padding: 24, alignItems: 'center', paddingBottom: 40 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 32, color: C.SURFACE, fontWeight: '700' },
    name: { fontSize: 22, fontWeight: '700', color: C.TEXT, marginBottom: 4 },
    joined: { fontSize: 13, color: C.TEXT_MUTED, marginBottom: 24 },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 28, width: '100%' },
    statCard: { flex: 1, backgroundColor: C.SURFACE, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.BORDER },
    statValue: { fontSize: 28, fontWeight: '700', color: C.PRIMARY, marginBottom: 4 },
    statLabel: { fontSize: 12, color: C.TEXT_MUTED },
    section: { width: '100%', marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: C.TEXT, marginBottom: 12 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: C.PRIMARY_ULTRA_LIGHT, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
    chipText: { fontSize: 13, color: C.PRIMARY, fontWeight: '500' },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.SURFACE, borderRadius: 12, padding: 14,
      borderWidth: 1, borderColor: C.BORDER, marginBottom: 8,
    },
    settingLabel: { fontSize: 15, color: C.TEXT },
    settingValue: { fontSize: 15, color: C.TEXT_MUTED },
    helpRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
      backgroundColor: C.SURFACE, borderRadius: 12, padding: 16,
      borderWidth: 1, borderColor: C.BORDER, marginBottom: 12,
    },
    helpIcon: { fontSize: 18 },
    helpLabel: { flex: 1, fontSize: 15, color: C.TEXT, fontWeight: '500' },
    helpArrow: { fontSize: 20, color: C.TEXT_MUTED },
    signOut: { marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: C.ERROR, width: '100%', alignItems: 'center' },
    signOutText: { color: C.ERROR, fontSize: 15, fontWeight: '600' },
  });
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { profile, update } = useProfile(userId);
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const signOut = () =>
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(profile.display_name ?? 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile.display_name}</Text>
        <Text style={styles.joined}>Member since {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.total_entries}</Text>
            <Text style={styles.statLabel}>Reflections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.streak_count}</Text>
            <Text style={styles.statLabel}>Day streak 🔥</Text>
          </View>
        </View>

        {profile.categories_of_interest.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your themes</Text>
            <View style={styles.chips}>
              {profile.categories_of_interest.map((slug) => (
                <View key={slug} style={styles.chip}>
                  <Text style={styles.chipText}>{getCategoryIcon(slug)} {getCategoryName(slug)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily reminder</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable reminders</Text>
            <Switch
              value={profile.notification_enabled}
              onValueChange={(v) => update({ notification_enabled: v })}
              trackColor={{ true: C.PRIMARY }}
            />
          </View>
          {profile.notification_enabled && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Reminder time</Text>
              <Text style={styles.settingValue}>{profile.notification_time}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.helpRow} onPress={() => router.push('/help')}>
          <Text style={styles.helpIcon}>❓</Text>
          <Text style={styles.helpLabel}>Help & Support</Text>
          <Text style={styles.helpArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
