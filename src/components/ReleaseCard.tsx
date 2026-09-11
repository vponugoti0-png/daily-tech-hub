import Link from "next/link";
import type { ReleaseBrief } from "@/lib/types";
import { TopicBadge, SoftBadge } from "./Badge";
import { formatDate } from "@/lib/dates";
import { Rocket } from "lucide-react";

export function ReleaseCard({ item }: { item: ReleaseBrief }) {
  return (
    <Link
      href={`/releases/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 transition hover:border-orange-500/30"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <SoftBadge>{item.product}</SoftBadge>
          <SoftBadge className="font-mono">{item.version}</SoftBadge>
        </div>
        <Rocket className="h-4 w-4 text-zinc-500 group-hover:text-orange-300" />
      </div>
      <h3 className="text-base font-semibold text-white group-hover:text-orange-100">{item.title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{formatDate(item.releasedAt)}</p>
      <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{item.summary}</p>
      <p className="mt-3 line-clamp-2 text-sm text-zinc-300">
        <span className="font-medium text-orange-300/90">Why now: </span>
        {item.whyReadNow}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
    </Link>
  );
}
