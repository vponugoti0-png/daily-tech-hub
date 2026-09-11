---
slug: sql-semi-structured
track: sql
title: "Semi-structured data in SQL"
description: "JSON/VARIANT/STRUCT access patterns across Snowflake and Spark SQL."
level: advanced
order: 7
durationMinutes: 35
topics: [sql, snowflake, databricks]
objectives:
  - "Extract nested fields safely"
  - "Flatten arrays with care"
  - "Know schema-on-read tradeoffs"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Snowflake path"
    code: "payload:user.id::string"
  - label: "Spark get"
    code: "payload.user.id"
quiz:
  - question: "Flattening arrays before aggregating often…"
    options:
      - "Can multiply rows — watch grain"
      - "Never changes row counts"
      - "Deletes duplicates"
      - "Creates primary keys"
    answer: 0
---

# Semi-structured data in SQL

Prefer projecting needed fields into typed columns for marts. Keep raw VARIANT in landing.

## Exercises

1. Extract `user.id` and `items` array length from a JSON payload.
2. Explain why repeated flatten+join can fan out revenue.
