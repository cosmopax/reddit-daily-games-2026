# Reddit Games Hackathon: Multi-Agent Coordination Log

**File Location:** `/Users/cosmopax/Desktop/projx/reddit_hackathon_games/cooperation_documentation.md`
**Purpose:** Single Source of Truth for parallel agent workflows. All agents MUST log changes here before and after execution to prevent regressions.

---

## 🛑 Active Locks (Check Before Editing)
| Component | Agent ID / Task | Status | Timestamp |
|-----------|----------------|--------|-----------|
| `packages/game-01-strategy` | Agent A (Cosmo) | **RELEASED** | 2026-02-04 03:55 |
| `packages/shared` | - | FREE | - |

---

## 📝 Change Log (Reverse Chronological)

### [2026-02-04 03:52] - Feature Freeze & Handover (Agent: Antigravity)
- **Action:** Completed "Social & Strategic" Phase.
- **Artifacts:** 
    - `strategic_submission_plan.md` (Brain)
    - `demo_video_script.md` (Brain)
    - `CODEX_HANDOVER_2.md` (Root)
- **Critical Notes:** 
    - `global.d.ts` in Game 1 was patched for `JSX.IntrinsicElements`. Do not revert imports in `main.tsx`.
    - ALL games now use `LeaderboardUI` from `shared`.

---

## ⚠️ Known Hazards & Regressions to Avoid
1.  **Devvit Types:** Do not remove `import './global.d.ts'` in `main.tsx`. It fixes `vstack` lint errors.
2.  **Asset Handling:** No binary assets exist in `packages/`. Use URLs or generated placeholders.
3.  **Monorepo:** Run `devvit upload` from the specific package directory, not root.

---

## 🧩 Project Index & API Config

| Game | Directory | Slug | Subreddit | API Keys Required |
|---|---|---|---|---|
| **Strategy** | `game-01-strategy` | `get-rich-lazy` | `r/get_rich_lazy_dev` | Gemini |
| **Trivia** | `game-02-trivia` | `hivemind-trivia` | `r/hyper_hive_minds_dev` | Gemini, SerpApi |
| **Meme** | `game-03-meme` | `meme-wars` | `r/meme_wars_dev` | Hugging Face |
| **Duel** | `game-04-duel` | `outsmarted-again` | `r/outsmarted_again_dev` | Hugging Face, Gemini |

## ⚠️ Critical Workaround: API Keys (Installation Scope)
**Context:** The Devvit CLI currently fails when setting App-scoped secrets (`ValidateAppForm Unimplemented`).
**Workaround:** As a last resort, we are using `isSecret: false` and `scope: SettingScope.Installation`.
**Implication:** API keys are visible in the Subreddit Settings UI (`/about/edit?page=apps`) and must be configured there manually. Do not revert this unless the CLI bug is confirmed fixed.
