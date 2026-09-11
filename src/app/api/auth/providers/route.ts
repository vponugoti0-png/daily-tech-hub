import { NextResponse } from "next/server";
import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";

export const runtime = "nodejs";

/** Public list of OAuth providers that have env credentials configured. */
export async function GET() {
  return NextResponse.json({
    configured: configuredOAuthProviders(),
    all: ["google", "microsoft-entra-id", "twitter"] as const,
  });
}
