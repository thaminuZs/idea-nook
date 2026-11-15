import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Fonts } from '../constants/Colors';
import { getProjectImage, resolveProjectEmoji } from '../constants/ProjectImages';
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
import AppIcon from './AppIcon';
import ConfirmDialog from './ConfirmDialog';
import PopArtCelebration from './PopArtCelebration';

export default function GuideDetailView({ guideId, initialGuide, onBack }) {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const { profile } = useProfile();

  const numericId = Number(guideId || initialGuide?.id);

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('supplies'); // 'supplies' | 'steps' | 'ideas'
  const [showPopArt, setShowPopArt] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

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
      const wasCompleted =
        guide.status === 'completed' ||
        (guide.steps?.length > 0 && guide.completedSteps >= guide.steps.length);

      await toggleStepCompleted(db, guide.id, step.id);
      const refreshed = await getGuideById(db, guide.id);
      if (refreshed) {
        setGuide(refreshed);
        const nowCompleted =
          refreshed.status === 'completed' ||
          (refreshed.steps?.length > 0 &&
            refreshed.completedSteps >= refreshed.steps.length);
        if (!wasCompleted && nowCompleted) {
          setShowPopArt(true);
        }
      }
    } catch (err) {
      console.error('Failed to toggle step:', err);
    }
  };

  const handleResetGuide = () => {
    if (!guide) return;
    setShowResetDialog(true);
  };

  const confirmResetGuide = async () => {
    if (!guide) return;
    setShowResetDialog(false);
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
        <AppIcon
          name="magnify"
          size={42}
          color={theme.textMuted}
          style={{ marginBottom: 12 }}
        />
        <Text style={[styles.errorTitle, { color: theme.text }]}>Project Not Found</Text>
        <Text style={[styles.errorSubtitle, { color: theme.textMuted }]}>
          {error || "We couldn't find the requested DIY project."}
        </Text>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.primary }]}
          onPress={onBack}
        >
          <AppIcon name="arrow-left" size={16} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
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
  const projectEmoji = resolveProjectEmoji(guide.iconEmoji, guide.slug);
  const outcomeImage = getProjectImage(guide.slug);

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
          <AppIcon name="arrow-left" size={20} color={theme.primary} />
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
          style={[
            styles.favBtn,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
          ]}
          hitSlop={10}
          accessibilityLabel="Toggle Favorite"
        >
          <AppIcon
            name={guide.isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={guide.isFavorite ? '#EF4444' : theme.textMuted}
          />
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
          {outcomeImage && (
            <View
              style={[
                styles.heroImageWrapper,
                {
                  backgroundColor: `${guide.accentColor || theme.primary}15`,
                  borderColor: `${guide.accentColor || theme.primary}30`,
                },
              ]}
            >
              <Image
                source={outcomeImage}
                style={styles.heroOutcomeImage}
                resizeMode="contain"
              />
              <View style={styles.heroOutcomeBadge}>
                <Text style={styles.heroOutcomeBadgeText}>
                  {projectEmoji} Final Outcome
                </Text>
              </View>
            </View>
          )}

          <View style={styles.heroHeaderRow}>
            <View
              style={[
                styles.heroEmojiBox,
                { backgroundColor: guide.accentColor || theme.primary },
              ]}
            >
              <Text style={styles.heroEmoji}>{projectEmoji}</Text>
            </View>

            <View style={styles.heroHeaderInfo}>
              <Text style={[styles.guideTitle, { color: theme.text }]}>
                {guide.title}
              </Text>
              <View style={styles.metaInlineRow}>
                <AppIcon name="clock-outline" size={14} color={theme.textMuted} />
                <Text style={[styles.metaLine, { color: theme.textMuted }]}>
                  {guide.estimatedMinutes} min  •  Ages {guide.minAge}–{guide.maxAge}  •  {guide.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.storyText, { color: theme.textMuted }]}>
            {storyIntro}
          </Text>

          {/* Compact Safety Notice */}
          {(guide.adultSupervision || guide.safetyNote) && (
            <View style={styles.safetyCallout}>
              <AppIcon
                name={guide.adultSupervision ? 'account-supervisor' : 'alert-circle-outline'}
                size={18}
                color="#B45309"
              />
              <Text style={styles.safetyText}>
                {guide.safetyNote ||
                  'Adult helper recommended while building this project.'}
              </Text>
            </View>
          )}

          {/* Integrated Progress Bar */}
          <View style={[styles.progressBlock, { borderTopColor: theme.border }]}>
            <View style={styles.progressLabelRow}>
              <View style={styles.metaInlineRow}>
                {isCompleted && (
                  <AppIcon name="check-circle" size={16} color={theme.success} />
                )}
                <Text style={[styles.progressLabel, { color: theme.text }]}>
                  {isCompleted
                    ? 'Completed!'
                    : `${guide.completedSteps} of ${stepsList.length} steps done`}
                </Text>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3].map((idx) => {
                  const filled = isCompleted || (idx === 1 && guide.completedSteps > 0);
                  return (
                    <AppIcon
                      key={idx}
                      name={filled ? 'star' : 'star-outline'}
                      size={16}
                      color={filled ? '#F59E0B' : theme.textMuted}
                    />
                  );
                })}
              </View>
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
            <View style={styles.celebrationTopRow}>
              <AppIcon name="trophy" size={26} color="#047857" />
              <View style={{ flex: 1 }}>
                <Text style={styles.celebrationTitle}>
                  Great job, {profile?.name || 'Builder'}!
                </Text>
                <Text style={styles.celebrationSubtitle}>
                  You finished all {stepsList.length} steps and earned 3 Stars!
                </Text>
              </View>
              <Pressable style={styles.resetCraftBtn} onPress={handleResetGuide}>
                <AppIcon name="restart" size={14} color="#FFFFFF" />
                <Text style={styles.resetCraftBtnText}>Restart</Text>
              </Pressable>
            </View>

            {/* Interactive Pop-Art Comic Stickers Row (Tap to replay burst) */}
            <Pressable
              style={styles.popArtMiniRow}
              onPress={() => setShowPopArt(true)}
              accessibilityRole="button"
              accessibilityLabel="Replay Pop Art Celebration"
            >
              {[
                { label: 'GOOD JOB!', bg: '#FF5252', color: '#FFFFFF', rot: '-2deg' },
                { label: 'WOW!', bg: '#FFEB3B', color: '#0F172A', rot: '2deg' },
                { label: 'SUPERB!', bg: '#00E5FF', color: '#0F172A', rot: '-2deg' },
                { label: 'EXCELLENT!', bg: '#69F0AE', color: '#0F172A', rot: '2deg' },
              ].map((tag) => (
                <View
                  key={tag.label}
                  style={[
                    styles.popArtMiniBadge,
                    {
                      backgroundColor: tag.bg,
                      transform: [{ rotate: tag.rot }],
                    },
                  ]}
                >
                  <Text style={[styles.popArtMiniText, { color: tag.color }]}>
                    {tag.label}
                  </Text>
                </View>
              ))}
            </Pressable>
          </View>
        )}

        {/* Segmented Control: Supplies | Steps | Tips & Facts */}
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
              activeTab === 'supplies' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('supplies')}
          >
            <AppIcon
              name="bag-personal"
              size={14}
              color={activeTab === 'supplies' ? '#FFFFFF' : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'supplies' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              Supplies ({checkedMaterialsCount}/{materialsList.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              activeTab === 'steps' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('steps')}
          >
            <AppIcon
              name="hammer-wrench"
              size={14}
              color={activeTab === 'steps' ? '#FFFFFF' : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'steps' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              Steps ({guide.completedSteps}/{stepsList.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              activeTab === 'ideas' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('ideas')}
          >
            <AppIcon
              name="lightbulb-on-outline"
              size={14}
              color={activeTab === 'ideas' ? '#FFFFFF' : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'ideas' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              Tips & Facts
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
                      {step.isCompleted ? (
                        <AppIcon name="check" size={16} color="#FFFFFF" />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumberText,
                            { color: theme.primary },
                          ]}
                        >
                          {step.stepNumber}
                        </Text>
                      )}
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
                    <AppIcon name="lightbulb-on-outline" size={16} color="#92400E" />
                    <Text style={[styles.tipText, { flex: 1 }]}>{step.tip}</Text>
                  </View>
                )}

                {step.safetyWarning && (
                  <View style={styles.warningBox}>
                    <AppIcon name="alert-circle-outline" size={16} color="#991B1B" />
                    <Text style={[styles.warningText, { flex: 1 }]}>
                      {step.safetyWarning}
                    </Text>
                  </View>
                )}

                <Pressable
                  style={[
                    styles.stepActionBtn,
                    step.isCompleted
                      ? { backgroundColor: theme.successSoft, borderColor: theme.success }
                      : { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                  ]}
                  onPress={() => handleToggleStep(step)}
                >
                  {step.isCompleted && (
                    <AppIcon name="check" size={15} color={theme.success} />
                  )}
                  <Text
                    style={[
                      styles.stepActionBtnText,
                      {
                        color: step.isCompleted ? theme.success : theme.text,
                      },
                    ]}
                  >
                    {step.isCompleted
                      ? `Step ${step.stepNumber} Done`
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
                    {item.isChecked && (
                      <AppIcon name="check" size={14} color="#FFFFFF" />
                    )}
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
              <Text style={styles.goToStepsBtnText}>Go to Steps</Text>
              <AppIcon name="arrow-right" size={16} color="#FFFFFF" />
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
                <View style={styles.sectionTitleWithIcon}>
                  <AppIcon name="lightbulb-on-outline" size={18} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Did You Know?
                  </Text>
                </View>
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
                <View style={styles.sectionTitleWithIcon}>
                  <AppIcon name="palette" size={18} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Remix & Level-Up Ideas
                  </Text>
                </View>
                <View style={styles.variationsList}>
                  {variations.map((v, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.variationItem,
                        {
                          backgroundColor: theme.surfaceSubtle,
                          borderColor: theme.border,
                        },
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
                <View style={styles.sectionTitleWithIcon}>
                  <AppIcon name="hammer-wrench" size={18} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Quick Fixes
                  </Text>
                </View>
                <View style={styles.variationsList}>
                  {troubleshooting.map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.troubleItem,
                        {
                          backgroundColor: theme.surfaceSubtle,
                          borderColor: theme.border,
                        },
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

      {/* Small Pop-Art Celebration Burst on All Steps Completed */}
      <PopArtCelebration
        visible={showPopArt}
        onFinish={() => setShowPopArt(false)}
      />

      {/* Unified Reset Project Confirmation Dialog */}
      <ConfirmDialog
        visible={showResetDialog}
        icon="restart"
        title="Start Over?"
        message="Reset all checked supplies and step progress so you can start this DIY project from the beginning?"
        confirmText="Reset Project"
        cancelText="Cancel"
        destructive
        onConfirm={confirmResetGuide}
        onCancel={() => setShowResetDialog(false)}
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
    padding: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
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
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBackText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  topBarCategory: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 14,
  },
  heroImageWrapper: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroOutcomeImage: {
    width: '100%',
    height: '100%',
  },
  heroOutcomeBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroOutcomeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  heroEmojiBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 30,
  },
  heroHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  guideTitle: {
    fontSize: 21,
    fontFamily: Fonts.heading,
    lineHeight: 28,
  },
  metaInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaLine: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  storyText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 25,
  },
  safetyCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#92400E',
    lineHeight: 20,
  },
  progressBlock: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderStyle: 'solid',
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
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
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#10B981',
    gap: 12,
  },
  celebrationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  popArtMiniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  popArtMiniBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderStyle: 'solid',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  popArtMiniText: {
    fontSize: 11,
    fontFamily: Fonts.extraBold,
    letterSpacing: 0.6,
  },
  celebrationTitle: {
    fontSize: 17,
    fontFamily: Fonts.extraBold,
    color: '#065F46',
  },
  celebrationSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#047857',
    marginTop: 2,
  },
  resetCraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetCraftBtnText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  segmentedBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
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
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
  },
  stepTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.extraBold,
  },
  stepMeta: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    marginTop: 2,
  },
  stepInstruction: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 25,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#854D0E',
    lineHeight: 21,
    fontFamily: Fonts.semiBold,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 21,
    fontFamily: Fonts.semiBold,
  },
  stepActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  stepActionBtnText: {
    fontSize: 15,
    fontFamily: Fonts.extraBold,
  },
  resetFooterBtn: {
    alignSelf: 'center',
    padding: 10,
  },
  resetFooterText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.heading,
  },
  resetLink: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  materialsList: {
    gap: 8,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  materialNameChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  materialQuantity: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  optionalTag: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
  goToStepsBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  goToStepsBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    fontSize: 18,
    color: '#FF6B35',
    fontFamily: Fonts.extraBold,
  },
  factText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 23,
  },
  variationsList: {
    gap: 10,
  },
  variationItem: {
    flexDirection: 'row',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 12,
    alignItems: 'flex-start',
  },
  variationEmoji: {
    fontSize: 26,
  },
  variationTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  variationDesc: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 21,
  },
  troubleItem: {
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 4,
  },
  troubleQ: {
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  troubleA: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 21,
  },
});
