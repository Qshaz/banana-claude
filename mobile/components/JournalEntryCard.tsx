import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts, Radii } from '../constants/typography';
import { getCategoryIcon, getCategoryName } from '../constants/categories';
import type { JournalEntry } from '../types';

interface Props {
  entry: JournalEntry;
  onPress?: () => void;
}

export function JournalEntryCard({ entry, onPress }: Props) {
  const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const isPrivate = entry.visibility !== 'community';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(entry.category)}</Text>
          <Text style={styles.categoryName}>{getCategoryName(entry.category)}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Journal text preview */}
      {entry.journal_text ? (
        <Text style={styles.preview} numberOfLines={2}>
          {entry.journal_text}
        </Text>
      ) : null}

      {/* Visibility badge */}
      <View style={[styles.badge, isPrivate ? styles.badgePrivate : styles.badgeCommunity]}>
        <Text style={[styles.badgeText, isPrivate ? styles.badgeTextPrivate : styles.badgeTextCommunity]}>
          {isPrivate ? '🔒 Private' : '🌍 Community'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: Radii.card,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
    shadowColor: Colors.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: { fontSize: 16 },
  categoryName: {
    fontFamily: Fonts.BODY_DEMIBOLD,
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
  },
  date: {
    fontFamily: Fonts.BODY,
    fontSize: 12,
    color: Colors.TEXT_MUTED,
  },
  preview: {
    fontFamily: Fonts.BODY,
    fontSize: 14,
    color: Colors.TEXT,
    lineHeight: 22,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.badge,
    alignSelf: 'flex-start',
  },
  badgePrivate: {
    backgroundColor: Colors.BADGE_PRIVATE,
  },
  badgeCommunity: {
    backgroundColor: Colors.BADGE_COMMUNITY,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.BODY,
  },
  badgeTextPrivate: {
    color: Colors.TEXT_MUTED,
  },
  badgeTextCommunity: {
    color: Colors.SUCCESS,
  },
});
