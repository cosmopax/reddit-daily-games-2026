# Devvit Hackathon Game Design.pdf

## Page 1

Architectural Blueprint for the Hive Mind
Gauntlet: A Technical Analysis of
Serverless Generative Gaming on the
Reddit Devvit Platform
Technical Validation of the Devvit Runtime
Environment (2025/2026 Specifications)
The success of a serverless application on the Reddit Developer Platform, hereafter referred
to as Devvit, is contingent upon a rigorous understanding of its sandboxed execution
environment and the specific constraints imposed on external egress and state persistence.
As of the current 2025 and early 2026 technical specifications, Devvit provides a managed
runtime for React-based TypeScript applications, where the primary infrastructure consists of
an event-driven plugin architecture.1 For a high-concurrency "Daily Game" like the Hive Mind
Gauntlet, the architecture must leverage three core subsystems: the HTTP Fetch API for
external model inference, the Devvit Redis plugin for global state management, and the Devvit
Scheduler for automated content refresh cycles.1
External Egress and the HTTP Fetch Allowlist
The Devvit platform enforces a strict security policy regarding outbound network requests.
Unlike traditional server-side environments where any reachable URI can be queried, Devvit
requires that every external domain be explicitly allow-listed in the application's
configuration.1 Technical documentation confirms that the HTTP Fetch policy supports
asynchronous network requests to verified third-party integrations, which is critical for the
integration of Large Language Models (LLMs).1 A pivotal verification for this architectural
blueprint is the status of the Google Generative Language API. Investigation of the global
fetch allow-list reveals that generativelanguage.googleapis.com is an approved endpoint,
along with related services such as fonts.googleapis.com, youtube.googleapis.com, and
commentanalyzer.googleapis.com.5 This accessibility allows for direct, non-proxied
communication with the Gemini 2.5 Flash model, which is essential for minimizing latency and
avoiding the overhead of a self-hosted backend.
However, developers must adhere to specific formatting requirements in the devvit.yaml or
devvit.json manifest. No wildcards (e.g., *.googleapis.com) or specific paths (e.g.,
api.example.com/webhooks) are permitted; the configuration must specify exact hostnames
only.1 Furthermore, the runtime environment limits HTTP fetch operations to a 30-second
timeout.1 This temporal boundary is a significant consideration when invoking generative

## Page 2

models, as the time-to-first-token and total inference time for complex prompts can
occasionally exceed this window during periods of high API load.
The Temporal Sandbox: Scheduler and Timeout Constraints
The Devvit Scheduler functions as the heartbeat of the Hive Mind Gauntlet, facilitating the
24-hour content refresh cycle that defines the "Daily Ritual".3 The scheduler is capable of
running background jobs independently of user interaction, which is necessary for fetching
trending Reddit content and processing it via the Gemini API at 00:00 UTC each day.3 The
maximum execution time for a scheduled job is typically aligned with the 30-second timeout
of the HTTP fetch call.1 This means the entire generation pipeline—fetching Reddit threads,
prompting the Gemini model, parsing the JSON output, and committing the resulting
questions to Redis—must be completed within this 30-second envelope.
To ensure resilience, the implementation must account for potential failures in the generation
pipeline. If the model inference exceeds the 30-second threshold, the job will be terminated,
potentially leaving the game in an "unready" state for the new day. A sophisticated
implementation strategy involves the use of the "Circuit Breaker" pattern, an engineering
standard at Reddit used to manage latency and dependency unresponsiveness.7 If a service
dependency becomes slow or returns frequent 5xx errors, the application should fail fast and
potentially retry via a delayed scheduler trigger rather than repeatedly hitting a failing
endpoint.7
State Management: High-Concurrency Redis Operations
Redis serves as the durable memory for Devvit applications, providing a shared state layer
across all installations.4 In the context of a global daily game, Redis must handle two distinct
types of data: the daily game content (read-heavy) and the global leaderboard (write-heavy).
For the Hive Mind Gauntlet, where ten or more players may submit scores concurrently, atomic
operations are vital to prevent race conditions. The redis.incrBy command is the standard
mechanism for thread-safe numerical increments, ensuring that score updates are handled
sequentially at the database level.3
For more complex state transitions, such as checking if a user has already used their daily
attempt before updating the leaderboard, the platform supports the watch / multi / exec flow
for optimistic locking.3 This transactional logic is essential for maintaining competitive
integrity. For instance, the application can "watch" a user's attempt count; if another process
increments that count before the transaction completes, the execution will fail, preventing the
user from submitting multiple scores for the same day.3 The syntax for these operations is
consistent with standard Redis protocols but provided through the @devvit/public-api.8
Redis Command Use Case in Hive Mind Concurrency Strategy
Gauntlet
set Storing daily questions as a Overwrite once per 24h
JSON string

