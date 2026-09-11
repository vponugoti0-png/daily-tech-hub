export type Topic =
  | "snowflake"
  | "databricks"
  | "python"
  | "pyspark"
  | "sql"
  | "git"
  | "general";

export type ContentKind = "news" | "training" | "release" | "shortcut";

export interface NewsItem {
  slug: string;
  title: string;
  source: string;
  sourceUrl?: string;
  summary: string;
  whyItMatters: string;
  topics: Topic[];
  publishedAt: string;
  featured?: boolean;
}

export interface TrainingLesson {
  slug: string;
  track: "python" | "sql" | "git";
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  order: number;
  durationMinutes: number;
  topics: Topic[];
  objectives: string[];
  content: string;
  exercises: Exercise[];
  cheatSheet?: CheatSheetEntry[];
  updatedAt: string;
}

export interface Exercise {
  title: string;
  prompt: string;
  hint?: string;
  solution?: string;
}

export interface CheatSheetEntry {
  label: string;
  code: string;
  note?: string;
}

export interface ReleaseBrief {
  slug: string;
  product: string;
  version: string;
  title: string;
  summary: string;
  whatChanged: string[];
  whyReadNow: string;
  topics: Topic[];
  releasedAt: string;
  sourceUrl?: string;
}

export interface ShortcutItem {
  slug: string;
  title: string;
  category: string;
  summary: string;
  topics: Topic[];
  tips: { title: string; body: string; code?: string }[];
  updatedAt: string;
}

export interface DigestMeta {
  date: string;
  lastUpdated: string;
  headline: string;
  blurb: string;
  featuredNewsSlugs: string[];
  featuredLessonSlugs: string[];
  featuredReleaseSlugs: string[];
  featuredShortcutSlugs: string[];
}

export interface SearchResult {
  kind: ContentKind;
  slug: string;
  title: string;
  summary: string;
  href: string;
  topics: Topic[];
}
