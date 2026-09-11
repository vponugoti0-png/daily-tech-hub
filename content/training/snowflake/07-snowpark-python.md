---
slug: sf-snowpark-python
track: snowflake
title: "Snowpark Python for DE"
description: "DataFrame API pushdown, stored procedures, and when to use Snowpark vs pure SQL."
level: advanced
order: 7
durationMinutes: 40
topics: [snowflake, python]
objectives:
  - "Write Snowpark DataFrame transforms"
  - "Understand pushdown vs local collect pitfalls"
  - "Package logic as procedures/jobs"
updatedAt: "2026-09-11"
quiz:
  - question: "Calling `.collect()` on a huge Snowpark frame…"
    options:
      - "Keeps all compute in Snowflake optimally"
      - "Pulls rows to the client — can OOM"
      - "Creates a Dynamic Table"
      - "Grants ACCOUNTADMIN"
    answer: 1
---

# Snowpark Python for DE

```python
from snowflake.snowpark import Session
df = session.table("ANALYTICS.ORDERS")
out = df.filter(df["STATUS"] == "paid").group_by("REGION").agg(df["AMOUNT"].sum())
out.write.save_as_table("MARTS.REVENUE", mode="overwrite")
```

Prefer lazy DataFrame ops; avoid collecting large sets.

## Capstone

Port one pandas transform from the Python track into Snowpark or SQL with tests on a sample.
