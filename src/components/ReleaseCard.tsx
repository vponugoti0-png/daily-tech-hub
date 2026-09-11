import Link from "next/link";
import type { ReleaseBrief } from "@/lib/types";
import { SoftBadge, TopicBadge } from "./Badge";
import { formatDate } from "@/lib/dates";
import { Package } from "lucide-react";

export function ReleaseCard({ item }: { item: ReleaseBrief }) {
  return (
    <Link
      href={`/releases/${item.slug}`}
      className="group glass glass-hover flex h-full flex-col rounded-2xl p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <SoftBadge>
            {item.product} {item.version}
          </SoftBadge>
          {item.topics.slice(0, 2).map((t) => (
            <TopicBadge key={t} topic={t} />
          ))}
        </div>
        <Package className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-sky-300" />
      </div>
      <h3 className="text-base font-semibold text-white group-hover:text-sky-100">{item.title}</h3>
      <p className="mt-2 text-xs text-zinc-500">{formatDate(item.releasedAt)}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{item.summary}</p>
    </Link>
  );
}
