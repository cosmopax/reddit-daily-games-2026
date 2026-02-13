# Meme Wars

**Enter the AI meme arena. Prompt is mightier than the sword.**

A daily creative competition where you write text prompts, an AI turns them into images, and the subreddit votes on who made the funniest thing. Daily themes rotate from Cyberpunk Chaos to Wholesome Vibes to Cosmic Horror. The Meme Lord watches over all.

## How It Works

- **Prompt-to-image generation** -- describe your meme, pick a style (Cyberpunk, Oil Painting, Neon Pop, Photorealistic, Anime, Pixel Art), and Flux.1 renders it
- **Daily rotating themes** -- everyone works with the same aesthetic constraint, creativity is the variable
- **Community voting** -- browse the feed, upvote the best, downvote the cringe
- **Meme Lord leaderboard** -- reputation points for daily winners
- **Vote integrity** -- built-in duplicate prevention and fair play mechanics
- **Async generation** -- images render in the background via job queue, UI stays responsive

## Tech

Devvit native blocks, Hugging Face (Flux.1 schnell) or Replicate for image generation, async scheduler-based job queue, Redis for meme storage and voting. Themed placeholder fallback when AI generation is unavailable.

```bash
npm install
devvit upload
```

## Part of Something Bigger

Meme Wars is secretly about human-AI co-creation -- learning to speak a language that machines understand well enough to produce what you actually imagined. Prompt engineering as a competitive sport. The better you get at translating intention into instruction, the more useful you'll be in every future interaction with generative systems. Consider it literacy training for the Age of Mind, but funnier.

---

*Built for the Reddit Daily Games Hackathon 2026. Your prompt. Your legacy. Your fault.*
