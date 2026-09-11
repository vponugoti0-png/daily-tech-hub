import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "dth.sqlite");

let _db: Database.Database | null = null;

export function getDb() {
  if (_db) return _db;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  migrate(_db);
  seedIfEmpty(_db);
  return _db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
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
}

function seedIfEmpty(db: Database.Database) {
  const row = db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number };
  if (row.c > 0) return;

  const insert = db.prepare(
    "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
  );
  const demo = [
    {
      email: "demo@dailytechhub.dev",
      name: "Demo Learner",
      password: "demo1234",
    },
    {
      email: "alex@example.com",
      name: "Alex Rivera",
      password: "learnfree",
    },
  ];
  const tx = db.transaction(() => {
    for (const u of demo) {
      insert.run(u.email, u.name, bcrypt.hashSync(u.password, 10));
    }
  });
  tx();
}

export type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash: string;
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
