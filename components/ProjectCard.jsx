import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import { getStarterGuideRichContent } from '../db';

export default function ProjectCard({ item, onPress }) {
  const { theme } = useTheme();

  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress';
  const richInfo = getStarterGuideRichContent(item.slug);
  const totalStepsCount = item.totalSteps || richInfo?.steps?.length || 5;

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
      <View style={styles.mainRow}>
        {/* Project Emoji Icon */}
        <View
          style={[
            styles.iconBox,
            { backgroundColor: item.accentColor || theme.primary },
          ]}
        >
          <Text style={styles.emoji}>{item.iconEmoji}</Text>
        </View>

        {/* Project Details */}
        <View style={styles.body}>
          <View style={styles.eyebrowRow}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {item.category}
            </Text>

            <View style={styles.statusGroup}>
              {item.isFavorite && <Text style={styles.favIcon}>❤️</Text>}
              {isCompleted && (
                <View style={styles.doneBadge}>
                  <Text style={styles.doneBadgeText}>✓ Done</Text>
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
        <Text style={[styles.metaText, { color: theme.textMuted }]}>
          ⏱️ {item.estimatedMinutes}m  •  🛠️ {totalStepsCount} steps  •  Ages {item.minAge}–{item.maxAge}
        </Text>

        <View style={[styles.openPill, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.openPillText, { color: theme.primary }]}>
            Open →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
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
    fontSize: 28,
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
  favIcon: {
    fontSize: 12,
  },
  doneBadge: {
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
  metaText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  openPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  openPillText: {
    fontSize: 12,
    fontFamily: Fonts.extraBold,
  },
});
