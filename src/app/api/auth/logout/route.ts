import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { signOut } from "@/auth";

export const runtime = "nodejs";

export async function POST() {
  await clearSessionCookie();
  try {
    // Clear Auth.js cookies when an OAuth session exists (no-op if none).
    await signOut({ redirect: false });
  } catch {
    // Missing providers / already signed out — ignore.
  }
  return NextResponse.json({ ok: true });
}
