"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { FreeForeverBanner } from "@/components/FreeForeverBanner";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/training", label: "Training" },
  { href: "/shortcuts", label: "Shortcuts" },
  { href: "/news", label: "News" },
  { href: "/releases", label: "Releases" },
  { href: "/dashboard", label: "Progress" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink-border)] bg-[color-mix(in_oklab,var(--canvas)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-bold text-[var(--ink-fg)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--coral)] text-[#1a1430] shadow-[0_0_24px_var(--glow)]">
            <Hexagon className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Daily Tech Hub</span>
          <span className="rounded-md bg-[var(--violet)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:ml-1">
            v3
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                  active
                    ? "bg-[var(--panel-2)] text-[var(--ink-fg)]"
                    : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--ink-fg)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden lg:inline">
            <FreeForeverBanner compact />
          </span>
          <ThemeToggle />
          <Link
            href="/search"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-[12px] border border-[var(--ink-border)] bg-[var(--panel)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--ink-fg)]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Search</span>
          </Link>
          {!loading && user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="hidden rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink-fg)] sm:inline"
            >
              Sign out
            </button>
          ) : !loading ? (
            <Link href="/login" className="hidden text-xs font-bold text-[var(--coral)] sm:inline">
              Sign in
            </Link>
          ) : null}
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--panel-2)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[var(--ink-border)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--ink-fg)] hover:bg-[var(--panel-2)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? "/dashboard" : "/signup"}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--coral)]"
            >
              {user ? "Your progress" : "Sign up free"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
