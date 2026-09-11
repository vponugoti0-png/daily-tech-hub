import { getAllNews, getAllLessons, getAllReleases, getAllShortcuts } from "./content";
import type { SearchResult } from "./types";

function hay(...parts: (string | string[] | undefined)[]): string {
  return parts
    .flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))
    .join(" ")
    .toLowerCase();
}

export function searchContent(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const n of getAllNews()) {
    if (hay(n.title, n.summary, n.whyItMatters, n.source, n.topics).includes(q)) {
      results.push({
        kind: "news",
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        href: `/news/${n.slug}`,
        topics: n.topics,
      });
    }
  }

  for (const l of getAllLessons()) {
    if (hay(l.title, l.description, l.topics, l.track, l.content).includes(q)) {
      results.push({
        kind: "training",
        slug: l.slug,
        title: l.title,
        summary: l.description,
        href: `/training/${l.track}/${l.slug}`,
        topics: l.topics,
      });
    }
  }

  for (const r of getAllReleases()) {
    if (hay(r.title, r.summary, r.whyReadNow, r.product, r.whatChanged, r.topics).includes(q)) {
      results.push({
        kind: "release",
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: `/releases/${r.slug}`,
        topics: r.topics,
      });
    }
  }

  for (const s of getAllShortcuts()) {
    const tipText = s.tips.map((t) => `${t.title} ${t.body} ${t.code ?? ""}`).join(" ");
    if (hay(s.title, s.summary, s.category, tipText, s.topics).includes(q)) {
      results.push({
        kind: "shortcut",
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        href: `/shortcuts/${s.slug}`,
        topics: s.topics,
      });
    }
  }

  return results;
}
