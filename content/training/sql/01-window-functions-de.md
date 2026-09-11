---
slug: sql-window-functions-de
track: sql
title: Window functions for data engineers
description: Deduplicate, sessionize, and compare periods using windows—portable across Snowflake and Spark SQL.
level: intermediate
order: 1
durationMinutes: 30
topics: [sql, snowflake, databricks]
objectives:
  - Deduplicate with ROW_NUMBER correctly
  - Use LAG/LEAD for period-over-period
  - Apply QUALIFY (Snowflake) or subqueries (Spark SQL)
updatedAt: "2026-09-11"
---

# Window functions for data engineers

Windows let you compute across related rows without collapsing the grain prematurely.

## Deduplicate to latest record

```sql
SELECT *
FROM raw.customers
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY customer_id
  ORDER BY updated_at DESC
) = 1;
```

Spark SQL equivalent: wrap in a subquery filtering `rn = 1`.

## Period-over-period

```sql
SELECT
  account_id,
  month,
  revenue,
  LAG(revenue) OVER (PARTITION BY account_id ORDER BY month) AS prev_revenue
FROM mart.account_month;
```

## Running quality metrics

```sql
SELECT
  dt,
  error_rate,
  AVG(error_rate) OVER (
    ORDER BY dt
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS error_rate_7d
FROM mart.pipeline_daily;
```

## Exercises

### Exercise 1
Write SQL to keep the earliest event per `session_id` (min `ts`).

### Exercise 2
Compute a 7-day rolling sum of `orders` partitioned by `region`.

## Cheat sheet

| Need | Function |
|------|----------|
| Latest row | `ROW_NUMBER` + filter 1 |
| Previous value | `LAG` |
| Next value | `LEAD` |
| Buckets | `NTILE` |
