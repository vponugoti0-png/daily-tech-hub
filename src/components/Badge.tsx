import { TOPIC_COLORS, TOPIC_LABELS } from "@/lib/topics";
import type { Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TopicBadge({ topic }: { topic: Topic }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        TOPIC_COLORS[topic] ?? TOPIC_COLORS.general,
      )}
    >
      {TOPIC_LABELS[topic] ?? topic}
    </span>
  );
}

export function SoftBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-300 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      {children}
    </span>
  );
}
