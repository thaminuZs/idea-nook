import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/Colors';

const POP_BADGES = [
  {
    text: 'WOW!',
    bg: '#FFEB3B',
    textColor: '#0F172A',
    accent: '#FF3D00',
    rotate: '-10deg',
    offsetX: -68,
    offsetY: -54,
    delay: 0,
  },
  {
    text: 'SUPERB!',
    bg: '#00E5FF',
    textColor: '#0F172A',
    accent: '#FFEB3B',
    rotate: '8deg',
    offsetX: 66,
    offsetY: -48,
    delay: 90,
  },
  {
    text: 'GOOD JOB!',
    bg: '#FF5252',
    textColor: '#FFFFFF',
    accent: '#FFEB3B',
    rotate: '-3deg',
    offsetX: 0,
    offsetY: 0,
    isMain: true,
    delay: 160,
  },
  {
    text: 'EXCELLENT!',
    bg: '#69F0AE',
    textColor: '#0F172A',
    accent: '#FFFFFF',
    rotate: '5deg',
    offsetX: 0,
    offsetY: 56,
    delay: 240,
  },
];

const SPARKS = [
  { symbol: '★', color: '#FFEB3B', x: -115, y: -15, rotate: '-18deg' },
  { symbol: '✦', color: '#FF4081', x: 115, y: -10, rotate: '15deg' },
  { symbol: '⚡', color: '#00E5FF', x: -95, y: 50, rotate: '-12deg' },
  { symbol: '★', color: '#FF5252', x: 100, y: 48, rotate: '22deg' },
];

export default function PopArtCelebration({ visible, onFinish }) {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const badgeScales = useRef(POP_BADGES.map(() => new Animated.Value(0))).current;
  const sparkAnim = useRef(new Animated.Value(0)).current;
  const mainPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      containerOpacity.setValue(0);
      badgeScales.forEach((v) => v.setValue(0));
      sparkAnim.setValue(0);
      mainPulse.setValue(1);
      return;
    }

    containerOpacity.setValue(1);
    badgeScales.forEach((v) => v.setValue(0));
    sparkAnim.setValue(0);
    mainPulse.setValue(1);

    const popInAnimations = POP_BADGES.map((badge, index) =>
      Animated.sequence([
        Animated.delay(badge.delay),
        Animated.spring(badgeScales[index], {
          toValue: 1,
          friction: 4.5,
          tension: 140,
          useNativeDriver: true,
        }),
      ])
    );

    const sparkAnimation = Animated.sequence([
      Animated.delay(120),
      Animated.spring(sparkAnim, {
        toValue: 1,
        friction: 5,
        tension: 110,
        useNativeDriver: true,
      }),
    ]);

    const pulseAnimation = Animated.sequence([
      Animated.delay(420),
      Animated.timing(mainPulse, {
        toValue: 1.08,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(mainPulse, {
        toValue: 1,
        duration: 180,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const exitAnimation = Animated.sequence([
      Animated.delay(2200),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const composite = Animated.parallel([
      ...popInAnimations,
      sparkAnimation,
      pulseAnimation,
      exitAnimation,
    ]);

    composite.start(({ finished }) => {
      if (finished && onFinish) {
        onFinish();
      }
    });

    return () => {
      composite.stop();
    };
  }, [visible, badgeScales, containerOpacity, mainPulse, onFinish, sparkAnim]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.overlay, { opacity: containerOpacity }]}
      pointerEvents="box-none"
    >
      <Pressable style={styles.clusterBox} onPress={onFinish}>
        {/* Comic Action Sparks */}
        {SPARKS.map((spark, idx) => {
          const translateX = sparkAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, spark.x],
          });
          const translateY = sparkAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, spark.y],
          });
          return (
            <Animated.View
              key={idx}
              style={[
                styles.sparkItem,
                {
                  transform: [
                    { translateX },
                    { translateY },
                    { scale: sparkAnim },
                    { rotate: spark.rotate },
                  ],
                },
              ]}
            >
              <Text style={[styles.sparkText, { color: spark.color }]}>
                {spark.symbol}
              </Text>
            </Animated.View>
          );
        })}

        {/* Pop-Art Stickers */}
        {POP_BADGES.map((badge, index) => {
          const scale = badge.isMain
            ? Animated.multiply(badgeScales[index], mainPulse)
            : badgeScales[index];

          return (
            <Animated.View
              key={badge.text}
              style={[
                styles.stickerPositioner,
                {
                  transform: [
                    { translateX: badge.offsetX },
                    { translateY: badge.offsetY },
                    { scale },
                    { rotate: badge.rotate },
                  ],
                  zIndex: badge.isMain ? 10 : 5 + index,
                },
              ]}
            >
              {/* Hard Pop-Art Comic Offset Shadow */}
              <View
                style={[
                  styles.comicShadow,
                  badge.isMain ? styles.comicShadowMain : styles.comicShadowSmall,
                ]}
              />

              {/* Halftone / Accent Backplate */}
              <View
                style={[
                  styles.accentPlate,
                  { backgroundColor: badge.accent },
                  badge.isMain ? styles.badgeMain : styles.badgeSmall,
                ]}
              />

              {/* Main Comic Burst Face */}
              <View
                style={[
                  styles.comicFace,
                  { backgroundColor: badge.bg },
                  badge.isMain ? styles.badgeMain : styles.badgeSmall,
                ]}
              >
                <View style={styles.comicDotsRow}>
                  <View style={styles.comicDot} />
                  <View style={styles.comicDot} />
                  <View style={styles.comicDot} />
                </View>
                <Text
                  style={[
                    badge.isMain ? styles.comicTextMain : styles.comicTextSmall,
                    { color: badge.textColor },
                  ]}
                >
                  {badge.text}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  clusterBox: {
    width: 280,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerPositioner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMain: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  badgeSmall: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 6,
  },
  comicShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: '#0F172A',
  },
  comicShadowMain: {
    borderRadius: 8,
  },
  comicShadowSmall: {
    borderRadius: 6,
  },
  accentPlate: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: 3,
    bottom: 3,
    borderWidth: 2.5,
    borderColor: '#0F172A',
    borderStyle: 'solid',
    transform: [{ rotate: '-2deg' }],
  },
  comicFace: {
    borderWidth: 3,
    borderColor: '#0F172A',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comicDotsRow: {
    position: 'absolute',
    top: 3,
    right: 5,
    flexDirection: 'row',
    gap: 2,
  },
  comicDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  comicTextMain: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  comicTextSmall: {
    fontSize: 14,
    fontFamily: Fonts.extraBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sparkItem: {
    position: 'absolute',
  },
  sparkText: {
    fontSize: 24,
    fontFamily: Fonts.extraBold,
    textShadowColor: '#0F172A',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
