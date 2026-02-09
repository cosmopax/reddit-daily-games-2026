# Demo Post Checklist (All 4 Games)

## Global Pre-Flight
- Run from repo root: `bash scripts/smoke_all_games.sh`
- Confirm Devvit auth in each package: `npx devvit whoami`
- Confirm required installation-scoped keys are set per game.

## Game 1: Get Rich Lazy (`packages/game-01-strategy`)
- Use subreddit menu item: **Create Get Rich Lazy Post**.
- Verify intro explains daily loop and leads to gameplay in one tap.
- Verify one Vic/Sal choice is accepted per UTC day.
- Verify portfolio updates and leaderboard refresh works.

## Game 2: Hyper Hive Mind (`packages/game-02-trivia`)
- Use subreddit menu item: **Create Hive Mind Gauntlet Post**.
- Verify trend pair loads for active UTC date.
- Verify only one guess per UTC day is accepted.
- Verify streak + total sync stats update correctly.

## Game 3: Meme Wars (`packages/game-03-meme`)
- Use subreddit menu item: **Create Meme Wars Post**.
- Submit one meme prompt and confirm queue job is created.
- Verify feed refresh shows ranked results.
- Verify duplicate same-direction vote from same user is blocked.

## Game 4: Outsmarted (`packages/game-04-duel`)
- Use subreddit menu item: **Create AI Duel Post**.
- Verify intro shows objective and credits.
- Verify user/AI turns alternate without lockups.
- Verify win updates leaderboard once and credits are rewarded.

## Publish Readiness Notes
- `devvit publish` is blocked until each app has both links in developer settings:
  - Terms & Conditions URL
  - Privacy Policy URL
- App pages:
  - https://developers.reddit.com/apps/get-rich-lazy/developer-settings
  - https://developers.reddit.com/apps/hyper-hive-minds/developer-settings
  - https://developers.reddit.com/apps/meme-wars/developer-settings
  - https://developers.reddit.com/apps/outsmarted-again/developer-settings
