---
slug: python-config-and-secrets
track: python
title: "Config, secrets, and environment boundaries"
description: "12-factor style config for DE jobs: typed settings, secret backends, and no credentials in notebooks."
level: beginner
order: 5
durationMinutes: 25
topics: [python, general]
objectives:
  - "Load typed config from env"
  - "Never commit secrets"
  - "Separate prod/staging endpoints cleanly"
updatedAt: "2026-09-11"
quiz:
  - question: "Where should warehouse passwords live?"
    options:
      - "In the repo README"
      - "Hardcoded in notebooks"
      - "Secret manager / CI secrets injected at runtime"
      - "Git commit messages"
    answer: 2
---

# Config, secrets, and environment boundaries

## Typed settings

```python
import os
from pydantic import BaseModel

class Settings(BaseModel):
    warehouse: str
    database: str
    dry_run: bool = False

settings = Settings(
    warehouse=os.environ["WH"],
    database=os.environ["DB"],
    dry_run=os.environ.get("DRY_RUN", "0") == "1",
)
```

## Rules

- Secrets via env / secret manager only
- `DRY_RUN` flags for safe rehearsals
- Fail startup if required config missing

## Exercises

### Exercise 1
List 5 config values that differ between staging and prod for a Snowflake loader.
