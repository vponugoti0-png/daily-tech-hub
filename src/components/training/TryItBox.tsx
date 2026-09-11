"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Play, Sparkles } from "lucide-react";

/** W3Schools/Codecademy-style try-it shell (no full runtime yet). */
export function TryItBox({
  title = "Try it",
  code,
  hint,
  dialect,
}: {
  title?: string;
  code: string;
  hint?: string;
  dialect?: string;
}) {
  const [ran, setRan] = useState(false);
  return (
    <div className="tryit my-6 overflow-hidden rounded-2xl border border-[var(--ink-border)] bg-[var(--panel)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ink-border)] bg-[var(--panel-2)] px-3 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--signal)]" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-fg)]">
            {title}
          </span>
          {dialect ? (
            <span className="rounded-md bg-[var(--signal)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--signal)]">
              {dialect}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={code} />
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--signal)] px-2.5 py-1 text-xs font-bold text-[var(--ink)] hover:brightness-110"
            onClick={() => setRan(true)}
          >
            <Play className="h-3 w-3" /> Run (sandbox soon)
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-[var(--ink-fg)]">
        <code>{code}</code>
      </pre>
      {ran ? (
        <div className="border-t border-[var(--ink-border)] bg-[var(--panel-2)] px-3 py-2 text-xs text-[var(--muted)]">
          Sandbox runtime ships later — copy into Snowflake / Databricks / your editor for now.
          {hint ? <span className="mt-1 block text-[var(--signal)]">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
