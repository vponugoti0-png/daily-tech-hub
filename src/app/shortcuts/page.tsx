import type { Metadata } from "next";
import { getAllShortcuts } from "@/lib/content";
import { ShortcutCard } from "@/components/ShortcutCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Shortcuts",
  description: "Tips and cheat sheets for the data engineering stack.",
};

export default function ShortcutsPage() {
  const items = getAllShortcuts();
  return (
    <div>
      <SectionHeader
        eyebrow="Shortcuts"
        title="Tips & cheat sheets"
        description="High-frequency Snowflake, PySpark, Databricks, SQL, Python, and Git patterns."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ShortcutCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
