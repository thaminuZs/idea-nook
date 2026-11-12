const ALLOWED_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

function slugify(value) {
  return String(value || 'guide')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'guide';
}

function escapeLikePattern(value) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function mapGuideRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    difficulty: row.difficulty,
    minAge: row.min_age,
    maxAge: row.max_age,
    estimatedMinutes: row.estimated_minutes,
    adultSupervision: Boolean(row.adult_supervision),
    safetyNote: row.safety_note ?? null,
    iconEmoji: row.icon_emoji,
    accentColor: row.accent_color,
    isFavorite: Boolean(row.is_favorite),
    isCustom: Boolean(row.is_custom),
    createdAt: row.created_at,
    status: row.progress_status ?? 'not_started',
    currentStep: row.current_step ?? 1,
    starsEarned: row.stars_earned ?? 0,
    startedAt: row.started_at ?? null,
    completedAt: row.completed_at ?? null,
    totalSteps: row.total_steps ?? 0,
    completedSteps: row.completed_steps ?? 0,
    totalMaterials: row.total_materials ?? 0,
    checkedMaterials: row.checked_materials ?? 0,
  };
}

function mapMaterialRow(row) {
  return {
    id: row.id,
    guideId: row.guide_id,
    name: row.name,
    quantity: row.quantity ?? null,
    isOptional: Boolean(row.is_optional),
    isChecked: Boolean(row.is_checked),
    sortOrder: row.sort_order,
  };
}

function mapStepRow(row) {
  return {
    id: row.id,
    guideId: row.guide_id,
    stepNumber: row.step_number,
    title: row.title,
    instruction: row.instruction,
    tip: row.tip ?? null,
    safetyWarning: row.safety_warning ?? null,
    durationMinutes: row.duration_minutes ?? null,
    isCompleted: Boolean(row.is_completed),
  };
}

/**
 * Inserts a guide along with its materials, steps, and initial progress row.
 * Callers should wrap calls in a transaction when atomicity across multiple inserts is required.
 */
