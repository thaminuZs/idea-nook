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

const VIEW_TABS = [
  { id: 'full', label: '📖 Full Guide' },
  { id: 'focus', label: '🎯 Step Focus' },
  { id: 'materials', label: '🎒 Supplies' },
  { id: 'extras', label: '🧠 Facts & Ideas' },
];

export default function GuideDetailView({ guideId, initialGuide, onBack }) {
  const db = useSQLiteContext();
  const { theme, scheme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const numericId = Number(guideId || initialGuide?.id);

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('full'); // 'full' | 'focus' | 'materials' | 'extras'
  const [focusStepIndex, setFocusStepIndex] = useState(0);

  const isDark = scheme === 'dark';
  const cardBg = isDark ? '#1A1D24' : '#FFFFFF';
  const borderCol = isDark ? '#2D323E' : '#E2E8F0';
  const mutedText = isDark ? '#94A3B8' : '#64748B';
  const highlightBg = isDark ? '#2C1D18' : '#FFF7ED';
  const subtleBg = isDark ? '#242832' : '#F8FAFC';

  const loadGuide = useCallback(async () => {
    if (!numericId || Number.isNaN(numericId)) {
      setError('Invalid Project ID');
      setLoading(false);
      return;
    }

    try {
      let data = await getGuideById(db, numericId);

      // If materials or steps are missing in DB, run seed sync and re-fetch
      if (data && (data.materials.length === 0 || data.steps.length === 0)) {
        await seedInitialGuides(db);
        data = await getGuideById(db, numericId);
      }

      if (!data) {
        setError('Project not found');
      } else {
        setGuide(data);
        setError(null);

        const firstIncomplete = (data.steps || []).findIndex((s) => !s.isCompleted);
        if (firstIncomplete !== -1) {
          setFocusStepIndex(firstIncomplete);
        } else if (data.steps?.length > 0) {
          setFocusStepIndex(data.steps.length - 1);
        }
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
      const isNextComplete = !step.isCompleted;
      await toggleStepCompleted(db, guide.id, step.id);

      const refreshed = await getGuideById(db, guide.id);
      if (refreshed) {
        setGuide(refreshed);
        if (isNextComplete && focusStepIndex < refreshed.steps.length - 1) {
          setFocusStepIndex((idx) => idx + 1);
        }
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
          setFocusStepIndex(0);
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
        'Do you want to reset your step progress and start this project from Step 1?',
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
        <ActivityIndicator size="large" color="#FF7043" />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Opening DIY Project... 🚀
        </Text>
      </View>
    );
  }

  if (error || !guide) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorEmoji}>🔍</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Project Not Found</Text>
        <Text style={[styles.errorSubtitle, { color: mutedText }]}>
          {error || "We couldn't find the requested DIY project."}
        </Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back to All Projects</Text>
        </Pressable>
      </View>
    );
  }

  // Merge rich static content from STARTER_GUIDES (storyIntro, skills, funFacts, variations, troubleshooting, step emojis)
  const richContent = getStarterGuideRichContent(guide.slug) || {};
  const storyIntro = richContent.storyIntro || guide.summary;
  const skills = richContent.skills || ['✂️ Hands-On Crafting', '🎨 Creative Play', '🧠 Problem Solving'];
  const funFacts = richContent.funFacts || [];
  const variations = richContent.variations || [];
  const troubleshooting = richContent.troubleshooting || [];

  const materialsList = guide.materials || [];
  const stepsList = (guide.steps || []).map((step, index) => {
    const richStep = richContent.steps?.[index];
    return {
      ...step,
      emoji: richStep?.emoji || '🛠️',
    };
  });

  const checkedMaterialsCount = materialsList.filter((m) => m.isChecked).length;
  const currentStep = stepsList[focusStepIndex] || stepsList[0];
  const progressPercent =
    stepsList.length > 0
      ? Math.round((guide.completedSteps / stepsList.length) * 100)
      : 0;
  const isCompleted = guide.status === 'completed' || progressPercent === 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Sticky Navigation Header */}
      <View style={[styles.topBar, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Pressable onPress={onBack} style={styles.navBackBtn} hitSlop={10}>
          <Text style={styles.navBackArrow}>←</Text>
          <Text style={[styles.navBackText, { color: theme.text }]}>All Projects</Text>
        </Pressable>

        <View style={styles.topBarCenter}>
          <View style={[styles.categoryPill, { backgroundColor: '#FFF0EB' }]}>
            <Text style={styles.categoryPillText}>
              {guide.iconEmoji} {guide.category}
            </Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <Pressable
            onPress={handleToggleFav}
            style={styles.navIconBtn}
            hitSlop={10}
            accessibilityLabel="Toggle Favorite"
          >
            <Text style={styles.navFavEmoji}>{guide.isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
          <Pressable onPress={toggleTheme} style={styles.navIconBtn} hitSlop={10}>
            <Text style={styles.navThemeEmoji}>{scheme === 'light' ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Hero Overview Card */}
        <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.heroHeaderRow}>
            <View
              style={[
                styles.heroEmojiBox,
                { backgroundColor: guide.accentColor || '#FF7043' },
              ]}
            >
              <Text style={styles.heroEmoji}>{guide.iconEmoji}</Text>
            </View>

            <View style={styles.heroHeaderInfo}>
              <Text style={[styles.guideTitle, { color: theme.text }]}>
                {guide.title}
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>⏱️ {guide.estimatedMinutes} min</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>
                    🎯 Ages {guide.minAge}–{guide.maxAge}
                  </Text>
                </View>
                <View
                  style={[
                    styles.heroBadge,
                    guide.difficulty === 'easy'
                      ? styles.badgeEasy
                      : guide.difficulty === 'medium'
                      ? styles.badgeMed
                      : styles.badgeHard,
                  ]}
                >
                  <Text style={styles.heroBadgeText}>
                    {guide.difficulty.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>
                    {guide.genderTarget === 'boy'
                      ? '👦 Boys'
                      : guide.genderTarget === 'girl'
                      ? '👧 Girls'
                      : '🌟 Everyone'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rich Story Introduction */}
          <View style={[styles.storyBox, { backgroundColor: subtleBg }]}>
            <Text style={[styles.storyHeading, { color: theme.text }]}>
              ✨ About This Project
            </Text>
            <Text style={[styles.storyText, { color: theme.text }]}>
              {storyIntro}
            </Text>
          </View>

          {/* Skills You'll Practice */}
          <View style={styles.skillsContainer}>
            <Text style={[styles.skillsLabel, { color: mutedText }]}>
              SKILLS YOU WILL PRACTICE:
            </Text>
            <View style={styles.skillsRow}>
              {skills.map((skill, idx) => (
                <View key={idx} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Adult Supervision & Safety Banners */}
          {guide.adultSupervision && (
            <View style={styles.adultSupervisionBanner}>
              <Text style={styles.adultBannerIcon}>👨‍👩‍👧</Text>
              <Text style={styles.adultBannerText}>
                Adult Helper Recommended! Ask a parent or guardian to join you for this build.
              </Text>
            </View>
          )}

          {guide.safetyNote ? (
            <View style={styles.safetyBanner}>
              <Text style={styles.safetyBannerIcon}>⚠️</Text>
              <View style={styles.safetyBannerContent}>
                <Text style={styles.safetyBannerTitle}>Safety Reminder</Text>
                <Text style={styles.safetyBannerText}>{guide.safetyNote}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Progress & Stars Tracker Bar */}
        <View
          style={[
            styles.progressCard,
            { backgroundColor: highlightBg, borderColor: '#FFD7C2' },
          ]}
        >
          <View style={styles.progressHeaderRow}>
            <View>
              <Text style={[styles.progressTitle, { color: theme.text }]}>
                {isCompleted
                  ? 'Project Completed! 🏆'
                  : guide.completedSteps > 0
                  ? 'Crafting in Progress 🛠️'
                  : 'Ready to Build! 🚀'}
              </Text>
              <Text style={[styles.progressSubtitle, { color: mutedText }]}>
                {guide.completedSteps} of {stepsList.length} steps finished ({progressPercent}%) •{' '}
                {checkedMaterialsCount}/{materialsList.length} supplies checked
              </Text>
            </View>

            <View style={styles.starsBox}>
              <Text style={styles.starsText}>
                {isCompleted ? '⭐⭐⭐' : guide.completedSteps > 0 ? '⭐☆☆' : '☆☆☆'}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
                isCompleted && { backgroundColor: '#10B981' },
              ]}
            />
          </View>
        </View>

        {/* Celebration Card when 100% Complete */}
        {isCompleted && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationTitle}>🎉 Awesome Job, Master Crafter!</Text>
            <Text style={styles.celebrationSubtitle}>
              Way to go, {profile?.name || 'Builder'}! You finished all {stepsList.length} steps of{' '}
              {guide.title} and earned 3 Gold Stars! ⭐⭐⭐
            </Text>
            <View style={styles.celebrationActions}>
              <Pressable style={styles.resetCraftBtn} onPress={handleResetGuide}>
                <Text style={styles.resetCraftBtnText}>Build Again 🔄</Text>
              </Pressable>
              <Pressable style={styles.exploreMoreBtn} onPress={onBack}>
                <Text style={styles.exploreMoreBtnText}>More Projects 🚀</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Browse Mode Selector Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabSwitcher}
        >
          {VIEW_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[
                  styles.tabPill,
                  { backgroundColor: active ? '#FF7043' : cardBg, borderColor: active ? '#FF7043' : borderCol },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabPillText,
                    { color: active ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ============================================================ */}
        {/* SECTION 1: SUPPLIES & MATERIALS CHECKLIST */}
        {/* Shown in 'full' mode AND 'materials' mode */}
        {/* ============================================================ */}
        {(activeTab === 'full' || activeTab === 'materials') && (
          <View
            style={[
              styles.sectionContainer,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  🎒 Supplies & Materials ({checkedMaterialsCount}/{materialsList.length})
                </Text>
                <Text style={[styles.sectionSubheading, { color: mutedText }]}>
                  Tap each item as you gather your supplies before building
                </Text>
              </View>
              {checkedMaterialsCount > 0 && (
                <Pressable onPress={handleResetMaterials} style={styles.resetLinkBtn}>
                  <Text style={styles.resetLinkText}>Reset</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.materialsList}>
              {materialsList.map((item, idx) => (
                <Pressable
                  key={item.id || idx}
                  style={[
                    styles.materialRow,
                    item.isChecked && styles.materialRowChecked,
                    { borderColor: borderCol },
                  ]}
                  onPress={() => handleToggleMaterial(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.isChecked && styles.checkboxChecked,
                    ]}
                  >
                    {item.isChecked && <Text style={styles.checkboxCheckmark}>✓</Text>}
                  </View>

                  <View style={styles.materialTextContainer}>
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
                      <Text style={[styles.materialQuantity, { color: mutedText }]}>
                        Quantity: {item.quantity}
                      </Text>
                    )}
                  </View>

                  {item.isOptional ? (
                    <View style={styles.optionalPill}>
                      <Text style={styles.optionalPillText}>Optional</Text>
                    </View>
                  ) : (
                    <View style={styles.requiredPill}>
                      <Text style={styles.requiredPillText}>Needed</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 2A: STEP-BY-STEP FOCUS CAROUSEL */}
        {/* Shown when user selects 'focus' mode */}
        {/* ============================================================ */}
        {activeTab === 'focus' && currentStep && (
          <View style={styles.stepsSection}>
            {/* Step Numbers Bar */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stepDotsContainer}
            >
              {stepsList.map((step, idx) => {
                const isCurrent = idx === focusStepIndex;
                return (
                  <Pressable
                    key={step.id || idx}
                    style={[
                      styles.stepDot,
                      step.isCompleted && styles.stepDotCompleted,
                      isCurrent && styles.stepDotActive,
                    ]}
                    onPress={() => setFocusStepIndex(idx)}
                  >
                    <Text
                      style={[
                        styles.stepDotText,
                        (step.isCompleted || isCurrent) && styles.stepDotTextWhite,
                      ]}
                    >
                      {step.isCompleted ? '✓' : step.stepNumber}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View
              style={[
                styles.focusStepCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              <View style={styles.focusStepHeader}>
                <View style={styles.stepPillBadge}>
                  <Text style={styles.stepPillBadgeText}>
                    STEP {currentStep.stepNumber} OF {stepsList.length}
                  </Text>
                </View>
                {currentStep.durationMinutes && (
                  <Text style={[styles.stepDurationText, { color: mutedText }]}>
                    ⏱️ ~{currentStep.durationMinutes} min
                  </Text>
                )}
              </View>

              <View style={[styles.stepVisualBanner, { backgroundColor: subtleBg }]}>
                <Text style={styles.stepVisualEmoji}>{currentStep.emoji}</Text>
                <Text style={[styles.focusStepTitle, { color: theme.text }]}>
                  {currentStep.title}
                </Text>
              </View>

              <Text style={[styles.focusStepInstruction, { color: theme.text }]}>
                {currentStep.instruction}
              </Text>

              {currentStep.tip && (
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipHeading}>Pro Crafter Tip</Text>
                    <Text style={styles.tipText}>{currentStep.tip}</Text>
                  </View>
                </View>
              )}

              {currentStep.safetyWarning && (
                <View style={styles.stepWarningBox}>
                  <Text style={styles.stepWarningIcon}>⚠️</Text>
                  <View style={styles.stepWarningContent}>
                    <Text style={styles.stepWarningHeading}>Safety Check</Text>
                    <Text style={styles.stepWarningText}>
                      {currentStep.safetyWarning}
                    </Text>
                  </View>
                </View>
              )}

              <Pressable
                style={[
                  styles.stepCompleteButton,
                  currentStep.isCompleted
                    ? styles.stepCompletedBtnActive
                    : styles.stepCompletedBtnIncomplete,
                ]}
                onPress={() => handleToggleStep(currentStep)}
              >
                <Text style={styles.stepCompleteBtnText}>
                  {currentStep.isCompleted
                    ? '✓ Step Completed! (Tap to undo)'
                    : `Mark Step ${currentStep.stepNumber} Complete 🌟`}
                </Text>
              </Pressable>

              <View style={styles.stepNavControls}>
                <Pressable
                  style={[
                    styles.stepNavPrevBtn,
                    focusStepIndex === 0 && styles.stepNavBtnDisabled,
                  ]}
                  disabled={focusStepIndex === 0}
                  onPress={() => setFocusStepIndex((i) => Math.max(0, i - 1))}
                >
                  <Text
                    style={[
                      styles.stepNavPrevText,
                      focusStepIndex === 0 && styles.stepNavTextDisabled,
                    ]}
                  >
                    ← Previous Step
                  </Text>
                </Pressable>

                {focusStepIndex < stepsList.length - 1 ? (
                  <Pressable
                    style={styles.stepNavNextBtn}
                    onPress={() =>
                      setFocusStepIndex((i) => Math.min(stepsList.length - 1, i + 1))
                    }
                  >
                    <Text style={styles.stepNavNextText}>Next Step →</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.stepNavNextBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => setActiveTab('full')}
                  >
                    <Text style={styles.stepNavNextText}>View Full Guide 📖</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 2B: ALL STEP-BY-STEP INSTRUCTIONS (EXPANDED BROWSE VIEW) */}
        {/* Shown by default in 'full' mode */}
        {/* ============================================================ */}
        {activeTab === 'full' && (
          <View style={styles.stepsSection}>
            <View style={styles.sectionTitleBanner}>
              <View>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  🛠️ Step-by-Step Instructions ({stepsList.length} Steps)
                </Text>
                <Text style={[styles.sectionSubheading, { color: mutedText }]}>
                  Follow each step in order and tap Complete as you build!
                </Text>
              </View>
              <Pressable
                style={styles.focusModeSwitchBtn}
                onPress={() => setActiveTab('focus')}
              >
                <Text style={styles.focusModeSwitchText}>🎯 Focus Mode</Text>
              </Pressable>
            </View>

            <View style={styles.allStepsList}>
              {stepsList.map((step, idx) => (
                <View
                  key={step.id || idx}
                  style={[
                    styles.allStepItemCard,
                    { backgroundColor: cardBg, borderColor: borderCol },
                    step.isCompleted && styles.allStepItemCardDone,
                  ]}
                >
                  {/* Step Top Row */}
                  <View style={styles.allStepTopBar}>
                    <View style={styles.stepNumberPill}>
                      <Text style={styles.stepNumberPillText}>
                        STEP {step.stepNumber} OF {stepsList.length}
                      </Text>
                    </View>
                    {step.durationMinutes ? (
                      <Text style={[styles.allStepMeta, { color: mutedText }]}>
                        ⏱️ {step.durationMinutes} min
                      </Text>
                    ) : null}
                  </View>

                  {/* Step Title & Emoji */}
                  <View style={styles.allStepItemHeader}>
                    <View
                      style={[
                        styles.stepEmojiCircle,
                        { backgroundColor: subtleBg },
                      ]}
                    >
                      <Text style={styles.stepEmojiIcon}>{step.emoji}</Text>
                    </View>
                    <Text style={[styles.allStepTitle, { color: theme.text }]}>
                      {step.title}
                    </Text>
                  </View>

                  {/* Detailed Step Instruction */}
                  <Text style={[styles.allStepInstruction, { color: theme.text }]}>
                    {step.instruction}
                  </Text>

                  {/* Tip Callout */}
                  {step.tip && (
                    <View style={styles.tipBox}>
                      <Text style={styles.tipIcon}>💡</Text>
                      <View style={styles.tipContent}>
                        <Text style={styles.tipHeading}>Pro Crafter Tip</Text>
                        <Text style={styles.tipText}>{step.tip}</Text>
                      </View>
                    </View>
                  )}

                  {/* Safety Warning Callout */}
                  {step.safetyWarning && (
                    <View style={styles.stepWarningBox}>
                      <Text style={styles.stepWarningIcon}>⚠️</Text>
                      <View style={styles.stepWarningContent}>
                        <Text style={styles.stepWarningHeading}>Be Careful</Text>
                        <Text style={styles.stepWarningText}>
                          {step.safetyWarning}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Interactive Complete Button per Step */}
                  <Pressable
                    style={[
                      styles.inlineStepBtn,
                      step.isCompleted
                        ? styles.inlineStepBtnDone
                        : styles.inlineStepBtnTodo,
                    ]}
                    onPress={() => handleToggleStep(step)}
                  >
                    <Text
                      style={[
                        styles.inlineStepBtnText,
                        step.isCompleted
                          ? styles.inlineStepBtnTextDone
                          : styles.inlineStepBtnTextTodo,
                      ]}
                    >
                      {step.isCompleted
                        ? `✓ Step ${step.stepNumber} Completed!`
                        : `○ Mark Step ${step.stepNumber} Done`}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: FUN FACTS, CREATIVE VARIATIONS & TROUBLESHOOTING */}
        {/* Shown in 'full' mode AND 'extras' mode */}
        {/* ============================================================ */}
        {(activeTab === 'full' || activeTab === 'extras') && (
          <View style={styles.extrasSection}>
            {/* Fun Facts & Science Secrets */}
            {funFacts.length > 0 && (
              <View
                style={[
                  styles.sectionContainer,
                  {
                    backgroundColor: isDark ? '#1A2433' : '#F0F9FF',
                    borderColor: '#BAE6FD',
                  },
                ]}
              >
                <Text style={[styles.sectionHeading, { color: isDark ? '#E0F2FE' : '#0369A1' }]}>
                  🧠 Did You Know? (Fun Facts!)
                </Text>
                <View style={styles.factsList}>
                  {funFacts.map((fact, idx) => (
                    <View key={idx} style={styles.factItem}>
                      <Text style={styles.factBullet}>🌟</Text>
                      <Text
                        style={[
                          styles.factText,
                          { color: isDark ? '#E2E8F0' : '#0F172A' },
                        ]}
                      >
                        {fact}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Creative Variations & Level-Up Ideas */}
            {variations.length > 0 && (
              <View
                style={[
                  styles.sectionContainer,
                  { backgroundColor: cardBg, borderColor: borderCol },
                ]}
              >
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  🎨 Creative Remix & Level-Up Ideas
                </Text>
                <Text style={[styles.sectionSubheading, { color: mutedText }]}>
                  Finished the main build? Try these awesome ways to customize your project:
                </Text>

                <View style={styles.variationsList}>
                  {variations.map((v, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.variationCard,
                        { backgroundColor: subtleBg, borderColor: borderCol },
                      ]}
                    >
                      <Text style={styles.variationEmoji}>{v.emoji}</Text>
                      <View style={styles.variationBody}>
                        <Text style={[styles.variationTitle, { color: theme.text }]}>
                          {v.title}
                        </Text>
                        <Text style={[styles.variationDesc, { color: mutedText }]}>
                          {v.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Troubleshooting Tips */}
            {troubleshooting.length > 0 && (
              <View
                style={[
                  styles.sectionContainer,
                  { backgroundColor: cardBg, borderColor: borderCol },
                ]}
              >
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  🔧 Crafter Fix-It Tips
                </Text>
                <View style={styles.troubleshootingList}>
                  {troubleshooting.map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.troubleCard,
                        { backgroundColor: subtleBg, borderColor: borderCol },
                      ]}
                    >
                      <Text style={[styles.troubleQ, { color: theme.text }]}>
                        ❓ “{item.question}”
                      </Text>
                      <Text style={[styles.troubleA, { color: mutedText }]}>
                        ✅ <Text style={{ fontWeight: '700' }}>Fix:</Text> {item.answer}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <Pressable onPress={onBack} style={styles.bottomBackBtn}>
            <Text style={styles.bottomBackBtnText}>← Back to All DIY Projects</Text>
          </Pressable>
          <Pressable onPress={handleResetGuide} style={styles.resetFooterBtn}>
            <Text style={styles.resetFooterText}>🔄 Reset Steps & Stars</Text>
          </Pressable>
        </View>
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
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF7043',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navBackArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D84315',
    marginRight: 6,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D84315',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D84315',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconBtn: {
    padding: 4,
  },
  navFavEmoji: {
    fontSize: 22,
  },
  navThemeEmoji: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  heroEmojiBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 36,
  },
  heroHeaderInfo: {
    flex: 1,
    gap: 8,
  },
  guideTitle: {
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeEasy: {
    backgroundColor: '#DEF7EC',
  },
  badgeMed: {
    backgroundColor: '#FEF08A',
  },
  badgeHard: {
    backgroundColor: '#FEE2E2',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  storyBox: {
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  storyHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  storyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  skillsContainer: {
    gap: 6,
  },
  skillsLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  skillPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  adultSupervisionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    gap: 10,
  },
  adultBannerIcon: {
    fontSize: 20,
  },
  adultBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
  },
  safetyBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    gap: 10,
  },
  safetyBannerIcon: {
    fontSize: 20,
  },
  safetyBannerContent: {
    flex: 1,
  },
  safetyBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  safetyBannerText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 17,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  starsBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  starsText: {
    fontSize: 18,
    letterSpacing: 2,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7043',
    borderRadius: 5,
  },
  celebrationCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    gap: 8,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
  },
  celebrationSubtitle: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 19,
  },
  celebrationActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  resetCraftBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  resetCraftBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  exploreMoreBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  exploreMoreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabSwitcher: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionContainer: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitleBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubheading: {
    fontSize: 12,
    marginTop: 2,
  },
  focusModeSwitchBtn: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  focusModeSwitchText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D84315',
  },
  resetLinkBtn: {
    padding: 4,
  },
  resetLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7043',
  },
  materialsList: {
    gap: 8,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  materialRowChecked: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10B981',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  materialTextContainer: {
    flex: 1,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
  },
  materialNameChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  materialQuantity: {
    fontSize: 12,
    marginTop: 2,
  },
  optionalPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  optionalPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  requiredPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  requiredPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
  },
  stepsSection: {
    gap: 14,
  },
  stepDotsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepDotActive: {
    borderColor: '#FF7043',
    backgroundColor: '#FF7043',
  },
  stepDotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  stepDotTextWhite: {
    color: '#FFFFFF',
  },
  focusStepCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  focusStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepPillBadge: {
    backgroundColor: '#FFEBE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stepPillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D84315',
  },
  stepDurationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepVisualBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  stepVisualEmoji: {
    fontSize: 32,
  },
  focusStepTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  focusStepInstruction: {
    fontSize: 15,
    lineHeight: 23,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
    gap: 10,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipContent: {
    flex: 1,
  },
  tipHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#713F12',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: '#854D0E',
    lineHeight: 18,
  },
  stepWarningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    gap: 10,
  },
  stepWarningIcon: {
    fontSize: 20,
  },
  stepWarningContent: {
    flex: 1,
  },
  stepWarningHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 2,
  },
  stepWarningText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  stepCompleteButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  stepCompletedBtnIncomplete: {
    backgroundColor: '#FF7043',
  },
  stepCompletedBtnActive: {
    backgroundColor: '#10B981',
  },
  stepCompleteBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  stepNavControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  stepNavPrevBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  stepNavBtnDisabled: {
    opacity: 0.4,
  },
  stepNavPrevText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stepNavTextDisabled: {
    color: '#94A3B8',
  },
  stepNavNextBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FF7043',
    alignItems: 'center',
  },
  stepNavNextText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  allStepsList: {
    gap: 14,
  },
  allStepItemCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  allStepItemCardDone: {
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  allStepTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepNumberPill: {
    backgroundColor: '#FFEBE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepNumberPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D84315',
  },
  allStepItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepEmojiIcon: {
    fontSize: 24,
  },
  allStepTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  allStepMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  allStepInstruction: {
    fontSize: 14,
    lineHeight: 22,
  },
  inlineStepBtn: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  inlineStepBtnTodo: {
    backgroundColor: '#FFF0EB',
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  inlineStepBtnDone: {
    backgroundColor: '#10B981',
  },
  inlineStepBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  inlineStepBtnTextTodo: {
    color: '#D84315',
  },
  inlineStepBtnTextDone: {
    color: '#FFFFFF',
  },
  extrasSection: {
    gap: 16,
  },
  factsList: {
    gap: 10,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  factBullet: {
    fontSize: 16,
    marginTop: 1,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  variationsList: {
    gap: 10,
  },
  variationCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  variationEmoji: {
    fontSize: 28,
  },
  variationBody: {
    flex: 1,
    gap: 3,
  },
  variationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  variationDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  troubleshootingList: {
    gap: 10,
  },
  troubleCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  troubleQ: {
    fontSize: 14,
    fontWeight: '700',
  },
  troubleA: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerRow: {
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  bottomBackBtn: {
    backgroundColor: '#FF7043',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  bottomBackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  resetFooterBtn: {
    padding: 8,
  },
  resetFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
