"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FreeForeverBanner } from "@/components/FreeForeverBanner";
import { CERT_PATH, TRACKS } from "@/lib/tracks";
import { loadProgress, trackCompletion } from "@/lib/progress";

const TRACK_SLUGS: Record<string, string[]> = {
  "prompt-engineering": [
    "pe-ask-better-questions",
    "pe-structure-prompts",
    "pe-iterate-and-refine",
    "pe-verify-answers",
    "pe-safety-privacy",
    "pe-prompts-for-learning",
  ],
  "ai-data-eng": [
    "ai-de-copilot-mindset",
    "ai-de-debug-with-ai",
    "ai-de-generate-code-safely",
    "ai-de-docs-and-tests",
    "ai-de-tools-workflow",
    "ai-de-review-changes",
  ],
  python: [
    "python-dataframe-contracts",
    "python-typing-for-pipelines",
    "python-testing-spark-logic",
    "python-idempotent-writers",
    "python-config-and-secrets",
    "python-orchestration-hooks",
    "python-performance-de",
    "python-packaging-de-libs",
  ],
  sql: [
    "sql-window-functions-de",
    "sql-incremental-loads",
    "sql-performance-basics",
    "sql-dimensional-modeling",
    "sql-data-quality",
    "sql-ctes-readability",
    "sql-semi-structured",
  ],
  databricks: [
    "dbx-lakehouse-fundamentals",
    "dbx-delta-lake-basics",
    "dbx-spark-sql-performance",
    "dbx-unity-catalog",
    "dbx-jobs-workflows",
    "dbx-structured-streaming",
    "dbx-sql-warehouses",
  ],
  snowflake: [
    "sf-architecture",
    "sf-time-travel-clones",
    "sf-streams-tasks",
    "sf-dynamic-tables",
    "sf-performance-cost",
    "sf-governance-rbac",
    "sf-snowpark-python",
  ],
  git: ["git-rebase-vs-merge", "git-commit-hygiene", "git-bisect-and-blame"],
};

const TRACK_HUE: Record<string, string> = {
  "prompt-engineering": "var(--violet)",
  "ai-data-eng": "var(--coral)",
  python: "var(--sun)",
  sql: "var(--mint)",
  databricks: "var(--coral)",
  snowflake: "var(--sky)",
  git: "var(--muted)",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const on = () => setTick((t) => t + 1);
    window.addEventListener("dth-progress", on);
    return () => window.removeEventListener("dth-progress", on);
  }, []);

  const rows = useMemo(() => {
    void tick;
    void loadProgress();
    return CERT_PATH.map((id) => {
      const meta = TRACKS.find((t) => t.id === id)!;
      const slugs = TRACK_SLUGS[id] || [];
      const c = trackCompletion(id, slugs);
      return { meta, ...c };
    });
  }, [tick, user]);

  const overall = useMemo(() => {
    const done = rows.reduce((a, r) => a + r.done, 0);
    const total = rows.reduce((a, r) => a + r.total, 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [rows]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--coral)]">
          Progress · free forever
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-[var(--ink-fg)]">Your dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Certification-style track completion — coral = go, mint = done, sun = reward.
        </p>
      </div>

      <FreeForeverBanner />

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading session…</p>
      ) : user ? (
        <p className="text-sm text-[var(--ink-fg)]">
          Signed in as <strong>{user.name}</strong> ({user.email}) — progress syncs to SQLite.
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Guest mode (localStorage).{" "}
          <Link href="/login" className="font-semibold text-[var(--coral)] hover:underline">
            Sign in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="font-semibold text-[var(--coral)] hover:underline">
            create a free account
          </Link>
          .
        </p>
      )}

      <div className="panel rounded-3xl p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--sun)]">
              Overall path
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-[var(--ink-fg)]">{overall.pct}%</p>
            <p className="text-sm text-[var(--muted)]">
              {overall.done}/{overall.total} lessons complete
            </p>
          </div>
          <Link href="/training" className="btn-primary">
            Continue training
          </Link>
        </div>
        <div className="progress-track mt-4">
          <div
            className={`progress-fill ${overall.pct === 100 ? "done" : ""}`}
            style={{ width: `${overall.pct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(({ meta, done, total, pct }) => (
          <Link key={meta.id} href={`/training/${meta.id}`} className="panel glass-hover rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[var(--ink-fg)]">{meta.title}</h2>
              <span className="text-sm font-bold" style={{ color: TRACK_HUE[meta.id] }}>
                {pct}%
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{meta.blurb}</p>
            <div className="progress-track mt-4">
              <div
                className={`progress-fill ${pct === 100 ? "done" : ""}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {done}/{total} lessons · checkpoint path
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
