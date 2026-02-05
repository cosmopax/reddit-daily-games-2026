# Reddit Daily Games 2026 Hackathon

**Neon Daily Arcade v2**: 4 cohesive Devvit games designed to work in Reddit feeds with a daily-episode loop.

## The Games

1. **Neon Syndicate Tycoon** (Strategy): contracts + compounding assets + advisors.
2. **Hive Mind: Trend Heist** (Trivia): higher/lower + reason + streaks + archive.
3. **Meme Wars: Neon Forge** (UGC): keyless caption battles + optional AI image forge.
4. **Valkyrie Arena: Duel of Minds** (Combat): reliable keyless opponent brain (no "Static Noise").

## Key Principles

- **Works without API keys**: keys only enhance, never block gameplay.
- **Mobile-first**: large tap targets, clear primary CTA, minimal scroll walls.
- **UGC flywheel**: each session produces something shareable (strings, captions, votes, wins).
- **Daily episode**: distinct "today" vibe via `packages/shared/src/Episode.ts`.

## How To Play (The Important Part)

Reddit's composer does not reliably show an "Apps" tab. Gameplay is driven by **subreddit menu actions**.

For each app, in the target subreddit run the menu item:

- `Open/Create Today's Neon Syndicate Post`
- `Open/Create Today's Trend Heist Post`
- `Open/Create Today's Neon Forge Post`
- `Open/Create Today's Valkyrie Arena Post`

This creates (or opens) a playable daily post in the feed. Pin those posts in a demo subreddit for judging.

## Dev / Ops

See:
- `docs/NEXT_CODEX_HANDOVER_2026-02-04.md`
- `docs/DEVVIT_OPERATIONS_RUNBOOK.md`

Run Devvit commands from the package directory, e.g.:

```bash
cd packages/game-01-strategy
npx devvit upload
npx devvit install get_rich_lazy_dev
```
