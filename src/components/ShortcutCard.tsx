import Link from "next/link";
import type { ShortcutItem } from "@/lib/types";
import { SoftBadge, TopicBadge } from "./Badge";
import { Keyboard, Sparkles, Terminal, Zap } from "lucide-react";

export function ShortcutCard({ item }: { item: ShortcutItem }) {
  const groups = new Set(item.tips.map((t) => t.group).filter(Boolean));
  return (
    <Link
      href={`/shortcuts/${item.slug}`}
      className="group glass glass-hover flex h-full flex-col rounded-2xl p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <SoftBadge>{item.category}</SoftBadge>
          {item.tool ? <SoftBadge className="capitalize">{item.tool}</SoftBadge> : null}
        </div>
        <Zap className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-amber-300" />
      </div>
      <h3 className="text-base font-semibold text-white group-hover:text-cyan-100">{item.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{item.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
        {groups.has("keyboard") ? (
          <span className="inline-flex items-center gap-1">
            <Keyboard className="h-3 w-3" /> keys
          </span>
        ) : null}
        {groups.has("cli") || groups.has("sql") ? (
          <span className="inline-flex items-center gap-1">
            <Terminal className="h-3 w-3" /> commands
          </span>
        ) : null}
        {groups.has("ai") ? (
          <span className="inline-flex items-center gap-1 text-violet-300/80">
            <Sparkles className="h-3 w-3" /> AI
          </span>
        ) : null}
        <span>{item.tips.length} tips</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
    </Link>
  );
}
