// Offline bundled PNG illustrations from assets/projects/new-pngs/
export const PROJECT_IMAGES = {
  'blast-off-paper-tube-rocket': require('../assets/projects/new-pngs/blast-off-paper-rocket.png'),
  'fizzing-kitchen-volcano': require('../assets/projects/new-pngs/kitchen-volcano.png'),
  'rainbow-sensory-calm-bottle': require('../assets/projects/new-pngs/rainbow-jar.png'),
  'pressed-leaf-animal-art': require('../assets/projects/new-pngs/pressed-leaf-animal-art.png'),
  'milk-carton-bird-feeder': require('../assets/projects/new-pngs/bird-feeder.png'),
  'jumping-origami-frog': require('../assets/projects/new-pngs/origami-frog.png'),
  'rubber-band-race-car': require('../assets/projects/new-pngs/rubber-band-race-car.png'),
  'cardboard-marble-labyrinth': require('../assets/projects/new-pngs/marble-labyrinth.png'),
  'superhero-power-cuffs': require('../assets/projects/new-pngs/superhero-wrist-cuffs.png'),
  'dinosaur-salt-dough-fossils': require('../assets/projects/new-pngs/dinosaur-fossils.png'),
  'enchanted-fairy-garden-lantern': require('../assets/projects/new-pngs/fairy-jar-lantern.png'),
  'kumihimo-friendship-bracelet': require('../assets/projects/new-pngs/japanese-bracelet.png'),
  'yarn-wrapped-nature-heart': require('../assets/projects/new-pngs/yarn-wand.png'),
  'felt-play-food-strawberries': require('../assets/projects/new-pngs/felt-strawberries.png'),
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
