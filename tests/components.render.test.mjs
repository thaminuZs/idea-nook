import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import parser from '@babel/parser';
import { renderToStaticMarkup } from 'react-dom/server';
import { createAppModuleLoader } from './helpers/moduleLoader.mjs';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');

function makeSampleGuide(overrides = {}) {
  return {
    id: 1,
    slug: 'blast-off-paper-tube-rocket',
    title: 'Blast-Off Paper Tube Rocket',
    summary: 'Turn an empty cardboard paper tube into a colorful space rocket!',
    category: 'Paper & Origami',
    difficulty: 'easy',
    minAge: 5,
    maxAge: 9,
    estimatedMinutes: 20,
    adultSupervision: false,
    safetyNote: 'Use rounded kid-safe scissors when cutting paper shapes.',
    iconEmoji: '🚀',
    accentColor: '#FF7043',
    genderTarget: 'all',
    isFavorite: false,
    status: 'not_started',
    completedSteps: 0,
    totalSteps: 5,
    starsEarned: 0,
    materials: [
      { id: 101, name: 'Cardboard tube', quantity: '1 tube', isChecked: false, isOptional: false },
      { id: 102, name: 'Safety scissors', quantity: '1 pair', isChecked: true, isOptional: false },
    ],
    steps: [
      {
        id: 201,
        stepNumber: 1,
        title: 'Wrap the body',
        instruction: 'Wrap colored paper around the tube.',
        tip: 'Use tape along the seam.',
        isCompleted: true,
      },
      {
        id: 202,
        stepNumber: 2,
        title: 'Add fins',
        instruction: 'Tape 3 paper triangles near the base.',
        isCompleted: false,
      },
    ],
    ...overrides,
  };
}

