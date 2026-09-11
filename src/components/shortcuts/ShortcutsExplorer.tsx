"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ShortcutGroup, ShortcutItem } from "@/lib/types";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { ExternalLink, Keyboard, Sparkles, Terminal, Database, Layout } from "lucide-react";

const GROUPS: { id: ShortcutGroup | "all"; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: null },
  { id: "keyboard", label: "Keyboard", icon: <Keyboard className="h-3.5 w-3.5" /> },
  { id: "cli", label: "CLI", icon: <Terminal className="h-3.5 w-3.5" /> },
  { id: "sql", label: "SQL / Code", icon: <Database className="h-3.5 w-3.5" /> },
  { id: "ai", label: "AI", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "ui", label: "UI", icon: <Layout className="h-3.5 w-3.5" /> },
];

const TOOLS = [
  { id: "all", label: "All tools" },
  { id: "snowflake", label: "Snowflake" },
  { id: "databricks", label: "Databricks" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL / PySpark" },
  { id: "git", label: "Git" },
  { id: "editor", label: "Editor" },
  { id: "dbt", label: "dbt" },
  { id: "cloud-cli", label: "Cloud CLI" },
];

export function ShortcutsExplorer({ items }: { items: ShortcutItem[] }) {
  const [tool, setTool] = useState("all");
  const [group, setGroup] = useState<ShortcutGroup | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((it) => {
        if (tool === "all") return true;
        if (tool === "sql") {
          return it.tool === "sql" || it.topics.includes("sql") || it.topics.includes("pyspark");
        }
        return it.tool === tool;
      })
      .map((it) => {
        const tips = it.tips.filter((t) => {
          const gOk = group === "all" ? true : (t.group ?? "cli") === group;
          if (!gOk) return false;
          if (!query) return true;
          const hay = `${it.title} ${it.summary} ${t.title} ${t.body} ${t.code ?? ""} ${t.source ?? ""}`.toLowerCase();
          return hay.includes(query);
        });
        return { ...it, tips };
      })
      .filter((it) => it.tips.length > 0);
  }, [items, tool, group, q]);

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shortcuts, commands, AI features…"
            className="w-full flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none ring-cyan-400/40 placeholder:text-zinc-500 focus:ring-2"
            aria-label="Search shortcuts"
          />
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  tool === t.id
                    ? "bg-cyan-400 text-zinc-950"
                    : "bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                group === g.id
                  ? "bg-indigo-500/30 text-indigo-100 ring-1 ring-indigo-400/40"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {g.icon}
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No shortcuts match" body="Try another tool, group, or search term." />
      ) : (
        <div className="space-y-8">
          {filtered.map((item) => (
            <section key={item.slug} id={item.slug} className="glass rounded-3xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <SoftBadge>{item.category}</SoftBadge>
                    {item.tool ? <SoftBadge className="capitalize">{item.tool}</SoftBadge> : null}
                    {item.topics.map((t) => (
                      <TopicBadge key={t} topic={t} />
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    <Link href={`/shortcuts/${item.slug}`} className="hover:text-cyan-200">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm text-zinc-400">{item.summary}</p>
                </div>
                {item.sources?.length ? (
                  <div className="flex flex-col items-end gap-1">
                    {item.sources.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-300/90 hover:text-cyan-200"
                      >
                        Source: {s.label} <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <ul className="mt-5 space-y-3">
                {item.tips.map((tip, i) => (
                  <li
                    key={`${tip.title}-${i}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <SoftBadge className="capitalize">{tip.group ?? "tip"}</SoftBadge>
                      <h3 className="text-sm font-semibold text-white">{tip.title}</h3>
                      {tip.source ? (
                        <span className="text-[11px] text-zinc-500">· {tip.source}</span>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{tip.body}</p>
                    {tip.code ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]">
                        <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
                          <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Copy-paste ready
                          </span>
                          <CopyButton text={tip.code} />
                        </div>
                        <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-cyan-50/90">
                          <code>{tip.code}</code>
                        </pre>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
