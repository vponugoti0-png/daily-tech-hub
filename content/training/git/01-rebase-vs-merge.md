---
slug: git-rebase-vs-merge
track: git
title: Rebase vs merge for analytics repos
description: Choose history strategies that keep dbt/SQL/Python PRs reviewable.
level: beginner
order: 1
durationMinutes: 20
topics: [git]
objectives:
  - Know when to rebase personal branches
  - Avoid rebasing shared history
  - Resolve conflicts with intent
updatedAt: "2026-09-11"
---

# Rebase vs merge for analytics repos

## Default recommendation

- **Personal feature branches:** rebase onto `main` before PR for a linear review.
- **Shared long-lived branches:** merge to avoid rewriting others' commits.

```bash
git fetch origin
git rebase origin/main
```

## Conflict mindset

Conflicts in SQL models often mean grain or column contracts changed—don't blindly accept either side; re-read the model contract.

## Exercises

### Exercise 1
Explain why `git pull --rebase` on a shared release branch can hurt teammates.

### Exercise 2
Practice: create a conflict intentionally in a scratch repo and resolve it.

## Cheat sheet

| Action | Command |
|--------|---------|
| Update branch | `git rebase origin/main` |
| Abort | `git rebase --abort` |
| Continue | `git rebase --continue` |
