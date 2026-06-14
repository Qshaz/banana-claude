import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts, Typography, Radii } from '../constants/typography';
import type { Verse } from '../types';

interface Props {
  verse: Verse;
  onPress?: () => void;
  showFull?: boolean;
}

export function VerseCard({ verse, onPress, showFull }: Props) {
  const C = useColors();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.SURFACE, borderColor: C.DIVIDER, shadowColor: C.SHADOW }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.arabic, { color: C.TEXT_ARABIC }]} numberOfLines={showFull ? undefined : 3}>
        {verse.text_arabic}
      </Text>
      <View style={[styles.divider, { backgroundColor: C.DIVIDER }]} />
      <Text style={[styles.translation, { color: C.TEXT }]} numberOfLines={showFull ? undefined : 2}>
        {verse.translation}
      </Text>
      <View style={[styles.refChip, { backgroundColor: C.BACKGROUND_SECONDARY }]}>
        <Text style={[styles.refText, { color: C.TEXT_SECONDARY }]}>
          {verse.surah_name} · {verse.verse_key}
        </Text>
      </View>
      {!showFull && onPress && (
        <Text style={[styles.tapHint, { color: C.PRIMARY }]}>Tap to explore →</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.verseCard,
    padding: 28,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 3,
  },
  arabic: { ...Typography.arabicVerse, marginBottom: 0 },
  divider: { height: 1, marginVertical: 16 },
  translation: { fontFamily: Fonts.BODY, fontSize: 17, lineHeight: 30 },
  refChip: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: Radii.pill, alignSelf: 'flex-start', marginTop: 12,
  },
  refText: { fontFamily: Fonts.BODY, fontSize: 12 },
  tapHint: { fontSize: 12, marginTop: 10, textAlign: 'right', fontFamily: Fonts.BODY },
});