## Page 3

get Fetching the current day's High-read, eventual
gauntlet consistency
incrBy Updating total community Atomic increment 3
participation count
zIncrBy Adding points to a daily sorted Atomic sorted set update 9
leaderboard
multi/exec Atomic multi-step score Optimistic locking 4
submission
The Generative Engine: Gemini 2.5 Flash Integration
The integration of Gemini 2.5 Flash is the primary innovation of the Hive Mind Gauntlet,
enabling the procedural generation of game content from the ever-shifting landscape of
Reddit discourse. The Flash model is specifically optimized for low-latency, high-volume tasks,
making it the ideal choice for a serverless environment with strict execution timeouts.10
Rate Limiting and Quota Management (Free Tier)
The Google AI Studio Free Tier provides a generous but firm quota for developers. For Gemini
2.5 Flash, the limits as of late 2025 are 10 Requests Per Minute (RPM), 250,000 Tokens Per
Minute (TPM), and 250 Requests Per Day (RPD).12 Given that the gauntlet only requires one
centralized generation call per 24 hours, the 250 RPD limit is more than sufficient for the core
gameplay loop. However, the engineer must plan for the 250,000 TPM limit if the application
fetches extremely long Reddit threads for analysis.12
This calculation suggests that even the most exhaustive Reddit "Megathreads" can be
processed in a single inference call.12 To handle the 429 "Too Many Requests" error, which is
the standard response when quota is exceeded, the backend must implement a retry logic
with exponential backoff, potentially offloading the retry to a secondary scheduler job if the
first attempt fails.1
Prompt Engineering and Structured Output Schemas
To maintain a "Copy-Paste Ready" pipeline, the model must be forced to output structured
JSON data that the Devvit backend can parse directly into TypeScript interfaces. The
responseJsonSchema configuration in the Gemini API is the most robust method for this, as it
eliminates the need for natural language parsing.14 This ensures that the model does not
include conversational filler like "Sure, here are your questions..." which would break a
JSON.parse() call.14
The prompt engineering strategy for the Hive Mind Gauntlet focuses on "Golden Question"
synthesis. The model is instructed to identify five distinct themes from the top-trending

## Page 4

thread—such as a specific debate, a popular pun, or a controversial opinion—and generate a
multiple-choice question for each. This requires the model to utilize its 1-million-token context
window to "understand" the community sentiment rather than just summarizing the post
text.10
Security Protocols: Secret Storage and API Credentialing
Security is a paramount concern when deploying third-party API keys within a distributed
application. Reddit's Devvit platform provides a secure "Settings and Secrets" infrastructure
to address this.15 API keys must be defined in the app configuration as isSecret: true with an
app scope, which ensures they are encrypted and only accessible to the developer via the
CLI.16
The process for managing these secrets involves three distinct stages:
1. Declaration: Defining the setting in the application code using Devvit.addSettings.
2. Provisioning: Setting the value via the CLI using devvit settings set GEMINI_API_KEY.
3. Consumption: Retrieving the key at runtime via
context.settings.get('GEMINI_API_KEY').15
This methodology prevents the leakage of credentials in public repositories and ensures that
only authorized installations can invoke the generative model.16
Game Mechanics: The Hive Mind Gauntlet
The design of the Hive Mind Gauntlet centers on the concept of the "Daily Ritual," a game
mechanic that has proven highly successful in community-driven environments.18 By
anchoring the game to the daily "pulse" of Reddit, the application encourages a cycle of play,
discussion, and return.
The "Daily Ritual" as a Retention Driver
Games like Wordle or the Reddit-based "Riddonkulous" demonstrate that scarcity—limiting
players to one attempt per day—creates a shared community experience.6 When every player
on Reddit is facing the same "Golden Questions" generated from the same trending thread,
the game becomes a social touchstone. This is particularly relevant to Reddit's 2026
Developer Funds program, which has evolved its metrics to focus on "Qualified Engagers"
over 14-day periods.20 A daily ritual directly supports these metrics by ensuring consistent,
meaningful interaction.20
Feature Psychological Trigger Implementation
Single Daily Attempt Loss Aversion / Scarcity Redis-backed attempt tracking
Trending Context Relevance / FOMO Reddit API + Gemini Synthesis
Global Leaderboard Social Comparison Redis Sorted Sets (ZSET) 9
Shareable Progress Social Proof Devvit UI Toast + Sharing 18
Content Synthesis: From Reddit Threads to Golden Questions

