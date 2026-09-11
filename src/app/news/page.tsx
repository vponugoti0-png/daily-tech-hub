import type { Metadata } from "next";
import { getAllNews } from "@/lib/content";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "News",
  description: "Curated data-engineering news digest.",
};

export default function NewsPage() {
  const items = getAllNews();
  return (
    <div>
      <SectionHeader
        eyebrow="News"
        title="Curated digest"
        description="Headline, source, summary, and why it matters — tuned for platform and pipeline work."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
