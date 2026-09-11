"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TrainingLesson } from "@/lib/types";
import { getLessonProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function CourseOutline({
  lessons,
  currentSlug,
  track,
}: {
  lessons: TrainingLesson[];
  currentSlug: string;
  track: string;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const l of lessons) {
      map[l.slug] = Boolean(getLessonProgress(track, l.slug)?.completed);
    }
    setDone(map);
  }, [lessons, track]);

  return (
    <aside className="glass sticky top-24 hidden max-h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto rounded-2xl p-4 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
        Course outline
      </p>
      <ol className="space-y-1">
        {lessons.map((l, i) => {
          const active = l.slug === currentSlug;
          return (
            <li key={l.slug}>
              <Link
                href={`/training/${track}/${l.slug}`}
                className={cn(
                  "flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition",
                  active
                    ? "bg-cyan-500/15 text-cyan-100"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[10px] font-semibold">
                  {done[l.slug] ? <Check className="h-3 w-3 text-emerald-400" /> : i + 1}
                </span>
                <span className="leading-snug">{l.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {lessons
        .find((l) => l.slug === currentSlug)
        ?.steps?.length ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            This lesson
          </p>
          <ul className="space-y-1">
            {lessons
              .find((l) => l.slug === currentSlug)!
              .steps!.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
