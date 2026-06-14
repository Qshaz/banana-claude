import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts, Radii } from '../constants/typography';

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
  counter: {
    fontFamily: Fonts.BODY,
    fontSize: 12,
    color: Colors.TEXT_MUTED,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.SURFACE_ELEVATED,
    borderRadius: 24,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.ACCENT,
  },
  ornament: {
    fontSize: 16,
    color: Colors.ACCENT,
    marginBottom: 10,
  },
  question: {
    fontFamily: Fonts.HEADING_MEDIUM,
    fontSize: 18,
    lineHeight: 28,
    color: Colors.TEXT,
  },
});
