---
slug: python-idempotent-writers
track: python
title: "Idempotent writers & retry-safe loads"
description: "Design loads that can safely re-run: partitioning, merge keys, and exactly-once *enough* semantics."
level: intermediate
order: 4
durationMinutes: 35
topics: [python, sql]
objectives:
  - "Choose natural merge keys for upserts"
  - "Make retries safe with partition overwrite or MERGE"
  - "Emit load metrics for observability"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Partition overwrite"
    code: "write(..., mode='overwrite', partitionBy=['dt'])"
  - label: "Merge key"
    code: "ON t.id = s.id AND t.dt = s.dt"
quiz:
  - question: "A job crashes after writing half a partition. Safest retry pattern?"
    options:
      - "Append again blindly"
      - "Overwrite that partition atomically / MERGE with keys"
      - "Delete the whole table"
      - "Ignore and continue"
    answer: 1
---

# Idempotent writers & retry-safe loads

Orchestrators retry. Your writer must tolerate that.

## Strategies

1. **Partition overwrite** for replaceable daily slices.
2. **MERGE/UPSERT** on business keys for mutable entities.
3. **Staging + swap** when you need all-or-nothing visibility.

```python
def write_daily(df, path, dt: str):
    (
      df.filter(f"event_date = '{dt}'")
        .write.mode("overwrite")
        .partitionBy("event_date")
        .parquet(f"{path}")
    )
```

## Metrics to emit

- rows_in / rows_out / rows_rejected
- max(event_ts), distinct keys
- duration + bytes written

## Exercises

### Exercise 1
Sketch MERGE SQL for a dim table on `customer_id` updating attributes and `updated_at`.

### Exercise 2
Explain when append-only + compaction beats overwrite.
