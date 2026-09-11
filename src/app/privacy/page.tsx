import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Aurora / Daily Tech Hub collects and uses account data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--signal)]">
          Legal
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink-fg)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: September 11, 2026</p>
      </div>

      <div className="panel space-y-4 rounded-2xl p-6 text-sm leading-relaxed text-[var(--muted)]">
        <p>
          Aurora (Daily Tech Hub) is a free learning site. This page explains what we collect and
          why. It is a plain-language starter policy for the product — not formal legal advice.
        </p>
        <h2 className="font-display text-base font-bold text-[var(--ink-fg)]">What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Account email, display name, and password hash (if you sign up with email).</li>
          <li>
            If you use Google sign-in: name, email, and Google account id from Google (we do not
            receive your Google password).
          </li>
          <li>Learning progress (lessons completed, quiz scores) tied to your account.</li>
          <li>Basic technical logs needed to run and secure the service (e.g. rate limits).</li>
        </ul>
        <h2 className="font-display text-base font-bold text-[var(--ink-fg)]">How we use it</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>To sign you in and keep your progress in sync.</li>
          <li>To operate, secure, and improve the site.</li>
          <li>We do not sell your personal data.</li>
        </ul>
        <h2 className="font-display text-base font-bold text-[var(--ink-fg)]">Cookies</h2>
        <p>
          We use essential session/auth cookies so you stay signed in. These are strictly necessary
          for the service. We do not currently set analytics or advertising cookies.
        </p>
        <h2 className="font-display text-base font-bold text-[var(--ink-fg)]">Third parties</h2>
        <p>
          Hosting (Railway) and Google (only if you choose Google sign-in). Content you study stays
          on our servers with your progress database.
        </p>
        <h2 className="font-display text-base font-bold text-[var(--ink-fg)]">Your choices</h2>
        <p>
          You can sign out anytime. To request access, export, or deletion of your account data,
          email{" "}
          <a className="text-[var(--signal)] underline-offset-2 hover:underline" href="mailto:vponugoti0@gmail.com">
            vponugoti0@gmail.com
          </a>
          .
        </p>
        <p>
          See also our{" "}
          <Link href="/terms" className="text-[var(--signal)] underline-offset-2 hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
