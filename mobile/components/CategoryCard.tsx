import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts, Radii } from '../constants/typography';
import type { Category } from '../constants/categories';

interface Props {
  category: Category;
  onPress: () => void;
  onLongPress?: () => void;
  compact?: boolean;
}

export function CategoryCard({ category, onPress, onLongPress, compact }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compact]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={styles.name}>{category.name}</Text>
      {!compact && <Text style={styles.arabic}>{category.arabicName}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
    padding: 24,
    minHeight: 180,
    shadowColor: Colors.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  compact: {
    padding: 16,
    minHeight: 0,
  },
  icon: { fontSize: 40, marginBottom: 12 },
  name: {
    fontFamily: Fonts.HEADING_MEDIUM,
    fontSize: 16,
    color: Colors.TEXT,
  },
  arabic: {
    fontFamily: Fonts.ARABIC,
    fontSize: 13,
    color: Colors.TEXT_MUTED,
    textAlign: 'right',
    marginTop: 4,
  },
});
