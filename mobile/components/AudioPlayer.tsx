import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useColors } from '../hooks/useColors';
import { Fonts } from '../constants/typography';
import { getAudioUrl } from '../lib/quran-api';

interface Props { surah: number; ayah: number; reciter?: string; }

export function AudioPlayer({ surah, ayah, reciter = 'afasy' }: Props) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const C = useColors();

  const toggle = async () => {
    if (playing && soundRef.current) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
      return;
    }
    setLoading(true);
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
      } else {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: getAudioUrl(surah, ayah, reciter) },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((s) => {
          if (s.isLoaded && s.didJustFinish) setPlaying(false);
        });
      }
      setPlaying(true);
    } catch {
      // Audio unavailable — fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: C.PRIMARY }]}
      onPress={toggle}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={C.SURFACE} />
      ) : (
        <Text style={[styles.icon, { color: C.SURFACE }]}>{playing ? '⏸' : '▶'}</Text>
      )}
      <Text style={[styles.label, { color: C.SURFACE }]}>
        {playing ? 'Pause recitation' : 'Listen to recitation'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, alignSelf: 'flex-start', gap: 8 },
  icon: { fontSize: 16 },
  label: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 14 },
});
