import type { Metadata } from "next";
import { getAllLessons } from "@/lib/content";
import { LessonCard } from "@/components/LessonCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Training",
  description: "Python, SQL, and Git lessons for data engineers.",
};

const TRACK_META = [
  {
    id: "python",
    title: "Python",
    blurb: "ETL utilities, typing, and testable logic that ports to PySpark.",
  },
  {
    id: "sql",
    title: "SQL",
    blurb: "Windows, incrementals, and warehouse performance for Snowflake & Databricks.",
  },
  {
    id: "git",
    title: "Git",
    blurb: "Rebase, hygiene, and bisect workflows for analytics repos.",
  },
] as const;

export default function TrainingPage() {
  const lessons = getAllLessons();
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Training"
        title="Progressive lessons"
        description="Multi-lesson tracks with exercises and cheat sheets — data-engineer oriented."
      />
      {TRACK_META.map((track) => {
        const trackLessons = lessons.filter((l) => l.track === track.id);
        return (
          <section key={track.id} id={track.id}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">{track.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{track.blurb}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trackLessons.map((lesson) => (
                <LessonCard key={lesson.slug} lesson={lesson} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
