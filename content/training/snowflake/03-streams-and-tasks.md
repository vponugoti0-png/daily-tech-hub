---
slug: sf-streams-tasks
track: snowflake
title: "Streams & Tasks for incremental pipelines"
description: "Change data capture with Streams, scheduled Tasks, and DAG-like task trees."
level: intermediate
order: 3
durationMinutes: 40
topics: [snowflake, sql]
objectives:
  - "Create streams on tables"
  - "Process METADATA$ACTION correctly"
  - "Chain tasks with dependencies"
updatedAt: "2026-09-11"
quiz:
  - question: "A Snowflake Stream records…"
    options:
      - "Only warehouse credits"
      - "Row-level changes since last consumption offset"
      - "UI theme settings"
      - "Git commits"
    answer: 1
---

# Streams & Tasks for incremental pipelines

```sql
CREATE STREAM raw.orders_stream ON TABLE raw.orders;
CREATE TASK load_orders WAREHOUSE = etl_wh SCHEDULE = '5 MINUTE' AS
  MERGE INTO analytics.orders t USING raw.orders_stream s ...;
```

## Exercises

1. Handle DELETE actions from a stream in MERGE.
2. Design a task tree: land → clean → mart.
