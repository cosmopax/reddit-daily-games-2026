# GET RICH LAZY

> **Part of the 2026 Reddit Daily Games Portfolio**

**Get Rich Lazy** is a high-fidelity idle strategy game built natively on Devvit. It challenges Redditors to build the ultimate investment portfolio through strategic asset allocation and hourly passive growth.

## 🚀 The Daily Loop
- **Daily Strategy:** Players make a one-time decision each UTC day to align with specific market influencers (e.g., "Vic" vs "Sal"), impacting their risk/reward profile for the next 24 hours.
- **Hourly Growth:** Assets generate passive income every hour, updating the player's net worth automatically.
- **Leaderboard Dominance:** Compete against your subreddit to see who can accumulate the most wealth.

## 🧠 AI & Technology
- **AI Sentiment:** Leverages **Google Gemini** to analyze simulated market sentiment and provide dynamic feedback on asset performance.
- **Service Proxy Architecture:** Implements a robust `ServiceProxy` with multi-layer fallbacks to ensure gameplay continues even during API rate limits or downtime.
- **Devvit Native:** Utilizes Reddit's latest Devvit components for a seamless, low-latency mobile experience.

## 🛠️ Setup & Configuration
Requires a `GEMINI_API_KEY` for sentiment analysis features.

```bash
devvit settings set GEMINI_API_KEY "your-key-here"
```

---
Built with ❤️ by **cosmopax** for the Reddit Developers Hackathon.
