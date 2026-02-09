# OUTSMARTED

> **Part of the 2026 Reddit Daily Games Portfolio**

**Outsmarted** is a cyberpunk-themed, turn-based AI RPG. It pits players against a sophisticated "Cyber-Valkyrie" AI in a battle of wits, strategy, and creative combat.

## 🚀 The Daily Loop
- **Enter the Arena:** Engage in tactical duels with a limited pool of daily credits.
- **Strategic Combat:** Your moves are evaluated for creativity and effectiveness in real-time.
- **Progression:** Win battles to earn XP, climb the global ranks, and unlock higher-tier arenas.
- **Persistent Challenge:** The AI adapts its strategy based on the ongoing battle history.

## 🧠 AI & Technology
- **Dynamic Combat AI:** Powered by **Google Gemini (2.0 Flash)** to generate dramatic, contextual counter-attacks and narrate the battle.
- **Narrative Evaluation:** Gemini analyzes player input to determine damage and impact, rewarding creative "out-of-the-box" tactical moves.
- **Atmospheric Visuals:** Leverages **Hugging Face** to generate unique, cyberpunk-themed arena portraits for every encounter.
- **Uninterruptible Flow:** Multi-model fallbacks ensure that the "Cyber-Valkyrie" stays online even under heavy API load.

## 🛠️ Setup & Configuration
Requires `GEMINI_API_KEY` and `HUGGINGFACE_TOKEN`.

```bash
devvit settings set GEMINI_API_KEY "your-key-here"
devvit settings set HUGGINGFACE_TOKEN "your-token-here"
```

## ✅ Quick Verify
```bash
npx devvit whoami
npx devvit upload
```
- Use subreddit menu action: **Create AI Duel Post**
- Combat check: turns alternate and victory increments leaderboard once
- Publish note: `npx devvit publish` requires Terms + Privacy links in app developer settings

---
Built with ❤️ by **cosmopax** for the Reddit Developers Hackathon.