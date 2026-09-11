---
slug: sf-governance-rbac
track: snowflake
title: "RBAC, roles & data governance"
description: "Role hierarchy, future grants, masking policies, and least privilege."
level: intermediate
order: 6
durationMinutes: 35
topics: [snowflake, general]
objectives:
  - "Design role hierarchies"
  - "Apply masking for PII"
  - "Use future grants for new objects"
updatedAt: "2026-09-11"
quiz:
  - question: "Analysts typically should…"
    options:
      - "Own ACCOUNTADMIN daily"
      - "Use read roles on curated schemas"
      - "Share passwords"
      - "Disable MFA"
    answer: 1
---

# RBAC, roles & data governance

Hierarchy: `SYSADMIN` / custom `TRANSFORMER` / `ANALYST`. Never day-to-day as `ACCOUNTADMIN`.

Masking policies on email/SSN columns; row access policies when needed.

## Exercises

1. Draft roles for loader, transformer, analyst.
2. Write a conceptual masking policy for `email`.
