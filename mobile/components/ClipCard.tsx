import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { getSpeakerById } from '../constants/speakers';
import type { Clip } from '../constants/speakers';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  clip: Clip;
  onPress: () => void;
}

export function ClipCard({ clip, onPress }: Props) {
  const speaker = getSpeakerById(clip.speakerId);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.playCircle}>
        <Text style={styles.playIcon}>▶</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{clip.title}</Text>
        <Text style={styles.speaker}>{speaker?.name ?? clip.speakerId}</Text>
      </View>
      <View style={styles.right}>
        {clip.youtubeId ? (
          <Text style={styles.duration}>{formatDuration(clip.durationSeconds)}</Text>
        ) : (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming soon</Text>
          </View>
        )}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIcon: { color: Colors.SURFACE, fontSize: 14, marginLeft: 2 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 3 },
  speaker: { fontSize: 12, color: Colors.TEXT_MUTED },
  right: { alignItems: 'flex-end', gap: 4 },
  duration: { fontSize: 12, color: Colors.TEXT_MUTED, fontWeight: '500' },
  comingSoonBadge: {
    backgroundColor: Colors.ACCENT_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: { fontSize: 10, color: Colors.ACCENT, fontWeight: '600' },
  chevron: { fontSize: 20, color: Colors.BORDER, lineHeight: 22 },
});
