# Next Codex Handover - Reddit Daily Games 2026

Date: 2026-02-04
Scope: Full operational handover for deployment/playtest state after API integration stabilization.

## 1. Executive Snapshot

- Repository path: `/Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games`
- Current branch for this handover: `codex/handover-ops-20260204`
- All four apps were uploaded and installed successfully to target dev subreddits on 2026-02-04.
- Installation settings (API keys) were configured via install UI (CLI app-scope settings remain blocked by Reddit backend `ValidateAppForm Unimplemented`).
- `SettingScope` runtime crash in playtest was fixed by removing runtime enum usage in all game `main.tsx` files while keeping installation settings definitions.

## 2. Code/Runtime Changes Already in Place

### Shared API integration hardening

- File: `packages/shared/src/ServiceProxy.ts`
- Implemented:
- Timeout wrapper for external fetches.
- Better secret resolution and compatibility key lookup.
- Trends parsing improvements and fallback normalization.
- Compatibility helper `fetchDailyTrend()` for older call sites.
- Gemini response JSON parsing hardening with safe damage bounds.
- Hugging Face binary response handling to return a real `data:` URI.

### Integration and wiring fixes

- File: `packages/shared/verify_local.ts`
- Updated to use `fetchDailyTrends(2)`.

- File: `packages/game-02-trivia/src/ingestor.ts`
- Added `ServiceProxy` import.
- Updated ingestion to persist `daily_trend_a`, `daily_trend_b`, and trend archive payloads.

### Devvit HTTP allow-list declarations

- File: `packages/game-01-strategy/src/main.tsx`
- Domain: `generativelanguage.googleapis.com`

- File: `packages/game-02-trivia/src/main.tsx`
- Domains: `serpapi.com`, `generativelanguage.googleapis.com`

- File: `packages/game-03-meme/src/main.tsx`
- Domains: `api.replicate.com`, `router.huggingface.co`

- File: `packages/game-04-duel/src/main.tsx`
- Domains: `generativelanguage.googleapis.com`, `api.replicate.com`, `router.huggingface.co`

### Playtest crash fix

- Files:
- `packages/game-01-strategy/src/main.tsx`
- `packages/game-02-trivia/src/main.tsx`
- `packages/game-03-meme/src/main.tsx`
- `packages/game-04-duel/src/main.tsx`

Removed runtime `SettingScope` enum references (`ReferenceError: SettingScope is not defined`) and kept settings fields with default install scope.

## 3. Deployment State (Confirmed by terminal transcript)

| Game | Package | App Slug | Target Subreddit | Installed Version |
|---|---|---|---|---|
| Game 1 Strategy | `packages/game-01-strategy` | `get-rich-lazy` | `r/get_rich_lazy_dev` | `0.0.8` |
| Game 2 Trivia | `packages/game-02-trivia` | `hyper-hive-minds` | `r/hyper_hive_minds_dev` | `0.0.6` |
| Game 3 Meme | `packages/game-03-meme` | `meme-wars` | `r/meme_wars_dev` | `0.0.7` |
| Game 4 Duel | `packages/game-04-duel` | `outsmarted-again` | `r/outsmarted_again_dev` | `0.0.7` |

Note: repeated warning about auto-created default playtest subreddit already having an install is non-blocking.

## 4. Operational Pitfalls Found

- `devvit logs` without explicit app name uses the app from the current package directory.
- Running logs from `packages/game-04-duel` while querying other subreddits produced:
- `No installation found for outsmarted-again at <other_subreddit>`

Correct approach:
- Run logs from each matching package directory, or pass explicit app name.

## 5. Copy-Paste Operational Commands

### Game 1

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-01-strategy
npx devvit playtest get_rich_lazy_dev
npx devvit logs get_rich_lazy_dev --since 15m --verbose
```

### Game 2

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-02-trivia
npx devvit playtest hyper_hive_minds_dev
npx devvit logs hyper_hive_minds_dev --since 15m --verbose
```

### Game 3

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-03-meme
npx devvit playtest meme_wars_dev
npx devvit logs meme_wars_dev --since 15m --verbose
```

### Game 4

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-04-duel
npx devvit playtest outsmarted_again_dev
npx devvit logs outsmarted_again_dev --since 15m --verbose
```

## 6. Verification Criteria

- Game 1 Strategy:
- No API key errors in logs (`Missing GEMINI_API_KEY`, auth errors, forbidden errors).

- Game 2 Trivia:
- Trend pair should not be fallback-only all the time (`Minecraft`, `Fortnite`, `Retro Gaming`, `AI Coding`).
- No repeated trend fetch exceptions.

- Game 3 Meme:
- Generated image must render as a real result, not only unavailable placeholder URL.
- No persistent HF/Replicate auth or quota errors on each request.

- Game 4 Duel:
- AI responses should not be consistently `Static Noise`.
- Occasional Gemini quota errors may occur; if every move is `429`, key/project quota needs adjustment.

## 7. Known External Blockers

- App-scope settings via CLI are currently blocked by Reddit backend:
- `/devvit.actor.settings.v1alpha.AppSettings/ValidateAppForm ... Unimplemented`

Current mitigation:
- Use installation settings UI per subreddit/app installation.

## 8. Immediate Next Actions for Next Codex Instance

1. Validate all four apps using the command block in Section 5 and capture evidence in docs.
2. If Gemini stays at `429` in Duel, switch to quota-enabled key/project and re-check.
3. If meme generation degrades, inspect HF token scope and Replicate billing.
4. Prepare final submission assets/checklist once runtime stability is confirmed.

## 9. Security Note

A Hugging Face token was previously pasted in chat context. It should be rotated/revoked after testing.
