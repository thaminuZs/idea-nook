// Offline bundled final outcome images downloaded from Wikimedia Commons
export const PROJECT_IMAGES = {
  'blast-off-paper-tube-rocket': require('../assets/projects/blast-off-paper-tube-rocket.jpg'),
  'fizzing-kitchen-volcano': require('../assets/projects/fizzing-kitchen-volcano.jpg'),
  'rainbow-sensory-calm-bottle': require('../assets/projects/rainbow-sensory-calm-bottle.jpg'),
  'pressed-leaf-animal-art': require('../assets/projects/pressed-leaf-animal-art.jpg'),
  'milk-carton-bird-feeder': require('../assets/projects/milk-carton-bird-feeder.jpg'),
  'jumping-origami-frog': require('../assets/projects/jumping-origami-frog.jpg'),
  'rubber-band-race-car': require('../assets/projects/rubber-band-race-car.jpg'),
  'cardboard-marble-labyrinth': require('../assets/projects/cardboard-marble-labyrinth.jpg'),
  'superhero-power-cuffs': require('../assets/projects/superhero-power-cuffs.jpg'),
  'dinosaur-salt-dough-fossils': require('../assets/projects/dinosaur-salt-dough-fossils.jpg'),
  'enchanted-fairy-garden-lantern': require('../assets/projects/enchanted-fairy-garden-lantern.jpg'),
  'kumihimo-friendship-bracelet': require('../assets/projects/kumihimo-friendship-bracelet.jpg'),
  'yarn-wrapped-nature-heart': require('../assets/projects/yarn-wrapped-nature-heart.jpg'),
  'felt-play-food-strawberries': require('../assets/projects/felt-play-food-strawberries.jpg'),
};

export function getProjectImage(slug) {
  return PROJECT_IMAGES[slug] || null;
}

const VECTOR_TO_EMOJI = {
  'rocket-launch': '🚀',
  'flask': '🌋',
  'shimmer': '🌈',
  'looks': '🌈',
  'leaf': '🍃',
  'bird': '🐦',
  'bug': '🐸',
  'star-four-points': '🐸',
  'car-sports': '🏎️',
  'gamepad-variant': '🕹️',
  'lightning-bolt': '⚡',
  'bone': '🦖',
  'lamp': '🧚',
  'butterfly': '🧚',
  'all-inclusive': '📿',
  'dots-horizontal-circle': '📿',
  'auto-fix': '💖',
  'fruit-cherries': '🍓',
  'palette': '🎨',
};

/**
 * Ensures DIY project icons always render as emojis even if an older SQLite row stored a vector icon name.
 */
export function resolveProjectEmoji(value, slug) {
  const SLUG_EMOJIS = {
    'blast-off-paper-tube-rocket': '🚀',
    'fizzing-kitchen-volcano': '🌋',
    'rainbow-sensory-calm-bottle': '🌈',
    'pressed-leaf-animal-art': '🍃',
    'milk-carton-bird-feeder': '🐦',
    'jumping-origami-frog': '🐸',
    'rubber-band-race-car': '🏎️',
    'cardboard-marble-labyrinth': '🕹️',
    'superhero-power-cuffs': '⚡',
    'dinosaur-salt-dough-fossils': '🦖',
    'enchanted-fairy-garden-lantern': '🧚',
    'kumihimo-friendship-bracelet': '📿',
    'yarn-wrapped-nature-heart': '💖',
    'felt-play-food-strawberries': '🍓',
  };
  if (slug && SLUG_EMOJIS[slug]) {
    return SLUG_EMOJIS[slug];
  }
  if (!value) return '🎨';
  const trimmed = String(value).trim();
  return VECTOR_TO_EMOJI[trimmed] || trimmed;
}
