# HYPER HIVE MIND

> **cosmopax | Total Gamification**

A trivia game powered by real-time Google Trends. Guess which search term is trending higher!

## Gameplay
- Compare two trending search topics
- Guess which one has more search volume
- Build streaks for bonus points
- Daily reset keeps competition fresh

## API Keys Required
| Key | Purpose |
|-----|---------|
| `SERPAPI_KEY` | Fetching real Google Trends data |
| `GEMINI_API_KEY` | Generating clever trend hints |

## Set API Keys
```bash
devvit settings set SERPAPI_KEY "your-key-here"
devvit settings set GEMINI_API_KEY "your-key-here"
```

## Quick Verify
```bash
npx devvit whoami
npx devvit upload
```
- Use subreddit menu action: **Create Hive Mind Gauntlet Post**
- Daily loop check: one guess per UTC day with streak tracking
- Publish note: `npx devvit publish` requires Terms + Privacy links in app developer settings

## Part of the 2026 Reddit Daily Games Hackathon
Built with Devvit by cosmopax
