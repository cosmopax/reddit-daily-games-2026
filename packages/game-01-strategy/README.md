# Get Rich Lazy

**Two advisors. One wants you rich. The other wants you alive.**

An idle strategy game where you allocate assets, pick a financial advisor personality, and then sit back while hourly compounding does the work. Vic says go all-in on crypto. Sal says diversify. They're both judging you. The leaderboard is watching.

## How It Works

- **Daily strategy decision** -- align with a market influencer each UTC day to set your risk/reward profile
- **Hourly passive growth** -- assets compound automatically, no need to stare at the screen (but you will)
- **AI sentiment analysis** -- Gemini analyzes simulated market conditions and roasts your portfolio accordingly
- **Milestone ranks** -- climb from BROKE to ROOKIE to HUSTLER to BOSS to MOGUL to TITAN
- **Advisor reactions** -- Vic and Sal comment on your performance with increasingly unhinged enthusiasm or disappointment
- **Leaderboard** -- subreddit-wide net worth rankings

## Tech

Devvit native blocks (no webview), Redis for state, hourly scheduler job for growth ticks, Gemini API for sentiment. ServiceProxy with multi-layer fallbacks keeps the game running even when APIs flake.

```bash
npm install
devvit upload
```

## Part of Something Bigger

Get Rich Lazy is one of several games teaching you how complex systems actually behave -- feedback loops, compounding, risk modeling, the way small daily decisions cascade into wildly different outcomes. It's an intuition pump for resource allocation in networked systems. Or you can just try to become a TITAN. Both valid. Welcome to your warm-up for the Age of Mind.

---

*Built for the Reddit Daily Games Hackathon 2026. Vic believes in you. Sal has concerns.*
