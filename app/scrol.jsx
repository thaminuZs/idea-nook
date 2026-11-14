import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import AppIcon from '../components/AppIcon';
import ConfirmDialog from '../components/ConfirmDialog';
import GuideDetailView from '../components/GuideDetailView';
import OnboardingScreen from '../components/OnboardingScreen';
import ProjectCard from '../components/ProjectCard';
import { Fonts } from '../constants/Colors';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats, getGuides } from '../db';

export default function ProfilePage() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const { profile, saveProfile, clearProfile } = useProfile();

  const [stats, setStats] = useState(null);
  const [savedGuides, setSavedGuides] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const loadProfileData = useCallback(async () => {
    try {
      const [s, allGuides] = await Promise.all([
        getDashboardStats(db),
        getGuides(db),
      ]);
      setStats(s);
      setSavedGuides(
        allGuides.filter(
          (g) => g.isFavorite || g.status === 'in_progress' || g.status === 'completed'
        )
      );
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const genderLabel =
    profile?.gender === 'boy'
      ? 'Boy'
      : profile?.gender === 'girl'
      ? 'Girl'
      : 'Super Star';
  const genderIcon =
    profile?.gender === 'boy'
      ? 'human-male'
      : profile?.gender === 'girl'
      ? 'human-female'
      : 'star-circle';

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  if (selectedGuide) {
    return (
      <GuideDetailView
        guideId={selectedGuide.id}
        initialGuide={selectedGuide}
        onBack={() => {
          setSelectedGuide(null);
          loadProfileData();
        }}
      />
    );
  }

  if (!profile) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          No profile found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Clean Modern Profile Hero */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View
            style={[
              styles.avatarWrapper,
              { backgroundColor: theme.primarySoft },
            ]}
          >
            <AppIcon name={profile.avatarEmoji} size={34} color={theme.primary} />
          </View>

          <View style={styles.heroInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {profile.name}
            </Text>
            <View style={styles.tagRow}>
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.tagBadgeText, { color: theme.textMuted }]}>
                  Age {profile.age}
                </Text>
              </View>
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                ]}
              >
                <AppIcon name={genderIcon} size={13} color={theme.textMuted} />
                <Text style={[styles.tagBadgeText, { color: theme.textMuted }]}>
                  {genderLabel}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.editButton, { backgroundColor: theme.primarySoft }]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={[styles.editButtonText, { color: theme.primary }]}>
              Edit
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 2x2 Stats Grid */}
      {loadingStats ? (
        <ActivityIndicator color={theme.primary} style={{ marginVertical: 16 }} />
      ) : (
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <AppIcon name="star" size={24} color="#F59E0B" />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.totalStars ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Stars
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <AppIcon name="trophy" size={24} color="#10B981" />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.completedGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Completed
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <AppIcon name="hammer-wrench" size={24} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.inProgressGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              In Progress
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <AppIcon name="heart" size={24} color="#EF4444" />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.favoriteGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Saved
            </Text>
          </View>
        </View>
      )}

      {/* Active & Saved Projects Section */}
      {savedGuides.length > 0 && (
        <View style={styles.savedSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Projects
          </Text>
          <View style={styles.savedList}>
            {savedGuides.map((g) => (
              <ProjectCard key={g.id} item={g} onPress={setSelectedGuide} />
            ))}
          </View>
        </View>
      )}

      {/* Subtle Switch / Reset Profile Action */}
      <Pressable style={styles.resetButton} onPress={handleReset}>
        <Text style={[styles.resetButtonText, { color: theme.textMuted }]}>
          Switch or Reset Profile
        </Text>
      </Pressable>

      {/* Unified Reset Profile Confirmation Dialog */}
      <ConfirmDialog
        visible={showResetConfirm}
        icon="account-circle-outline"
        title="Reset Profile?"
        message="This will clear your current profile, reset all DIY project progress, and open the welcome setup screen."
        confirmText="Reset"
        cancelText="Cancel"
        destructive
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={async () => {
          setShowResetConfirm(false);
          await clearProfile();
        }}
      />

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        visible={isEditing}
        onRequestClose={() => setIsEditing(false)}
      >
        <OnboardingScreen
          initialProfile={profile}
          isFirstTime={false}
          onComplete={async (updated) => {
            await saveProfile(updated);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  heroCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {
    flex: 1,
    gap: 6,
  },
  profileName: {
    fontSize: 20,
    fontFamily: Fonts.extraBold,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  tagBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: Fonts.extraBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '46%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  savedSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.extraBold,
  },
  savedList: {
    gap: 12,
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
});
