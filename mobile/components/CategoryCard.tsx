import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import type { Category } from '../constants/categories';

interface Props {
  category: Category;
  onPress: () => void;
  compact?: boolean;
}

export function CategoryCard({ category, onPress, compact }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compact, { borderLeftColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <View style={styles.text}>
        <Text style={styles.name}>{category.name}</Text>
        {!compact && <Text style={styles.arabic}>{category.arabicName}</Text>}
        {!compact && <Text style={styles.desc} numberOfLines={1}>{category.description}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Colors.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  compact: {
    padding: 10,
    marginBottom: 6,
  },
  icon: { fontSize: 28, marginRight: 12 },
  text: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.TEXT },
  arabic: { fontSize: 13, color: Colors.TEXT_MUTED, fontStyle: 'italic', marginTop: 1 },
  desc: { fontSize: 12, color: Colors.TEXT_MUTED, marginTop: 2 },
});
