import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { NewsCard } from "@/components/NewsCard";
import { LessonCard } from "@/components/LessonCard";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ShortcutCard } from "@/components/ShortcutCard";
import { getFeaturedBundle } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { digest, news, lessons, releases, shortcuts } = getFeaturedBundle();

  return (
    <div className="space-y-14">
      <Hero digest={digest} />

      <section>
        <SectionHeader
          eyebrow="News"
          title="Curated digest"
          description="Skimmable headlines with why-it-matters for Snowflake, Databricks, Python, and PySpark."
          href="/news"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {news.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Training"
          title="Progressive lessons"
          description="Python, SQL, and Git — oriented to data-engineering workflows."
          href="/training"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Releases"
            title="What changed"
            description="Briefs you can act on this week."
            href="/releases"
          />
          <div className="grid gap-4">
            {releases.map((item) => (
              <ReleaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="Shortcuts"
            title="Tips & cheat sheets"
            description="High-frequency commands and patterns."
            href="/shortcuts"
          />
          <div className="grid gap-4">
            {shortcuts.map((item) => (
              <ShortcutCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Daily refresh</h2>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">
                Roll “today’s digest” locally with{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-cyan-200">
                  npm run refresh:daily
                </code>{" "}
                or hit the documented refresh API in development.
              </p>
            </div>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-100"
          >
            Search the hub <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
