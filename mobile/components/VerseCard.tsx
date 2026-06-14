import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import type { Verse } from '../types';

interface Props {
  verse: Verse;
  onPress?: () => void;
  showFull?: boolean;
}

export function VerseCard({ verse, onPress, showFull }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.ref}>{verse.surah_name} · {verse.verse_key}</Text>
      <Text style={styles.arabic} numberOfLines={showFull ? undefined : 3}>
        {verse.text_arabic}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.translation} numberOfLines={showFull ? undefined : 2}>
        {verse.translation}
      </Text>
      {!showFull && onPress && (
        <Text style={styles.tapHint}>Tap to explore →</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    shadowColor: Colors.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  ref: { fontSize: 12, color: Colors.ACCENT, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 },
  arabic: {
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'right',
    color: Colors.TEXT,
    fontFamily: undefined, // system will render Arabic correctly
    marginBottom: 12,
  },
  divider: { height: 1, backgroundColor: Colors.BORDER, marginBottom: 12 },
  translation: { fontSize: 14, lineHeight: 22, color: Colors.TEXT_MUTED },
  tapHint: { fontSize: 12, color: Colors.PRIMARY, marginTop: 10, textAlign: 'right' },
});
