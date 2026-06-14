import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import { CategoryCard } from '../../components/CategoryCard';
import { useSessionStore } from '../../stores/session';

export default function TadaburScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setCategory, reset } = useSessionStore();

  const startSession = (slug: string) => {
    reset();
    setCategory(slug);
    router.push('/session');
  };

  const startWithQuery = () => {
    if (!query.trim()) return;
    reset();
    setCategory(query.trim());
    router.push('/session');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c.slug}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Begin Tadabur</Text>
            <Text style={styles.sub}>Choose a theme or describe what you're going through</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g. I'm feeling anxious about the future…"
                placeholderTextColor={Colors.TEXT_MUTED}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={startWithQuery}
              />
              {query.length > 0 && (
                <TouchableOpacity style={styles.searchBtn} onPress={startWithQuery}>
                  <Text style={styles.searchBtnText}>→</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.orLabel}>— or pick a theme —</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <CategoryCard category={item} onPress={() => startSession(item.slug)} />
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  list: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.TEXT, marginBottom: 6 },
  sub: { fontSize: 14, color: Colors.TEXT_MUTED, marginBottom: 16 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.TEXT,
  },
  searchBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  searchBtnText: { color: Colors.SURFACE, fontSize: 20, fontWeight: '600' },
  orLabel: { fontSize: 13, color: Colors.TEXT_MUTED, textAlign: 'center', marginBottom: 10 },
  item: { paddingHorizontal: 20 },
});