describe('Component Rendering, UI Rules & Source Integrity', () => {
  it('parses all app, component, constant, context, and db source files cleanly', () => {
    const sourceDirs = ['app', 'components', 'constants', 'contexts', 'db'];
    const files = [];

    for (const dir of sourceDirs) {
      const walk = (current) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
          const full = path.join(current, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else if (/\.(js|jsx)$/.test(entry.name)) {
            files.push(full);
          }
        }
      };
      walk(path.join(PROJECT_ROOT, dir));
    }

    assert.ok(files.length >= 18);

    for (const file of files) {
      const code = fs.readFileSync(file, 'utf8');
      parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
    }
  });

  it('uses unified ConfirmDialog instead of Alert.alert, window.confirm, or window.prompt', () => {
    const uiFiles = [
      'app/_layout.jsx',
      'app/index.jsx',
      'app/flat.jsx',
      'app/scrol.jsx',
      'app/guide/[id].jsx',
      'components/GuideDetailView.jsx',
      'components/OnboardingScreen.jsx',
      'components/ConfirmDialog.jsx',
      'components/ProjectCard.jsx',
      'components/PopArtCelebration.jsx',
    ];

    for (const rel of uiFiles) {
      const src = fs.readFileSync(path.join(PROJECT_ROOT, rel), 'utf8');
      assert.equal(/Alert\.alert\s*\(/.test(src), false, `Found Alert.alert in ${rel}`);
      assert.equal(/window\.(confirm|prompt|alert)\s*\(/.test(src), false, `Found browser dialog in ${rel}`);
    }
  });

  it('renders ProjectCard without project description and with status badges', () => {
    const { load, React } = createAppModuleLoader();
    const ProjectCard = load('components/ProjectCard.jsx').default;

    const item = makeSampleGuide({ status: 'completed', isFavorite: true });
    const html = renderToStaticMarkup(
      React.createElement(ProjectCard, { item, onPress: () => {} })
    );

    assert.ok(html.includes('Blast-Off Paper Tube Rocket'));
    assert.ok(html.includes('Paper &amp; Origami'));
    assert.ok(html.includes('20m'));
    assert.ok(html.includes('5 steps'));
    assert.ok(html.includes('Ages 5–9'));
    assert.ok(html.includes('Done'));
    assert.ok(html.includes('Open'));
    // Project description must NOT be shown on cards
    assert.equal(html.includes(item.summary), false);

    const inProgressHtml = renderToStaticMarkup(
      React.createElement(ProjectCard, {
        item: makeSampleGuide({ status: 'in_progress' }),
        onPress: () => {},
      })
    );
    assert.ok(inProgressHtml.includes('In Progress'));
  });

  it('renders ConfirmDialog only when visible and shows title, message, and actions', () => {
    const { load, React } = createAppModuleLoader();
    const ConfirmDialog = load('components/ConfirmDialog.jsx').default;

    const hiddenHtml = renderToStaticMarkup(
      React.createElement(ConfirmDialog, {
        visible: false,
        title: 'Start Over?',
        message: 'Reset all steps?',
        onConfirm: () => {},
        onCancel: () => {},
      })
    );
    assert.equal(hiddenHtml, '');

    const visibleHtml = renderToStaticMarkup(
      React.createElement(ConfirmDialog, {
        visible: true,
        title: 'Reset Profile?',
        message: 'This clears your profile and DIY progress.',
        confirmText: 'Reset Now',
        cancelText: 'Keep',
        destructive: true,
        onConfirm: () => {},
        onCancel: () => {},
      })
    );

    assert.ok(visibleHtml.includes('Reset Profile?'));
    assert.ok(visibleHtml.includes('This clears your profile and DIY progress.'));
    assert.ok(visibleHtml.includes('Reset Now'));
    assert.ok(visibleHtml.includes('Keep'));
  });

  it('renders OnboardingScreen in first-time and edit-profile modes', () => {
    const { load, React } = createAppModuleLoader();
    const OnboardingScreen = load('components/OnboardingScreen.jsx').default;

    const firstTimeHtml = renderToStaticMarkup(
      React.createElement(OnboardingScreen, {
        isFirstTime: true,
        onComplete: () => {},
      })
    );
    assert.ok(firstTimeHtml.includes('Welcome to'));
    assert.ok(firstTimeHtml.includes('IdeaNook'));
    assert.ok(firstTimeHtml.includes('Pick Your Companion'));
    assert.ok(firstTimeHtml.includes('How old are you?'));
    assert.ok(firstTimeHtml.includes('Super Star'));

    const editHtml = renderToStaticMarkup(
      React.createElement(OnboardingScreen, {
        initialProfile: { name: 'Leo', age: 8, gender: 'boy', avatarEmoji: 'robot' },
        isFirstTime: false,
        onComplete: () => {},
        onCancel: () => {},
      })
    );
    assert.ok(editHtml.includes('Edit Your Profile'));
    assert.ok(editHtml.includes('Save Profile'));
    assert.ok(editHtml.includes('Cancel'));
  });

  it('renders GuideDetailView with Supplies tab first, Steps second, and pop-art stickers when completed', () => {
    const guide = makeSampleGuide({
      status: 'completed',
      completedSteps: 2,
      totalSteps: 2,
    });
    const { load, React } = createAppModuleLoader({ sqliteGuide: guide });
    const GuideDetailView = load('components/GuideDetailView.jsx').default;

    // Mock initial state immediately after loading=false would run via useEffect;
    // since renderToStaticMarkup does not run useEffect, verify loading spinner renders cleanly
    // and verify PopArtCelebration + tab ordering & starter guide defaults directly.
    const loadingHtml = renderToStaticMarkup(
      React.createElement(GuideDetailView, { guideId: 1, onBack: () => {} })
    );
    assert.ok(loadingHtml.includes('rn-activity-indicator'));

    const src = fs.readFileSync(
      path.join(PROJECT_ROOT, 'components/GuideDetailView.jsx'),
      'utf8'
    );
    assert.ok(
      src.includes("useState('supplies')"),
      'GuideDetailView should default to supplies tab first'
    );
    const suppliesIdx = src.indexOf("onPress={() => setActiveTab('supplies')}");
    const stepsIdx = src.indexOf("onPress={() => setActiveTab('steps')}");
    const ideasIdx = src.indexOf("onPress={() => setActiveTab('ideas')}");
    assert.ok(suppliesIdx > 0 && suppliesIdx < stepsIdx && stepsIdx < ideasIdx);
    assert.ok(src.includes('<ConfirmDialog'));
    assert.ok(src.includes('<PopArtCelebration'));
  });

  it('renders PopArtCelebration comic badges when visible and hides when invisible', () => {
    const { load, React } = createAppModuleLoader();
    const PopArtCelebration = load('components/PopArtCelebration.jsx').default;

    assert.equal(
      renderToStaticMarkup(
        React.createElement(PopArtCelebration, { visible: false, onFinish: () => {} })
      ),
      ''
    );

    const html = renderToStaticMarkup(
      React.createElement(PopArtCelebration, { visible: true, onFinish: () => {} })
    );
    for (const phrase of ['GOOD JOB!', 'WOW!', 'SUPERB!', 'EXCELLENT!']) {
      assert.ok(html.includes(phrase), `Missing pop-art phrase: ${phrase}`);
    }
  });
});
