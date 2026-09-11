import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth/users";
import { setSessionCookies } from "@/lib/auth/session";
import { assertCsrf, ensureCsrfCookie } from "@/lib/auth/csrf";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import {
  passwordErrorMessage,
  validatePassword,
} from "@/lib/auth/password";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const csrf = await assertCsrf(req);
    if (!csrf.ok) {
      return NextResponse.json({ error: csrf.error }, { status: csrf.status });
    }

    const body = (await req.json()) as {
      email?: string;
      name?: string;
      password?: string;
    };
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim();
    const password = body.password || "";

    const ip = clientIp(req);
    const ipLimit = rateLimit(`signup:ip:${ip}`, 10, 60 * 60 * 1000);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many signup attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } },
      );
    }
    if (email) {
      const emailLimit = rateLimit(`signup:email:${email}`, 5, 60 * 60 * 1000);
      if (!emailLimit.ok) {
        return NextResponse.json(
          { error: "Too many signup attempts. Try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(emailLimit.retryAfterSec) },
          },
        );
      }
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }
    const pwIssue = validatePassword(password);
    if (pwIssue) {
      return NextResponse.json(
        { error: passwordErrorMessage(pwIssue) },
        { status: 400 },
      );
    }
    if (findUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = createUser(email, name, password);
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
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
