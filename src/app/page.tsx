import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { NewsCard } from "@/components/NewsCard";
import { LessonCard } from "@/components/LessonCard";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ShortcutCard } from "@/components/ShortcutCard";
import { getFeaturedBundle, getLessonsByTrack } from "@/lib/content";
import { PRIMARY_TRACKS } from "@/lib/tracks";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { digest, news, lessons, releases, shortcuts } = getFeaturedBundle();
  const featuredTrack = PRIMARY_TRACKS[0];
  const featuredTrackLessons = getLessonsByTrack(featuredTrack.id);

  return (
    <div className="space-y-14">
      <Hero digest={digest} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIMARY_TRACKS.map((t) => {
          const count = getLessonsByTrack(t.id).length;
          return (
            <Link
              key={t.id}
              href={`/training/${t.id}`}
              className="glass glass-hover rounded-2xl p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
                Course track
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">{t.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{t.blurb}</p>
              <p className="mt-3 text-xs text-zinc-500">
                {count} lessons · ~{t.estimatedHours}h · {t.difficulty}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="glass overflow-hidden rounded-3xl">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90">
              Featured course
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{featuredTrack.title}</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">{featuredTrack.blurb}</p>
            <Link
              href={`/training/${featuredTrack.id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-cyan-100"
            >
              Continue learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-white/10 bg-black/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="mb-3 text-xs font-medium text-zinc-500">First lessons</p>
            <ul className="space-y-2">
              {featuredTrackLessons.slice(0, 4).map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/training/${l.track}/${l.slug}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    {l.order}. {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
          title="Featured lessons"
          description="Interactive tracks with quizzes, progress, and cheat sheets."
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
            title="CLI · SQL · Keyboard · AI"
            description="Copy-paste commands and AI features by tool."
            href="/shortcuts"
          />
          <div className="grid gap-4">
            {shortcuts.map((item) => (
              <ShortcutCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Daily refresh</h2>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">
                Roll today’s digest with{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-cyan-200">
                  npm run refresh:daily
                </code>
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
