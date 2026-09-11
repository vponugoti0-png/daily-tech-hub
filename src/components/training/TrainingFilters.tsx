"use client";

import { useMemo, useState } from "react";
import type { TrainingLesson } from "@/lib/types";
import { LessonCard } from "@/components/LessonCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const LEVELS = ["all", "beginner", "intermediate", "advanced"] as const;
const TRACKS = ["all", "python", "sql", "databricks", "snowflake", "git"] as const;

export function TrainingFilters({ lessons }: { lessons: TrainingLesson[] }) {
  const [track, setTrack] = useState<(typeof TRACKS)[number]>("all");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return lessons.filter((l) => {
      if (track !== "all" && l.track !== track) return false;
      if (level !== "all" && l.level !== level) return false;
      if (!query) return true;
      return `${l.title} ${l.description} ${l.topics.join(" ")}`.toLowerCase().includes(query);
    });
  }, [lessons, track, level, q]);

  return (
    <section className="space-y-5">
      <div className="glass rounded-2xl p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter lessons…"
          className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none ring-cyan-400/30 placeholder:text-zinc-500 focus:ring-2"
          aria-label="Filter lessons"
        />
        <div className="flex flex-wrap gap-2">
          {TRACKS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize",
                track === t ? "bg-cyan-400 text-zinc-950" : "bg-white/5 text-zinc-300 ring-1 ring-white/10",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize",
                level === lv
                  ? "bg-indigo-500/40 text-indigo-100 ring-1 ring-indigo-400/40"
                  : "text-zinc-400 hover:bg-white/5",
              )}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No lessons" body="Adjust filters or search." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lesson) => (
            <LessonCard key={`${lesson.track}-${lesson.slug}`} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}
