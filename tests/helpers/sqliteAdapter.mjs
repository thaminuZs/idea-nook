import { DatabaseSync } from 'node:sqlite';

/**
 * In-memory SQLite adapter wrapping Node's built-in DatabaseSync
 * with the same async API surface provided by expo-sqlite.
 */
export function createMemoryDb() {
  const raw = new DatabaseSync(':memory:');
  let txDepth = 0;

  return {
    async execAsync(sql) {
      raw.exec(sql);
    },

    async getFirstAsync(sql, params = []) {
      const row = raw.prepare(sql).get(...params);
      return row ?? null;
    },

    async getAllAsync(sql, params = []) {
      return raw.prepare(sql).all(...params);
    },

    async runAsync(sql, params = []) {
      const res = raw.prepare(sql).run(...params);
      return {
        changes: res.changes,
        lastInsertRowId: Number(res.lastInsertRowid),
      };
    },

    async withTransactionAsync(fn) {
      const savepoint = `sp_${txDepth}`;
      txDepth += 1;
      raw.exec(txDepth === 1 ? 'BEGIN;' : `SAVEPOINT ${savepoint};`);
      try {
        await fn();
        raw.exec(txDepth === 1 ? 'COMMIT;' : `RELEASE SAVEPOINT ${savepoint};`);
      } catch (err) {
        raw.exec(txDepth === 1 ? 'ROLLBACK;' : `ROLLBACK TO SAVEPOINT ${savepoint};`);
        throw err;
      } finally {
        txDepth -= 1;
      }
    },

    close() {
      raw.close();
    },
  };
}
