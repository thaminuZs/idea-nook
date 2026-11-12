/**
 * Validates and normalizes user profile data for children.
 */
function normalizeProfile(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    age: Number(row.age),
    gender: row.gender,
    avatarEmoji: row.avatar_emoji || '🌟',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Loads the active child profile from SQLite (id = 1).
 * Returns null if no profile has been created yet (first start).
 */
export async function getUserProfile(db) {
  const row = await db.getFirstAsync(
    'SELECT id, name, age, gender, avatar_emoji, created_at, updated_at FROM user_profile WHERE id = 1;'
  );

  return normalizeProfile(row);
}

/**
 * Saves or updates the child profile on first launch or edit.
 */
export async function saveUserProfile(db, { name, age, gender, avatarEmoji = '🌟' }) {
  const trimmedName = String(name || '').trim();
  if (!trimmedName) {
    throw new Error('Please enter your name.');
  }

  const numericAge = parseInt(age, 10);
  if (isNaN(numericAge) || numericAge < 1 || numericAge > 18) {
    throw new Error('Please select a valid age between 1 and 18.');
  }

  const cleanGender = String(gender || '').trim().toLowerCase();
  if (!cleanGender) {
    throw new Error('Please select a gender.');
  }

  const cleanAvatar = String(avatarEmoji || '🌟').trim();
  const nowIso = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO user_profile (
      id, name, age, gender, avatar_emoji, created_at, updated_at
    ) VALUES (1, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      age = excluded.age,
      gender = excluded.gender,
      avatar_emoji = excluded.avatar_emoji,
      updated_at = excluded.updated_at;`,
    [trimmedName, numericAge, cleanGender, cleanAvatar, nowIso, nowIso]
  );

  return getUserProfile(db);
}

/**
 * Clears the active child profile (useful for testing the first-start flow).
 */
export async function clearUserProfile(db) {
  await db.runAsync('DELETE FROM user_profile WHERE id = 1;');
}
