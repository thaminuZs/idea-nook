import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import GuideDetailView from '../components/GuideDetailView';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  getDashboardStats,
  getGuides,
  getStarterGuideRichContent,
  seedInitialGuides,
} from '../db';

const FILTER_TABS = [
  { id: 'for_you', label: '🎯 For You' },
  { id: 'all', label: '🌈 All' },
  { id: 'boy', label: '👦 Boys' },
  { id: 'girl', label: '👧 Girls' },
];

const Home = () => {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();
  const { profile } = useProfile();

  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('for_you');
  const [selectedGuide, setSelectedGuide] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      await seedInitialGuides(db);
      const [guideRows, dashboardStats] = await Promise.all([
        getGuides(db),
        getDashboardStats(db),
      ]);
      setGuides(guideRows);
      setStats(dashboardStats);
    } catch (err) {
      setError(err?.message || 'Failed to read SQLite database.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const isDark = scheme === 'dark';
  const cardBackground = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#2D2D2D' : '#E2E8F0';
  const mutedText = isDark ? '#94A3B8' : '#64748B';
  const filterPillBg = isDark ? '#262626' : '#F1F5F9';

  // Filtered guides based on selected tab and child profile
  const displayedGuides = useMemo(() => {
    if (selectedFilter === 'all') {
      return guides;
    }

    if (selectedFilter === 'boy') {
      return guides.filter((g) => g.genderTarget === 'boy' || g.genderTarget === 'all');
    }

    if (selectedFilter === 'girl') {
      return guides.filter((g) => g.genderTarget === 'girl' || g.genderTarget === 'all');
    }

    // Default 'for_you': Tailored to child's age AND gender
    if (selectedFilter === 'for_you') {
      if (!profile) return guides;

      return guides.filter((g) => {
        const matchesAge =
          !profile.age || (g.minAge <= profile.age && g.maxAge >= profile.age);

        let matchesGender = true;
        if (profile.gender === 'boy') {
          matchesGender = g.genderTarget === 'boy' || g.genderTarget === 'all';
        } else if (profile.gender === 'girl') {
          matchesGender = g.genderTarget === 'girl' || g.genderTarget === 'all';
        }

        return matchesAge && matchesGender;
      });
    }

    return guides;
  }, [guides, selectedFilter, profile]);

  // If a project is selected, render its full interactive GuideDetailView right here!
  if (selectedGuide) {
    return (
      <GuideDetailView
        guideId={selectedGuide.id}
        initialGuide={selectedGuide}
        onBack={() => {
          setSelectedGuide(null);
          loadData();
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

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={displayedGuides}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Friendly Greeting Card */}
            {profile && (
              <Pressable
                style={[
                  styles.greetingCard,
                  {
                    backgroundColor: isDark ? '#261C18' : '#FFF7ED',
                    borderColor: '#FFD7C2',
                  },
                ]}
                onPress={() => router.push('/scrol')}
              >
                <View style={styles.greetingLeft}>
                  <View style={styles.avatarPill}>
                    <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
                  </View>
                  <View>
                    <Text style={[styles.greetingTitle, { color: theme.text }]}>
                      Hi, {profile.name}! 👋
                    </Text>
                    <Text style={[styles.greetingSubtitle, { color: mutedText }]}>
                      Age {profile.age} •{' '}
                      {profile.gender === 'boy'
                        ? 'Boy 👦'
                        : profile.gender === 'girl'
                        ? 'Girl 👧'
                        : 'Super Star ⭐'}
                      {stats ? ` • ⭐ ${stats.totalStars} Stars` : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.viewProfileArrow}>→</Text>
              </Pressable>
            )}

            {/* Filter Tabs Row */}
            <View style={styles.filterRow}>
              {FILTER_TABS.map((tab) => {
                const isSelected = selectedFilter === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setSelectedFilter(tab.id)}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: isSelected ? '#FF7043' : filterPillBg,
                        borderColor: isSelected ? '#FF7043' : borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
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

            {/* Active Section Info Banner */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {selectedFilter === 'for_you'
                  ? `Recommended for ${profile?.name || 'You'}`
                  : selectedFilter === 'boy'
                  ? 'Projects for Boys 👦'
                  : selectedFilter === 'girl'
                  ? 'Projects for Girls 👧'
                  : 'All DIY Guides 🌈'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: mutedText }]}>
                Tap any project card below to open supplies, steps, fun facts & ideas ({displayedGuides.length} projects)
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isBestForYou =
            profile?.age &&
            item.minAge <= profile.age &&
            item.maxAge >= profile.age &&
            (profile.gender === 'all' ||
              item.genderTarget === 'all' ||
              item.genderTarget === profile.gender);

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
                { backgroundColor: cardBackground, borderColor },
                isBestForYou && styles.cardRecommended,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Open DIY Guide: ${item.title}`}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.badge, { backgroundColor: item.accentColor }]}>
                  <Text style={styles.emoji}>{item.iconEmoji}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>
                    {isBestForYou && (
                      <View style={styles.forYouBadge}>
                        <Text style={styles.forYouBadgeText}>For You</Text>
                      </View>
                    )}
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

              {/* Content Preview Badges: Supplies, Steps, Time, Age, Gender */}
              <View style={styles.contentMetaRow}>
                <View style={[styles.metaChip, { backgroundColor: filterPillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    🎒 {totalMaterialsCount} Supplies
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: filterPillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    🛠️ {totalStepsCount} Steps
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: filterPillBg }]}>
                  <Text style={[styles.metaChipText, { color: theme.text }]}>
                    ⏱️ {item.estimatedMinutes} min
                  </Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: filterPillBg }]}>
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

              {/* Skill Pills Row */}
              {skillTags.length > 0 && (
                <View style={styles.skillPreviewRow}>
                  {skillTags.map((skill, idx) => (
                    <Text key={idx} style={[styles.skillPreviewText, { color: mutedText }]}>
                      {skill}
                    </Text>
                  ))}
                </View>
              )}

              {/* Explicit Action Button Bar */}
              <View style={styles.openProjectBtnBar}>
                <Text style={styles.openProjectBtnText}>
                  📖 Open Project & Browse Steps ({totalStepsCount} Steps)
                </Text>
                <Text style={styles.openProjectBtnArrow}>→</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 6,
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPill: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  greetingTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  viewProfileArrow: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF7043',
    paddingHorizontal: 6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 13,
  },
  sectionHeader: {
    marginTop: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
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
  cardRecommended: {
    borderColor: '#FFAB91',
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  cardBody: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  forYouBadge: {
    backgroundColor: '#FFEBE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  forYouBadgeText: {
    color: '#D84315',
    fontSize: 11,
    fontWeight: '800',
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
    marginTop: 4,
    lineHeight: 18,
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
  openProjectBtnBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  openProjectBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D84315',
  },
  openProjectBtnArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D84315',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 15,
    textAlign: 'center',
  },
});
