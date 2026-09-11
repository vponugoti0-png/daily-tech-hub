import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/auth/users";
import { setSessionCookies } from "@/lib/auth/session";
import { assertCsrf, ensureCsrfCookie } from "@/lib/auth/csrf";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const csrf = await assertCsrf(req);
    if (!csrf.ok) {
      return NextResponse.json({ error: csrf.error }, { status: csrf.status });
    }

    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    const ip = clientIp(req);
    const ipLimit = rateLimit(`login:ip:${ip}`, 20, 15 * 60 * 1000);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } },
      );
    }
    if (email) {
      const emailLimit = rateLimit(`login:email:${email}`, 10, 15 * 60 * 1000);
      if (!emailLimit.ok) {
        return NextResponse.json(
          { error: "Too many login attempts. Try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(emailLimit.retryAfterSec) },
          },
        );
      }
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(user, password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setSessionCookies({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    await ensureCsrfCookie();

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
