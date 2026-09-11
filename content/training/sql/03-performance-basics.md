---
slug: sql-performance-basics
track: sql
title: SQL performance basics for warehouses
description: Clustering, pruning, and selective predicates—practical knobs on Snowflake and Databricks SQL.
level: beginner
order: 3
durationMinutes: 25
topics: [sql, snowflake, databricks]
objectives:
  - Write predicates that prune partitions/micro-partitions
  - Avoid SELECT * in heavy scans
  - Read a simple query profile mental model
updatedAt: "2026-09-05"
---

# SQL performance basics for warehouses

## Predicate pushdown & pruning

Filter on partition/cluster keys early:

```sql
SELECT user_id, COUNT(*)
FROM events
WHERE event_date BETWEEN '2026-09-01' AND '2026-09-07'
  AND event_type = 'purchase'
GROUP BY 1;
```

## Select only needed columns

Wide VARIANT/JSON columns are expensive to ship to the result set.

## Join order intuition

Filter each side before joining large facts to large facts; broadcast/replicate small dimensions when the engine supports it.

## Exercises

### Exercise 1
Rewrite a query that filters on `TO_DATE(ts)` to use a persisted `event_date` column—and explain why.

### Exercise 2
List three profile symptoms of a cartesian join.

## Cheat sheet

| Symptom | Likely cause |
|---------|--------------|
| Bytes scanned huge | Missing prune / SELECT * |
| Explosive rows | Bad join keys |
| Spillage | Warehouse undersized / skew |
