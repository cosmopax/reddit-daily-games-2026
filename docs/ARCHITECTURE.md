# Architecture & Design Patterns

## 1. The "Daily Loop" Philosophy
Every game is designed to bring the user back **once per day** (or hourly). We utilize the **Bit-Packed User State** pattern to store thousands of users efficiently in Redis.

## 2. Hard Deck Constraints
*   **30s Timeout**: Heavy operations (Image Gen, Trend Fetch) are offloaded to **Async Job Queues** (`MemeQueue`) or Proxies (`ServiceProxy`).
*   **500MB Redis**: We use `RedisWrapper` to pack booleans/integers into single strings where possible.
*   **Client Isolation**: The Client (React) **NEVER** calls external APIs directly. It talks to the Devvit App (Server), which talks to the `ServiceProxy`.

## 3. Shared Kernel (`packages/shared`)
This is the heart of the monorepo.

### `RedisWrapper`
*   Wraps `context.redis`.
*   Implements `savePackedState` / `getPackedState`.
*   Usage: `await redis.increment('global', 'ticks', 1);`

### `ServiceProxy`
*   **Purpose**: Centralize all HTTP traffic.
*   **Reason**: Easier to audit, mock, and manage API keys (Secrets).
*   **Methods**:
    *   `fetchDailyTrend()` -> Google Trends
    *   `generateImage()` -> Flux.1
    *   `generateAiMove()` -> Gemini 2.0

### `Theme`
*   **Purpose**: "Scientific Premium" aesthetic.
*   **Colors**: Dark mode first (`#1A1A1B`), Reddit Orange (`#FF4500`).

## 4. Agentic Workflow
This codebase was built by recursive agents.
*   **Agent 1**: Scaffolding (Monorepo, constraints).
*   **Agent 2**: Game Logic & Service Proxy.
*   **Agent 3**: API Integration (Planned).

See `prompts/api_integration_mission.md` for the next mission.
