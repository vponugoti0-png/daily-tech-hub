---
slug: dbx-structured-streaming
track: databricks
title: "Structured Streaming essentials"
description: "Checkpoints, triggers, watermarks, and exactly-once sinks with Delta."
level: advanced
order: 6
durationMinutes: 45
topics: [databricks, pyspark]
objectives:
  - "Configure checkpoints correctly"
  - "Apply watermarks for late data"
  - "Sink to Delta idempotently"
updatedAt: "2026-09-11"
quiz:
  - question: "Losing a streaming checkpoint directory typically means…"
    options:
      - "Nothing changes"
      - "You may reprocess or need careful recovery"
      - "Automatic schema merge"
      - "Free storage"
    answer: 1
---

# Structured Streaming essentials

```python
(
  spark.readStream.format("cloudFiles")...
    .load(path)
    .writeStream
    .format("delta")
    .option("checkpointLocation", ckpt)
    .trigger(availableNow=True)
    .toTable("silver.events")
)
```

## Exercises

1. Choose trigger mode for hourly micro-batches vs continuous.
2. Explain watermark vs checkpoint.
