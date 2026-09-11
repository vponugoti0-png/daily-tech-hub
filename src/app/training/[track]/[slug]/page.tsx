import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLessons, getLesson } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { formatDate } from "@/lib/dates";
import { ArrowLeft, Clock, ListChecks } from "lucide-react";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ track: l.track, slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}): Promise<Metadata> {
  const { track, slug } = await params;
  const lesson = getLesson(track, slug);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  const lesson = getLesson(track, slug);
  if (!lesson) notFound();

  const siblings = getAllLessons().filter((l) => l.track === lesson.track);
  const idx = siblings.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/training"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-violet-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to training
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SoftBadge className="capitalize">{lesson.track}</SoftBadge>
        <SoftBadge className="capitalize">{lesson.level}</SoftBadge>
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} min
        </span>
        <span className="text-xs text-zinc-600">Updated {formatDate(lesson.updatedAt)}</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {lesson.title}
      </h1>
      <p className="mt-3 text-base text-zinc-400">{lesson.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lesson.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>

      {lesson.objectives.length ? (
        <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-violet-300">
            <ListChecks className="h-4 w-4" /> Objectives
          </h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10">
        <Markdown source={lesson.content} />
      </div>

      <nav className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
        {prev ? (
          <Link
            href={`/training/${prev.track}/${prev.slug}`}
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/training/${next.track}/${next.slug}`}
            className="text-sm text-zinc-400 hover:text-white sm:text-right"
          >
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
