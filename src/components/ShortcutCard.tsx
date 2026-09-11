import Link from "next/link";
import type { ShortcutItem } from "@/lib/types";
import { TopicBadge, SoftBadge } from "./Badge";
import { Zap } from "lucide-react";

export function ShortcutCard({ item }: { item: ShortcutItem }) {
  return (
    <Link
      href={`/shortcuts/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 transition hover:border-emerald-500/30"
    >
      <div className="mb-3 flex items-center justify-between">
        <SoftBadge>{item.category}</SoftBadge>
        <Zap className="h-4 w-4 text-zinc-500 group-hover:text-emerald-300" />
      </div>
      <h3 className="text-base font-semibold text-white group-hover:text-emerald-100">{item.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{item.summary}</p>
      <p className="mt-4 text-xs text-zinc-500">{item.tips.length} tips</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
    </Link>
  );
}
