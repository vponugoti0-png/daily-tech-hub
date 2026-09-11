"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { pushLocalProgressToServer } from "@/lib/progress";

export default function SignupPage() {
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      await pushLocalProgressToServer();
      await refresh();
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
          100% free forever
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink-fg)]">
          Create account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No credit card. No paywalls. Sync training progress across devices on this install.
        </p>
      </div>
      <form onSubmit={onSubmit} className="panel space-y-4 rounded-2xl p-6">
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
          <span className="mb-1.5 block text-[var(--muted)]">Password (min 6)</span>
          <input
            type="password"
            required
            minLength={6}
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
      <p className="text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--signal)] underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
