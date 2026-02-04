---
name: devvit-smoke
description: Run a fast sanity check for Devvit Web projects in this repo: install deps, run available checks/tests, and report exact commands + results.
---

Instructions:
- Detect package manager (npm/pnpm/yarn) from lockfiles.
- Run the lightest available checks in order: lint/typecheck/tests (only if scripts exist).
- Do NOT publish or deploy.
- Append a short Outcome entry to cooperation_documentation.md with commands and pass/fail.
