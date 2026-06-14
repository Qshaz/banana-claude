import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts, Radii } from '../constants/typography';
import type { Verse } from '../types';

interface Props { verse: Verse | null; loading?: boolean; }

export function VerseOfDay({ verse, loading }: Props) {
  const C = useColors();
  return (
    <View style={[styles.card, { backgroundColor: C.PRIMARY }]}>
      <Text style={[styles.label, { color: C.ACCENT }]}>✨ Verse of the Day</Text>
      {loading ? (
        <ActivityIndicator color={C.ACCENT} style={{ marginVertical: 20 }} />
      ) : verse ? (
        <>
          <Text style={[styles.arabic, { color: C.SURFACE }]}>{verse.text_arabic}</Text>
          <View style={styles.divider} />
          <Text style={[styles.translation, { color: C.SURFACE }]}>{verse.translation}</Text>
          <Text style={[styles.ref, { color: C.ACCENT }]}>— {verse.surah_name} {verse.verse_key}</Text>
        </>
      ) : (
        <Text style={[styles.placeholder, { color: C.SURFACE }]}>
          "And He found you lost and guided you." — Duha 93:7
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radii.card, padding: 20, marginBottom: 20 },
  label: { fontFamily: Fonts.BODY, fontSize: 12, marginBottom: 14, letterSpacing: 0.5 },
  arabic: { fontFamily: Fonts.ARABIC, fontSize: 24, lineHeight: 44, textAlign: 'right', marginBottom: 14 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 14 },
  translation: { fontFamily: Fonts.BODY, fontSize: 14, lineHeight: 22, fontStyle: 'italic', opacity: 0.85 },
  ref: { fontFamily: Fonts.BODY, fontSize: 12, marginTop: 10, textAlign: 'right' },
  placeholder: { fontFamily: Fonts.BODY, fontSize: 15, lineHeight: 24, fontStyle: 'italic', marginVertical: 10, opacity: 0.85 },
});
