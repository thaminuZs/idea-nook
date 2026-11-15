import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import AppIcon from '../components/AppIcon';
import GuideDetailView from '../components/GuideDetailView';
import ProjectCard from '../components/ProjectCard';
import { Fonts } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import { getCategories, getGuides, seedInitialGuides } from '../db';

const AUDIENCE_TABS = [
  { id: 'all', label: 'All', icon: null },
  { id: 'boy', label: 'Boys', icon: 'human-male' },
  { id: 'girl', label: 'Girls', icon: 'human-female' },
  { id: 'favorites', label: 'Saved', icon: 'heart' },
];

const CATEGORY_EMOJIS = {
  'Paper & Origami': '🚀',
  'Science & Sensory': '🌋',
  'Nature & Recycled': '🍃',
  'STEM & Toys': '🏎️',
  'Wearables & Decor': '✨',
};

function shuffleGuides(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ExploreScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();

  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLibrary = useCallback(async () => {
    try {
      await seedInitialGuides(db);
      const [allGuides, allCats] = await Promise.all([
        getGuides(db),
        getCategories(db),
      ]);
      setGuides((prev) => {
        if (prev.length === allGuides.length && prev.length > 0) {
          const mapById = new Map(allGuides.map((g) => [g.id, g]));
          return prev.map((oldItem) => mapById.get(oldItem.id) || oldItem);
        }
        return shuffleGuides(allGuides);
      });
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
      if (selectedAudience === 'boy' && g.genderTarget !== 'boy' && g.genderTarget !== 'all') {
        return false;
      }
      if (selectedAudience === 'girl' && g.genderTarget !== 'girl' && g.genderTarget !== 'all') {
        return false;
      }
      if (selectedAudience === 'favorites' && !g.isFavorite) {
        return false;
      }

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
  }, [guides, selectedAudience, selectedCategory, searchQuery]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === 'All') {
      return `All Categories (${guides.length})`;
    }
    const found = categories.find((c) => c.category === selectedCategory);
    const emoji = CATEGORY_EMOJIS[selectedCategory] || '🎨';
    return `${emoji}  ${selectedCategory}${found ? ` (${found.count})` : ''}`;
  }, [selectedCategory, guides.length, categories]);

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
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Search Input */}
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: isSearchFocused ? theme.primary : theme.border,
                },
              ]}
            >
              <AppIcon
                name="magnify"
                size={22}
                color={isSearchFocused ? theme.primary : theme.textMuted}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: theme.text },
                  Platform.OS === 'web' && styles.webInputNoOutline,
                ]}
                placeholder="Search rockets, volcano, bracelets..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                underlineColorAndroid="transparent"
                selectionColor={theme.primary}
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  hitSlop={10}
                  style={[
                    styles.clearBtn,
                    { backgroundColor: theme.surfaceSubtle },
                  ]}
                >
                  <AppIcon name="close" size={16} color={theme.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Audience Filter Row */}
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
                        backgroundColor: isSelected
                          ? theme.primary
                          : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    {tab.icon && (
                      <AppIcon
                        name={tab.icon}
                        size={14}
                        color={isSelected ? '#FFFFFF' : theme.text}
                      />
                    )}
                    <Text
                      style={[
                        styles.audiencePillText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.text,
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Select-Option Style Category Dropdown */}
            <View style={styles.selectContainer}>
              <Pressable
                style={[
                  styles.selectTrigger,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isCategorySelectOpen ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setIsCategorySelectOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Select Category"
              >
                <View style={styles.selectTriggerLeft}>
                  <Text style={[styles.selectLabelPrefix, { color: theme.textMuted }]}>
                    Category:
                  </Text>
                  <Text
                    style={[styles.selectValueText, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {selectedCategoryLabel}
                  </Text>
                </View>

                <AppIcon
                  name={isCategorySelectOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={isCategorySelectOpen ? theme.primary : theme.textMuted}
                />
              </Pressable>

              {isCategorySelectOpen && (
                <View
                  style={[
                    styles.selectDropdownMenu,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Pressable
                    style={[
                      styles.selectOptionRow,
                      { borderBottomColor: theme.border },
                      selectedCategory === 'All' && {
                        backgroundColor: theme.primarySoft,
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory('All');
                      setIsCategorySelectOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        {
                          color:
                            selectedCategory === 'All' ? theme.primary : theme.text,
                          fontFamily:
                            selectedCategory === 'All'
                              ? Fonts.extraBold
                              : Fonts.semiBold,
                        },
                      ]}
                    >
                      All Categories ({guides.length})
                    </Text>
                    {selectedCategory === 'All' && (
                      <AppIcon name="check" size={18} color={theme.primary} />
                    )}
                  </Pressable>

                  {categories.map((c, index) => {
                    const isSelected = selectedCategory === c.category;
                    const isLast = index === categories.length - 1;
                    const emoji = CATEGORY_EMOJIS[c.category] || '🎨';
                    return (
                      <Pressable
                        key={c.category}
                        style={[
                          styles.selectOptionRow,
                          !isLast && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                          isSelected && { backgroundColor: theme.primarySoft },
                        ]}
                        onPress={() => {
                          setSelectedCategory(c.category);
                          setIsCategorySelectOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.selectOptionText,
                            {
                              color: isSelected ? theme.primary : theme.text,
                              fontFamily: isSelected
                                ? Fonts.extraBold
                                : Fonts.semiBold,
                            },
                          ]}
                        >
                          {emoji}  {c.category} ({c.count})
                        </Text>
                        {isSelected && (
                          <AppIcon name="check" size={18} color={theme.primary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <AppIcon name="magnify" size={38} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No projects found
            </Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
              Try clearing your search or switching filters.
            </Text>
            <Pressable
              style={[styles.resetFilterBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSelectedAudience('all');
                setSelectedCategory('All');
                setSearchQuery('');
                setIsCategorySelectOpen(false);
              }}
            >
              <Text style={styles.resetFilterBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProjectCard item={item} onPress={setSelectedGuide} />
        )}
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
    gap: 12,
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    paddingVertical: 10,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
  },
  webInputNoOutline: {
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audienceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  audiencePill: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  audiencePillText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  selectContainer: {
    gap: 6,
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  selectTriggerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectLabelPrefix: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  selectValueText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
  selectDropdownMenu: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  selectOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  selectOptionText: {
    fontSize: 14,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  resetFilterBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
});
