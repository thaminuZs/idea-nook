import { insertGuideRecord } from './guidesRepository';

export const STARTER_GUIDES = [
  // ==========================================
  // UNISEX / ALL-KIDS CRAFTS
  // ==========================================
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
    genderTarget: 'all',
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
    genderTarget: 'all',
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
    genderTarget: 'all',
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
    genderTarget: 'all',
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
    genderTarget: 'all',
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
    genderTarget: 'all',
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

  // ==========================================
  // SAMPLE PROJECTS FOR BOYS (STEM & ACTION)
  // ==========================================
  {
    slug: 'rubber-band-race-car',
    title: 'Rubber Band Race Car',
    summary: 'Engineer a zooming speed car using cardboard, bottle caps, skewers, and rubber band kinetic power!',
    category: 'STEM & Building',
    difficulty: 'medium',
    minAge: 6,
    maxAge: 12,
    estimatedMinutes: 25,
    adultSupervision: true,
    safetyNote: 'Ask a grown-up to help punch center holes in the bottle cap wheels.',
    iconEmoji: '🏎️',
    accentColor: '#3B82F6',
    genderTarget: 'boy',
    materials: [
      { name: 'Small cardboard box (like a tea or snack box)', quantity: '1 box' },
      { name: 'Plastic bottle caps for wheels', quantity: '4 caps' },
      { name: 'Wooden skewers for axles', quantity: '2 skewers' },
      { name: 'Plastic drinking straws', quantity: '2 straws' },
      { name: 'Strong rubber bands', quantity: '1–2 bands' },
      { name: 'Craft tape or strong glue', quantity: '1' },
      { name: 'Scissors', quantity: '1 pair' },
    ],
    steps: [
      {
        title: 'Create the axle sleeves',
        instruction:
          'Cut two pieces of plastic straw slightly wider than your cardboard box. Tape or glue one straw across the front bottom and one across the back bottom of the box.',
        tip: 'Make sure the straws are parallel so the car drives straight!',
        durationMinutes: 5,
      },
      {
        title: 'Insert axles and wheels',
        instruction:
          'Slide a wooden skewer through each straw. Have an adult poke a hole in the center of each bottle cap, then push a cap onto each skewer end to make 4 free-spinning wheels.',
        safetyWarning: 'Adult help needed to pierce holes in plastic caps.',
        durationMinutes: 6,
      },
      {
        title: 'Attach the rubber band engine',
        instruction:
          'Securely tie or loop one end of a rubber band around the middle of the back axle. Tape or anchor the other end to the front inside wall of the car.',
        tip: 'Double up rubber bands for extra speed!',
        durationMinutes: 5,
      },
      {
        title: 'Decorate your race car',
        instruction:
          'Use markers to draw a racing number, flame decals, headlights, and a spoiler wing on the back of the car.',
        durationMinutes: 5,
      },
      {
        title: 'Wind up and race!',
        instruction:
          'Roll the car backward along the floor to wind the rubber band around the rear axle. Set it on a smooth floor, release, and watch it zoom forward on kinetic energy!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'cardboard-marble-labyrinth',
    title: 'Cardboard Marble Labyrinth',
    summary: 'Design a tilting maze game inside a shoebox lid with cardboard walls, tricky dead-ends, and trapdoors!',
    category: 'STEM & Building',
    difficulty: 'medium',
    minAge: 6,
    maxAge: 13,
    estimatedMinutes: 30,
    adultSupervision: false,
    safetyNote: 'Work on a flat table and keep marble away from toddlers.',
    iconEmoji: '🕹️',
    accentColor: '#F59E0B',
    genderTarget: 'boy',
    materials: [
      { name: 'Shoebox lid or shallow cardboard box', quantity: '1 lid' },
      { name: 'Corrugated cardboard strips (about 2 cm wide)', quantity: '8–12 strips' },
      { name: 'Glass marble or small wooden ball', quantity: '1 marble' },
      { name: 'White craft glue or glue stick', quantity: '1' },
      { name: 'Ruler and pencil', quantity: '1 each' },
      { name: 'Colored markers for Start and Finish', quantity: '2–3 colors' },
    ],
    steps: [
      {
        title: 'Map your maze layout',
        instruction:
          'Use a pencil to sketch a maze inside the shoebox lid. Mark a "START" corner, winding corridors, a few dead ends, and a "FINISH" star at the opposite corner.',
        tip: 'Make sure paths are wide enough for your marble to roll through smoothly.',
        durationMinutes: 6,
      },
      {
        title: 'Cut cardboard wall strips',
        instruction:
          'Measure and cut cardboard strips to match each path length drawn on your maze map.',
        durationMinutes: 6,
      },
      {
        title: 'Glue walls into place',
        instruction:
          'Apply a line of glue along the edge of each cardboard strip and press it upright along the drawn pencil lines. Let glue dry for 5 minutes.',
        durationMinutes: 8,
      },
      {
        title: 'Add obstacle trapdoors (optional)',
        instruction:
          'For an extra challenge, trace a coin in 1 or 2 dead-end corners and cut small trapdoor holes where the marble can fall through if you take a wrong turn!',
        durationMinutes: 5,
      },
      {
        title: 'Tilt and beat the clock!',
        instruction:
          'Drop your marble at Start, hold the lid with both hands, and tilt gently left, right, up, and down to steer the marble to Finish without falling into trapdoors!',
        durationMinutes: 5,
      },
    ],
  },
  {
    slug: 'superhero-power-cuffs',
    title: 'Superhero Power Wrist Cuffs',
    summary: 'Transform cardboard paper tubes into wearable superhero gauntlets with lightning bolts and stars!',
    category: 'Wearable Crafts',
    difficulty: 'easy',
    minAge: 4,
    maxAge: 9,
    estimatedMinutes: 15,
    adultSupervision: false,
    safetyNote: 'Snip the corners of the cardboard slightly so they are rounded and comfortable.',
    iconEmoji: '⚡',
    accentColor: '#EF4444',
    genderTarget: 'boy',
    materials: [
      { name: 'Empty toilet paper rolls', quantity: '2 rolls' },
      { name: 'Colored construction paper (red, blue, gold)', quantity: '2 sheets' },
      { name: 'Kid-safe scissors', quantity: '1 pair' },
      { name: 'Glue stick or metallic tape', quantity: '1' },
      { name: 'Markers or star stickers', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        title: 'Cut the wrist slit',
        instruction:
          'Cut a straight line lengthwise all the way down each toilet paper roll so it can easily expand and slip over your wrist.',
        durationMinutes: 3,
      },
      {
        title: 'Smooth the corners',
        instruction:
          'Snip a tiny curve off each corner with scissors so the cuffs feel soft and won’t poke your arms.',
        durationMinutes: 2,
      },
      {
        title: 'Wrap in superhero colors',
        instruction:
          'Wrap each tube in bright red, blue, or shiny silver/gold paper or tape, folding excess edges neatly inside the slit.',
        durationMinutes: 4,
      },
      {
        title: 'Design power emblems',
        instruction:
          'Cut lightning bolts, stars, shields, or your hero initials from contrasting yellow or gold paper.',
        tip: 'Add star stickers or shiny foil for extra laser shield energy!',
        durationMinutes: 3,
      },
      {
        title: 'Snap on and defend!',
        instruction:
          'Glue your custom power emblem to the front of each cuff. Slip them onto both wrists, strike a heroic superhero pose, and save the day!',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'dinosaur-salt-dough-fossils',
    title: 'Dinosaur Salt Dough Fossils',
    summary: 'Bake realistic prehistoric stone fossils by pressing toy dinosaur footprints into homemade salt dough!',
    category: 'Science Fun',
    difficulty: 'easy',
    minAge: 4,
    maxAge: 11,
    estimatedMinutes: 20,
    adultSupervision: true,
    safetyNote: 'Adult supervision needed for baking. Salt dough is for craft play, not for eating.',
    iconEmoji: '🦖',
    accentColor: '#10B981',
    genderTarget: 'boy',
    materials: [
      { name: 'All-purpose flour', quantity: '2 cups' },
      { name: 'Table salt', quantity: '1 cup' },
      { name: 'Warm water', quantity: '3/4 to 1 cup' },
      { name: 'Plastic toy dinosaurs with textured feet', quantity: '2–4 toys' },
      { name: 'Baking sheet lined with parchment paper', quantity: '1 sheet' },
      { name: 'Washable brown or black paint', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        title: 'Mix the fossil dough',
        instruction:
          'In a large bowl, mix the flour and salt. Slowly add warm water while stirring with your hands until it forms a soft, non-sticky dough ball.',
        tip: 'If too sticky add a pinch of flour; if too crumbly add a few drops of water.',
        durationMinutes: 5,
      },
      {
        title: 'Shape prehistoric rock discs',
        instruction:
          'Pinch off golf-ball sized pieces of dough and press them flat with your palm onto the baking sheet to make 1 cm thick stone discs.',
        durationMinutes: 4,
      },
      {
        title: 'Stamp dinosaur tracks',
        instruction:
          'Firmly press dinosaur feet, tails, or body scales into each dough disc, then carefully lift the toy straight up to leave a crisp fossil impression.',
        durationMinutes: 5,
      },
      {
        title: 'Bake or air dry to stone',
        instruction:
          'Have an adult bake the fossils in a low oven at 100°C (200°F) for 2 to 3 hours until rock hard, or let them air dry on a counter for 3 days.',
        safetyWarning: 'Let fossils cool completely before touching.',
        durationMinutes: 3,
      },
      {
        title: 'Dig and discover!',
        instruction:
          'Brush crevices with a touch of brown paint to make the ancient footprints pop. Bury your fossils in a sandbox or kinetic sand bin for an epic paleontologist dig!',
        durationMinutes: 3,
      },
    ],
  },

  // ==========================================
  // SAMPLE PROJECTS FOR GIRLS (CREATIVE & MAGICAL)
  // ==========================================
  {
    slug: 'enchanted-fairy-garden-lantern',
    title: 'Enchanted Fairy Jar Lantern',
    summary: 'Craft a glowing stained-glass fairy nightlight using a clean glass jar, pastel tissue paper, and fairy silhouettes!',
    category: 'Room Decor',
    difficulty: 'easy',
    minAge: 5,
    maxAge: 12,
    estimatedMinutes: 20,
    adultSupervision: true,
    safetyNote: 'Use battery-operated LED tea lights only. Never use real burning candles with tissue paper.',
    iconEmoji: '🧚',
    accentColor: '#EC4899',
    genderTarget: 'girl',
    materials: [
      { name: 'Clean glass or clear plastic jar (jam or mason jar)', quantity: '1 jar' },
      { name: 'Pastel tissue paper (pink, lavender, light blue)', quantity: '2–3 sheets' },
      { name: 'Mod Podge or craft glue mixed with a little water', quantity: '1/4 cup' },
      { name: 'Fairy, butterfly, or mushroom paper silhouette', quantity: '1 cutout' },
      { name: 'Fine craft glitter', quantity: '1 teaspoon', isOptional: true },
      { name: 'Battery-operated LED tea light', quantity: '1 light' },
      { name: 'Ribbon or rustic twine', quantity: '30 cm' },
    ],
    steps: [
      {
        title: 'Attach the fairy silhouette',
        instruction:
          'Paint a little glue on the outside glass of the jar and press your dark paper fairy or butterfly cutout flat against the glass.',
        durationMinutes: 3,
      },
      {
        title: 'Tear tissue mosaic pieces',
        instruction:
          'Tear colorful pastel tissue paper into small 2 cm squares and strips for a magical stained-glass mosaic.',
        durationMinutes: 4,
      },
      {
        title: 'Decoupage around the jar',
        instruction:
          'Brush glue over small sections of the jar and gently press tissue pieces down, overlapping colors so pink, purple, and blue blend together.',
        tip: 'Pat gently with your fingers rather than rubbing so wet tissue doesn’t tear.',
        durationMinutes: 6,
      },
      {
        title: 'Seal with enchanted sparkle',
        instruction:
          'Paint one final thin coat of glue all over the tissue paper and sprinkle a pinch of fine glitter into the wet glue to catch the light.',
        durationMinutes: 3,
      },
      {
        title: 'Tie a ribbon and illuminate',
        instruction:
          'Tie a pretty ribbon around the mouth of the jar. Drop your battery LED tealight inside, turn off the bedroom lights, and watch your enchanted fairy lantern glow!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'kumihimo-friendship-bracelet',
    title: 'Japanese Kumihimo Bracelet',
    summary: 'Weave a beautiful rounded braided friendship bracelet using a homemade circular cardboard loom!',
    category: 'Wearable Crafts',
    difficulty: 'medium',
    minAge: 7,
    maxAge: 14,
    estimatedMinutes: 25,
    adultSupervision: false,
    safetyNote: 'Use scissors carefully when cutting slits into the cardboard disc.',
    iconEmoji: '📿',
    accentColor: '#8B5CF6',
    genderTarget: 'girl',
    materials: [
      { name: 'Cardboard circle cut from a cereal or shipping box', quantity: '1 disc (10 cm wide)' },
      { name: 'Embroidery floss or thin yarn in 4 bright colors', quantity: '8 strands (40 cm each)' },
      { name: 'Pencil and kid-safe scissors', quantity: '1 each' },
    ],
    steps: [
      {
        title: 'Make the cardboard loom',
        instruction:
          'Trace a cup onto cardboard, cut out the circle, poke a small hole in the center, and cut 8 small 1 cm slits evenly spaced around the outer rim.',
        durationMinutes: 5,
      },
      {
        title: 'Tie and thread the strings',
        instruction:
          'Gather all 8 strands of embroidery floss, tie a firm knot at one end, and push the loose ends through the center hole until the knot sits against the back.',
        durationMinutes: 4,
      },
      {
        title: 'Slot strings into notches',
        instruction:
          'Tuck 7 of your strings into 7 notches around the wheel, leaving exactly ONE notch empty at the top (12 o’clock position).',
        durationMinutes: 4,
      },
      {
        title: 'Weave the magic rhythm',
        instruction:
          'With the empty notch at top, count 3 strings clockwise to the right. Take that 3rd string and move it across into the empty notch! Rotate the disc so the new empty notch is at top, and repeat!',
        tip: 'Rhythm: Count 3 to the right, move it up, turn the wheel!',
        durationMinutes: 8,
      },
      {
        title: 'Tie and share with a friend',
        instruction:
          'As you weave, a thick, rounded braid will emerge from the center hole! When long enough for a wrist, unhook strings, tie a secure knot, and wear your friendship bracelet!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'yarn-wrapped-nature-heart',
    title: 'Yarn-Wrapped Nature Heart Wand',
    summary: 'Weave soft pastel yarns around a cardboard heart and attach a smooth garden twig to make a magical wand!',
    category: 'Nature Crafts',
    difficulty: 'easy',
    minAge: 4,
    maxAge: 10,
    estimatedMinutes: 15,
    adultSupervision: false,
    safetyNote: 'Pick a clean, smooth fallen twig from the yard or park.',
    iconEmoji: '💖',
    accentColor: '#F43F5E',
    genderTarget: 'girl',
    materials: [
      { name: 'Cardboard heart cutout', quantity: '1 heart (12 cm wide)' },
      { name: 'Soft yarn or wool in favorite colors (pink, gold, mint)', quantity: '2–3 colors' },
      { name: 'Smooth fallen garden twig or craft stick', quantity: '1 stick (25 cm long)' },
      { name: 'Sticky tape or craft glue', quantity: '1' },
      { name: 'Kid-safe scissors', quantity: '1 pair' },
    ],
    steps: [
      {
        title: 'Cut your heart canvas',
        instruction:
          'Draw a heart on cardboard and cut it out neatly. Tape the end of your first yarn color securely to the back of the heart.',
        durationMinutes: 3,
      },
      {
        title: 'Wrap in cozy criss-crosses',
        instruction:
          'Wind the yarn around and across the heart from different angles until the cardboard is covered in cozy colorful loops.',
        tip: 'Pull snug, but not too tight so the cardboard doesn’t bend!',
        durationMinutes: 5,
      },
      {
        title: 'Change yarn colors',
        instruction:
          'Snip the first yarn, tie a new bright color onto the tail end, and keep wrapping to create multicolored stripes across your heart.',
        durationMinutes: 4,
      },
      {
        title: 'Attach the wand handle',
        instruction:
          'Tape or glue your smooth garden twig to the back of the yarn-wrapped heart. Tuck the final yarn tail under a loop with a dab of glue.',
        durationMinutes: 3,
      },
      {
        title: 'Cast a kindness spell!',
        instruction:
          'Hold your heart wand high, wave it in the air, and make a magic wish to bring smiles to everyone around you!',
        durationMinutes: 2,
      },
    ],
  },
  {
    slug: 'felt-play-food-strawberries',
    title: 'Felt Sweet Strawberries',
    summary: 'Hand-stitch cute plush felt strawberries with green leafy tops for pretend kitchen tea parties!',
    category: 'Sewing & Felt',
    difficulty: 'medium',
    minAge: 7,
    maxAge: 13,
    estimatedMinutes: 25,
    adultSupervision: true,
    safetyNote: 'Have a grown-up assist when threading and handling sewing needles.',
    iconEmoji: '🍓',
    accentColor: '#E11D48',
    genderTarget: 'girl',
    materials: [
      { name: 'Red craft felt scrap', quantity: '1 sheet' },
      { name: 'Green craft felt scrap', quantity: '1 small piece' },
      { name: 'Cotton balls or plush toy stuffing', quantity: '3–4 balls' },
      { name: 'Sewing needle and red embroidery thread', quantity: '1 each' },
      { name: 'Kid-safe scissors', quantity: '1 pair' },
      { name: 'White marker or craft paint for seeds', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        title: 'Cut a red felt half-circle',
        instruction:
          'Trace a glass or cup on red felt, cut it out, and cut the circle directly in half to make two semicircles.',
        durationMinutes: 4,
      },
      {
        title: 'Stitch into a cone shape',
        instruction:
          'Fold a half-circle in half and sew along the straight edge using red thread to create a cute little red cone pocket.',
        safetyWarning: 'Sew carefully under adult guidance.',
        durationMinutes: 7,
      },
      {
        title: 'Stuff the strawberry',
        instruction:
          'Turn the felt cone right-side out and stuff it firmly with cotton balls until it holds a plump strawberry shape.',
        durationMinutes: 3,
      },
      {
        title: 'Gather the top rim',
        instruction:
          'Weave a running stitch around the top open rim, pull the thread tight to close the opening, and knot securely.',
        durationMinutes: 5,
      },
      {
        title: 'Add leaves and seeds',
        instruction:
          'Cut a green felt star for leafy tops, stitch or glue it onto the flat top of your strawberry, and dot tiny white seeds for the final touch!',
        tip: 'Make a basket of 3–4 strawberries for your pretend tea party!',
        durationMinutes: 6,
      },
    ],
  },
];

/**
 * Seeds starter offline DIY guides and ensures all built-in guides
 * (including boy- and girl-tailored projects) are present and up to date.
 */
export async function seedInitialGuides(db) {
  let seededCount = 0;

  await db.withTransactionAsync(async () => {
    for (const guide of STARTER_GUIDES) {
      const existing = await db.getFirstAsync(
        'SELECT id, gender_target FROM guides WHERE slug = ?;',
        [guide.slug]
      );

      if (!existing) {
        await insertGuideRecord(db, guide, { isCustom: false });
        seededCount += 1;
      } else {
        // Ensure gender_target is synced for existing databases
        await db.runAsync(
          'UPDATE guides SET gender_target = ? WHERE id = ?;',
          [guide.genderTarget || 'all', existing.id]
        );
      }
    }
  });

  return seededCount > 0;
}
