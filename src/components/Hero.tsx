"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, formatDateTime, relativeTime } from "@/lib/dates";
import type { DigestMeta } from "@/lib/types";
import { ArrowRight, BookOpen, CalendarDays, Keyboard, Newspaper, RefreshCw } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10" /> },
);

export function Hero({ digest }: { digest: DigestMeta }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1524]/90 via-[#0a1220]/95 to-[#111827] p-6 sm:p-10">
      <HeroScene />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 font-medium text-cyan-300 ring-1 ring-cyan-500/30">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
              <CalendarDays className="h-3.5 w-3.5" />
              Today · {formatDate(digest.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Updated {relativeTime(digest.lastUpdated)}
              <span className="hidden text-zinc-600 sm:inline">({formatDateTime(digest.lastUpdated)})</span>
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {digest.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {digest.blurb}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
        >
          {[
            { href: "/training", label: "Start a course", icon: BookOpen, desc: "Python · SQL · DBX · Snowflake" },
            { href: "/shortcuts", label: "Open shortcuts", icon: Keyboard, desc: "CLI · SQL · Keyboard · AI" },
            { href: "/news", label: "Skim today’s news", icon: Newspaper, desc: "Why-it-matters digests" },
            { href: "/search", label: "Search the hub", icon: ArrowRight, desc: "Cross-content find" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="glass glass-hover group flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <a.icon className="h-4.5 w-4.5 h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white group-hover:text-cyan-100">
                  {a.label}
                </span>
                <span className="text-xs text-zinc-500">{a.desc}</span>
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
