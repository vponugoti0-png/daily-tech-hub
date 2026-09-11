---
slug: dbx-unity-catalog
track: databricks
title: "Unity Catalog & governance"
description: "Catalogs, schemas, grants, volume storage, and lineage-minded design."
level: intermediate
order: 4
durationMinutes: 35
topics: [databricks, general]
objectives:
  - "Navigate three-level namespace"
  - "Grant least-privilege access"
  - "Separate envs with catalogs"
updatedAt: "2026-09-11"
quiz:
  - question: "Unity Catalog three-level namespace is…"
    options:
      - "catalog.schema.table"
      - "cluster.notebook.cell"
      - "bucket.folder.file only"
      - "user.password.host"
    answer: 0
---

# Unity Catalog & governance

`main.silver.orders` — catalog.schema.table.

Use grants on catalogs/schemas for teams; avoid wide `ALL PRIVILEGES` in prod.

## Exercises

1. Draft grants for analysts (read gold) vs engineers (write silver).
2. Explain volumes vs tables for ML artifacts.
