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

export default function ExploreScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();

  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

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
                  borderColor: theme.border,
                },
              ]}
            >
              <AppIcon name="magnify" size={18} color={theme.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search rockets, volcano, bracelets..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <AppIcon name="close" size={18} color={theme.textMuted} />
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

            {/* Category Filter Chips */}
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
                      selectedCategory === 'All'
                        ? theme.text
                        : theme.surfaceSubtle,
                  },
                ]}
                onPress={() => setSelectedCategory('All')}
              >
                <Text
                  style={[
                    styles.catPillText,
                    {
                      color:
                        selectedCategory === 'All'
                          ? theme.background
                          : theme.textMuted,
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
                        backgroundColor: isSelected
                          ? theme.text
                          : theme.surfaceSubtle,
                      },
                    ]}
                    onPress={() => setSelectedCategory(c.category)}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        {
                          color: isSelected ? theme.background : theme.textMuted,
                        },
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
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    paddingHorizontal: 4,
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
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  audiencePillText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  categoryScroll: {
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
  },
  catPillText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 36,
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
    borderRadius: 99,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
});
