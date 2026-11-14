import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Fonts } from '../constants/Colors';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  getGuideById,
  getStarterGuideRichContent,
  resetGuideMaterials,
  resetGuideProgress,
  seedInitialGuides,
  toggleFavorite,
  toggleMaterialChecked,
  toggleStepCompleted,
} from '../db';

export default function GuideDetailView({ guideId, initialGuide, onBack }) {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const { profile } = useProfile();

  const numericId = Number(guideId || initialGuide?.id);

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'supplies' | 'ideas'

  const loadGuide = useCallback(async () => {
    if (!numericId || Number.isNaN(numericId)) {
      setError('Invalid Project ID');
      setLoading(false);
      return;
    }

    try {
      let data = await getGuideById(db, numericId);

      if (data && (data.materials.length === 0 || data.steps.length === 0)) {
        await seedInitialGuides(db);
        data = await getGuideById(db, numericId);
      }

      if (!data) {
        setError('Project not found');
      } else {
        setGuide(data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load project details:', err);
      setError(err?.message || 'Could not load project details.');
    } finally {
      setLoading(false);
    }
  }, [db, numericId]);

  useEffect(() => {
    loadGuide();
  }, [loadGuide]);

  const handleToggleFav = async () => {
    if (!guide) return;
    try {
      const newFavState = await toggleFavorite(db, guide.id);
      setGuide((prev) => (prev ? { ...prev, isFavorite: newFavState } : prev));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleToggleMaterial = async (materialId) => {
    if (!guide) return;
    try {
      const res = await toggleMaterialChecked(db, materialId);
      if (res) {
        setGuide((prev) => {
          if (!prev) return prev;
          const updatedMaterials = prev.materials.map((m) =>
            m.id === materialId ? { ...m, isChecked: res.isChecked } : m
          );
          const checkedCount = updatedMaterials.filter((m) => m.isChecked).length;
          return {
            ...prev,
            materials: updatedMaterials,
            checkedMaterials: checkedCount,
          };
        });
      }
    } catch (err) {
      console.error('Failed to toggle material:', err);
    }
  };

  const handleResetMaterials = async () => {
    if (!guide) return;
    try {
      await resetGuideMaterials(db, guide.id);
      setGuide((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          materials: prev.materials.map((m) => ({ ...m, isChecked: false })),
          checkedMaterials: 0,
        };
      });
    } catch (err) {
      console.error('Failed to reset materials:', err);
    }
  };

  const handleToggleStep = async (step) => {
    if (!guide) return;
    try {
      await toggleStepCompleted(db, guide.id, step.id);
      const refreshed = await getGuideById(db, guide.id);
      if (refreshed) {
        setGuide(refreshed);
      }
    } catch (err) {
      console.error('Failed to toggle step:', err);
    }
  };

  const handleResetGuide = async () => {
    if (!guide) return;

    const doReset = async () => {
      try {
        await resetGuideProgress(db, guide.id);
        const refreshed = await getGuideById(db, guide.id);
        if (refreshed) {
          setGuide(refreshed);
        }
      } catch (err) {
        console.error('Failed to reset project progress:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Reset all steps and start this project from Step 1?')) {
        await doReset();
      }
    } else {
      Alert.alert(
        'Start Over',
        'Reset your step progress and start this project from Step 1?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !guide) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorEmoji}>🔍</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Project Not Found</Text>
        <Text style={[styles.errorSubtitle, { color: theme.textMuted }]}>
          {error || "We couldn't find the requested DIY project."}
        </Text>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.primary }]}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const richContent = getStarterGuideRichContent(guide.slug) || {};
  const storyIntro = richContent.storyIntro || guide.summary;
  const funFacts = richContent.funFacts || [];
  const variations = richContent.variations || [];
  const troubleshooting = richContent.troubleshooting || [];

  const materialsList = guide.materials || [];
  const stepsList = (guide.steps || []).map((step, index) => ({
    ...step,
    emoji: richContent.steps?.[index]?.emoji || '🛠️',
  }));

  const checkedMaterialsCount = materialsList.filter((m) => m.isChecked).length;
  const progressPercent =
    stepsList.length > 0
      ? Math.round((guide.completedSteps / stepsList.length) * 100)
      : 0;
  const isCompleted = guide.status === 'completed' || progressPercent === 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Clean Minimal Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable onPress={onBack} style={styles.navBackBtn} hitSlop={10}>
          <Text style={[styles.navBackArrow, { color: theme.primary }]}>←</Text>
          <Text style={[styles.navBackText, { color: theme.text }]}>Back</Text>
        </Pressable>

        <Text
          style={[styles.topBarCategory, { color: theme.textMuted }]}
          numberOfLines={1}
        >
          {guide.category}
        </Text>

        <Pressable
          onPress={handleToggleFav}
          style={[styles.favBtn, { backgroundColor: theme.surfaceSubtle }]}
          hitSlop={10}
          accessibilityLabel="Toggle Favorite"
        >
          <Text style={styles.favBtnEmoji}>{guide.isFavorite ? '❤️' : '🤍'}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clean Modern Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.heroHeaderRow}>
            <View
              style={[
                styles.heroEmojiBox,
                { backgroundColor: guide.accentColor || theme.primary },
              ]}
            >
              <Text style={styles.heroEmoji}>{guide.iconEmoji}</Text>
            </View>

            <View style={styles.heroHeaderInfo}>
              <Text style={[styles.guideTitle, { color: theme.text }]}>
                {guide.title}
              </Text>
              <Text style={[styles.metaLine, { color: theme.textMuted }]}>
                ⏱️ {guide.estimatedMinutes} min  •  Ages {guide.minAge}–{guide.maxAge}  •  {guide.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.storyText, { color: theme.textMuted }]}>
            {storyIntro}
          </Text>

          {/* Compact Safety Notice */}
          {(guide.adultSupervision || guide.safetyNote) && (
            <View style={styles.safetyCallout}>
              <Text style={styles.safetyIcon}>
                {guide.adultSupervision ? '👨‍👩‍👧' : '⚠️'}
              </Text>
              <Text style={styles.safetyText}>
                {guide.safetyNote ||
                  'Adult helper recommended while building this project.'}
              </Text>
            </View>
          )}

          {/* Integrated Progress Bar */}
          <View style={[styles.progressBlock, { borderTopColor: theme.border }]}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: theme.text }]}>
                {isCompleted
                  ? 'Completed! 🎉'
                  : `${guide.completedSteps} of ${stepsList.length} steps done`}
              </Text>
              <Text style={styles.starsText}>
                {isCompleted ? '⭐⭐⭐' : guide.completedSteps > 0 ? '⭐☆☆' : '☆☆☆'}
              </Text>
            </View>
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: theme.surfaceSubtle },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: isCompleted ? theme.success : theme.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Completion Banner */}
        {isCompleted && (
          <View style={styles.celebrationCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.celebrationTitle}>
                🎉 Great job, {profile?.name || 'Builder'}!
              </Text>
              <Text style={styles.celebrationSubtitle}>
                You finished all {stepsList.length} steps and earned 3 Stars!
              </Text>
            </View>
            <Pressable style={styles.resetCraftBtn} onPress={handleResetGuide}>
              <Text style={styles.resetCraftBtnText}>Restart</Text>
            </Pressable>
          </View>
        )}

        {/* Segmented Control: Steps | Supplies | Tips & Facts */}
        <View
          style={[
            styles.segmentedBar,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            style={[
              styles.segmentBtn,
              activeTab === 'steps' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('steps')}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'steps' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              🛠️ Steps ({guide.completedSteps}/{stepsList.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              activeTab === 'supplies' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('supplies')}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'supplies' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              🎒 Supplies ({checkedMaterialsCount}/{materialsList.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              activeTab === 'ideas' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('ideas')}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'ideas' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              💡 Tips & Facts
            </Text>
          </Pressable>
        </View>

        {/* ============================================================ */}
        {/* TAB 1: STEP-BY-STEP INSTRUCTIONS */}
        {/* ============================================================ */}
        {activeTab === 'steps' && (
          <View style={styles.stepsList}>
            {stepsList.map((step, idx) => (
              <View
                key={step.id || idx}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: step.isCompleted ? theme.success : theme.border,
                  },
                ]}
              >
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepHeaderLeft}>
                    <View
                      style={[
                        styles.stepNumberCircle,
                        {
                          backgroundColor: step.isCompleted
                            ? theme.success
                            : theme.primarySoft,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumberText,
                          {
                            color: step.isCompleted ? '#FFFFFF' : theme.primary,
                          },
                        ]}
                      >
                        {step.isCompleted ? '✓' : step.stepNumber}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.stepTitle, { color: theme.text }]}>
                        {step.emoji} {step.title}
                      </Text>
                      {step.durationMinutes ? (
                        <Text style={[styles.stepMeta, { color: theme.textMuted }]}>
                          About {step.durationMinutes} min
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <Text style={[styles.stepInstruction, { color: theme.text }]}>
                  {step.instruction}
                </Text>

                {step.tip && (
                  <View style={styles.tipBox}>
                    <Text style={styles.tipText}>💡 {step.tip}</Text>
                  </View>
                )}

                {step.safetyWarning && (
                  <View style={styles.warningBox}>
                    <Text style={styles.warningText}>⚠️ {step.safetyWarning}</Text>
                  </View>
                )}

                <Pressable
                  style={[
                    styles.stepActionBtn,
                    step.isCompleted
                      ? { backgroundColor: theme.successSoft }
                      : { backgroundColor: theme.surfaceSubtle },
                  ]}
                  onPress={() => handleToggleStep(step)}
                >
                  <Text
                    style={[
                      styles.stepActionBtnText,
                      {
                        color: step.isCompleted ? theme.success : theme.text,
                      },
                    ]}
                  >
                    {step.isCompleted
                      ? `✓ Step ${step.stepNumber} Done`
                      : `Mark Step ${step.stepNumber} Done`}
                  </Text>
                </Pressable>
              </View>
            ))}

            {guide.completedSteps > 0 && (
              <Pressable onPress={handleResetGuide} style={styles.resetFooterBtn}>
                <Text style={[styles.resetFooterText, { color: theme.textMuted }]}>
                  Reset Step Progress
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SUPPLIES CHECKLIST */}
        {/* ============================================================ */}
        {activeTab === 'supplies' && (
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                What You Need
              </Text>
              {checkedMaterialsCount > 0 && (
                <Pressable onPress={handleResetMaterials}>
                  <Text style={[styles.resetLink, { color: theme.primary }]}>
                    Uncheck all
                  </Text>
                </Pressable>
              )}
            </View>

            <View style={styles.materialsList}>
              {materialsList.map((item, idx) => (
                <Pressable
                  key={item.id || idx}
                  style={[
                    styles.materialRow,
                    {
                      borderColor: item.isChecked ? theme.success : theme.border,
                      backgroundColor: item.isChecked
                        ? theme.successSoft
                        : 'transparent',
                    },
                  ]}
                  onPress={() => handleToggleMaterial(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.isChecked && {
                        backgroundColor: theme.success,
                        borderColor: theme.success,
                      },
                    ]}
                  >
                    {item.isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.materialName,
                        { color: theme.text },
                        item.isChecked && styles.materialNameChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.quantity && (
                      <Text
                        style={[styles.materialQuantity, { color: theme.textMuted }]}
                      >
                        {item.quantity}
                      </Text>
                    )}
                  </View>

                  {item.isOptional && (
                    <Text style={[styles.optionalTag, { color: theme.textMuted }]}>
                      Optional
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.goToStepsBtn, { backgroundColor: theme.primary }]}
              onPress={() => setActiveTab('steps')}
            >
              <Text style={styles.goToStepsBtnText}>Go to Steps →</Text>
            </Pressable>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 3: TIPS, FUN FACTS & REMIX IDEAS */}
        {/* ============================================================ */}
        {activeTab === 'ideas' && (
          <View style={styles.extrasContainer}>
            {funFacts.length > 0 && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  🧠 Did You Know?
                </Text>
                <View style={styles.factsList}>
                  {funFacts.map((fact, idx) => (
                    <View key={idx} style={styles.factRow}>
                      <Text style={styles.factDot}>•</Text>
                      <Text style={[styles.factText, { color: theme.textMuted }]}>
                        {fact}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {variations.length > 0 && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  🎨 Remix & Level-Up Ideas
                </Text>
                <View style={styles.variationsList}>
                  {variations.map((v, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.variationItem,
                        { backgroundColor: theme.surfaceSubtle },
                      ]}
                    >
                      <Text style={styles.variationEmoji}>{v.emoji}</Text>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          style={[styles.variationTitle, { color: theme.text }]}
                        >
                          {v.title}
                        </Text>
                        <Text
                          style={[
                            styles.variationDesc,
                            { color: theme.textMuted },
                          ]}
                        >
                          {v.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {troubleshooting.length > 0 && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  🔧 Quick Fixes
                </Text>
                <View style={styles.variationsList}>
                  {troubleshooting.map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.troubleItem,
                        { backgroundColor: theme.surfaceSubtle },
                      ]}
                    >
                      <Text style={[styles.troubleQ, { color: theme.text }]}>
                        {item.question}
                      </Text>
                      <Text style={[styles.troubleA, { color: theme.textMuted }]}>
                        {item.answer}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
    padding: 24,
  },
  errorEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 99,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBackArrow: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
  },
  navBackText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  topBarCategory: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtnEmoji: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  heroEmojiBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  guideTitle: {
    fontSize: 20,
    fontFamily: Fonts.extraBold,
    lineHeight: 26,
  },
  metaLine: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  storyText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  safetyCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  safetyIcon: {
    fontSize: 18,
  },
  safetyText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#92400E',
    lineHeight: 18,
  },
  progressBlock: {
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  starsText: {
    fontSize: 15,
    letterSpacing: 2,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  celebrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 12,
  },
  celebrationTitle: {
    fontSize: 15,
    fontFamily: Fonts.extraBold,
    color: '#065F46',
  },
  celebrationSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#047857',
    marginTop: 2,
  },
  resetCraftBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
  },
  resetCraftBtnText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  segmentedBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  stepNumberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
  },
  stepMeta: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    marginTop: 2,
  },
  stepInstruction: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  tipBox: {
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 18,
    fontFamily: Fonts.semiBold,
  },
  warningBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 18,
    fontFamily: Fonts.semiBold,
  },
  stepActionBtn: {
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  stepActionBtnText: {
    fontSize: 13,
    fontFamily: Fonts.extraBold,
  },
  resetFooterBtn: {
    alignSelf: 'center',
    padding: 10,
  },
  resetFooterText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
  },
  resetLink: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  materialsList: {
    gap: 8,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontFamily: Fonts.extraBold,
    fontSize: 13,
  },
  materialName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  materialNameChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  materialQuantity: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  optionalTag: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
  },
  goToStepsBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  goToStepsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
  extrasContainer: {
    gap: 12,
  },
  factsList: {
    gap: 10,
  },
  factRow: {
    flexDirection: 'row',
    gap: 8,
  },
  factDot: {
    fontSize: 16,
    color: '#FF6B35',
    fontFamily: Fonts.extraBold,
  },
  factText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  variationsList: {
    gap: 10,
  },
  variationItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  variationEmoji: {
    fontSize: 24,
  },
  variationTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  variationDesc: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 18,
  },
  troubleItem: {
    padding: 12,
    borderRadius: 14,
    gap: 4,
  },
  troubleQ: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  troubleA: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 18,
  },
});
