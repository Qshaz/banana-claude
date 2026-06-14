import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useJournal } from '../../hooks/useJournal';
import { Colors } from '../../constants/colors';
import { JournalEntryCard } from '../../components/JournalEntryCard';
import type { JournalEntry } from '../../types';

type Tab = 'private' | 'community';

export default function JournalScreen() {
  const { userId } = useAuth();
  const { entries, loading, fetchEntries } = useJournal(userId);
  const [tab, setTab] = useState<Tab>('private');
  const [selected, setSelected] = useState<JournalEntry | null>(null);

  useEffect(() => { fetchEntries(tab); }, [tab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Journal</Text>
        <View style={styles.tabs}>
          {(['private', 'community'] as Tab[]).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'private' ? '🔒 Private' : '🌍 Community'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => <JournalEntryCard entry={item} onPress={() => setSelected(item)} />}
          refreshing={loading}
          onRefresh={() => fetchEntries(tab)}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No entries yet.</Text>
              <Text style={styles.emptyHint}>Start a tadabur session to create your first reflection.</Text>
            </View>
          }
          contentContainerStyle={styles.list}
        />

        <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
          <SafeAreaView style={styles.modal}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
            {selected && (
              <ScrollView contentContainerStyle={styles.detail}>
                <Text style={styles.detailRef}>{selected.surah_number}:{selected.ayah_number} · {selected.category}</Text>
                {selected.verse_arabic && <Text style={styles.detailArabic}>{selected.verse_arabic}</Text>}
                {selected.verse_translation && <Text style={styles.detailTranslation}>{selected.verse_translation}</Text>}
                {selected.tafsir_excerpt && (
                  <View style={styles.tafsirBox}>
                    <Text style={styles.tafsirLabel}>From Ibn Kathir:</Text>
                    <Text style={styles.tafsirText}>{selected.tafsir_excerpt}</Text>
                  </View>
                )}
                {selected.journal_text && (
                  <>
                    <Text style={styles.journalLabel}>My reflection</Text>
                    <Text style={styles.journalText}>{selected.journal_text}</Text>
                  </>
                )}
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.TEXT, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 10, backgroundColor: Colors.SURFACE, alignItems: 'center', borderWidth: 1, borderColor: Colors.BORDER },
  tabActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  tabText: { fontSize: 13, color: Colors.TEXT_MUTED, fontWeight: '600' },
  tabTextActive: { color: Colors.SURFACE },
  list: { paddingBottom: 20 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: Colors.TEXT_MUTED, fontWeight: '600', marginBottom: 8 },
  emptyHint: { fontSize: 13, color: Colors.TEXT_MUTED, textAlign: 'center' },
  modal: { flex: 1, backgroundColor: Colors.BACKGROUND },
  closeBtn: { padding: 20, paddingBottom: 8 },
  closeBtnText: { fontSize: 15, color: Colors.TEXT_MUTED },
  detail: { padding: 20, paddingBottom: 40 },
  detailRef: { fontSize: 13, color: Colors.ACCENT, fontWeight: '600', marginBottom: 16 },
  detailArabic: { fontSize: 24, lineHeight: 40, textAlign: 'right', color: Colors.TEXT, marginBottom: 12 },
  detailTranslation: { fontSize: 15, lineHeight: 24, color: Colors.TEXT, fontStyle: 'italic', marginBottom: 20 },
  tafsirBox: { backgroundColor: Colors.ACCENT_LIGHT, borderRadius: 12, padding: 16, marginBottom: 20 },
  tafsirLabel: { fontSize: 12, color: Colors.ACCENT, fontWeight: '700', marginBottom: 8 },
  tafsirText: { fontSize: 14, lineHeight: 22, color: Colors.TEXT },
  journalLabel: { fontSize: 16, fontWeight: '700', color: Colors.TEXT, marginBottom: 10 },
  journalText: { fontSize: 15, lineHeight: 24, color: Colors.TEXT },
});
