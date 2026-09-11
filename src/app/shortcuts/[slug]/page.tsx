import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllShortcuts, getShortcutBySlug } from "@/lib/content";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { formatDate } from "@/lib/dates";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export function generateStaticParams() {
  return getAllShortcuts().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getShortcutBySlug(slug);
  return { title: item?.title ?? "Shortcut" };
}

export default async function ShortcutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getShortcutBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/shortcuts"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shortcuts
      </Link>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <SoftBadge>{item.category}</SoftBadge>
        {item.tool ? <SoftBadge className="capitalize">{item.tool}</SoftBadge> : null}
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-3 text-base text-zinc-400">{item.summary}</p>
      <p className="mt-2 text-xs text-zinc-600">Updated {formatDate(item.updatedAt)}</p>
      {item.sources?.length ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {item.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
            >
              {s.label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {item.tips.map((tip, i) => (
          <div
            key={`${tip.title}-${i}`}
            className="glass rounded-2xl p-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {tip.group ? <SoftBadge className="capitalize">{tip.group}</SoftBadge> : null}
              <h2 className="text-base font-semibold text-white">{tip.title}</h2>
              {tip.source ? <span className="text-[11px] text-zinc-500">· {tip.source}</span> : null}
            </div>
            {tip.body ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.body}</p>
            ) : null}
            {tip.code ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]">
                <div className="flex justify-end border-b border-white/5 px-3 py-1.5">
                  <CopyButton text={tip.code} />
                </div>
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-zinc-200">
                  <code>{tip.code}</code>
                </pre>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
