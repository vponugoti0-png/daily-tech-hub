"use client";

export const CSRF_HEADER = "x-csrf-token";

function readCsrfFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )dth_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let cachedCsrf: string | null = null;

/** Ensure CSRF cookie exists (via /api/auth/me) and return token for mutating fetches. */
export async function getCsrfToken(): Promise<string | null> {
  const fromDoc = readCsrfFromDocument();
  if (fromDoc) {
    cachedCsrf = fromDoc;
    return fromDoc;
  }
  if (cachedCsrf) return cachedCsrf;
  try {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    const data = (await res.json()) as { csrf?: string };
    cachedCsrf = data.csrf ?? readCsrfFromDocument();
    return cachedCsrf;
  } catch {
    return readCsrfFromDocument();
  }
}

export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const csrf = await getCsrfToken();
  const headers = new Headers(init.headers);
  if (csrf) headers.set(CSRF_HEADER, csrf);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
