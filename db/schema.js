import { Platform } from 'react-native';
import { seedInitialGuides } from './seed';

export const DATABASE_NAME = 'ideanook.db';
export const DATABASE_VERSION = 1;

const MIGRATIONS = [
  {
    version: 1,
    async up(db) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS guides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          category TEXT NOT NULL,
          difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
          min_age INTEGER NOT NULL DEFAULT 5,
          max_age INTEGER NOT NULL DEFAULT 12,
          estimated_minutes INTEGER NOT NULL DEFAULT 15,
          adult_supervision INTEGER NOT NULL DEFAULT 0,
          safety_note TEXT,
          icon_emoji TEXT NOT NULL DEFAULT '🎨',
          accent_color TEXT NOT NULL DEFAULT '#FF8A65',
          is_favorite INTEGER NOT NULL DEFAULT 0,
          is_custom INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS materials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guide_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          quantity TEXT,
          is_optional INTEGER NOT NULL DEFAULT 0,
          is_checked INTEGER NOT NULL DEFAULT 0,
          sort_order INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS steps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guide_id INTEGER NOT NULL,
          step_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          instruction TEXT NOT NULL,
          tip TEXT,
          safety_warning TEXT,
          duration_minutes INTEGER,
          is_completed INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE,
          UNIQUE (guide_id, step_number)
        );

        CREATE TABLE IF NOT EXISTS guide_progress (
          guide_id INTEGER PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
          current_step INTEGER NOT NULL DEFAULT 1,
          stars_earned INTEGER NOT NULL DEFAULT 0,
          started_at TEXT,
          completed_at TEXT,
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
        CREATE INDEX IF NOT EXISTS idx_guides_favorite ON guides(is_favorite);
        CREATE INDEX IF NOT EXISTS idx_materials_guide ON materials(guide_id, sort_order);
        CREATE INDEX IF NOT EXISTS idx_steps_guide ON steps(guide_id, step_number);
      `);
    },
  },
];

/**
 * Configures SQLite pragmas, applies pending versioned schema migrations,
 * and seeds offline starter DIY guides on first launch.
 */
export async function initializeDatabase(db) {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  if (Platform.OS !== 'web') {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  }

  const versionRow = await db.getFirstAsync('PRAGMA user_version;');
  let currentVersion = Number(versionRow?.user_version ?? 0);

  for (const migration of MIGRATIONS) {
    if (currentVersion < migration.version) {
      await db.withTransactionAsync(async () => {
        await migration.up(db);
        await db.execAsync(`PRAGMA user_version = ${migration.version};`);
      });
      currentVersion = migration.version;
    }
  }

  await seedInitialGuides(db);
}
