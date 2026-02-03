# Mission Brief: Real API Integration & Backend Hardening

**Role**: Backend Integration Specialist
**Context**: The Reddit Daily Games 2026 Hackathon codebase is scaffolded. We have a `Shared.ServiceProxy` that currently mocks responses or calls placeholder endpoints.
**Objective**: Replace the mocks in `ServiceProxy.ts` with real, authenticated calls to Flux.1 (Replicate/Fal.ai), Google Gemini 2.0, and Google Trends/SerpApi.

## 1. Credentials & Secrets
- Uses `context.reddit.getSecret` (or similar Devvit secret management) for:
  - `FLUX_API_KEY`
  - `GEMINI_API_KEY`
  - `SERPAPI_KEY` (for Trends)

## 2. Tasks

### A. Game 2: Trivia (Google Trends)
- **File**: `packages/shared/src/ServiceProxy.ts` -> `fetchDailyTrend`
- **Action**: Implement a real implementation. If Google Trends API is hard to access server-side, consider using a `SerpApi` proxy or a dedicated scraping microservice if allowed. 
- **Fallback**: Maintain the mock array if the API fails (Resilience).

### B. Game 3: Meme Wars (Flux.1)
- **File**: `packages/shared/src/ServiceProxy.ts` -> `generateImage`
- **Action**: Integrate with Replicate (flux-schnell model for speed/cost) or Fal.ai.
- **Flow**: CONSTANT POLL or WEBHOOK. Since Devvit is serverless/ephemeral, you might need a "check status" implementation.
  - *Current Logic*: `MemeQueue` expects a synchronous result or a fast async return. Adapt `MemeQueue.ts` if the API requires a callback.

### C. Game 4: AI Duel (Gemini 2.0 Flash)
- **File**: `packages/shared/src/ServiceProxy.ts` -> `generateAiMove`
- **Action**: Call Google Vertex AI or AI Studio for Gemini 2.0 Flash.
- **Prompt Engineering**: The prompt needs to take the `history` array and output structured JSON `{ "move": string, "damage": number, "flavorText": string }`.

## 3. Resilience
- Implement retry logic in `ServiceProxy`.
- Ensure all calls timeout before the Devvit 30s hard limit.

## 4. Deliverable
- A fully functional `ServiceProxy.ts` with no hardcoded magic strings for data.
