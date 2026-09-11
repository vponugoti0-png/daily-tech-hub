import Link from "next/link";
import type { TrainingLesson } from "@/lib/types";
import { SoftBadge, TopicBadge } from "./Badge";
import { BookOpen, Clock } from "lucide-react";

export function LessonCard({ lesson }: { lesson: TrainingLesson }) {
  return (
    <Link
      href={`/training/${lesson.track}/${lesson.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 transition hover:border-violet-500/30"
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <SoftBadge className="capitalize">{lesson.track}</SoftBadge>
        <SoftBadge className="capitalize">{lesson.level}</SoftBadge>
        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
          <Clock className="h-3 w-3" /> {lesson.durationMinutes} min
        </span>
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
