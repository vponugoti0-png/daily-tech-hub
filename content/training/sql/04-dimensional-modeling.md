---
slug: sql-dimensional-modeling
track: sql
title: "Dimensional modeling essentials"
description: "Facts, dims, grain, SCD2, and star schemas that analytics teams can trust."
level: intermediate
order: 4
durationMinutes: 45
topics: [sql]
dialect: ANSI
objectives:
  - "Declare grain before writing SQL"
  - "Model SCD2 dimensions"
  - "Avoid fan-out when joining multiple facts"
updatedAt: "2026-09-11"
quiz:
  - question: "Grain answers which question?"
    options:
      - "What is one row?"
      - "What is the cluster size?"
      - "What is the BI tool?"
      - "What is the password?"
    answer: 0
---

# Dimensional modeling essentials

> **Dialect:** ANSI SQL (modeling patterns; engine-specific DDL omitted).

**Grain first.** Example: one row per `order_id` in `fct_orders`.

## SCD2 sketch

```sql
-- Dialect: ANSI (conceptual SCD2 columns)
-- valid_from, valid_to, is_current on dim_customer
SELECT *
FROM dim_customer
WHERE customer_id = :id
  AND valid_from <= :as_of
  AND (valid_to IS NULL OR valid_to > :as_of);
```

## Exercises

1. Define grain for a clickstream fact at session vs event level tradeoffs.
2. Write a query to fetch the customer dim version active at order time.
