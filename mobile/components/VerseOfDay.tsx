import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts, Radii } from '../constants/typography';
import type { Verse } from '../types';

interface Props {
  verse: Verse | null;
  loading?: boolean;
}

export function VerseOfDay({ verse, loading }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>✨ Verse of the Day</Text>
      {loading ? (
        <ActivityIndicator color={Colors.ACCENT} style={{ marginVertical: 20 }} />
      ) : verse ? (
        <>
          <Text style={styles.arabic}>{verse.text_arabic}</Text>
          <View style={styles.divider} />
          <Text style={styles.translation}>{verse.translation}</Text>
          <Text style={styles.ref}>— {verse.surah_name} {verse.verse_key}</Text>
        </>
      ) : (
        <Text style={styles.placeholder}>
          "And He found you lost and guided you." — Duha 93:7
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radii.card,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontFamily: Fonts.BODY,
    fontSize: 12,
    color: Colors.ACCENT,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  arabic: {
    fontFamily: Fonts.ARABIC,
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'right',
    color: Colors.SURFACE,
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 14 },
  translation: {
    fontFamily: Fonts.BODY,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.SURFACE,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  ref: {
    fontFamily: Fonts.BODY,
    fontSize: 12,
    color: Colors.ACCENT,
    marginTop: 10,
    textAlign: 'right',
  },
  placeholder: {
    fontFamily: Fonts.BODY,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.SURFACE,
    fontStyle: 'italic',
    marginVertical: 10,
    opacity: 0.85,
  },
});
