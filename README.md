# Daily Tech Hub

A polished personal daily tech hub for data engineers — curated **News**, progressive **Training**, **Release** briefs, and **Shortcuts** for Snowflake, Databricks, Python, and PySpark.

Built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. Dark-mode-first, mobile-responsive, with search across all content.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## What’s inside

| Area | Route | Content |
|------|-------|---------|
| Today’s digest | `/` | Date-aware homepage with featured picks + last-updated |
| News | `/news`, `/news/[slug]` | Headline, source, summary, why it matters |
| Training | `/training`, `/training/[track]/[slug]` | Python · SQL · Git lessons with exercises |
| Releases | `/releases`, `/releases/[slug]` | What changed + why read now |
| Shortcuts | `/shortcuts`, `/shortcuts/[slug]` | Tips & cheat sheets |
| Search | `/search?q=` | Cross-content search |

Seed content lives under `content/`:

```
content/
  digest.json          # today’s digest metadata (date, featured slugs)
  news/items.json
  releases/items.json
  shortcuts/items.json
  training/{python,sql,git}/*.md
```

## Daily refresh

Regenerate digest metadata for **today** (timestamps + rotated featured picks):

```bash
npm run refresh:daily
# equivalent:
node scripts/refresh-daily.mjs
```

What it does:

1. Sets `date` to today’s UTC calendar date and `lastUpdated` to now (ISO).
2. Deterministically rotates featured news / lessons / releases / shortcuts from seed content (stable for a given date).
3. Refreshes the homepage blurb from a small template pool.

In local development you can also `POST /api/refresh` (disabled in production unless `ALLOW_REFRESH_API=1`). Prefer the npm script for day-to-day use.

After refreshing, restart or refresh the Next.js app to see the updated homepage digest.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- `gray-matter` + `remark` for Markdown lessons
- `date-fns` for timestamps
- `lucide-react` icons

## Git remote (optional)

This repo is ready to push to:

`https://github.com/vponugoti0-png/daily-tech-hub`

```bash
git remote add origin https://github.com/vponugoti0-png/daily-tech-hub.git
git push -u origin main
```

Do **not** push secrets; content is local seed data only.

## License

Personal project — use and adapt freely.
