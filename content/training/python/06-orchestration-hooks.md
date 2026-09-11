---
slug: python-orchestration-hooks
track: python
title: "Orchestration hooks & job entrypoints"
description: "CLI entrypoints, exit codes, and heartbeat patterns that play well with Airflow, Dagster, or Databricks Jobs."
level: intermediate
order: 6
durationMinutes: 30
topics: [python, general]
objectives:
  - "Build a clean `python -m` entrypoint"
  - "Use exit codes and structured logs"
  - "Support backfill date ranges"
updatedAt: "2026-09-11"
quiz:
  - question: "Why accept `--start` and `--end` on a batch job?"
    options:
      - "Only for aesthetics"
      - "To enable backfills and reprocessing windows"
      - "To disable logging"
      - "To skip schema checks"
    answer: 1
---

# Orchestration hooks & job entrypoints

```python
import argparse, sys

def main(argv=None):
    p = argparse.ArgumentParser()
    p.add_argument("--start", required=True)
    p.add_argument("--end", required=True)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv)
    run(args.start, args.end, dry_run=args.dry_run)
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

Log JSON lines with `job`, `dt`, `status`, `rows` so dashboards parse them.

## Exercises

### Exercise 1
Add a `--partition` flag and validate YYYY-MM-DD format.
