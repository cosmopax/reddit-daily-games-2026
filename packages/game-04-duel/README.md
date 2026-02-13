# Outsmarted Again

**Category trivia vs an AI that also picks its own difficulty. Good luck.**

A 5-round trivia duel where you and an AI opponent independently choose difficulty levels and answer questions across six categories. The twist: harder questions are worth more points, but the AI is making the same gamble. It's not just about what you know -- it's about how much you're willing to risk on knowing it.

## How It Works

- **6 categories** -- History, Science, Pop Culture, Geography, Sports, Technology
- **Risk-reward difficulty** -- Easy (+1), Normal (+2), Hard (+3). Pick before you see the question
- **270 handcrafted questions** -- 15 per category per difficulty, no repeats within a game
- **AI opponent** -- independently selects difficulty (weighted toward normal) with accuracy that scales. Beatable, but never a free win
- **Round-by-round reveal** -- after each round, see both your and the AI's choice, difficulty, and result
- **Rank progression** -- from Novice to Grandmaster based on cumulative wins
- **Shareable emoji grid** -- compact visual summary of who did what each round
- **~2 minute sessions** -- perfect scroll-break length

## Tech

Devvit native blocks, 270 questions in a static data module, AI opponent logic with weighted difficulty selection and accuracy curves, Redis leaderboards. Optional Gemini integration for future dynamic question generation.

```bash
npm install
devvit upload
```

## Part of Something Bigger

Outsmarted Again makes you think about thinking -- specifically, about confidence calibration under uncertainty. When should you bet on yourself? How do you model an opponent's strategy when you can't see their hand? These are the same questions at the heart of decision theory, game theory, and every multi-agent system ever built. Playful sparring for the Age of Mind.

---

*Built for the Reddit Daily Games Hackathon 2026. The AI is not sorry about that last round.*
