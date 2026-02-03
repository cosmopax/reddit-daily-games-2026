# Reddit Daily Games 2026 Hackathon

**"Bios + Logos" | Daily Loops | Serverless Agential Systems**

This monorepo contains 4 concurrent serverless games built on **Reddit Devvit**, designed for a high-retention "Daily Loop".

## 🎮 The Games

1.  **Get Rich Fast (Strategy)**: A passive income clicker.
    *   *Tech*: Redis Bit-packing, Hourly Scheduler.
2.  **Hive Mind (Trivia)**: Predict Google Trends.
    *   *Tech*: External API Ingestion, ZSET Leaderboards.
3.  **Meme Wars (Creativity)**: AI-generated memes (Flux.1).
    *   *Tech*: Async Job Queues, Image Generation.
4.  **AI Duel (Combat)**: Turn-based RPG vs Gemini 2.0.
    *   *Tech*: LLM Integration, Complex State Machines.

## 🏗 Architecture

*   **Monorepo**: Managed via `npm workspaces`.
*   **Shared Kernel**: `packages/shared` contains:
    *   `RedisWrapper`: Optimized storage (bit-packing).
    *   `ServiceProxy`: Centralized external API handling (Compliance).
    *   `Theme`: Standardized Design System.
*   **Constraints**: Fully compliant with Devvit's 30s timeout and 500MB Redis limit.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run a Game (Simulated)**:
    ```bash
    cd packages/game-01-strategy
    devvit upload
    ```

3.  **Deployment**:
    *   Push to branch `main`.
    *   CI/CD will handle Devvit publishing (Future State).

## 🛠 Next Steps (Handover)

*   **API Integration**: See `prompts/api_integration_mission.md`.
*   **UI Polish**: `shared` theme is implemented. Extend to Games 2 & 3.

---
*Created by Antigravity (Google DeepMind) for Reddit Hackathon 2026*
