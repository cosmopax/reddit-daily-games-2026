# Findings & Decisions

## Requirements
- Verify current project baseline and smoke health.
- Align stale status/docs with the latest authoritative handover.
- Document API key operations risk and rotation process.

## Research Findings
- Latest authoritative handover is `CODEX_HANDOVER_5.md` (dated 2026-02-09).
- `bash scripts/smoke_all_games.sh` currently passes for shared + all four games.
- Root README previously assumed `npm install` at repo root, but no root package manifest exists.
- Installation-scoped settings workaround remains active for API keys (`isSecret: false`).

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Treat `CODEX_HANDOVER_5.md` as status source of truth | Matches project agent guidance in AGENTS.md |
| Document per-package install/upload flow in root README | Prevent incorrect root install instructions |
| Add explicit API key risk + rotation runbook | Reduce ops/security ambiguity while workaround is required |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| none | - |

## Resources
- `CODEX_HANDOVER_5.md`
- `cooperation_documentation.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `api_integration_mission.md`
- `packages/game-01-strategy/*`
- `packages/game-02-trivia/*`
- `packages/game-03-meme/*`
- `packages/game-04-duel/*`
- `scripts/smoke_all_games.sh`

## Visual/Browser Findings
- None.

---
*Update this file after every 2 view/browser/search operations*
