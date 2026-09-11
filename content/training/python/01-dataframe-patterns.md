---
slug: python-dataframe-patterns
track: python
title: DataFrame patterns for ETL utilities
description: Idiomatic pandas/Polars-friendly patterns that also translate cleanly when you later push logic into PySpark.
level: intermediate
order: 1
durationMinutes: 25
topics: [python, pyspark]
objectives:
  - Prefer explicit schemas and column contracts
  - Write pure transform functions that are unit-testable
  - Handle late-arriving keys without silent drops
updatedAt: "2026-09-11"
---

# DataFrame patterns for ETL utilities

In data engineering, the most expensive bugs are silent: wrong joins, dropped nulls, and “helpful” type coercion. This lesson focuses on **pure transform functions** you can unit test before they ever touch Snowflake or Databricks.

## The contract-first habit

Define the columns you promise upstream and downstream:

```python
REQUIRED = ("event_id", "user_id", "ts", "payload")

def assert_columns(df, required=REQUIRED):
    missing = set(required) - set(df.columns)
    if missing:
        raise ValueError(f"missing columns: {sorted(missing)}")
    return df
```

## Pure transforms

Keep I/O at the edges. Business logic should look like:

```python
def with_event_date(df):
    out = df.copy()
    out["event_date"] = out["ts"].dt.floor("D")
    return out
```

Why it matters for PySpark later: the same function shape becomes a Spark `withColumn` plan instead of a notebook script.

## Late-arriving keys

Prefer left joins with explicit unmatched handling:

```python
def enrich_users(events, users):
    merged = events.merge(users, on="user_id", how="left", indicator=True)
    unmatched = (merged["_merge"] == "left_only").sum()
    if unmatched:
        # log metric; don't silently drop
        pass
    return merged.drop(columns=["_merge"])
```

## Exercises

### Exercise 1 — Schema guard
Write `assert_columns` for a Polars or pandas frame and raise a clear error listing missing fields.

**Hint:** Convert columns to a set and subtract.

**Solution:**
```python
def assert_columns(df, required):
    missing = set(required) - set(map(str, df.columns))
    if missing:
        raise ValueError(f"missing: {sorted(missing)}")
    return df
```

### Exercise 2 — Deduplicate latest
Given events with duplicate `event_id`, keep the row with the latest `ts`.

**Hint:** Sort then drop_duplicates, or groupby idxmax.

## Cheat sheet

| Pattern | Snippet |
|--------|---------|
| Explicit copy | `out = df.copy()` before mutation |
| Date floor | `ts.dt.floor("D")` |
| Anti-join check | `indicator=True` then filter `_merge` |
