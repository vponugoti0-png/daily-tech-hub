"use client";

import dynamic from "next/dynamic";

const TrackScene = dynamic(
  () => import("@/components/three/TrackScene").then((m) => m.TrackScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] text-xs text-zinc-500 sm:h-48">
        Loading 3D…
      </div>
    ),
  },
);

export function TrackSceneClient({ track }: { track: string }) {
  return <TrackScene track={track} />;
}
