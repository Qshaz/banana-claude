import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.icon}>{getCategoryIcon(entry.category)}</Text>
        <View style={styles.meta}>
          <Text style={styles.ref}>{entry.surah_number}:{entry.ayah_number} · {getCategoryName(entry.category)}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {entry.visibility === 'community' && <Text style={styles.badge}>Community</Text>}
      </View>
      {entry.journal_text ? (
        <Text style={styles.preview} numberOfLines={2}>{entry.journal_text}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  icon: { fontSize: 22 },
  meta: { flex: 1 },
  ref: { fontSize: 14, fontWeight: '600', color: Colors.TEXT },
  date: { fontSize: 12, color: Colors.TEXT_MUTED, marginTop: 2 },
  badge: {
    fontSize: 10,
    color: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  preview: { fontSize: 13, color: Colors.TEXT_MUTED, lineHeight: 20 },
});
