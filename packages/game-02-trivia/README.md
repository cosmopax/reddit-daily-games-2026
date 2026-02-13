# Hyper Hive Mind

**Predict the pulse. Become the collective.**

A data-driven trivia gauntlet where you guess which search terms are trending harder, estimate traffic volumes, and spot the outlier in a set of four. The Hive Brain narrates your performance like a sentient network monitoring your neural sync rate. It's weirdly motivating.

## How It Works

- **5-round daily gauntlet** with three round types:
  - **Higher/Lower** -- which trend has more search volume?
  - **Closest Guess** -- estimate the actual traffic number
  - **Odd One Out** -- spot the lowest-traffic outlier among four trends
- **Real-time data** -- trends pulled from Google via SerpApi, so the answers change with the actual internet
- **AI hints** -- Gemini generates contextual clues that are sometimes helpful and sometimes devious
- **Streak bonuses** -- consecutive correct answers compound your score
- **Hive Brain commentary** -- "UNPRECEDENTED RESONANCE. You ARE the collective."
- **Shareable emoji grid** -- flex your gauntlet results in the comments

## Tech

Devvit native blocks, SerpApi for live Google Trends data, Gemini for hint generation, Redis leaderboards. Curated fallback trend pool ensures zero downtime when APIs are rate-limited.

```bash
npm install
devvit upload
```

## Part of Something Bigger

Hyper Hive Mind trains your sense for collective attention patterns -- what captures a population's focus, how information flows, and why your gut feeling about "what people care about" is often hilariously wrong. It's a crash course in distributed cognition, wrapped in a trivia game. Casual calibration for the Age of Mind.

---

*Built for the Reddit Daily Games Hackathon 2026. The hive is always watching. The hive is always judging.*
