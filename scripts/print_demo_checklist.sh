#!/usr/bin/env bash
set -euo pipefail

SUBREDDIT="${1:-RedditGamesHackathon_cosmopax}"

cat <<EOF
Neon Daily Arcade v2 Demo Checklist

Target subreddit: r/$SUBREDDIT

1) Install apps (run from repo root):

cd packages/game-01-strategy && npx devvit upload && npx devvit install "$SUBREDDIT"
cd ../game-02-trivia && npx devvit upload && npx devvit install "$SUBREDDIT"
cd ../game-03-meme && npx devvit upload && npx devvit install "$SUBREDDIT"
cd ../game-04-duel && npx devvit upload && npx devvit install "$SUBREDDIT"

2) In the subreddit UI, use the subreddit menu actions:
   - Open/Create Today's Neon Syndicate Post
   - Open/Create Today's Trend Heist Post
   - Open/Create Today's Neon Forge Post
   - Open/Create Today's Valkyrie Arena Post

3) Pin the 4 created posts.

4) Evidence (after doing 2 actions in each post):

cd packages/game-01-strategy && npx devvit logs "$SUBREDDIT" --since 10m --verbose --show-timestamps
cd ../game-02-trivia && npx devvit logs "$SUBREDDIT" --since 10m --verbose --show-timestamps
cd ../game-03-meme && npx devvit logs "$SUBREDDIT" --since 10m --verbose --show-timestamps
cd ../game-04-duel && npx devvit logs "$SUBREDDIT" --since 10m --verbose --show-timestamps

Optional iOS fallback:
- Set NEON_IMAGE_MODE=none in the install settings UI if images render poorly.
EOF

