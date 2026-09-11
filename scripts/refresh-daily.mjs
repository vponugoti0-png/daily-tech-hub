#!/usr/bin/env node
/**
 * Regenerates content/digest.json for "today".
 * - Sets date + lastUpdated timestamps
 * - Rotates featured picks from available seed content (deterministic by date)
 * - Refreshes headline/blurb with a date-aware template
 *
 * Usage: node scripts/refresh-daily.mjs
 *    or: npm run refresh:daily
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentRoot = path.join(root, "content");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(contentRoot, rel), JSON.stringify(data, null, 2) + "\n");
}

function todayParts(d = new Date()) {
  const date = d.toISOString().slice(0, 10);
  const lastUpdated = d.toISOString();
  return { date, lastUpdated };
}

/** Simple stable hash for date string → number */
function hashDate(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) >>> 0;
  return h;
}

function pickRotated(items, count, seed) {
  if (!items.length) return [];
  const start = seed % items.length;
  const out = [];
  for (let i = 0; i < Math.min(count, items.length); i++) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
}

function main() {
  const { date, lastUpdated } = todayParts();
  const seed = hashDate(date);

  const news = readJson("news/items.json");
  const releases = readJson("releases/items.json");
  const shortcuts = readJson("shortcuts/items.json");

  // Lessons: scrape slugs from markdown frontmatter lightly
  const lessonSlugs = [];
  for (const track of ["python", "sql", "databricks", "snowflake", "git"]) {
    const dir = path.join(contentRoot, "training", track);
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const m = raw.match(/^slug:\s*(.+)$/m);
      if (m) lessonSlugs.push(m[1].trim());
    }
  }

  const featuredNews = pickRotated(news, 4, seed).map((n) => n.slug);
  const featuredLessons = pickRotated(lessonSlugs, 3, seed + 7);
  const featuredReleases = pickRotated(releases, 3, seed + 13).map((r) => r.slug);
  const featuredShortcuts = pickRotated(shortcuts, 3, seed + 19).map((s) => s.slug);

  const blurbs = [
    "Snowflake governance updates, Databricks serverless wins, PySpark pattern refresher, and a Git rebase cheat sheet for safer PRs.",
    "Today’s mix: warehouse SQL tips, incremental load patterns, and release notes worth skimming before you upgrade runtimes.",
    "Fresh picks across the DE stack — Dynamic Tables, Photon/Spark Connect, typing for pipelines, and daily Git hygiene.",
    "A compact digest: curated news, one lesson per track focus, release briefs, and cheat sheets you can open mid-standup.",
  ];

  const digest = {
    date,
    lastUpdated,
    headline: "Today's Data Engineering Digest",
    blurb: blurbs[seed % blurbs.length],
    featuredNewsSlugs: featuredNews,
    featuredLessonSlugs: featuredLessons,
    featuredReleaseSlugs: featuredReleases,
    featuredShortcutSlugs: featuredShortcuts,
  };

  writeJson("digest.json", digest);
  console.log(`✓ Updated content/digest.json for ${date}`);
  console.log(`  lastUpdated: ${lastUpdated}`);
  console.log(`  featured news: ${featuredNews.join(", ")}`);
  console.log(`  featured lessons: ${featuredLessons.join(", ")}`);
  console.log(`  featured releases: ${featuredReleases.join(", ")}`);
  console.log(`  featured shortcuts: ${featuredShortcuts.join(", ")}`);
}

main();
