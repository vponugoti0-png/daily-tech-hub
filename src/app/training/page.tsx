import type { Metadata } from "next";
import Link from "next/link";
import { getAllLessons, getLessonsByTrack } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";
import { TRACKS } from "@/lib/tracks";
import { TrainingFilters } from "@/components/training/TrainingFilters";

export const metadata: Metadata = {
  title: "Training",
  description: "Python, SQL, Databricks, Snowflake, and Git courses for data engineers.",
};

export default function TrainingPage() {
  const lessons = getAllLessons();
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Training"
        title="Interactive course tracks"
        description="Substantial lessons with exercises, cheat sheets, quizzes, and local progress tracking."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track) => {
          const trackLessons = getLessonsByTrack(track.id);
          const mins = trackLessons.reduce((a, l) => a + l.durationMinutes, 0);
          return (
            <Link
              key={track.id}
              href={`/training/${track.id}`}
              className="glass glass-hover rounded-3xl p-5"
            >
              <div className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${track.accent}`} />
              <h2 className="text-xl font-semibold text-white">{track.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{track.blurb}</p>
              <p className="mt-4 text-xs text-zinc-500">
                {trackLessons.length} lessons · ~{Math.round(mins / 60)}h {mins % 60}m ·{" "}
                {track.difficulty}
              </p>
            </Link>
          );
        })}
      </div>

      <TrainingFilters lessons={lessons} />
    </div>
  );
}
