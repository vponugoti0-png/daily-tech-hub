# Daily Tech Hub v3

**100% free forever** personal daily tech hub for data engineers — curated **News**, interactive **Training** (including Prompt Engineering + AI for DE), **Release** briefs, and a first-class **Shortcuts** workspace (keyboard · CLI · SQL · AI) with **Claude · Copilot · Grok** packs.

Visual identity: **Aurora Play Lab** (coral = go, mint = done, sky = info, sun = reward). Not a cyan-glass SaaS clone.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **React Three Fiber**, and **SQLite** (`better-sqlite3`) for free email/password auth + progress sync.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## Demo users (free)

Auto-seeded into `data/dth.sqlite` on first auth/progress API hit:

| Email | Password |
|-------|----------|
| `demo@dailytechhub.dev` | `demo1234` |
| `alex@example.com` | `learnfree` |

No premium tiers. Signup is only for progress sync.

```bash
npm run seed:demo   # prints credentials
```

## What’s inside

| Area | Route | Content |
|------|-------|---------|
| Today’s digest | `/` | Dense playful homepage + clear next action |
| News | `/news` | Headline, source, summary, why it matters |
| Training | `/training`… | Python · SQL · Databricks · Snowflake · Git · **Prompt Engineering** · **AI for DE** |
| Progress | `/dashboard` | Cert-style track % (local + synced when logged in) |
| Auth | `/login`, `/signup` | Free email + password (JWT httpOnly cookie) |
| Releases | `/releases` | What changed + why read now |
| Shortcuts | `/shortcuts` | Filterable packs + **favorites / recents** |
| Search | `/search?q=` | Cross-content search |

### Course tracks (v3)

| Track | Lessons | Focus |
|-------|---------|--------|
| Prompt Engineering | 6 | Ask, structure, iterate, verify, safety, learning prompts |
| AI for Data Engineers | 6 | Copilot mindset, debug, safe codegen, docs/tests, tools, review |
| Python | 8 | DE contracts, typing, testing, writers, config, orchestration, perf, packaging |
| SQL | 7 | Windows, incrementals, perf, modeling, DQ, CTEs, semi-structured |
| Databricks | 7 | Lakehouse, Delta, Spark SQL, Unity Catalog, Jobs, Streaming, warehouses |
| Snowflake | 7 | Architecture, Time Travel, Streams/Tasks, Dynamic Tables, cost, RBAC, Snowpark |
| Git (bonus) | 3 | Rebase, hygiene, bisect |

Lessons include objectives, try-it shells (sandbox later), quizzes, outlines (mobile disclosure), and progress (localStorage + SQLite when signed in).

### Shortcuts

17+ packs including **Claude**, **GitHub Copilot**, **Grok**, plus Snowflake / Databricks / Python / SQL / Git / editor / dbt / cloud CLI. Tips grouped as **keyboard / cli / sql / ai / ui**, with copy buttons, sources, **last-updated** stamps, favorites & recents.

## Auth & progress

- SQLite DB: `data/dth.sqlite` (gitignored)
- APIs: `POST /api/auth/signup|login|logout`, `GET /api/auth/me`, `GET|POST /api/progress`
- Session: httpOnly JWT cookie (`AUTH_SECRET` env optional for production)
- Guest progress stays in `localStorage` (`dth-progress-v3`); login merges/syncs

## Content layout

```
content/
  digest.json
  news/items.json
  releases/items.json
  shortcuts/items.json
  training/{python,sql,databricks,snowflake,git,prompt-engineering,ai-data-eng}/*.md
```

```bash
npm run generate:courses
npm run generate:shortcuts
npm run generate:v3          # AI tracks + Claude/Copilot/Grok packs
npm run refresh:daily        # timestamps only (preserves curated featured)
npm run refresh:daily -- --rotate
```

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 · Framer Motion · lucide-react
- `@react-three/fiber` + `@react-three/drei` + `three`
- `better-sqlite3` · `bcryptjs` · `jose`
- `gray-matter` + `remark` for Markdown lessons

## Remote

`https://github.com/vponugoti0-png/daily-tech-hub`

Do **not** push secrets; `data/*.sqlite` is local only.

## License

Personal project — use and adapt freely. **Always free.**
