# Devvit Reviewer Response Templates

This document provides pre-vetted responses to potential reviewer questions for the **Reddit Daily Games** portfolio. 

**How to use:** If a Reddit reviewer asks for clarification on any of the topics below, copy and paste the corresponding "Response" into your reply to minimize review friction.

---

## 1. API Key Security & Storage
**Question:** *How are external API keys (Gemini, SerpApi, etc.) managed and secured?*

**Response:**
> The app uses installation-scoped settings for all external API keys. Keys are never hardcoded in the source or committed to version control. They are provided by the subreddit administrator via the Devvit Settings UI. On the backend, we use the `context.settings` API to retrieve these keys securely during runtime. We have also implemented a centralized `ServiceProxy` in our shared package to ensure these keys are handled consistently across all four games.

## 2. External Request Safety & Reliability
**Question:** *What happens if an external API (like Gemini or Hugging Face) is down or rate-limited?*

**Response:**
> Reliability is a core priority. We implemented a robust `ServiceProxy` pattern with multiple layers of fallbacks:
> - **Trivia/Trends:** If SerpApi is unavailable, the app fails over to a curated pool of high-relevance trend data.
> - **Generative AI (Images):** We use a tiered approach (Replicate -> Hugging Face -> Themed Placeholders).
> - **Combat AI:** The system cycles through multiple Gemini models (2.0-flash, 1.5-flash) and has a final "static" narrative fallback to ensure the user's session is never interrupted.
> All fetch calls include error handling and timeouts to prevent blocking the Devvit main thread.

## 3. AI Content Safety
**Question:** *How do you ensure AI-generated memes or combat dialogue adhere to Reddit's Content Policy?*

**Response:**
> We use several layers of protection:
> 1. **System Prompting:** Our AI prompts (for Gemini and Flux) explicitly instruct the models to be creative within "safe for work" and "community-friendly" boundaries.
> 2. **Input Validation:** User prompts for memes are passed through basic sanitization before being sent to the generation models.
> 3. **Community Reporting:** Since these are standard Reddit posts, the community can use built-in Reddit reporting tools to flag any content.
> 4. **Post-Generation Review:** For Meme Wars, the moderation team has full control over the generated posts, and we can implement automated keyword filtering if requested by a specific subreddit.

## 4. Redis/Data Usage Efficiency
**Question:** *What is the impact of the "Hourly Growth" or "Daily Reset" on Reddit's infrastructure?*

**Response:**
> We have optimized our data access patterns to be "Redis-friendly":
> - **Lazy Evaluation:** "Hourly growth" in *Get Rich Lazy* is calculated on-demand when the user views the app, rather than running a background job for every user.
> - **Date-Scoped Keys:** We use date-based keys (e.g., `daily_choice:2026-02-09`) to ensure that stale data naturally expires or is ignored, preventing unbounded storage growth.
> - **Atomic Operations:** We use Redis `incr` and other atomic operations to handle leaderboards and streaks efficiently without race conditions.