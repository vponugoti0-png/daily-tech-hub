"use client";

import { useEffect, useState } from "react";
import { trackCompletion } from "@/lib/progress";

export function TrackProgressBar({ track, slugs }: { track: string; slugs: string[] }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const t = trackCompletion(track, slugs);
      setPct(t.pct);
      setDone(t.done);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("dth-progress", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dth-progress", refresh);
    };
  }, [track, slugs]);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex justify-between text-xs text-zinc-400">
        <span>Progress</span>
        <span>
          {done}/{slugs.length} · {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
