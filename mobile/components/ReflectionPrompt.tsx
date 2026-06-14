import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  question: string;
  index: number;
  total: number;
}

export function ReflectionPrompt({ question, index, total }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Question {index + 1} of {total}</Text>
      <View style={styles.card}>
        <Text style={styles.ornament}>✦</Text>
        <Text style={styles.question}>{question}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  counter: { fontSize: 12, color: Colors.TEXT_MUTED, marginBottom: 8 },
  card: {
    backgroundColor: Colors.PRIMARY_ULTRA_LIGHT,
    borderRadius: 14,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.PRIMARY,
  },
  ornament: { fontSize: 16, color: Colors.ACCENT, marginBottom: 10 },
  question: { fontSize: 17, lineHeight: 26, color: Colors.TEXT, fontStyle: 'italic' },
});
