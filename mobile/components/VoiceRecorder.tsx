import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/colors';
import { transcribeAudio } from '../lib/whisper';

interface Props {
  onTranscribed: (text: string) => void;
}

export function VoiceRecorder({ onTranscribed }: Props) {
  const [state, setState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const recordingRef = useRef<Audio.Recording | null>(null);

  const start = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    recordingRef.current = recording;
    setState('recording');
  };

  const stop = async () => {
    if (!recordingRef.current) return;
    setState('processing');
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;
    if (uri) {
      try {
        const text = await transcribeAudio(uri);
        onTranscribed(text);
      } catch {
        onTranscribed('[Transcription failed — please type your thoughts]');
      }
    }
    setState('idle');
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, state === 'recording' && styles.recording]}
        onPress={state === 'idle' ? start : stop}
        disabled={state === 'processing'}
        activeOpacity={0.7}
      >
        {state === 'processing' ? (
          <ActivityIndicator size="small" color={Colors.SURFACE} />
        ) : (
          <Text style={styles.icon}>{state === 'recording' ? '⏹' : '🎙'}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.hint}>
        {state === 'idle' && 'Tap to record your thoughts'}
        {state === 'recording' && 'Recording… tap to stop'}
        {state === 'processing' && 'Transcribing…'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: { backgroundColor: Colors.ERROR },
  icon: { fontSize: 22 },
  hint: { fontSize: 13, color: Colors.TEXT_MUTED },
});
