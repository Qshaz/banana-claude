import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts, Radii } from '../constants/typography';

interface Props { question: string; index: number; total: number; }

export function ReflectionPrompt({ question, index, total }: Props) {
  const C = useColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.counter, { color: C.TEXT_MUTED }]}>Question {index + 1} of {total}</Text>
      <View style={[styles.card, { backgroundColor: C.SURFACE_ELEVATED, borderLeftColor: C.ACCENT }]}>
        <Text style={[styles.ornament, { color: C.ACCENT }]}>✦</Text>
        <Text style={[styles.question, { color: C.TEXT }]}>{question}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  counter: { fontFamily: Fonts.BODY, fontSize: 12, marginBottom: 8 },
  card: { borderRadius: 24, padding: 20, borderLeftWidth: 3 },
  ornament: { fontSize: 16, marginBottom: 10 },
  question: { fontFamily: Fonts.HEADING_MEDIUM, fontSize: 18, lineHeight: 28 },
});
