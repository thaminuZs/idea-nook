import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import OnboardingScreen from '../components/OnboardingScreen';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats, getGuides } from '../db';

const Home = () => {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();
  const { profile, saveProfile, clearProfile } = useProfile();

  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  const genderBadge = useMemo(() => {
    if (profile?.gender === 'boy') return 'Boy 👦';
    if (profile?.gender === 'girl') return 'Girl 👧';
    return 'Super Star ⭐';
  }, [profile?.gender]);

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
            {/* Child Profile Welcome Card */}
            {profile && (
              <View
                style={[
                  styles.profileHeroCard,
                  {
                    backgroundColor: isDark ? '#261C18' : '#FFF7ED',
                    borderColor: '#FFD7C2',
                  },
                ]}
              >
                <View style={styles.profileHeroTop}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.welcomeGreeting, { color: theme.text }]}>
                      Hello, {profile.name}! ✨
                    </Text>
                    <Text style={[styles.profileMeta, { color: mutedText }]}>
                      {genderBadge} • Age {profile.age}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.editBtn}
                    onPress={() => setIsEditingProfile(true)}
                  >
                    <Text style={styles.editBtnText}>Edit ✏️</Text>
                  </Pressable>
                </View>

                {/* Age-tailored callout banner */}
                <View style={styles.calloutBanner}>
                  <Text style={styles.calloutText}>
                    🎉 Showing {ageMatchedGuides.length} DIY crafts recommended for Age {profile.age}!
                  </Text>
                </View>

                {/* Developer / Testing reset action */}
                <Pressable
                  style={styles.resetBtn}
                  onPress={clearProfile}
                >
                  <Text style={styles.resetBtnText}>
                    🔄 Reset Profile (Test First-Start Flow)
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Recommended Section Header if matched guides exist */}
            {ageMatchedGuides.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  🎯 Recommended for Age {profile?.age}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: mutedText }]}>
                  Crafts handpicked for {profile?.name}'s age group ({ageMatchedGuides.length} activities)
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

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditingProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditingProfile(false)}
      >
        <OnboardingScreen
          initialProfile={profile}
          isFirstTime={false}
          onComplete={async (updated) => {
            await saveProfile(updated);
            setIsEditingProfile(false);
          }}
          onCancel={() => setIsEditingProfile(false)}
        />
      </Modal>
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
  profileHeroCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileMeta: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FF7043',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calloutBanner: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 112, 67, 0.12)',
  },
  calloutText: {
    color: '#D84315',
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetBtnText: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginTop: 6,
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
