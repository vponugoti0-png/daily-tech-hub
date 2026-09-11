---
slug: "pe-safety-privacy"
track: "prompt-engineering"
title: "Safety and privacy basics"
description: "Keep secrets, PII, and prod credentials out of prompts — free tools included."
level: "beginner"
order: 5
durationMinutes: 25
topics: [general]
objectives: [Recognize data that must not be pasted into AI, Use redaction and synthetic examples, Follow workplace AI policies]
updatedAt: "2026-09-11"
quiz:
  - question: "Safe to paste into a public AI chat?"
    options:
      - "Production connection strings"
      - "Customer emails from a support export"
      - "A made-up sample row with fake names"
      - "Your cloud private key"
    answer: 2
  - question: "Best practice when you need help with a messy table?"
    options:
      - "Upload the full prod dump"
      - "Share schema + 2–3 synthetic rows that match the shape"
      - "Paste passwords so AI can connect"
      - "Disable all logging forever"
    answer: 1
---

# Safety and privacy basics

Free does **not** mean “paste everything.”

## Never paste

- Passwords, tokens, private keys  
- Customer PII / regulated data without approval  
- Full prod extracts  

## Prefer

- Synthetic rows  
- Schema-only discussions  
- Redacted logs  
- Company-approved tools and policies

## Exercises

1. Redact a fake log line that contains an email and API key.
2. Write a one-sentence personal rule for what never goes into prompts.
