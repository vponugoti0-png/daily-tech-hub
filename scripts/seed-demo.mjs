#!/usr/bin/env node
/** Ensures demo users exist by importing via a tiny CJS bridge is hard for TS —
 *  Demo users are auto-seeded on first getDb() call from the Next server.
 *  This script just prints credentials for README/testing.
 */
console.log(`
Demo users (auto-seeded into data/dth.sqlite on first API hit):

  demo@dailytechhub.dev  /  demo1234
  alex@example.com       /  learnfree

Both accounts are 100% free — no premium tiers.
`);
