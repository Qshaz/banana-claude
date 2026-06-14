import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts, Radii } from '../constants/typography';
import { getCategoryIcon, getCategoryName } from '../constants/categories';
import type { JournalEntry } from '../types';

interface Props {
  entry: JournalEntry;
  onPress?: () => void;
}

export function JournalEntryCard({ entry, onPress }: Props) {
  const C = useColors();
  const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const isPrivate = entry.visibility !== 'community';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.SURFACE, borderColor: C.DIVIDER, shadowColor: C.SHADOW }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(entry.category)}</Text>
          <Text style={[styles.categoryName, { color: C.TEXT_SECONDARY }]}>
            {getCategoryName(entry.category)}
          </Text>
        </View>
        <Text style={[styles.date, { color: C.TEXT_MUTED }]}>{date}</Text>
      </View>
      {entry.journal_text ? (
        <Text style={[styles.preview, { color: C.TEXT }]} numberOfLines={2}>
          {entry.journal_text}
        </Text>
      ) : null}
      <View style={[styles.badge, { backgroundColor: isPrivate ? C.BADGE_PRIVATE : C.BADGE_COMMUNITY }]}>
        <Text style={[styles.badgeText, { color: isPrivate ? C.TEXT_MUTED : C.SUCCESS }]}>
          {isPrivate ? '🔒 Private' : '🌍 Community'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.card, padding: 20, marginBottom: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 18, elevation: 2,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryIcon: { fontSize: 16 },
  categoryName: { fontFamily: Fonts.BODY_DEMIBOLD, fontSize: 13 },
  date: { fontFamily: Fonts.BODY, fontSize: 12 },
  preview: { fontFamily: Fonts.BODY, fontSize: 14, lineHeight: 22, marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.badge, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontFamily: Fonts.BODY },
});
