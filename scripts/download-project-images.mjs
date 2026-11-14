import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('d:/Projects/ideanook/assets/projects');
fs.mkdirSync(OUT_DIR, { recursive: true });

export const PROJECT_IMAGES = [
  {
    slug: 'blast-off-paper-tube-rocket',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toy_rocket.jpg?width=800',
  },
  {
    slug: 'fizzing-kitchen-volcano',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Volcano_Experiment.jpg?width=800',
  },
  {
    slug: 'rainbow-sensory-calm-bottle',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Glitter_nail_polish_bottle.jpg?width=800',
  },
  {
    slug: 'pressed-leaf-animal-art',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fallen_autumn_leaves.jpg?width=800',
  },
  {
    slug: 'milk-carton-bird-feeder',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bird_feeder_(Private_garden).jpg?width=800',
  },
  {
    slug: 'jumping-origami-frog',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/OrigamiFrog_09.jpg?width=800',
  },
  {
    slug: 'rubber-band-race-car',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mousetrap-powered_car_ARTech.jpg?width=800',
  },
  {
    slug: 'cardboard-marble-labyrinth',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maze_made_of_cardboard_-_1.jpg?width=800',
  },
  {
    slug: 'superhero-power-cuffs',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Electron_Boy_takes_out_Blackout_Boy_(14091800356).jpg?width=800',
  },
  {
    slug: 'dinosaur-salt-dough-fossils',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/09.16.2022_salt_dough_shell_fossils_(26).jpg?width=800',
  },
  {
    slug: 'enchanted-fairy-garden-lantern',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_Lantern_(made_with_paper).jpg?width=800',
  },
  {
    slug: 'kumihimo-friendship-bracelet',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kumihimo_5_b.jpg?width=800',
  },
  {
    slug: 'yarn-wrapped-nature-heart',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Colorful_Yarn.jpg?width=800',
  },
  {
    slug: 'felt-play-food-strawberries',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Strawberry_pincushion.jpg?width=800',
  },
];

async function downloadAll() {
  for (const item of PROJECT_IMAGES) {
    const dest = path.join(OUT_DIR, `${item.slug}.jpg`);
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'IdeaNookOfflineApp/1.0 (https://example.org; educational DIY app)',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${item.slug}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`Downloaded ${item.slug}.jpg (${buf.length} bytes)`);
  }
}

downloadAll().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
