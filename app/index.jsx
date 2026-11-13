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
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats, getGuides } from '../db';

const Home = () => {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();
  const { profile } = useProfile();

  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
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

  // Content tailored to the child's age
  const ageMatchedGuides = useMemo(() => {
    if (!profile?.age) return [];
    return guides.filter(
      (g) => g.minAge <= profile.age && g.maxAge >= profile.age
    );
  }, [guides, profile?.age]);

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
        data={guides}
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
                      Age {profile.age} • Tap to view Profile & Stats
                    </Text>
                  </View>
                </View>
                <Text style={styles.viewProfileArrow}>→</Text>
              </Pressable>
            )}

            {/* Age-tailored section header */}
            {ageMatchedGuides.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  🎯 Recommended for Age {profile?.age}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: mutedText }]}>
                  {ageMatchedGuides.length} activities handpicked for your age group
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const isRecommended =
            profile?.age && item.minAge <= profile.age && item.maxAge >= profile.age;

          return (
            <View
              style={[
                styles.card,
                { backgroundColor: cardBackground, borderColor },
                isRecommended && styles.cardRecommended,
              ]}
            >
              <View style={[styles.badge, { backgroundColor: item.accentColor }]}>
                <Text style={styles.emoji}>{item.iconEmoji}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  {isRecommended && (
                    <View style={styles.forYouBadge}>
                      <Text style={styles.forYouBadgeText}>For You</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardSummary, { color: mutedText }]} numberOfLines={2}>
                  {item.summary}
                </Text>
                <Text style={[styles.cardMeta, { color: mutedText }]}>
                  {item.category} • Ages {item.minAge}–{item.maxAge} • {item.estimatedMinutes} min • {item.difficulty}
                </Text>
              </View>
            </View>
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
    gap: 12,
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
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 16,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  sectionHeader: {
    marginTop: 4,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardRecommended: {
    borderColor: '#FFAB91',
    borderWidth: 1.5,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
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
    fontWeight: '700',
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
  cardSummary: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 15,
    textAlign: 'center',
  },
});
