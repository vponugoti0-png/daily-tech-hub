---
slug: python-typing-for-pipelines
track: python
title: Typing & configs for pipeline code
description: Use dataclasses, TypedDict, and pydantic-ish patterns so job configs fail fast in CI.
level: beginner
order: 2
durationMinutes: 20
topics: [python]
objectives:
  - Model job config with frozen dataclasses
  - Type public function signatures
  - Fail fast on invalid environment values
updatedAt: "2026-09-08"
---

# Typing & configs for pipeline code

Untyped `dict` configs are how `warehouse=None` reaches production on Friday.

## Frozen config objects

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class SnowflakeJobConfig:
    account: str
    warehouse: str
    database: str
    schema: str
    role: str

    @classmethod
    def from_env(cls, env: dict[str, str]) -> "SnowflakeJobConfig":
        missing = [k for k in ("SF_ACCOUNT", "SF_WAREHOUSE", "SF_DATABASE", "SF_SCHEMA", "SF_ROLE") if not env.get(k)]
        if missing:
            raise OSError(f"missing env: {missing}")
        return cls(
            account=env["SF_ACCOUNT"],
            warehouse=env["SF_WAREHOUSE"],
            database=env["SF_DATABASE"],
            schema=env["SF_SCHEMA"],
            role=env["SF_ROLE"],
        )
```

## Annotate transforms

```python
from typing import Protocol

class Frame(Protocol):
    columns: list[str]

def select_contract(df: Frame, cols: list[str]) -> Frame:
    ...
```

## Exercises

### Exercise 1
Parse `BATCH_DATE=YYYY-MM-DD` from env into a `date` and reject other formats.

### Exercise 2
Make `SnowflakeJobConfig` reject empty strings even if the key exists.

## Cheat sheet

| Idea | Practice |
|------|----------|
| Immutability | `frozen=True` dataclasses |
| Fail fast | Validate in `from_env` |
| Boundaries | Types on public functions only if needed |
