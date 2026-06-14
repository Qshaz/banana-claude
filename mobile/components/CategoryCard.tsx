import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts, Radii } from '../constants/typography';
import type { Category } from '../constants/categories';

interface Props {
  category: Category;
  onPress: () => void;
  onLongPress?: () => void;
  compact?: boolean;
}

export function CategoryCard({ category, onPress, onLongPress, compact }: Props) {
  const C = useColors();

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: C.SURFACE, borderColor: C.DIVIDER }]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <Text style={styles.compactIcon}>{category.icon}</Text>
        <Text style={[styles.compactName, { color: C.TEXT }]}>{category.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: C.SURFACE,
          borderColor: C.DIVIDER,
          borderLeftColor: category.color,
          shadowColor: C.SHADOW,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Top row: icon left, Arabic name right */}
      <View style={styles.topRow}>
        <Text style={styles.icon}>{category.icon}</Text>
        <Text style={[styles.arabicName, { color: category.color }]}>{category.arabicName}</Text>
      </View>

      {/* English name */}
      <Text style={[styles.name, { color: C.TEXT }]}>{category.name}</Text>

      {/* Description */}
      <Text style={[styles.description, { color: C.TEXT_MUTED }]} numberOfLines={2}>
        {category.description}
      </Text>

      {/* Reflect hint */}
      <Text style={[styles.tapHint, { color: category.color }]}>Reflect →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.card,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 20,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  icon: { fontSize: 36 },
  arabicName: {
    fontFamily: Fonts.ARABIC,
    fontSize: 22,
    lineHeight: 34,
  },
  name: {
    fontFamily: Fonts.HEADING_SEMIBOLD,
    fontSize: 20,
    marginBottom: 6,
  },
  description: {
    fontFamily: Fonts.BODY,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  tapHint: {
    fontFamily: Fonts.BODY_MEDIUM,
    fontSize: 13,
    textAlign: 'right',
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  compactIcon: { fontSize: 22 },
  compactName: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 14 },
});
