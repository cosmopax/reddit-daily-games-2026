# Demo Post Checklist (All 4 Games)

Use this checklist to verify each app is correctly installed and functioning on your target subreddit before recording a demo or sharing with moderators.

## 🌍 Global Pre-Flight
- [ ] Run from repo root: `bash scripts/smoke_all_games.sh`
- [ ] Confirm Devvit auth in each package: `npx devvit whoami`
- [ ] Confirm all required API keys are configured in Subreddit App Settings.

## 📈 Game 1: Get Rich Lazy (`packages/game-01-strategy`)
- [ ] Subreddit menu item: **Create Get Rich Lazy Post**.
- [ ] Verify intro explains daily loop and leads to gameplay in one tap.
- [ ] Verify one Vic/Sal choice is accepted per UTC day.
- [ ] Verify portfolio updates and leaderboard refresh works.

## 🧠 Game 2: Hyper Hive Mind (`packages/game-02-trivia`)
- [ ] Subreddit menu item: **Create Hive Mind Gauntlet Post**.
- [ ] Verify trend pair loads for active UTC date.
- [ ] Verify only one guess per UTC day is accepted.
- [ ] Verify streak + total sync stats update correctly.

## 🖼️ Game 3: Meme Wars (`packages/game-03-meme`)
- [ ] Subreddit menu item: **Create Meme Wars Post**.
- [ ] Submit one meme prompt and confirm queue job is created.
- [ ] Verify feed refresh shows ranked results once processed.
- [ ] Verify duplicate same-direction vote from same user is blocked.

## ⚔️ Game 4: Outsmarted (`packages/game-04-duel`)
- [ ] Subreddit menu item: **Create AI Duel Post**.
- [ ] Verify intro shows objective and credits.
- [ ] Verify user/AI turns alternate without lockups.
- [ ] Verify victory updates leaderboard and rewards credits.

---

## 📝 Publish Readiness Notes
- `devvit publish` requires both **Terms & Conditions** and **Privacy Policy** URLs in the [App Developer Settings](https://developers.reddit.com/apps).
- **Direct Links:**
  - [Get Rich Lazy](https://developers.reddit.com/apps/get-rich-lazy/developer-settings)
  - [Hyper Hive Mind](https://developers.reddit.com/apps/hyper-hive-minds/developer-settings)
  - [Meme Wars](https://developers.reddit.com/apps/meme-wars/developer-settings)
  - [Outsmarted Again](https://developers.reddit.com/apps/outsmarted-again/developer-settings)