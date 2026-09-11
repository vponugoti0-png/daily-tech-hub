# Daily Tech Hub v2

A **premium, interactive** personal daily tech hub for data engineers — curated **News**, complete **Training** tracks, **Release** briefs, and a first-class **Shortcuts** workspace (keyboard · CLI · SQL · AI) for Snowflake, Databricks, Python, SQL/PySpark, Git, and related tools.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **React Three Fiber** for tasteful 3D hero/track visuals. Dark theme by default; optional light mode.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## What’s inside

| Area | Route | Content |
|------|-------|---------|
| Today’s digest | `/` | Interactive homepage: quick actions, featured course, live-feeling cards |
| News | `/news`, `/news/[slug]` | Headline, source, summary, why it matters |
| Training | `/training`, `/training/[track]`, `/training/[track]/[slug]` | Python · SQL · Databricks · Snowflake (+ Git bonus) |
| Releases | `/releases`, `/releases/[slug]` | What changed + why read now |
| Shortcuts | `/shortcuts`, `/shortcuts/[slug]` | Filterable cheat sheets: keyboard / CLI / SQL / AI with copy buttons & sources |
| Search | `/search?q=` | Cross-content search (includes shortcut tip bodies/code) |

### Course tracks (v2)

| Track | Lessons | Focus |
|-------|---------|--------|
| Python | 8 | DE contracts, typing, testing, writers, config, orchestration, perf, packaging |
| SQL | 7 | Windows, incrementals, perf, modeling, DQ, CTEs, semi-structured |
| Databricks | 7 | Lakehouse, Delta, Spark SQL perf, Unity Catalog, Jobs, Streaming, SQL warehouses |
| Snowflake | 7 | Architecture, Time Travel/clones, Streams/Tasks, Dynamic Tables, cost, RBAC, Snowpark |
| Git (bonus) | 3 | Rebase, hygiene, bisect |

Lessons include objectives, exercises, cheat sheets, quiz checkpoints, sticky outlines, and **localStorage progress**.

### Shortcuts (expanded)

14 packs covering Snowflake (UI/SQL/CLI/Cortex AI), Databricks (UI/CLI/Delta/Assistant AI), Python, SQL/PySpark, Git, VS Code/Cursor, dbt, and cloud CLIs. Tips are grouped as **keyboard / cli / sql / ai / ui**, searchable, filterable by tool, with **copy** and **source** links.

## Content layout

```
content/
  digest.json
  news/items.json
  releases/items.json
  shortcuts/items.json
  training/{python,sql,databricks,snowflake,git}/*.md
```

Regenerate structured content (optional):

```bash
npm run generate:courses
npm run generate:shortcuts
```

## Daily refresh

```bash
npm run refresh:daily
```

Rotates featured picks (including new tracks) and timestamps. Dev-only `POST /api/refresh` remains available when allowed.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 · Framer Motion · lucide-react
- `@react-three/fiber` + `@react-three/drei` + `three`
- `gray-matter` + `remark` for Markdown lessons
- `date-fns`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run refresh:daily` | Roll digest metadata |
| `npm run generate:courses` | Regenerate training markdown |
| `npm run generate:shortcuts` | Regenerate shortcuts JSON |

## Remote

`https://github.com/vponugoti0-png/daily-tech-hub`

Do **not** push secrets; content is local seed data only.

## License

Personal project — use and adapt freely.
