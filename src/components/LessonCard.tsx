"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TrainingLesson } from "@/lib/types";
import { SoftBadge, TopicBadge } from "./Badge";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { getLessonProgress } from "@/lib/progress";

export function LessonCard({ lesson }: { lesson: TrainingLesson }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(Boolean(getLessonProgress(lesson.track, lesson.slug)?.completed));
  }, [lesson.track, lesson.slug]);

  return (
    <Link
      href={`/training/${lesson.track}/${lesson.slug}`}
      className="group glass glass-hover flex h-full flex-col rounded-2xl p-5"
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <SoftBadge className="capitalize">{lesson.track}</SoftBadge>
        <SoftBadge className="capitalize">{lesson.level}</SoftBadge>
        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
          <Clock className="h-3 w-3" /> {lesson.durationMinutes} min
        </span>
        {done ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Done
          </span>
        ) : null}
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-white group-hover:text-violet-200">
          {lesson.title}
        </h3>
        <BookOpen className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-violet-300" />
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{lesson.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {lesson.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
    </Link>
  );
}
