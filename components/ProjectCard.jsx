import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/Colors';
import { getProjectImage, resolveProjectEmoji } from '../constants/ProjectImages';
import { useTheme } from '../contexts/ThemeContext';
import { getStarterGuideRichContent } from '../db';
import AppIcon from './AppIcon';

export default function ProjectCard({ item, onPress }) {
  const { theme } = useTheme();

  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress';
  const richInfo = getStarterGuideRichContent(item.slug);
  const totalStepsCount = item.totalSteps || richInfo?.steps?.length || 5;
  const projectEmoji = resolveProjectEmoji(item.iconEmoji, item.slug);
  const outcomeImage = getProjectImage(item.slug);

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open DIY Guide: ${item.title}`}
    >
      {/* Final Outcome Image Banner */}
      {outcomeImage && (
        <View style={styles.imageBannerWrapper}>
          <Image
            source={outcomeImage}
            style={styles.outcomeImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.floatingEmojiBadge,
              { backgroundColor: item.accentColor || theme.primary },
            ]}
          >
            <Text style={styles.emoji}>{projectEmoji}</Text>
          </View>
          <View style={styles.outcomeTag}>
            <Text style={styles.outcomeTagText}>Final Outcome</Text>
          </View>
        </View>
      )}

      <View style={styles.mainRow}>
        {/* Fallback Emoji Box if custom guide has no image */}
        {!outcomeImage && (
          <View
            style={[
              styles.iconBox,
              { backgroundColor: item.accentColor || theme.primary },
            ]}
          >
            <Text style={styles.emoji}>{projectEmoji}</Text>
          </View>
        )}

        {/* Project Details */}
        <View style={styles.body}>
          <View style={styles.eyebrowRow}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {outcomeImage ? `${projectEmoji}  ${item.category}` : item.category}
            </Text>

            <View style={styles.statusGroup}>
              {item.isFavorite && (
                <AppIcon name="heart" size={14} color="#EF4444" />
              )}
              {isCompleted && (
                <View style={styles.doneBadge}>
                  <AppIcon name="check" size={11} color="#047857" />
                  <Text style={styles.doneBadgeText}>Done</Text>
                </View>
              )}
              {isInProgress && !isCompleted && (
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>In Progress</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>

          <Text
            style={[styles.summary, { color: theme.textMuted }]}
            numberOfLines={2}
          >
            {item.summary}
          </Text>
        </View>
      </View>

      {/* Clean Footer Row */}
      <View style={[styles.footerRow, { borderTopColor: theme.border }]}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppIcon name="clock-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {item.estimatedMinutes}m
            </Text>
          </View>
          <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
          <View style={styles.metaItem}>
            <AppIcon name="hammer-wrench" size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {totalStepsCount} steps
            </Text>
          </View>
          <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>
            Ages {item.minAge}–{item.maxAge}
          </Text>
        </View>

        <View style={[styles.openPill, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.openPillText, { color: theme.primary }]}>
            Open
          </Text>
          <AppIcon name="arrow-right" size={13} color={theme.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imageBannerWrapper: {
    width: '100%',
    height: 156,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  outcomeImage: {
    width: '100%',
    height: '100%',
  },
  floatingEmojiBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  outcomeTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  outcomeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  doneBadgeText: {
    color: '#047857',
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  progressBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  progressBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
    lineHeight: 22,
  },
  summary: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 19,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDot: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  metaText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  openPillText: {
    fontSize: 12,
    fontFamily: Fonts.extraBold,
  },
});
