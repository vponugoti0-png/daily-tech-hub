---
slug: sf-performance-cost
track: snowflake
title: "Performance & cost control"
description: "Clustering, search optimization, warehouse sizing, and query profile literacy."
level: advanced
order: 5
durationMinutes: 45
topics: [snowflake, sql]
objectives:
  - "Read query profiles for pruning and spilling"
  - "Apply clustering thoughtfully"
  - "Control auto-suspend and multi-cluster"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Auto suspend"
    code: "ALTER WAREHOUSE etl SET AUTO_SUSPEND = 60;"
  - label: "Clustering"
    code: "ALTER TABLE t CLUSTER BY (event_date, account_id);"
quiz:
  - question: "Leaving a large warehouse running idle primarily wastes…"
    options:
      - "Credits"
      - "Time Travel history only"
      - "UI themes"
      - "Stages"
    answer: 0
---

# Performance & cost control

- Right-size warehouses; enable auto-suspend.
- Cluster large filtered tables on common predicates.
- Avoid SELECT * in scheduled jobs.
- Spillage in profiles → increase warehouse or reduce data width.

## Exercises

1. Propose clustering keys for a 5B-row event table queried by day+account.
2. List 3 cost guardrails for a shared account.
