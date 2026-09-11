import bcrypt from "bcryptjs";
import { getDb, type ProgressRow, type UserRow } from "@/lib/db";

export function findUserByEmail(email: string): UserRow | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE")
    .get(email.trim()) as UserRow | undefined;
}

export function findUserById(id: number): UserRow | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
}

export function createUser(email: string, name: string, password: string) {
  const hash = bcrypt.hashSync(password, 10);
  const info = getDb()
    .prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)")
    .run(email.trim().toLowerCase(), name.trim(), hash);
  return findUserById(Number(info.lastInsertRowid))!;
}

export function verifyPassword(user: UserRow, password: string) {
  return bcrypt.compareSync(password, user.password_hash);
}

export function getProgressForUser(userId: number): ProgressRow[] {
  return getDb()
    .prepare(
      "SELECT track, slug, completed, quiz_score, quiz_total, step_index, updated_at FROM lesson_progress WHERE user_id = ?",
    )
    .all(userId) as ProgressRow[];
}

export function upsertProgress(
  userId: number,
  patch: {
    track: string;
    slug: string;
    completed?: boolean;
    quizScore?: number;
    quizTotal?: number;
    stepIndex?: number;
  },
) {
  const db = getDb();
  const existing = db
    .prepare(
      "SELECT * FROM lesson_progress WHERE user_id = ? AND track = ? AND slug = ?",
    )
    .get(userId, patch.track, patch.slug) as
    | (ProgressRow & { id: number; user_id: number })
    | undefined;

  const completed =
    patch.completed !== undefined
      ? patch.completed
        ? 1
        : 0
      : (existing?.completed ?? 0);
  const quizScore =
    patch.quizScore !== undefined ? patch.quizScore : (existing?.quiz_score ?? null);
  const quizTotal =
    patch.quizTotal !== undefined ? patch.quizTotal : (existing?.quiz_total ?? null);
  const stepIndex =
    patch.stepIndex !== undefined ? patch.stepIndex : (existing?.step_index ?? null);

  db.prepare(
    `INSERT INTO lesson_progress (user_id, track, slug, completed, quiz_score, quiz_total, step_index, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, track, slug) DO UPDATE SET
       completed = excluded.completed,
       quiz_score = excluded.quiz_score,
       quiz_total = excluded.quiz_total,
       step_index = excluded.step_index,
       updated_at = datetime('now')`,
  ).run(userId, patch.track, patch.slug, completed, quizScore, quizTotal, stepIndex);
}

export function mergeLocalProgress(
  userId: number,
  lessons: Record<
    string,
    {
      completed?: boolean;
      quizScore?: number;
      quizTotal?: number;
      stepIndex?: number;
      updatedAt?: string;
    }
  >,
) {
  const tx = getDb().transaction(() => {
    for (const [key, val] of Object.entries(lessons)) {
      const [track, ...rest] = key.split(":");
      const slug = rest.join(":");
      if (!track || !slug) continue;
      upsertProgress(userId, {
        track,
        slug,
        completed: val.completed,
        quizScore: val.quizScore,
        quizTotal: val.quizTotal,
        stepIndex: val.stepIndex,
      });
    }
  });
  tx();
}
