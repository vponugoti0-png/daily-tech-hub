import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug } from "@/lib/content";
import { TopicBadge } from "@/components/Badge";
import { formatDate } from "@/lib/dates";
import { ArrowLeft, ExternalLink } from "lucide-react";

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to news
      </Link>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        {item.source} · {formatDate(item.publishedAt)}
      </p>
      <div className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Summary</h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-300">{item.summary}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
            Why it matters
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-200">{item.whyItMatters}</p>
        </div>
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Visit source <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
