import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { useColors } from '../hooks/useColors';
import { Fonts } from '../constants/typography';
import { useCustomCategories } from '../stores/customCategories';
import type { Category } from '../constants/categories';

const EMOJIS = ['🌿','🌅','🌊','⚡','❤️','🌸','🌾','🌱','💔','🌙','🤍','🌼','🌹','✨','🔥','🌺','🌻','🏔️','🦋','☀️','🌈','⭐','🍂','🌑'];

interface Props {
  visible: boolean;
  onClose: () => void;
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.BACKGROUND },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
      borderBottomColor: C.BORDER, backgroundColor: C.SURFACE,
    },
    headerBtn: { minWidth: 60 },
    headerTitle: { fontFamily: Fonts.BODY_MEDIUM, fontSize: 16, color: C.TEXT },
    cancelText: { fontFamily: Fonts.BODY, fontSize: 16, color: C.TEXT_MUTED },
    saveText: { fontFamily: Fonts.BODY_DEMIBOLD, fontSize: 16, color: C.PRIMARY, textAlign: 'right' },
    saveTextDisabled: { color: C.BORDER },
    content: { padding: 20, paddingBottom: 40 },
    label: {
      fontFamily: Fonts.BODY_MEDIUM, fontSize: 13, color: C.TEXT_MUTED,
      marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    input: {
      backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER,
      borderRadius: 12, padding: 14, fontFamily: Fonts.BODY, fontSize: 16, color: C.TEXT,
    },
    emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    emojiBtn: {
      width: 48, height: 48, borderRadius: 10, borderWidth: 1.5,
      borderColor: C.BORDER, alignItems: 'center', justifyContent: 'center', backgroundColor: C.SURFACE,
    },
    emojiBtnSelected: { borderColor: C.PRIMARY, backgroundColor: C.PRIMARY_ULTRA_LIGHT },
    emojiText: { fontSize: 24 },
    emojiHint: { fontFamily: Fonts.BODY, fontSize: 13, color: C.TEXT_MUTED, marginTop: 12 },
  });
}

export function CreateCategoryModal({ visible, onClose }: Props) {
  const { addCategory } = useCustomCategories();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const C = useColors();
  const styles = React.useMemo(() => makeStyles(C), [C]);

  const reset = () => { setName(''); setDescription(''); setSelectedEmoji(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleSave = () => {
    if (!name.trim()) return;
    const cat: Category = {
      slug: `custom-${Date.now()}`,
      name: name.trim(),
      arabicName: '',
      icon: selectedEmoji || '📖',
      description: description.trim(),
      color: '#6C7354',
      searchKeywords: name.trim().toLowerCase().split(/\s+/),
      reflectionPrompts: [
        'What brought you to reflect on this today?',
        'How does this connect to your relationship with Allah?',
        'What would you like to take away from this reflection?',
      ],
    };
    addCategory(cat);
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create your category</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerBtn} disabled={!name.trim()}>
            <Text style={[styles.saveText, !name.trim() && styles.saveTextDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. My marriage, Work struggles"
            placeholderTextColor={C.TEXT_MUTED}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            autoFocus
          />
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What is this category about?"
            placeholderTextColor={C.TEXT_MUTED}
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
          />
          <Text style={styles.label}>Icon</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiBtn, selectedEmoji === emoji && styles.emojiBtnSelected]}
                onPress={() => setSelectedEmoji(emoji === selectedEmoji ? '' : emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.emojiHint}>Selected: {selectedEmoji || '📖'} (default if none chosen)</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
