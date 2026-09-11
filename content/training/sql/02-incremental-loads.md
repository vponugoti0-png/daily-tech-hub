---
slug: sql-incremental-loads
track: sql
title: Incremental load patterns
description: Merge, append, and microbatch strategies for Snowflake and lakehouse tables.
level: intermediate
order: 2
durationMinutes: 35
topics: [sql, snowflake, databricks]
objectives:
  - Choose merge vs append vs rebuild
  - Define watermarks for late data
  - Avoid unique-key traps
updatedAt: "2026-09-09"
---

# Incremental load patterns

Full rebuilds are honest; incrementals are fast—and fragile.

## Merge (SCD1 style)

```sql
MERGE INTO mart.customers t
USING stage.customers_delta s
ON t.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET
  t.email = s.email,
  t.updated_at = s.updated_at
WHEN NOT MATCHED THEN INSERT *;
```

## Append with watermark

Track `MAX(event_ts)` successfully loaded; next run reads `event_ts > watermark - skew`.

Late data needs a reprocessing window (e.g., 2 days) or a separate repair job.

## When to rebuild

Small dimensions, broken keys, or changing grain → truncate+load is cheaper than debugging bad merges.

## Exercises

### Exercise 1
Given late-arriving facts up to 48h, design a watermark policy.

### Exercise 2
Explain why merging on `email` instead of `customer_id` is dangerous.

## Cheat sheet

| Pattern | Use when |
|---------|----------|
| Append | Immutable events |
| Merge | Mutable entities |
| Rebuild | Small / unstable grain |
