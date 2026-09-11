import crypto from "crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "dth_csrf";
export const CSRF_HEADER = "x-csrf-token";

/** Origins allowed to call mutating auth APIs (localhost + public preview). */
function trustedOrigins(): Set<string> {
  const out = new Set<string>();
  const raw = process.env.AUTH_TRUSTED_ORIGINS || "";
  for (const part of raw.split(",")) {
    const s = part.trim();
    if (!s) continue;
    try {
      out.add(new URL(s).origin);
    } catch {
      /* skip bad entry */
    }
  }
  // Always include AUTH_URL / NEXTAUTH_URL if set
  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const v = process.env[key];
    if (!v) continue;
    try {
      out.add(new URL(v).origin);
    } catch {
      /* skip */
    }
  }
  // Dev fallback when nothing configured
  if (out.size === 0 && process.env.NODE_ENV !== "production") {
    out.add("http://localhost:3000");
    out.add("http://127.0.0.1:3000");
  }
  return out;
}

function isTrustedOrigin(origin: string): boolean {
  try {
    return trustedOrigins().has(new URL(origin).origin);
  } catch {
    return false;
  }
}

/** Issue / refresh a double-submit CSRF cookie (readable by JS). */
export async function ensureCsrfCookie(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CSRF_COOKIE)?.value;
  if (existing && existing.length >= 32) return existing;
  const token = crypto.randomBytes(32).toString("base64url");
  jar.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return token;
}

/**
 * Validate Origin/Referer (when available) + double-submit CSRF header.
 * Accepts any origin listed in AUTH_TRUSTED_ORIGINS (and AUTH_URL if set).
 */
export async function assertCsrf(req: Request): Promise<
  { ok: true } | { ok: false; status: number; error: string }
> {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (origin) {
    if (!isTrustedOrigin(origin)) {
      return { ok: false, status: 403, error: "Forbidden" };
    }
  } else if (referer) {
    try {
      const r = new URL(referer).origin;
      if (!isTrustedOrigin(r)) {
        return { ok: false, status: 403, error: "Forbidden" };
      }
    } catch {
      return { ok: false, status: 403, error: "Forbidden" };
    }
  }

  const jar = await cookies();
  const cookieToken = jar.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get(CSRF_HEADER);
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return { ok: false, status: 403, error: "Invalid CSRF token" };
  }
  return { ok: true };
}
