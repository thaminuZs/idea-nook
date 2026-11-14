import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
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
      ? 'Boy 👦'
      : profile?.gender === 'girl'
      ? 'Girl 👧'
      : 'Super Star ⭐';

  const handleReset = () => {
    if (Platform.OS === 'web') {
      setShowResetConfirm(true);
    } else {
      Alert.alert(
        'Reset Profile',
        'Do you want to clear this profile and set up a new one?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => clearProfile(),
          },
        ]
      );
    }
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
            <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
          </View>

          <View style={styles.heroInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {profile.name}
            </Text>
            <View style={styles.tagRow}>
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: theme.surfaceSubtle },
                ]}
              >
                <Text style={[styles.tagBadgeText, { color: theme.textMuted }]}>
                  Age {profile.age}
                </Text>
              </View>
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: theme.surfaceSubtle },
                ]}
              >
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
            <Text style={styles.statEmoji}>⭐</Text>
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
            <Text style={styles.statEmoji}>🏆</Text>
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
            <Text style={styles.statEmoji}>🛠️</Text>
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
            <Text style={styles.statEmoji}>❤️</Text>
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

      {/* Web Confirmation Modal */}
      {showResetConfirm && (
        <Modal transparent animationType="fade" visible={showResetConfirm}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.confirmModal,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.confirmTitle, { color: theme.text }]}>
                Reset Profile?
              </Text>
              <Text style={[styles.confirmBody, { color: theme.textMuted }]}>
                This will clear your current profile and open the welcome setup screen.
              </Text>
              <View style={styles.confirmActions}>
                <Pressable
                  style={[
                    styles.confirmBtn,
                    styles.cancelBtn,
                    { borderColor: theme.border },
                  ]}
                  onPress={() => setShowResetConfirm(false)}
                >
                  <Text style={{ color: theme.text, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmBtn, styles.deleteBtn]}
                  onPress={async () => {
                    setShowResetConfirm(false);
                    await clearProfile();
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                    Reset
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

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
    borderRadius: 22,
    borderWidth: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 34,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tagBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
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
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: {
    fontSize: 22,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmModal: {
    width: '100%',
    maxWidth: 340,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    marginBottom: 8,
  },
  confirmBody: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    marginBottom: 16,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
});
