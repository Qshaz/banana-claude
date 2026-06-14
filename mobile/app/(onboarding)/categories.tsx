import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';
import { Fonts, Radii } from '../../constants/typography';
import { CATEGORIES } from '../../constants/categories';

function OnboardingProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
      {[1, 2, 3, 4].map((s, i) => (
        <React.Fragment key={s}>
          <View style={{
            width: 10, height: 10, borderRadius: 5,
            backgroundColor: s <= step ? Colors.PRIMARY : Colors.BORDER,
          }} />
          {i < 3 && (
            <View style={{
              width: 28, height: 1.5,
              backgroundColor: s < step ? Colors.PRIMARY : Colors.BORDER,
            }} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default function CategoriesScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggle = (slug: string) =>
    setSelected((s) => s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]);

  const next = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ categories_of_interest: selected }).eq('id', user.id);
    router.push('/(onboarding)/notifications');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <OnboardingProgress step={3} />
        <Text style={styles.title}>Which resonate with you?</Text>
        <Text style={styles.sub}>We'll suggest relevant verses based on your selection</Text>
      </View>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c.slug}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const on = selected.includes(item.slug);
          return (
            <TouchableOpacity
              style={[styles.chip, on && { backgroundColor: item.color, borderColor: item.color }]}
              onPress={() => toggle(item.slug)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{item.icon}</Text>
              <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity style={styles.btn} onPress={next}>
            <Text style={styles.btnText}>{selected.length > 0 ? `Continue (${selected.length} selected) →` : 'Skip →'}</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: { padding: 28, paddingBottom: 8 },
  title: { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 26, color: Colors.TEXT, marginBottom: 6 },
  sub: { fontFamily: Fonts.BODY, fontSize: 14, color: Colors.TEXT_MUTED },
  grid: { paddingHorizontal: 16, paddingBottom: 40 },
  row: { gap: 10, marginBottom: 10 },
  chip: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    gap: 6,
  },
  chipIcon: { fontSize: 24 },
  chipLabel: { fontFamily: Fonts.BODY, fontSize: 12, color: Colors.TEXT, textAlign: 'center' },
  chipLabelOn: { fontFamily: Fonts.BODY_MEDIUM, color: Colors.SURFACE },
  btn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radii.button,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  btnText: { fontFamily: Fonts.BODY_MEDIUM, color: '#FFFFFF', fontSize: 16 },
});
