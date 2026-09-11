import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReleases, getReleaseBySlug } from "@/lib/content";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { formatDate } from "@/lib/dates";
import { ArrowLeft, ExternalLink } from "lucide-react";

export function generateStaticParams() {
  return getAllReleases().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getReleaseBySlug(slug);
  return { title: item?.title ?? "Release" };
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getReleaseBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/releases"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to releases
      </Link>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <SoftBadge>{item.product}</SoftBadge>
        <SoftBadge className="font-mono">{item.version}</SoftBadge>
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-3 text-sm text-zinc-500">Released {formatDate(item.releasedAt)}</p>
      <p className="mt-6 text-base leading-relaxed text-zinc-300">{item.summary}</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          What changed
        </h2>
        <ul className="mt-4 space-y-3">
          {item.whatChanged.map((c) => (
            <li key={c} className="flex gap-3 text-sm text-zinc-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
          Why read now
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-200">{item.whyReadNow}</p>
      </div>

      {item.sourceUrl ? (
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-300 hover:text-orange-200"
        >
          Official docs <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </article>
  );
}
