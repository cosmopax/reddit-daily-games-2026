# Project agent instructions
## Codex: reddit_hackathon_games working agreements
- Treat the newest handover/status in the workspace brain as authoritative.
- After ANY meaningful change, append an entry to cooperation_documentation.md (append-only): Intent + Outcome + commands + tests + commit/worktree.
- Prefer Codex worktrees for parallel tasks; avoid editing on main checkout unless it’s trivial.
- Before deploy/publish steps: run the repo checks (lint/typecheck/tests if present).
- Publish unlisted unless public listing is explicitly required.

## Newly confirmed workflows/commands
- Fresh-workspace scaffolding (legacy bootstrap): `bash scripts/setup_workspace.sh` (creates `.agent` structure and initializes `packages/shared`).
- Per-game deploy flow: run from the target package directory, e.g. `cd packages/game-01-strategy && devvit whoami && devvit upload`.
- API key setup stays installation-scoped for now (CLI app-scope bug): e.g. `devvit settings set GEMINI_API_KEY "..."` and `devvit settings set HUGGINGFACE_TOKEN "..."`.
- TODO: Confirm current "install all dependencies" command for this repo root before documenting one; no root lockfile/package manifest is present.
