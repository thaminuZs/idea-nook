import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createAppModuleLoader } from './helpers/moduleLoader.mjs';

const require = createRequire(import.meta.url);
const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const { load } = createAppModuleLoader();

const { Colors, Fonts } = load('constants/Colors.js');
const { PROJECT_IMAGES, getProjectImage, resolveProjectEmoji } = load(
  'constants/ProjectImages.js'
);
const { resolveIconName } = load('components/AppIcon.jsx');
const { STARTER_GUIDES } = load('db/seed.js');

describe('Offline Fonts, Icons, Theme Colors & Project PNG Assets', () => {
  it('defines light and dark themes with matching keys and distinct borders', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    assert.deepEqual(lightKeys, darkKeys);
    assert.ok(Colors.light.border !== Colors.light.surface);
    assert.ok(Colors.dark.border !== Colors.dark.surface);
  });

  it('registers offline Google Fonts and UI fonts in Fonts constant and disk assets', () => {
    assert.equal(Fonts.heading, 'Audiowide_400Regular');
    assert.equal(Fonts.brandTitle, 'BlackOpsOne_400Regular');
    assert.equal(Fonts.regular, 'Montserrat_400Regular');

    const fontFiles = [
      'Montserrat-Regular.ttf',
      'Montserrat-Medium.ttf',
      'Montserrat-SemiBold.ttf',
      'Montserrat-Bold.ttf',
      'Montserrat-ExtraBold.ttf',
      'Audiowide-Regular.ttf',
      'BlackOpsOne-Regular.ttf',
      'MaterialCommunityIcons.ttf',
    ];

    for (const file of fontFiles) {
      const fullPath = path.join(PROJECT_ROOT, 'assets/fonts', file);
      assert.ok(fs.existsSync(fullPath), `Missing font asset: ${file}`);
      const buf = fs.readFileSync(fullPath);
      assert.ok(buf.length > 1024, `Font asset looks empty/corrupt: ${file}`);
      // Valid TrueType font magic bytes: 0x00 0x01 0x00 0x00 or 'OTTO'
      const isTtf = buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00;
      const isOtf = buf.subarray(0, 4).toString('ascii') === 'OTTO';
      assert.ok(isTtf || isOtf, `Invalid font header in ${file}`);
    }
  });

  it('bundles valid local PNG outcome images for every starter DIY project', () => {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    for (const guide of STARTER_GUIDES) {
      const assetPath = getProjectImage(guide.slug);
      assert.ok(assetPath, `Missing PNG mapping for starter slug: ${guide.slug}`);
      assert.ok(fs.existsSync(assetPath), `Missing PNG file on disk: ${assetPath}`);

      const buf = fs.readFileSync(assetPath);
      assert.ok(buf.subarray(0, 8).equals(pngSignature), `Invalid PNG signature: ${assetPath}`);
    }

    assert.equal(Object.keys(PROJECT_IMAGES).length, STARTER_GUIDES.length);
    assert.equal(getProjectImage('non-existent-slug'), null);
  });

  it('always resolves DIY project icons to emojis (even when given legacy vector names)', () => {
    assert.equal(resolveProjectEmoji('🚀', 'blast-off-paper-tube-rocket'), '🚀');
    assert.equal(resolveProjectEmoji('rocket-launch', 'blast-off-paper-tube-rocket'), '🚀');
    assert.equal(resolveProjectEmoji('flask', null), '🌋');
    assert.equal(resolveProjectEmoji(null, null), '🎨');
  });

  it('validates every MaterialCommunityIcons glyph referenced in UI code and ICON_MAP', () => {
    const glyphMap = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');

    const uiIcons = [
      'star-four-points',
      'compass-outline',
      'account-circle-outline',
      'weather-night',
      'weather-sunny',
      'heart',
      'heart-outline',
      'check',
      'check-circle',
      'clock-outline',
      'hammer-wrench',
      'arrow-right',
      'arrow-left',
      'magnify',
      'close',
      'star',
      'star-outline',
      'trophy',
      'restart',
      'bag-personal',
      'lightbulb-on-outline',
      'palette',
      'account-supervisor',
      'alert-circle-outline',
      'chevron-up',
      'chevron-down',
      'human-male',
      'human-female',
      'star-circle',
      'paw',
      'pencil',
      'cake-variant',
      'shield-star',
      'rocket-launch',
      'unicorn-variant',
      'bone',
      'robot',
      'panda',
    ];

    for (const icon of uiIcons) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(glyphMap, icon),
        `UI icon not found in MaterialCommunityIcons glyphmap: ${icon}`
      );
    }

    // Legacy emoji-to-vector resolution
    for (const emoji of ['🚀', '🌋', '🌟', '🦁', '🦄', '🤖', '🐼']) {
      const resolved = resolveIconName(emoji);
      assert.ok(
        Object.prototype.hasOwnProperty.call(glyphMap, resolved),
        `Mapped icon "${resolved}" for "${emoji}" not in glyphmap`
      );
    }
  });

  it('checks app.json Expo configuration for adaptive theme and bundled plugins', () => {
    const appJson = JSON.parse(
      fs.readFileSync(path.join(PROJECT_ROOT, 'app.json'), 'utf8')
    );

    assert.equal(appJson.expo.userInterfaceStyle, 'automatic');
    assert.ok(appJson.expo.backgroundColor);
    assert.ok(appJson.expo.androidNavigationBar);
    assert.ok(appJson.expo.plugins.includes('expo-router'));
    assert.ok(appJson.expo.plugins.includes('expo-sqlite'));
    assert.ok(appJson.expo.plugins.includes('expo-font'));
  });
});
