---
slug: "ai-de-generate-code-safely"
track: "ai-data-eng"
title: "Generate SQL & Python safely"
description: "Prompt for dialect-aware code and review it like a PR."
level: "beginner"
order: 3
durationMinutes: 8
topics: [sql, python]
objectives: [Specify dialect, warehouse, and interfaces, Require comments on assumptions, Review AI code with tests and dry-runs]
updatedAt: "2026-09-11"
quiz:
  - question: "When asking for MERGE SQL you should specify…"
    options:
      - "Nothing — AI always guesses right"
      - "Engine/dialect and whether SET * is allowed"
      - "Only the table emoji"
      - "That secrets should be hard-coded"
    answer: 1
  - question: "Good review habit for AI code?"
    options:
      - "Merge unread"
      - "Run a dry-run / unit test and read every line that touches data"
      - "Only check formatting"
      - "Disable CI"
    answer: 1
---

# Generate SQL & Python safely

## Prompt musts

- Dialect (Snowflake / Spark / Postgres)  
- Inputs/outputs  
- Idempotency needs  
- “List assumptions”

## Review like a PR

Read writes, filters, and join keys. Prefer tiny tests.

## Exercises

1. Ask for a Snowflake MERGE with explicit columns for a customer dim.
2. Ask the model to list assumptions — then challenge one.
