---
slug: python-testing-spark-logic
track: python
title: "Testing Spark-bound logic in pure Python"
description: "Extract business rules so you can unit test without a cluster, then pin Spark with tiny fixtures."
level: intermediate
order: 3
durationMinutes: 40
topics: [python, pyspark]
objectives:
  - "Separate pure rules from Spark I/O"
  - "Use pytest fixtures for small DataFrames"
  - "Assert on row sets, not printouts"
updatedAt: "2026-09-11"
quiz:
  - question: "Best first test for a watermark policy?"
    options:
      - "Full Databricks job on prod"
      - "Pure function over timestamps in pytest"
      - "Only integration tests"
      - "Manual notebook runs"
    answer: 1
---

# Testing Spark-bound logic in pure Python

Clusters are slow feedback. Extract rules you can test in milliseconds.

## Pattern

```python
def is_late(event_ts, watermark_ts) -> bool:
    return event_ts < watermark_ts

# Spark wrapper stays thin
def filter_late(df, watermark_col="watermark"):
    return df.filter(~F.col("event_ts") < F.col(watermark_col))  # prefer UDF-free expr
```

Prefer column expressions over Python UDFs for performance — test the **policy**, implement with Catalyst.

## pytest shape

```python
def test_is_late():
    assert is_late(1, 2) is True
    assert is_late(3, 2) is False
```

For Spark: use local session fixtures and assert `collect()` sets.

## Exercises

### Exercise 1
Implement and test `business_date(ts, tz)` that floors to local calendar day.

### Exercise 2
Given duplicates, write a test that expects exactly one survivor per `event_id`.
