---
slug: sql-performance-basics
track: sql
title: "SQL performance basics for warehouses"
description: "Predicate pushdown, clustering/partition pruning, and reading query profiles without fear."
level: intermediate
order: 3
durationMinutes: 35
topics: [sql, snowflake, databricks]
dialect: ANSI
objectives:
  - "Filter early and select only needed columns"
  - "Understand pruning vs full scans"
  - "Spot broadcast vs shuffle joins at a high level"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Selectivity"
    code: "WHERE event_date BETWEEN ... AND ..."
  - label: "Avoid SELECT *"
    code: "SELECT id, ts, amount FROM ..."
quiz:
  - question: "Applying a function to a filter column often…"
    options:
      - "Helps pruning"
      - "Prevents partition/cluster pruning"
      - "Deletes data"
      - "Creates indexes automatically"
    answer: 1
---

# SQL performance basics for warehouses

> **Dialect:** ANSI / warehouse-agnostic concepts (pruning behavior is similar on Snowflake clustering keys and Spark/Databricks partitions).

- Filter on partition/cluster keys **without wrapping** in functions when possible.
- Project fewer columns — wide rows hurt spill.
- Check query profile: spill, shuffle bytes, pruning %.

```sql
-- Dialect: ANSI (range-friendly predicate; prefer this over wrapping the column)
WHERE ts >= CURRENT_DATE
  AND ts <  CURRENT_DATE + INTERVAL '1' DAY
```

## Exercises

1. Rewrite `WHERE DATE(ts) = CURRENT_DATE` to a range-friendly predicate.
2. Explain why `SELECT *` into a BI tool hurts more than in a tiny ad-hoc query.
