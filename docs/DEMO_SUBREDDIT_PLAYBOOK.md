# Demo Subreddit Playbook (Neon Daily Arcade v2)

Goal: create a judge-friendly demo experience where all 4 games are playable from the feed, without requiring API keys.

## Why This Exists
Reddit's composer does not reliably show an "Apps" tab. The intended play flow is **menu-driven post creation** per app.

## Recommended Demo Subreddit
- Default: `r/RedditGamesHackathon_cosmopax`
- Requirement: you must be a moderator of the subreddit.

## Step 1: Install All 4 Apps
Run from each package directory:

```bash
cd packages/game-01-strategy
npx devvit upload
npx devvit install RedditGamesHackathon_cosmopax

cd ../game-02-trivia
npx devvit upload
npx devvit install RedditGamesHackathon_cosmopax

cd ../game-03-meme
npx devvit upload
npx devvit install RedditGamesHackathon_cosmopax

cd ../game-04-duel
npx devvit upload
npx devvit install RedditGamesHackathon_cosmopax
```

Notes:
- `devvit install <subreddit>` uses the current package's app slug.
- Uploads are unlisted/private by default (good for hackathon iteration).

## Step 2: Create Today's Posts (From Subreddit Menu)
In the subreddit UI, open the `...` menu (subreddit menu) and run:
- `Open/Create Today's Neon Syndicate Post` (Strategy)
- `Open/Create Today's Trend Heist Post` (Trivia)
- `Open/Create Today's Neon Forge Post` (Meme)
- `Open/Create Today's Valkyrie Arena Post` (Duel)

Each action creates (or opens) the daily post for that game and navigates to it.

## Step 3: Pin The 4 Posts
Pin the 4 daily posts to the top of the demo subreddit.

Judge experience: open subreddit → tap pinned post → play immediately in-feed.

## Step 4: Smoke-Test + Evidence
Desktop web is the recommended judge path. iOS is best-effort.

For each game:
1. Open the pinned post
2. Perform 2 actions
3. Immediately capture logs (timestamps on):

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

## Troubleshooting
### "I don't see the app / can't play it"
- Use the subreddit menu actions above. Do not rely on the composer.

### iOS loads forever
- Try desktop web for the demo.
- Optional fallback: set app setting `NEON_IMAGE_MODE = none` in the installation settings UI if `data:` images cause rendering issues.

### "devvit settings set" fails
- Use developers.reddit.com installation settings UI. Some app-scope settings endpoints can be unimplemented.

