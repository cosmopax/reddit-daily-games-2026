# Reddit Daily Games 2026: Design Manifesto

## The "Daily Loop" Philosophy
The core engagement model shifts from transient sessions to a **24-hour persistent cycle**.
- **Global Heartbeat**: A server-side CRON job (Scheduler) triggers a global state mutation at 00:00 UTC.
- **Tick-Tock Processing**: Heavy jobs are fragmented into small chunks to survive the 30s timeout.
- **Social Hooks**: Every "Win" state generates a text-based "Share" string for Reddit comments.

## "The Hard Deck": Inviolable Constraints
1.  **30-Second Timeout**: All server-side operations must complete < 30s. Long tasks must be async/scheduled.
2.  **500MB Redis Limit**: Data must be bit-packed (integers/byte arrays). No raw JSON for high-volume user data.
3.  **Client "Air-Gap"**: No `fetch()` from the client. All external API calls (Flux.1, Gemini) must proxy through `devvit.http` on the server.

## Architecture: The Monorepo
- **Kernel (`packages/shared`)**:
    - `RedisWrapper`: Bit-packing and optimized storage.
    - `DailyScheduler`: Cron abstractions and job fragmentation.
- **Game 1: Get Rich Fast**: Serverless Strategy, optimized for write-heavy loads.
- **Game 2: Hive Mind**: Daily Trivia, optimized for external data ingestion (Trends).
- **Game 3: Meme-Wars**: GenAI, optimized for async Flux.1 generation.
- **Game 4: Duel of Minds**: 1v1 Trivia, optimized for low latency (Gemini 2.0 Flash).

## Agent Modes
- **Plan Mode**: Complex Shared Logic, Server-side State Machines, Scripts.
- **Fast Mode**: React UI Components, CSS styling.
