import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useCustomCategories } from '../stores/customCategories';
import type { Category } from '../constants/categories';

const EMOJIS = ['🌿','🌅','🌊','⚡','🤲','❤️','🌸','🌾','🌱','🕊️','💔','🌙','🤍','🌼','🌹','✨','🔥','🌺','🌻','🏔️','🦋','☀️','🌈','⭐'];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ visible, onClose }: Props) {
  const { addCategory } = useCustomCategories();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    setSelectedEmoji('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const cat: Category = {
      slug: `custom-${Date.now()}`,
      name: name.trim(),
      arabicName: '',
      icon: selectedEmoji || '📖',
      description: description.trim(),
      color: '#1C5D52',
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
          <TouchableOpacity
            onPress={handleSave}
            style={styles.headerBtn}
            disabled={!name.trim()}
          >
            <Text style={[styles.saveText, !name.trim() && styles.saveTextDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. My marriage, Work problems"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            autoFocus
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What is this category about?"
            placeholderTextColor={Colors.TEXT_MUTED}
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
          <Text style={styles.emojiHint}>
            Selected: {selectedEmoji || '📖'} (default if none chosen)
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    backgroundColor: Colors.SURFACE,
  },
  headerBtn: { minWidth: 60 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.TEXT },
  cancelText: { fontSize: 16, color: Colors.TEXT_MUTED },
  saveText: { fontSize: 16, color: Colors.PRIMARY, fontWeight: '700', textAlign: 'right' },
  saveTextDisabled: { color: Colors.BORDER },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_MUTED, marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.TEXT,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SURFACE,
  },
  emojiBtnSelected: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_ULTRA_LIGHT,
  },
  emojiText: { fontSize: 24 },
  emojiHint: { fontSize: 13, color: Colors.TEXT_MUTED, marginTop: 12 },
});
