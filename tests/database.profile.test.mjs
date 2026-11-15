import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createAppModuleLoader } from './helpers/moduleLoader.mjs';
import { createMemoryDb } from './helpers/sqliteAdapter.mjs';

const { load } = createAppModuleLoader();
const { initializeDatabase } = load('db/schema.js');
const { getUserProfile, saveUserProfile, clearUserProfile } = load('db/profileRepository.js');
const {
  getDashboardStats,
  getGuideById,
  getGuides,
  resetAllGuidesProgress,
  setStepCompleted,
  toggleFavorite,
  toggleMaterialChecked,
} = load('db/guidesRepository.js');

describe('Child Profile Repository & Full Progress Reset', () => {
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

  it('returns null when no child profile exists yet', async () => {
    assert.equal(await getUserProfile(db), null);
  });

  it('validates name, age bounds (1-18), and gender badge before saving', async () => {
    await assert.rejects(
      () => saveUserProfile(db, { name: '   ', age: 8, gender: 'boy' }),
      /name/
    );
    await assert.rejects(
      () => saveUserProfile(db, { name: 'Leo', age: 0, gender: 'boy' }),
      /age/
    );
    await assert.rejects(
      () => saveUserProfile(db, { name: 'Leo', age: 19, gender: 'boy' }),
      /age/
    );
    await assert.rejects(
      () => saveUserProfile(db, { name: 'Leo', age: 8, gender: '' }),
      /gender/
    );
  });

  it('saves and updates single profile row (id = 1)', async () => {
    const created = await saveUserProfile(db, {
      name: '  Maya ',
      age: 7,
      gender: 'GIRL',
      avatarEmoji: 'unicorn-variant',
    });

    assert.equal(created.id, 1);
    assert.equal(created.name, 'Maya');
    assert.equal(created.age, 7);
    assert.equal(created.gender, 'girl');
    assert.equal(created.avatarEmoji, 'unicorn-variant');

    const updated = await saveUserProfile(db, {
      name: 'Maya K',
      age: 8,
      gender: 'other',
      avatarEmoji: 'rocket-launch',
    });

    assert.equal(updated.name, 'Maya K');
    assert.equal(updated.age, 8);
    assert.equal(updated.gender, 'other');
    assert.equal(updated.createdAt, created.createdAt);
  });

  it('resets all DIY project statuses, steps, checked materials, favorites, and stars when clearing profile', async () => {
    await saveUserProfile(db, {
      name: 'Sam',
      age: 9,
      gender: 'boy',
      avatarEmoji: 'robot',
    });

    const [rocketSummary] = await getGuides(db, { search: 'Rocket' });
    const detail = await getGuideById(db, rocketSummary.id);

    await toggleFavorite(db, rocketSummary.id);
    await toggleMaterialChecked(db, detail.materials[0].id);
    for (const step of detail.steps) {
      await setStepCompleted(db, rocketSummary.id, step.id, true);
    }

    let stats = await getDashboardStats(db);
    assert.equal(stats.completedGuides, 1);
    assert.equal(stats.favoriteGuides, 1);
    assert.equal(stats.totalStars, 3);

    await clearUserProfile(db);

    assert.equal(await getUserProfile(db), null);

    stats = await getDashboardStats(db);
    assert.equal(stats.completedGuides, 0);
    assert.equal(stats.inProgressGuides, 0);
    assert.equal(stats.favoriteGuides, 0);
    assert.equal(stats.totalStars, 0);

    const resetDetail = await getGuideById(db, rocketSummary.id);
    assert.equal(resetDetail.status, 'not_started');
    assert.equal(resetDetail.completedSteps, 0);
    assert.equal(resetDetail.checkedMaterials, 0);
    assert.equal(resetDetail.isFavorite, false);
  });

  it('supports resetAllGuidesProgress independently of profile deletion', async () => {
    await saveUserProfile(db, { name: 'Mia', age: 6, gender: 'girl' });
    const [volcanoSummary] = await getGuides(db, { search: 'Volcano' });
    const detail = await getGuideById(db, volcanoSummary.id);
    await setStepCompleted(db, volcanoSummary.id, detail.steps[0].id, true);

    await resetAllGuidesProgress(db);

    assert.ok(await getUserProfile(db));
    const afterReset = await getGuideById(db, volcanoSummary.id);
    assert.equal(afterReset.status, 'not_started');
    assert.equal(afterReset.completedSteps, 0);
  });
});
