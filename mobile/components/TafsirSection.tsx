import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  tafsir: string | null;
  loading?: boolean;
}

export function TafsirSection({ tafsir, loading }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded((e) => !e)} activeOpacity={0.7}>
        <Text style={styles.title}>📚 Ibn Kathir Tafsir</Text>
        <Text style={styles.toggle}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator color={Colors.PRIMARY} />
          ) : tafsir ? (
            <Text style={styles.text}>{tafsir}</Text>
          ) : (
            <Text style={styles.empty}>Tafsir not available for this verse.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ACCENT_LIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.ACCENT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  title: { fontSize: 14, fontWeight: '600', color: Colors.TEXT },
  toggle: { fontSize: 12, color: Colors.TEXT_MUTED },
  body: { padding: 14, paddingTop: 0, borderTopWidth: 1, borderTopColor: Colors.ACCENT },
  text: { fontSize: 14, lineHeight: 22, color: Colors.TEXT },
  empty: { fontSize: 14, color: Colors.TEXT_MUTED, fontStyle: 'italic' },
});
