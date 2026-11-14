import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Maps any legacy emoji or project/avatar key to a verified MaterialCommunityIcons glyph name
 * so both new and existing SQLite records render crisp offline vector icons.
 */
const ICON_MAP = {
  // Project icons
  '🚀': 'rocket-launch',
  '🌋': 'flask',
  '🌈': 'shimmer',
  '🍃': 'leaf',
  '🐦': 'bird',
  '🐸': 'bug',
  '🏎️': 'car-sports',
  '🕹️': 'gamepad-variant',
  '⚡': 'lightning-bolt',
  '🦖': 'bone',
  '🧚': 'lamp',
  '📿': 'all-inclusive',
  '💖': 'auto-fix',
  '🍓': 'fruit-cherries',

  // Avatar & companion icons
  '🌟': 'star-four-points',
  '🎨': 'palette',
  '🦁': 'paw',
  '🦄': 'unicorn-variant',
  '🤖': 'robot',
  '🐼': 'panda',

  // Step & variation icons
  '📜': 'layers-triple',
  '🔺': 'send',
  '🛠️': 'hammer-wrench',
  '🔥': 'fire',
  '🍽️': 'tune-variant',
  '🥄': 'flask',
  '💥': 'flare',
  '🔍': 'magnify',
  '💧': 'water',
  '🧴': 'eyedropper',
  '✨': 'shimmer',
  '🔒': 'check',
  '🌬️': 'weather-sunny',
  '🧺': 'bag-personal',
  '📚': 'layers-triple',
  '🦊': 'paw',
  '🧼': 'water',
  '🪟': 'ruler-square',
  '🪵': 'pine-tree',
  '🪢': 'all-inclusive',
  '🌻': 'flower',
  '📄': 'layers-triple',
  '✖️': 'scissors-cutting',
  '🐾': 'paw',
  '〰️': 'pulse',
  '📏': 'ruler-square',
  '🛞': 'car-sports',
  '🔗': 'all-inclusive',
  '🏁': 'trophy',
  '✏️': 'pencil',
  '✂️': 'scissors-cutting',
  '🧱': 'layers-triple',
  '🕳️': 'compass-outline',
  '🏆': 'trophy',
  '☁️': 'shimmer',
  '🦸': 'shield-star',
  '🥣': 'flask',
  '🪨': 'bone',
  '🔎': 'magnify',
  '🌸': 'flower',
  '🖌️': 'palette',
  '🎀': 'heart',
  '⭕': 'compass-outline',
  '🧭': 'compass',
  '🔄': 'restart',
  '❤️': 'heart',
  '🧶': 'all-inclusive',
  '🔴': 'heart-circle',
  '🪡': 'needle',
  '🌿': 'leaf',
  '🛸': 'rocket-launch',
  '🧑‍🚀': 'account-circle',
  '🧵': 'needle',
  '❄️': 'shimmer',
  '🍋': 'flask',
  '🌌': 'star-four-points',
  '🐠': 'water',
  '☀️': 'weather-sunny',
  '🦋': 'flower',
  '🖍️': 'pencil',
  '🏡': 'pine-tree',
  '📓': 'pencil',
  '🍎': 'food-apple',
  '👑': 'trophy',
  '🦅': 'bird',
  '🌉': 'layers-triple',
  '⏱️': 'clock-outline',
  '🛡️': 'shield-star',
  '🐚': 'water',
  '☕': 'flask',
  '🌙': 'weather-night',
  '🎒': 'bag-personal',
  '⭐': 'star',
  '🚪': 'compass',
  '🍫': 'heart',
  '😊': 'star-circle',
  '📌': 'needle',
};

export function resolveIconName(rawName, fallback = 'star-four-points') {
  if (!rawName) return fallback;
  const trimmed = String(rawName).trim();
  if (ICON_MAP[trimmed]) {
    return ICON_MAP[trimmed].toLowerCase();
  }
  return trimmed.toLowerCase();
}

export default function AppIcon({
  name,
  size = 20,
  color = '#0F172A',
  style,
  fallback = 'star-four-points',
}) {
  const iconName = resolveIconName(name, fallback);
  return (
    <MaterialCommunityIcons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
