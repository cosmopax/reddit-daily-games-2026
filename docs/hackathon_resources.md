# Reddit Daily Games 2026 Hackathon: Resources & Requirements

## 1. Core Requirements
- **Platform**: Must be built on [Devvit](https://developers.reddit.com/docs).
- **Theme**: "Daily Games" - games that rely on a 24-hour cycle or recurring content.
- **Constraints**: 
    - No external hosting (frontend must be on Devvit).
    - Backend processing must handle the 30s timeout mechanism.
- **Submission**:
    - **App Listing**: Link to developer.reddit.com app page.
    - **Demo Post**: A live Reddit post running the game (Critical for judging).
    - **Source Code**: Likely required via GitHub/Devpost.

## 2. Judging Criteria
1.  **Delightful UX**: Exciting layouts, themes, easy to understand.
2.  **Polish**: Launch-ready quality. "Concept-complete" and bug-free.
3.  **Reddit-y**: Community-minded, embraces Reddit culture/topics.
4.  **Recurring Content**: Smart use of daily loops or fresh content generation.

## 3. Resources You Can Leverage
-   **Hosting**: Free hosting provided by Reddit (Devvit platform).
-   **Payments Sandbox**: Testing for Reddit Gold/Premium features.
-   **Reddit Developer Funds**: Successful apps can apply for funding based on engagement.
-   **GameMaker Integration**: Special category for GameMaker users (We are using React/Devvit, so this is secondary).
-   **Templates**: Reddit provides a template library (we are already using a custom scaffold).

## 4. Suggested "To-Do" List for Submission
1.  **Polish UI**: Ensure the "Scientific Premium" theme looks perfect on mobile.
2.  **Verify Daily Loop**: Test that the scheduler actually resets state at 00:00 UTC.
3.  **Create Demo Subreddit**:
    -   Create `r/RedditGamesHackathon_YourName`.
    -   Install the app requests.
    -   Create "Official Daily Thread" for each game.
4.  **Record Demo Video**: Highly recommended for Devpost.
5.  **Write Description**: Focus on "Community" and "Daily Habits".

## 5. Free Tier & Credits Strategy
-   **Reddit**: Free hosting/execution.
-   **AI/Backend**:
    -   **Flux.1**: Use [Fal.ai](https://fal.ai) (Fastest inference) or Replicate.
    -   **Gemini 2.0**: Free via Google AI Studio.
    -   **Search**: SerpApi (100 free/mo).
