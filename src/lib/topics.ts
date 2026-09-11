import type { Topic } from "./types";

export const TOPIC_LABELS: Record<Topic, string> = {
  snowflake: "Snowflake",
  databricks: "Databricks",
  python: "Python",
  pyspark: "PySpark",
  sql: "SQL",
  git: "Git",
  general: "General",
};

export const TOPIC_COLORS: Record<Topic, string> = {
  snowflake: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  databricks: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  python: "bg-yellow-500/15 text-yellow-200 ring-yellow-500/30",
  pyspark: "bg-red-500/15 text-red-300 ring-red-500/30",
  sql: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  git: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  general: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
};
