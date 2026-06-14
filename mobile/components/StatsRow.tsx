import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
}

interface Props {
  stats: Stat[];
}

export function StatsRow({ stats }: Props) {
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View key={s.label} style={styles.card}>
          <Text style={styles.icon}>{s.icon}</Text>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  icon: { fontSize: 22, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '700', color: Colors.PRIMARY, marginBottom: 2 },
  label: { fontSize: 11, color: Colors.TEXT_MUTED, textAlign: 'center' },
});
