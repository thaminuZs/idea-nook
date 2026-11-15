import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createAppModuleLoader } from './helpers/moduleLoader.mjs';
import { createMemoryDb } from './helpers/sqliteAdapter.mjs';

const { load } = createAppModuleLoader();
const { initializeDatabase } = load('db/schema.js');
const { STARTER_GUIDES, getStarterGuideRichContent, seedInitialGuides } = load('db/seed.js');
const {
  createCustomGuide,
  deleteCustomGuide,
  getCategories,
  getDashboardStats,
  getGuideById,
  getGuides,
  resetGuideMaterials,
  resetGuideProgress,
  setCurrentStep,
  setStepCompleted,
  toggleFavorite,
  toggleMaterialChecked,
  toggleStepCompleted,
} = load('db/guidesRepository.js');

describe('DIY Guides Seed & Repository', () => {
  let db;

  beforeEach(async () => {
    db = createMemoryDb();
    await initializeDatabase(db);
  });

  afterEach(() => {
    if (db) {
      db.close();
      db = null;
    }
  });

  it('seeds all 14 starter guides with materials, steps, and rich metadata', async () => {
    const guides = await getGuides(db);
    assert.equal(guides.length, 14);
    assert.equal(STARTER_GUIDES.length, 14);

    const expectedCategories = new Set([
      'Paper & Origami',
      'Science & Sensory',
      'Nature & Recycled',
      'STEM & Toys',
      'Wearables & Decor',
    ]);

    for (const g of guides) {
      assert.ok(expectedCategories.has(g.category), `Unexpected category ${g.category}`);
      assert.equal(g.status, 'not_started');
      assert.ok(g.totalSteps >= 4, `Expected >= 4 steps for ${g.slug}`);
      assert.ok(g.totalMaterials >= 3, `Expected >= 3 materials for ${g.slug}`);

      const rich = getStarterGuideRichContent(g.slug);
      assert.ok(rich, `Missing rich content for ${g.slug}`);
      assert.ok(rich.storyIntro.length > 20);
      assert.ok(Array.isArray(rich.funFacts) && rich.funFacts.length >= 2);
      assert.ok(Array.isArray(rich.variations) && rich.variations.length >= 2);
      assert.ok(Array.isArray(rich.troubleshooting) && rich.troubleshooting.length >= 2);
    }

    const categories = await getCategories(db);
    assert.equal(categories.length, 5);
  });

  it('re-seeds empty materials/steps gracefully and syncs existing metadata', async () => {
    const [first] = await getGuides(db, { search: 'Rocket' });
    await db.runAsync('DELETE FROM materials WHERE guide_id = ?;', [first.id]);
    await db.runAsync('DELETE FROM steps WHERE guide_id = ?;', [first.id]);
    await db.runAsync("UPDATE guides SET category = 'Legacy' WHERE id = ?;", [first.id]);

    await seedInitialGuides(db);
    const restored = await getGuideById(db, first.id);
    assert.equal(restored.category, 'Paper & Origami');
    assert.ok(restored.materials.length > 0);
    assert.ok(restored.steps.length > 0);
  });

  it('filters guides by audience, age, category, difficulty, favorites, and search (including LIKE wildcards)', async () => {
    const boyExact = await getGuides(db, { exactGender: 'boy' });
    const girlExact = await getGuides(db, { exactGender: 'girl' });
    const unisexExact = await getGuides(db, { exactGender: 'all' });
    assert.equal(boyExact.length, 4);
    assert.equal(girlExact.length, 4);
    assert.equal(unisexExact.length, 6);

    const boyFeed = await getGuides(db, { genderTarget: 'boy' });
    const girlFeed = await getGuides(db, { genderTarget: 'girl' });
    assert.equal(boyFeed.length, 10);
    assert.equal(girlFeed.length, 10);

    const science = await getGuides(db, { category: 'Science & Sensory' });
    assert.equal(science.length, 3);

    const wildPercent = await getGuides(db, { search: '%' });
    const wildUnderscore = await getGuides(db, { search: '_' });
    assert.equal(wildPercent.length, 0);
    assert.equal(wildUnderscore.length, 0);

    const rocket = await getGuides(db, { search: 'Rocket' });
    assert.equal(rocket.length, 1);
    assert.equal(rocket[0].slug, 'blast-off-paper-tube-rocket');
  });

  it('returns null for missing guide ID and loads full ordered details for valid ID', async () => {
    assert.equal(await getGuideById(db, 99999), null);

    const [rocketSummary] = await getGuides(db, { search: 'Rocket' });
    const detail = await getGuideById(db, rocketSummary.id);
    assert.equal(detail.materials.length, 6);
    assert.equal(detail.steps.length, 5);
    assert.equal(detail.steps[0].stepNumber, 1);
    assert.equal(detail.steps[4].stepNumber, 5);
  });

  it('toggles favorites and material checklists accurately', async () => {
    const [rocketSummary] = await getGuides(db, { search: 'Rocket' });
    assert.equal(await toggleFavorite(db, rocketSummary.id), true);
    assert.equal((await getGuides(db, { favoritesOnly: true })).length, 1);
    assert.equal(await toggleFavorite(db, rocketSummary.id), false);
    assert.equal(await toggleFavorite(db, 99999), null);

    const detail = await getGuideById(db, rocketSummary.id);
    const matRes = await toggleMaterialChecked(db, detail.materials[0].id);
    assert.equal(matRes.isChecked, true);

    await resetGuideMaterials(db, rocketSummary.id);
    const afterReset = await getGuideById(db, rocketSummary.id);
    assert.equal(afterReset.checkedMaterials, 0);
  });

  it('tracks step progression, stars, dashboard stats, and single-guide reset', async () => {
    const [rocketSummary] = await getGuides(db, { search: 'Rocket' });
    const detail = await getGuideById(db, rocketSummary.id);

    // Step 1 -> in_progress
    const step1 = await toggleStepCompleted(db, rocketSummary.id, detail.steps[0].id);
    assert.equal(step1.isCompleted, true);
    assert.equal(step1.status, 'in_progress');
    assert.equal(step1.currentStep, 2);
    assert.equal(step1.starsEarned, 0);

    // Remaining steps -> completed (3 stars)
    for (let i = 1; i < detail.steps.length; i += 1) {
      await setStepCompleted(db, rocketSummary.id, detail.steps[i].id, true);
    }

    let updated = await getGuideById(db, rocketSummary.id);
    assert.equal(updated.status, 'completed');
    assert.equal(updated.starsEarned, 3);
    assert.ok(updated.completedAt);

    let stats = await getDashboardStats(db);
    assert.equal(stats.completedGuides, 1);
    assert.equal(stats.totalStars, 3);

    // Unchecking one step reverts completed -> in_progress (0 stars)
    await setStepCompleted(db, rocketSummary.id, detail.steps[2].id, false);
    updated = await getGuideById(db, rocketSummary.id);
    assert.equal(updated.status, 'in_progress');
    assert.equal(updated.starsEarned, 0);
    assert.equal(updated.currentStep, 3);

    // Full reset on guide restores initial state
    await setCurrentStep(db, rocketSummary.id, 4);
    await resetGuideProgress(db, rocketSummary.id);
    updated = await getGuideById(db, rocketSummary.id);
    assert.equal(updated.status, 'not_started');
    assert.equal(updated.completedSteps, 0);
    assert.equal(updated.checkedMaterials, 0);
    assert.equal(updated.starsEarned, 0);
    assert.equal(updated.currentStep, 1);
  });

  it('validates custom guide creation and protects built-in guides from deletion', async () => {
    await assert.rejects(
      () => createCustomGuide(db, { title: '', summary: 'x', category: 'y', steps: [] }),
      /required/
    );

    await assert.rejects(
      () =>
        createCustomGuide(db, {
          title: 'Valid Title',
          summary: 'Valid summary',
          category: 'STEM & Toys',
          steps: [],
        }),
      /at least one step/
    );

    const [starter] = await getGuides(db, { search: 'Rocket' });
    assert.equal(await deleteCustomGuide(db, starter.id), false);

    const custom = await createCustomGuide(db, {
      title: 'Cardboard Periscope',
      summary: 'See around corners using two small mirrors.',
      category: 'STEM & Toys',
      difficulty: 'medium',
      minAge: 7,
      maxAge: 12,
      estimatedMinutes: 25,
      materials: [{ name: 'Milk carton', quantity: '1' }],
      steps: [{ title: 'Cut viewing slots', instruction: 'Cut holes on opposite ends.' }],
    });

    assert.equal(custom.isCustom, true);
    assert.equal(await deleteCustomGuide(db, custom.id), true);
    assert.equal(await getGuideById(db, custom.id), null);
  });
});
