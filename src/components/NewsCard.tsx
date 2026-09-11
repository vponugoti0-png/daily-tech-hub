import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { TopicBadge } from "./Badge";
import { formatDate } from "@/lib/dates";
import { Newspaper } from "lucide-react";

export function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group glass glass-hover flex h-full flex-col rounded-2xl p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {item.topics.map((t) => (
            <TopicBadge key={t} topic={t} />
          ))}
        </div>
        <Newspaper className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-cyan-400" />
      </div>
      <h3 className="text-base font-semibold leading-snug text-white group-hover:text-cyan-100">
        {item.title}
      </h3>
      <p className="mt-2 text-xs text-zinc-500">
        {item.source} · {formatDate(item.publishedAt)}
      </p>
      {!compact ? (
        <>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{item.summary}</p>
          <p className="mt-3 line-clamp-2 border-l-2 border-cyan-500/40 pl-3 text-sm text-zinc-300">
            <span className="font-medium text-cyan-300/90">Why it matters: </span>
            {item.whyItMatters}
          </p>
        </>
      ) : (
        <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{item.summary}</p>
      )}
    </Link>
  );
}
