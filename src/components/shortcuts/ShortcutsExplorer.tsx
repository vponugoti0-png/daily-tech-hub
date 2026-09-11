"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ShortcutGroup, ShortcutItem } from "@/lib/types";
import { SoftBadge, TopicBadge } from "@/components/Badge";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Keyboard,
  Sparkles,
  Terminal,
  Database,
  Layout,
  Star,
  Clock,
} from "lucide-react";

const FAV_KEY = "dth-shortcut-favs-v3";
const RECENT_KEY = "dth-shortcut-recents-v3";

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
  { id: "claude", label: "Claude" },
  { id: "copilot", label: "Copilot" },
  { id: "grok", label: "Grok" },
  { id: "snowflake", label: "Snowflake" },
  { id: "databricks", label: "Databricks" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL / PySpark" },
  { id: "git", label: "Git" },
  { id: "editor", label: "Editor" },
  { id: "dbt", label: "dbt" },
  { id: "cloud-cli", label: "Cloud CLI" },
];

function loadList(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as string[];
  } catch {
    return [];
  }
}

export function ShortcutsExplorer({ items }: { items: ShortcutItem[] }) {
  const [tool, setTool] = useState("all");
  const [group, setGroup] = useState<ShortcutGroup | "all">("all");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  useEffect(() => {
    setFavs(loadList(FAV_KEY));
    setRecents(loadList(RECENT_KEY));
  }, []);

  function toggleFav(slug: string) {
    setFavs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }

  function touchRecent(slug: string) {
    setRecents((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((it) => {
        if (showFavsOnly && !favs.includes(it.slug)) return false;
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
  }, [items, tool, group, q, showFavsOnly, favs]);

  const recentItems = recents
    .map((s) => items.find((i) => i.slug === s))
    .filter(Boolean) as ShortcutItem[];

  return (
    <div className="space-y-5">
      <div className="panel rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shortcuts — W3Schools fast…"
            className="field flex-1"
            aria-label="Search shortcuts"
          />
          <button
            type="button"
            onClick={() => setShowFavsOnly((v) => !v)}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-[14px] px-3 text-xs font-bold",
              showFavsOnly
                ? "bg-[var(--sun)] text-[#1a1430]"
                : "border border-[var(--ink-border)] text-[var(--muted)]",
            )}
          >
            <Star className="h-3.5 w-3.5" /> Favorites
          </button>
        </div>
        <div className="chip-row wrap-md mt-3">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-bold transition",
                tool === t.id
                  ? "bg-[var(--coral)] text-[#1a1430]"
                  : "bg-[var(--panel-2)] text-[var(--muted)] ring-1 ring-[var(--ink-border)] hover:text-[var(--ink-fg)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                group === g.id
                  ? "bg-[var(--sky)]/20 text-[var(--sky)] ring-1 ring-[var(--sky)]/40"
                  : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--ink-fg)]",
              )}
            >
              {g.icon}
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {recentItems.length && !showFavsOnly && !q ? (
        <div className="rounded-2xl border border-[var(--ink-border)] bg-[var(--panel)] p-4">
          <p className="mb-2 flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sky)]">
            <Clock className="h-3 w-3" /> Recents
          </p>
          <div className="chip-row">
            {recentItems.map((it) => (
              <a
                key={it.slug}
                href={`#${it.slug}`}
                onClick={() => touchRecent(it.slug)}
                className="shrink-0 rounded-full bg-[var(--panel-2)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-fg)] ring-1 ring-[var(--ink-border)]"
              >
                {it.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState title="No shortcuts match" body="Try another tool, group, or search term." />
      ) : (
        <div className="space-y-6">
          {filtered.map((item) => (
            <section
              key={item.slug}
              id={item.slug}
              className="panel rounded-3xl p-5 sm:p-6"
              onMouseEnter={() => touchRecent(item.slug)}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <SoftBadge>{item.category}</SoftBadge>
                    {item.tool ? <SoftBadge className="capitalize">{item.tool}</SoftBadge> : null}
                    <SoftBadge>Updated {item.updatedAt}</SoftBadge>
                    {item.topics.map((t) => (
                      <TopicBadge key={t} topic={t} />
                    ))}
                  </div>
                  <h2 className="font-display text-xl font-bold text-[var(--ink-fg)]">
                    <Link
                      href={`/shortcuts/${item.slug}`}
                      className="hover:text-[var(--coral)]"
                      onClick={() => touchRecent(item.slug)}
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">{item.summary}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    aria-label={favs.includes(item.slug) ? "Remove favorite" : "Add favorite"}
                    onClick={() => toggleFav(item.slug)}
                    className={cn(
                      "inline-flex min-h-[40px] items-center gap-1 rounded-[12px] px-3 text-xs font-bold",
                      favs.includes(item.slug)
                        ? "bg-[var(--sun)]/25 text-[var(--sun)]"
                        : "border border-[var(--ink-border)] text-[var(--muted)]",
                    )}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {favs.includes(item.slug) ? "Favorited" : "Favorite"}
                  </button>
                  {item.sources?.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--sky)] hover:underline"
                    >
                      {s.label} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {item.tips.map((tip, i) => (
                  <li
                    key={`${tip.title}-${i}`}
                    className="rounded-2xl border border-[var(--ink-border)] bg-[var(--canvas)]/40 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <SoftBadge className="capitalize">{tip.group ?? "tip"}</SoftBadge>
                      <h3 className="text-sm font-semibold text-[var(--ink-fg)]">{tip.title}</h3>
                      {tip.source ? (
                        <span className="text-[11px] text-[var(--muted)]">· {tip.source}</span>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">{tip.body}</p>
                    {tip.code ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-[var(--ink-border)] bg-[#0e1426]">
                        <div className="flex items-center justify-between border-b border-[var(--ink-border)] px-3 py-1.5">
                          <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                            Copy-paste ready
                          </span>
                          <CopyButton text={tip.code} />
                        </div>
                        <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-[#f0ecff]">
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
