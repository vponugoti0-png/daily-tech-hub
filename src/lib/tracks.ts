import type { TrackId, TrackMeta } from "./types";

export const TRACKS: TrackMeta[] = [
  {
    id: "python",
    title: "Python for Data Engineers",
    blurb:
      "ETL utilities, typing, testing, orchestration patterns, and PySpark-ready transforms.",
    accent: "from-yellow-400 to-amber-600",
    difficulty: "Beginner → Advanced",
    estimatedHours: 6,
  },
  {
    id: "sql",
    title: "SQL for Analytics Engineering",
    blurb:
      "Windows, incrementals, performance, modeling, and warehouse-ready patterns.",
    accent: "from-emerald-400 to-teal-600",
    difficulty: "Beginner → Advanced",
    estimatedHours: 5.5,
  },
  {
    id: "databricks",
    title: "Databricks (DBX)",
    blurb:
      "Lakehouse fundamentals, Delta Lake, Unity Catalog, jobs, and Spark SQL at scale.",
    accent: "from-orange-400 to-red-600",
    difficulty: "Intermediate → Advanced",
    estimatedHours: 6.5,
  },
  {
    id: "snowflake",
    title: "Snowflake",
    blurb:
      "Warehouses, Time Travel, Dynamic Tables, Streams & Tasks, governance, and cost control.",
    accent: "from-sky-400 to-blue-600",
    difficulty: "Beginner → Advanced",
    estimatedHours: 6,
  },
  {
    id: "git",
    title: "Git (bonus)",
    blurb: "Rebase, hygiene, and bisect workflows for analytics repos.",
    accent: "from-violet-400 to-purple-600",
    difficulty: "Intermediate",
    estimatedHours: 1.5,
  },
];

export const PRIMARY_TRACKS = TRACKS.filter((t) => t.id !== "git");

export function getTrackMeta(id: string): TrackMeta | undefined {
  return TRACKS.find((t) => t.id === id);
}

export const TRACK_IDS: TrackId[] = [
  "python",
  "sql",
  "databricks",
  "snowflake",
  "git",
];
