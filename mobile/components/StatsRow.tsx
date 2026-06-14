import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';

interface Stat { label: string; value: string | number; icon: string; }
interface Props { stats: Stat[]; }

export function StatsRow({ stats }: Props) {
  const C = useColors();
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View key={s.label} style={[styles.card, { backgroundColor: C.SURFACE, borderColor: C.BORDER }]}>
          <Text style={styles.icon}>{s.icon}</Text>
          <Text style={[styles.value, { color: C.PRIMARY }]}>{s.value}</Text>
          <Text style={[styles.label, { color: C.TEXT_MUTED }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1 },
  icon: { fontSize: 22, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  label: { fontSize: 11, textAlign: 'center' },
});
