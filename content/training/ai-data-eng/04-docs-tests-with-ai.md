---
slug: "ai-de-docs-and-tests"
track: "ai-data-eng"
title: "Docs and tests with AI"
description: "Turn working code into README notes and starter tests."
level: "beginner"
order: 4
durationMinutes: 25
topics: [python, git]
objectives: [Generate docs from real code you paste (sanitized), Ask for edge-case tests, Keep docs short and accurate]
updatedAt: "2026-09-11"
quiz:
  - question: "Best input for doc generation?"
    options:
      - "No code, only “document my platform”"
      - "A sanitized function plus intended behavior"
      - "The entire prod database"
      - "Only screenshots of Slack"
    answer: 1
  - question: "AI-written tests should…"
    options:
      - "Be merged without running"
      - "Be read and executed; add the edge cases that matter"
      - "Never assert anything"
      - "Only test happy paths forever"
    answer: 1
---

# Docs and tests with AI

## Docs prompt

Paste a sanitized function → ask for purpose, inputs, outputs, failure modes (½ page max).

## Tests prompt

“Generate 3 pytest cases including one failure mode for null keys.”

## Exercises

1. Document a 10-line transform with AI, then delete anything untrue.
2. Add one test AI missed (nulls or duplicates).
