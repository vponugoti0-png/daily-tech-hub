import crypto from "crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "dth_csrf";
export const CSRF_HEADER = "x-csrf-token";

function expectedOrigin(): string | null {
  const raw =
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
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
 * Safe no-op for same-origin browsers that omit Origin on same-site navigations
 * when CSRF header matches cookie.
 */
export async function assertCsrf(req: Request): Promise<
  { ok: true } | { ok: false; status: number; error: string }
> {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const expected = expectedOrigin();

  if (origin) {
    try {
      const o = new URL(origin).origin;
      if (expected && o !== expected) {
        return { ok: false, status: 403, error: "Forbidden" };
      }
      // Dev without AUTH_URL: allow localhost only
      if (!expected) {
        const host = new URL(origin).hostname;
        if (host !== "localhost" && host !== "127.0.0.1") {
          return { ok: false, status: 403, error: "Forbidden" };
        }
      }
    } catch {
      return { ok: false, status: 403, error: "Forbidden" };
    }
  } else if (referer) {
    try {
      const r = new URL(referer).origin;
      if (expected && r !== expected) {
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
