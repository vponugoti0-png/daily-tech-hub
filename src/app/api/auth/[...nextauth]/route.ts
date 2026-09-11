import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Auth.js builds redirect_uri from AUTH_URL (if set) or x-forwarded-host/host.
 * Leave AUTH_URL unset and normalize host so Google matches the host the user opened.
 */
function withRequestOrigin(req: NextRequest): NextRequest {
  const protoHeader =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const proto = protoHeader.split(",")[0]?.trim() || "http";
  let host =
    (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "")
      .split(",")[0]
      ?.trim() || "";

  if (host.startsWith("127.0.0.1")) {
    host = host.replace("127.0.0.1", "localhost");
  }
  if (!host || host.startsWith("0.0.0.0")) {
    return req;
  }

  const origin = `${proto}://${host}`;
  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, origin);
  const headers = new Headers(req.headers);
  headers.set("x-forwarded-host", host);
  headers.set("x-forwarded-proto", proto);
  headers.set("host", host);
  return new NextRequest(url, { headers, method: req.method });
}

export async function GET(req: NextRequest) {
  return handlers.GET(withRequestOrigin(req));
}

export async function POST(req: NextRequest) {
  return handlers.POST(withRequestOrigin(req));
}
