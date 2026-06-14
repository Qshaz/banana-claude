import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  View, Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/typography';
import { transcribeAudio } from '../lib/whisper';

interface Props {
  onTranscribed: (text: string) => void;
}

export function VoiceRecorder({ onTranscribed }: Props) {
  const [state, setState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (state === 'recording') {
      pulseAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulseAnim.current.start();
    } else {
      pulseAnim.current?.stop();
      pulse.setValue(1);
    }
    return () => pulseAnim.current?.stop();
  }, [state]);

  const start = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
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
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <TouchableOpacity
          style={[styles.btn, state === 'recording' && styles.btnRecording]}
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
      </Animated.View>
      <View style={styles.hintWrap}>
        <Text style={styles.hint}>
          {state === 'idle' && 'Tap to dictate — transcribes in any language'}
          {state === 'recording' && 'Recording… tap to stop'}
          {state === 'processing' && 'Transcribing your voice…'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 10 },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRecording: { backgroundColor: Colors.ERROR },
  icon: { fontSize: 20 },
  hintWrap: { flex: 1 },
  hint: { fontFamily: Fonts.BODY, fontSize: 13, color: Colors.TEXT_MUTED, lineHeight: 18 },
});
