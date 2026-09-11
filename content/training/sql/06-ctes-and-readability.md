---
slug: sql-ctes-readability
track: sql
title: "CTEs, readability, and modular SQL"
description: "Structure complex pipelines with CTEs, naming, and staged logic reviewers can follow."
level: beginner
order: 6
durationMinutes: 25
topics: [sql]
dialect: ANSI
objectives:
  - "Name CTEs by business meaning"
  - "Avoid nested spaghetti subqueries"
  - "Document assumptions inline"
updatedAt: "2026-09-11"
quiz:
  - question: "Good CTE names look like…"
    options:
      - "a1, a2, a3"
      - "eligible_orders, enriched_orders"
      - "temp, temp2"
      - "x"
    answer: 1
---

# CTEs, readability, and modular SQL

> **Dialect:** ANSI SQL.

```sql
-- Dialect: ANSI
WITH eligible_orders AS (
  SELECT * FROM orders WHERE status = 'paid'
),
enriched AS (
  SELECT o.*, c.region
  FROM eligible_orders o
  JOIN dim_customer c ON c.customer_id = o.customer_id AND c.is_current
)
SELECT region, SUM(amount) FROM enriched GROUP BY 1;
```

## Exercise

Refactor a 3-level nested subquery into named CTEs.
