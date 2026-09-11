import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { NewsCard } from "@/components/NewsCard";
import { LessonCard } from "@/components/LessonCard";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ShortcutCard } from "@/components/ShortcutCard";
import { FreeForeverBanner } from "@/components/FreeForeverBanner";
import { getFeaturedBundle, getLessonsByTrack } from "@/lib/content";
import { PRIMARY_TRACKS } from "@/lib/tracks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { digest, news, lessons, releases, shortcuts } = getFeaturedBundle();

  return (
    <div className="space-y-10">
      <Hero digest={digest} />
      <FreeForeverBanner />

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-[var(--ink-fg)]">Tracks</h2>
          <Link href="/training" className="text-sm font-bold text-[var(--coral)]">
            All courses →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_TRACKS.map((t) => {
            const count = getLessonsByTrack(t.id).length;
            return (
              <Link
                key={t.id}
                href={`/training/${t.id}`}
                className="panel glass-hover rounded-2xl p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sky)]">
                    {t.badge ?? "Course"}
                  </p>
                  <span className="text-[10px] font-bold text-[var(--mint)]">Free</span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-[var(--ink-fg)]">
                  {t.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{t.blurb}</p>
                <p className="mt-2 text-[11px] text-[var(--muted)]">
                  {count} lessons · ~{t.estimatedHours}h
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="News"
          title="Curated digest"
          description="Skimmable headlines with why-it-matters."
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
          description="Bite-sized checkpoints with quizzes + try-it shells."
          href="/training"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
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
            description="Claude · Copilot · Grok + warehouse packs."
            href="/shortcuts"
          />
          <div className="grid gap-4">
            {shortcuts.map((item) => (
              <ShortcutCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--ink-fg)]">Ready for the next checkpoint?</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Free account syncs progress. No premium tiers — ever.
          </p>
        </div>
        <Link href="/signup" className="btn-primary shrink-0">
          Sign up free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
