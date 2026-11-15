import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { createAppModuleLoader } from './helpers/moduleLoader.mjs';
import { createMemoryDb } from './helpers/sqliteAdapter.mjs';

const { load } = createAppModuleLoader();
const { DATABASE_NAME, DATABASE_VERSION, initializeDatabase } = load('db/schema.js');
const { createCustomGuide } = load('db/guidesRepository.js');

describe('SQLite Schema & Migrations', () => {
  let db;

  afterEach(() => {
    if (db) {
      db.close();
      db = null;
    }
  });

  it('exports the expected database name and schema version', () => {
    assert.equal(DATABASE_NAME, 'ideanook.db');
    assert.equal(DATABASE_VERSION, 3);
  });

  it('creates all required tables, indexes, and foreign-key pragmas on initialization', async () => {
    db = createMemoryDb();
    await initializeDatabase(db);

    const versionRow = await db.getFirstAsync('PRAGMA user_version;');
    assert.equal(versionRow.user_version, 3);

    const fkRow = await db.getFirstAsync('PRAGMA foreign_keys;');
    assert.equal(fkRow.foreign_keys, 1);

    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;"
    );
    const tableNames = tables.map((t) => t.name);

    for (const expected of [
      'guides',
      'materials',
      'steps',
      'guide_progress',
      'user_profile',
    ]) {
      assert.ok(tableNames.includes(expected), `Missing table: ${expected}`);
    }

    const indexes = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type = 'index';"
    );
    const indexNames = indexes.map((i) => i.name);

    for (const expectedIdx of [
      'idx_guides_category',
      'idx_guides_favorite',
      'idx_guides_gender',
      'idx_materials_guide',
      'idx_steps_guide',
    ]) {
      assert.ok(indexNames.includes(expectedIdx), `Missing index: ${expectedIdx}`);
    }
  });

  it('is idempotent when initializeDatabase runs multiple times', async () => {
    db = createMemoryDb();
    await initializeDatabase(db);
    await initializeDatabase(db);

    const countRow = await db.getFirstAsync('SELECT COUNT(*) AS count FROM guides;');
    assert.equal(countRow.count, 14);
  });

  it('cascades deletes from guides to materials, steps, and guide_progress', async () => {
    db = createMemoryDb();
    await initializeDatabase(db);

    const created = await createCustomGuide(db, {
      title: 'Cascade Test Craft',
      summary: 'Testing foreign key cascade',
      category: 'Paper & Origami',
      materials: [{ name: 'Paper', quantity: '1 sheet' }],
      steps: [{ title: 'Fold paper', instruction: 'Fold it in half.' }],
    });

    await db.runAsync('DELETE FROM guides WHERE id = ?;', [created.id]);

    const matCount = await db.getFirstAsync(
      'SELECT COUNT(*) AS count FROM materials WHERE guide_id = ?;',
      [created.id]
    );
    const stepCount = await db.getFirstAsync(
      'SELECT COUNT(*) AS count FROM steps WHERE guide_id = ?;',
      [created.id]
    );
    const progCount = await db.getFirstAsync(
      'SELECT COUNT(*) AS count FROM guide_progress WHERE guide_id = ?;',
      [created.id]
    );

    assert.equal(matCount.count, 0);
    assert.equal(stepCount.count, 0);
    assert.equal(progCount.count, 0);
  });
});
