# Devvit Operations Runbook (Reddit Daily Games 2026)

Date: 2026-02-04
Audience: Maintainers and next Codex agents performing deploy/playtest/verification.

## 1. Environment Baseline

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games
npx devvit whoami
npx devvit version
```

## 2. Kill stale playtest port 5678 (safe)

```bash
pid="$(lsof -tiTCP:5678 -sTCP:LISTEN || true)"
if [ -n "$pid" ]; then
  kill "$pid" || true
  sleep 1
  kill -9 "$pid" 2>/dev/null || true
fi
```

## 3. Upload + Install latest version (per game)

### Game 1 Strategy

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-01-strategy
npx devvit upload
npx devvit install get_rich_lazy_dev
```

### Game 2 Trivia

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-02-trivia
npx devvit upload
npx devvit install hyper_hive_minds_dev
```

### Game 3 Meme

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-03-meme
npx devvit upload
npx devvit install meme_wars_dev
```

### Game 4 Duel

```bash
cd /Users/cosmopax/.codex/worktrees/00ba/reddit_hackathon_games/packages/game-04-duel
npx devvit upload
npx devvit install outsmarted_again_dev
```

## 4. Playtest + Logs (correct package context)

Important: `devvit logs` defaults to app slug from the current package. Do not query another app's subreddit from the wrong package directory.

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

## 5. Validation Matrix

| Game | Must pass | Must not happen |
|---|---|---|
| Strategy | Normal interactions and no key/config errors | `Missing GEMINI_API_KEY`, auth failures |
| Trivia | Real trend data appears regularly | Always same fallback topics only |
| Meme | Generated image appears in feed | only unavailable placeholder on every generation |
| Duel | AI move outputs vary and are not static fallback | every turn returns fallback `Static Noise` |

## 6. Installation settings UI paths

Use install settings (current workaround while app-scope CLI setting endpoint is unimplemented):

- `https://developers.reddit.com/r/get_rich_lazy_dev/apps/get-rich-lazy`
- `https://developers.reddit.com/r/hyper_hive_minds_dev/apps/hyper-hive-minds`
- `https://developers.reddit.com/r/meme_wars_dev/apps/meme-wars`
- `https://developers.reddit.com/r/outsmarted_again_dev/apps/outsmarted-again`

Expected keys:

- Strategy: `GEMINI_API_KEY`
- Trivia: `SERPAPI_KEY`, `GEMINI_API_KEY`
- Meme: `HUGGINGFACE_TOKEN`, optional `REPLICATE_API_TOKEN`
- Duel: `GEMINI_API_KEY`, `HUGGINGFACE_TOKEN`, optional `REPLICATE_API_TOKEN`

## 7. Troubleshooting quick answers

### `ReferenceError: SettingScope is not defined`

Cause: runtime enum not available in bundled runtime.

Status: fixed by removing `SettingScope` runtime references in all game `main.tsx` files.

### `ValidateAppForm Unimplemented` on `devvit settings set`

Cause: Reddit backend endpoint issue for app-scope settings.

Mitigation: use installation settings page in developers.reddit.com per install.

### `No installation found for <app> at <subreddit>` in logs

Cause: running `devvit logs` from wrong package (wrong app slug context).

Fix: `cd` into matching game package and rerun logs command.
