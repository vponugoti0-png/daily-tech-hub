import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonsByTrack } from "@/lib/content";
import { getTrackMeta, TRACK_IDS } from "@/lib/tracks";
import { LessonCard } from "@/components/LessonCard";
import { TrackProgressBar } from "@/components/training/ProgressBar";
import { ArrowLeft } from "lucide-react";

import { TrackSceneClient } from "@/components/three/TrackSceneClient";

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  const meta = getTrackMeta(track);
  return { title: meta?.title ?? "Track" };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const meta = getTrackMeta(track);
  const lessons = getLessonsByTrack(track);
  if (!meta || !lessons.length) notFound();
  const slugs = lessons.map((l) => l.slug);

  return (
    <div className="space-y-8">
      <Link
        href="/training"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" /> All tracks
      </Link>

      <div className="glass grid gap-6 overflow-hidden rounded-3xl p-6 sm:grid-cols-[1.2fr_0.8fr] sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/90">
            Course track
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{meta.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{meta.blurb}</p>
          <p className="mt-4 text-xs text-zinc-500">
            {lessons.length} lessons · ~{meta.estimatedHours}h · {meta.difficulty}
          </p>
          <div className="mt-6 max-w-md">
            <TrackProgressBar track={track} slugs={slugs} />
          </div>
          <Link
            href={`/training/${track}/${lessons[0].slug}`}
            className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-cyan-100"
          >
            Start / continue →
          </Link>
        </div>
        <TrackSceneClient track={track} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
