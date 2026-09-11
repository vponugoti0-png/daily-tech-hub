import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { assertCsrf } from "@/lib/auth/csrf";
import { signOut } from "@/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const csrf = await assertCsrf(req);
  if (!csrf.ok) {
    return NextResponse.json({ error: csrf.error }, { status: csrf.status });
  }

  await clearSessionCookie();
  try {
    // Clear Auth.js cookies when an OAuth session exists (no-op if none).
    await signOut({ redirect: false });
  } catch {
    // Missing providers / already signed out — ignore.
  }
  return NextResponse.json({ ok: true });
}
