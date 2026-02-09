# HYPER HIVE MIND

> **Part of the 2026 Reddit Daily Games Portfolio**

**Hyper Hive Mind** is a real-time data-driven trivia experience. It tests the community's pulse by pitting trending topics against each other in a battle of search volume.

## 🚀 The Daily Loop
- **The Daily Gauntlet:** Every 24 hours, a new pair of trending search terms is fetched from real-world data.
- **Predict the Pulse:** Guess which topic currently has higher search volume.
- **Streak Building:** Correct guesses increase your daily streak. High streaks unlock bonus points and exclusive leaderboard rankings.
- **Community Wisdom:** See how your guess compares to the rest of the subreddit in real-time.

## 🧠 AI & Technology
- **Real-Time Data:** Powered by the **SerpApi (Google Trends engine)** to pull actual, live search data.
- **AI Hints:** Uses **Google Gemini** to generate clever, contextual hints for each topic to help (or trick!) the player.
- **Resilient Fallbacks:** A dedicated `ServiceProxy` handles API interruptions by failing over to a curated, high-relevance trend pool, ensuring zero downtime.

## 🛠️ Setup & Configuration
Requires `SERPAPI_KEY` and `GEMINI_API_KEY`.

```bash
devvit settings set SERPAPI_KEY "your-key-here"
devvit settings set GEMINI_API_KEY "your-key-here"
```

---
Built with ❤️ by **cosmopax** for the Reddit Developers Hackathon.
