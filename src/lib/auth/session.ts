import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAuthSecret } from "@/lib/auth/secret";

/** @deprecated legacy single-cookie name — still cleared on logout */
export const COOKIE = "dth_session";
export const ACCESS_COOKIE = "dth_access";
export const REFRESH_COOKIE = "dth_refresh";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "30d";
const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

const secret = () => new TextEncoder().encode(getAuthSecret());

export type SessionUser = {
  id: number;
  email: string;
  name: string;
};

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function payloadToUser(payload: {
  sub?: string;
  email?: unknown;
  name?: unknown;
}): SessionUser | null {
  const id = Number(payload.sub);
  if (!id || typeof payload.email !== "string" || typeof payload.name !== "string") {
    return null;
  }
  return { id, email: payload.email, name: payload.name };
}

export async function createAccessToken(user: SessionUser) {
  return new SignJWT({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(secret());
}

export async function createRefreshToken(user: SessionUser) {
  return new SignJWT({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    typ: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(secret());
}

/** @deprecated use createAccessToken + createRefreshToken */
export async function createSessionToken(user: SessionUser) {
  return createAccessToken(user);
}

async function verifyTyped(
  token: string,
  typ: "access" | "refresh" | "legacy",
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    const tokenTyp = payload.typ;
    if (typ === "legacy") {
      // Old dth_session cookies had no typ claim
      if (tokenTyp === "refresh") return null;
    } else if (tokenTyp !== typ) {
      return null;
    }
    return payloadToUser(payload);
  } catch {
    return null;
  }
}

async function readCookieSession(): Promise<SessionUser | null> {
  const jar = await cookies();

  const access = jar.get(ACCESS_COOKIE)?.value;
  if (access) {
    const user = await verifyTyped(access, "access");
    if (user) return user;
  }

  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const user = await verifyTyped(refresh, "refresh");
    if (user) {
      // Silent rotate: mint a fresh access token when refresh is still valid
      const nextAccess = await createAccessToken(user);
      jar.set(ACCESS_COOKIE, nextAccess, cookieOpts(ACCESS_MAX_AGE));
      return user;
    }
  }

  // Backward compatible: accept legacy 30d dth_session until it expires
  const legacy = jar.get(COOKIE)?.value;
  if (legacy) {
    const user = await verifyTyped(legacy, "legacy");
    if (user) {
      await setSessionCookies(user);
      jar.delete(COOKIE);
      return user;
    }
  }

  return null;
}

/** Prefer email/password JWT cookies; fall back to Auth.js (OAuth) session. */
export async function readSession(): Promise<SessionUser | null> {
  const cookieSession = await readCookieSession();
  if (cookieSession) return cookieSession;

  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    const id = Number(session?.user?.id);
    if (!id || !session?.user?.email || !session.user.name) return null;
    return {
      id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookies(user: SessionUser) {
  const jar = await cookies();
  const [access, refresh] = await Promise.all([
    createAccessToken(user),
    createRefreshToken(user),
  ]);
  jar.set(ACCESS_COOKIE, access, cookieOpts(ACCESS_MAX_AGE));
  jar.set(REFRESH_COOKIE, refresh, cookieOpts(REFRESH_MAX_AGE));
}

/** @deprecated prefer setSessionCookies(user) */
export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, token, cookieOpts(ACCESS_MAX_AGE));
}

export async function clearSessionCookie() {
  const jar = await cookies();
  // Next.js jar.delete() often fails to clear httpOnly cookies across hosts;
  // expire explicitly with the same path/sameSite attributes used when setting.
  const expired = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  for (const name of [COOKIE, ACCESS_COOKIE, REFRESH_COOKIE]) {
    jar.set(name, "", expired);
    jar.delete(name);
  }
}

export { ACCESS_TTL, REFRESH_TTL };
