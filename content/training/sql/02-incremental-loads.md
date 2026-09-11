---
slug: sql-incremental-loads
track: sql
title: "Incremental loads & watermarks"
description: "High-water marks, late data, and MERGE patterns for trustworthy daily pipelines."
level: intermediate
order: 2
durationMinutes: 40
topics: [sql, snowflake, databricks]
dialect: mixed
objectives:
  - "Track watermarks safely"
  - "Handle late-arriving facts"
  - "Write idempotent MERGE statements"
updatedAt: "2026-09-11"
quiz:
  - question: "A watermark should generally advance to…"
    options:
      - "MIN(ts) of the batch"
      - "A conservative MAX(ts) you can re-read from"
      - "Random UUID"
      - "NULL always"
    answer: 1
---

# Incremental loads & watermarks

> **Dialects in this lesson:** Spark SQL / Databricks (`UPDATE SET *`) and a Snowflake-style explicit column list. Do not mix syntax across engines.

```sql
-- Dialect: Spark SQL / Databricks
MERGE INTO mart.orders t
USING staging.orders_delta s
ON t.order_id = s.order_id
WHEN MATCHED AND s.updated_at > t.updated_at THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

```sql
-- Dialect: Snowflake
MERGE INTO mart.orders t
USING staging.orders_delta s
ON t.order_id = s.order_id
WHEN MATCHED AND s.updated_at > t.updated_at THEN UPDATE SET
  t.status = s.status,
  t.amount = s.amount,
  t.updated_at = s.updated_at
WHEN NOT MATCHED THEN INSERT (order_id, status, amount, updated_at)
  VALUES (s.order_id, s.status, s.amount, s.updated_at);
```

Store `pipeline_state(job, watermark_ts)`. On failure, do not advance.

## Exercises

1. Design a late-data window of 2 days overlapping the watermark.
2. Write SQL to detect duplicate natural keys in staging.
