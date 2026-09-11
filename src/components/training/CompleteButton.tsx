"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getLessonProgress, markLessonComplete } from "@/lib/progress";

export function CompleteButton({ track, slug }: { track: string; slug: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(Boolean(getLessonProgress(track, slug)?.completed));
  }, [track, slug]);

  return (
    <button
      type="button"
      id="complete"
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        done
          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
          : "bg-white text-zinc-900 hover:bg-cyan-100"
      }`}
      onClick={() => {
        markLessonComplete(track, slug);
        setDone(true);
        window.dispatchEvent(new Event("dth-progress"));
      }}
    >
      <CheckCircle2 className="h-4 w-4" />
      {done ? "Completed" : "Mark complete"}
    </button>
  );
}
