import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

/**
 * Development helper — run the daily refresh script.
 * Prefer `npm run refresh:daily` in CI/local shells.
 * Disabled in production builds unless ALLOW_REFRESH_API=1.
 */
export async function POST() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_REFRESH_API !== "1") {
    return NextResponse.json(
      { ok: false, error: "Refresh API disabled in production" },
      { status: 403 },
    );
  }

  const script = path.join(process.cwd(), "scripts", "refresh-daily.mjs");
  try {
    const { stdout, stderr } = await execFileAsync("node", [script], {
      cwd: process.cwd(),
      env: process.env,
    });
    return NextResponse.json({ ok: true, stdout, stderr });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "POST to run refresh, or use: npm run refresh:daily",
  });
}
