# Deploy Aurora on Vercel (free) + Turso (free)

Vercel functions have a read-only filesystem, so Aurora stores users and progress in
**Turso (libSQL)** via `@libsql/client`. Locally, with no `TURSO_DATABASE_URL`, it uses
`file:./data/aurora.db` (override with `LOCAL_DB_URL`). Schema is created/migrated
automatically on first DB use. Demo users are seeded only when `NODE_ENV !== production`.

## 1. Create the Turso database
```bash
turso auth login
turso db create aurora
turso db show aurora --url          # -> TURSO_DATABASE_URL (libsql://...)
turso db tokens create aurora       # -> TURSO_AUTH_TOKEN
```

## 2. Create the Vercel project
```bash
vercel login
vercel link            # framework: Next.js, defaults are fine
```
Or import github.com/vponugoti0-png/daily-tech-hub in the Vercel dashboard (Hobby plan).

## 3. Environment variables (Production + Preview)
| Name | Required | Value |
|---|---|---|
| `TURSO_DATABASE_URL` | yes | `libsql://aurora-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | yes | token from `turso db tokens create` |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` (signs Auth.js + session JWTs) |
| `AUTH_URL` | recommended | `https://<project>.vercel.app` (or custom domain) |
| `AUTH_TRUST_HOST` | yes | `true` |
| `AUTH_GOOGLE_ID` | for Google login | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | for Google login | Google OAuth client secret |
| `AUTH_TRUSTED_ORIGINS` | optional | extra comma-separated origins allowed for auth POSTs (custom domains) |
| `AUTH_TWITTER_ID` / `AUTH_TWITTER_SECRET` | optional | X login |
| `AUTH_MICROSOFT_ENTRA_ID_ID` / `_SECRET` / `_ISSUER` | optional | Microsoft login |

`VERCEL_URL`, `VERCEL_BRANCH_URL` and `VERCEL_PROJECT_PRODUCTION_URL` (set by Vercel
automatically) are trusted origins for the CSRF check, so preview deployments work.

```bash
vercel env add TURSO_DATABASE_URL production   # repeat per variable / environment
vercel --prod
```

## 4. Google OAuth
In Google Cloud Console -> APIs & Services -> Credentials -> your OAuth client:
- **Authorized JavaScript origins:** `https://<project>.vercel.app`
- **Authorized redirect URIs:** `https://<project>.vercel.app/api/auth/callback/google`

Add the same for any custom domain. Preview URLs change per deploy, so Google login is
best tested on the production domain.

## Notes
- Nothing writes to disk at runtime when `TURSO_DATABASE_URL` is set; if it is missing on
  Vercel the app fails fast with a clear error instead of trying to create a local file.
- `content/` is read-only at runtime and included in function bundles via
  `outputFileTracingIncludes`.
- `npm run refresh:daily` writes content files: run it locally/CI and commit, not on Vercel.
