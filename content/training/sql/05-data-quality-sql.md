---
slug: sql-data-quality
track: sql
title: "Data quality checks in SQL"
description: "Assertions for nulls, uniqueness, referential integrity, and freshness SLAs."
level: beginner
order: 5
durationMinutes: 30
topics: [sql, general]
dialect: mixed
objectives:
  - "Encode DQ tests as SQL"
  - "Fail pipelines on critical assertions"
  - "Track freshness"
updatedAt: "2026-09-11"
quiz:
  - question: "A uniqueness check on order_id should return…"
    options:
      - "Rows that violate uniqueness"
      - "The warehouse size"
      - "Random samples only"
      - "Nothing ever"
    answer: 0
---

# Data quality checks in SQL

> **Dialects in this lesson:** duplicate check is ANSI; freshness uses Snowflake `DATEADD` and a Spark SQL equivalent.

```sql
-- Dialect: ANSI
-- duplicates
SELECT order_id, COUNT(*) AS c
FROM fct_orders
GROUP BY 1
HAVING COUNT(*) > 1;
```

```sql
-- Dialect: Snowflake
-- freshness (stale if max updated_at older than 6 hours)
SELECT MAX(updated_at) < DATEADD(hour, -6, CURRENT_TIMESTAMP()) AS stale
FROM fct_orders;
```

```sql
-- Dialect: Spark SQL
SELECT MAX(updated_at) < CURRENT_TIMESTAMP() - INTERVAL 6 HOURS AS stale
FROM fct_orders;
```

## Exercises

1. Write a null check for required columns.
2. Write an orphan check: facts whose dim keys are missing.
