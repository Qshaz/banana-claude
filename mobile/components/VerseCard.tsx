import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts, Typography, Radii } from '../constants/typography';
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
      <Text style={styles.arabic} numberOfLines={showFull ? undefined : 3}>
        {verse.text_arabic}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.translation} numberOfLines={showFull ? undefined : 2}>
        {verse.translation}
      </Text>
      <View style={styles.refChip}>
        <Text style={styles.refText}>{verse.surah_name} · {verse.verse_key}</Text>
      </View>
      {!showFull && onPress && (
        <Text style={styles.tapHint}>Tap to explore →</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: Radii.verseCard,
    padding: 28,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
    shadowColor: Colors.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 3,
  },
  arabic: {
    ...Typography.arabicVerse,
    color: Colors.TEXT_ARABIC,
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.DIVIDER,
    marginVertical: 16,
  },
  translation: {
    fontFamily: Fonts.BODY,
    fontSize: 17,
    lineHeight: 30,
    color: Colors.TEXT,
  },
  refChip: {
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  refText: {
    fontFamily: Fonts.BODY,
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
  },
  tapHint: {
    fontSize: 12,
    color: Colors.PRIMARY,
    marginTop: 10,
    textAlign: 'right',
    fontFamily: Fonts.BODY,
  },
});
