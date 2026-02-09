# Devvit Reviewer Response Templates

Use this file as a fast copy/paste pack for Devvit review follow-ups.

## Quick Index
| Reviewer topic | Use section | Notes |
|---|---|---|
| API key security and secret handling | [1) API Key Security & Storage](#1-api-key-security--storage) | Covers installation-scope workaround and `context.settings` retrieval. |
| External API failures, timeouts, rate limits | [2) External Request Safety & Reliability](#2-external-request-safety--reliability) | Covers `ServiceProxy` retry/fallback model. |
| AI safety and content policy | [3) AI Content Safety](#3-ai-content-safety) | Covers prompting, sanitization, and moderation controls. |
| Redis/storage and infrastructure impact | [4) Redis/Data Usage Efficiency](#4-redisdata-usage-efficiency) | Covers lazy evaluation, date-scoped keys, atomic writes. |
| Legal links and compliance readiness | [5) Legal & Compliance URLs](#5-legal--compliance-urls) | Includes explicit Terms/Privacy URLs now configured. |
| Proof that claims match implementation | [6) App-Specific Evidence Map](#6-app-specific-evidence-map) | File-level evidence by game and shared runtime. |

## Response Protocol (<=24h)
1. Acknowledge and classify the reviewer question by topic.
2. Paste the matching response template below with minimal edits.
3. Include 1-2 concrete evidence references from Section 6.
4. If requested, add one short repro note from smoke/demo checklist artifacts.
5. Reply within 24 hours with exact scope: "confirmed", "clarified", or "fix queued".

Attach these artifacts when useful:
- Latest smoke run result (`bash scripts/smoke_all_games.sh`).
- Relevant file references from Section 6.
- Demo readiness checklist notes (`docs/demo_post_checklist.md`).

---

## 1) API Key Security & Storage
**Question:** *How are external API keys (Gemini, SerpApi, etc.) managed and secured?*

**Response:**
> The app uses installation-scoped settings for all external API keys. Keys are never hardcoded in source code or committed to version control. Keys are configured by subreddit admins via Devvit settings and retrieved at runtime via `context.settings`. We also route external calls through a shared `ServiceProxy` so key handling and request behavior are consistent across all four games.

## 2) External Request Safety & Reliability
**Question:** *What happens if an external API (Gemini, Hugging Face, SerpApi) is down or rate-limited?*

**Response:**
> Reliability is handled by a shared `ServiceProxy` with bounded timeout/retry behavior and deterministic fallbacks. Trivia falls back to curated trend data, meme/image generation falls back across providers then themed placeholders, and duel narration falls back across Gemini model variants before static narrative fallback. This keeps gameplay responsive without blocking the Devvit execution window.

## 3) AI Content Safety
**Question:** *How do you keep generated meme/combat content aligned with Reddit policy?*

**Response:**
> We use layered controls: policy-aligned system prompting, basic prompt sanitization before generation, and moderation/reporting through standard Reddit mechanisms. In Meme Wars specifically, vote integrity and queue controls reduce abuse patterns, and we can apply subreddit-specific filtering requirements if requested.

## 4) Redis/Data Usage Efficiency
**Question:** *What is the infrastructure impact of hourly growth and daily reset logic?*

**Response:**
> Data access is optimized for Redis: date-scoped keys limit stale state growth, atomic operations protect leaderboard/streak updates, and expensive progression logic is bounded/idempotent. For strategy growth, processing is shard-based and cursor-tracked to avoid unbounded per-request work.

## 5) Legal & Compliance URLs
**Question:** *Have Terms and Privacy links been configured for publish/review requirements?*

**Response:**
> Yes. Required legal URLs are configured:
> - Terms & Conditions: <https://gist.github.com/cosmopax/4e471b6b61447c08b6d42269948b18e8>
> - Privacy Policy: <https://gist.github.com/cosmopax/3e3715bb55f2cf89265c7f88a93c1b0c>
> All four apps were successfully submitted for Devvit review after these links were set.

## 6) App-Specific Evidence Map
### Shared Runtime
- `packages/shared/src/ServiceProxy.ts`
  - Timeout/retry wrapper, telemetry logging, and fallback routing used across the portfolio.

### Game 1: Get Rich Lazy (`get-rich-lazy`)
- `packages/game-01-strategy/src/server.ts`
  - Date-scoped daily choice keys, idempotent daily behavior, bounded shard growth processing.
- `packages/game-01-strategy/src/main.tsx`
  - Launch/intro flow and user-facing daily-loop UX.

### Game 2: Hyper Hive Mind (`hyper-hive-minds`)
- `packages/game-02-trivia/src/main.tsx`
  - Daily participation enforcement and streak update behavior.
- `packages/game-02-trivia/src/ingestor.ts`
  - Date-safe ingest/archive and idempotent trend data refresh flow.

### Game 3: Meme Wars (`meme-wars`)
- `packages/game-03-meme/src/MemeQueue.ts`
  - Queue lifecycle, retry/backoff, dead-letter behavior.
- `packages/game-03-meme/src/main.tsx`
  - Vote integrity controls and queue-status UX.

### Game 4: Outsmarted Again (`outsmarted-again`)
- `packages/game-04-duel/src/DuelServer.ts`
  - State normalization, bounded history, progression and fallback behavior.
- `packages/game-04-duel/src/main.tsx`
  - Duel loop UX, credits display, and progression framing.

---

If reviewer feedback requests code changes, open a narrowly scoped follow-up patch and re-run `bash scripts/smoke_all_games.sh` before re-submission.
