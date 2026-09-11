---
slug: git-commit-hygiene
track: git
title: Commit hygiene for data PRs
description: Atomic commits, fixups, and messages that make warehouse changes auditable.
level: beginner
order: 2
durationMinutes: 15
topics: [git]
objectives:
  - Write actionable commit messages
  - Use fixup/autosquash before review
  - Keep secrets out of history
updatedAt: "2026-09-07"
---

# Commit hygiene for data PRs

## Message style

```
feat(marts): add late-arriving order repair model

Rebuilds last 2 days of facts so BI matches finance.
```

## Fixup workflow

```bash
git commit --fixup=<sha>
git rebase -i --autosquash origin/main
```

## Secrets

Never commit `.env`, private keys, or Snowflake key pairs. Use `git rm --cached` immediately if you slip—and rotate credentials.

## Exercises

### Exercise 1
Rewrite `update stuff` into a proper message for a dbt incremental change.

### Exercise 2
List files you would add to `.gitignore` for a Databricks+Python repo.

## Cheat sheet

| Goal | Command |
|------|---------|
| Amend message | `git commit --amend` |
| Soft undo | `git reset --soft HEAD~1` |
| Untrack secret | `git rm --cached <file>` |
