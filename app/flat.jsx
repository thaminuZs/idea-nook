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

const AUDIENCE_TABS = [
  { id: 'all', label: '🌈 All Projects' },
  { id: 'boy', label: '👦 Boys' },
  { id: 'girl', label: '👧 Girls' },
  { id: 'favorites', label: '❤️ Favorites' },
];

export default function ExploreScreen() {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();

  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('all');
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
      // Audience filter
      if (selectedAudience === 'boy' && g.genderTarget !== 'boy' && g.genderTarget !== 'all') {
        return false;
      }
      if (selectedAudience === 'girl' && g.genderTarget !== 'girl' && g.genderTarget !== 'all') {
        return false;
      }
      if (selectedAudience === 'favorites' && !g.isFavorite) {
        return false;
      }

      // Category filter
      const matchesCat =
        selectedCategory === 'All' || g.category === selectedCategory;

      // Search filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [guides, selectedAudience, selectedCategory, searchQuery]);

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
            <View style={styles.titleRow}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>
                Explore All DIY Projects 🌈
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {filteredGuides.length} of {guides.length}
                </Text>
              </View>
            </View>
            <Text style={[styles.pageSubtitle, { color: mutedText }]}>
              Browse our complete library of offline projects across all ages, categories, and interests
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

            {/* Audience Filter Row (All, Boys, Girls, Favorites) */}
            <View style={styles.audienceRow}>
              {AUDIENCE_TABS.map((tab) => {
                const isSelected = selectedAudience === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setSelectedAudience(tab.id)}
                    style={[
                      styles.audiencePill,
                      {
                        backgroundColor: isSelected ? '#FF7043' : pillBg,
                        borderColor: isSelected ? '#FF7043' : borderCol,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.audiencePillText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.text,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
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
                      selectedCategory === 'All' ? '#0F172A' : pillBg,
                    borderColor:
                      selectedCategory === 'All' ? '#0F172A' : borderCol,
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
                  All Categories ({guides.length})
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
                        backgroundColor: isSelected ? '#0F172A' : pillBg,
                        borderColor: isSelected ? '#0F172A' : borderCol,
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
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No matching projects found
            </Text>
            <Text style={[styles.emptySub, { color: mutedText }]}>
              Try clearing your search or switching category filters.
            </Text>
            <Pressable
              style={styles.resetFilterBtn}
              onPress={() => {
                setSelectedAudience('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetFilterBtnText}>Show All Projects</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in_progress';
          const richInfo = getStarterGuideRichContent(item.slug);
          const totalMaterialsCount =
            item.totalMaterials || richInfo?.materials?.length || 5;
          const totalStepsCount =
            item.totalSteps || richInfo?.steps?.length || 5;
          const skillTags = richInfo?.skills?.slice(0, 2) || [];

          return (
            <Pressable
              onPress={() => setSelectedGuide(item)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cardBg, borderColor: borderCol },
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Open DIY Guide: ${item.title}`}
            >
              <View style={styles.cardTopRow}>
                <View
                  style={[styles.iconBox, { backgroundColor: item.accentColor }]}
                >
                  <Text style={styles.iconEmoji}>{item.iconEmoji}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>
                    {item.isFavorite && <Text style={{ fontSize: 14 }}>❤️</Text>}
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>⭐ Done</Text>
                      </View>
                    )}
                    {isInProgress && !isCompleted && (
                      <View style={styles.inProgressBadge}>
                        <Text style={styles.inProgressBadgeText}>🛠️ In Progress</Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[styles.cardSummary, { color: mutedText }]}
                    numberOfLines={2}
                  >
                    {item.summary}
                  </Text>
                </View>
              </View>

              {/* Content Preview Badges */}
              <View style={styles.contentMetaRow}>
                <View style={[styles.metaChip, { backgroundColor: pillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    🎒 {totalMaterialsCount} Supplies
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: pillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    🛠️ {totalStepsCount} Steps
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: pillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    ⏱️ {item.estimatedMinutes} min
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: pillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    🎯 Ages {item.minAge}–{item.maxAge}
                  </Text>
                </View>

                <View
                  style={[
                    styles.genderTargetPill,
                    item.genderTarget === 'boy'
                      ? styles.genderPillBoy
                      : item.genderTarget === 'girl'
                      ? styles.genderPillGirl
                      : styles.genderPillAll,
                  ]}
                >
                  <Text
                    style={[
                      styles.genderTargetText,
                      item.genderTarget === 'boy'
                        ? styles.genderTextBoy
                        : item.genderTarget === 'girl'
                        ? styles.genderTextGirl
                        : styles.genderTextAll,
                    ]}
                  >
                    {item.genderTarget === 'boy'
                      ? '👦 Boys'
                      : item.genderTarget === 'girl'
                      ? '👧 Girls'
                      : '🌟 Everyone'}
                  </Text>
                </View>
              </View>

              {/* Skills Row */}
              {skillTags.length > 0 && (
                <View style={styles.skillPreviewRow}>
                  {skillTags.map((skill, idx) => (
                    <Text
                      key={idx}
                      style={[styles.skillPreviewText, { color: mutedText }]}
                    >
                      {skill}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.openBtnBar}>
                <Text style={styles.openBtnText}>
                  📖 Open Project & Browse Steps ({totalStepsCount} Steps)
                </Text>
                <Text style={styles.openBtnArrow}>→</Text>
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
    gap: 14,
    paddingBottom: 32,
  },
  header: {
    gap: 10,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: '#FFEBE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D84315',
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
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
  audienceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audiencePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  audiencePillText: {
    fontSize: 12,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  completedBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  completedBadgeText: {
    color: '#03543F',
    fontSize: 11,
    fontWeight: '800',
  },
  inProgressBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inProgressBadgeText: {
    color: '#713F12',
    fontSize: 11,
    fontWeight: '700',
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  contentMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  genderTargetPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  genderPillBoy: {
    backgroundColor: '#EFF6FF',
  },
  genderTextBoy: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
  },
  genderPillGirl: {
    backgroundColor: '#FDF2F8',
  },
  genderTextGirl: {
    color: '#DB2777',
    fontSize: 11,
    fontWeight: '700',
  },
  genderPillAll: {
    backgroundColor: '#F3F4F6',
  },
  genderTextAll: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '700',
  },
  skillPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillPreviewText: {
    fontSize: 11,
    fontWeight: '600',
  },
  openBtnBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  openBtnText: {
    color: '#D84315',
    fontSize: 13,
    fontWeight: '800',
  },
  openBtnArrow: {
    color: '#D84315',
    fontSize: 16,
    fontWeight: '900',
  },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
  resetFilterBtn: {
    marginTop: 8,
    backgroundColor: '#FF7043',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
