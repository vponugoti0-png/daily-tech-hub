---
slug: python-packaging-de-libs
track: python
title: "Packaging shared DE libraries"
description: "Versioned internal packages, wheels for Jobs, and avoiding notebook copy-paste drift."
level: advanced
order: 8
durationMinutes: 30
topics: [python, databricks]
objectives:
  - "Structure a sharable transforms package"
  - "Pin versions in job environments"
  - "Document public APIs"
updatedAt: "2026-09-11"
quiz:
  - question: "Copy-pasting transforms across notebooks mainly causes…"
    options:
      - "Faster CI"
      - "Drift and inconsistent bugfixes"
      - "Better security"
      - "Automatic schema evolution"
    answer: 1
---

# Packaging shared DE libraries

```
src/
  company_de/
    __init__.py
    contracts.py
    transforms/
pyproject.toml
```

Publish internal wheels; install in Databricks Job clusters / containers. Semver breaking changes carefully.

## Capstone exercise

Extract two transforms from earlier lessons into a tiny package with tests and a README section.