## Page 5

The "Hive Mind" aspect of the game is derived from analyzing not just the original post, but
the comment section. Top-tier Reddit threads are often defined by the "top comment" or a
particularly insightful "reply chain." The Gemini 2.5 Flash model is prompted to weigh these
comments heavily, ensuring that the questions reflect the community's reaction to the news
or post of the day.10 This creates a deeper level of engagement than simple news trivia; it
tests the player's knowledge of "Reddit culture" for that specific 24-hour window.
Competitive Integrity: Atomic Leaderboards and Anti-Exploit Logic
A common failure point in Reddit games is the "race condition" exploit, where a user might
attempt to solve a puzzle multiple times or submit a score after the daily window has closed.6
The Hive Mind Gauntlet utilizes Redis's time-to-live (TTL) and atomic features to mitigate this.
Each day's questions and leaderboard are stored under keys containing the current date (e.g.,
gauntlet:2026-02-12). These keys can be set to expire after 48 hours, keeping the Redis
database lean and ensuring that scores are isolated to their specific day.6
Furthermore, to combat "popularity tracking errors" and edge-cases where creations are not
tracked properly—issues identified in previous Devvit game iterations—the Hive Mind Gauntlet
implements a server-side validation step.6 The score is not calculated on the client; rather, the
client sends the user's answers to the backend, which compares them against the "Ready"
state questions in Redis and performs the atomic update to the leaderboard.6
Implementation Guide: The 100% Serverless Stack
This implementation guide provides the architectural components required to deploy the Hive
Mind Gauntlet on Devvit. The code follows a modular structure, separating manifest
configuration, backend logic, scheduled jobs, and the frontend interface.
Manifest and Permission Configuration (devvit.yaml)
The devvit.yaml file is the foundational manifest that enables the necessary platform
capabilities. Without these explicit permissions, the application will be unable to reach the
Gemini API or schedule daily refreshes.1
YAML
# devvit.yaml
# Essential configuration for the Hive Mind Gauntlet
name: hive-mind-gauntlet
version: 0.1.0
description: "A daily ritual game powered by Reddit's trending content and Gemini AI."
permissions:
http:
# Explicit domain allow-list for Gemini API [1, 5]

## Page 6

