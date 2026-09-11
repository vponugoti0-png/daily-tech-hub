---
slug: sql-window-functions-de
track: sql
title: "Window functions for data engineers"
description: "RANK, LAG/LEAD, running totals, and sessionization patterns used in warehouses daily."
level: beginner
order: 1
durationMinutes: 35
topics: [sql]
objectives:
  - "Use PARTITION BY / ORDER BY correctly"
  - "Build SCD-friendly change detection with LAG"
  - "Avoid explosive joins when windows suffice"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Latest per key"
    code: "ROW_NUMBER() OVER (PARTITION BY id ORDER BY ts DESC)"
  - label: "Prev value"
    code: "LAG(status) OVER (PARTITION BY id ORDER BY ts)"
quiz:
  - question: "ROW_NUMBER vs RANK when ties share the same ORDER BY value?"
    options:
      - "They always match"
      - "ROW_NUMBER unique; RANK can repeat with gaps"
      - "RANK is always unique"
      - "ROW_NUMBER skips numbers"
    answer: 1
---

# Window functions for data engineers

```sql
SELECT *
FROM (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY ts DESC) AS rn
  FROM events
) e
WHERE rn = 1;
```

## Change detection

```sql
LAG(status) OVER (PARTITION BY account_id ORDER BY updated_at) AS prev_status
```

## Exercises

1. Sessionize events with 30-minute gaps using LAG + cumulative sum.
2. Compute a 7-day running count of orders per customer.
