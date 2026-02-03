#!/bin/bash
# Reddit Daily Games 2026 - Workspace Scaffolder
# Constraint: Devvit CLI must be installed globally.
echo "Initializing Antigravity Workspace..."
# 1. Create Directory Structure
mkdir -p .agent/{rules,skills,workflows,knowledge,memory}
mkdir -p packages/{shared,game-01-strategy,game-02-trivia,game-03-meme,game-04-duel}
mkdir -p scripts
# 2. Generate 'The Constitution' (Rules)
cat <<EOF >.agent/rules/devvit_constraints.md
description: Critical Devvit Platform Constraints
globs: ["**/*.ts", "**/*.tsx"]
rules:
- constraint: "Max Execution Time 30s"
  mandate: "Avoid unbounded loops. Use Scheduler for batch processing."
- constraint: "Max Redis 500MB"
  mandate: "Use bit-packing. Prefer ZSET/HSET. No verbose JSON."
- constraint: "No Client Fetch"
  mandate: "All external APIs must be proxied via Server."
EOF

# 3. Initialize Shared Package (The Kernel)
cd packages/shared
npm init -y
npm install @devvit/public-api @devvit/redis
# Create stub for RedisWrapper
mkdir src
touch src/RedisWrapper.ts
echo "export class RedisWrapper { /* Optimization Logic Here */ }" > src/RedisWrapper.ts
cd ../..
echo "Workspace Ready. Import this folder into Google Antigravity."
