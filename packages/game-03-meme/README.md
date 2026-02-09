# MEME WARS

> **cosmopax | Total Gamification**

AI-powered meme battles! Generate memes and vote on the best ones in your community.

## Gameplay
- Submit text prompts to generate AI memes
- Community votes on the funniest creations
- Daily meme battles with winners announced
- Earn reputation as the best meme lord

## API Keys Required
| Key | Purpose |
|-----|---------|
| `HUGGINGFACE_TOKEN` | AI image generation (Flux.1) |

## Set API Keys
```bash
devvit settings set HUGGINGFACE_TOKEN "your-token-here"
devvit settings set REPLICATE_API_TOKEN "your-token-here"
```

## Quick Verify
```bash
npx devvit whoami
npx devvit upload
```
- Use subreddit menu action: **Create Meme Wars Post**
- Queue check: prompt creates a queued job and feed refreshes once processed
- Publish note: `npx devvit publish` requires Terms + Privacy links in app developer settings

## Part of the 2026 Reddit Daily Games Hackathon
Built with Devvit by cosmopax
