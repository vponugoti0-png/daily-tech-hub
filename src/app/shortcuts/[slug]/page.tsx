import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllShortcuts, getShortcutBySlug } from "@/lib/content";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { formatDate } from "@/lib/dates";
import { ArrowLeft } from "lucide-react";

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
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-3 text-base text-zinc-400">{item.summary}</p>
      <p className="mt-2 text-xs text-zinc-600">Updated {formatDate(item.updatedAt)}</p>

      <div className="mt-8 space-y-4">
        {item.tips.map((tip) => (
          <div
            key={tip.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-base font-semibold text-white">{tip.title}</h2>
            {tip.body ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.body}</p>
            ) : null}
            {tip.code ? (
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0b1220] p-4 text-[13px] leading-relaxed text-zinc-200">
                <code>{tip.code}</code>
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
