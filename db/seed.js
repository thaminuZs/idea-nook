import { insertGuideRecord } from './guidesRepository';

export const STARTER_GUIDES = [
  {
    slug: 'blast-off-paper-tube-rocket',
    title: 'Blast-Off Paper Tube Rocket',
    summary: 'Turn an empty cardboard paper tube into a colorful space rocket with flame streamers!',
    category: 'Paper Crafts',
    difficulty: 'easy',
    minAge: 5,
    maxAge: 9,
    estimatedMinutes: 20,
    adultSupervision: false,
    safetyNote: 'Use rounded kid-safe scissors when cutting paper shapes.',
    iconEmoji: '🚀',
    accentColor: '#FF7043',
    materials: [
      { name: 'Empty toilet paper or paper towel tube', quantity: '1 tube' },
      { name: 'Colored construction paper', quantity: '2 sheets' },
      { name: 'Red and orange tissue paper or paper strips', quantity: '4–6 strips' },
      { name: 'Glue stick or craft tape', quantity: '1' },
      { name: 'Kid-safe scissors', quantity: '1 pair' },
      { name: 'Markers or stickers', quantity: 'Any colors', isOptional: true },
    ],
    steps: [
      {
        title: 'Wrap the rocket body',
        instruction:
          'Cut a piece of construction paper tall enough to cover your cardboard tube. Wrap it around the tube and glue or tape the edge down flat.',
        tip: 'Place the tape along the seam so it looks super neat!',
        durationMinutes: 4,
      },
      {
        title: 'Make the cone nose',
        instruction:
          'Trace a circle (about the size of a small bowl) on paper, cut it out, and cut a line from the edge to the center. Overlap the edges into a cone and tape it together.',
        tip: 'Try a bright color like yellow or silver for the nose cone.',
        durationMinutes: 5,
      },
      {
        title: 'Attach the cone and fins',
        instruction:
          'Tape or glue the cone onto the top of your tube. Cut 3 small triangle fins from sturdy paper and tape them evenly around the bottom.',
        durationMinutes: 5,
      },
      {
        title: 'Add rocket flames',
        instruction:
          'Glue or tape red, orange, and yellow tissue paper strips inside the bottom opening of the tube so they dangle like rocket fire.',
        durationMinutes: 3,
      },
      {
        title: 'Decorate and launch!',
        instruction:
          'Draw porthole windows, stars, and your astronaut name with markers or stickers. Hold your rocket and count down: 3, 2, 1, blast off!',
        tip: 'You can even draw a tiny alien waving from the window.',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'fizzing-kitchen-volcano',
    title: 'Fizzing Kitchen Volcano',
    summary: 'Create a bubbly, colorful baking soda and vinegar eruption right on a kitchen tray.',
    category: 'Science Fun',
    difficulty: 'easy',
    minAge: 5,
    maxAge: 10,
    estimatedMinutes: 15,
    adultSupervision: true,
    safetyNote: 'Ask a grown-up to help set up on a tray and keep vinegar away from eyes.',
    iconEmoji: '🌋',
    accentColor: '#EF5350',
    materials: [
      { name: 'Small plastic cup or tall jar', quantity: '1' },
      { name: 'Baking tray or deep plate', quantity: '1' },
      { name: 'Baking soda', quantity: '2 tablespoons' },
      { name: 'White vinegar', quantity: '1/2 cup' },
      { name: 'Liquid dish soap', quantity: '1 squirt' },
      { name: 'Red or orange food coloring', quantity: '4–5 drops', isOptional: true },
    ],
    steps: [
      {
        title: 'Set up the volcano tray',
        instruction:
          'Place your empty cup right in the middle of a baking tray or big plate so all the lava stays inside the tray.',
        safetyWarning: 'Always build your volcano on a washable tray or outdoors.',
        durationMinutes: 2,
      },
      {
        title: 'Add the volcano powder',
        instruction: 'Spoon 2 tablespoons of baking soda into the bottom of the cup.',
        durationMinutes: 2,
      },
      {
        title: 'Mix in soap and color',
        instruction:
          'Add one small squirt of dish soap and a few drops of red or orange food coloring on top of the baking soda.',
        tip: 'Dish soap makes the lava extra foamy and bubbly!',
        durationMinutes: 2,
      },
      {
        title: 'Pour in the vinegar',
        instruction:
          'Slowly pour the vinegar into the cup and step back to watch the bubbly chemical reaction erupt over the sides!',
        safetyWarning: 'Do not lean your face directly over the cup while pouring.',
        durationMinutes: 4,
      },
      {
        title: 'Observe and experiment',
        instruction:
          'Watch how the bubbles slow down, then talk about why baking soda and vinegar make gas bubbles (carbon dioxide). Add a little more vinegar to see if any baking soda is left!',
        durationMinutes: 5,
      },
    ],
  },
  {
    slug: 'rainbow-sensory-calm-bottle',
    title: 'Rainbow Sensory Calm Jar',
    summary: 'Make a swirling glittery calm-down bottle that shimmers slowly when you shake it.',
    category: 'Sensory & Slime',
    difficulty: 'easy',
    minAge: 4,
    maxAge: 8,
    estimatedMinutes: 15,
    adultSupervision: true,
    safetyNote: 'Have a grown-up handle warm water and glue the bottle cap tightly shut.',
    iconEmoji: '🌈',
    accentColor: '#AB47BC',
    materials: [
      { name: 'Clear plastic water bottle with cap', quantity: '1' },
      { name: 'Warm tap water', quantity: 'About 1 cup' },
      { name: 'Clear school glue or glitter glue', quantity: '1/2 cup' },
      { name: 'Fine glitter or tiny sequins', quantity: '1–2 tablespoons' },
      { name: 'Food coloring', quantity: '1–2 drops', isOptional: true },
      { name: 'Strong tape or hot glue (for adult use)', quantity: 'To seal cap' },
    ],
    steps: [
      {
        title: 'Fill halfway with warm water',
        instruction:
          'Ask a grown-up to help pour warm water into the clear plastic bottle until it is about halfway full.',
        safetyWarning: 'Use warm tap water, never boiling water.',
        durationMinutes: 2,
      },
      {
        title: 'Add clear glue',
        instruction:
          'Squeeze the clear glue into the bottle, put the cap on loosely, and swirl gently so the glue mixes with the warm water.',
        tip: 'More glue makes the glitter float and fall even more slowly!',
        durationMinutes: 4,
      },
      {
        title: 'Sprinkle glitter and color',
        instruction:
          'Open the bottle, add your favorite glitter, sequins, and 1–2 drops of food coloring. Keep the color light so you can still see the sparkles.',
        durationMinutes: 3,
      },
      {
        title: 'Top off and seal tight',
        instruction:
          'Fill the rest of the bottle with water, leaving a small gap at the top for shaking. Have a grown-up glue or tape the cap tightly closed.',
        safetyWarning: 'Always let an adult seal the cap so it cannot leak or open.',
        durationMinutes: 3,
      },
      {
        title: 'Shake and breathe',
        instruction:
          'Give your bottle a big shake, set it down, and take slow deep breaths while watching all the sparkles drift to the bottom.',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'pressed-leaf-animal-art',
    title: 'Pressed Leaf Animal Art',
    summary: 'Go on a backyard leaf hunt and turn real leaves into owls, foxes, or butterflies!',
    category: 'Nature Crafts',
    difficulty: 'easy',
    minAge: 4,
    maxAge: 9,
    estimatedMinutes: 25,
    adultSupervision: false,
    safetyNote: 'Only pick up fallen leaves from the ground and wash hands afterward.',
    iconEmoji: '🍃',
    accentColor: '#66BB6A',
    materials: [
      { name: 'Fallen leaves in different shapes and sizes', quantity: '6–10 leaves' },
      { name: 'White or light construction paper', quantity: '1–2 sheets' },
      { name: 'Glue stick or liquid white glue', quantity: '1' },
      { name: 'Crayons or markers', quantity: 'A few colors' },
      { name: 'Heavy book and paper towels', quantity: '1 book', isOptional: true },
    ],
    steps: [
      {
        title: 'Collect fallen leaves',
        instruction:
          'Explore outside and gather dry leaves in lots of shapes—round ones for bodies, pointy ones for ears or wings, and tiny ones for tails.',
        tip: 'Flat, dry leaves are easiest to glue onto paper.',
        durationMinutes: 8,
      },
      {
        title: 'Flatten curly leaves',
        instruction:
          'If any leaves are curled up, place them between two paper towels under a heavy book for a few minutes to flatten them out.',
        durationMinutes: 5,
      },
      {
        title: 'Arrange your leaf creature',
        instruction:
          'Before gluing, lay your leaves on the paper like puzzle pieces to build an animal—such as an owl, fish, fox, or butterfly.',
        durationMinutes: 5,
      },
      {
        title: 'Glue the leaves down',
        instruction:
          'Gently spread glue on the back of one leaf at a time and press it onto the paper for 10 seconds so it sticks smoothly.',
        durationMinutes: 4,
      },
      {
        title: 'Draw faces and scenery',
        instruction:
          'Use markers or crayons to add eyes, beaks, whiskers, trees, or grass around your leaf animal!',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'milk-carton-bird-feeder',
    title: 'Milk Carton Bird Feeder',
    summary: 'Recycle an empty milk or juice carton into a cozy backyard feeder for neighborhood birds.',
    category: 'Recycled Art',
    difficulty: 'medium',
    minAge: 7,
    maxAge: 12,
    estimatedMinutes: 30,
    adultSupervision: true,
    safetyNote: 'Ask a grown-up to cut the window opening in the carton with scissors or a craft knife.',
    iconEmoji: '🐦',
    accentColor: '#29B6F6',
    materials: [
      { name: 'Clean, dry empty milk or juice carton', quantity: '1' },
      { name: 'Scissors', quantity: '1 pair' },
      { name: 'Wooden spoon, craft stick, or twig', quantity: '1' },
      { name: 'String or yarn', quantity: 'About 40 cm' },
      { name: 'Acrylic paint or weatherproof stickers', quantity: 'Optional', isOptional: true },
      { name: 'Birdseed', quantity: '1 cup' },
    ],
    steps: [
      {
        title: 'Wash and dry the carton',
        instruction:
          'Rinse the inside of your empty carton well with soap and water, then let it dry completely so birdseed stays fresh.',
        durationMinutes: 4,
      },
      {
        title: 'Cut a bird window',
        instruction:
          'Draw a rounded window rectangle about 4 cm above the bottom of the carton. Have a grown-up help cut out the window.',
        safetyWarning: 'Adult help needed for cutting sturdy carton cardboard.',
        durationMinutes: 6,
      },
      {
        title: 'Add a perch stick',
        instruction:
          'Poke a small hole just below the window and push a wooden spoon, pencil, or sturdy twig partway inside so birds have a place to stand.',
        durationMinutes: 4,
      },
      {
        title: 'Decorate the outside',
        instruction:
          'Paint the outside of the carton or decorate it with bright tape and stickers. Let paint dry before hanging.',
        tip: 'Leave the bottom tray unpainted inside where the birdseed sits.',
        durationMinutes: 8,
      },
      {
        title: 'Tie a hanging loop',
        instruction:
          'Poke a hole through the top flap of the carton, thread your string through, and tie a strong double knot.',
        durationMinutes: 4,
      },
      {
        title: 'Fill with birdseed and hang',
        instruction:
          'Scoop birdseed into the bottom of the carton and hang it on a sturdy tree branch where you can watch birds visit from a window!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'jumping-origami-frog',
    title: 'Jumping Origami Frog',
    summary: 'Fold a single square piece of paper into a springy frog that really hops when you tap its back!',
    category: 'Origami',
    difficulty: 'medium',
    minAge: 6,
    maxAge: 12,
    estimatedMinutes: 15,
    adultSupervision: false,
    safetyNote: 'Press creases firmly with your finger tip—no sharp tools needed!',
    iconEmoji: '🐸',
    accentColor: '#26A69A',
    materials: [
      { name: 'Square origami paper (green or any color)', quantity: '1 sheet (15x15 cm)' },
      { name: 'Markers for frog eyes and spots', quantity: '1–2 markers', isOptional: true },
    ],
    steps: [
      {
        title: 'Fold the paper in half',
        instruction:
          'Place your square paper flat on the table and fold it in half from left to right to make a neat rectangle. Crease well.',
        durationMinutes: 2,
      },
      {
        title: 'Make the top triangle X',
        instruction:
          'Fold the top-left corner down to the right edge and unfold. Then fold the top-right corner down to the left edge and unfold to make an X crease.',
        tip: 'Sharp creases help your frog jump higher!',
        durationMinutes: 3,
      },
      {
        title: 'Collapse into a triangle',
        instruction:
          'Push the sides of the X inward gently so the top half folds flat into a neat layered triangle at the top of your rectangle.',
        durationMinutes: 3,
      },
      {
        title: 'Fold the front legs and body',
        instruction:
          'Fold the two top triangle flaps outward slightly for front legs. Then fold the left and right edges of the bottom rectangle inward to the center line.',
        durationMinutes: 3,
      },
      {
        title: 'Fold the springy back legs',
        instruction:
          'Fold the bottom up toward the middle, then fold that bottom half back down halfway in a zig-zag (accordion) fold to make the frog’s springy back legs.',
        durationMinutes: 2,
      },
      {
        title: 'Draw eyes and hop!',
        instruction:
          'Flip your frog over, draw two big smiling eyes, press down gently on the back fold, and slide your finger off to watch it leap!',
        tip: 'Try racing two frogs across a table with a friend.',
        durationMinutes: 2,
      },
    ],
  },
];

/**
 * Seeds starter offline DIY guides once when no built-in guides exist yet.
 */
export async function seedInitialGuides(db) {
  const row = await db.getFirstAsync(
    'SELECT COUNT(*) AS count FROM guides WHERE is_custom = 0;'
  );

  if ((row?.count ?? 0) > 0) {
    return false;
  }

  await db.withTransactionAsync(async () => {
    for (const guide of STARTER_GUIDES) {
      await insertGuideRecord(db, guide, { isCustom: false });
    }
  });

  return true;
}
