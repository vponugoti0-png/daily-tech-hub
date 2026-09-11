import type { Metadata } from "next";
import { getAllReleases } from "@/lib/content";
import { ReleaseCard } from "@/components/ReleaseCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Releases",
  description: "Release briefs with what changed and why to read now.",
};

export default function ReleasesPage() {
  const items = getAllReleases();
  return (
    <div>
      <SectionHeader
        eyebrow="Releases"
        title="Release briefs"
        description="What changed and why you should skim it before the next maintenance window."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <ReleaseCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