export async function insertGuideRecord(db, guideData, { isCustom = false } = {}) {
  const difficulty = ALLOWED_DIFFICULTIES.has(guideData.difficulty)
    ? guideData.difficulty
    : 'easy';
  const slug = guideData.slug || `${slugify(guideData.title)}-${Date.now()}`;

  const guideResult = await db.runAsync(
    `INSERT INTO guides (
      slug, title, summary, category, difficulty,
      min_age, max_age, estimated_minutes, adult_supervision,
      safety_note, icon_emoji, accent_color, is_favorite, is_custom
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      slug,
      guideData.title.trim(),
      guideData.summary.trim(),
      guideData.category.trim(),
      difficulty,
      guideData.minAge ?? 5,
      guideData.maxAge ?? 12,
      guideData.estimatedMinutes ?? 15,
      guideData.adultSupervision ? 1 : 0,
      guideData.safetyNote ?? null,
      guideData.iconEmoji ?? '🎨',
      guideData.accentColor ?? '#FF8A65',
      guideData.isFavorite ? 1 : 0,
      isCustom ? 1 : 0,
    ]
  );

  const guideId = guideResult.lastInsertRowId;

  const materials = Array.isArray(guideData.materials) ? guideData.materials : [];
  for (let i = 0; i < materials.length; i += 1) {
    const material = materials[i];
    await db.runAsync(
      `INSERT INTO materials (
        guide_id, name, quantity, is_optional, is_checked, sort_order
      ) VALUES (?, ?, ?, ?, 0, ?);`,
      [
        guideId,
        material.name.trim(),
        material.quantity ?? null,
        material.isOptional ? 1 : 0,
        material.sortOrder ?? i + 1,
      ]
    );
  }

  const steps = Array.isArray(guideData.steps) ? guideData.steps : [];
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    await db.runAsync(
      `INSERT INTO steps (
        guide_id, step_number, title, instruction, tip, safety_warning, duration_minutes, is_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0);`,
      [
        guideId,
        step.stepNumber ?? i + 1,
        step.title.trim(),
        step.instruction.trim(),
        step.tip ?? null,
        step.safetyWarning ?? null,
        step.durationMinutes ?? null,
      ]
    );
  }

  await db.runAsync(
    `INSERT INTO guide_progress (guide_id, status, current_step, stars_earned)
     VALUES (?, 'not_started', 1, 0);`,
    [guideId]
  );

  return guideId;
}

const GUIDE_SELECT_BASE = `
  SELECT
    g.*,
    COALESCE(gp.status, 'not_started') AS progress_status,
    COALESCE(gp.current_step, 1) AS current_step,
    COALESCE(gp.stars_earned, 0) AS stars_earned,
    gp.started_at,
    gp.completed_at,
    (SELECT COUNT(*) FROM steps s WHERE s.guide_id = g.id) AS total_steps,
    (SELECT COUNT(*) FROM steps s WHERE s.guide_id = g.id AND s.is_completed = 1) AS completed_steps,
    (SELECT COUNT(*) FROM materials m WHERE m.guide_id = g.id) AS total_materials,
    (SELECT COUNT(*) FROM materials m WHERE m.guide_id = g.id AND m.is_checked = 1) AS checked_materials
  FROM guides g
  LEFT JOIN guide_progress gp ON gp.guide_id = g.id
`;

/**
 * Returns all distinct categories with total and completed guide counts.
 */
export async function getCategories(db) {
  const rows = await db.getAllAsync(`
    SELECT
      g.category AS category,
      COUNT(*) AS count,
      SUM(CASE WHEN gp.status = 'completed' THEN 1 ELSE 0 END) AS completed_count
    FROM guides g
    LEFT JOIN guide_progress gp ON gp.guide_id = g.id
    GROUP BY g.category
    ORDER BY g.category ASC;
  `);

  return rows.map((row) => ({
    category: row.category,
    count: row.count,
    completedCount: row.completed_count ?? 0,
  }));
}

/**
 * Lists DIY guides with optional offline filtering by category, difficulty, age, status, favorite, or search text.
 */
export async function getGuides(db, filters = {}) {
  const clauses = [];
  const params = [];

  if (filters.category && filters.category !== 'All') {
    clauses.push('g.category = ?');
    params.push(filters.category);
  }

  if (filters.difficulty && ALLOWED_DIFFICULTIES.has(filters.difficulty)) {
    clauses.push('g.difficulty = ?');
    params.push(filters.difficulty);
  }

  if (typeof filters.age === 'number' && Number.isFinite(filters.age)) {
    clauses.push('g.min_age <= ? AND g.max_age >= ?');
    params.push(filters.age, filters.age);
  }

  if (filters.favoritesOnly) {
    clauses.push('g.is_favorite = 1');
  }

  if (filters.status) {
    clauses.push("COALESCE(gp.status, 'not_started') = ?");
    params.push(filters.status);
  }

  if (typeof filters.search === 'string' && filters.search.trim().length > 0) {
    const pattern = `%${escapeLikePattern(filters.search.trim())}%`;
    clauses.push(
      "(g.title LIKE ? ESCAPE '\\' OR g.summary LIKE ? ESCAPE '\\' OR g.category LIKE ? ESCAPE '\\')"
    );
    params.push(pattern, pattern, pattern);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = await db.getAllAsync(
    `${GUIDE_SELECT_BASE} ${whereClause} ORDER BY g.is_favorite DESC, g.id ASC;`,
    params
  );

  return rows.map(mapGuideRow);
}

/**
 * Loads a single guide with its ordered materials checklist, steps, and progress metadata.
 */
export async function getGuideById(db, guideId) {
  const guideRow = await db.getFirstAsync(
    `${GUIDE_SELECT_BASE} WHERE g.id = ?;`,
    [guideId]
  );

  if (!guideRow) {
    return null;
  }

  const materialRows = await db.getAllAsync(
    'SELECT * FROM materials WHERE guide_id = ? ORDER BY sort_order ASC, id ASC;',
    [guideId]
  );

  const stepRows = await db.getAllAsync(
    'SELECT * FROM steps WHERE guide_id = ? ORDER BY step_number ASC, id ASC;',
    [guideId]
  );

  return {
    ...mapGuideRow(guideRow),
    materials: materialRows.map(mapMaterialRow),
    steps: stepRows.map(mapStepRow),
  };
}

/**
 * Toggles favorite status for a guide and returns the updated boolean state (or null if missing).
 */
export async function toggleFavorite(db, guideId) {
  const existing = await db.getFirstAsync(
    'SELECT is_favorite FROM guides WHERE id = ?;',
    [guideId]
  );

  if (!existing) {
    return null;
  }

  const nextValue = existing.is_favorite ? 0 : 1;
  await db.runAsync('UPDATE guides SET is_favorite = ? WHERE id = ?;', [nextValue, guideId]);
  return Boolean(nextValue);
}

/**
 * Toggles whether a material item has been gathered/checked by the child.
 */
export async function toggleMaterialChecked(db, materialId) {
  const existing = await db.getFirstAsync(
    'SELECT id, guide_id, is_checked FROM materials WHERE id = ?;',
    [materialId]
  );

  if (!existing) {
    return null;
  }

  const nextChecked = existing.is_checked ? 0 : 1;
  await db.runAsync('UPDATE materials SET is_checked = ? WHERE id = ?;', [
    nextChecked,
    materialId,
  ]);

  return {
    id: existing.id,
    guideId: existing.guide_id,
    isChecked: Boolean(nextChecked),
  };
}

/**
 * Unchecks all materials for a guide.
 */
export async function resetGuideMaterials(db, guideId) {
  await db.runAsync('UPDATE materials SET is_checked = 0 WHERE guide_id = ?;', [guideId]);
}

async function recalculateGuideProgress(db, guideId) {
  const stats = await db.getFirstAsync(
    `SELECT
      COUNT(*) AS total_steps,
      SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completed_steps,
      MIN(CASE WHEN is_completed = 0 THEN step_number ELSE NULL END) AS next_incomplete_step
     FROM steps
     WHERE guide_id = ?;`,
    [guideId]
  );

  const totalSteps = stats?.total_steps ?? 0;
  const completedSteps = stats?.completed_steps ?? 0;

  let status = 'not_started';
  let currentStep = 1;
  let starsEarned = 0;

  if (totalSteps > 0 && completedSteps >= totalSteps) {
    status = 'completed';
    currentStep = totalSteps;
    starsEarned = 3;
  } else if (completedSteps > 0) {
    status = 'in_progress';
    currentStep = stats?.next_incomplete_step ?? 1;
  }

  const existingProgress = await db.getFirstAsync(
    'SELECT started_at FROM guide_progress WHERE guide_id = ?;',
    [guideId]
  );

  const nowIso = new Date().toISOString();
  const startedAt =
    status === 'not_started' ? null : (existingProgress?.started_at ?? nowIso);
  const completedAt = status === 'completed' ? nowIso : null;

  await db.runAsync(
    `INSERT INTO guide_progress (
      guide_id, status, current_step, stars_earned, started_at, completed_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(guide_id) DO UPDATE SET
      status = excluded.status,
      current_step = excluded.current_step,
      stars_earned = excluded.stars_earned,
      started_at = excluded.started_at,
      completed_at = excluded.completed_at,
      updated_at = excluded.updated_at;`,
    [guideId, status, currentStep, starsEarned, startedAt, completedAt, nowIso]
  );

  return {
    status,
    currentStep,
    completedSteps,
    totalSteps,
    starsEarned,
  };
}

/**
 * Sets or toggles a step's completion state and recalculates the parent guide's progress atomically.
 */
export async function setStepCompleted(db, guideId, stepId, isCompleted) {
  let summary = null;

  await db.withTransactionAsync(async () => {
    const step = await db.getFirstAsync(
      'SELECT id, is_completed FROM steps WHERE id = ? AND guide_id = ?;',
      [stepId, guideId]
    );

    if (!step) {
      return;
    }

    const nextValue =
      typeof isCompleted === 'boolean'
        ? isCompleted
          ? 1
          : 0
        : step.is_completed
          ? 0
          : 1;

    await db.runAsync('UPDATE steps SET is_completed = ? WHERE id = ?;', [nextValue, stepId]);

    const progress = await recalculateGuideProgress(db, guideId);
    summary = {
      stepId,
      isCompleted: Boolean(nextValue),
      ...progress,
    };
  });

  return summary;
}

export function toggleStepCompleted(db, guideId, stepId) {
  return setStepCompleted(db, guideId, stepId);
}

/**
 * Persists which step number the child is currently viewing so they can resume offline anytime.
 */
export async function setCurrentStep(db, guideId, stepNumber) {
  const safeStep = Math.max(1, Math.floor(Number(stepNumber) || 1));
  const nowIso = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO guide_progress (guide_id, status, current_step, started_at, updated_at)
     VALUES (?, 'in_progress', ?, ?, ?)
     ON CONFLICT(guide_id) DO UPDATE SET
       current_step = excluded.current_step,
       status = CASE WHEN guide_progress.status = 'not_started' THEN 'in_progress' ELSE guide_progress.status END,
       started_at = COALESCE(guide_progress.started_at, excluded.started_at),
       updated_at = excluded.updated_at;`,
    [guideId, safeStep, nowIso, nowIso]
  );
}

/**
 * Resets all checked materials, completed steps, and progress for a guide.
 */
export async function resetGuideProgress(db, guideId) {
  const nowIso = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE steps SET is_completed = 0 WHERE guide_id = ?;', [guideId]);
    await db.runAsync('UPDATE materials SET is_checked = 0 WHERE guide_id = ?;', [guideId]);
    await db.runAsync(
      `INSERT INTO guide_progress (
        guide_id, status, current_step, stars_earned, started_at, completed_at, updated_at
      ) VALUES (?, 'not_started', 1, 0, NULL, NULL, ?)
      ON CONFLICT(guide_id) DO UPDATE SET
        status = 'not_started',
        current_step = 1,
        stars_earned = 0,
        started_at = NULL,
        completed_at = NULL,
        updated_at = excluded.updated_at;`,
      [guideId, nowIso]
    );
  });
}

