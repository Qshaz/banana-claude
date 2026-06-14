import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ScrollView,
  StyleSheet, SafeAreaView, Alert, Linking, Modal,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { CATEGORIES } from '../../constants/categories';
import { CLIPS, SPEAKERS, getClipsForCategory } from '../../constants/speakers';
import { ClipCard } from '../../components/ClipCard';
import type { Clip, Speaker } from '../../constants/speakers';

type SubTab = 'category' | 'speaker';

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.BACKGROUND },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 26, fontWeight: '700', color: C.TEXT },
    subTabRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 12,
      gap: 10,
    },
    subTabPill: {
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: C.BORDER,
      backgroundColor: C.SURFACE,
    },
    subTabPillActive: {
      borderColor: C.PRIMARY,
      backgroundColor: C.PRIMARY,
    },
    subTabText: { fontSize: 14, fontWeight: '600', color: C.TEXT_MUTED },
    subTabTextActive: { color: C.SURFACE },
    // Category grid
    grid: { paddingHorizontal: 16, paddingBottom: 40 },
    gridRow: { gap: 12, marginBottom: 12 },
    categoryCard: {
      flex: 1,
      backgroundColor: C.SURFACE,
      borderWidth: 1,
      borderColor: C.BORDER,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      minHeight: 100,
      justifyContent: 'center',
      gap: 6,
    },
    categoryCardIcon: { fontSize: 30 },
    categoryCardName: {
      fontSize: 13,
      fontWeight: '600',
      color: C.TEXT,
      textAlign: 'center',
    },
    countBadge: {
      backgroundColor: C.PRIMARY_ULTRA_LIGHT,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: 2,
    },
    countBadgeText: { fontSize: 11, fontWeight: '700', color: C.PRIMARY },
    // Speaker list
    speakerList: { paddingHorizontal: 20, paddingBottom: 40 },
    speakerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.SURFACE,
      borderWidth: 1,
      borderColor: C.BORDER,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
    },
    speakerAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: C.PRIMARY,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    speakerAvatarText: { fontSize: 16, fontWeight: '700', color: C.SURFACE },
    speakerInfo: { flex: 1, gap: 4 },
    speakerName: { fontSize: 15, fontWeight: '600', color: C.TEXT },
    langBadge: {
      alignSelf: 'flex-start',
      backgroundColor: C.ACCENT_LIGHT,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    langBadgeText: { fontSize: 10, fontWeight: '700', color: C.ACCENT },
    speakerArrow: { fontSize: 22, color: C.BORDER, lineHeight: 24 },
    // Modal
    modalSafe: { flex: 1, backgroundColor: C.BACKGROUND },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: C.BORDER,
      gap: 12,
    },
    backBtn: { paddingVertical: 4, paddingRight: 8 },
    backBtnText: { fontSize: 15, color: C.PRIMARY, fontWeight: '600' },
    modalTitle: { fontSize: 17, fontWeight: '700', color: C.TEXT, flex: 1 },
    modalList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    emptyText: {
      fontSize: 15,
      color: C.TEXT_MUTED,
      textAlign: 'center',
      marginTop: 40,
    },
    speakerSection: { marginBottom: 24 },
    speakerSectionHeader: {
      fontSize: 14,
      fontWeight: '700',
      color: C.TEXT_MUTED,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
  });
}

