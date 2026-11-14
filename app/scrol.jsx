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
import OnboardingScreen from '../components/OnboardingScreen';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats } from '../db';

export default function ProfilePage() {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();
  const { profile, saveProfile, clearProfile } = useProfile();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const s = await getDashboardStats(db);
      setStats(s);
    } catch (err) {
      console.error('Failed to load dashboard stats in profile:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const isDark = scheme === 'dark';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const borderCol = isDark ? '#2E2E2E' : '#E2E8F0';
  const mutedText = isDark ? '#94A3B8' : '#64748B';
  const highlightBg = isDark ? '#2D201A' : '#FFF7ED';

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
        'Are you sure you want to reset your profile? This will show the first-start setup screen again.',
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

  if (!profile) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          No profile found. Please restart the app to set up your profile.
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
      {/* Profile Header Hero */}
      <View
        style={[
          styles.heroCard,
          { backgroundColor: highlightBg, borderColor: '#FFD7C2' },
        ]}
      >
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
        </View>

        <Text style={[styles.profileName, { color: theme.text }]}>
          {profile.name}
        </Text>

        <View style={styles.tagRow}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>{genderLabel}</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>Age {profile.age}</Text>
          </View>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile ✏️</Text>
        </Pressable>
      </View>

      {/* Crafting Achievements Stats */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        My Crafting Journey 🏆
      </Text>

      {loadingStats ? (
        <ActivityIndicator color="#FF7043" style={{ marginVertical: 16 }} />
      ) : (
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.totalStars ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: mutedText }]}>Stars Earned</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={styles.statEmoji}>🎉</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.completedGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: mutedText }]}>Completed</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={styles.statEmoji}>⏳</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.inProgressGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: mutedText }]}>In Progress</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={styles.statEmoji}>❤️</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.favoriteGuides ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: mutedText }]}>Favorites</Text>
          </View>
        </View>
      )}

      {/* Profile Details List */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Profile Details 📋
      </Text>

      <View style={[styles.detailsCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: mutedText }]}>Name</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{profile.name}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: borderCol }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: mutedText }]}>Age</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{profile.age} years old</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: borderCol }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: mutedText }]}>Gender Badge</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{genderLabel}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: borderCol }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: mutedText }]}>Companion</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{profile.avatarEmoji}</Text>
        </View>
      </View>

      {/* Age & Gender Recommendation Guide Hint */}
      <View
        style={[
          styles.hintCard,
          { backgroundColor: isDark ? '#1C2630' : '#F0F9FF', borderColor: '#BAE6FD' },
        ]}
      >
        <Text style={styles.hintTitle}>💡 Tailored Content Active</Text>
        <Text style={[styles.hintBody, { color: mutedText }]}>
          Your Home feed is customized for {profile.name} (Age {profile.age} • {genderLabel}). You can browse tailored projects or explore all DIY crafts anytime on the Home tab!
        </Text>
      </View>

      {/* Testing / Reset Flow Button */}
      <View style={styles.resetContainer}>
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reset Profile (Test First-Start Flow)</Text>
        </Pressable>
        <Text style={[styles.resetSubtext, { color: mutedText }]}>
          Clears your saved profile so you can test the first-run onboarding screen again.
        </Text>
      </View>

      {/* Web Confirmation Modal */}
      {showResetConfirm && (
        <Modal transparent animationType="fade" visible={showResetConfirm}>
          <View style={styles.modalOverlay}>
            <View style={[styles.confirmModal, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={[styles.confirmTitle, { color: theme.text }]}>Reset Profile?</Text>
              <Text style={[styles.confirmBody, { color: mutedText }]}>
                This will delete your saved profile from SQLite and trigger the first-start setup screen.
              </Text>
              <View style={styles.confirmActions}>
                <Pressable
                  style={[styles.confirmBtn, styles.cancelBtn, { borderColor: borderCol }]}
                  onPress={() => setShowResetConfirm(false)}
                >
                  <Text style={{ color: theme.text, fontWeight: '600' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmBtn, styles.deleteBtn]}
                  onPress={async () => {
                    setShowResetConfirm(false);
                    await clearProfile();
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Reset</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        presentationStyle="pageSheet"
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
    padding: 18,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFEBE5',
  },
  tagBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D84315',
  },
  editButton: {
    backgroundColor: '#FF7043',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  hintCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 4,
  },
  hintBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  resetContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 24,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resetButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  resetSubtext: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmModal: {
    width: '100%',
    maxWidth: 340,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  confirmBody: {
    fontSize: 14,
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