/**
 * Returns aggregate progress and library counts for the home dashboard.
 */
export async function getDashboardStats(db) {
  const row = await db.getFirstAsync(`
    SELECT
      COUNT(*) AS total_guides,
      SUM(CASE WHEN g.is_favorite = 1 THEN 1 ELSE 0 END) AS favorite_guides,
      SUM(CASE WHEN gp.status = 'completed' THEN 1 ELSE 0 END) AS completed_guides,
      SUM(CASE WHEN gp.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_guides,
      COALESCE(SUM(gp.stars_earned), 0) AS total_stars
    FROM guides g
    LEFT JOIN guide_progress gp ON gp.guide_id = g.id;
  `);

  return {
    totalGuides: row?.total_guides ?? 0,
    favoriteGuides: row?.favorite_guides ?? 0,
    completedGuides: row?.completed_guides ?? 0,
    inProgressGuides: row?.in_progress_guides ?? 0,
    totalStars: row?.total_stars ?? 0,
  };
}

/**
 * Creates a custom user-authored DIY guide along with its materials and steps atomically.
 */
export async function createCustomGuide(db, guideInput) {
  if (!guideInput?.title?.trim() || !guideInput?.summary?.trim() || !guideInput?.category?.trim()) {
    throw new Error('Guide title, summary, and category are required.');
  }

  if (!Array.isArray(guideInput.steps) || guideInput.steps.length === 0) {
    throw new Error('A DIY guide must include at least one step.');
  }

  let createdGuideId = null;

  await db.withTransactionAsync(async () => {
    createdGuideId = await insertGuideRecord(db, guideInput, { isCustom: true });
  });

  return getGuideById(db, createdGuideId);
}

/**
 * Deletes a user-created custom DIY guide (built-in starter guides are protected).
 */
export async function deleteCustomGuide(db, guideId) {
  const result = await db.runAsync(
    'DELETE FROM guides WHERE id = ? AND is_custom = 1;',
    [guideId]
  );

  return result.changes > 0;
}
