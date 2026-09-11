import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  DigestMeta,
  NewsItem,
  ReleaseBrief,
  ShortcutItem,
  TrainingLesson,
  Exercise,
  CheatSheetEntry,
  Topic,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJson<T>(rel: string): T {
  const full = path.join(CONTENT_ROOT, rel);
  return JSON.parse(fs.readFileSync(full, "utf8")) as T;
}

export function getDigest(): DigestMeta {
  return readJson<DigestMeta>("digest.json");
}

export function getAllNews(): NewsItem[] {
  const items = readJson<NewsItem[]>("news/items.json");
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return getAllNews().find((n) => n.slug === slug);
}

export function getAllReleases(): ReleaseBrief[] {
  const items = readJson<ReleaseBrief[]>("releases/items.json");
  return [...items].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
}

export function getReleaseBySlug(slug: string): ReleaseBrief | undefined {
  return getAllReleases().find((r) => r.slug === slug);
}

export function getAllShortcuts(): ShortcutItem[] {
  const items = readJson<ShortcutItem[]>("shortcuts/items.json");
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getShortcutBySlug(slug: string): ShortcutItem | undefined {
  return getAllShortcuts().find((s) => s.slug === slug);
}

function parseExercisesFromMarkdown(body: string): { content: string; exercises: Exercise[]; cheatSheet?: CheatSheetEntry[] } {
  // Content is already authored with exercises inline; we keep full markdown as content.
  // Optionally extract a simple cheat sheet table is skipped — full MD renders instead.
  return { content: body.trim(), exercises: [] };
}

export function getAllLessons(): TrainingLesson[] {
  const tracks = ["python", "sql", "git"] as const;
  const lessons: TrainingLesson[] = [];

  for (const track of tracks) {
    const dir = path.join(CONTENT_ROOT, "training", track);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = parseExercisesFromMarkdown(content);
      lessons.push({
        slug: String(data.slug),
        track: data.track as TrainingLesson["track"],
        title: String(data.title),
        description: String(data.description),
        level: data.level as TrainingLesson["level"],
        order: Number(data.order),
        durationMinutes: Number(data.durationMinutes),
        topics: (data.topics || []) as Topic[],
        objectives: (data.objectives || []) as string[],
        content: parsed.content,
        exercises: parsed.exercises,
        cheatSheet: (data.cheatSheet as CheatSheetEntry[] | undefined) ?? undefined,
        updatedAt: String(data.updatedAt),
      });
    }
  }

  return lessons.sort((a, b) => {
    if (a.track !== b.track) return a.track.localeCompare(b.track);
    return a.order - b.order;
  });
}

export function getLessonsByTrack(track: string): TrainingLesson[] {
  return getAllLessons().filter((l) => l.track === track);
}

export function getLesson(track: string, slug: string): TrainingLesson | undefined {
  return getAllLessons().find((l) => l.track === track && l.slug === slug);
}

export function getFeaturedBundle() {
  const digest = getDigest();
  const news = getAllNews();
  const lessons = getAllLessons();
  const releases = getAllReleases();
  const shortcuts = getAllShortcuts();

  const bySlug = <T extends { slug: string }>(items: T[], slugs: string[]) =>
    slugs.map((s) => items.find((i) => i.slug === s)).filter(Boolean) as T[];

  return {
    digest,
    news: bySlug(news, digest.featuredNewsSlugs),
    lessons: bySlug(lessons, digest.featuredLessonSlugs),
    releases: bySlug(releases, digest.featuredReleaseSlugs),
    shortcuts: bySlug(shortcuts, digest.featuredShortcutSlugs),
  };
}
