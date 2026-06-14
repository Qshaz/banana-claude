import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts } from '../constants/typography';

interface Props { tafsir: string | null; loading?: boolean; }

export function TafsirSection({ tafsir, loading }: Props) {
  const [expanded, setExpanded] = useState(false);
  const C = useColors();

  return (
    <View style={[styles.container, { backgroundColor: C.ACCENT_LIGHT, borderColor: C.ACCENT }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((e) => !e)}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: C.TEXT }]}>📚 Ibn Kathir Tafsir</Text>
        <Text style={[styles.toggle, { color: C.TEXT_MUTED }]}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.body, { borderTopColor: C.ACCENT }]}>
          {loading ? (
            <ActivityIndicator color={C.PRIMARY} />
          ) : tafsir ? (
            <Text style={[styles.text, { color: C.TEXT }]}>{tafsir}</Text>
          ) : (
            <Text style={[styles.empty, { color: C.TEXT_MUTED }]}>Tafsir not available for this verse.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: 'hidden', marginVertical: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  title: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 14 },
  toggle: { fontSize: 12 },
  body: { padding: 14, paddingTop: 0, borderTopWidth: 1 },
  text: { fontFamily: Fonts.BODY, fontSize: 14, lineHeight: 22 },
  empty: { fontFamily: Fonts.BODY, fontSize: 14, fontStyle: 'italic' },
});
