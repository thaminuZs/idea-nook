# IdeaNook

An offline-first DIY project guide mobile app for children built with Expo, React Native, Expo Router, and SQLite.

## Overview

IdeaNook provides kid-friendly, step-by-step craft and STEM activity guides that work completely offline. All starter projects, outcome illustrations, UI icons, fonts, and user progress are stored locally on the device.

### Key Features

- Offline-first library of 14 DIY projects for children
- Personalized For You feed based on child age and profile
- Explore view with search, audience filters, and category selector
- Step-by-step guide reader with Supplies checklist, Steps tracking, and Tips & Facts
- Local SQLite persistence for profile, favorites, stars, and progress
- Light and dark theme support with bundled fonts and icons

## Tech Stack

- **Framework**: Expo (`~58.0.23`), React Native (`0.88.1`), React (`19.3.0`)
- **Navigation**: Expo Router (`~58.0.30`)
- **Database**: `expo-sqlite` (`~58.0.16`) with WAL mode (native) and Metro WASM/COOP/COEP headers (`metro.config.js`) for Web
- **Icons & Fonts**: `@expo/vector-icons` (`MaterialCommunityIcons`) and `expo-font`

## Getting Started

### Prerequisites

- Node.js (LTS)
- Expo CLI (`npx expo`)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the Expo development server
npm start

# Launch directly on a platform
npm run android
npm run ios
npm run web
```

### Verification Commands

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

## Project Structure

```text
ideanook/
├── app/
│   ├── _layout.jsx          # Root providers, font loading, tabs, and navigation theme
│   ├── index.jsx            # For You personalized feed screen
│   ├── flat.jsx             # Explore screen with search, audience filters, and category select
│   ├── scrol.jsx            # Profile, progress stats, and saved/active projects
│   └── guide/[id].jsx       # Direct route wrapper for DIY guide details
├── assets/
│   ├── fonts/               # Bundled TTF fonts (Montserrat, Audiowide, Black Ops One, icons)
│   └── projects/new-pngs/   # Local PNG outcome illustrations for all 14 projects
├── components/
│   ├── AppIcon.jsx          # Offline MaterialCommunityIcons wrapper
│   ├── ConfirmDialog.jsx    # Shared themed confirmation modal
│   ├── GuideDetailView.jsx  # Guide hero, Supplies/Steps/Tips tabs, and progress actions
│   ├── OnboardingScreen.jsx # Profile creation and edit screen
│   ├── PopArtCelebration.jsx# Animated completion badge overlay
│   └── ProjectCard.jsx      # Compact project summary card
├── constants/
│   ├── Colors.js            # Light/dark palettes and bundled font keys
│   └── ProjectImages.js     # Static PNG mapping and emoji fallback helpers
├── contexts/
│   ├── ProfileContext.jsx   # Child profile state synced with SQLite
│   └── ThemeContext.jsx     # Light/dark theme and native/web system bar sync
├── db/
│   ├── index.js             # Public database exports
│   ├── schema.js            # Versioned SQLite migrations (guides, materials, steps, progress, profile)
│   ├── seed.js              # 14 starter DIY guides and rich step/tip/variation content
│   ├── guidesRepository.js  # CRUD, filtering, step/material toggles, and progress stats
│   └── profileRepository.js # Profile persistence and full progress reset
├── app.json                 # Expo app configuration
└── metro.config.js          # WASM support and cross-origin isolation headers for SQLite on Web
```

## Database Schema

The SQLite database (`ideanook.db`, schema version `3`) includes:

- `guides`: Project metadata, category, difficulty, age range, `gender_target`, and favorite flag.
- `materials`: Supplies per guide with quantity, optional flag, and checked state.
- `steps`: Ordered step instructions, tips, safety warnings, and completion state.
- `guide_progress`: Tracks `not_started` / `in_progress` / `completed` status, current step, stars earned, and timestamps.
- `user_profile`: Single active profile (`id = 1`) storing name, age, gender badge, and companion icon.

## License

See [LICENSE](LICENSE).
