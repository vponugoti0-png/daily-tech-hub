import type { Metadata } from "next";
import { getAllShortcuts } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";
import { ShortcutsExplorer } from "@/components/shortcuts/ShortcutsExplorer";

export const metadata: Metadata = {
  title: "Shortcuts",
  description:
    "Keyboard, CLI, SQL, and AI shortcuts for Snowflake, Databricks, Python, SQL/PySpark, Git, and more.",
};

export default function ShortcutsPage() {
  const items = getAllShortcuts();
  return (
    <div>
      <SectionHeader
        eyebrow="Shortcuts"
        title="Commands, keys & AI by tool"
        description="Filter by Snowflake, Databricks, Python, SQL/PySpark, Git, editors, dbt, and cloud CLIs. Copy-paste ready snippets with sources."
      />
      <ShortcutsExplorer items={items} />
    </div>
  );
}
