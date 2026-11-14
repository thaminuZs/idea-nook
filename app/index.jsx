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
import AppIcon from '../components/AppIcon';
import GuideDetailView from '../components/GuideDetailView';
import ProjectCard from '../components/ProjectCard';
import { Fonts } from '../constants/Colors';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats, getGuides, seedInitialGuides } from '../db';

const ForYouScreen = () => {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const { profile } = useProfile();

  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const genderLabel =
    profile?.gender === 'boy'
      ? 'Boys'
      : profile?.gender === 'girl'
      ? 'Girls'
      : 'Everyone';

  // Strictly For You (FYP) feed based on child's gender and age
  const forYouGuides = useMemo(() => {
    if (!profile) return guides;

    const genderMatched = guides.filter((g) => {
      if (profile.gender === 'boy') {
        return g.genderTarget === 'boy' || g.genderTarget === 'all';
      }
      if (profile.gender === 'girl') {
        return g.genderTarget === 'girl' || g.genderTarget === 'all';
      }
      return true;
    });

    const strictAgeAndGender = genderMatched.filter(
      (g) => !profile.age || (g.minAge <= profile.age && g.maxAge >= profile.age)
    );

    const listToUse =
      strictAgeAndGender.length >= 3 ? strictAgeAndGender : genderMatched;

    return [...listToUse].sort((a, b) => {
      const aExactGender = a.genderTarget === profile.gender ? 1 : 0;
      const bExactGender = b.genderTarget === profile.gender ? 1 : 0;
      if (aExactGender !== bExactGender) {
        return bExactGender - aExactGender;
      }
      return a.id - b.id;
    });
  }, [guides, profile]);

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
        <ActivityIndicator size="large" color={theme.primary} />
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
        data={forYouGuides}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    Picked for {profile?.name || 'You'}
                  </Text>
                  <AppIcon name="star-four-points" size={20} color={theme.primary} />
                </View>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  Age {profile?.age} • {genderLabel} • {forYouGuides.length} activities
                </Text>
              </View>

              {stats && (
                <Pressable
                  onPress={() => router.push('/scrol')}
                  style={[
                    styles.starChip,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <AppIcon name="star" size={16} color="#F59E0B" />
                  <Text style={[styles.starCount, { color: theme.text }]}>
                    {stats.totalStars}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListFooterComponent={
          <Pressable
            style={[
              styles.exploreBanner,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => router.push('/flat')}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.exploreTitle, { color: theme.text }]}>
                Looking for more ideas?
              </Text>
              <Text style={[styles.exploreSub, { color: theme.textMuted }]}>
                Browse all {guides.length} projects in Explore
              </Text>
            </View>
            <AppIcon name="arrow-right" size={20} color={theme.primary} />
          </Pressable>
        }
        renderItem={({ item }) => (
          <ProjectCard item={item} onPress={setSelectedGuide} />
        )}
      />
    </View>
  );
};

export default ForYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  starCount: {
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
  exploreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    marginTop: 4,
  },
  exploreTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  exploreSub: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 15,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});