export default function ClipsScreen() {
  const [subTab, setSubTab] = useState<SubTab>('category');
  const [categoryModal, setCategoryModal] = useState<string | null>(null); // slug
  const [speakerModal, setSpeakerModal] = useState<string | null>(null);  // speaker id
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const handleClipPress = (clip: Clip) => {
    if (clip.youtubeId) {
      Linking.openURL(`https://youtube.com/watch?v=${clip.youtubeId}`);
    } else {
      Alert.alert('Coming soon', 'Check back after the weekly update, in sha Allah.');
    }
  };

  // ── CATEGORY MODAL ──
  const activeCategorySlug = categoryModal;
  const categoryClips = activeCategorySlug ? getClipsForCategory(activeCategorySlug) : [];
  const categoryObj = activeCategorySlug
    ? CATEGORIES.find((c) => c.slug === activeCategorySlug)
    : null;

  // ── SPEAKER MODAL ──
  const activeSpeaker: Speaker | undefined = speakerModal
    ? SPEAKERS.find((s) => s.id === speakerModal)
    : undefined;
  const speakerClips = speakerModal
    ? CLIPS.filter((c) => c.speakerId === speakerModal)
    : [];
  // Group speaker clips by category
  const speakerCategories = speakerModal
    ? Array.from(new Set(speakerClips.flatMap((c) => c.categories)))
    : [];

  // ── BY CATEGORY SUB-TAB ──
  const renderByCategory = () => (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(c) => c.slug}
      numColumns={2}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.gridRow}
      renderItem={({ item }) => {
        const count = getClipsForCategory(item.slug).length;
        return (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => setCategoryModal(item.slug)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryCardIcon}>{item.icon}</Text>
            <Text style={styles.categoryCardName} numberOfLines={2}>
              {item.name}
            </Text>
            {count > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );

  // ── BY SPEAKER SUB-TAB ──
  const renderBySpeaker = () => (
    <FlatList
      data={SPEAKERS}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.speakerList}
      renderItem={({ item }) => {
        const initial = item.shortName.charAt(0).toUpperCase();
        const lang = item.language?.toUpperCase() ?? 'EN';
        return (
          <TouchableOpacity
            style={styles.speakerRow}
            onPress={() => setSpeakerModal(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.speakerAvatar}>
              <Text style={styles.speakerAvatarText}>{initial}</Text>
            </View>
            <View style={styles.speakerInfo}>
              <Text style={styles.speakerName}>{item.name}</Text>
              <View style={styles.langBadge}>
                <Text style={styles.langBadgeText}>{lang}</Text>
              </View>
            </View>
            <Text style={styles.speakerArrow}>›</Text>
          </TouchableOpacity>
        );
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inspiration</Text>
      </View>

      {/* Sub-tab pills */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTabPill, subTab === 'category' && styles.subTabPillActive]}
          onPress={() => setSubTab('category')}
          activeOpacity={0.7}
        >
          <Text style={[styles.subTabText, subTab === 'category' && styles.subTabTextActive]}>
            By Category
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTabPill, subTab === 'speaker' && styles.subTabPillActive]}
          onPress={() => setSubTab('speaker')}
          activeOpacity={0.7}
        >
          <Text style={[styles.subTabText, subTab === 'speaker' && styles.subTabTextActive]}>
            By Speaker
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {subTab === 'category' ? renderByCategory() : renderBySpeaker()}

      {/* Category Modal */}
      <Modal
        visible={categoryModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCategoryModal(null)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCategoryModal(null)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {categoryObj ? `${categoryObj.icon}  ${categoryObj.name}` : ''}
            </Text>
          </View>
          <FlatList
            data={categoryClips}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <ClipCard clip={item} onPress={() => handleClipPress(item)} />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Clips coming soon, in sha Allah</Text>
            }
          />
        </SafeAreaView>
      </Modal>

      {/* Speaker Modal */}
      <Modal
        visible={speakerModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSpeakerModal(null)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSpeakerModal(null)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{activeSpeaker?.name ?? ''}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalList}>
            {speakerCategories.length === 0 ? (
              <Text style={styles.emptyText}>Clips coming soon, in sha Allah</Text>
            ) : (
              speakerCategories.map((slug) => {
                const catClips = speakerClips.filter((c) => c.categories.includes(slug));
                const catObj = CATEGORIES.find((c) => c.slug === slug);
                return (
                  <View key={slug} style={styles.speakerSection}>
                    <Text style={styles.speakerSectionHeader}>
                      {catObj ? `${catObj.icon}  ${catObj.name}` : slug}
                    </Text>
                    {catClips.map((clip) => (
                      <ClipCard
                        key={clip.id}
                        clip={clip}
                        onPress={() => handleClipPress(clip)}
                      />
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
