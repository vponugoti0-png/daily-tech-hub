---
slug: python-testing-spark-logic
track: python
title: Testing business logic before Spark
description: Extract pure Python rules so you can pytest them without a local SparkSession.
level: intermediate
order: 3
durationMinutes: 30
topics: [python, pyspark]
objectives:
  - Separate pure rules from DataFrame I/O
  - Use small fixture tables for regression tests
  - Know when a Spark integration test is worth it
updatedAt: "2026-09-06"
---

# Testing business logic before Spark

Spinning Spark for every rule slows CI. Pull pure logic into functions; keep Spark for integration smoke tests.

## Extract the rule

```python
def is_billable(event_type: str, amount: float) -> bool:
    if event_type in {"test", "ping"}:
        return False
    return amount > 0
```

Then express it in Spark:

```python
from pyspark.sql import functions as F

def with_billable(df):
    return df.withColumn(
        "billable",
        (~F.col("event_type").isin("test", "ping")) & (F.col("amount") > 0),
    )
```

## pytest the pure function

```python
def test_is_billable():
    assert is_billable("purchase", 10) is True
    assert is_billable("ping", 10) is False
```

## Exercises

### Exercise 1
Write pure `normalize_country(code: str) -> str` mapping `usa/US/United States` → `US`.

### Exercise 2
List two assertions you would still run in a SparkSession integration test (hint: nullability, join fanout).

## Cheat sheet

| Layer | Tool |
|-------|------|
| Pure rules | pytest |
| DataFrame plan | Spark local smoke (optional) |
| End-to-end | Dev warehouse / job cluster |
