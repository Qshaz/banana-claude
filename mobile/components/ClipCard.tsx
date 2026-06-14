import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts } from '../constants/typography';
import { getSpeakerById } from '../constants/speakers';
import type { Clip } from '../constants/speakers';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props { clip: Clip; onPress: () => void; }

export function ClipCard({ clip, onPress }: Props) {
  const C = useColors();
  const speaker = getSpeakerById(clip.speakerId);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.SURFACE, borderColor: C.BORDER }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.playCircle, { backgroundColor: C.PRIMARY }]}>
        <Text style={[styles.playIcon, { color: C.SURFACE }]}>▶</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: C.TEXT }]} numberOfLines={2}>{clip.title}</Text>
        <Text style={[styles.speaker, { color: C.TEXT_MUTED }]}>{speaker?.name ?? clip.speakerId}</Text>
      </View>
      <View style={styles.right}>
        {clip.youtubeId ? (
          <Text style={[styles.duration, { color: C.TEXT_MUTED }]}>{formatDuration(clip.durationSeconds)}</Text>
        ) : (
          <View style={[styles.comingSoonBadge, { backgroundColor: C.ACCENT_LIGHT }]}>
            <Text style={[styles.comingSoonText, { color: C.ACCENT }]}>Coming soon</Text>
          </View>
        )}
        <Text style={[styles.chevron, { color: C.BORDER }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  playCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  playIcon: { fontSize: 14, marginLeft: 2 },
  info: { flex: 1 },
  title: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 14, marginBottom: 3 },
  speaker: { fontFamily: Fonts.BODY, fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 4 },
  duration: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 12 },
  comingSoonBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  comingSoonText: { fontSize: 10, fontFamily: Fonts.BODY_MEDIUM },
  chevron: { fontSize: 20, lineHeight: 22 },
});
