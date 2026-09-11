import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "dth_session";
const secret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET || "daily-tech-hub-v3-dev-secret-change-me",
  );

export type SessionUser = {
  id: number;
  email: string;
  name: string;
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

async function readCookieSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const id = Number(payload.sub);
    if (!id || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { id, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

/** Prefer email/password JWT cookie; fall back to Auth.js (OAuth) session. */
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

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export { COOKIE };
