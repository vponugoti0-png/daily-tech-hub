import crypto from "crypto";
import { all, get, run, type ProgressRow, type UserRow } from "@/lib/db";
import {
  BCRYPT_COST,
  checkPassword,
  hashPassword,
} from "@/lib/auth/password";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  return await get("SELECT * FROM users WHERE email = ? COLLATE NOCASE", [email.trim()]) as UserRow | undefined;
}

export async function findUserById(id: number): Promise<UserRow | undefined> {
  return await get("SELECT * FROM users WHERE id = ?", [id]) as
    | UserRow
    | undefined;
}

export async function findUserByOAuth(
  provider: string,
  subject: string,
): Promise<UserRow | undefined> {
  return await get("SELECT * FROM users WHERE oauth_provider = ? AND oauth_subject = ?", [provider, subject]) as UserRow | undefined;
}

export async function createUser(email: string, name: string, password: string) {
  const hash = hashPassword(password);
  const info = await run("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)", [email.trim().toLowerCase(), name.trim(), hash]);
  return (await findUserById(Number(info.lastInsertRowid)))!;
}

/** Random bcrypt hash that no password can match — for OAuth-only accounts. */
export function unusablePasswordHash() {
  return bcrypt.hashSync(
    `oauth-unusable:${crypto.randomBytes(32).toString("hex")}`,
    BCRYPT_COST,
  );
}

/**
 * Upsert an OAuth identity into SQLite users.
 * Link order: (1) provider+subject, (2) email when present, (3) create new.
 */
export async function upsertOAuthUser(input: {
  provider: string;
  subject: string;
  email?: string | null;
  name?: string | null;
}): Promise<UserRow> {
  const provider = input.provider.trim();
  const subject = input.subject.trim();
  const emailRaw = (input.email || "").trim().toLowerCase();
  const name =
    (input.name || "").trim() ||
    emailRaw.split("@")[0] ||
    `${provider} user`;

  const byOAuth = await findUserByOAuth(provider, subject);
  if (byOAuth) {
    if (name && name !== byOAuth.name) {
      await run("UPDATE users SET name = ? WHERE id = ?", [name, byOAuth.id]);
      return (await findUserById(byOAuth.id))!;
    }
    return byOAuth;
  }

  if (emailRaw && emailRaw.includes("@")) {
    const byEmail = await findUserByEmail(emailRaw);
    if (byEmail) {
      await run("UPDATE users SET oauth_provider = ?, oauth_subject = ?, name = COALESCE(NULLIF(?, ''), name) WHERE id = ?", [provider, subject, name, byEmail.id]);
      return (await findUserById(byEmail.id))!;
    }

    const info = await run(`INSERT INTO users (email, name, password_hash, oauth_provider, oauth_subject)
         VALUES (?, ?, ?, ?, ?)`, [emailRaw, name, unusablePasswordHash(), provider, subject]);
    return (await findUserById(Number(info.lastInsertRowid)))!;
  }

  // No email from provider (common for X/Twitter without elevated email scope).
  const synthetic = `${provider}_${subject.replace(/[^a-zA-Z0-9_-]/g, "")}@oauth.local`;
  const info = await run(`INSERT INTO users (email, name, password_hash, oauth_provider, oauth_subject)
       VALUES (?, ?, ?, ?, ?)`, [synthetic, name, unusablePasswordHash(), provider, subject]);
  return (await findUserById(Number(info.lastInsertRowid)))!;
}

export function verifyPassword(user: UserRow, password: string) {
  return checkPassword(password, user.password_hash);
}

export async function getProgressForUser(userId: number): Promise<ProgressRow[]> {
  return await all("SELECT track, slug, completed, quiz_score, quiz_total, step_index, updated_at FROM lesson_progress WHERE user_id = ?", [userId]) as ProgressRow[];
}

export async function upsertProgress(
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
  const existing = await get("SELECT * FROM lesson_progress WHERE user_id = ? AND track = ? AND slug = ?", [userId, patch.track, patch.slug]) as
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

  await run(`INSERT INTO lesson_progress (user_id, track, slug, completed, quiz_score, quiz_total, step_index, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, track, slug) DO UPDATE SET
       completed = excluded.completed,
       quiz_score = excluded.quiz_score,
       quiz_total = excluded.quiz_total,
       step_index = excluded.step_index,
       updated_at = datetime('now')`, [userId, patch.track, patch.slug, completed, quizScore, quizTotal, stepIndex]);
}

export const MERGE_PAYLOAD_MAX_KEYS = 500;

export async function mergeLocalProgress(
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
  const entries = Object.entries(lessons);
  if (entries.length > MERGE_PAYLOAD_MAX_KEYS) {
    throw new Error(`merge payload exceeds ${MERGE_PAYLOAD_MAX_KEYS} keys`);
  }
  {
    for (const [key, val] of entries) {
      const [track, ...rest] = key.split(":");
      const slug = rest.join(":");
      if (!track || !slug) continue;
      await upsertProgress(userId, {
        track,
        slug,
        completed: val.completed,
        quizScore: val.quizScore,
        quizTotal: val.quizTotal,
        stepIndex: val.stepIndex,
      });
    }
  }
}
