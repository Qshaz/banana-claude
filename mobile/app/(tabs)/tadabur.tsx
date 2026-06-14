import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import { CategoryCard } from '../../components/CategoryCard';
import { CreateCategoryModal } from '../../components/CreateCategoryModal';
import { useSessionStore } from '../../stores/session';
import { useCustomCategories } from '../../stores/customCategories';

export default function TadaburScreen() {
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { setCategory, reset } = useSessionStore();
  const { customCategories, removeCategory } = useCustomCategories();

  const allCategories = [...CATEGORIES, ...customCategories];

  const filtered = query.trim()
    ? allCategories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : allCategories;

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

  const handleLongPress = (slug: string, isCustom: boolean) => {
    if (!isCustom) return;
    Alert.alert('Delete category', 'Remove this custom category?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeCategory(slug) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.slug}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Begin Tadabur</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
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
        renderItem={({ item }) => {
          const isCustom = item.slug.startsWith('custom-');
          return (
            <View style={styles.item}>
              <CategoryCard
                category={item}
                onPress={() => startSession(item.slug)}
                onLongPress={isCustom ? () => handleLongPress(item.slug, isCustom) : undefined}
              />
            </View>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity style={styles.createLink} onPress={() => setShowModal(true)}>
            <Text style={styles.createLinkText}>Create your own →</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.list}
      />
      <CreateCategoryModal visible={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  list: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.TEXT },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: Colors.SURFACE, fontSize: 22, fontWeight: '400', lineHeight: 26 },
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
  createLink: { alignItems: 'center', paddingVertical: 20 },
  createLinkText: { fontSize: 14, color: Colors.TEXT_MUTED, textDecorationLine: 'underline' },
});
