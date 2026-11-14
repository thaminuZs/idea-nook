import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import GuideDetailView from '../components/GuideDetailView';
import { useTheme } from '../contexts/ThemeContext';
import {
  getCategories,
  getGuides,
  getStarterGuideRichContent,
  seedInitialGuides,
} from '../db';

export default function ExploreScreen() {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();

  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = scheme === 'dark';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderCol = isDark ? '#2D2D2D' : '#E2E8F0';
  const mutedText = isDark ? '#94A3B8' : '#64748B';
  const pillBg = isDark ? '#262626' : '#F1F5F9';

  const loadLibrary = useCallback(async () => {
    try {
      await seedInitialGuides(db);
      const [allGuides, allCats] = await Promise.all([
        getGuides(db),
        getCategories(db),
      ]);
      setGuides(allGuides);
      setCategories(allCats);
    } catch (err) {
      console.error('Failed to load explore library:', err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadLibrary();
    }, [loadLibrary])
  );

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchesCat =
        selectedCategory === 'All' || g.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [guides, selectedCategory, searchQuery]);

  if (selectedGuide) {
    return (
      <GuideDetailView
        guideId={selectedGuide.id}
        initialGuide={selectedGuide}
        onBack={() => {
          setSelectedGuide(null);
          loadLibrary();
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>
              Explore All DIY Projects 🔍
            </Text>
            <Text style={[styles.pageSubtitle, { color: mutedText }]}>
              Search by keyword or filter by craft category to browse inside any project
            </Text>

            {/* Search Input */}
            <View
              style={[
                styles.searchBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              <Text style={styles.searchIcon}>🔎</Text>
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search rockets, volcano, bracelets, cars..."
                placeholderTextColor={mutedText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Text style={[styles.clearText, { color: mutedText }]}>✕</Text>
                </Pressable>
              )}
            </View>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              <Pressable
                style={[
                  styles.catPill,
                  {
                    backgroundColor:
                      selectedCategory === 'All' ? '#FF7043' : pillBg,
                    borderColor:
                      selectedCategory === 'All' ? '#FF7043' : borderCol,
                  },
                ]}
                onPress={() => setSelectedCategory('All')}
              >
                <Text
                  style={[
                    styles.catPillText,
                    {
                      color:
                        selectedCategory === 'All' ? '#FFFFFF' : theme.text,
                    },
                  ]}
                >
                  All ({guides.length})
                </Text>
              </Pressable>

              {categories.map((c) => {
                const isSelected = selectedCategory === c.category;
                return (
                  <Pressable
                    key={c.category}
                    style={[
                      styles.catPill,
                      {
                        backgroundColor: isSelected ? '#FF7043' : pillBg,
                        borderColor: isSelected ? '#FF7043' : borderCol,
                      },
                    ]}
                    onPress={() => setSelectedCategory(c.category)}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {c.category} ({c.count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => {
          const richInfo = getStarterGuideRichContent(item.slug);
          const totalMaterialsCount =
            item.totalMaterials || richInfo?.materials?.length || 5;
          const totalStepsCount =
            item.totalSteps || richInfo?.steps?.length || 5;

          return (
            <Pressable
              onPress={() => setSelectedGuide(item)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cardBg, borderColor: borderCol },
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.cardRow}>
                <View
                  style={[styles.iconBox, { backgroundColor: item.accentColor }]}
                >
                  <Text style={styles.iconEmoji}>{item.iconEmoji}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.cardSummary, { color: mutedText }]}
                    numberOfLines={2}
                  >
                    {item.summary}
                  </Text>
                  <Text style={[styles.cardMeta, { color: mutedText }]}>
                    🎒 {totalMaterialsCount} Supplies • 🛠️ {totalStepsCount}{' '}
                    Steps • ⏱️ {item.estimatedMinutes} min
                  </Text>
                </View>
              </View>

              <View style={styles.openBtnBar}>
                <Text style={styles.openBtnText}>
                  📖 View Full Guide & Steps →
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  header: {
    gap: 10,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 13,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardMeta: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  openBtnBar: {
    backgroundColor: '#FFF0EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  openBtnText: {
    color: '#D84315',
    fontSize: 12,
    fontWeight: '800',
  },
});
