"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { OAuthProviderId } from "@/lib/auth/oauth-providers";

const LABELS: Record<OAuthProviderId, string> = {
  google: "Continue with Google",
  "microsoft-entra-id": "Continue with Microsoft",
  twitter: "Continue with X",
};

export function OAuthButtons({
  callbackUrl = "/dashboard",
  initialConfigured = [],
}: {
  callbackUrl?: string;
  /** Server-provided list — avoids “Checking social login…” flash */
  initialConfigured?: OAuthProviderId[];
}) {
  const configured = initialConfigured;
  const [busy, setBusy] = useState<OAuthProviderId | null>(null);
  const [hint, setHint] = useState("");

  if (configured.length === 0) {
    return null;
  }

  async function onClick(id: OAuthProviderId) {
    setHint("");
    setBusy(id);
    try {
      await signIn(id, { callbackUrl });
    } catch {
      setHint("Could not start Google sign-in. Try email instead, or refresh the page.");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Free account · one-tap sign-in
      </p>
      <div className="grid gap-2">
        {configured.map((id) => (
          <button
            key={id}
            type="button"
            disabled={busy !== null}
            onClick={() => void onClick(id)}
            className="btn-ghost flex w-full items-center justify-center gap-2 disabled:opacity-50"
          >
            <OAuthIcon id={id} />
            {busy === id ? "Opening Google…" : LABELS[id]}
          </button>
        ))}
      </div>
      {hint ? <p className="text-sm text-[var(--punch)]">{hint}</p> : null}
    </div>
  );
}

function OAuthIcon({ id }: { id: OAuthProviderId }) {
  if (id === "google") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );
  }
  if (id === "microsoft-entra-id") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}
