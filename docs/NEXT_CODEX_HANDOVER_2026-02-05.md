# Next Codex Handover - Neon Daily Arcade v2 (Deadline Track)

Date: 2026-02-05
Deadline: 2026-02-13 03:00 (GMT+1)

This handover is the authoritative state for the "judge-ready demo" push.

## 1) Snapshot

- Repo: `/Users/cosmopax/.codex/worktrees/01fa/reddit_hackathon_games`
- Branch: `codex/neon-arcade-v2`
- Remote: `origin/codex/neon-arcade-v2`
- PR create link:
  - https://github.com/cosmopax/reddit-daily-games-2026/pull/new/codex/neon-arcade-v2

Latest commits:
- `fe7996c` Neon arcade v2: daily episode, keyless UX, game reworks
- `417ad1c` Deadline polish: telemetry, image fallback, demo playbook
- `d5f4611` Log deadline polish commit hash

## 2) What Was Implemented (Neon Daily Arcade v2)

Cross-cutting:
- Daily Episode kernel (keyless, deterministic by UTC date): `packages/shared/src/Episode.ts`
- Neon art posters (SVG data-URI): `packages/shared/src/NeonArt.ts`
- Shared header UI: `packages/shared/src/components/NeonUI.tsx`
- Menu-driven play flow (composer Apps tab unreliable): each app exposes "Open/Create Today's ..." menu item.

Games:
1. Strategy: "Neon Syndicate Tycoon"
   - `packages/game-01-strategy/src/server.ts` (v2 JSON state + v1 migration)
   - Daily contracts + advisors + income multiplier.
2. Trivia: "Hive Mind: Trend Heist"
   - `packages/game-02-trivia/src/main.tsx`
   - Guess + reason + archive vote counts + share string.
3. Meme: "Meme Wars: Neon Forge"
   - `packages/game-03-meme/src/main.tsx`
   - Keyless caption battle (UGC) + optional AI image forge.
4. Duel: "Valkyrie Arena"
   - `packages/game-04-duel/src/DuelServer.ts`, `packages/game-04-duel/src/fallbackAi.ts`
   - Deterministic fallback AI to avoid "Static Noise" trap.

## 3) Deadline Polish Added (Evidence + iOS Fallback)

### 3.1 Telemetry Logs (for judge evidence)
Key actions now log to stdout so `devvit logs` can prove behavior:
- Strategy:
  - `[strategy] contract_accept ...`
  - `[strategy] buy ...`
- Trivia:
  - `[trivia] guess ...`
  - `[trivia] reason ...`
- Meme:
  - `[memeforge] submit_caption ...`
  - `[memeforge] vote_caption ...`
  - `[memeforge] queue_ai ...`
  - `[memeforge] vote_ai ...`
- Duel:
  - `[duel] user_move ...`
  - `[duel] ai_move ... source=gemini|fallback ...`

### 3.2 iOS / Client Image Fallback
Problem: some clients may be flaky with `data:` images.

Solution: all apps have setting `NEON_IMAGE_MODE`:
- `data` (default): show neon poster images
- `none`: hide images in the header / meme background to reduce client rendering issues

Additionally, `EpisodeHeader` supports `showImage={false}`.

### 3.3 Meme vote guard + newest feed
- One vote per user per caption per episode/day.
- One vote per user per AI meme (legacy).
- "Newest Captions" driven by a timestamp ZSET (not just top ranked).

## 4) How To Play (Critical)

Reddit composer does not reliably show an "Apps" tab. The intended play flow is menu-driven.

In the target subreddit UI, open the `...` subreddit menu and run:
- `Open/Create Today's Neon Syndicate Post` (Strategy)
- `Open/Create Today's Trend Heist Post` (Trivia)
- `Open/Create Today's Neon Forge Post` (Meme)
- `Open/Create Today's Valkyrie Arena Post` (Duel)

This creates or opens a daily post (per game per day) and navigates to it.

## 5) Judge-Ready Demo Subreddit (To Do)

This is still manual UI work (create subreddit, pin posts, take screenshots).

See:
- `docs/DEMO_SUBREDDIT_PLAYBOOK.md`
- `scripts/print_demo_checklist.sh` (prints the exact commands)

Recommended demo subreddit name:
- `RedditGamesHackathon_cosmopax`

## 6) Verification (Must Happen Before Deadline)

Goal: create action-triggered evidence for all games (no "INCONCLUSIVE" reports).

After doing 2 actions per game in the demo subreddit posts, capture logs (timestamps on):

```bash
cd packages/game-01-strategy
npx devvit logs RedditGamesHackathon_cosmopax --since 10m --verbose --show-timestamps

cd ../game-02-trivia
npx devvit logs RedditGamesHackathon_cosmopax --since 10m --verbose --show-timestamps

cd ../game-03-meme
npx devvit logs RedditGamesHackathon_cosmopax --since 10m --verbose --show-timestamps

cd ../game-04-duel
npx devvit logs RedditGamesHackathon_cosmopax --since 10m --verbose --show-timestamps
```

Create a new report:
- `docs/VERIFICATION_REPORT_2026-02-11.md` (or date-of-run)
Include:
- screenshots of first screen per game
- at least 2 telemetry log lines per game proving actions

## 7) Known Ops Constraints

- Installation settings UI is the recommended path for secrets.
- CLI `devvit settings set` can fail with `ValidateAppForm Unimplemented` on app-scope settings.
- Dependency install story is not fully standardized; in this worktree uploads were possible. If a new machine/worktree lacks deps, use the documented setup flow or copy node_modules from a known-good worktree.

## 8) Next Actions (Most Important)

1. Create demo subreddit and install all 4 apps (unlisted).
2. Use menu actions to create/open today's 4 posts and pin them.
3. Perform 2 actions in each post to generate telemetry.
4. Capture logs with timestamps and screenshots.
5. Write verification report with evidence and severity list.
6. Freeze features 24h before deadline: bugfix-only.

