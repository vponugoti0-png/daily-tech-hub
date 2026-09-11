---
slug: git-bisect-and-blame
track: git
title: Bisect & blame for broken pipelines
description: Find the commit that broke a metric or model using bisect and blame.
level: intermediate
order: 3
durationMinutes: 25
topics: [git]
objectives:
  - Run git bisect with a test command
  - Use blame to understand a line's origin
  - Combine with dbt/pytest smoke tests
updatedAt: "2026-09-04"
---

# Bisect & blame for broken pipelines

## Bisect with a script

```bash
git bisect start
git bisect bad
git bisect good v1.2.0
git bisect run pytest tests/test_orders_grain.py
```

## Blame for context

```bash
git blame -L 40,80 models/marts/orders.sql
```

## Exercises

### Exercise 1
Describe a `git bisect run` command that fails when a SQL file no longer contains `unique_key='order_id'`.

### Exercise 2
When is blame misleading? (hint: reformats / bulk renames)

## Cheat sheet

| Tool | Use |
|------|-----|
| bisect | Find breaking commit |
| blame | Line provenance |
| log -S | Pickaxe search for deleted strings |
