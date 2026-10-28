import { createClient, type Client, type InValue } from "@libsql/client";
import { hashPassword } from "@/lib/auth/password";

/**
 * libSQL client. Uses Turso when TURSO_DATABASE_URL is set; otherwise a local
 * file DB for development (file:./data/aurora.db, override with LOCAL_DB_URL).
 * On Vercel the filesystem is read-only, so TURSO_DATABASE_URL is required there.
 */
function resolveUrl(): string {
  const turso = process.env.TURSO_DATABASE_URL?.trim();
  if (turso) return turso;
  if (process.env.VERCEL) {
    throw new Error("TURSO_DATABASE_URL must be set on Vercel (read-only filesystem).");
  }
  return process.env.LOCAL_DB_URL?.trim() || "file:./data/aurora.db";
}

let _client: Client | null = null;
let _ready: Promise<Client> | null = null;

async function ensureLocalDir(url: string) {
  if (!url.startsWith("file:")) return;
  const { mkdir } = await import("fs/promises");
  const path = await import("path");
  await mkdir(path.dirname(url.slice(5)), { recursive: true });
}

export function getDb(): Promise<Client> {
  if (_ready) return _ready;
  _ready = (async () => {
    const url = resolveUrl();
    await ensureLocalDir(url);
    _client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
    });
    await _client.execute("PRAGMA foreign_keys = ON");
    await migrate(_client);
    await seedIfEmpty(_client);
    return _client;
  })().catch((e) => {
    _ready = null;
    throw e;
  });
  return _ready;
}

export async function all<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  const db = await getDb();
  const rs = await db.execute({ sql, args });
  return rs.rows.map((r) => ({ ...r }) as unknown as T);
}

export async function get<T>(sql: string, args: InValue[] = []): Promise<T | undefined> {
  return (await all<T>(sql, args))[0];
}

export async function run(sql: string, args: InValue[] = []) {
  const db = await getDb();
  const rs = await db.execute({ sql, args });
  return { lastInsertRowid: rs.lastInsertRowid, rowsAffected: rs.rowsAffected };
}

async function columnInfo(db: Client, table: string) {
  const rs = await db.execute(`PRAGMA table_info(${table})`);
  return rs.rows.map((r) => ({ name: String(r.name), notnull: Number(r.notnull) }));
}

async function migrate(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT,
      oauth_provider TEXT,
      oauth_subject TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      track TEXT NOT NULL,
      slug TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      quiz_score INTEGER,
      quiz_total INTEGER,
      step_index INTEGER,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, track, slug)
    );
  `);

  let info = await columnInfo(db, "users");
  const names = new Set(info.map((c) => c.name));
  if (!names.has("oauth_provider")) await db.execute("ALTER TABLE users ADD COLUMN oauth_provider TEXT");
  if (!names.has("oauth_subject")) await db.execute("ALTER TABLE users ADD COLUMN oauth_subject TEXT");

  info = await columnInfo(db, "users");
  const pw = info.find((c) => c.name === "password_hash");
  if (pw && pw.notnull === 1) {
    await db.batch(
      [
        `CREATE TABLE users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE COLLATE NOCASE,
          name TEXT NOT NULL,
          password_hash TEXT,
          oauth_provider TEXT,
          oauth_subject TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `INSERT INTO users_new (id, email, name, password_hash, oauth_provider, oauth_subject, created_at)
         SELECT id, email, name, password_hash, oauth_provider, oauth_subject, created_at FROM users`,
        "DROP TABLE users",
        "ALTER TABLE users_new RENAME TO users",
      ],
      "write",
    );
  }

  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS users_oauth_unique
      ON users(oauth_provider, oauth_subject)
      WHERE oauth_provider IS NOT NULL AND oauth_subject IS NOT NULL
  `);
}

async function seedIfEmpty(db: Client) {
  if (process.env.NODE_ENV === "production") return;
  const rs = await db.execute("SELECT COUNT(*) AS c FROM users");
  if (Number(rs.rows[0]?.c ?? 0) > 0) return;
  const demo = [
    { email: "demo@dailytechhub.dev", name: "Demo Learner", password: "demo1234" },
    { email: "alex@example.com", name: "Alex Rivera", password: "learnfree" },
  ];
  await db.batch(
    demo.map((u) => ({
      sql: "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
      args: [u.email, u.name, hashPassword(u.password)],
    })),
    "write",
  );
}

export type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash: string | null;
  oauth_provider: string | null;
  oauth_subject: string | null;
  created_at: string;
};

export type ProgressRow = {
  track: string;
  slug: string;
  completed: number;
  quiz_score: number | null;
  quiz_total: number | null;
  step_index: number | null;
  updated_at: string;
};
