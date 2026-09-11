---
slug: dbx-jobs-workflows
track: databricks
title: "Jobs, workflows, and deployment"
description: "Task graphs, clusters vs serverless, retries, and CI-deployed job definitions."
level: intermediate
order: 5
durationMinutes: 35
topics: [databricks]
objectives:
  - "Model multi-task jobs"
  - "Configure retries and timeouts"
  - "Promote jobs via code, not clicks alone"
updatedAt: "2026-09-11"
quiz:
  - question: "Production pipelines should primarily run as…"
    options:
      - "Manual notebook clicks"
      - "Scheduled Jobs/Workflows with versioned code"
      - "Untracked scratch clusters only"
      - "Local laptops only"
    answer: 1
---

# Jobs, workflows, and deployment

Multi-task jobs: ingest → transform → DQ → publish. Fail fast on DQ.

Use job clusters or serverless SQL/warehouses appropriately; pin library versions.

## Exercises

1. Design a 4-task DAG with a DQ gate before gold publish.
2. List parameters you'd pass for a backfill.
