import { insertGuideRecord } from './guidesRepository';

export const STARTER_GUIDES = [
  // ==========================================
  // UNISEX / ALL-KIDS CRAFTS
  // ==========================================
  {
    slug: 'blast-off-paper-tube-rocket',
    title: 'Blast-Off Paper Tube Rocket',
    summary: 'Turn an empty cardboard paper tube into a colorful space rocket with flame streamers!',
    storyIntro:
      'Get ready for an intergalactic mission! In this project, you will transform an everyday cardboard tube into a sleek deep-space explorer complete with aerodynamic stabilization fins, a pointed nose cone, and fluttering fiery exhaust streamers.',
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
    skills: ['🚀 Space Design', '✂️ Scissor Control', '📐 3D Shapes', '🎨 Creative Decorating'],
    funFacts: [
      'Real space rockets have pointed nose cones to slice smoothly through Earth’s thick atmosphere with less air resistance!',
      'The fins at the bottom of a rocket keep it flying straight so it does not wobble or spin in circles during launch.',
      'The Saturn V moon rocket was taller than a 36-story building and used three separate stages to reach space!',
    ],
    variations: [
      {
        emoji: '🛸',
        title: 'Glow-in-the-Dark Star Cruiser',
        description: 'Add glow-in-the-dark star stickers or neon highlighter windows so your rocket shines when bedroom lights go out!',
      },
      {
        emoji: '🧑‍🚀',
        title: 'Astronaut Crew Porthole',
        description: 'Cut out a small photo of yourself or draw your pet and glue it inside a round paper window frame on the rocket body.',
      },
      {
        emoji: '🧵',
        title: 'Zip-Line Flying Rocket',
        description: 'Tape a piece of drinking straw along the side of your rocket, thread a long string through it across your room, and let it zoom down the line!',
      },
    ],
    troubleshooting: [
      {
        question: 'My nose cone keeps popping open!',
        answer: 'Put a piece of tape on both the outside AND the inside seam of the paper cone, then hold it for 10 seconds.',
      },
      {
        question: 'My rocket tips over when standing up.',
        answer: 'Make sure all 3 bottom triangle fins touch the table evenly like a tripod.',
      },
    ],
    materials: [
      { name: 'Empty toilet paper or paper towel tube', quantity: '1 sturdy tube' },
      { name: 'Colored construction paper (silver, blue, or red)', quantity: '2 sheets' },
      { name: 'Red, orange, and yellow tissue paper strips', quantity: '6 strips (15 cm long)' },
      { name: 'Glue stick or clear craft tape', quantity: '1 roll / stick' },
      { name: 'Rounded kid-safe scissors', quantity: '1 pair' },
      { name: 'Markers, crayons, or space stickers', quantity: 'Assorted', isOptional: true },
    ],
    steps: [
      {
        emoji: '📜',
        title: 'Wrap the rocket fuselage body',
        instruction:
          'Measure and cut a rectangle of construction paper tall enough to cover your cardboard tube. Spread glue across the paper, wrap it tightly around the tube, and press the seam flat.',
        tip: 'Place a strip of clear tape along the seam so the paper stays super snug!',
        durationMinutes: 4,
      },
      {
        emoji: '🔺',
        title: 'Shape the aerodynamic nose cone',
        instruction:
          'Trace a small bowl on contrasting paper and cut out the circle. Cut one straight slit from the outer edge to the center point, overlap the cut edges until it forms a pointed cone, and tape it shut.',
        tip: 'Bright yellow, red, or shiny aluminum foil makes an awesome nose cone.',
        durationMinutes: 5,
      },
      {
        emoji: '🛠️',
        title: 'Attach the nose cone and stabilizer fins',
        instruction:
          'Add four small loops of tape inside the top rim of your tube and press the nose cone on top. Next, cut 3 matching triangles from stiff paper and tape them evenly around the base as fins.',
        durationMinutes: 5,
      },
      {
        emoji: '🔥',
        title: 'Install the fiery thruster flames',
        instruction:
          'Cut strips of red, orange, and yellow tissue paper. Glue or tape the tips of the strips around the inside rim of the bottom opening so they hang down like roaring rocket exhaust.',
        durationMinutes: 3,
      },
      {
        emoji: '🌟',
        title: 'Add astronaut windows and blast off!',
        instruction:
          'Draw circular porthole windows, rivets, planet emblems, and your rocket’s name along the side. Wave your rocket through the air to make the tissue flames dance—3, 2, 1, BLAST OFF!',
        tip: 'Draw a friendly alien or astronaut waving out of the top window!',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'fizzing-kitchen-volcano',
    title: 'Fizzing Kitchen Volcano',
    summary: 'Create a bubbly, colorful baking soda and vinegar eruption right on a kitchen tray.',
    storyIntro:
      'Turn your kitchen table into an exciting geology and chemistry lab! Using safe everyday ingredients from the pantry, you will trigger a foaming acid-base chemical reaction that bubbles over just like molten lava flowing down a volcano.',
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
    skills: ['🔬 Kitchen Chemistry', '🧪 Measuring & Mixing', '👀 Scientific Observation'],
    funFacts: [
      'When baking soda (a base) mixes with vinegar (an acid), they react to create carbon dioxide gas—the exact same gas that makes soda pop fizzy!',
      'Adding dish soap traps the tiny carbon dioxide gas bubbles, turning a quick fizz into thick, slow-moving foam lava.',
      'Mauna Loa in Hawaii is the largest active volcano on Earth, rising more than 9 kilometers from the ocean floor!',
    ],
    variations: [
      {
        emoji: '🌈',
        title: 'Rainbow Lava Eruption',
        description: 'Line up 4 small cups side-by-side with red, yellow, green, and blue food coloring, then pour vinegar across all of them at once!',
      },
      {
        emoji: '❄️',
        title: 'Frozen Snow Volcano',
        description: 'Take your cup outside in the snow or pack crushed ice around the cup in a tray to build a realistic snowy mountain peak!',
      },
      {
        emoji: '🍋',
        title: 'Lemon Juice Citrus Eruption',
        description: 'Test squeezing fresh lemon or lime juice instead of vinegar and compare which acid makes the biggest foam bubbles!',
      },
    ],
    troubleshooting: [
      {
        question: 'The bubbles stopped too fast!',
        answer: 'Stir the bottom of the cup with a spoon—sometimes dry baking soda hides underneath and will erupt again when stirred!',
      },
      {
        question: 'My lava was watery instead of foamy.',
        answer: 'Add an extra squirt of liquid dish soap before pouring the vinegar.',
      },
    ],
    materials: [
      { name: 'Small plastic cup or narrow glass jar', quantity: '1 cup' },
      { name: 'Rimmed baking tray or large deep platter', quantity: '1 tray' },
      { name: 'Baking soda (sodium bicarbonate)', quantity: '2–3 tablespoons' },
      { name: 'White distilled vinegar', quantity: '1/2 cup' },
      { name: 'Liquid dishwashing soap', quantity: '1 generous squirt' },
      { name: 'Red, orange, or purple food coloring', quantity: '5 drops', isOptional: true },
    ],
    steps: [
      {
        emoji: '🍽️',
        title: 'Set up your volcano containment tray',
        instruction:
          'Place your empty cup right in the center of a rimmed baking tray or large shallow dish. This catches all the foamy lava so clean-up is super easy.',
        safetyWarning: 'Always build your volcano on a washable tray or outdoors.',
        durationMinutes: 2,
      },
      {
        emoji: '🥄',
        title: 'Load the volcano chamber with baking soda',
        instruction:
          'Spoon 2 to 3 tablespoons of baking soda into the bottom of your cup. Gently shake the cup so the powder settles evenly.',
        durationMinutes: 2,
      },
      {
        emoji: '🎨',
        title: 'Swirl in dish soap and lava color',
        instruction:
          'Add one squirt of liquid dish soap and 4–5 drops of red or orange food coloring directly on top of the baking soda.',
        tip: 'Want purple or neon green space lava? Use any food coloring you like!',
        durationMinutes: 2,
      },
      {
        emoji: '💥',
        title: 'Pour the vinegar and watch it erupt!',
        instruction:
          'Pour the vinegar steadily into the cup and step back! Within one second, foamy red lava will rise up the cup and cascade down the sides.',
        safetyWarning: 'Keep your face back from the cup while the reaction fizzes.',
        durationMinutes: 4,
      },
      {
        emoji: '🔍',
        title: 'Test a second aftershock eruption',
        instruction:
          'Listen closely to the popping fizz sound! Once the foam slows down, stir the bottom of the cup with a stick and splash in a bit more vinegar to trigger a second eruption.',
        durationMinutes: 5,
      },
    ],
  },
  {
    slug: 'rainbow-sensory-calm-bottle',
    title: 'Rainbow Sensory Calm Jar',
    summary: 'Make a swirling glittery calm-down bottle that shimmers slowly when you shake it.',
    storyIntro:
      'Create your very own magical galaxy in a bottle! When you shake this sensory jar, thousands of colourful sparkles and stars swirl in slow motion—helping your mind relax and focus while you watch them gently drift down.',
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
    skills: ['🧘 Mindfulness & Focus', '🌊 Liquid Density', '✨ Color & Light Play'],
    funFacts: [
      'Clear school glue thickens the water (increasing its viscosity), which slows down gravity’s pull on the glitter!',
      'Taking slow breaths while watching swirling glitter for 60 seconds can actually lower your heart rate when you feel frustrated or tired.',
      'Fine glitter floats much longer than heavy plastic beads because of its flat surface area.',
    ],
    variations: [
      {
        emoji: '🌌',
        title: 'Deep Space Nebula Bottle',
        description: 'Use 1 drop of blue and 1 drop of purple food coloring with silver star confetti for a swirling night-sky galaxy.',
      },
      {
        emoji: '🐠',
        title: 'Ocean Treasure Hunt Jar',
        description: 'Drop in small plastic sea shells, pony beads, or a tiny plastic fish and watch it swim through blue sparkle water!',
      },
      {
        emoji: '☀️',
        title: 'Golden Sunshine Bottle',
        description: 'Use yellow food coloring with gold and orange glitter for a warm, sunny morning glow.',
      },
    ],
    troubleshooting: [
      {
        question: 'My glitter falls to the bottom too quickly!',
        answer: 'Squeeze in an extra 2–3 tablespoons of clear glue and shake well to make the liquid thicker.',
      },
      {
        question: 'The glitter clumped together at the top.',
        answer: 'Add a tiny drop of liquid dish soap—it breaks the surface tension so glitter spreads evenly!',
      },
    ],
    materials: [
      { name: 'Smooth clear plastic bottle with screw cap', quantity: '1 bottle (300–500 ml)' },
      { name: 'Warm tap water', quantity: 'About 1.5 cups' },
      { name: 'Clear school glue or glitter glue', quantity: '1/2 cup' },
      { name: 'Fine craft glitter and star sequins', quantity: '2 tablespoons' },
      { name: 'Liquid food coloring', quantity: '1–2 drops', isOptional: true },
      { name: 'Strong waterproof tape or glue (for cap)', quantity: 'To seal' },
    ],
    steps: [
      {
        emoji: '💧',
        title: 'Pour warm water halfway up',
        instruction:
          'Peel any paper labels off your clean plastic bottle. Ask a grown-up to help fill the bottle halfway with warm tap water.',
        safetyWarning: 'Use warm tap water only—never hot or boiling water.',
        durationMinutes: 2,
      },
      {
        emoji: '🧴',
        title: 'Whisk in the clear glue',
        instruction:
          'Squeeze the clear glue into the warm water. Screw the cap on, shake vigorously for 20 seconds until the glue dissolves completely into the water.',
        tip: 'Warm water helps the thick glue melt and blend smoothly.',
        durationMinutes: 4,
      },
      {
        emoji: '✨',
        title: 'Pour in rainbow glitter and sequins',
        instruction:
          'Unscrew the cap and funnel in 2 tablespoons of fine glitter, star sequins, and 1 drop of food coloring. Keep the coloring light so the sparkles shine bright!',
        durationMinutes: 3,
      },
      {
        emoji: '🔒',
        title: 'Top off with water and seal the lid',
        instruction:
          'Fill the bottle almost to the top with warm water, leaving 2 cm of air space. Have an adult glue or wrap strong tape around the cap so it stays permanently sealed.',
        safetyWarning: 'Make sure an adult seals the cap tightly so water cannot spill.',
        durationMinutes: 3,
      },
      {
        emoji: '🌬️',
        title: 'Swirl, watch, and take 3 calm breaths',
        instruction:
          'Turn the bottle upside down and give it a big spin! Set it on a table and take slow, deep belly breaths until the very last sparkle lands on the bottom.',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'pressed-leaf-animal-art',
    title: 'Pressed Leaf Animal Art',
    summary: 'Go on a backyard leaf hunt and turn real leaves into owls, foxes, or butterflies!',
    storyIntro:
      'Every leaf on the ground is a puzzle piece waiting to become art! Head outside on a nature treasure hunt, collect fallen leaves of different shapes and colors, and combine them into woodland foxes, fluttering butterflies, and wise owls.',
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
    skills: ['🌿 Nature Exploration', '🧩 Shape Recognition', '🦊 Woodland Art'],
    funFacts: [
      'Leaves change color in autumn because trees stop making green chlorophyll, revealing hidden yellow and orange pigments that were there all along!',
      'Every tree species has its own leaf fingerprint—maple leaves look like open hands, while birch leaves have tiny saw-tooth edges.',
      'Botanists (plant scientists) preserve pressed leaves in special books called herbariums that can last for hundreds of years!',
    ],
    variations: [
      {
        emoji: '🦋',
        title: 'Symmetrical Leaf Butterfly',
        description: 'Pick two matching wide leaves for top wings, two smaller leaves for bottom wings, and a thin twig for the body!',
      },
      {
        emoji: '🦁',
        title: 'Golden Leaf Mane Lion',
        description: 'Draw a friendly lion face in the middle of your paper and glue a ring of yellow and orange leaves all around it for a wild mane.',
      },
      {
        emoji: '🖍️',
        title: 'Leaf Vein Crayon Rubbings',
        description: 'Place an extra sheet of thin paper over your leaves and rub the side of a peeled crayon across it to reveal the hidden leaf veins!',
      },
    ],
    troubleshooting: [
      {
        question: 'My leaves are too crunchy and crack when glued!',
        answer: 'Look for freshly fallen leaves that are still flexible rather than sun-baked brittle ones.',
      },
      {
        question: 'The leaf stems won’t stick flat.',
        answer: 'Snip off thick woody stems with scissors or use a tiny piece of clear tape over the stem.',
      },
    ],
    materials: [
      { name: 'Assorted fallen leaves (round, pointy, oval)', quantity: '8–12 dry leaves' },
      { name: 'Sturdy white cardstock or construction paper', quantity: '2 sheets' },
      { name: 'Liquid school glue or glue stick', quantity: '1' },
      { name: 'Markers, crayons, or colored pencils', quantity: 'Set' },
      { name: 'Googly eyes or white paper circles', quantity: '4–6 eyes', isOptional: true },
      { name: 'Heavy book and paper towel (for flattening)', quantity: '1 book', isOptional: true },
    ],
    steps: [
      {
        emoji: '🧺',
        title: 'Go on a nature leaf treasure hunt',
        instruction:
          'Walk through a yard or park and gather fallen dry leaves in different sizes: round leaves make great bodies, pointy leaves become fox ears or bird beaks, and tiny leaves make paws!',
        tip: 'Brush any dirt or moisture off the leaves with a dry tissue.',
        durationMinutes: 8,
      },
      {
        emoji: '📚',
        title: 'Press curly leaves flat',
        instruction:
          'Place your collected leaves between two sheets of paper towel and press them under a heavy book for 5 minutes so they lie nice and flat.',
        durationMinutes: 5,
      },
      {
        emoji: '🦊',
        title: 'Test-fit your animal puzzle',
        instruction:
          'Lay your leaves onto the paper without glue first! Try arranging an owl on a branch, a swimming fish with leafy fins, or a playful woodland fox.',
        durationMinutes: 5,
      },
      {
        emoji: '💧',
        title: 'Glue each leaf into place',
        instruction:
          'Lift one leaf at a time, dot glue onto the back center, and press it gently onto your paper for 10 seconds.',
        durationMinutes: 4,
      },
      {
        emoji: '🎨',
        title: 'Draw faces, legs, and forest scenery',
        instruction:
          'Add googly eyes or draw expressive eyes, whiskers, bird legs, tree branches, and clouds with your markers to bring your nature scene to life!',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'milk-carton-bird-feeder',
    title: 'Milk Carton Bird Feeder',
    summary: 'Recycle an empty milk or juice carton into a cozy backyard feeder for neighborhood birds.',
    storyIntro:
      'Turn recycling into a cozy café for your feathered neighbors! By upcycling a waterproof beverage carton, you will build a weather-resistant birdhouse feeder and observe real wild birds visiting right outside your window.',
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
    skills: ['♻️ Upcycling & Eco-Craft', '🐦 Wildlife Observation', '🏗️ Structural Building'],
    funFacts: [
      'Milk and juice cartons are coated with a thin waterproof layer, making them naturally rain-proof outdoors!',
      'Small songbirds like chickadees and finches eat up to 30% of their body weight in seeds every single day to stay warm.',
      'Placing your feeder within 2–3 meters of a tree or bush gives shy birds a safe place to perch and check for danger before dining.',
    ],
    variations: [
      {
        emoji: '🏡',
        title: 'Bark & Twig Cottage Roof',
        description: 'Glue small flat twigs or pine cones along the sloped top of the carton so it looks like a miniature log cabin!',
      },
      {
        emoji: '📓',
        title: 'Birdwatcher Spotter Journal',
        description: 'Keep a small notebook by the window and sketch every different colored bird that visits your feeder during the week.',
      },
      {
        emoji: '🍎',
        title: 'Fruit & Berry Treat Bar',
        description: 'Add a few dried cranberries, apple dices, or unsalted sunflower seeds to attract different species of backyard birds.',
      },
    ],
    troubleshooting: [
      {
        question: 'Rainwater got inside the bottom tray.',
        answer: 'Poke 2 tiny pinholes in the very bottom corners of the carton so any rainwater drains right out!',
      },
      {
        question: 'The feeder spins too much in the wind.',
        answer: 'Tie your carton close to a thick branch rather than dangling it on a long string.',
      },
    ],
    materials: [
      { name: 'Clean, dry empty milk or juice carton', quantity: '1 carton (1 liter)' },
      { name: 'Scissors (for adult help)', quantity: '1 pair' },
      { name: 'Wooden chopstick, pencil, or sturdy twig', quantity: '1 stick (15 cm)' },
      { name: 'Strong garden twine or yarn', quantity: '50 cm' },
      { name: 'Acrylic paint, permanent markers, or duct tape', quantity: 'Assorted', isOptional: true },
      { name: 'Wild birdseed or sunflower seeds', quantity: '1 cup' },
    ],
    steps: [
      {
        emoji: '🧼',
        title: 'Wash and dry your carton thoroughly',
        instruction:
          'Rinse the empty milk or juice carton with warm soapy water, shake out excess drops, and let it dry so the birdseed stays dry and fresh.',
        durationMinutes: 4,
      },
      {
        emoji: '🪟',
        title: 'Cut the dining window opening',
        instruction:
          'Use a marker to draw a large arched window on one or two sides of the carton, leaving a 4 cm deep tray wall at the bottom. Ask an adult to cut out the window.',
        safetyWarning: 'Adult assistance required for cutting thick carton corners.',
        durationMinutes: 6,
      },
      {
        emoji: '🪵',
        title: 'Push through the wooden bird perch',
        instruction:
          'Poke a small hole centered 1.5 cm below the window opening. Push your wooden stick, pencil, or twig through so 6 cm sticks out in front as a landing perch.',
        durationMinutes: 4,
      },
      {
        emoji: '🎨',
        title: 'Decorate the birdhouse exterior',
        instruction:
          'Decorate the outside walls and roof with colorful duct tape, weatherproof stickers, or acrylic paint. Draw roof shingles and flowers!',
        tip: 'Keep paint on the outside only so the inside seed tray stays clean for birds.',
        durationMinutes: 8,
      },
      {
        emoji: '🪢',
        title: 'Thread the hanging loop',
        instruction:
          'Punch a hole through the top ridge of the carton roof, thread your strong twine through, and tie a double overhand knot.',
        durationMinutes: 4,
      },
      {
        emoji: '🌻',
        title: 'Fill with seeds and hang outdoors!',
        instruction:
          'Pour 1 cup of birdseed into the bottom tray and hang your feeder on a quiet tree branch visible from your window. Watch for your first feathered guest!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'jumping-origami-frog',
    title: 'Jumping Origami Frog',
    summary: 'Fold a single square piece of paper into a springy frog that really hops when you tap its back!',
    storyIntro:
      'Discover the ancient Japanese art of paper folding! Using zero glue and zero tape, you will fold a flat square of paper into an action toy with a built-in accordion spring that leaps across the table when you press its back.',
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
    skills: ['📐 Geometry & Symmetry', '🤲 Fine Finger Dexterity', '⚡ Spring Mechanics'],
    funFacts: [
      'Origami comes from the Japanese words "ori" (folding) and "kami" (paper) and has been practiced for over 1,000 years!',
      'The zig-zag fold at the back of your paper frog stores elastic potential energy like a coiled metal spring.',
      'Real tree frogs can jump more than 20 times their own body length in a single bound!',
    ],
    variations: [
      {
        emoji: '🏁',
        title: 'Lily Pad Long-Jump Olympics',
        description: 'Cut green paper circles as lily pads, space them across the floor, and see how many hops it takes your frog to land on each pad!',
      },
      {
        emoji: '👑',
        title: 'Mini vs. Giant Frog Family',
        description: 'Fold one frog from a 20 cm square and a tiny baby frog from a 7 cm sticky note—see which one jumps higher!',
      },
      {
        emoji: '🎨',
        title: 'Poison Dart Spotted Frog',
        description: 'Use bright blue or yellow paper and decorate the back with neon polka dots and racing stripes.',
      },
    ],
    troubleshooting: [
      {
        question: 'My frog flips upside down instead of jumping forward.',
        answer: 'Press gently right on the very back edge of the Z-fold and slide your finger backward off the tail.',
      },
      {
        question: 'The paper gets too thick to fold easily.',
        answer: 'Use standard notebook or origami paper rather than thick cardstock, and run your thumbnail along each crease.',
      },
    ],
    materials: [
      { name: 'Square sheet of paper (green or bright color)', quantity: '1 sheet (15 cm × 15 cm)' },
      { name: 'Markers or pens for frog eyes and spots', quantity: '2 colors', isOptional: true },
      { name: 'Green paper circle for a target lily pad', quantity: '1 circle', isOptional: true },
    ],
    steps: [
      {
        emoji: '📄',
        title: 'Fold the square into a rectangle',
        instruction:
          'Lay your square paper flat on the table. Fold it in half from left to right so the corners line up evenly, then press firmly along the fold with your finger.',
        durationMinutes: 2,
      },
      {
        emoji: '✖️',
        title: 'Crease the diagonal X lines',
        instruction:
          'Fold the top-left corner down to touch the right edge, crease sharply, and unfold. Repeat with the top-right corner down to the left edge and unfold to reveal an X crease.',
        tip: 'Crisp, sharp creases make your frog much springier!',
        durationMinutes: 3,
      },
      {
        emoji: '🔺',
        title: 'Pinch the sides into a waterbomb triangle',
        instruction:
          'Gently push the left and right sides of the X crease inward toward the middle, flattening the top roof down into a layered triangle.',
        durationMinutes: 3,
      },
      {
        emoji: '🐾',
        title: 'Fold the front legs and narrow the body',
        instruction:
          'Fold the two bottom corners of the triangle upward at a slight outward angle to create two front frog legs. Then fold the left and right sides of the lower rectangle inward to meet at the center line.',
        durationMinutes: 3,
      },
      {
        emoji: '〰️',
        title: 'Create the Z-spring back legs',
        instruction:
          'Fold the bottom edge all the way up to the base of the front legs. Then fold half of that section back downward like an accordion zig-zag—this is your frog’s jumping spring!',
        durationMinutes: 2,
      },
      {
        emoji: '🐸',
        title: 'Draw eyes and launch your frog!',
        instruction:
          'Flip your frog right-side up, draw two big smiling eyes and spots on its back. Press your index finger down on the back fold and let it slip off the edge—BOING!',
        tip: 'Challenge a family member to see whose frog can jump into a plastic bowl!',
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
    storyIntro:
      'Start your engines, young mechanical engineer! In this hands-on STEM build, you will construct a working 4-wheel race car powered entirely by stored elastic tension. Wind up the rear axle, release the wheels, and watch it rocket across the floor!',
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
    skills: ['⚙️ Mechanical Engineering', '⚡ Kinetic Energy', '🛞 Axle & Wheel Physics'],
    funFacts: [
      'Winding the rubber band around the axle stores "elastic potential energy." When you let go, it transforms into "kinetic energy" (motion)!',
      'The drinking straws act as low-friction bearings so the wooden skewer axles can spin freely without rubbing against the cardboard.',
      'Wrapping a wide rubber band around the rear bottle cap wheels adds tire traction (grip) on slippery floors!',
    ],
    variations: [
      {
        emoji: '🛞',
        title: 'High-Traction Rubber Tires',
        description: 'Stretch thick rubber bands around the outside rim of the two back bottle caps so they grip smooth tile or wood floors without spinning out!',
      },
      {
        emoji: '🦅',
        title: 'Downforce Racing Spoiler Wing',
        description: 'Fold a cool angled paper wing and glue it onto the back trunk of your race car just like a Formula 1 racer.',
      },
      {
        emoji: '📏',
        title: 'Distance Championship Track',
        description: 'Use masking tape to mark 1-meter, 2-meter, and 3-meter finish lines on the hallway floor and test how many winds go the farthest!',
      },
    ],
    troubleshooting: [
      {
        question: 'The wheels spin in place without moving the car forward!',
        answer: 'Your floor is too slick! Wrap rubber bands or masking tape around the back bottle caps for extra tire grip.',
      },
      {
        question: 'My car curves to the left or right.',
        answer: 'Check that the two plastic straw axle tubes are taped completely parallel to each other.',
      },
    ],
    materials: [
      { name: 'Small rectangular cardboard box or stiff cardboard piece', quantity: '1 chassis (15 × 8 cm)' },
      { name: 'Matching plastic bottle caps for wheels', quantity: '4 caps' },
      { name: 'Round wooden skewers for axles', quantity: '2 skewers' },
      { name: 'Plastic or paper drinking straws', quantity: '2 straws' },
      { name: 'Stretchy medium rubber bands', quantity: '2–3 bands' },
      { name: 'Strong tape or glue', quantity: '1 roll' },
      { name: 'Markers and racing stickers', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        emoji: '📏',
        title: 'Mount the straw axle bearings',
        instruction:
          'Cut two pieces of drinking straw slightly wider than your cardboard body. Tape one straw straight across the front underside and one across the back underside.',
        tip: 'Keep both straws parallel so your race car tracks straight down the hallway!',
        durationMinutes: 5,
      },
      {
        emoji: '🛞',
        title: 'Slide in the axles and mount the 4 wheels',
        instruction:
          'Thread a wooden skewer through each straw. Have an adult poke a snug center hole in all 4 bottle caps, then press a cap onto each end of the skewers.',
        safetyWarning: 'Adult assistance required for piercing holes in plastic bottle caps.',
        durationMinutes: 6,
      },
      {
        emoji: '🔗',
        title: 'Hook up the rubber band drive shaft',
        instruction:
          'Cut a small notch or window near the back axle so you can reach the wooden skewer. Loop a rubber band tightly around the middle of the rear skewer and tape the front end of the rubber band to the nose of the car.',
        tip: 'Put a tiny dab of tape on the rear axle so the rubber band catches when you wind it!',
        durationMinutes: 5,
      },
      {
        emoji: '🔥',
        title: 'Add racing numbers and flame decals',
        instruction:
          'Flip your racer over and decorate the hood and sides with your favorite racing number, lightning bolts, flames, and a driver cockpit.',
        durationMinutes: 5,
      },
      {
        emoji: '🏁',
        title: 'Wind the rear axle and race!',
        instruction:
          'Turn the back wheels backward 6–8 times so the rubber band winds tightly around the rear skewer. Hold the wheels, set the car on the floor, and let go—ZOOM!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'cardboard-marble-labyrinth',
    title: 'Cardboard Marble Labyrinth',
    summary: 'Design a tilting maze game inside a shoebox lid with cardboard walls, tricky dead-ends, and trapdoors!',
    storyIntro:
      'Become an arcade game designer! Using a simple shoebox lid and strips of cardboard, you will architect a multi-path tilting labyrinth complete with secret shortcuts, bumper walls, and tricky trapdoor hazards.',
    category: 'STEM & Building',
    difficulty: 'medium',
    minAge: 6,
    maxAge: 13,
    estimatedMinutes: 30,
    adultSupervision: false,
    safetyNote: 'Work on a flat table and keep small marbles away from children under 3.',
    iconEmoji: '🕹️',
    accentColor: '#F59E0B',
    genderTarget: 'boy',
    skills: ['🗺️ Level Design & Logic', '✋ Hand-Eye Coordination', '📐 Measuring & Layout'],
    funFacts: [
      'The word "Labyrinth" comes from ancient Greek mythology, where the inventor Daedalus built a giant maze on the island of Crete!',
      'Tilting a marble maze trains your brain’s proprioception—the ability to make tiny hand adjustments based on visual feedback.',
      'Gravity pulls the marble toward the lowest corner of the box lid whenever you tilt it!',
    ],
    variations: [
      {
        emoji: '🌉',
        title: 'Cardboard Arch Tunnels',
        description: 'Bend 3 cm strips of paper into U-shaped arches and tape them over paths as secret bridges the marble rolls under!',
      },
      {
        emoji: '⏱️',
        title: 'Speed-Run Time Trial Mode',
        description: 'Number 5 checkpoints (1 to 5) around the board and time yourself to see how fast you can hit all 5 in order!',
      },
      {
        emoji: '🔴',
        title: 'Double-Marble Chaos Challenge',
        description: 'Drop TWO marbles into the Start zone at the same time and try to guide both to the Finish star!',
      },
    ],
    troubleshooting: [
      {
        question: 'My marble gets stuck in a narrow corner!',
        answer: 'Test-roll your marble along the pencil path before gluing walls—keep corridors at least twice as wide as the marble.',
      },
      {
        question: 'Cardboard wall strips tip over while drying.',
        answer: 'Fold a tiny L-shaped foot along the bottom edge of the strip so it has a wider flat surface for glue!',
      },
    ],
    materials: [
      { name: 'Sturdy shoebox lid or shallow cereal box tray', quantity: '1 lid' },
      { name: 'Cardboard strips or thick drinking straws for walls', quantity: '10–14 strips' },
      { name: 'Glass marble, steel bearing, or wooden bead', quantity: '1–2 marbles' },
      { name: 'White school glue or craft tape', quantity: '1' },
      { name: 'Pencil and ruler', quantity: '1 each' },
      { name: 'Colored markers for Start, Finish, and point zones', quantity: '3–4 colors' },
    ],
    steps: [
      {
        emoji: '✏️',
        title: 'Blueprint your maze floor plan',
        instruction:
          'Use a pencil to draw a winding route from the top-left "START" corner to the bottom-right "FINISH" corner. Add 3 or 4 dead-end branches to make the puzzle challenging!',
        tip: 'Roll your marble along your drawn paths to check that every turn is wide enough.',
        durationMinutes: 6,
      },
      {
        emoji: '✂️',
        title: 'Cut the labyrinth wall segments',
        instruction:
          'Cut cardboard strips (about 2 cm tall) or drinking straws to match the lengths of the lines on your blueprint.',
        durationMinutes: 6,
      },
      {
        emoji: '🧱',
        title: 'Glue the maze walls upright',
        instruction:
          'Run a bead of glue along the bottom edge of each wall strip (or straw) and press it firmly onto your pencil lines. Let dry for 5 minutes.',
        durationMinutes: 8,
      },
      {
        emoji: '🕳️',
        title: 'Add hazard zones and bonus arches',
        instruction:
          'Draw red "DANGER LAVA" circles in dead ends (or ask an adult to cut coin-sized trapdoor holes), and tape a paper arch bridge over the main path!',
        durationMinutes: 5,
      },
      {
        emoji: '🏆',
        title: 'Tilt, steer, and conquer the labyrinth!',
        instruction:
          'Place your marble on START, grip both sides of the box lid, and gently tilt in all directions to navigate every corner and reach the FINISH star!',
        durationMinutes: 5,
      },
    ],
  },
  {
    slug: 'superhero-power-cuffs',
    title: 'Superhero Power Wrist Cuffs',
    summary: 'Transform cardboard paper tubes into wearable superhero gauntlets with lightning bolts and stars!',
    storyIntro:
      'Every hero needs custom gear! Design your own pair of wearable superhero wrist gauntlets complete with metallic armor plating, energy shields, and custom emblem badges that snap right onto your wrists for imaginative action play.',
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
    skills: ['🦸 Costume Design', '✂️ Pattern Cutting', '🎭 Imaginative Roleplay'],
    funFacts: [
      'In comic book art, bright contrasting colors like red, gold, and electric blue are used so heroes stand out in action scenes!',
      'Cutting a single lengthwise slit in a cardboard cylinder turns it into a flexible spring cuff that hugs your wrist without needing Velcro.',
      'Ancient knights and gladiators wore metal wrist armor called "vambraces" or "bracers" to protect their arms!',
    ],
    variations: [
      {
        emoji: '🤖',
        title: 'Cyber-Robot Control Gauntlets',
        description: 'Wrap one cuff in kitchen aluminum foil and draw digital radar screens, buttons, and power meters with permanent markers!',
      },
      {
        emoji: '🛡️',
        title: 'Pop-Out Energy Shield',
        description: 'Cut a 12 cm cardboard octagon shield and tape it to the outside of one cuff so you can block imaginary laser beams!',
      },
      {
        emoji: '🦖',
        title: 'Dino-Ranger Tracker Cuffs',
        description: 'Use green and brown paper, draw a dinosaur claw emblem, and add a compass drawing on the wrist.',
      },
    ],
    troubleshooting: [
      {
        question: 'The cuff feels too loose on my wrist.',
        answer: 'Trim 1–2 cm off the cut opening so the tube curls into a smaller circle.',
      },
      {
        question: 'The paper wrapping peels at the edges.',
        answer: 'Fold an extra 1 cm of paper around the inside rim of the tube and secure it with clear tape.',
      },
    ],
    materials: [
      { name: 'Empty cardboard toilet paper rolls', quantity: '2 matching rolls' },
      { name: 'Bright construction paper (red, blue, yellow, or black)', quantity: '2 sheets' },
      { name: 'Aluminum foil (for shiny silver armor trim)', quantity: '1 small strip', isOptional: true },
      { name: 'Rounded kid-safe scissors', quantity: '1 pair' },
      { name: 'Glue stick or clear tape', quantity: '1' },
      { name: 'Markers, crayons, or star stickers', quantity: 'Assorted' },
    ],
    steps: [
      {
        emoji: '✂️',
        title: 'Cut the snap-on wrist opening',
        instruction:
          'Use your scissors to make one straight cut lengthwise from top to bottom on both cardboard rolls so they can open up like a bracelet.',
        durationMinutes: 3,
      },
      {
        emoji: '☁️',
        title: 'Round off the four corners',
        instruction:
          'Snip a gentle curve on the four corners along the cut slit so the cuffs feel smooth and comfortable against your arms.',
        durationMinutes: 2,
      },
      {
        emoji: '🎨',
        title: 'Wrap in heroic armor colors',
        instruction:
          'Glue bright construction paper or shiny aluminum foil around the outside of each tube, tucking the edges neatly inside.',
        durationMinutes: 4,
      },
      {
        emoji: '⚡',
        title: 'Craft your signature power emblem',
        instruction:
          'Cut bold lightning bolts, stars, flames, or your superhero initial from yellow or gold paper. Layer it over a contrasting circle badge.',
        tip: 'Outline your emblem with a black marker to make it pop like a real comic book!',
        durationMinutes: 3,
      },
      {
        emoji: '🦸',
        title: 'Glue badges and power up!',
        instruction:
          'Glue your emblems centered on the front of each cuff. Slip them onto your wrists, cross your arms in a hero salute, and embark on your adventure!',
        durationMinutes: 3,
      },
    ],
  },
  {
    slug: 'dinosaur-salt-dough-fossils',
    title: 'Dinosaur Salt Dough Fossils',
    summary: 'Bake realistic prehistoric stone fossils by pressing toy dinosaur footprints into homemade salt dough!',
    storyIntro:
      'Travel back 65 million years to the Jurassic era! Mix your own stone-like modeling dough from kitchen flour and salt, stamp ancient dinosaur footprints and skeletons into rock discs, and stage a backyard paleontology excavation!',
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
    skills: ['🦴 Paleontology & Earth Science', '🥣 Dough Kneading', '🔍 Fossil Imprinting'],
    funFacts: [
      'Trace fossils (like footprints and tail drags) tell scientists how fast dinosaurs ran and whether they walked in herds!',
      'Real fossils form over millions of years when mud and minerals harden into sedimentary rock around ancient tracks or bones.',
      'Salt acts as a natural preservative in salt dough, allowing your hardened dino stones to last for years!',
    ],
    variations: [
      {
        emoji: '🖌️',
        title: 'Sandbox Excavation Dig Site',
        description: 'Hide your hardened fossils in a tray of sand or cornmeal and use an old paintbrush to carefully uncover them like a real paleontologist!',
      },
      {
        emoji: '🐚',
        title: 'Prehistoric Sea Shell & Ammonite Stones',
        description: 'Press spiral seashells, pasta wheels, or fern leaves into the dough to create ancient ocean fossils.',
      },
      {
        emoji: '☕',
        title: 'Ancient Rock Coffee-Wash Finish',
        description: 'Mix a drop of brown paint (or instant coffee) with water and brush it into the footprint grooves so they look millions of years old!',
      },
    ],
    troubleshooting: [
      {
        question: 'The toy dinosaur sticks to the dough when I press it!',
        answer: 'Dust the dinosaur’s feet lightly with a tiny pinch of dry flour before stamping.',
      },
      {
        question: 'My dough feels too dry and cracks at the edges.',
        answer: 'Wet your hands with warm water and knead the dough ball for 1 more minute until smooth.',
      },
    ],
    materials: [
      { name: 'All-purpose white flour', quantity: '1 cup' },
      { name: 'Fine table salt', quantity: '1/2 cup' },
      { name: 'Warm tap water', quantity: '1/2 cup' },
      { name: 'Plastic toy dinosaurs, shells, or leaves', quantity: '3–4 toys' },
      { name: 'Mixing bowl and baking tray with parchment', quantity: '1 each' },
      { name: 'Washable brown or gray paint and brush', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        emoji: '🥣',
        title: 'Knead the prehistoric stone dough',
        instruction:
          'Combine 1 cup of flour and 1/2 cup of salt in a bowl. Pour in warm water a little at a time while mixing and kneading with your hands for 3 minutes until smooth like playdough.',
        tip: 'Add a tiny spoonful of cocoa powder or cinnamon if you want naturally brown earth-toned rocks!',
        durationMinutes: 5,
      },
      {
        emoji: '🪨',
        title: 'Flatten into ancient rock slabs',
        instruction:
          'Roll the dough into 4 or 5 balls and press them flat onto parchment paper with the palm of your hand until they are about 1 cm thick with rough, natural rock edges.',
        durationMinutes: 4,
      },
      {
        emoji: '🐾',
        title: 'Stamp dinosaur tracks and scales',
        instruction:
          'Press your toy dinosaur’s feet, tail, or side body firmly into the dough slabs, then lift straight up to reveal a deep, detailed fossil imprint!',
        durationMinutes: 5,
      },
      {
        emoji: '🔥',
        title: 'Harden into stone (bake or air-dry)',
        instruction:
          'Have an adult bake the stones at 100°C (200°F) for 2 hours until hard, OR leave them on a sunny windowsill for 2–3 days to air-dry naturally.',
        safetyWarning: 'Let baked fossils cool completely before touching.',
        durationMinutes: 3,
      },
      {
        emoji: '🔎',
        title: 'Antiquing wash and museum display!',
        instruction:
          'Brush a little watered-down brown paint into the footprint indents and wipe the top surface with a paper towel. Create museum labels with each dinosaur’s name!',
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
    storyIntro:
      'Bring a touch of woodland fairy magic to your bedroom! By layering translucent pastel tissue paper over a silhouette cutout on a jar, you will create a stained-glass lantern that casts a cozy, dreamy glow when lit with an LED tealight.',
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
    skills: ['🎨 Stained-Glass Decoupage', '✨ Light & Shadow Art', '🎀 Decorative Styling'],
    funFacts: [
      'Decoupage comes from the French word "découper," meaning to cut out and layer paper art onto surfaces with glue!',
      'When light shines from inside the jar, the dark paper fairy blocks the light to cast a sharp shadow silhouette against the glowing pastel tissue paper.',
      'Overlapping pink and blue tissue paper squares creates lavender purple right on the glass!',
    ],
    variations: [
      {
        emoji: '🦄',
        title: 'Unicorn & Rainbow Cloud Lantern',
        description: 'Cut a prancing unicorn silhouette from black paper and surround it with rainbow-striped tissue squares.',
      },
      {
        emoji: '🌿',
        title: 'Pressed Flower Botanical Jar',
        description: 'Glue real small pressed daisy petals and fern leaves between layers of white tissue paper for a nature cottage lantern.',
      },
      {
        emoji: '🌙',
        title: 'Starry Moonbeam Nightlight',
        description: 'Use deep blue and violet tissue paper with gold star confetti and a crescent moon cutout.',
      },
    ],
    troubleshooting: [
      {
        question: 'The tissue paper wrinkles or tears when I brush glue over it.',
        answer: 'Mix a few drops of water into your white glue so it glides smoothly, and dab gently with your brush instead of scrubbing.',
      },
      {
        question: 'I can’t see my fairy silhouette clearly.',
        answer: 'Glue the dark fairy cutout onto the glass FIRST, and only place 1 thin layer of light-colored tissue paper over it!',
      },
    ],
    materials: [
      { name: 'Clean glass jam jar or clear plastic jar', quantity: '1 jar' },
      { name: 'Pastel tissue paper (pink, lilac, mint, sky blue)', quantity: '2–3 sheets' },
      { name: 'White school glue (diluted with a splash of water)', quantity: '1/4 cup' },
      { name: 'Black paper cutout (fairy, butterfly, or castle)', quantity: '1–2 silhouettes' },
      { name: 'Paintbrush or foam sponge brush', quantity: '1 brush' },
      { name: 'Fine iridescent glitter and ribbon', quantity: '1 pinch + 30 cm ribbon' },
      { name: 'Battery-operated LED tea light candle', quantity: '1 LED light' },
    ],
    steps: [
      {
        emoji: '🧚',
        title: 'Glue the fairy silhouette to the jar',
        instruction:
          'Draw and cut out a small 5 cm fairy or butterfly shape from black or dark paper. Dab glue onto the center of your clean jar and press the silhouette flat against the glass.',
        durationMinutes: 3,
      },
      {
        emoji: '🌸',
        title: 'Tear pastel tissue mosaic squares',
        instruction:
          'Tear or cut your pink, purple, yellow, and blue tissue paper into small 2–3 cm pieces. Tearing by hand gives soft feathery edges that blend beautifully!',
        durationMinutes: 4,
      },
      {
        emoji: '🖌️',
        title: 'Layer the stained-glass coat',
        instruction:
          'Brush a thin layer of watered-down glue onto a section of the jar, press tissue squares onto the wet glue, and gently brush a little more glue on top to seal.',
        tip: 'Use pale yellow or light pink directly over the fairy so her silhouette shines through clearly!',
        durationMinutes: 6,
      },
      {
        emoji: '✨',
        title: 'Dust with pixie sparkle',
        instruction:
          'While the outer coat of glue is still slightly damp, sprinkle a pinch of fine glitter around the jar so it shimmers in the light. Let dry for 10 minutes.',
        durationMinutes: 3,
      },
      {
        emoji: '🎀',
        title: 'Tie a bow and switch on the glow!',
        instruction:
          'Tie a satin ribbon or twine bow around the neck of the jar. Switch on your battery LED tea light, place it inside, and watch your enchanted fairy garden come alive!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'kumihimo-friendship-bracelet',
    title: 'Japanese Kumihimo Bracelet',
    summary: 'Weave a beautiful rounded braided friendship bracelet using a homemade circular cardboard loom!',
    storyIntro:
      'Learn the hypnotic rhythm of Japanese cord braiding! Using a simple cardboard wheel you make yourself, you will weave 7 colorful strands of thread into a thick, spiral-patterned friendship bracelet to wear or gift to your best friend.',
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
    skills: ['🧶 Traditional Weaving', '🔢 Counting & Pattern Rhythm', '💝 Jewelry Making'],
    funFacts: [
      'Kumihimo means "gathered threads" in Japanese and was historically used by samurai to braid colorful silk cords for their armor!',
      'Using 7 strings around an 8-notch wheel creates an automatic spiral pattern as you move every 3rd thread into the empty slot.',
      'Once you learn the "Count 3, Move Up, Turn" rhythm, your fingers can weave an entire bracelet while chatting or listening to music!',
    ],
    variations: [
      {
        emoji: '🌈',
        title: 'Candy Stripe Spiral Pattern',
        description: 'Use 4 pink strands and 3 mint-green strands for a swirling peppermint twist design!',
      },
      {
        emoji: '✨',
        title: 'Beaded Charm Centerpiece',
        description: 'Slide 3 shiny pony beads or a letter bead onto one strand halfway through weaving so it locks right into the middle of the braid!',
      },
      {
        emoji: '🎒',
        title: 'Backpack Keychain Tassel',
        description: 'Weave a shorter 10 cm cord and leave a fluffy 5 cm fringe at the bottom to clip onto your school backpack zipper!',
      },
    ],
    troubleshooting: [
      {
        question: 'I forgot where I was in the pattern!',
        answer: 'Always stop AFTER moving a string so all 7 strings are next to each other with 1 empty notch—when you pick it back up, put the empty notch at the top and count 3 clockwise!',
      },
      {
        question: 'The cardboard slits got loose.',
        answer: 'Cut the slits only 1 cm deep into stiff cereal-box or shipping-box cardboard so they grip the yarn snugly.',
      },
    ],
    materials: [
      { name: 'Stiff cardboard circle (trace a mug or bowl)', quantity: '1 disc (10 cm wide)' },
      { name: 'Embroidery floss or colorful thin yarn', quantity: '7 strands (45 cm each)' },
      { name: 'Pencil and ruler', quantity: '1 each' },
      { name: 'Rounded kid-safe scissors', quantity: '1 pair' },
      { name: 'Pony beads or letter beads', quantity: '2–3 beads', isOptional: true },
    ],
    steps: [
      {
        emoji: '⭕',
        title: 'Craft your 8-notch cardboard loom wheel',
        instruction:
          'Cut a 10 cm circle from sturdy cardboard. Draw lines like a pizza to mark 8 even points around the edge (top, bottom, left, right, and the 4 diagonals). Cut a 1 cm slit at each mark and poke a hole in the center.',
        durationMinutes: 5,
      },
      {
        emoji: '🪢',
        title: 'Knot and thread the 7 colorful strands',
        instruction:
          'Cut 7 strands of yarn or embroidery floss (each 45 cm long). Tie all 7 together in a knot at one end, and push the knot down through the center hole of the disc.',
        durationMinutes: 4,
      },
      {
        emoji: '🧭',
        title: 'Hook strings into 7 notches',
        instruction:
          'Spread the 7 strands out like sunbeams and hook one strand into each slit around the wheel—leaving the top slit (12 o’clock) completely EMPTY.',
        durationMinutes: 4,
      },
      {
        emoji: '🔄',
        title: 'Weave with the "Count 3 & Hop" rhythm',
        instruction:
          'Hold the wheel with the empty slit at the top. Count 3 strings clockwise to the right, unhook that 3rd string, and hop it into the top empty slit! Turn the wheel counter-clockwise so the new empty slit is at the top, and repeat!',
        tip: 'Say to yourself: "Empty at top, count 1-2-3 to the right, hop it up, turn!"',
        durationMinutes: 8,
      },
      {
        emoji: '💖',
        title: 'Finish and tie your bracelet!',
        instruction:
          'Keep weaving until a 15 cm braided cord grows out the bottom of the center hole. Unhook the strings, tie an overhand knot at the end, and tie your bracelet gently around your wrist!',
        durationMinutes: 4,
      },
    ],
  },
  {
    slug: 'yarn-wrapped-nature-heart',
    title: 'Yarn-Wrapped Nature Heart Wand',
    summary: 'Weave soft pastel yarns around a cardboard heart and attach a smooth garden twig to make a magical wand!',
    storyIntro:
      'Combine cozy yarn art with woodland treasures! In this relaxing tactile craft, you will wrap colorful wool in criss-cross geometric patterns around a heart frame and mount it onto a natural branch to create a whimsical fairy nature wand.',
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
    skills: ['🧶 Tactile Yarn Wrapping', '🌿 Nature Upcycling', '✨ Fine Motor Coordination'],
    funFacts: [
      'Wrapping yarn across different angles builds bilateral coordination—teaching both hands to work together smoothly!',
      'Many weavers and textile artists use cardboard looms to test color combinations before knitting sweaters or blankets.',
      'Adding small notches along the edge of cardboard keeps yarn from slipping off curved shapes like hearts and stars!',
    ],
    variations: [
      {
        emoji: '⭐',
        title: 'Shooting Star Ribbon Wand',
        description: 'Cut a 5-point cardboard star instead of a heart, wrap it in golden yellow yarn, and tie trailing pastel ribbons to the bottom!',
      },
      {
        emoji: '🌸',
        title: 'Daisy Flower Crown Wand',
        description: 'Tuck small artificial flowers, dried lavender, or paper blossoms under the criss-crossed yarn strings.',
      },
      {
        emoji: '🚪',
        title: 'Bedroom Door Name Hanger',
        description: 'Skip the twig handle and tie a top loop of yarn so your cozy wrapped heart hangs on your bedroom doorknob!',
      },
    ],
    troubleshooting: [
      {
        question: 'The yarn keeps sliding off the rounded sides of the heart!',
        answer: 'Snip tiny 3 mm V-notches around the outer edge of the cardboard heart so the yarn catches in the grooves.',
      },
      {
        question: 'The twig handle wobbles.',
        answer: 'Lay 5 cm of the twig flat against the back of the heart BEFORE wrapping the yarn so the yarn binds the stick tightly to the cardboard!',
      },
    ],
    materials: [
      { name: 'Sturdy cardboard heart cutout', quantity: '1 heart (12 cm wide)' },
      { name: 'Soft yarn in 2–3 colors (pink, lavender, cream, or gold)', quantity: '3–4 meters total' },
      { name: 'Smooth fallen garden twig or wooden dowel', quantity: '1 stick (25 cm)' },
      { name: 'Masking tape or clear tape', quantity: '2–3 strips' },
      { name: 'Rounded kid-safe scissors', quantity: '1 pair' },
      { name: 'Satin ribbons or pom-poms', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        emoji: '❤️',
        title: 'Cut and notch your cardboard heart',
        instruction:
          'Draw a plump heart shape on sturdy cardboard and cut it out. Snip tiny shallow notches around the perimeter so your yarn has places to grip.',
        durationMinutes: 3,
      },
      {
        emoji: '🪵',
        title: 'Secure the twig wand handle',
        instruction:
          'Place the top 5 cm of your smooth twig flat against the back center of the cardboard heart and tape it firmly in place.',
        durationMinutes: 2,
      },
      {
        emoji: '🧶',
        title: 'Criss-cross the first yarn color',
        instruction:
          'Tape the starting end of your yarn to the back of the heart. Wind the yarn up, down, and diagonally across the heart—wrapping right over the twig on the back too!',
        tip: 'Keep tension snug like a cozy sweater, not so tight that the heart bends.',
        durationMinutes: 5,
      },
      {
        emoji: '🌈',
        title: 'Layer in second and third colors',
        instruction:
          'Tie a second contrasting yarn color to the end of your first strand and continue winding until no bare cardboard shows through.',
        durationMinutes: 3,
      },
      {
        emoji: '✨',
        title: 'Tie streaming ribbons and make a wish!',
        instruction:
          'Tuck the final end of yarn securely under several loops at the back. Tie leftover yarn or ribbons below the heart so they flutter when you wave your wand!',
        durationMinutes: 2,
      },
    ],
  },
  {
    slug: 'felt-play-food-strawberries',
    title: 'Felt Sweet Strawberries',
    summary: 'Hand-stitch cute plush felt strawberries with green leafy tops for pretend kitchen tea parties!',
    storyIntro:
      'Welcome to the cozy plush bakery! Learn beginner hand-sewing skills using soft craft felt that never frays. With a simple cone fold and running stitch, you will craft plump, huggable strawberries topped with green felt leaves.',
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
    skills: ['🪡 Beginner Hand Sewing', '🧸 3D Plush Construction', '🍵 Pretend Play'],
    funFacts: [
      'Craft felt is the easiest fabric in the world for beginner sewers because its fibers are pressed together—so cut edges never unravel!',
      'Strawberries are the only fruit that wear their seeds on the outside—an average strawberry has about 200 tiny seeds!',
      'The "running stitch" (going up and down in a dashed line) is the foundational stitch used to gather fabric into round 3D shapes.',
    ],
    variations: [
      {
        emoji: '🍫',
        title: 'Chocolate-Dipped Felt Berry',
        description: 'Sew or glue a wavy band of brown felt around the bottom tip of your strawberry so it looks dipped in chocolate!',
      },
      {
        emoji: '😊',
        title: 'Kawaii Smiling Berry Plush',
        description: 'Use black and pink markers or thread to add two cute eyes and rosy cheeks to the front of your strawberry.',
      },
      {
        emoji: '📌',
        title: 'Sewing Kit Pincushion',
        description: 'Fill your strawberry extra firmly with stuffing or rice so it can hold pins and needles on a craft desk!',
      },
    ],
    troubleshooting: [
      {
        question: 'Idon’t have a sewing needle or want a no-sew version!',
        answer: 'You can make this 100% no-sew by using fabric glue or having an adult help with low-temp craft glue along the edges!',
      },
      {
        question: 'There is a tiny hole at the very bottom point of the cone.',
        answer: 'Make 2 extra crisscross stitches right at the pointy tip before turning the cone right-side out.',
      },
    ],
    materials: [
      { name: 'Bright red craft felt sheet', quantity: '1 half-circle (12 cm wide)' },
      { name: 'Green craft felt scrap (for leaves)', quantity: '1 square (5 × 5 cm)' },
      { name: 'Cotton balls or polyester toy stuffing', quantity: '3–4 fluffy balls' },
      { name: 'Blunt embroidery needle and red/white thread (or fabric glue)', quantity: '1 needle + 50 cm thread' },
      { name: 'Kid-safe scissors', quantity: '1 pair' },
      { name: 'White fabric paint or yellow thread for seeds', quantity: 'Optional', isOptional: true },
    ],
    steps: [
      {
        emoji: '🔴',
        title: 'Cut the red felt half-circle',
        instruction:
          'Trace a wide mug or small bowl (about 12 cm across) onto red felt. Cut out the circle, then cut it straight down the middle to make two half-circles (each makes 1 strawberry!).',
        durationMinutes: 4,
      },
      {
        emoji: '🪡',
        title: 'Fold and stitch into a cone pocket',
        instruction:
          'Fold one half-circle in half so the straight edges meet. Using a threaded needle (or fabric glue), sew small up-and-down stitches along the straight edge to form a cone.',
        safetyWarning: 'Sew slowly away from your fingers under adult supervision.',
        durationMinutes: 7,
      },
      {
        emoji: '☁️',
        title: 'Turn right-side out and stuff plump',
        instruction:
          'Turn the red felt cone right-side out so the seam hides inside. Use your finger to push torn pieces of cotton balls all the way into the tip until the berry is plump.',
        durationMinutes: 3,
      },
      {
        emoji: '🎀',
        title: 'Cinch the top closed with a gathering stitch',
        instruction:
          'Sew a wide running stitch all the way around the open top circle. Gently pull the thread tight like a drawstring bag until the top closes up, then tie a knot!',
        durationMinutes: 5,
      },
      {
        emoji: '🌿',
        title: 'Crown with green leaves and seed dots!',
        instruction:
          'Cut a 5-point green felt star for the leafy cap and stitch or glue it onto the top of your berry. Add tiny white or yellow seed stitches (or paint dots) around the sides!',
        tip: 'Use the second half-circle to make a twin strawberry for your pretend bakery!',
        durationMinutes: 6,
      },
    ],
  },
];

/**
 * Helper to look up rich static content (storyIntro, skills, funFacts, variations, troubleshooting, step emojis)
 * by guide slug so any guide loaded from SQLite is enriched with full browseable content.
 */
export function getStarterGuideRichContent(slug) {
  return STARTER_GUIDES.find((g) => g.slug === slug) || null;
}

/**
 * Seeds starter offline DIY guides and ensures all built-in guides
 * (including boy- and girl-tailored projects) and their materials/steps are present and up to date.
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
        // Ensure gender_target and metadata are synced for existing databases
        await db.runAsync(
          'UPDATE guides SET gender_target = ?, summary = ?, safety_note = ? WHERE id = ?;',
          [
            guide.genderTarget || 'all',
            guide.summary,
            guide.safetyNote ?? null,
            existing.id,
          ]
        );

        // Ensure materials exist and are populated
        const matCountRow = await db.getFirstAsync(
          'SELECT COUNT(*) AS count FROM materials WHERE guide_id = ?;',
          [existing.id]
        );
        if (!matCountRow || Number(matCountRow.count) === 0) {
          const materials = Array.isArray(guide.materials) ? guide.materials : [];
          for (let i = 0; i < materials.length; i += 1) {
            const item = materials[i];
            await db.runAsync(
              `INSERT INTO materials (guide_id, name, quantity, is_optional, is_checked, sort_order)
               VALUES (?, ?, ?, ?, 0, ?);`,
              [
                existing.id,
                item.name.trim(),
                item.quantity ? item.quantity.trim() : null,
                item.isOptional ? 1 : 0,
                i + 1,
              ]
            );
          }
        }

        // Ensure steps exist and are populated
        const stepCountRow = await db.getFirstAsync(
          'SELECT COUNT(*) AS count FROM steps WHERE guide_id = ?;',
          [existing.id]
        );
        if (!stepCountRow || Number(stepCountRow.count) === 0) {
          const steps = Array.isArray(guide.steps) ? guide.steps : [];
          for (let i = 0; i < steps.length; i += 1) {
            const step = steps[i];
            await db.runAsync(
              `INSERT INTO steps (
                guide_id, step_number, title, instruction, tip, safety_warning, duration_minutes, is_completed
              ) VALUES (?, ?, ?, ?, ?, ?, ?, 0);`,
              [
                existing.id,
                i + 1,
                step.title.trim(),
                step.instruction.trim(),
                step.tip ? step.tip.trim() : null,
                step.safetyWarning ? step.safetyWarning.trim() : null,
                step.durationMinutes ?? null,
              ]
            );
          }
        }
      }
    }
  });

  return seededCount > 0;
}
