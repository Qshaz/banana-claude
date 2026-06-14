import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ScrollView,
  StyleSheet, SafeAreaView, Alert, Linking,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { CLIPS, SPEAKERS, getSpeakerById } from '../../constants/speakers';
import { ClipCard } from '../../components/ClipCard';

export default function ClipsScreen() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = Array.from(new Set(CLIPS.flatMap((c) => c.categories)));

  const filteredClips = CLIPS.filter((clip) => {
    const speakerMatch = !selectedSpeaker || clip.speakerId === selectedSpeaker;
    const categoryMatch = !selectedCategory || clip.categories.includes(selectedCategory);
    return speakerMatch && categoryMatch;
  });

  const handlePress = (youtubeId: string) => {
    if (youtubeId) {
      Linking.openURL(`https://youtube.com/watch?v=${youtubeId}`);
    } else {
      Alert.alert('Coming soon', 'Check back after the weekly update, in sha Allah.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredClips}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Clips by topic</Text>
              <Text style={styles.sub}>Talks from scholars to uplift your heart</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <TouchableOpacity
                style={[styles.chip, !selectedSpeaker && styles.chipActive]}
                onPress={() => setSelectedSpeaker(null)}
              >
                <Text style={[styles.chipText, !selectedSpeaker && styles.chipTextActive]}>All</Text>
              </TouchableOpacity>
              {SPEAKERS.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, selectedSpeaker === s.id && styles.chipActive]}
                  onPress={() => setSelectedSpeaker(selectedSpeaker === s.id ? null : s.id)}
                >
                  <Text style={[styles.chipText, selectedSpeaker === s.id && styles.chipTextActive]}>
                    {s.shortName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {allCategories.map((slug) => (
                <TouchableOpacity
                  key={slug}
                  style={[styles.chip, selectedCategory === slug && styles.chipActive]}
                  onPress={() => setSelectedCategory(selectedCategory === slug ? null : slug)}
                >
                  <Text style={[styles.chipText, selectedCategory === slug && styles.chipTextActive]}>
                    {slug}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ClipCard clip={item} onPress={() => handlePress(item.youtubeId)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>More clips coming soon, in sha Allah</Text>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  list: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.TEXT, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.TEXT_MUTED },
  chips: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.SURFACE,
  },
  chipActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_ULTRA_LIGHT },
  chipText: { fontSize: 13, color: Colors.TEXT_MUTED, fontWeight: '500' },
  chipTextActive: { color: Colors.PRIMARY, fontWeight: '700' },
  item: { paddingHorizontal: 20 },
  empty: { fontSize: 15, color: Colors.TEXT_MUTED, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 },
});