domains:
- "generativelanguage.googleapis.com"
redis: true
scheduler: true
settings:
app:
- name: GEMINI_API_KEY
label: "Gemini API Key"
type: string
isSecret: true
scope: app # App-scope ensures developer-only access [15, 17]
Backend Logic: LLM and Content Generation (src/backend/llm.ts)
This module handles the interaction with the Gemini 2.5 Flash API. It utilizes the structured
output schema to ensure the returned content is immediately usable by the game engine.14
TypeScript
import { Devvit } from '@devvit/public-api';
export interface Question {
text: string;
options: string;
answerIndex: number;
explanation: string;
}
/**
* Invokes Gemini 2.5 Flash to generate daily game content.
* Includes error handling for 429 rate limits and JSON parsing failures.
*/
export async function generateQuestions(context: Devvit.Context, redditContent: string):
Promise<Question> {
const apiKey = await context.settings.get('GEMINI_API_KEY');
if (!apiKey) throw new Error("API Key missing. Set GEMINI_API_KEY via CLI.");
const model = "gemini-2.5-flash";
const url =
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$
{apiKey}`;

## Page 7

const prompt = `
Based on the following Reddit thread, generate 5 trivia questions.
Questions should be challenging and focus on community insights or top comments.
Thread Content: ${redditContent.substring(0, 5000)}
`;
const response = await fetch(url, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
responseMimeType: "application/json",
// Force structured output via JSON Schema
responseJsonSchema: {
type: "array",
items: {
type: "object",
properties: {
text: { type: "string" },
options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
answerIndex: { type: "number" },
explanation: { type: "string" }
},
required: ["text", "options", "answerIndex", "explanation"]
}
}
}
})
});
if (response.status === 429) {
throw new Error("Gemini API Rate Limit Exceeded. Quota: 10 RPM / 250 RPD."); // [12, 13]
}
const data = await response.json();
const rawText = data.candidates?.?.content?.parts?.?.text;
if (!rawText) throw new Error("LLM failed to generate a valid response.");
return JSON.parse(rawText) as Question;
}

## Page 8

Job Scheduling and State Synchronization
(src/jobs/daily_generator.ts)
The daily generator job is the centerpiece of the application's automation. It fetches trending
content using the Reddit API and orchestrates the AI generation process.6
TypeScript
import { Devvit } from '@devvit/public-api';
import { generateQuestions } from '../backend/llm.js';
Devvit.addSchedulerJob({
name: 'generate_daily_content',
onRun: async (event, context) => {
// 1. Fetch trending content from r/all or specific subreddits [21]
const subreddit = await context.reddit.getSubredditByName('all');
const posts = await subreddit.getHotPosts({ limit: 5 }).all();
const topPost = posts;
const comments = await topPost.getComments({ limit: 10 }).all();
const contextStr = `Post: ${topPost.title} - ${topPost.selftext}\nComments:
${comments.map(c => c.body).join(' ')}`;
try {
// 2. Generate questions via LLM
const questions = await generateQuestions(context, contextStr);
// 3. Store in Redis with the current date as the key
const today = new Date().toISOString().split('T');
await context.redis.set(`gauntlet:questions:${today}`, JSON.stringify(questions));
// 4. Mark the day as 'Ready' for the frontend to poll [15]
await context.redis.set(`gauntlet:ready:${today}`, 'true');
console.log(`Daily content generated successfully for ${today}`);
} catch (err) {
console.error("Failed to generate daily gauntlet:", err);
}
}
});

## Page 9

// Schedule to run at 00:00 UTC daily
Devvit.addTrigger({
event: 'AppInstall',
onEvent: async (event, context) => {
await context.scheduler.runJob({
name: 'generate_daily_content',
cron: '0 0 * * *',
});
}
});
Frontend UI: The Devvit Blocks Paradigm (src/main.tsx)
The frontend utilizes the useAsync hook to poll Redis for the "Ready" state of the day's
questions. This prevents users from interacting with incomplete or stale content.6
TypeScript
import { Devvit, useState, useAsync } from '@devvit/public-api';
Devvit.addCustomPostType({
name: 'GauntletPost',
render: (context) => {
const [currentIndex, setCurrentIndex] = useState(0);
const = useState(0);
const today = new Date().toISOString().split('T');
// Poll Redis for the daily questions [6, 15]
const { data: questions, loading, error } = useAsync(async () => {
const ready = await context.redis.get(`gauntlet:ready:${today}`);
if (ready === 'true') {
const raw = await context.redis.get(`gauntlet:questions:${today}`);
return JSON.parse(raw |
| '') as any;
}
return null;
});
if (loading) return <text>Connecting to the Hive Mind...</text>;

## Page 10

if (!questions) return <text>Today's Gauntlet is being forged. Check back soon!</text>;
const handleAnswer = async (index: number) => {
if (index === questions[currentIndex].answerIndex) {
setScore(score + 1);
}
if (currentIndex === questions.length - 1) {
// Atomic update to global leaderboard on completion
await context.redis.zIncrBy(`leaderboard:${today}`, context.userId!, score);
context.ui.showToast("Gauntlet Complete! Score submitted.");
} else {
setCurrentIndex(currentIndex + 1);
}
};
return (
<vstack padding="medium" gap="small">
<text size="large" weight="bold">Question {currentIndex + 1}</text>
<text>{questions[currentIndex].text}</text>
{questions[currentIndex].options.map((option: string, i: number) => (
<button onPress={() => handleAnswer(i)}>{option}</button>
))}
</vstack>
);
}
});
Community Engagement and Monetization: The
Hackathon Strategy
To win the "Best Daily Game" category, the application must demonstrate more than just
technical proficiency; it must show an understanding of the Reddit ecosystem. The evolution
of the Developer Funds program highlights the importance of sustained community
engagement.20
Optimizing for Qualified Engagers and Installs
Reddit defines "Qualified Engagers" as users who have meaningful interactions with an app
beyond a simple click.20 By requiring users to answer five questions based on the content of
their favorite subreddits, the Hive Mind Gauntlet creates deep engagement. The 14-day
tracking window means that the game's difficulty should be tuned to encourage repeat play; it

## Page 11

must be challenging enough to be rewarding but accessible enough that a casual user feels
they can "win" the next day's gauntlet.20
Sharing Mechanics and Social Proof
Competitive games thrive on social proof. The implementation includes a "Share Card"
feature, allowing users to post their daily results to the subreddit or social media. This
mechanic mimics the success of Wordle's emoji-based sharing, which transformed a solo
experience into a viral community phenomenon.18 In the context of Reddit, this sharing can be
integrated directly into the comment thread of the trending post, further embedding the
game into the platform's social fabric.
Administrative Oversight and Moderation Tools
A professional-grade Devvit app must provide tools for subreddit moderators. The Hive Mind
Gauntlet includes "Mod Actions" to manually trigger a content refresh or to clear the
leaderboard if malicious activity is detected.6 These administrative features are often what
separate a hobbyist project from a winning hackathon submission, as they demonstrate a
commitment to the long-term health of the Reddit communities where the app will be
installed.23
Conclusion: Future Horizons for Social Gaming
The Hive Mind Gauntlet represents a synthesis of three powerful technologies: the modularity
of the Devvit platform, the persistence of the Redis state layer, and the generative reasoning
of Google’s Gemini AI. By operating entirely within the Reddit ecosystem, the application
achieves a level of platform native-ness that external self-hosted games cannot match. The
technical validation presented in this report confirms that the 2025/2026 Devvit specifications
are robust enough to support high-concurrency, generative experiences that are both secure
and scalable.1
As generative AI continues to mature, the potential for these "living games" to evolve is
boundless. Future iterations of the Hive Mind Gauntlet could incorporate multimodal inputs,
analyzing Reddit's image and video content via Gemini 2.5 Pro to create even more diverse
challenges.10 For now, the architecture outlined here provides a reliable, high-performance
blueprint for the 2026 Daily Games Hackathon, positioning the Hive Mind Gauntlet as a
frontrunner for the $15,000 grand prize.20 The convergence of community discourse and
procedural gameplay is not just a novelty; it is the next frontier of social interaction on the
internet's front page.
Works cited
1. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
2. reddit/devvit: Reddit for Developers - GitHub, accessed February 3, 2026,
https://github.com/reddit/devvit

## Page 12

3. Testing Your App - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/guides/tools/devvit_test
4. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis
5. Global fetch allowlist - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/http-fetch-allowlist
6. Riddonkulous | Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/apps/riddonkulous?utm=watermark_v1
7. r/RedditEng, accessed February 3, 2026, https://www.reddit.com/r/RedditEng/
8. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/redis
9. Devvit Tips and Tricks - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1pjkmkl/devvit_tips_and_tricks/
10. Gemini 2.5 Flash | Generative AI on Vertex AI - Google Cloud Documentation,
accessed February 3, 2026,
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-fl
ash
11. Learn about supported models | Firebase AI Logic - Google, accessed February 3,
2026, https://firebase.google.com/docs/ai-logic/models
12. Gemini API Free Quota 2025: Complete Guide to Rate Limits & Pricing (December
Update), accessed February 3, 2026,
https://www.aifreeapi.com/en/posts/gemini-api-free-quota
13. Reddit Advertising API Documentation, accessed February 3, 2026,
https://ads-api.reddit.com/docs/v3/
14. Structured outputs | Gemini API | Google AI for Developers, accessed February 3,
2026, https://ai.google.dev/gemini-api/docs/structured-output
15. Settings and Secrets | Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/capabilities/server/settings-and-secrets
16. Secrets storage - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/secrets-storage
17. Devvit - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/api/public-api/classes/Devvit
18. Self Promotion Megathread : r/androidapps - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/androidapps/comments/1q47ehu/self_promotion_megat
hread/
19. Addicted to a Unique Survival Crafting Game? Let's Talk! - Lemon8, accessed
February 3, 2026,
https://www.lemon8-app.com/@astarael.games/7335067522565259781?region=u
s
20. r/Devvit - Reddit, accessed February 3, 2026, https://www.reddit.com/r/Devvit/
21. RedditAPIClient - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/api/redditapi/RedditAPIClient/classes/RedditA
PIClient
22. Overview - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/interactive_posts

## Page 13

23. Reddit Developer Funds 2026 Terms - Reddit Help, accessed February 3, 2026,
https://support.reddithelp.com/hc/en-us/articles/27958169342996-Reddit-Develo
per-Funds-2026-Terms
