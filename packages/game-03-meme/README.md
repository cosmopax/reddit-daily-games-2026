# MEME WARS

> **Part of the 2026 Reddit Daily Games Portfolio**

**Meme Wars** turns your subreddit into a creative arena. It leverages state-of-the-art Generative AI to allow users to create, share, and vote on community memes in a competitive daily cycle.

## 🚀 The Daily Loop
- **Create:** Submit text prompts to generate unique memes using the **Flux.1** model.
- **Vote:** Browse the community feed and upvote the funniest creations. 
- **Conquer:** The highest-voted memes each day win reputation points and are featured on the subreddit's "Meme Lord" leaderboard.
- **Integrity:** Built-in vote guarding prevents duplicates and ensures fair play.

## 🧠 AI & Technology
- **Generative Power:** Uses **Hugging Face (Flux.1 schnell)** or **Replicate** for lightning-fast, high-quality image generation.
- **Async Processing:** Employs a robust job queue to handle image generation in the background, keeping the UI responsive.
- **Fallback UI:** If AI generation is unavailable, the system automatically provides themed placeholders to maintain the competitive flow.

## 🛠️ Setup & Configuration
Requires a `HUGGINGFACE_TOKEN` or `REPLICATE_API_TOKEN`.

```bash
devvit settings set HUGGINGFACE_TOKEN "your-token-here"
devvit settings set REPLICATE_API_TOKEN "your-token-here"
```

## ✅ Quick Verify
```bash
npx devvit whoami
npx devvit upload
```
- Use subreddit menu action: **Create Meme Wars Post**
- Queue check: prompt creates a queued job and feed refreshes once processed
- Publish note: `npx devvit publish` requires Terms + Privacy links in app developer settings

---
Built with ❤️ by **cosmopax** for the Reddit Developers Hackathon.