import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Auth.js builds redirect_uri from AUTH_URL (if set) or x-forwarded-host/host.
 * Leave AUTH_URL unset and normalize host so Google matches the host the user opened.
 * Must forward the request body on POST — dropping it causes MissingCSRF on sign-in.
 */
async function withRequestOrigin(req: NextRequest): Promise<NextRequest> {
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

  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return new NextRequest(url, { headers, method });
  }

  // Buffer the body so we don't need undici's `duplex` typing.
  const body = await req.arrayBuffer();
  return new NextRequest(url, { headers, method, body });
}

export async function GET(req: NextRequest) {
  return handlers.GET(await withRequestOrigin(req));
}

export async function POST(req: NextRequest) {
  return handlers.POST(await withRequestOrigin(req));
}
