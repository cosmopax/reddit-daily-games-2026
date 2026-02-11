# Reddit Daily Games 2026 Hackathon

**"Bios + Logos" | Daily Loops | Serverless Agential Systems**

This monorepo contains 5 concurrent serverless games built on **Reddit Devvit**, designed for a high-retention "Daily Loop".

## 🎮 The Games

1.  **Get Rich Fast (Strategy)**: A passive income clicker.
    *   *Tech*: Redis Bit-packing, Hourly Scheduler.
2.  **Hive Mind (Trivia)**: Predict Google Trends.
    *   *Tech*: External API Ingestion, ZSET Leaderboards.
3.  **Meme Wars (Creativity)**: AI-generated memes (Flux.1).
    *   *Tech*: Async Job Queues, Image Generation.
4.  **AI Duel (Combat)**: Turn-based RPG vs Gemini 2.0.
    *   *Tech*: LLM Integration, Complex State Machines.
5.  **Lumen Weave (Puzzle)**: A nonlinear chroma-field puzzle with mirror-echo mechanics.
    *   *Tech*: Deterministic daily seeds, grid transforms, Redis-backed progression.

## 🏗 Architecture

*   **Monorepo**: Multi-package repository under `packages/` with a shared kernel package.
*   **Shared Kernel**: `packages/shared` contains:
    *   `RedisWrapper`: Optimized storage (bit-packing).
    *   `ServiceProxy`: Centralized external API handling (Compliance).
    *   `Theme`: Standardized Design System.
*   **Constraints**: Fully compliant with Devvit's 30s timeout and 500MB Redis limit.

## 🚀 Getting Started

1.  **Install dependencies per package** (there is no root `package.json`):
    ```bash
    cd packages/shared && npm install
    cd ../game-01-strategy && npm install
    cd ../game-02-trivia && npm install
    cd ../game-03-meme && npm install
    cd ../game-04-duel && npm install
    cd ../game-05-lumen-weave && npm install
    ```

2.  **Run canonical smoke checks from repo root**:
    ```bash
    bash scripts/smoke_all_games.sh
    ```

3.  **Upload a game from its package directory**:
    ```bash
    cd packages/game-01-strategy
    devvit whoami
    devvit upload
    ```
    Repeat per game package as needed.

## 🔐 API Keys Runbook (Current Workaround)

Because of a current Devvit CLI limitation for app-scoped secret writes, this repo uses installation-scoped settings in code (`scope: SettingScope.Installation`, `isSecret: false`).

Operational implications:
- Keys are visible in subreddit app settings UI to subreddit moderators/admins.
- Treat keys as lower-trust and rotate regularly.

Set keys (run inside each target game package):
```bash
devvit settings set GEMINI_API_KEY "..."
devvit settings set SERPAPI_KEY "..."
devvit settings set HUGGINGFACE_TOKEN "..."
devvit settings set REPLICATE_API_TOKEN "..."
```

Rotation procedure:
1. Generate new provider key(s) in Gemini/SerpApi/Hugging Face/Replicate.
2. Update installation settings with `devvit settings set ...` in each affected game install.
3. Validate with:
   - `bash scripts/smoke_all_games.sh`
   - `scripts/verify_api_dryrun.ts` (with env vars when testing locally)
4. Revoke old provider key(s) only after successful validation.

## 🛠 Next Steps (Handover)

*   **Latest implementation status**: `CODEX_HANDOVER_4.md`.
*   **Coordination log**: `cooperation_documentation.md`.
*   **Cross-game typecheck gate**: `scripts/smoke_all_games.sh`.

---
*Created by Antigravity (Google DeepMind) for Reddit Hackathon 2026*
