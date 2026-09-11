---
slug: dbx-delta-lake-basics
track: databricks
title: "Delta Lake basics"
description: "ACID tables on object storage: MERGE, Time Travel, OPTIMIZE, and vacuum awareness."
level: intermediate
order: 2
durationMinutes: 40
topics: [databricks, sql]
objectives:
  - "Create and MERGE into Delta tables"
  - "Use Time Travel for debugging"
  - "Understand OPTIMIZE/ZORDER tradeoffs"
updatedAt: "2026-09-11"
cheatSheet:
  - label: "Merge"
    code: "MERGE INTO target t USING src s ON t.id = s.id WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *"
  - label: "Time travel"
    code: "SELECT * FROM t TIMESTAMP AS OF '2026-09-01'"
quiz:
  - question: "Delta Time Travel helps you…"
    options:
      - "Delete Unity Catalog"
      - "Read prior table versions for audit/rollback"
      - "Skip ACID"
      - "Avoid partitioning forever"
    answer: 1
---

# Delta Lake basics

```sql
CREATE TABLE sand.events USING DELTA AS SELECT * FROM landing.events;

MERGE INTO sand.events t
USING updates u ON t.event_id = u.event_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

`OPTIMIZE` + `ZORDER` for read locality; `VACUUM` carefully with retention.

## Exercises

1. Write a MERGE for CDC with deletes.
2. Query a table as of yesterday and diff counts.
