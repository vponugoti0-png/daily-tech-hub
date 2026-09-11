"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { clearLocalProgress } from "@/lib/progress";
import { authedFetch } from "@/lib/auth/client";

export function SignupClient({ oauthConfigured = [] }: { oauthConfigured?: import("@/lib/auth/oauth-providers").OAuthProviderId[] }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Drop guest progress before the session cookie exists — closes the race where
      // refresh/push could upload local lessons onto the brand-new account.
      clearLocalProgress();
      const res = await authedFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      clearLocalProgress();
      await refresh({ uploadLocal: false });
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--signal)]">
          Free account
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink-fg)]">
          Create account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No credit card. No paywalls. Create a free account with email, or tap Continue with Google.
        </p>
        <p className="mt-2 rounded-xl border border-[var(--ink-border)] bg-[var(--panel-2)] px-3 py-2 text-xs leading-relaxed text-[var(--muted)]">
          You&apos;ll be signed in right away. We don&apos;t send a confirmation email yet — save
          your password (or use Google next time).
        </p>
      </div>

      <div className="panel space-y-4 rounded-2xl p-6">
        <OAuthButtons initialConfigured={oauthConfigured} />
        <div className="relative py-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="relative z-10 bg-[var(--panel)] px-3">or email</span>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--ink-border)]" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[var(--muted)]">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              autoComplete="name"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[var(--muted)]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[var(--muted)]">Password (min 8)</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              autoComplete="new-password"
            />
          </label>
          {error ? <p className="text-sm text-[var(--punch)]">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
            {busy ? "Creating…" : "Sign up free"}
          </button>
        </form>
      </div>
      <p className="text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--signal)] underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
