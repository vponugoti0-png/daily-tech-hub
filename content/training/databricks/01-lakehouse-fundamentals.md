---
slug: dbx-lakehouse-fundamentals
track: databricks
title: "Lakehouse fundamentals on Databricks"
description: "Medallion layout, notebooks vs Jobs, and how the lakehouse differs from classic warehouses."
level: beginner
order: 1
durationMinutes: 30
topics: [databricks]
objectives:
  - "Explain bronze/silver/gold responsibilities"
  - "Choose Jobs over ad-hoc notebooks for prod"
  - "Locate Unity Catalog objects"
updatedAt: "2026-09-11"
quiz:
  - question: "Bronze layers typically store…"
    options:
      - "Only executive dashboards"
      - "Raw/lightly cleaned landed data"
      - "Only SCD2 dims"
      - "Secrets"
    answer: 1
---

# Lakehouse fundamentals on Databricks

**Bronze** → raw. **Silver** → cleansed, conformed. **Gold** → business marts.

Use **Databricks Jobs** + versioned code for production; notebooks for exploration.

## Exercises

1. Map 3 of your datasets into medallion layers.
2. List what belongs in Unity Catalog vs DBFS scratch paths.
