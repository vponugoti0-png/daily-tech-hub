---
slug: sql-data-quality
track: sql
title: "Data quality checks in SQL"
description: "Assertions for nulls, uniqueness, referential integrity, and freshness SLAs."
level: beginner
order: 5
durationMinutes: 30
topics: [sql, general]
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

```sql
-- duplicates
SELECT order_id, COUNT(*) c FROM fct_orders GROUP BY 1 HAVING COUNT(*) > 1;

-- freshness
SELECT MAX(updated_at) < DATEADD(hour, -6, CURRENT_TIMESTAMP) AS stale FROM fct_orders;
```

## Exercises

1. Write a null check for required columns.
2. Write an orphan check: facts whose dim keys are missing.
