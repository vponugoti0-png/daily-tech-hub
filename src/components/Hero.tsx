import { formatDate, formatDateTime, relativeTime } from "@/lib/dates";
import type { DigestMeta } from "@/lib/types";
import { CalendarDays, RefreshCw } from "lucide-react";

export function Hero({ digest }: { digest: DigestMeta }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1524] via-[#0a1220] to-[#111827] p-6 sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 font-medium text-cyan-300 ring-1 ring-cyan-500/30">
            <CalendarDays className="h-3.5 w-3.5" />
            Today · {formatDate(digest.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Updated {relativeTime(digest.lastUpdated)}
            <span className="text-zinc-600">({formatDateTime(digest.lastUpdated)})</span>
          </span>
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {digest.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {digest.blurb}
        </p>
      </div>
    </section>
  );
}
