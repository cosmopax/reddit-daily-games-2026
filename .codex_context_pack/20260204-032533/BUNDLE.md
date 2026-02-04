# Codex Context Pack (auto-generated)

- Root: `/Users/cosmopax/Desktop/projx/reddit_hackathon_games`
- Generated: `2026-02-04 03:25:34`
- File count: `68`



---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/AG_setup/Hackathon_Workspace_Setup_Prompt.md

# Hackathon Workspace Setup Prompt.pdf

## Page 1

Autonomous Architectures: Engineering
the Reddit Daily Games 2026 Workspace
on Google Antigravity
1. Strategic Analysis of the Computational Arena
The Reddit Daily Games 2026 Hackathon represents a pivotal moment in the evolution of
social gaming, shifting focus from transient, session-based experiences to persistent,
habit-forming engagement loops. With a substantial prize pool of $40,000 and a mandate to
leverage the Reddit Developer Platform (Devvit), the competition demands a rigorous
engineering approach that transcends traditional game development paradigms.1 The
challenge is not merely to design a game, but to engineer a distributed social engine capable
of operating within strict resource constraints while fostering community interaction.
To dominate this arena, we must deploy a development environment that mirrors the
complexity and autonomy of the target applications. This report details the architecture of a
Google Antigravity IDE workspace designed to serve as an autonomous "game factory." By
integrating Gemini 3 Pro’s "Deep Research" capabilities directly into the development
workflow, we transform the IDE from a passive editor into an active participant in the design
and engineering process.
1.1 The "Daily" Constraint: Engineering Retention
The hackathon's central theme—"Daily Games"—imposes a specific temporal architecture on
the software. Unlike standard "casual" games where the core loop operates in milliseconds
(frames per second), a daily game’s core loop operates on a 24-hour cycle.1 This necessitates
a fundamental shift in state management. The game state is not resident in memory; it is
persistent, evolving, and communal.
Technical analysis of the Devvit platform reveals that "Daily" mechanics rely heavily on
server-side scheduling rather than client-side simulation. The game must feature a global
reset or state mutation that occurs synchronously for all users, typically triggered by a cron
job.2 This global heartbeat drives the social feedback loop: users consume the daily content,
generate artifacts (scores, comments, memes), and then wait for the cycle to renew.

## Page 2

1.2 Platform Constraints: The "Hard Deck"
Success in this hackathon requires a precise understanding of the operational boundaries
defined by the Devvit runtime. The Antigravity agents must be programmed with these hard
constraints as inviolable rules to prevent the generation of theoretically sound but
operationally impossible code.
1.2.1 The 30-Second Execution Timeout
The Devvit serverless environment imposes a strict 30-second timeout on all server-side
operations.3 This constraint is critical for "Daily" games which often require processing large
datasets (e.g., calculating a global leaderboard or updating the state of a simulation based on
thousands of user inputs). A naive implementation that attempts to process all user data in a
single synchronous loop will inevitably time out and fail.
To mitigate this, we must employ a "Tick-Tock" processing pattern using the Scheduler. Rather
than a single monolithic update, the agent architecture must prioritize job fragmentation,
where large tasks are broken into smaller, idempotent chunks that can be processed
sequentially within the time limit.

## Page 3

1.2.2 The 500MB Redis Limit
Persistence is handled via Redis, but each app installation is capped at 500MB.4 For a
successful game with high user engagement, storing raw JSON objects for every user action
will rapidly exhaust this quota. The workspace must be configured to enforce high-efficiency
data serialization standards. Agents must utilize bit-packing and Protocol Buffers rather than
verbose string serialization for high-volume data.
1.2.3 Content Security Policy (CSP) & Networking
The Devvit WebView is locked down via CSP, preventing direct client-side fetch calls to
external APIs.3 This means the client is effectively "air-gapped" from the internet,
communicating only with the Devvit server. Any game requiring external data (e.g., stock
market data for a prediction game) must proxy these requests through the server-side
backend.
1.3 The Antigravity Paradigm: Agentic Orchestration
Traditional Integrated Development Environments (IDEs) are passive tools. Google Antigravity,
by contrast, introduces an agent-first paradigm where the IDE acts as an orchestrator of
autonomous tasks.5 For this project, we utilize Antigravity not just to write code, but to
manage the cognitive load of building four distinct games simultaneously.
The workspace is designed around the concept of "Context Saturation." Modern Large
Language Models (LLMs) like Gemini 3 Pro have massive context windows, but indiscriminate
loading of data leads to "context rot" and hallucinations.7 Our architecture uses Antigravity's
"Skills" and "Rules" to enforce a strategy of "Progressive Disclosure," where agents are only
exposed to the specific context required for their immediate task, retrieving deeper
knowledge from the "Deep Research" repository only when necessary.
2. The Antigravity Workspace Architecture
The proposed solution establishes a "Monorepo" structure managed by a master Antigravity
configuration. This approach maximizes code reuse, allowing shared libraries (e.g., a custom
Redis wrapper or Scheduler utility) to be developed once and deployed across all four game
prototypes.
2.1 Directory Structure and Ontology
The file system is the primary interface between the human architect and the AI agents. A
rigid, well-documented structure allows the agents to infer intent from location. The root
directory contains the orchestration layer, while the packages/ directory houses the specific
game implementations.
The .agent directory serves as the "brain" of the workspace. It contains the logic that governs
agent behavior, ensuring consistency and adherence to the platform's constraints.

## Page 4

Proposed Directory Tree:
/reddit-daily-games-2026/
├──.agent/ # Antigravity Brain
│ ├── rules/ # Passive constraints (The "Constitution")
│ ├── skills/ # Active tools (CLI commands, deployment)
│ ├── workflows/ # Multi-step macros (e.g., "Deploy All")
│ ├── knowledge/ # Ingested Deep Research artifacts
│ └── memory/ # Persistent agent state (decisions made)
├──.devvit/ # Devvit local config and auth
├── packages/
│ ├── shared/ # Common utilities (Redis, Scheduler, Math)
│ ├── game-01-imposter/ # "The Imposter's Daily" (Social Deduction)
│ ├── game-02-tycoon/ # "Subreddit Tycoon" (Incremental)
│ ├── game-03-physics/ # "Hexa-Physics" (Three.js Daily Puzzle)
│ └── game-04-market/ # "Karma Markets" (Data Viz/Prediction)
├── scripts/ # Automation scripts (setup, deploy, sync)
├── devvit.yaml # Root configuration
└── workspace.code-workspace # VS Code / Antigravity workspace config
2.2 Configuring "Deep Think" Agents
Antigravity supports different modes of operation. For architectural decisions and complex
logic implementation, we must configure the agents to use Gemini 3 Pro in "Deep Think" or
"Plan" mode.5 This mode forces the model to generate a "Plan Artifact"—a step-by-step
reasoning chain—before writing any code. This is essential for navigating the complex
asynchronous logic of the Scheduler and Redis interactions.
For simpler tasks, such as generating React components or CSS styles, the agents can act in
"Fast" mode to maximize throughput. The workspace configuration file (.agent/config.json)
should explicitly map file types to these modes.
Table 1: Agent Operation Modes Mapping
Task Domain File Pattern Recommended Mode Reasoning
Core Architecture **/shared/**/*.ts Plan / Deep Think Critical shared logic
requires rigorous error
handling and
constraint checking.
Game Logic **/server/**/*.ts Plan / Deep Think Server-side logic
involves Redis
transactions and
scheduling, prone to
race conditions.
UI Components **/webroot/**/*.tsx Fast Client-side view logic
is standard and
benefits from rapid

## Page 5

iteration.
Configuration **/*.json, **/*.yaml Fast Structured data
generation is a
low-complexity task.
Scripts scripts/*.py, Plan / Deep Think Automation scripts can
scripts/*.sh destroy the
environment if
incorrect; safety is
paramount.
2.3 The "Master System Prompt" Strategy
To initialize this complex environment, we utilize a "Master System Prompt." This is not merely
a chat input but a comprehensive instruction set that defines the agent's persona,
boundaries, and operational protocols. It serves as the "System Init" for the workspace.
Role: You are the Lead Architect for the "Reddit Daily Games 2026" initiative. You possess
expert-level knowledge of TypeScript, the React framework, the Reddit Devvit Platform, and
Redis data structure optimization.
Objective: Orchestrate the simultaneous development of 4 distinct Devvit applications within
a monorepo structure.
Core Directives:
1. Constraint Adherence: You must strictly adhere to the 30-second server timeout and
500MB storage limit. Never generate code that performs unbounded operations on
user data. Always implement error handling and retries for Redis interactions.
2. Shared Intelligence: Prioritize code reusability. Before implementing a utility (e.g., a
Redis leaderboard wrapper), check packages/shared/ to see if it exists. If not, create it
there first.
3. Deep Research Integration: Before designing any game mechanic, you must check
.agent/knowledge/ for relevant research artifacts. Use these insights to justify your
design choices in the code comments.
4. Test-Driven Development: Generate Vitest unit tests for all shared logic to ensure
stability across all four games.
Operational Protocol:
● For complex state logic (State Machines, Redis Schemas), utilize Plan Mode to outline
your approach before coding.
● For UI components, utilize Fast Mode to rapidly scaffold the visual layer.
3. Knowledge Ingestion: The Deep Research Pipeline
A key differentiator of this workspace is its ability to ingest and operationalize external
research. We establish a dedicated pipeline for transferring insights from Gemini 3 "Deep

## Page 6

Research" sessions directly into the Antigravity agent's working memory.
3.1 "Context Saturation" vs. "Progressive Disclosure"
Large codebases and extensive documentation can overwhelm even the most capable
models, leading to "context saturation" where the model loses focus on the immediate task.7
To combat this, we employ "Progressive Disclosure." The full corpus of research is not loaded
into the context window at all times. Instead, summarized "Knowledge Items" are stored in the
.agent/knowledge/ directory.
These items contain metadata (headers, tags) that allow the Antigravity agent to "discover"
the information when relevant. For example, when an agent is tasked with designing the
retention loop for the "Idler" game, it scans the knowledge base for "Retention," finds the
relevant report, and then loads the specific insights into its context.
3.2 The Research Artifact Schema
Agents operate most effectively on structured data. We define a strict JSON schema for
research outputs. Gemini 3 Deep Research instances are instructed to export their findings in
this format, ensuring seamless ingestion.
[Artifact: research_schema.json]
JSON
{
"$schema": "http://json-schema.org/draft-07/schema#",
"title": "Game Mechanics Research",
"type": "object",
"properties": {
"topic": { "type": "string", "description": "The specific domain of research (e.g., 'Daily
Retention Mechanics')." },
"analyzed_games": {
"type": "array",
"items": { "type": "string" },
"description": "List of reference titles analyzed."
},
"key_mechanics": {
"type": "array",
"items": {
"type": "object",
"properties": {
"name": { "type": "string" },
"description": { "type": "string" },
"retention_impact": { "type": "string", "enum": ["High", "Medium", "Low"] },

## Page 7

"technical_complexity": { "type": "string", "enum": ["Low", "Medium", "High"] }
}
}
},
"implementation_recommendations": {
"type": "array",
"items": { "type": "string" },
"description": "Actionable engineering steps for the Devvit platform."
}
}
}
3.3 The Ingestion Automation Script
To bridge the gap between the Gemini 3 output (often a file download) and the workspace, we
deploy a Python script, scripts/ingest_research.py. This script monitors a designated
downloads/ folder for new JSON reports. Upon detection, it performs the following
operations:
1. Validation: Checks the file against the research_schema.json.
2. Transformation: Converts the structured JSON into a Markdown file optimized for LLM
readability. It adds high-level summaries at the top and preserves the detailed data in a
structured appendix.
3. Placement: Moves the resulting Markdown file to .agent/knowledge/, ensuring it is
indexed by the Antigravity environment.
Snippet: Ingestion Logic (Python)
Python
import json
import os
def ingest_report(filepath):
with open(filepath, 'r') as f:
data = json.load(f)
# Create Markdown Header for Agent Discovery
md_content = f"""---
type: knowledge_artifact
topic: {data['topic']}
tags: {data['analyzed_games']}
---
# Research Insight: {data['topic']}

## Page 8

## Executive Summary
This artifact contains analysis of {len(data['analyzed_games'])} games, focusing on mechanics
that drive daily retention.
## Recommended Mechanics
"""
for mech in data['key_mechanics']:
md_content += f"- **{mech['name']}** (Impact: {mech['retention_impact']}):
{mech['description']}\n"
output_path = f".agent/knowledge/{data['topic'].replace(' ', '_').lower()}.md"
with open(output_path, 'w') as f:
f.write(md_content)
print(f"Ingested knowledge artifact: {output_path}")
4. Platform Constraints & Engineering Standards
The .agent/rules/ directory contains the "Constitution" of the workspace—a set of passive
constraints that are injected into the system prompt to govern behavior.8 These rules are not
suggestions; they are mandates designed to ensure compliance with the Devvit platform's
strict limitations.
4.1 Rule Set: devvit-constraints.md
This rule file is critical for preventing the generation of non-compliant code. It explicitly
forbids patterns that would cause runtime errors or policy violations.
Content of .agent/rules/devvit-constraints.md:
Description: Enforces Reddit Devvit platform constraints (Timeouts, Storage, CSP).
Globs: **/*.ts, **/*.tsx
1. No External Client Fetching:
● Constraint: The Content Security Policy (CSP) blocks all third-party requests from the
client-side (src/webroot or WebView).
● Mandate: NEVER use fetch() in client-side code to access external APIs. All external
data must be fetched server-side and passed to the client via
context.ui.webView.postMessage or initial properties.
2. Execution Timeout Protocol (30s):
● Constraint: Server-side operations must complete within 30 seconds.
● Mandate: Avoid unbounded while loops. For heavy data processing, utilize the
Scheduler to break tasks into smaller, sequential jobs. When using context.redis, always
await the result immediately; do not create "fire and forget" promises that may hang the

## Page 9

process.
3. Redis Storage Optimization (500MB):
● Constraint: Total storage is capped at 500MB per installation.
● Mandate:
○ Use zSet (Sorted Sets) for leaderboards as they are space-efficient.
○ Use HSet (Hashes) for structured user profiles.
○ Compress massive JSON objects (e.g., game save states) using a custom
bit-packing utility or Base64 encoding if they exceed 10KB.
4. Asset Management:
● Mandate: All static assets (images, models) must be located in the assets/ directory
and referenced via context.assets.getURL().
4.2 Rule Set: daily-game-patterns.md
This rule file codifies the design patterns specific to the "Daily Game" genre, ensuring that the
agents build mechanics that align with the hackathon's goals.
Content of .agent/rules/daily-game-patterns.md:
Description: Enforces "Daily Game" design patterns and social loops.
Globs: **/logic/*.ts, **/server/*.ts
1. The Scheduler is King:
● Mandate: Every game MUST have a recurring cron job defined in devvit.yaml (typically
0 0 * * * for Midnight UTC). This job is responsible for triggering the global state
mutation (e.g., generating the new puzzle, resetting the daily leaderboard).
2. Asynchronous State Hydration:
● Mandate: Game state is NOT held in memory between requests. It must be rehydrated
from Redis on every interaction. Implement "Optimistic UI" updates on the client to
ensure responsiveness, but validate all actions server-side against the Redis state.
3. Social Hooks:
● Mandate: Every "Win" state or daily completion must generate a text-based "Share"
string (similar to Wordle's emoji grid) that users can easily paste into the Reddit
comment section. This drives the viral loop.
5. Model Context Protocol (MCP) Infrastructure
To empower the Antigravity agents to perform tasks beyond simple text editing, we integrate
the Model Context Protocol (MCP).9 MCP servers act as "superpowers," allowing the agents to
interact with the local environment, run simulations, and process assets.
5.1 The GameSimulator MCP
Developing asynchronous multiplayer games is notoriously difficult because testing requires
simulating the interactions of hundreds of users. We instruct the agent to build a local Python
MCP server, scripts/mcp_simulator.py, that can simulate user traffic against the Devvit Redis

## Page 10

mock.
Functionality:
● simulate_traffic(game_id, user_count, duration): Spawns user_count lightweight
threads. Each thread acts as a user, performing random valid game actions (Move, Vote,
Guess) against the game's API.
● verify_integrity(game_id): Checks the Redis state to ensure no race conditions
occurred (e.g., negative vote counts, duplicate inventory items).
This tool allows the agent to "stress test" its own code. An agent can write a voting logic, then
immediately ask the Simulator: "Run 1000 votes in parallel and check if the total is correct."
5.2 The AssetOptimizer MCP
The 4MB payload limit for Devvit Web apps is a tight constraint for games using high-fidelity
assets. We deploy an AssetOptimizer MCP server using Node.js.
Functionality:
● optimize_assets(directory): Scans the target directory for images and audio. It uses
ffmpeg and imagemagick to compress these assets (e.g., converting PNG to WebP,
reducing audio bitrate) to ensure the total bundle size remains compliant.
Configuration (.agent/mcp.json):
JSON
{
"mcpServers": {
"simulator": {
"command": "python",
"args": ["scripts/mcp_simulator.py"]
},
"assets": {
"command": "node",
"args": ["scripts/mcp_assets.js"]
}
}
}
6. Game Design & Architecture Specifications
The workspace is configured to support the simultaneous development of four distinct games,
each exploring a different facet of the "Daily" mechanic. The Master Prompt pre-seeds the
agents with high-level architectures for these titles.

## Page 11

6.1 Game 1: "The Imposter's Daily" (Social Deduction)
● Concept: A massive-multiplayer daily "Werewolf" game. Each day, the subreddit is
presented with a scenario and must vote to eliminate one "Imposter" (who may be an AI
agent or a randomly selected user).
● Technical Architecture:
○ Frontend: React. Simple, responsive UI for reading the daily "evidence" and
casting a vote.
○ Backend: Redis HINCRBY is essential here. We cannot store a record for every
vote. Instead, we increment counters for each suspect.
○ AI Integration: A Gemini 3 instance generates the "Imposter's Dialogue" daily,
ensuring it sounds plausible but contains subtle clues.
● Key Challenge: Aggregating thousands of votes instantly.

## Page 12

● Solution: Atomic Redis counters.
6.2 Game 2: "Subreddit Tycoon" (Incremental/Idler)
● Concept: The entire subreddit collaborates to build a virtual city. Comments generate
resources (Wood, Stone); Upvotes increase efficiency.
● Technical Architecture:
○ Frontend: Phaser. An isometric view of the growing city.
○ Backend: High write volume is the risk. We implement a "Write-Behind" buffer in
the shared library. Stats accumulate in the short-lived process memory and are
flushed to Redis only every 5 seconds or upon termination.
● Key Challenge: Preventing Redis throttling due to excessive writes.
● Solution: Buffering and batching updates using redis.mSet.
6.3 Game 3: "Hexa-Physics" (Daily Puzzle)
● Concept: A 3D physics puzzle where users must stack hexagonal blocks to reach a
target height without toppling. The wind speed and block friction change daily.
● Technical Architecture:
○ Frontend: Three.js + Cannon.js (Physics Engine).
○ Backend: The server is lightweight. It simply validates the "Solution Input"
(coordinates of placed blocks) to ensure no cheating.
● Key Challenge: Deterministic physics. The client-side simulation must match the
server-side validation.
● Solution: We run the physics simulation strictly on the client for the visual. For
verification, the server runs a headless version of Cannon.js using the exact same seed.
6.4 Game 4: "Karma Markets" (Prediction)
● Concept: A prediction market where users bet fake currency on which Reddit posts will
reach r/all in the next 24 hours.
● Technical Architecture:
○ Frontend: React + Recharts. Visualization of "stock" price history.
○ Backend: Heavily reliant on the Scheduler. A job runs every hour to fetch the
current upvote count of tracked posts via the Reddit API, updating their "price" in
Redis.
● Key Challenge: Tracking thousands of posts within the 30s timeout.
● Solution: The "Time-Slicing" pattern. The update job processes 50 posts, saves a
cursor (index), and immediately schedules a follow-up job to process the next 50,
continuing until the list is complete.
7. Execution & Deployment Strategy
This section provides the actionable scripts and prompts to instantiate this architecture.

## Page 13

7.1 The Setup Script (setup_workspace.sh)
This shell script is the physical manifestation of the architecture. It creates the directory
structure and seeds the configuration files, preparing the environment for the Antigravity
agent.
Bash
#!/bin/bash
# Reddit Daily Games 2026 - Workspace Scaffolder
echo "Initializing Antigravity Workspace..."
# 1. Create Directory Structure
mkdir -p.agent/{rules,skills,workflows,knowledge}
mkdir -p
packages/{shared,game-01-imposter,game-02-tycoon,game-03-physics,game-04-market}
mkdir -p scripts
# 2. Generate Rules (The Constitution)
# Rule: Devvit Constraints
cat <<EOF >.agent/rules/devvit_constraints.md
---
description: Critical Devvit Platform Constraints
globs: ["**/*.ts", "**/*.tsx"]
---
# Constraints
1. Max execution: 30s
2. Max Redis: 500MB
3. No eval() or dynamic code generation.
EOF
# Rule: Daily Mechanics
cat <<EOF >.agent/rules/daily_mechanics.md
---
description: Daily Game Design Principles
globs: ["**/logic/*.ts"]
---
# Daily Design
1. Global Reset at 00:00 UTC.
2. State is persistent (Redis), not memory-resident.
3. Every session ends with a "Share" artifact.

## Page 14

EOF
# 3. Initialize Shared Package
cd packages/shared
npm init -y
npm install @devvit/public-api @devvit/redis
# (Mocking a shared Redis wrapper creation here...)
cd../..
echo "Workspace Ready. Launch Antigravity and import this folder."
7.2 The Master Prompt
This prompt is the "Ignition Key." It is designed to be pasted into the Antigravity IDE's chat
interface. It activates the agent, assigns it the persona of a Lead Architect, and instructs it to
begin the scaffolding process based on the rules and knowledge we have prepared.
@Gemini 3 Pro
ACT as a Principal Game Architect and Lead DevOps Engineer.
I am initializing the "Reddit Daily Games 2026" workspace. We are building 4 games
simultaneously in a monorepo structure.
CONTEXT:
● Platform: Reddit Devvit (Node.js runtime, Redis persistence, React/Phaser/Three.js
frontend).
● Constraints: 30s server timeout, 500MB storage, CSP restricted client.
● Goal: Win the "Best Daily Game" category ($15k prize).
YOUR MISSION:
1. INGESTION: Scan the .agent/knowledge/ folder. I have deposited Deep Research
reports on "Viral Retention Mechanics". Summarize these into a design_principles.md
file in the root.
2. ARCHITECTURE: Create a shared library in packages/shared/ containing:
○ A RedisLeaderboard class (using ZSETs).
○ A DailyScheduler wrapper (cron handling).
○ A BitPacker utility (for compressing game state).
3. SCAFFOLDING: Generate the boilerplate for 4 apps in packages/:
○ game-01: "Imposter" (Social Deduction) - Template: React.
○ game-02: "Tycoon" (Idler) - Template: Phaser.
○ game-03: "Physics" (Puzzle) - Template: Three.js.
○ game-04: "Prediction" (Market) - Template: React + Recharts.
4. CONFIGURATION: Set up a .code-workspace file that defines unique ports for each
game's local dev server.
EXECUTION MODE:
● Use "Plan Mode" for the Shared Library architecture to ensure type safety and error

## Page 15

handling.
● Use "Fast Mode" for the UI boilerplate generation.
START NOW.
8. Conclusion and Future Outlook
This report outlines a comprehensive engineering strategy for the Reddit Daily Games 2026
Hackathon. By leveraging the Google Antigravity IDE not just as a code editor but as an
agentic orchestration platform, we effectively multiply the output of the human developer. The
architecture explicitly addresses the core challenges of the "Daily" format—retention, global
state synchronization, and platform resource constraints—transforming them from obstacles
into design features. The integration of Deep Research ensures that every line of code is
informed by analyzing successful retention mechanics, positioning the final submissions to be
not just functional, but competitively superior.
Works cited
1. Announcing our Daily Games themed virtual hackathon! : r/Devvit, accessed
February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1qdnhj5/announcing_our_daily_game
s_themed_virtual/
2. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler
3. Devvit Web - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview
4. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/redis
5. Getting Started with Google Antigravity, accessed February 3, 2026,
https://codelabs.developers.google.com/getting-started-google-antigravity
6. Build with Google Antigravity, our new agentic development platform, accessed
February 3, 2026,
https://developers.googleblog.com/build-with-google-antigravity-our-new-agen
tic-development-platform/
7. Tutorial : Getting Started with Google Antigravity Skills - Medium, accessed
February 3, 2026,
https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills
-864041811e0d
8. Rules / Workflows - Google Antigravity Documentation, accessed February 3,
2026, https://antigravity.google/docs/rules-workflows
9. The MCP Server Stack: 10 Open-Source Essentials for 2026 | by TechLatest.Net |
Dec, 2025 | Towards Dev, accessed February 3, 2026,
https://medium.com/towardsdev/the-mcp-server-stack-10-open-source-essenti
als-for-2026-cb13f080ca5c


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/AG_setup/Hackathon_Workspace_Setup_Prompt_improved.md

# Hackathon Workspace Setup Prompt_improved.pdf

## Page 1

Autonomous Architectures: Engineering
the Reddit Daily Games 2026 Workspace
on Google Antigravity
1. Strategic Analysis of the Computational Arena
The Reddit Daily Games 2026 Hackathon represents a pivotal moment in the evolution of
social gaming, shifting focus from transient, session-based experiences to persistent,
habit-forming engagement loops. With a substantial prize pool of $40,000 and a mandate to
leverage the Reddit Developer Platform (Devvit), the competition demands a rigorous
engineering approach that transcends traditional game development paradigms.1 The
challenge is not merely to design a game, but to engineer a distributed social engine capable
of operating within strict resource constraints while fostering community interaction. To
dominate this arena, we must deploy a development environment that mirrors the complexity
and autonomy of the target applications.
This report details the architecture of a Google Antigravity IDE workspace designed to serve
as an autonomous "game factory".3 By integrating Gemini 3 Pro's "Deep Research"
capabilities directly into the development workflow, we transform the IDE from a passive
editor into an active participant in the design and engineering process.4 The hackathon's
central theme—"Daily Games"—imposes a specific temporal architecture on the software.
Unlike standard "casual" games where the core loop operates in milliseconds (frames per
second), a daily game's core loop operates on a 24-hour cycle. This necessitates a
fundamental shift in state management. The game state is not resident in memory; it is
persistent, evolving, and communal.3
The Antigravity workspace is not merely a collection of files but a dynamic, agentic
ecosystem. It is configured to support the simultaneous development of four distinct titles,
each stressing a different vector of the Devvit platform:
1. 'Get Rich Fast': A serverless strategy game that tests the limits of atomic state
mutations and write-heavy loads.
2. 'The Hive Mind Gauntlet': A daily trivia engine that demands robust external data
ingestion and precise global synchronization.
3. 'Meme-Wars: GenAI Edition': A multiplayer captioning arena that necessitates
asynchronous asset generation and storage optimization.
4. 'Duel of Minds': An AI-driven trivia battler requiring low-latency inference and stateful
conversational context.

## Page 2

1.1 The "Daily" Constraint: Engineering Retention
The concept of a "Daily Game" is deceptively simple but architecturally demanding. Technical
analysis of the Devvit platform reveals that "Daily" mechanics rely heavily on server-side
scheduling rather than client-side simulation. The game must feature a global reset or state
mutation that occurs synchronously for all users, typically triggered by a cron job.5 This global
heartbeat drives the social feedback loop: users consume the daily content, generate
artifacts (scores, comments, memes), and then wait for the cycle to renew.
This "Global Heartbeat" architecture requires the Antigravity agents to prioritize job
fragmentation. A naive implementation that attempts to process all user data in a single
synchronous loop at midnight will inevitably time out and fail due to the Devvit platform's
30-second execution limit.6 Instead, the architecture must employ a "Tick-Tock" processing
pattern using the Scheduler, breaking large tasks into smaller, idempotent chunks that can be
processed sequentially.
1.2 Platform Constraints: The "Hard Deck"
Success in this hackathon requires a precise understanding of the operational boundaries
defined by the Devvit runtime. The Antigravity agents must be programmed with these hard

## Page 3

constraints as inviolable rules to prevent the generation of theoretically sound but
operationally impossible code.3
1.2.1 The 30-Second Execution Timeout
The Devvit serverless environment imposes a strict 30-second timeout on all server-side
operations.6 This constraint is critical for games like "Get Rich Fast" which often require
processing large datasets (e.g., calculating a global leaderboard or updating the state of a
simulation based on thousands of user inputs). The workspace must be configured to enforce
asynchronous patterns. Any operation expected to exceed 500ms should be offloaded to a
background job or broken into micro-transactions.
1.2.2 The 500MB Redis Limit
Persistence is handled via Redis, but each app installation is capped at 500MB.7 For a
successful game with high user engagement (e.g., 100,000 daily active users), storing raw
JSON objects for every user action will rapidly exhaust this quota. The workspace must be
configured to enforce high-efficiency data serialization standards. Agents must utilize
bit-packing and Protocol Buffers rather than verbose string serialization for high-volume data.
A user's inventory in "Get Rich Fast" should not be { "gold": 100, "wood": 50 } (consuming ~25
bytes) but rather a packed integer or byte array (consuming ~4 bytes).
1.2.3 Content Security Policy (CSP) & Networking
The Devvit WebView is locked down via CSP, preventing direct client-side fetch calls to
external APIs.8 This means the client is effectively "air-gapped" from the internet,
communicating only with the Devvit server. Any game requiring external data—such as "The
Hive Mind Gauntlet" fetching Wikipedia trends or "Meme-Wars" calling the Flux.1 API—must
proxy these requests through the server-side backend using the http-fetch capability, which
itself requires a whitelist approval process.10
2. The Antigravity Workspace Architecture
The proposed solution establishes a "Monorepo" structure managed by a master Antigravity
configuration. This approach maximizes code reuse, allowing shared libraries (e.g., a custom
Redis wrapper or Scheduler utility) to be developed once and deployed across all four game
prototypes.
2.1 Directory Structure and Ontology
The file system is the primary interface between the human architect and the AI agents. A
rigid, well-documented structure allows the agents to infer intent from location.3 The root
directory contains the orchestration layer, while the packages/ directory houses the specific
game implementations. The .agent directory serves as the "brain" of the workspace,
containing the logic that governs agent behavior, ensuring consistency and adherence to the
platform's constraints.
Proposed Directory Tree:

## Page 4

/reddit-daily-games-2026/
├──.agent/ # Antigravity Brain
│ ├── rules/ # Passive constraints (The "Constitution")
│ ├── skills/ # Active tools (CLI commands, deployment)
│ ├── workflows/ # Multi-step macros (e.g., "Deploy All")
│ ├── knowledge/ # Ingested Deep Research artifacts
│ └── memory/ # Persistent agent state (decisions made)
├──.devvit/ # Devvit local config and auth
├── packages/
│ ├── shared/ # Common utilities (The "Kernel")
│ │ ├── redis/ # Bit-packing and caching logic
│ │ └── scheduler/ # Cron abstractions
│ ├── game-01-strategy/ # "Get Rich Fast" (Serverless Strategy)
│ ├── game-02-trivia/ # "The Hive Mind Gauntlet" (Daily Trivia)
│ ├── game-03-meme/ # "Meme-Wars: GenAI Edition" (Multiplayer Captioning)
│ └── game-04-duel/ # "Duel of Minds" (AI Trivia)
├── scripts/ # Automation scripts (setup, deploy, sync)
├── devvit.yaml # Root configuration
└── workspace.code-workspace # VS Code / Antigravity workspace config
2.2 Configuring "Deep Think" Agents
Antigravity supports different modes of operation. For architectural decisions and complex
logic implementation, we must configure the agents to use Gemini 3 Pro in "Deep Think" or
"Plan" mode.12 This mode forces the model to generate a "Plan Artifact"—a step-by-step
reasoning chain—before writing any code. This is essential for navigating the complex
asynchronous logic of the Scheduler and Redis interactions where race conditions are a high
risk.
For simpler tasks, such as generating React components or CSS styles, the agents can act in
"Fast" mode to maximize throughput. The workspace configuration file (.agent/config.json)
should explicitly map file types to these modes to optimize the consumption of inference
credits and developer time.
Table 1: Agent Operation Modes Mapping
Task Domain File Pattern Recommended Mode Reasoning
Core Architecture **/shared/**/*.ts Plan / Deep Think Critical shared logic
requires rigorous error
handling and
constraint checking. A
bug here propagates
to all 4 games.
Game Logic **/server/**/*.ts Plan / Deep Think Server-side logic
involves Redis
transactions and

## Page 5

scheduling, prone to
race conditions and
timeouts.
UI Components **/webroot/**/*.tsx Fast Client-side view logic
is standard React and
benefits from rapid
iteration.
Configuration **/*.json, **/*.yaml Fast Structured data
generation is a
low-complexity task.
Scripts scripts/*.py, Plan / Deep Think Automation scripts can
scripts/*.sh destroy the
environment if
incorrect; safety is
paramount.
2.3 The "Master System Prompt" Strategy
To initialize this complex environment, we utilize a "Master System Prompt." This is not merely
a chat input but a comprehensive instruction set that defines the agent's persona,
boundaries, and operational protocols. It serves as the "System Init" for the workspace,
ensuring that every subsequent interaction is grounded in the project's specific context.
Role: You are the Principal Game Architect and Lead DevOps Engineer for the "Reddit
Daily Games 2026" initiative. You possess expert-level knowledge of TypeScript, the React
framework, the Reddit Devvit Platform (specifically version 0.11+), and Redis data structure
optimization.
Objective: Orchestrate the simultaneous development of 4 distinct Devvit applications within
a monorepo structure. Your goal is to win the "Best Daily Game" category ($15k prize).
Core Directives (The Constitution):
1. Constraint Adherence: You must strictly adhere to the 30-second server timeout and
500MB storage limit. Never generate code that performs unbounded operations on
user data. Always implement error handling and retries for Redis interactions.
2. Shared Intelligence: Prioritize code reusability. Before implementing a utility (e.g., a
Redis leaderboard wrapper), check packages/shared/ to see if it exists. If not, create it
there first.
3. Deep Research Integration: Before designing any game mechanic, you must check
.agent/knowledge/ for relevant research artifacts. Use these insights to justify your
design choices in the code comments.
4. Test-Driven Development: Generate Vitest unit tests for all shared logic to ensure
stability across all four games.
5. Client Isolation: NEVER attempt fetch() from the client-side code (webroot). All
external API calls must be proxied via the Server using devvit.http.

## Page 6

Operational Protocol:
● For complex state logic (State Machines, Redis Schemas), utilize Plan Mode to outline
your approach before coding.
● For UI components, utilize Fast Mode to rapidly scaffold the visual layer.
● For any automation script (Python/Bash), verify functionality with a "dry run" logic
before execution.
3. Knowledge Ingestion: The Deep Research Pipeline
A key differentiator of this workspace is its ability to ingest and operationalize external
research. We establish a dedicated pipeline for transferring insights from Gemini 3 "Deep
Research" sessions directly into the Antigravity agent's working memory.3
3.1 "Context Saturation" vs. "Progressive Disclosure"
Large codebases and extensive documentation can overwhelm even the most capable
models, leading to "context saturation" where the model loses focus on the immediate task.
To combat this, we employ "Progressive Disclosure." The full corpus of research is not loaded
into the context window at all times. Instead, summarized "Knowledge Items" are stored in the
.agent/knowledge/ directory.14 These items contain metadata (headers, tags) that allow the
Antigravity agent to "discover" the information when relevant. For example, when an agent is
tasked with designing the retention loop for "Get Rich Fast," it scans the knowledge base for
"Retention," finds the relevant report, and then loads the specific insights into its context.
3.2 The Research Artifact Schema
Agents operate most effectively on structured data. We define a strict JSON schema for
research outputs. Gemini 3 Deep Research instances are instructed to export their findings in
this format, ensuring seamless ingestion.
Artifact: research_schema.json
JSON
{
"$schema": "http://json-schema.org/draft-07/schema#",
"title": "Game Mechanics Research",
"type": "object",
"properties": {
"topic": { "type": "string", "description": "The specific domain of research (e.g., 'Daily
Retention Mechanics')." },
"analyzed_games": {
"type": "array",

## Page 7

"items": { "type": "string" },
"description": "List of reference titles analyzed."
},
"key_mechanics": {
"type": "array",
"items": {
"type": "object",
"properties": {
"name": { "type": "string" },
"description": { "type": "string" },
"retention_impact": { "type": "string", "enum": ["High", "Medium", "Low"] },
"technical_complexity": { "type": "string", "enum": ["Low", "Medium", "High"] }
}
}
},
"implementation_recommendations": {
"type": "array",
"items": { "type": "string" },
"description": "Actionable engineering steps for the Devvit platform."
}
}
}
3.3 The Ingestion Automation Script
To bridge the gap between the Gemini 3 output (often a file download) and the workspace, we
deploy a Python script, scripts/ingest_research.py. This script monitors a designated
downloads/ folder for new JSON reports. Upon detection, it performs validation against the
schema, transforms the structured JSON into a Markdown file optimized for LLM readability,
and moves the resulting file to .agent/knowledge/.3
Snippet: Ingestion Logic (Python)
Python
import json
import os
from pathlib import Path
KNOWLEDGE_DIR = Path(".agent/knowledge")
def ingest_report(filepath):
with open(filepath, 'r') as f:

## Page 8

data = json.load(f)
# Create Markdown Header for Agent Discovery
md_content = f"""---
type: knowledge_artifact
topic: {data['topic']}
tags: {data['analyzed_games']}
---
# Research Insight: {data['topic']}
## Executive Summary
This artifact contains analysis of {len(data['analyzed_games'])} games, focusing on mechanics
that drive daily retention.
## Recommended Mechanics
"""
for mech in data['key_mechanics']:
md_content += f"- **{mech['name']}** (Impact: {mech['retention_impact']}):
{mech['description']}\n"
output_path = KNOWLEDGE_DIR / f"{data['topic'].replace(' ', '_').lower()}.md"
with open(output_path, 'w') as f:
f.write(md_content)
print(f"Ingested knowledge artifact: {output_path}")
if __name__ == "__main__":
# Logic to watch directory would go here
pass
4. Platform Constraints & Engineering Standards
The .agent/rules/ directory contains the "Constitution" of the workspace—a set of passive
constraints that are injected into the system prompt to govern behavior. These rules are not
suggestions; they are mandates designed to ensure compliance with the Devvit platform's
strict limitations.15
4.1 Rule Set: devvit-constraints.md
This rule file is critical for preventing the generation of non-compliant code. It explicitly
forbids patterns that would cause runtime errors or policy violations.
Content of .agent/rules/devvit-constraints.md:
● Description: Enforces Reddit Devvit platform constraints (Timeouts, Storage, CSP).
● Globs: **/*.ts, **/*.tsx

## Page 9

1. No External Client Fetching:
○ Constraint: The Content Security Policy (CSP) blocks all third-party requests
from the client-side (src/webroot or WebView).
○ Mandate: NEVER use fetch() in client-side code to access external APIs. All
external data must be fetched server-side and passed to the client via
context.ui.webView.postMessage or initial properties.
2. Execution Timeout Protocol (30s):
○ Constraint: Server-side operations must complete within 30 seconds.6
○ Mandate: Avoid unbounded while loops. For heavy data processing, utilize the
Scheduler to break tasks into smaller, sequential jobs. When using context.redis,
always await the result immediately; do not create "fire and forget" promises that
may hang the process.
3. Redis Storage Optimization (500MB):
○ Constraint: Total storage is capped at 500MB per installation.7
○ Mandate:
■ Use zSet (Sorted Sets) for leaderboards as they are space-efficient.
■ Use HSet (Hashes) for structured user profiles.
■ Compress massive JSON objects (e.g., game save states) using a custom
bit-packing utility or Base64 encoding if they exceed 10KB.
4. Asset Management:
○ Mandate: All static assets (images, models) must be located in the assets/
directory and referenced via context.assets.getURL().
4.2 Rule Set: daily-game-patterns.md
This rule file codifies the design patterns specific to the "Daily Game" genre, ensuring that the
agents build mechanics that align with the hackathon's goals.
Content of .agent/rules/daily-game-patterns.md:
● Description: Enforces "Daily Game" design patterns and social loops.
● Globs: **/logic/*.ts, **/server/*.ts
1. The Scheduler is King:
○ Mandate: Every game MUST have a recurring cron job defined in devvit.yaml
(typically 0 0 * * * for Midnight UTC). This job is responsible for triggering the
global state mutation (e.g., generating the new puzzle, resetting the daily
leaderboard).
2. Asynchronous State Hydration:
○ Mandate: Game state is NOT held in memory between requests. It must be
rehydrated from Redis on every interaction. Implement "Optimistic UI" updates on
the client to ensure responsiveness, but validate all actions server-side against
the Redis state.
3. Social Hooks:
○ Mandate: Every "Win" state or daily completion must generate a text-based
"Share" string (similar to Wordle's emoji grid) that users can easily paste into the

## Page 10

Reddit comment section. This drives the viral loop.
5. Model Context Protocol (MCP) Infrastructure
To empower the Antigravity agents to perform tasks beyond simple text editing, we integrate
the Model Context Protocol (MCP).16 MCP servers act as "superpowers," allowing the agents
to interact with the local environment, run simulations, and process assets without leaving the
IDE context.
5.1 The GameSimulator MCP
Developing asynchronous multiplayer games is notoriously difficult because testing requires
simulating the interactions of hundreds of users. We instruct the agent to build a local Python
MCP server, scripts/mcp_simulator.py, that can simulate user traffic against a Devvit Redis
mock.
Functionality:
● simulate_traffic(game_id, user_count, duration): Spawns user_count lightweight threads.
Each thread acts as a user, performing random valid game actions (Move, Vote, Guess)

## Page 11

against the game's API.
● verify_integrity(game_id): Checks the Redis state to ensure no race conditions occurred
(e.g., negative vote counts, duplicate inventory items).
This tool allows the agent to "stress test" its own code. An agent can write a voting logic
function and then immediately ask the Simulator: "Run 1000 votes in parallel and check if the
total is correct." This rapid feedback loop is invaluable for detecting concurrency bugs before
deployment.
5.2 The AssetOptimizer MCP
The 4MB payload limit for Devvit Web apps is a tight constraint for games using high-fidelity
assets like "Meme-Wars" or "Duel of Minds." We deploy an AssetOptimizer MCP server using
Node.js.
Functionality:
● optimize_assets(directory): Scans the target directory for images and audio. It uses
ffmpeg and imagemagick to compress these assets (e.g., converting PNG to WebP,
reducing audio bitrate) to ensure the total bundle size remains compliant.
Configuration (.agent/mcp.json):
JSON
{
"mcpServers": {
"simulator": {
"command": "python",
"args": ["scripts/mcp_simulator.py"]
},
"assets": {
"command": "node",
"args": ["scripts/mcp_assets.js"]
}
}
}
6. Game Design & Architecture Specifications
The workspace is configured to support the simultaneous development of four distinct games,
each exploring a different facet of the "Daily" mechanic. The Master Prompt pre-seeds the
agents with high-level architectures for these titles.

## Page 12

6.1 Game 1: "Get Rich Fast" (Serverless Strategy)
Concept: A massive-multiplayer incremental strategy game where users manage a virtual
startup. The goal is to maximize net worth before the daily market crash.
Technical Challenge: High write volume to Redis. Counters for "cash," "stock," and
"inventory" must be incremented constantly.
Solution: Write-Behind Buffering.
● Architecture:
○ Frontend: React. Simple, responsive dashboard.
○ Backend: State is held in ephemeral memory during the short execution window
of a request. A beforeExit hook or explicit flush function aggregates changes and
writes to Redis in a single HINCRBY command rather than multiple calls.
○ Bit-Packing: Resources are packed into a single 64-bit integer or a binary buffer
to minimize Redis footprint.
○ Scheduler: A cron job runs every hour to calculate "Passive Income" for all offline
users. Since iterating through all users would timeout, the user list is sharded, and
the job processes one shard at a time, rescheduling itself for the next shard if
time permits.

## Page 13

6.2 Game 2: "The Hive Mind Gauntlet" (Daily Trivia via Trends)
Concept: Users guess the top trending topic of the day. The answer is derived from
real-world data (e.g., Wikipedia pageviews or Google Trends).
Technical Challenge: External Data Ingestion & Daily Synchronization.
Solution: The Proxy & Scheduler Pattern.
● Architecture:
○ Trend Fetching: Uses devvit.http (whitelist required) to fetch trends from a
compliant API. Since Reddit's API might be restricted for certain uses, a proxy or a
benign public API (like Wikipedia Trends) is used.9
○ The Daily Reset: At 00:00 UTC, a Scheduler job performs a sequence of atomic
operations:
1. Fetches the new trend string.
2. Locks the previous day's leaderboard and archives it to a ZSET.
3. Resets the active game state key.
○ Latency: Since trends change daily, not secondly, aggressive caching (TTL 24h) is
used to prevent hitting the external API rate limits.
6.3 Game 3: "Meme-Wars: GenAI Edition" (Multiplayer Captioning)
Concept: Players submit captions for an AI-generated image; the community votes, and the
best caption becomes the permanent title.
Technical Challenge: Image Generation Latency & Storage Limits.
Solution: Async Flux.1 Integration & Ephemeral Storage.
● Architecture:
○ Generation: We utilize Flux.1 [schnell] via an external API provider (e.g., Fal.ai or
Replicate) due to its high speed (~1.5s per image).18 Given the 30s timeout, a
synchronous call is feasible, but an asynchronous webhook pattern is safer if
supported by Devvit.
○ Storage: Storing generated images in Redis is impossible due to the 500MB limit.
Instead, we store the external hosting URL provided by the GenAI API and store
only the URL string in Redis.
○ Voting: Real-time voting is handled using Devvit's realtime API. However, because
realtime is limited to 100 messages/second 19, we implement client-side distinct
counting and batch updates to the server to avoid throttling.
6.4 Game 4: "Duel of Minds" (AI Trivia)
Concept: A 1v1 trivia battle where a user competes against an AI persona.
Technical Challenge: Latency & Token Costs.
Solution: Gemini 2.0 Flash Streaming.
● Architecture:
○ Model: Gemini 2.0 Flash is selected specifically for its sub-0.5s latency and low
cost.20 This ensures the "real-time" feel of a duel.

## Page 14

○ Context Management: The game maintains a "rolling context window" in Redis
(last 5 turns only) to minimize token costs and storage.
○ Prompt Engineering: A "Game Master" system prompt is baked into the server
code, instructing Gemini to generate questions in strict JSON format for easy
parsing by the client.
7. Execution & Deployment Strategy
This section provides the actionable scripts and prompts to instantiate this architecture.
7.1 The Setup Script (setup_workspace.sh)
This shell script is the physical manifestation of the architecture. It creates the directory
structure and seeds the configuration files, preparing the environment for the Antigravity
agent.
Bash
#!/bin/bash
# Reddit Daily Games 2026 - Workspace Scaffolder
# Constraint: Devvit CLI must be installed globally.
echo "Initializing Antigravity Workspace..."
# 1. Create Directory Structure
mkdir -p.agent/{rules,skills,workflows,knowledge,memory}
mkdir -p
packages/{shared,game-01-strategy,game-02-trivia,game-03-meme,game-04-duel}
mkdir -p scripts
# 2. Generate 'The Constitution' (Rules)
cat <<EOF >.agent/rules/devvit_constraints.md
description: Critical Devvit Platform Constraints
globs: ["**/*.ts", "**/*.tsx"]
rules:
- constraint: "Max Execution Time 30s"
mandate: "Avoid unbounded loops. Use Scheduler for batch processing."
- constraint: "Max Redis 500MB"
mandate: "Use bit-packing. Prefer ZSET/HSET. No verbose JSON."
- constraint: "No Client Fetch"
mandate: "All external APIs must be proxied via Server."
EOF

## Page 15

# 3. Initialize Shared Package (The Kernel)
cd packages/shared
npm init -y
npm install @devvit/public-api @devvit/redis
# Create stub for RedisWrapper
mkdir src
touch src/RedisWrapper.ts
echo "export class RedisWrapper { /* Optimization Logic Here */ }" > src/RedisWrapper.ts
cd../..
echo "Workspace Ready. Import this folder into Google Antigravity."
8.2 The "Deploy All" Workflow
Antigravity allows defining workflows. We create a macro to deploy all 4 games sequentially,
handling the auth tokens for each.
File: .agent/workflows/deploy_fleet.yaml
YAML
name: Deploy Game Fleet
description: Deploys all 4 games to their respective subreddits.
steps:
- name: Deploy Strategy
command: cd packages/game-01-strategy && devvit upload
- name: Deploy Trivia
command: cd packages/game-02-trivia && devvit upload
- name: Deploy Meme
command: cd packages/game-03-meme && devvit upload
- name: Deploy Duel
command: cd packages/game-04-duel && devvit upload
9. Conclusion
This architecture transforms the Reddit Daily Games 2026 Hackathon from a creative
challenge into a precision engineering operation. By leveraging Google Antigravity to enforce
platform constraints (the "Hard Deck") and automating the ingestion of retention research, we
position the "Game Factory" to produce high-fidelity, highly engaging daily experiences. The
integration of Gemini 2.0 Flash and Flux.1 via secure server-side proxies ensures the games
feel "next-gen" without violating the strict security and resource boundaries of the Devvit
platform. This setup provides the robust foundation necessary not just to participate, but to

## Page 16

compete for the top prize.
Works cited
1. Announcing our Daily Games themed virtual hackathon! : r/GameDevelopment -
Reddit, accessed February 3, 2026,
https://www.reddit.com/r/GameDevelopment/comments/1qdoxfi/announcing_our
_daily_games_themed_virtual/
2. Announcing our Daily Games themed virtual hackathon! : r/Devvit - Reddit,
accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1qdnhj5/announcing_our_daily_game
s_themed_virtual/
3. Hackathon Workspace Setup Prompt.pdf
4. Build with Google Antigravity, our new agentic development platform, accessed
February 3, 2026,
https://developers.googleblog.com/build-with-google-antigravity-our-new-agen
tic-development-platform/
5. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler
6. Developer platform waitlist? : r/redditdev, accessed February 3, 2026,
https://www.reddit.com/r/redditdev/comments/195d9x8/developer_platform_waitli
st/
7. What are you using for storage? : r/Devvit - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1qktf3v/what_are_you_using_for_stor
age/
8. Is a Devvit app limited to its reddit-hosted server for the webview's realtime
capabilities?, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1p20t3u/is_a_devvit_app_limited_to_i
ts_reddithosted/
9. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
10. Devvit 0.9.0: HTTP Fetch has arrived - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/12ktsqt/devvit_090_http_fetch_has_a
rrived/
11. Overview - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/http-fetch
12. A new era of intelligence with Gemini 3 - The Keyword, accessed February 3,
2026, https://blog.google/products-and-platforms/products/gemini/gemini-3/
13. Getting Started with Google Antigravity, accessed February 3, 2026,
https://codelabs.developers.google.com/getting-started-google-antigravity
14. Google Antigravity: Hands on with our new agentic development platform -
YouTube, accessed February 3, 2026,
https://www.youtube.com/watch?v=uzFOhkORVfk
15. Devvit Rules - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/devvit_rules

## Page 17

16. The MCP Server Stack: 10 Open-Source Essentials for 2026 | by TechLatest.Net |
Dec, 2025 | Towards Dev, accessed February 3, 2026,
https://medium.com/towardsdev/the-mcp-server-stack-10-open-source-essenti
als-for-2026-cb13f080ca5c
17. modelcontextprotocol/servers: Model Context Protocol Servers - GitHub,
accessed February 3, 2026, https://github.com/modelcontextprotocol/servers
18. Free FLUX API – Ultimate Guide to Next-Generation AI Image Generation,
accessed February 3, 2026,
https://blog.laozhang.ai/ai-technology/free-flux-api-guide-2025/
19. Realtime in Devvit Blocks - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/capabilities/realtime/realtime_in_devvit_
blocks
20. Gemini 2.0 Flash - API, Providers, Stats - OpenRouter, accessed February 3, 2026,
https://openrouter.ai/google/gemini-2.0-flash-001
21. Gemini models | Gemini API | Google AI for Developers, accessed February 3,
2026, https://ai.google.dev/gemini-api/docs/models


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/finance/Context__Manga_UI_Architecture.md

# Context_ Manga UI Architecture.pdf

## Page 1

Visual Reference for Developer Instance:
1. Layout Strategy: The UI is divided into 3 "Panels" using CSS Grid.
○ Panel 1 (Top Left): "The News". White background, jagged black border
(clip-path). Contains the Gemini-generated headline.
○ Panel 2 (Middle Right): "The Advisor". Halftone background (CSS
radial-gradient). Contains the character avatar (Vic or Sal) and their "Bonmot"
speech bubble.
○ Panel 3 (Bottom): "The Action". Black background. Two massive buttons: "YOLO"
(Green text) and "FOLD" (Red text).
2. CSS Halftone Code (Use this):
.manga-bg {
background-image: radial-gradient(#000 20%, transparent 20%), radial-gradient(#000
20%, transparent 20%);
background-color: #fff;
background-position: 0 0, 5px 5px;
background-size: 10px 10px;
opacity: 0.1;
}
```
3. Character Logic:
○ Do not try to generate complex AI images on the fly (too slow/expensive).
○ Use Silhouette Avatars: Pre-defined SVG paths for "Man in Suit" (Vic) and "Old
Man with Hat" (Sal). Change their color (Red/Green) based on the market mood.


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/finance/Devvit_Game_Architecture_Guide.md

# Devvit Game Architecture Guide.pdf

## Page 1

Architectural Validation and
Implementation Blueprint: "Get Rich
Fast" Serverless Autonomous Agent
1. Executive Summary and Architectural Philosophy
This comprehensive research report and implementation guide validates the technical
architecture for "Get Rich Fast," a serverless, autonomous strategy game designed for the
Reddit Daily Games Hackathon. The project is defined by a unique set of constraints—most
notably the "Offline" requirement, which dictates that the application must operate as a fully
autonomous agent on Reddit's infrastructure without external maintenance or "keep-alive"
signals from a developer's local machine. Combined with the "Seinen Noir" aesthetic
constraint requiring a high-fidelity visual style without heavy image assets, this project
presents a distinct challenge in resource-constrained, event-driven software architecture.
The architecture proposed and validated herein leverages the Reddit Devvit platform's
serverless capabilities to their theoretical and practical limits. By decoupling the simulation
engine—driven by daily Cron jobs calling the Gemini API—from the presentation layer
(Redis-backed client reads), we achieve a system that is resilient to API failures, highly
scalable within the platform's storage quotas, and aesthetically distinct through the advanced
application of CSS mathematics.
1.1 The Paradigm Shift: From Maintainer to Creator
In traditional game development, even in serverless contexts, there is often an implicit
assumption of an "admin" presence—a developer who can SSH into a box, manually trigger a
stuck job, or deploy a hotfix when a third-party API changes. The "Offline" requirement of this
project necessitates a fundamental shift in architectural philosophy from "Maintained Service"
to "Autonomous Agent."
The application must be architected as a "Zero-Touch" system. Once the code is pushed and
the AppUpgrade event is processed, the system must become a perpetual motion machine. It
must wake itself up, orient itself in time, generate its own content via the Gemini LLM, validate
that content, persist it for consumption, and handle its own errors—all without human
intervention. This requires a robust implementation of self-healing scheduling patterns and
defensive programming strategies, specifically around the 30-second execution time limit
enforced by the Devvit runtime.
1.2 Core Architectural Pillars
The validated architecture rests on three pillars, derived from a synthesis of the provided
research material and best practices in distributed systems:
1. Lifecycle-Driven Autonomy: The utilization of the AppUpgrade and AppInstall lifecycle

## Page 2

events to bootstrap the persistent scheduler loop, ensuring the game survives
redeployments and infrastructure resets.1
2. Resilient AI Integration: A defensive wrapper around the Gemini API interaction that
enforces a strict 25-second local timeout (to preempt the platform's 30-second hard
kill) and utilizes a local JSON fallback strategy to guarantee narrative continuity.3
3. Procedural CSS Aesthetics: The replacement of raster assets with mathematically
defined CSS shapes (clip-path) and gradients (radial-gradient, conic-gradient),
minimizing bandwidth usage while maximizing the "Seinen Noir" stylistic impact.5
2. The Runtime Environment: Devvit Serverless
Constraints
To build a reliable autonomous agent, one must first understand the physics of the world it
inhabits. The Devvit platform imposes strict limits on execution time, memory, and API
interaction.
2.1 The Scheduler and the "Offline" Constraint
The primary mechanism for autonomy is the Devvit Scheduler. Research indicates that the
scheduler.runJob method is the only viable path to executing code without a user request.1
However, a critical nuance discovered in the documentation and community logs is that
scheduled jobs are tightly coupled to the installation context.2
A job cannot simply exist in the abstract; it must be registered to a specific installation of the
app on a specific subreddit. This creates a potential vulnerability: if the app is updated or
redeployed, does the schedule survive? Research snippet 2 confirms that the playtest
command acts as an AppUpgrade event. This is the architectural linchpin.
The sequence of operations begins with the developer's push to the remote repository, which
forces a server-side build. Upon successful compilation, the Reddit infrastructure emits an
AppUpgrade or AppInstall event. This event listener is the sole entry point for the autonomous
agent. To ensure idempotency—preventing the accumulation of duplicate "zombie" jobs—the
handler must first purge any existing jobs with the target name before registering the
canonical daily_scenario_gen Cron task. This task then enters a dormant state until the trigger
condition (0 0 * * * - Midnight UTC) is met, at which point it wakes the execution environment
to initiate the daily narrative generation cycle.
2.2 Execution Time and the "Hard Kill"
The most unforgiving constraint in the Devvit environment is the execution time limit. For
interactive apps, the limit is often as low as 1 second.8 However, scheduled jobs and backend
functions allow for a longer window, typically up to 30 seconds for HTTP requests.3
This 30-second window is the "oxygen supply" for our autonomous agent. If the Gemini API
takes 31 seconds to generate a complex "Seinen Noir" scenario, the Devvit runtime will
terminate the process via a "hard kill." This is catastrophic for an autonomous system; it
results in a day without a scenario, breaking the game loop.

## Page 3

Therefore, the architecture must include a "Time-to-Live" (TTL) monitor within the execution
logic itself. By wrapping the external API call in a race condition with a local timer set to 25
seconds, we can force a "soft timeout." If Gemini is too slow, the agent itself aborts the
request, logs the failure, and seamlessly swaps in a pre-generated fallback scenario from its
local storage. This ensures that from the user's perspective, the game never fails.
2.3 Storage Limits and Data Modeling
The Redis instance provided to the app is capped at 500MB per installation.9 While this
sounds generous for text data, the atomic nature of the "Get Rich Fast" game requires careful
data modeling.
We separate state into two distinct tiers:
1. Global Ephemeral State: The daily scenario. This is a single JSON object stored at
game:scenario:current. It is overwritten daily. Its storage impact is negligible (< 2KB).
2. User Persistent State: The player portfolios. Stored at user:<id>:portfolio.
With a 10KB limit per record 10, we must avoid monolithic user objects if the game grows
complex. However, for a hackathon scope, a single Hash per user containing cash (number),
assets (JSON string), and history (JSON string) is efficient. Even with 50,000 users, the total
storage would be approximately 50MB, well within the 500MB safety margin. The use of
hIncrBy is recommended for numerical values like cash to ensure atomicity, preventing race
conditions if a user interacts from multiple devices simultaneously.9
3. The Narrative Engine: AI Integration and Resilience
The heart of "Get Rich Fast" is its narrative—the gritty, "Street Smart" voice of the game. This
is generated dynamically by Google's Gemini API.
3.1 The Gemini Interface
The architecture calls for the Gemini 1.5 Flash model due to its speed and cost-efficiency
(Free Tier).11 The integration uses the standard REST endpoint via fetch. To ensure the output
is usable by our game engine, we utilize the responseMimeType: "application/json"
parameter.12 This forces the LLM to output structured data, eliminating the need for fragile
regex parsing of the response.
3.2 Prompt Engineering for "Seinen Noir"
The prompt is the most critical component of the "Autonomous Developer." It must do more
than ask for a scenario; it must enforce the specific aesthetic and pedagogical goals of the
project.
The prompt structure validated for this architecture includes:
● Persona Definition: Explicitly defining "Vic" (High Risk, WSB Slang) and "Sal" (Low Risk,
Street Wisdom).
● Aesthetic Enforcers: Keywords like "Shadows," "Leverage," "Concrete," and "Neon" to
trigger the "Noir" latent space in the model.
● Pedagogical Constraint: The requirement to use "Illegal Analogies." The model is

## Page 4

instructed to explain complex financial concepts (e.g., Short Selling, Theta Decay) using
metaphors drawn from the criminal underworld (e.g., Loan Sharking, Fencing Stolen
Goods).
3.3 The Resilience Layer: AbortController
As identified in Task 1, reliance on an external API introduces volatility. The AbortController
interface is the standard web API for cancelling asynchronous operations.4
The implementation pattern is as follows:
1. Instantiate const controller = new AbortController().
2. Start a timer: const id = setTimeout(() => controller.abort(), 25000).
3. Pass signal: controller.signal to the fetch request.
4. In the catch block, check if the error name is AbortError. If so, it was a timeout. If not, it
was a network error.
5. In either failure case, load a scenario from src/data/fallback-scenarios.json.
This pattern guarantees that the Cron job always completes successfully, updating the Redis
state with something, whether it be fresh AI content or a high-quality "canned" backup.
4. Visual Engineering: The "Seinen Noir" Aesthetic
The constraint "NO heavy image assets" is not a limitation; it is a design directive. We utilize
the browser's rendering engine (CSS) to procedurally generate the visual style.
4.1 Mathematical Manga Panels
Manga panels are characterized by dynamic, irregular borders that convey energy. Standard
CSS borders are too rigid. We employ clip-path: polygon() to slice the DOM elements into
jagged shapes.
By defining a polygon such as polygon(2% 1%, 98% 0%, 100% 98%, 1% 99%), we create a
subtle, hand-drawn irregularity. This is far cheaper than rendering a PNG border and scales
infinitely without pixelation.
4.2 Halftone Textures and Speed Lines
The "Ben-Day dot" effect, synonymous with comic printing, is achieved via radial-gradient. A
repeating pattern of small black circles on a transparent background simulates the texture of
paper and ink.6
For high-impact moments—such as the reveal of a massive profit or loss—we utilize
repeating-conic-gradient. By centering the gradient on the middle of the viewport and
alternating between transparent and opaque wedges, we create "Speed Lines" that draw the
user's eye to the center. Research suggests this is computationally expensive if animated on
the CPU, so we apply will-change: transform or keep the background static to ensure 60fps
performance on mobile devices.14

## Page 5

5. Narrative Dynamics and Game Theory
The core loop relies on the interaction between the User and the generated scenario. We
apply Prospect Theory (Kahneman & Tversky) to the game design. Users feel the pain of a
loss (-100%) approximately twice as acutely as the joy of a gain (+100%).
● Vic's Option (The Lottery): Low probability of success, massive payout. This appeals
to players trailing in the leaderboard who need "catch-up logic."
● Sal's Option (The Bond): High probability of success, low payout. This appeals to
leaderboard leaders protecting their "lead logic."
This dynamic ensures that the leaderboard remains fluid. If the game were purely skill-based,
the leader would never lose. By introducing the high-variance "Vic" options, we allow
underdogs to "YOLO" their way back to the top—or crash out entirely, reinforcing the "Noir"
tragedy theme.

## Page 6

6. "Copy-Paste" Development Guide
The following sections provide the exact files needed to scaffold and deploy this application.
The implementation details incorporate all findings from the deep research, specifically
regarding JSON module resolution, type safety, and scheduler management.
6.1 Project Configuration
File: package.json
We must ensure the project is configured to handle JSON imports correctly, as we rely on
fallback-scenarios.json.
JSON
{
"name": "get-rich-fast",
"version": "0.0.1",

## Page 7

"type": "module",
"scripts": {
"dev": "devvit playtest",
"build": "devvit build",
"upload": "devvit upload"
},
"dependencies": {
"@devvit/public-api": "^0.10.0",
"@devvit/web-view": "^0.10.0"
},
"devDependencies": {
"typescript": "^5.0.0"
}
}
File: tsconfig.json Crucially, resolveJsonModule must be enabled to allow the TypeScript
compiler to ingest our fallback data.15
JSON
{
"compilerOptions": {
"target": "ES2020",
"module": "ESNext",
"moduleResolution": "node",
"resolveJsonModule": true,
"esModuleInterop": true,
"strict": true,
"jsx": "react-jsx"
}
}
File: devvit.json This configuration enables the necessary permissions. Note the specific
inclusion of http permissions for the Google Gemini domain.17
JSON
{
"name": "get-rich-fast-noir",
"version": "1.0.0",

## Page 8

"permissions": {
"http": {
"enable": true,
"domains": ["generativelanguage.googleapis.com"]
},
"scheduler": true,
"redis": true,
"reddit": true
},
"settings":
}
6.2 The "Brain": Server-Side Scheduler
This file implements the self-healing scheduler pattern derived from the research into Devvit
lifecycle events. It handles the critical AppUpgrade trigger to ensure the "Offline" autonomy
requirement is met.
File: src/server/scheduler.ts
TypeScript
import { Devvit } from '@devvit/public-api';
import { generateDailyScenario } from './gemini-prompt.js';
// The Cron Schedule: Midnight UTC daily
// Format: Minute Hour DayOfMonth Month DayOfWeek
const DAILY_CRON = '0 0 * * *';
const JOB_NAME = 'daily_scenario_gen';
export function configureScheduler(devvit: Devvit) {
// 1. Trigger on App Upgrade/Install to register the job
// This is the "Zero-Touch" activation hook.
devvit.addTrigger({
events: ['AppInstall', 'AppUpgrade'],
onEvent: async (_, context) => {
console.log('App Lifecycle Event: ensuring scheduler is active.');
try {
// ALWAYS check for and cancel existing jobs to prevent duplicates.
// This ensures idempotency across multiple deployments.
const currentJobs = await context.scheduler.listJobs();
const existingJob = currentJobs.find(job => job.name === JOB_NAME);

## Page 9

if (existingJob) {
console.log(`Cancelling existing job: ${existingJob.id}`);
await context.scheduler.cancelJob(existingJob.id);
}
// Schedule the new job
await context.scheduler.runJob({
name: JOB_NAME,
cron: DAILY_CRON,
});
console.log(`Scheduled ${JOB_NAME} for ${DAILY_CRON}`);
} catch (e) {
console.error('Failed to schedule job:', e);
}
},
});
// 2. Define the Job Execution Logic
// This function is called by the Devvit runtime when the Cron triggers.
devvit.addSchedulerJob({
name: JOB_NAME,
onRun: async (_, context) => {
console.log('Executing Daily Scenario Generation...');
await generateDailyScenario(context);
},
});
}
6.3 The "Voice": Gemini Prompt Engineering & Resilience
This module encapsulates the interaction with the Gemini API. It implements the
AbortController timeout logic to prevent "hard kills" and manages the fallback mechanism.
File: src/server/gemini-prompt.ts
TypeScript
import { Context } from '@devvit/public-api';
// Note: This import works because of "resolveJsonModule" in tsconfig.json
import fallbackScenarios from '../data/fallback-scenarios.json';
const GEMINI_ENDPOINT =

## Page 10

'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
;
// Interface for the strict JSON schema we expect from the LLM
interface GameScenario {
day_id: string;
headline: string;
narrative_intro: string; // The "Setup"
character_vic: {
dialogue: string; // Slang-heavy, high risk
action_label: string;
risk_level: "HIGH";
potential_profit: string; // e.g., "+200%"
potential_loss: string; // e.g., "-100%"
};
character_sal: {
dialogue: string; // Wisdom, low risk
action_label: string;
risk_level: "LOW";
potential_profit: string; // e.g., "+5%"
potential_loss: string; // e.g., "-2%"
};
}
export async function generateDailyScenario(context: Context) {
// Retrieve the API key from secure storage
const apiKey = await context.settings.get('gemini-api-key');
// Guard clause: If no key is set, use fallback immediately.
if (!apiKey) {
console.error('No API Key found. Using fallback.');
await saveScenario(context, getRandomFallback());
return;
}
// The System Prompt: "Seinen Noir" + "Financial Literacy"
// We explicitly instruct the model on Tone, Format, and Educational Content.
const prompt = `
You are a game master for a 'Seinen Noir' strategy game set in a gritty financial underworld.
Characters:
1. 'Vic': Chaotic, loves risk (WallStreetBets slang: 'Tendies', 'YOLO', 'Diamond Hands').
2. 'Sal': Old school, risk-averse, wise (The Wire style: 'Come at the king', 'Strict Business').

## Page 11

Task: Create a daily financial scenario (e.g., Market Crash, Crypto Pump, Insider Tip).
Teach a real financial concept (e.g., Short Selling, Compound Interest, Diversification) using
an ILLEGAL ANALOGY (e.g., comparing interest to loan sharking).
Output strictly valid JSON. No markdown formatting.
`;
try {
// AbortController for the 30s timeout limit
// We set a 25s local timeout to ensure we can handle the error gracefully
// before the Devvit runtime kills the process.
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s hard limit
const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
signal: controller.signal,
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
// Force JSON output for reliability
responseMimeType: "application/json"
}
})
});
// Clear the timeout if the request succeeds in time
clearTimeout(timeoutId);
if (!response.ok) {
throw new Error(`Gemini API Error: ${response.status}`);
}
const data = await response.json();
const scenarioText = data.candidates.content.parts.text;
const scenarioJson: GameScenario = JSON.parse(scenarioText);
// Save the valid AI-generated scenario to Redis
await saveScenario(context, scenarioJson);
} catch (error) {
console.error('AI Generation Failed:', error);

## Page 12

// CRITICAL: Fallback logic ensures the game never stops.
// Whether it's a timeout, a 500 error, or a bad JSON parse,
// we always ensure a valid state is written to Redis.
await saveScenario(context, getRandomFallback());
}
}
async function saveScenario(context: Context, scenario: GameScenario) {
// Write the scenario to the global key
await context.redis.set('game:scenario:current', JSON.stringify(scenario));
// Set an expiry to auto-clean up if the cron fails (resilience)
await context.redis.expire('game:scenario:current', 86400 + 3600); // 25 hours
}
function getRandomFallback(): GameScenario {
// Type assertion is safe here because we control the JSON file
return fallbackScenarios as GameScenario;
}
6.4 The "Look": High-Performance Manga CSS
This CSS file implements the visual research. It uses CSS variables for theming and complex
gradient functions for the background effects.
File: src/webview/styles/manga.css
CSS
:root {
--noir-black: #111;
--noir-white: #fefefe;
--profit-green: #00ff41; /* Terminal Green */
--loss-red: #ff3333;
}
/* The Manga Panel Container */
.panel-container {
background-color: var(--noir-white);
padding: 20px;
position: relative;
/* Dynamic Clip Path for "Jagged" Edges
This creates the "Torn Paper" look without images */
clip-path: polygon(

## Page 13

2% 1%,
98% 0%,
100% 98%,
1% 99%
);
/* Hard shadow to simulate ink depth */
box-shadow: 10px 10px 0px var(--noir-black);
transition: clip-path 0.2s ease-in-out;
}
/* Background Texture: Ben-Day Dots (Halftone) */
.halftone-bg {
/* Radial gradient creates a grid of dots */
background-image: radial-gradient(
circle,
var(--noir-black) 1px,
transparent 1.5px
);
background-size: 6px 6px; /* Pattern density */
opacity: 0.1;
position: absolute;
top: 0; left: 0; right: 0; bottom: 0;
z-index: 0;
pointer-events: none;
}
/* Speed Lines for "High Impact" moments (e.g., Profit/Loss reveal) */
.speed-lines {
position: absolute;
inset: -50px; /* Overshoot to cover rotation edges */
/* Conic gradient creates radiating wedges */
background: repeating-conic-gradient(
from 0deg at 50% 50%,
transparent 0deg,
transparent 2deg,
var(--noir-black) 2.1deg,
transparent 2.2deg
);
opacity: 0.15;
z-index: 1;
/* Use transform for performant animation */
animation: shake 0.5s infinite;
pointer-events: none;

## Page 14

}
/* Typography */
.dialogue-bubble {
background: var(--noir-white);
border: 3px solid var(--noir-black);
/* Irregular organic shape for speech bubbles */
border-radius: 50% 20% / 10% 40%;
padding: 15px;
font-family: 'Courier New', monospace; /* Typewriter feel */
font-weight: bold;
position: relative;
z-index: 2;
}
@keyframes shake {
0% { transform: translate(0, 0) rotate(0deg); }
25% { transform: translate(1px, 1px) rotate(1deg); }
50% { transform: translate(-1px, -1px) rotate(-1deg); }
75% { transform: translate(-1px, 1px) rotate(1deg); }
100% { transform: translate(1px, -1px) rotate(0deg); }
}
6.5 The "Safety Net": Fallback Scenarios
This JSON file guarantees the game functions even if the Gemini API is unreachable.
File: src/data/fallback-scenarios.json
JSON
7. Operational Resilience and Future Considerations
7.1 Failure Modes and Recovery
The architecture is designed to fail safely.
● API Failure: Handled by fallback-scenarios.json.
● Redis Failure: Extremely rare on Reddit's infrastructure, but would manifest as a "stale
state." The expire command (25 hours) ensures that if the Cron job fails for 24 hours,
the data clears, potentially triggering a client-side "Maintenance Mode" view rather
than showing outdated data.

## Page 15

● Scheduler Desync: If the scheduler stops (e.g., due to a Reddit outage), a simple
redeploy (devvit upload) or playtest command will re-trigger the AppUpgrade event and
restart the heartbeat.
7.2 Scalability
The current Redis schema allows for horizontal scaling of user data. As the player base grows,
the "Global Scenario" remains a constant overhead. The only scaling pressure is on the User
Portfolio data. If the app exceeds the 500MB limit, future iterations could implement a "Rolling
Archive" strategy where inactive users (inactive > 30 days) have their data serialized to a
compressed string or evicted.
8. Conclusion
The "Get Rich Fast" architecture represents a robust application of serverless principles to the
specific constraints of the Reddit Daily Games Hackathon. By treating the application as an
autonomous agent—capable of waking itself, generating its own content, and healing its own
errors—we satisfy the "Offline" requirement. Simultaneously, the "Seinen Noir" aesthetic is
delivered not through heavy assets, but through the elegant application of CSS mathematics.
This blueprint provides a complete path to deployment, ensuring that the game is not only
playable but durable, resilient, and stylistically distinct.
Works cited
1. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler
2. devvit playtest command updates app across all subs, not just the specified test
subreddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1lchlk0/devvit_playtest_command_up
dates_app_across_all/
3. HTTP Fetch | Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
4. AbortController: abort() method - Web APIs - MDN Web Docs, accessed
February 3, 2026,
https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
5. CSS Surprise Manga Lines - Alvaro Montoro, accessed February 3, 2026,
https://alvaromontoro.com/blog/68054/css-manga-lines
6. Pure CSS Halftone Effect in 3 Declarations - Frontend Masters, accessed February
3, 2026,
https://frontendmasters.com/blog/pure-css-halftone-effect-in-3-declarations/
7. Devvit | Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/api/public-api/classes/Devvit
8. Limitations - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/limits
9. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis

## Page 16

10. General policy and long term plan questions : r/Devvit - Reddit, accessed
February 3, 2026,
https://www.reddit.com/r/Devvit/comments/z1mnpp/general_policy_and_long_ter
m_plan_questions/
11. How to Generate Gemini API Key for Free in 2026(5 Easy Steps) - weDevs,
accessed February 3, 2026,
https://wedevs.com/blog/510096/how-to-generate-gemini-api-key/
12. How to get JSON output from gemini-1.5-pro-001 using curl - Stack Overflow,
accessed February 3, 2026,
https://stackoverflow.com/questions/78779183/how-to-get-json-output-from-ge
mini-1-5-pro-001-using-curl
13. Mastering Controlled Generation with Gemini 1.5: Schema Adherence for
Developers, accessed February 3, 2026,
https://developers.googleblog.com/en/mastering-controlled-generation-with-ge
mini-15-schema-adherence/
14. conic-gradient() - CSS - MDN Web Docs - Mozilla, accessed February 3, 2026,
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/co
nic-gradient
15. Importing JSON file in TypeScript - Stack Overflow, accessed February 3, 2026,
https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript
16. How to Fix “Cannot find module '*.json'” Error in TypeScript | by Ridbay - Medium,
accessed February 3, 2026,
https://ridbay.medium.com/how-to-fix-cannot-find-module-json-error-in-typesc
ript-de665c55826b
17. devvit.json - Configure Your App - Reddit for Developers, accessed February 3,
2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configura
tion


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/finance/Devvit_Game_Code_Generation.md

# Devvit Game Code Generation.pdf

## Page 1

Technical Specification and
Implementation Report: "Get Rich Fast"
– A Serverless Daily Financial Simulator
1. Architectural Overview and Design Philosophy
The development of "Get Rich Fast," a daily financial simulator operating within the Reddit
Devvit ecosystem, represents a convergence of serverless architecture, generative artificial
intelligence, and community-driven gaming dynamics. This report serves as an exhaustive
technical manual and implementation guide, detailing every facet of the application's
construction from the configuration of the runtime environment to the pixel-perfect rendering
of the "Seinen/Noir Manga" user interface.
The core objective is to simulate the volatile, high-stakes atmosphere of day trading, heavily
influenced by the cultural phenomenon of retail trading communities like r/WallStreetBets.1
The application distinguishes itself through a rigorous adherence to a specific
aesthetic—high-contrast, black-and-white noir visual language—and a technical architecture
that runs entirely serverless, relying on the Reddit Devvit runtime for computation, scheduling,
and storage.
1.1 The Serverless Paradigm on Devvit
The Devvit platform imposes a unique set of constraints and capabilities that fundamentally
shape the application architecture. Unlike traditional containerized applications where a
persistent server maintains state in memory, the Devvit environment is ephemeral. Functions,
triggers, and scheduled jobs spin up on demand and terminate immediately upon completion.
This necessitates a stateless architectural pattern where all persistence is offloaded to Redis,
and all logic is event-driven.3
For "Get Rich Fast," this means there is no "game loop" running in the background in the
traditional sense. Instead, the game moves forward in discrete ticks triggered by the Devvit
Scheduler. The state of the market does not exist continuously in memory; it is re-hydrated
from the database (Redis) every time a user loads the post or the daily scheduler fires.5 This
report outlines a system design that embraces these constraints, utilizing the scheduler
capability to create the illusion of a living, breathing market that updates reliably every 24
hours.
1.2 Aesthetic and Tonal Integration
The visual and narrative direction is strictly defined by a "Seinen/Noir Manga" aesthetic.7 This
choice dictates a high-contrast user interface, jagged geometric layouts, and a distinct lack of
grayscale gradients in favor of stark black-and-white compositions. The color palette is

## Page 2

intentionally restricted to black (#000000), white (#FFFFFF), and two signal colors
representing market sentiment: "Bullish Green" and "Bearish Red."
This visual language serves a functional purpose beyond mere style. The "jagged" borders
and stark contrasts mimic the cognitive load and stress of high-frequency trading. The
interface is divided into three distinct panels—News, Advisor, and Action—creating a Z-pattern
layout that guides the user's eye from the daily context (News) to the character-driven advice
(Advisor) and finally to the decision point (Action).8
1.3 Data Flow and System Architecture
The application relies on a unidirectional data flow initiated by a time-based trigger.
1. Trigger: The Devvit Scheduler fires a daily_market_open event at a configured time
(e.g., 13:00 UTC).
2. Generation: The application server receives this event and constructs a prompt for the
Google Gemini API.
3. External Computation: The Gemini 1.5 Flash model generates a structured JSON
payload containing the day's market headline, narrative subtext, character dialogue,
and market movement percentage.
4. Persistence: The server validates this payload and persists it to Reddit's internal Redis
storage, archiving the previous day's state.
5. Consumption: When a user visits the subreddit and loads the game post, the Webview
component mounts, fetches the current state from Redis via the server, and renders the
interface.
The rejection of complex architecture diagrams in this report requires a detailed textual
breakdown of these interactions. The Scheduler acts as the heartbeat, the Server as the
brain, Gemini as the creative engine, and Redis as the memory. The interactions between
these components are strictly asynchronous, necessitating robust error handling and fallback
mechanisms which will be detailed in the subsequent sections.
2. Platform Configuration: devvit.json
The devvit.json file is the nucleus of the application. It acts as the manifest that declares the
application's identity, its entry points, and most critically, the permission scopes it requires to
operate. In the security-conscious environment of Reddit's developer platform, capabilities
such as making external HTTP requests or scheduling background jobs are disabled by
default. We must explicitly opt-in to these features.
2.1 Permission Analysis and Security Scopes
To achieve the functional requirements of "Get Rich Fast," the configuration must enable
three specific high-privilege scopes.
2.1.1 HTTP Egress (http)

## Page 3

The application relies on the Google Gemini API for its content generation. This requires the
server to open an outbound connection to generativelanguage.googleapis.com. Devvit
enforces a strict allow-list policy for HTTP requests to prevent abuse. While
generativelanguage.googleapis.com is on the global allow-list of approved domains, the
application manifest must still explicitly declare the intent to use the http capability and list
the domains it will contact.10 Failure to declare this will result in immediate runtime errors
when the fetch command is invoked.
2.1.2 Scheduled Jobs (scheduler)
The "Daily" aspect of the simulator is non-negotiable. We cannot rely on user activity to
trigger the new day's market update, as this would lead to inconsistent timing or race
conditions where multiple users trigger the update simultaneously. The scheduler permission
allows the registration of cron-like jobs that run independently of user interaction. This
capability is the engine that drives the game's daily retention loop.5
2.1.3 Data Persistence (redis)
Redis is the only persistence mechanism available to Devvit apps for this use case. It is
essential for storing the "Daily Scenario" (the shared state for all users) and the individual user
portfolios (private state). Without the redis permission, the application would be strictly
ephemeral, resetting completely on every page load.6
2.2 The Configuration Artifact
The following JSON structure represents the validated configuration for the application. It
maps the daily_market_open task to a specific cron schedule and points the custom post type
to the Webview entry point.
JSON
{
"$schema": "https://developers.reddit.com/schema/config-file.v1.json",
"name": "get-rich-fast-sim",
"version": "0.1.0",
"description": "A noir-manga styled daily financial simulator powered by Gemini.",
"main": "src/main.ts",
"webroot": "src/webview",
"permissions": {
"http": {
"domains": [
"generativelanguage.googleapis.com"
]
},

## Page 4

"scheduler": true,
"redis": true,
"media": true
},
"scheduler": {
"tasks": {
"daily_market_open": {
"cron": "0 13 * * *",
"description": "Generates the daily market scenario at 1 PM UTC (Market Open)"
}
}
},
"custom_post_type": {
"name": "DailySimulation",
"entry_point": "src/webview/App.tsx"
}
}
2.3 Scheduler Configuration Strategy
The cron expression 0 13 * * * is a deliberate design choice derived from financial market
analysis. The New York Stock Exchange (NYSE) opens at 9:30 AM Eastern Time. Depending on
Daylight Saving Time, this corresponds to either 13:30 or 14:30 UTC. By setting the trigger to
13:00 UTC, we ensure the daily content is generated and available just before or as the US
markets open. This synchronization maximizes the relevance of the content for the target
audience, who are likely active during these hours.1
The tasks object in devvit.json defines the interface between the platform's scheduler service
and our application code. The key daily_market_open serves as the event name that our
server code will listen for. This decoupling allows us to change the schedule in the JSON file
without modifying the TypeScript logic, providing operational flexibility.
3. Server-Side Architecture: src/main.ts
The src/main.ts file is the application's entry point. In the Devvit framework, this file is
responsible for registering the application's capabilities with the runtime. It does not run
continuously; rather, it defines handlers that the platform invokes in response to specific
events (e.g., a scheduled job firing, a user clicking a menu item, or a post being rendered).
3.1 The Event-Driven Logic Flow
The server logic must orchestrate three distinct operational modes:
1. The Scheduled Update: Handling the background generation of content.

## Page 5

2. The Interactive Render: Serving the game UI to a user.
3. The Administrative Override: Allowing manual triggers for testing or correction.
The architecture uses a singleton pattern for the market state. Regardless of how many users
are playing, there is only one "Market Scenario" for a given day. This shared state helps build a
cohesive community experience where all players are reacting to the same "news" event,
fostering discussion in the post comments.11
3.2 Implementation Details
The implementation leverages the @devvit/public-api SDK. A critical optimization in the render
function is the use of useState with an asynchronous initializer. This pattern allows the server
to fetch the necessary data from Redis before sending the initial HTML to the client. This
"Server-Side Data Hydration" significantly improves the user experience by eliminating the
"loading spinner" phase that typically occurs when a client-side app has to fetch data after
mounting.12
3.3 Source Code Specification: src/main.ts
TypeScript
import { Devvit, useState } from '@devvit/public-api';
import { generateDailyScenario } from './server/gemini.js';
import { backupDailyState, getLatestScenario } from './data/backups.js';
// Configure the Devvit instance with necessary plugins
Devvit.configure({
http: true,
redis: true,
redditAPI: true,
scheduler: true,
});
/**
* SCHEDULER: Daily Market Generator
* This handler is invoked by the Devvit platform based on the cron schedule
* defined in devvit.json. It operates in a background context.
*
* Logic Flow:
* 1. Acknowledge trigger.
* 2. Call Gemini API to generate fresh content.
* 3. Serialize and save the content to Redis.
* 4. Log success/failure for developer visibility.

## Page 6

*/
Devvit.addSchedulerJob({
name: 'daily_market_open',
onRun: async (event, context) => {
🔔
console.log(' Market Bell Ringing! Generating daily scenario...');
try {
// 1. Generate Content via Gemini
// This is an expensive async operation (1-3 seconds latency)
const scenario = await generateDailyScenario(context);
// 2. Persist Data
// We use the date as the primary key for historical lookups
const dateKey = new Date().toISOString().split('T');
await backupDailyState(context, dateKey, scenario);
✅
console.log(` Market Open for ${dateKey}: ${scenario.headline}`);
// Note: In a production version, we might create a new Reddit Post here
// using context.reddit.submitPost(), but for this simulator, we assume
// the game lives in a pinned post that updates its internal state.
} catch (error) {
💥
console.error(' Market Crash (Server Error):', error);
// In a real deployment, we would trigger an alert or retry logic here
}
},
});
/**
* MENU ITEM: Manual Trigger (For Debugging/Admins)
* This creates a button in the subreddit menu visible only to moderators.
* It allows forcing a "new day" event, essential for testing without waiting 24 hours.
*/
Devvit.addMenuItem({
label: 'Force Market Open (Debug)',
location: 'subreddit',
forUserType: 'moderator',
onPress: async (_event, context) => {
try {
const scenario = await generateDailyScenario(context);
const dateKey = new Date().toISOString().split('T');
await backupDailyState(context, dateKey, scenario);

## Page 7

context.ui.showToast(`Market Force Opened: ${scenario.headline}`);
} catch (e) {
context.ui.showToast(`Error: ${e.message}`);
}
},
});
/**
* POST TYPE: The Game Interface
* This defines the Custom Post that users interact with.
*
* Rendering Strategy:
* We use 'webview' to render a full React application. To ensure fast load times,
* we fetch the initial state (the current market scenario) on the server side
* and pass it into the webview's 'state' prop.
*/
Devvit.addCustomPostType({
name: 'Get Rich Fast Simulator',
height: 'tall', // "Tall" is required for the complex 3-panel layout
render: (context) => {
// Server-Side Data Fetching
// The useState hook here runs on the server.
const = useState(async () => {
const dateKey = new Date().toISOString().split('T');
// Fetch the shared market state
const scenario = await getLatestScenario(context);
// Fetch user-specific data (username)
// Note: Redis access for user balance happens inside the app logic or via separate API
const currentUser = context.userId? await context.reddit.getUserById(context.userId) :
null;
return {
date: dateKey,
scenario: scenario,
username: currentUser? currentUser.username : 'Anon',
};
});
return (
<webview

## Page 8

id="game-view"
url="page.html"
onMessage={(msg) => {
// This handler receives messages from the Webview (client).
// It can be used for secure trade processing if we move logic server-side.
console.log("Client message:", msg);
}}
state={initialData} // Hydrates the Webview with the fetched data
/>
);
},
});
export default Devvit;
4. Generative AI Integration: src/server/gemini.ts
The "intelligence" of "Get Rich Fast" is powered by the Google Gemini API. This module acts
as the interface between the game's rigid logic and the creative chaos of the Large Language
Model (LLM).
4.1 Model Selection and JSON Mode
The research indicates that the Gemini 1.5 Flash model is the optimal choice for this
application.14 The "Flash" designation implies a model optimized for low latency and
cost-efficiency, which is crucial for a free-to-play game that might eventually scale to
thousands of daily generations if the architecture changes to per-user scenarios.
Critically, the integration utilizes JSON Mode (Structured Outputs). By setting the
responseMimeType to application/json in the API request, we coerce the model into returning
a strictly formatted JSON object. This eliminates the need for fragile regex parsing of the
model's output and ensures the game UI never breaks due to a malformed response.16
4.2 Prompt Engineering for "WallStreetBets" Tone
To satisfy the requirement for a "WallStreetBets" tone 1, the system instruction must be
meticulously crafted. The prompt cannot simply ask for "financial news." It must explicitly
instruct the model to adopt a specific persona—cynical, high-energy, and saturated with
community-specific slang.
Key slang terms incorporated into the prompt engineering include:
● Stonks: Use of intentional misspellings to denote stocks.
● Tendies: Referring to gains/profits.
● Diamond Hands: Refusal to sell despite losses.

## Page 9

● Paper Hands: Weakness in selling early.
● YOLO: High-risk gambling on market movements.
The prompt also enforces the "Seinen/Noir" narrative by asking for "Noir-style descriptions"
for the subtext, ensuring the text matches the visual aesthetic.
4.3 Source Code Specification: src/server/gemini.ts
TypeScript
import { Devvit } from '@devvit/public-api';
/**
* Interface defining the strict structure of the Gemini response.
* This ensures type safety throughout the application.
*/
export interface MarketScenario {
headline: string; // The "News" Panel: Punchy, uppercase, alarming.
subtext: string; // Context: Noir-style narration of the event.
mood: 'BULL' | 'BEAR'; // Determines the UI color palette (Green/Red).
advisor_vic: string; // Vic's dialogue: High risk, "YOLO" attitude.
advisor_sal: string; // Sal's dialogue: Cynical, risk-averse, "Doomer".
movement: number; // The numerical impact on the market (e.g., +69, -420).
}
// Endpoint for Gemini 1.5 Flash
const GEMINI_API_URL =
'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
;
export async function generateDailyScenario(context: Devvit.Context):
Promise<MarketScenario> {
// 1. Secure API Key Retrieval
// The API key is stored in Reddit's Secret Store, not hardcoded.
// Set via CLI: devvit settings set gemini_api_key <key>
const apiKey = await context.settings.get('gemini_api_key');
if (!apiKey) {
throw new Error('Gemini API Key is missing! Configure it in app settings.');
}
// 2. Construct the Prompt

## Page 10

// We use a "System Instruction" style prompt to define the persona and constraints.
const prompt = `
You are the "Dungeon Master" of a high-stakes, satirical stock market simulator called "Get
Rich Fast".
Your aesthetic is "Noir Manga" and your tone is "r/WallStreetBets".
Task: Generate a daily market event scenario.
Constraints:
1. Tone: Cynical, meme-heavy, high-energy. Use slang like "Stonks", "Tendies", "To the
Moon", "Paper Hands", "Wife's Boyfriend".
2. Format: Return ONLY raw JSON. No markdown fencing.
3. Characters:
- Vic: A reckless suit. Always says "YOLO" or pushes for high risk. Represents Greed.
- Sal: An old cynical trader. Remembers the crash of '29 and '08. Thinks everything is a
bubble. Represents Fear.
JSON Schema Requirement:
{
"headline": "Short punchy headline (max 8 words)",
"subtext": "A brief, noir-style description of the market chaos (max 20 words)",
"mood": "BULL" (if good news) or "BEAR" (if bad news),
"advisor_vic": "Vic's advice (max 15 words)",
"advisor_sal": "Sal's advice (max 15 words)",
"movement": Integer between -99 and +500 representing percentage change.
}
`;
try {
// 3. Execute HTTP Request
const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
// This forces the model to output valid JSON, reducing parsing errors.
responseMimeType: "application/json"
}
}),
});
if (!response.ok) {

## Page 11

throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
}
const data = await response.json();
// 4. Extract and Validate Content
const rawText = data.candidates?.?.content?.parts?.?.text;
if (!rawText) {
throw new Error('Empty response from Gemini');
}
const scenario: MarketScenario = JSON.parse(rawText);
// Basic validation to ensure all fields exist
if (!scenario.headline ||!scenario.mood) {
throw new Error('Invalid JSON structure from Gemini');
}
return scenario;
} catch (error) {
console.error('Failed to generate scenario:', error);
// 5. Fallback Mechanism
// If the API fails, return a hardcoded "Market Halt" scenario to keep the game running.
return {
headline: "MARKET HALTED",
subtext: "The exchange servers are smoking. Trading suspended.",
mood: "BEAR",
advisor_vic: "Let me in! Let me INNNN!",
advisor_sal: "Told you the grid would fail.",
movement: 0
};
}
}
5. Persistence Layer: src/data/backups.ts
While the filename backups.ts is requested, functionally this module serves as the Data
Access Layer (DAL) for the application. It manages all interactions with Reddit's Redis

## Page 12

instance.
5.1 Redis Data Modeling and Limitations
Reddit provides a Redis instance for data storage, but it comes with strict quotas: typically a
500MB storage limit per installation.6 This constraint necessitates a disciplined data
modeling strategy.
The data model for "Get Rich Fast" utilizes a key-value structure optimized for two distinct
access patterns:
1. Read-Heavy Global State: The daily scenario is read by every user every time they
load the game. We cache this in a dedicated market:latest key for O(1) access
complexity.
2. Write-Heavy User State: User balances are stored individually. To prevent "noisy
neighbor" issues and allow for potential future leaderboards, we store user data with
namespaced keys user:{id}:balance.
5.2 Data Archival and Expiry
To adhere to the storage limits, we implement an automatic expiration policy (TTL) on
historical data. While the current day's scenario is kept indefinitely (until overwritten),
historical scenarios stored in market:history:{date} are set to expire after 30 days. This "rolling
window" approach ensures that the database does not grow unboundedly over time, which
would eventually crash the app once the 500MB limit is reached.
5.3 Source Code Specification: src/data/backups.ts
TypeScript
import { Devvit } from '@devvit/public-api';
import { MarketScenario } from '../server/gemini.js';
/**
* Persists the daily scenario to Redis.
* This function updates the 'current' state and archives the previous state.
*/
export async function backupDailyState(
context: Devvit.Context,
dateKey: string,
scenario: MarketScenario
): Promise<void> {
const serialized = JSON.stringify(scenario);

## Page 13

// 1. Update the 'latest' pointer.
// This is the key fetched by the Webview on load.
await context.redis.set('market:latest', serialized);
// 2. Archive the day's event for history features.
// We verify strict TTL (Time To Live) to manage storage quotas.
const historyKey = `market:history:${dateKey}`;
await context.redis.set(historyKey, serialized);
await context.redis.expire(historyKey, 60 * 60 * 24 * 30); // 30 day retention
}
/**
* Retrieves the active scenario.
* Includes a "Day 0" fallback if the database is empty.
*/
export async function getLatestScenario(context: Devvit.Context): Promise<MarketScenario> {
const data = await context.redis.get('market:latest');
if (!data) {
// Default state for the very first run before the scheduler fires.
return {
headline: "WELCOME TO THE CASINO",
subtext: "The market is waiting for the opening bell. Patience, degenerate.",
mood: "BULL",
advisor_vic: "Ready to bet the house?",
advisor_sal: "Keep your money under the mattress.",
movement: 0
};
}
return JSON.parse(data);
}
/**
* Updates a user's balance based on their action (YOLO vs FOLD).
* This function encapsulates the core game logic for the simulation.
*/
export async function processTrade(
context: Devvit.Context,
userId: string,
action: 'YOLO' | 'FOLD',
marketMovement: number
): Promise<number> {

## Page 14

const balanceKey = `user:${userId}:balance`;
// Fetch current balance or initialize with starting capital ($1000)
const currentBalanceStr = await context.redis.get(balanceKey);
let balance = currentBalanceStr? parseInt(currentBalanceStr) : 1000;
if (action === 'FOLD') {
// FOLD logic: Player sits out.
// Optional: Deduct a small "inflation fee" to discourage passivity?
// For now, we return balance unchanged.
return balance;
}
// YOLO Logic: Balance moves by the market percentage.
// Leveraged logic: The movement is applied directly to the principal.
const multiplier = 1 + (marketMovement / 100);
balance = Math.floor(balance * multiplier);
// Bankruptcy Protection:
// In true WSB fashion, you can't go below $1 (need bus money).
if (balance <= 0) balance = 1;
// Persist new balance
await context.redis.set(balanceKey, balance.toString());
return balance;
}
6. Frontend Architecture: src/webview/App.tsx
The frontend is where the "Manga" aesthetic 7 is realized. We employ React, the standard
framework for Devvit Webviews, alongside rigorous CSS Grid implementations to create the
requested layout.
6.1 The "Manga" Layout Strategy
The layout is a direct translation of the visual requirements into CSS Grid. The interface is
partitioned vertically into three rigidly defined zones:
1. Panel 1: The News (Top): This panel demands a "jagged" bottom border to mimic the
torn paper or explosive action lines typical of manga. We achieve this using the
clip-path CSS property with a polygon() function, creating a sawtooth pattern that no

## Page 15

standard border style can replicate.19
2. Panel 2: The Advisor (Middle): This section hosts the characters. The background
must feature a "halftone" dot pattern, a staple of manga printing. We simulate this using
CSS radial-gradient transparency layers.7
3. Panel 3: The Action (Bottom): A high-contrast control deck containing the two primary
interaction points: "YOLO" and "FOLD".
6.2 State Management and Interaction
The React component receives its initial state (date, scenario, username) via props injected by
the server-side render in main.ts. This ensures the UI renders immediately with content, vital
for maintaining user engagement. Local state (balance, tradeResult) handles the immediate
feedback loop of the game mechanics.
6.3 Source Code Specification: src/webview/App.tsx
TypeScript
import React, { useState, useEffect } from 'react';
import { MarketScenario } from '../server/gemini';
import { Characters } from './components/Characters';
import './App.css'; // Importing the CSS defined in section 6.4
interface AppProps {
// Data passed from server logic
date: string;
scenario: MarketScenario;
username: string;
}
export const App: React.FC<AppProps> = ({ date, scenario, username }) => {
// Local state for the interaction simulation
const = useState<string | null>(null);
// The 'Mood' determines the primary accent color across the UI.
// We stick to a strict 2-color signal palette:
// BULL = Terminal Green (#00FF41)
// BEAR = Alert Red (#FF0033)
const accentColor = scenario.mood === 'BULL'? '#00FF41' : '#FF0033';
/**
* Handling the core game action.

## Page 16

* In a full implementation, this would send a message back to the Devvit server
* to persist the new balance via context.redis.
*/
const handleAction = (action: 'YOLO' | 'FOLD') => {
// Simulate the result for immediate feedback
if (action === 'FOLD') {
setTradeResult("You kept your cash. Boring, but safe.");
} else {
const gain = scenario.movement > 0;
setTradeResult(
gain
? `GAINS! You're eating tendies tonight! (+${scenario.movement}%)`
: `GUH. You lost it all. (-${Math.abs(scenario.movement)}%)`
);
}
};
return (
<div
className="manga-container"
style={{ '--accent': accentColor } as React.CSSProperties}
>
{/* PANEL 1: THE NEWS */}
{/* Uses the clip-path border effect */}
<div className="panel-news manga-border-bottom">
<div className="header-row">
<span className="news-date">VOL. {date}</span>
<span className="news-ticker">GRF-SIM</span>
</div>
<h1 className="news-headline">{scenario.headline}</h1>
<p className="news-subtext">{scenario.subtext}</p>
<div className="market-movement" style={{ color: accentColor }}>
MARKET: {scenario.movement > 0? '+' : ''}{scenario.movement}%
</div>
</div>
{/* PANEL 2: THE ADVISOR */}
{/* Uses the halftone background effect */}
<div className="panel-advisor manga-bg">
<Characters

## Page 17

mood={scenario.mood}
vicQuote={scenario.advisor_vic}
salQuote={scenario.advisor_sal}
accentColor={accentColor}
/>
</div>
{/* PANEL 3: THE ACTION */}
<div className="panel-action">
{!tradeResult? (
<div className="button-grid">
<button
className="btn-yolo"
onClick={() => handleAction('YOLO')}
style={{ borderColor: accentColor, color: accentColor }}
>
YOLO
</button>
<button
className="btn-fold"
onClick={() => handleAction('FOLD')}
>
FOLD
</button>
</div>
) : (
<div className="result-display" style={{ borderColor: accentColor }}>
<h2 style={{ color: accentColor }}>{tradeResult}</h2>
<p>Check back tomorrow for the next opening bell.</p>
</div>
)}
</div>
</div>
);
};
6.4 CSS Implementation: src/webview/App.css
The following CSS is critical for the visual identity and must be included in the project. It
handles the clip-path geometry and the halftone generation.
CSS

## Page 18

:root {
--black: #111;
--white: #fff;
--accent: #00FF41; /* Default, overridden by React inline style */
}
/* Base Layout */
.manga-container {
display: grid;
grid-template-rows: auto 1fr 140px; /* News fits content, Advisors fill space, Action fixed
height */
height: 100vh;
background: var(--white);
font-family: 'Courier New', Courier, monospace; /* Monospace for that "Terminal/Document"
feel */
color: var(--black);
overflow: hidden;
}
/* Panel 1: News */
.panel-news {
padding: 20px;
background: var(--white);
border-bottom: 5px solid var(--black);
position: relative;
z-index: 10;
/* The jagged edge effect at the bottom */
/* This polygon defines a sawtooth pattern along the bottom edge (95%-100% Y) */
clip-path: polygon(
0% 0%, 100% 0%, 100% 95%,
95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%,
60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%,
25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%
);
}
.news-headline {
font-size: 2.5rem;
font-weight: 900;
text-transform: uppercase;
margin: 10px 0;

## Page 19

line-height: 0.9;
letter-spacing: -2px;
}
/* Panel 2: Advisor */
.panel-advisor {
position: relative;
display: flex;
align-items: center;
justify-content: center;
}
.manga-bg {
/* Creating the Halftone (Dot) Pattern */
/* Two radial gradients offset by 5px create the interlocking dot matrix */
background-image:
radial-gradient(var(--black) 20%, transparent 20%),
radial-gradient(var(--black) 20%, transparent 20%);
background-color: var(--white);
background-position: 0 0, 5px 5px;
background-size: 10px 10px;
opacity: 0.15; /* Subtle texture, not overwhelming */
}
/* Panel 3: Action */
.panel-action {
background: var(--black);
padding: 10px;
display: flex;
align-items: center;
justify-content: center;
}
.button-grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 20px;
width: 100%;
max-width: 600px;
}
button {
height: 80px;

## Page 20

font-family: inherit;
font-weight: 900;
font-size: 1.5rem;
text-transform: uppercase;
border: 4px solid;
cursor: pointer;
transition: transform 0.1s;
}
button:active {
transform: scale(0.95);
}
.btn-yolo {
background: var(--black);
/* Accent color provided by inline style from React */
}
.btn-fold {
background: var(--white);
color: var(--black);
border-color: var(--white);
}
.result-display {
color: var(--white);
text-align: center;
border: 2px dashed;
padding: 20px;
width: 100%;
}
7. Visual Components:
src/webview/components/Characters.tsx
The visual representation of the characters "Vic" and "Sal" relies on SVG manipulation rather
than raster images. This approach is superior for the Devvit environment as it keeps the
bundle size small and allows for dynamic recoloring based on the mood variable without
needing to load separate assets.7

## Page 21

7.1 SVG Path Selection and Logic
We utilize standard icon geometries that are publicly available to construct the silhouettes.
● Vic (The Bull): Represented by a "Man in Suit" silhouette. This captures the "Wall
Street" persona—clean lines, tie, professional but potentially reckless.
● Sal (The Bear): Represented by a "Detective/Spy" silhouette (Hat and Trenchcoat). This
visual shorthand communicates mystery, cynicism, and age ("Old Man").22
7.2 Source Code Specification:
src/webview/components/Characters.tsx
TypeScript
import React from 'react';
interface CharactersProps {
mood: 'BULL' | 'BEAR';
vicQuote: string;
salQuote: string;
accentColor: string;
}
export const Characters: React.FC<CharactersProps> = ({ mood, vicQuote, salQuote,
accentColor }) => {
// Vic Path: Standard "User Tie" geometry
const vicPath = "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128
128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0
422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5
48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z";
// Sal Path: "User Secret" geometry (Hat/Coat)
const salPath = "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128
128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0
422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5
48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z";
// Note regarding SVG Paths:
// In a production environment, exact path data from FontAwesome or similar
// open libraries would be pasted here. The strings above are illustrative
// placeholders for the complex coordinate data required for high-fidelity icons.

## Page 22

return (
<div className="characters-grid" style={{
display: 'grid',
gridTemplateColumns: '1fr 1fr',
width: '100%',
height: '100%',
alignItems: 'end',
paddingBottom: '20px'
}}>
{/* VIC (Left) - The Aggressor */}
<div className="char-container vic" style={{ textAlign: 'center', position: 'relative' }}>
{/* Speech Bubble: Vic's advice */}
<div className="speech-bubble" style={{
background: '#fff',
border: `3px solid ${accentColor}`,
padding: '10px',
marginBottom: '10px',
borderRadius: '10px 10px 10px 0',
fontWeight: 'bold',
boxShadow: '4px 4px 0px #000'
}}>
"{vicQuote}"
</div>
{/* Vic Avatar */}
<svg viewBox="0 0 448 512" height="180" width="180">
<path d={vicPath} fill={mood === 'BULL'? accentColor : '#333'} />
</svg>
<div className="char-name" style={{ fontWeight: 900, marginTop: '5px' }}>VIC</div>
</div>
{/* SAL (Right) - The Pessimist */}
<div className="char-container sal" style={{ textAlign: 'center', position: 'relative' }}>
{/* Speech Bubble: Sal's advice */}
<div className="speech-bubble" style={{
background: '#fff',
border: '3px solid #000',
padding: '10px',
marginBottom: '10px',
borderRadius: '10px 10px 0 10px',
fontStyle: 'italic',

## Page 23

boxShadow: '-4px 4px 0px #000'
}}>
"{salQuote}"
</div>
{/* Sal Avatar */}
<svg viewBox="0 0 448 512" height="180" width="180">
<path d={salPath} fill={mood === 'BEAR'? accentColor : '#333'} />
</svg>
<div className="char-name" style={{ fontWeight: 900, marginTop: '5px' }}>SAL</div>
</div>
</div>
);
};
8. Deployment Strategy and Testing
Deploying a serverless application with scheduled components requires a specific sequence
of operations to ensure all dependencies (specifically the external API keys) are present
before the code begins execution.
8.1 Pre-Deployment Checklist
1. API Key Configuration: The Gemini API key must be securely stored in the app's
settings. This is done via the CLI command:
devvit settings set gemini_api_key "YOUR_GOOGLE_API_KEY"
2. Asset Handling: While this implementation relies on SVGs, if any static raster assets
were to be added, they would need to be placed in the assets/ directory and declared in
devvit.json.
8.2 Testing the "Daily" Loop
Testing a 24-hour cycle is impractical during development. This is why the main.ts file includes
the "Force Market Open" menu item. The recommended testing workflow is:
1. Run devvit playtest <subreddit>.
2. Navigate to the subreddit as a moderator.
3. Trigger "Force Market Open" from the subreddit menu.
4. Verify in the logs that:
○ The Gemini API was called.
○ The JSON was parsed correctly.
○ The Redis keys (market:latest) were updated.

## Page 24

5. Load the custom post and verify the Webview hydrates with the new content.
8.3 Error Handling and Resilience
The system is designed with a "fail-open" philosophy. If the Gemini API fails (quota limits,
outage), the generateDailyScenario function catches the error and returns a hardcoded
"Market Halt" scenario. This ensures that the scheduled job never crashes the application
entirely, and users always see some valid state when they load the game.
9. Conclusion
"Get Rich Fast" illustrates the potential of the Reddit Devvit platform to host complex, stateful
narratives without traditional infrastructure. By strictly adhering to a serverless pattern,
leveraging Redis for state continuity, and utilizing Generative AI for endless content variety,
this architecture delivers a high-engagement experience with minimal operational overhead.
The rigorous application of the "Manga" aesthetic through CSS and SVG manipulation further
ensures the product stands out in the feed, satisfying the unique cultural expectations of its
target audience.
Works cited
1. Ultimate Guide to WallStreetBets Terms and Lingo | SWFI, accessed February 3,
2026,
https://www.swfinstitute.org/news/84215/ultimate-guide-to-wallstreetbets-terms
-and-lingo
2. The Ultimate Guide to Reddit's Wallstreetbets Slang - Infinity Investing, accessed
February 3, 2026, https://infinityinvesting.com/wallstreetbets-slang-meaning/
3. Building Reddit Game with Devvit and TypeScript (starter included) - DEV
Community, accessed February 3, 2026,
https://dev.to/room_js/building-reddit-game-with-devvit-and-typescript-starter-i
ncluded-3kcp
4. @devvit/server | Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/devvit_web/server
5. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler
6. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis
7. Context_ Manga UI Architecture.pdf
8. A Responsive Comic Panel Layout with CSS Grid - Nevin Katz, accessed February
3, 2026, https://nevkatz.github.io/2020/01/06/css-grid-intro.html
9. Z-Shaped Pattern For Reading Web Content | by Nick Babich | UX Planet,
accessed February 3, 2026,
https://uxplanet.org/z-shaped-pattern-for-reading-web-content-ce1135f92f1c
10. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
11. Automating Daily Interactive Posts with Dynamic Images on Devvit - Reddit,

## Page 25

accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1ojdk2i/automating_daily_interactive_
posts_with_dynamic/
12. Working with useState - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/working_with_usestate
13. Web views - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/webviews
14. Gemini 3.0 Flash: Google's Greatest Model Ever? Most Powerful, Cheapest, &
Fastest Model! (Tested), accessed February 3, 2026,
https://www.youtube.com/watch?v=izXjYxKTI_k
15. Learn about supported models | Firebase AI Logic - Google, accessed February 3,
2026, https://firebase.google.com/docs/ai-logic/models
16. How to get JSON output from gemini-1.5-pro-001 using curl - Stack Overflow,
accessed February 3, 2026,
https://stackoverflow.com/questions/78779183/how-to-get-json-output-from-ge
mini-1-5-pro-001-using-curl
17. Generate structured output (like JSON and enums) using the Gemini API |
Firebase AI Logic, accessed February 3, 2026,
https://firebase.google.com/docs/ai-logic/generate-structured-output
18. What are you using for storage? : r/Devvit - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1qktf3v/what_are_you_using_for_stor
age/
19. Paths, shapes, clipping, and masking - CSS - web.dev, accessed February 3, 2026,
https://web.dev/learn/css/paths-shapes-clipping-masking
20. Using CSS Masks to Create Jagged Edges, accessed February 3, 2026,
https://css-tricks.com/using-css-masks-to-create-jagged-edges/
21. Person standing dress · Bootstrap Icons, accessed February 3, 2026,
https://icons.getbootstrap.com/icons/person-standing-dress/
22. Men in Suits Silhouette Svg - Etsy, accessed February 3, 2026,
https://www.etsy.com/market/men_in_suits_silhouette_svg?ref=lp_queries_intern
al_bottom-5
23. Old man with hat silhouette Images - Free Download on Freepik, accessed
February 3, 2026,
https://www.freepik.com/free-photos-vectors/old-man-with-hat-silhouette


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/hive_mind/Devvit_Game_Hackathon_Design.md

# Devvit Game Hackathon Design.pdf

## Page 1

Architectural Specification and
Technical Implementation Report: "The
Hive Mind Gauntlet"
1. Executive Summary
This comprehensive technical report outlines the architectural validation, design specification,
and implementation strategy for "The Hive Mind Gauntlet," a serverless daily gaming
application designed for the Reddit Daily Games 2026 Hackathon. The primary objective is to
engineer a "Best Daily Game" contender that strictly adheres to the constraint of zero
external self-hosted infrastructure. The proposed solution operates exclusively within the
Reddit Devvit runtime environment, leveraging Google’s Gemini API for dynamic content
generation and Reddit’s native Redis instance for state persistence.
The "Hive Mind Gauntlet" concept capitalizes on the specific capabilities of Large Language
Models (LLMs) to analyze community discourse and generate trivia that tests a user's
alignment with the "hive mind" of a specific subreddit. By automating this process via
scheduled server-side jobs, the application achieves the "Daily" requirement without manual
intervention.
Our technical analysis confirms that the Devvit platform, despite its execution constraints, is
capable of supporting this architecture through the rigorous application of asynchronous
patterns, atomic database operations, and strictly typed interactions with the Gemini API. This
report serves as a complete implementation guide, detailing the migration from legacy
configuration formats to the modern devvit.json standard, establishing robust error handling
for LLM rate limits, and providing production-ready code for the entire stack.

## Page 2

2. Architectural Philosophy and Constraint Analysis
The foundational challenge of this project is the "No External Backend" constraint. Traditional
web applications rely on persistent servers (like EC2 or DigitalOcean) to manage cron jobs,
maintain database connections, and process long-running tasks. In the Devvit ecosystem,
these capabilities are replaced by ephemeral, serverless functions with strict execution limits.
2.1. The Serverless Paradigm on Devvit
The architecture relies on a clear separation of concerns between the Data Plane (Redis), the
Control Plane (Scheduler & Triggers), and the Presentation Plane (Devvit Blocks).
As detailed in the architecture analysis, the system data flow begins with the Scheduler, which
triggers the server-side Daily Generator job. This secure, server-side process fetches top
posts from the subreddit and transmits them to the External Service (Gemini API) for
processing. The LLM returns a JSON payload containing the daily challenge, which the
Generator validates and caches into the Internal Storage (Redis). Finally, the Player Interface
(Client-side) polls the Redis cache to retrieve the challenge and submit votes, ensuring that
the heavy lifting of content generation is decoupled from the user's immediate gameplay
experience. This separation is critical because it ensures that client-side latency is

## Page 3

minimized—users are reading pre-computed JSON from Redis rather than waiting for an LLM
to generate text in real-time.
2.2. Technical Validation of Platform Capabilities
2.2.1. HTTP Connectivity and Allowlist Compliance
A critical validation step involves ensuring the Devvit application can communicate with
Google's Gemini API. The Devvit platform enforces a strict allowlist for fetch requests to
prevent abuse.1
Research confirms that generativelanguage.googleapis.com, the endpoint for Gemini, is
explicitly included in the global fetch allowlist.2 This allows direct connectivity without the
need for a proxy server, which would violate the hackathon's "no external backend" rule.
However, significant restrictions apply:
● Protocol: Only https is allowed.1
● Timeout: The fetch request has a hard timeout of 30 seconds.1
● Context: Requests to external domains are permitted from server-side plugins
(schedulers, triggers) but are restricted on the client-side (frontend blocks) to prevent
exposing API keys and violating CORS policies.1
Therefore, the architecture must route all LLM interactions through a server-side job, never
directly from the user's client.
2.2.2. Execution Time Limits: Wall Clock vs. CPU Time
One of the most misunderstood constraints of the Devvit platform is the execution time limit.
Documentation states an "App Execution Overall Time Limit" of 1 second.3 At first glance, this
appears incompatible with LLM calls that may take 5–10 seconds to complete.
However, a deeper analysis of the runtime behavior reveals a crucial nuance: the timer pauses
while awaiting external I/O operations.3
● Scenario: The app sends a request to Gemini (taking 500ms of CPU time to prepare).
● Pause: The app awaits the response for 8 seconds. The execution timer is paused.
● Resume: The response arrives. The app processes the JSON and saves to Redis (taking
200ms of CPU time).
● Total CPU Time: 700ms (Safe).
● Total Wall Time: 8.7 seconds (Safe, as it is under the 30s fetch timeout).
This validation confirms that complex LLM generation is feasible, provided the data
processing logic (parsing, validating, stringifying) is optimized and efficient.
2.2.3. Redis Atomicity and Concurrency
For a "Best Daily Game," high user concurrency is expected. If 5,000 users vote on a trivia
answer simultaneously, the database must handle these writes without data loss.
Redis is single-threaded, which inherently prevents race conditions during the execution of a
single command.4 However, application-level race conditions can still occur if using a
"Read-Modify-Write" pattern (e.g., getting a value, incrementing it in JavaScript, and setting it

## Page 4

back).
The Solution: Atomic Increments We validated the availability of the redis.incrBy command
within the Devvit SDK.6 This command instructs the Redis server to increment the value at a
specific key by a specified integer in a single atomic operation. This ensures that even if 100
requests arrive in the same millisecond, the final count will be accurate, making it the only
viable strategy for a voting mechanic.
3. Detailed Component Analysis
3.1. The Intelligence Layer: Gemini API Integration
The core differentiator of "The Hive Mind Gauntlet" is its dynamic content. We utilize the
Gemini 1.5 Flash model due to its speed and cost-efficiency for high-frequency tasks.7
3.1.1. Structured Output and JSON Schema
LLMs are probabilistic engines, and integrating them into a deterministic game loop requires
strict output control. "Hallucinations" in the output format (e.g., missing brackets, wrong keys)
would crash the game.
To mitigate this, we utilize Gemini's "Response Schema" capability (often referred to as
Controlled Generation or JSON Mode).8 By passing a strictly defined JSON schema in the
generationConfig, we force the model to output a valid JSON object matching our
DailyChallenge interface.
Schema Definition Strategy:
● Enums: We restrict option IDs to specific strings if necessary, though dynamic ID
generation is preferred for flexibility.
● Arrays: The schema explicitly defines an array of objects for the trivia options, ensuring
the frontend always receives an iterable list.9
● MIME Type: The responseMimeType must be set to application/json.9
3.1.2. Handling 429 Resource Exhaustion
The hackathon environment implies we may be using free or standard tier API keys, which are
subject to rate limits (Requests Per Minute - RPM). A 429 RESOURCE_EXHAUSTED error is a
non-negotiable failure mode that must be handled gracefully.11
The implementation utilizes an Exponential Backoff strategy. When a 429 is received, the
system pauses execution for a base delay (e.g., 1000ms), then retries. If it fails again, the
delay doubles (2000ms), and so on. This approach aligns with Google's recommended
practices for handling LLM resource exhaustion.12

## Page 5

3.2. The Orchestration Layer: Scheduler and Configuration
3.2.1. Configuration Migration: devvit.yaml to devvit.json
The original request referenced devvit.yaml. It is crucial to note that devvit.yaml has been

## Page 6

deprecated in favor of devvit.json.13 Modern Devvit CLI versions (0.11+) default to JSON. Using
YAML now can lead to deployment errors or compatibility issues with newer features like
Blocks.
Our implementation uses devvit.json to define:
● Permissions: Explicitly enabling http, scheduler, redis, and redditAPI.
● Assets: Defining the web root (if using Devvit Web) or entry point.
● Scheduled Tasks: Defining the cron schedule and endpoint mapping.15
3.2.2. The Cron Schedule
To satisfy the "Daily Game" category, consistency is key. We define a cron job 0 0 * * *
(Midnight UTC).16 This ensures that every day, a new challenge is generated.
Job Persistence: Research indicates that scheduled jobs persist across app upgrades unless
explicitly cleared or the app is uninstalled.17 This reliability is vital for a "set and forget"
architecture.
3.3. The Storage Layer: Redis Schema Design
Given the 500MB storage limit per installation 18, efficiently modeling the data is paramount.
We adopt a Time-Series Key-Value approach.
Key Namespacing Strategy:
Using the date as a primary key segment allows for easy expiration and historical lookup.
● Global Config: config:latest_date -> Stores "2026-02-12". This acts as a pointer to the
current active game.
● Game Data: challenge:2026-02-12:data -> Stores the massive JSON blob.
● Votes: challenge:2026-02-12:votes:{option_id} -> Stores an integer. Separation of votes
from the data blob allows for atomic incrBy operations without needing to read/write
the entire JSON object.19
● User State: user:{user_id}:played:2026-02-12 -> Boolean flag (1 or 0). This prevents
double-voting.
4. Implementation Specification
The following sections contain the exact, validated code required for deployment.
4.1. Project Configuration (devvit.json)
This file replaces the legacy devvit.yaml. It explicitly requests the necessary permissions. Note
the explicit listing of generativelanguage.googleapis.com in the HTTP domain allowlist, which
is mandatory for the API to function.1
JSON

## Page 7

{
"$schema": "https://developers.reddit.com/schema/config-file.v1.json",
"name": "hive-mind-gauntlet",
"version": "1.0.0",
"blocks": {
"entry": "src/main.tsx"
},
"permissions": {
"http": {
"enable": true,
"domains": [
"generativelanguage.googleapis.com"
]
},
"reddit": {
"enable": true,
"scope": "app",
"asUser": [
"read"
]
},
"redis": true,
"scheduler": true
},
"scheduler": {
"tasks": {
"generate_daily_challenge": {
"cron": "0 0 * * *",
"endpoint": "/jobs/daily_generator"
}
}
}
}
4.2. Secure Backend Module (src/backend/llm.ts)
This module encapsulates the logic for communicating with Gemini. It includes the defined
DailyChallenge interface, the exponential backoff logic for 429 handling, and the JSON
schema construction.
Code Logic Analysis:
1. Interface Definition: DailyChallenge defines the contract between the backend and
frontend.
2. fetchWithBackoff: This recursive function handles the retries. Note the await new

## Page 8

Promise(...) delay. This is where the Devvit execution timer pauses, allowing us to wait
out the rate limit without crashing the app.3
3. generateChallengeFromText: This function constructs the prompt. It sets
responseMimeType: "application/json" and provides the schema object, forcing Gemini
1.5 Flash to return parseable data.8
TypeScript
import { Settings } from '@devvit/public-api';
// Interface for the structured game data we expect from Gemini
export interface DailyChallenge {
question: string;
options: {
id: string;
text: string;
};
correctOptionId: string;
explanation: string;
}
const GEMINI_API_URL =
'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
;
/**
* Robust fetcher with Exponential Backoff for 429 handling.
*
* @param url The API endpoint
* @param options Fetch options (method, body, headers)
* @param retries Number of remaining retries (default 3)
* @param delay Current delay in ms (default 1000)
*/
async function fetchWithBackoff(url: string, options: any, retries = 3, delay = 1000):
Promise<Response> {
try {
const response = await fetch(url, options);
// Handle Rate Limiting (429)
if (response.status === 429) {
if (retries <= 0) throw new Error('Max retries exceeded for Gemini API (429)');

## Page 9

console.log(`Rate limited. Retrying in ${delay}ms...`);
// Wait for the delay (Note: Devvit execution timer pauses during await)
await new Promise(resolve => setTimeout(resolve, delay));
return fetchWithBackoff(url, options, retries - 1, delay * 2); // Double delay
}
return response;
} catch (error) {
if (retries <= 0) throw error;
console.warn(`Fetch error: ${error}. Retrying...`);
await new Promise(resolve => setTimeout(resolve, delay));
return fetchWithBackoff(url, options, retries - 1, delay * 2);
}
}
export async function generateChallengeFromText(postText: string, apiKey: string):
Promise<DailyChallenge> {
const prompt = `
You are a game master for a Reddit trivia game called 'The Hive Mind Gauntlet'.
Analyze the following Reddit post content and create a multiple-choice trivia question
based on it.
The question should test if the user understands the nuance of the post.
Post Content: "${postText.substring(0, 5000)}" // Truncate to avoid token limits
`;
// Strict JSON Schema for Gemini 1.5
// See: https://ai.google.dev/gemini-api/docs/structured-output
const schema = {
type: "OBJECT",
properties: {
question: { type: "STRING" },
options: {
type: "ARRAY",
items: {
type: "OBJECT",
properties: {
id: { type: "STRING" },
text: { type: "STRING" }
},
required: ["id", "text"]
}
},

## Page 10

correctOptionId: { type: "STRING" },
explanation: { type: "STRING" }
},
required: ["question", "options", "correctOptionId", "explanation"]
};
const body = {
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
responseMimeType: "application/json",
responseSchema: schema
}
};
const response = await fetchWithBackoff(`${GEMINI_API_URL}?key=${apiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body)
});
if (!response.ok) {
const errText = await response.text();
throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
}
const data = await response.json();
// Gemini 1.5 structure for candidate text
const rawJson = data.candidates?.?.content?.parts?.?.text;
if (!rawJson) {
throw new Error("Invalid response structure from Gemini.");
}
// Parse and return the validated JSON
try {
return JSON.parse(rawJson) as DailyChallenge;
} catch (e) {
console.error("JSON Parse Error on LLM output", rawJson);
throw new Error("Failed to parse LLM output as JSON");
}
}

## Page 11

4.3. The Scheduler Job (src/jobs/daily_generator.ts)
This script is the engine of the application. It runs autonomously once per day.
Post Selection Strategy: The script utilizes reddit.getTopPosts with time: 'day'. This ensures
the content is fresh and relevant.20 If the subreddit has no posts in the last 24 hours (a rare
edge case for active subs), error handling is essential.
Secure Execution: The API key is retrieved via context.settings.get('gemini-api-key').21 This
context is only available server-side, ensuring the key is never sent to a client's browser.
TypeScript
import { Devvit } from '@devvit/public-api';
import { generateChallengeFromText, DailyChallenge } from '../backend/llm.js';
// Helper to format date as YYYY-MM-DD for Redis keys
const getTodayKey = () => new Date().toISOString().split('T');
Devvit.addSchedulerJob({
name: 'generate_daily_challenge',
onRun: async (event, context) => {
console.log('Starting Daily Challenge Generation Job...');
// 1. Get API Key securely from Secret Storage
const apiKey = await context.settings.get('gemini-api-key');
if (!apiKey) {
console.error('CRITICAL: Missing Gemini API Key in settings');
return;
}
// 2. Fetch Top Post from the current subreddit
const subreddit = await context.reddit.getCurrentSubreddit();
// We request a limit of 5 to ensure we find at least one text-heavy post if needed
const topPosts = await context.reddit.getTopPosts({
subredditName: subreddit.name,
time: 'day',
limit: 5
}).all();
if (topPosts.length === 0) {
console.error('No posts found to generate content from.');

## Page 12

return;
}
// Simple heuristic: Prefer posts with selftext, otherwise use title
const targetPost = topPosts.find(p => p.selftext && p.selftext.length > 50) |
| topPosts;
const postContent = `Title: ${targetPost.title}\n\nBody: ${targetPost.selftext |
| '(No body)'}`;
console.log(`Generating challenge from post ID: ${targetPost.id}`);
// 3. Generate Content via Gemini
try {
const challengeData = await generateChallengeFromText(postContent, apiKey as string);
console.log('Challenge generated successfully:', challengeData.question);
// 4. Persistence via Redis
const dateKey = getTodayKey();
const redisKey = `challenge:${dateKey}:data`;
// Store the challenge JSON
await context.redis.set(redisKey, JSON.stringify(challengeData));
// Update the pointer to the latest challenge
// This allows the frontend to always know what "today" is according to the server
await context.redis.set('config:latest_date', dateKey);
// Initialize vote counters to 0 (optional, but good practice)
for (const option of challengeData.options) {
const voteKey = `challenge:${dateKey}:votes:${option.id}`;
// Only set if not exists to avoid resetting active votes if job re-runs
const exists = await context.redis.get(voteKey);
if (!exists) {
await context.redis.set(voteKey, '0');
}
}
console.log(`Daily challenge for ${dateKey} saved and active.`);
} catch (error) {

## Page 13

console.error('Failed to generate daily challenge:', error);
// Future improvement: Set a "fallback" generic challenge here
}
},
});
4.4. The Player Interface (src/main.tsx)
This file implements the user experience using Devvit Blocks. It employs the useAsync hook
for data fetching and useInterval for live polling.
Critical Implementation Note on useAsync: Recent developer reports 22 indicate that
calling setState directly inside the main body of a useAsync callback can lead to infinite loops
or state update failures. The robust pattern is to return data from the async function and rely
on the data property provided by the hook, or use a finally block if state setting is absolutely
necessary. The implementation below follows the "Return Data" pattern for maximum stability.
TypeScript
import { Devvit, useState, useAsync, useInterval } from '@devvit/public-api';
// Configuration for the Frontend Context
Devvit.configure({
redditAPI: true,
redis: true,
});
// Re-define schema locally to ensure type safety in the UI
type ChallengeData = {
question: string;
options: { id: string; text: string };
correctOptionId: string;
explanation: string;
};
Devvit.addCustomPostType({
name: 'Hive Mind Gauntlet',
height: 'tall',
render: (context) => {
// --- Local State Management ---
const [userVoted, setUserVoted] = useState(false);
const = useState<string | null>(null);
const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});

## Page 14

// --- Data Fetching Layer ---
// 1. Discovery: Get the Current Date Key (The "Pointer")
const { data: dateKey, loading: dateLoading } = useAsync(async () => {
return await context.redis.get('config:latest_date');
});
// 2. Content: Get the Challenge Data (Dependent on dateKey)
const { data: challenge, loading: challengeLoading } = useAsync(async () => {
if (!dateKey) return null;
const json = await context.redis.get(`challenge:${dateKey}:data`);
return json? JSON.parse(json) as ChallengeData : null;
}, { depends: [dateKey] });
// 3. User State: Check if User has already voted today
const { data: hasVotedData, loading: voteCheckLoading } = useAsync(async () => {
if (!dateKey ||!context.userId) return false;
const userVoteKey = `user:${context.userId}:played:${dateKey}`;
const val = await context.redis.get(userVoteKey);
return val === '1';
}, { depends: [dateKey, context.userId] });
// Synchronization: Update local state once async checks complete
if (hasVotedData === true &&!userVoted) {
setUserVoted(true);
}
// --- Interaction Layer ---
const handleVote = async (optionId: string) => {
if (userVoted ||!dateKey ||!context.userId) return;
// Optimistic UI Update: Make the UI feel instant
setUserVoted(true);
setSelectedOption(optionId);
// Persist to Redis (Fire and Forget - we don't await the UI update on this)
// A. Mark User as Played (Idempotency Key)
await context.redis.set(`user:${context.userId}:played:${dateKey}`, '1');
// B. Atomic Increment of Vote Counter
const voteKey = `challenge:${dateKey}:votes:${optionId}`;

## Page 15

await context.redis.incrBy(voteKey, 1);
// Trigger an immediate fetch of new counts
fetchCounts();
};
// Helper: Fetch latest counts from Redis
const fetchCounts = async () => {
if (!dateKey ||!challenge) return;
const newCounts: Record<string, number> = {};
// Parallel fetch for minimal latency
await Promise.all(challenge.options.map(async (opt) => {
const key = `challenge:${dateKey}:votes:${opt.id}`;
const count = await context.redis.get(key);
newCounts[opt.id] = count? parseInt(count) : 0;
}));
setVoteCounts(newCounts);
};
// --- Real-time Layer ---
// Poll for vote updates every 5 seconds, ONLY if the user has already voted.
// This reduces read pressure on Redis for passive viewers.
useInterval(() => {
if (userVoted) fetchCounts();
}, 5000);
// Initial fetch of counts if the user loads the app and has already voted
useAsync(async () => {
if (hasVotedData) await fetchCounts();
}, { depends: });
// --- Presentation Layer (Render) ---
// Loading State
if (dateLoading |
| challengeLoading |
| voteCheckLoading) {
return (

## Page 16

<vstack alignment="center middle" height="100%">
<text size="large" weight="bold">Connecting to the Hive Mind...</text>
<text size="small" color="dimmed">Syncing neural pathways</text>
</vstack>
);
}
// Error/Empty State
if (!challenge) {
return (
<vstack alignment="center middle" height="100%">
<text>No active challenge found for today.</text>
<text size="small">The Hive Mind is sleeping.</text>
</vstack>
);
}
// Main Game UI
return (
<vstack padding="medium" gap="medium" height="100%">
{/* Header Section */}
<vstack alignment="start">
🧠
<text style="heading" size="xlarge"> The Hive Mind Gauntlet</text>
<text size="small" color="dimmed">Daily Challenge: {dateKey}</text>
</vstack>
{/* Question Card */}
<zstack cornerRadius="medium" padding="medium" backgroundColor="#F0F0F0">
<text size="medium" wrap={true} weight="medium">{challenge.question}</text>
</zstack>
{/* Options List */}
<vstack gap="small">
{challenge.options.map((opt) => {
const isSelected = selectedOption === opt.id;
const isCorrect = opt.id === challenge.correctOptionId;
const count = voteCounts[opt.id] |
| 0;
// Dynamic Button Styling
let buttonAppearance = "secondary";
let buttonColor = undefined;

## Page 17

if (userVoted) {
// If voted, show Truth (Green if correct, Red if wrong but selected)
if (opt.id === challenge.correctOptionId) {
buttonAppearance = "primary"; // Success/Green
} else if (isSelected) {
buttonAppearance = "destructive"; // Error/Red
}
} else if (isSelected) {
buttonAppearance = "primary";
}
return (
<hstack gap="medium" alignment="center middle">
<button
appearance={buttonAppearance as any}
onPress={() => handleVote(opt.id)}
disabled={userVoted} // Disable interactions after voting
grow
>
{opt.text}
</button>
{/* Vote Count Badge */}
{userVoted && (
<text size="small" color="dimmed" weight="bold">
{count}
</text>
)}
</hstack>
);
})}
</vstack>
{/* Post-Game Explanation Context */}
{userVoted && (
<vstack padding="medium" backgroundColor="#E8F0FE" cornerRadius="small">
<text weight="bold" size="large">Insight:</text>
<spacer size="small"/>
<text wrap={true} size="medium">{challenge.explanation}</text>
</vstack>
)}
</vstack>
);

## Page 18

},
});
5. Security and Operational Procedures
5.1. API Key Management
The security of the Gemini API key is paramount. Hardcoding keys into the source code is a
critical vulnerability that will lead to disqualification.
The devvit CLI provides a secure store that encrypts secrets at rest.
Deployment Step:
The developer must manually inject the key into the production environment using the CLI.
This bypasses version control entirely.
Bash
devvit settings set gemini-api-key "AIzaSy..."
This key is then accessed via context.settings.get() solely within the server-side contexts of
src/jobs.
5.2. Rate Limiting and Scalability
While the backend handles 429 errors from Google, the Redis instance faces its own limits.
● Command Limit: Redis supports roughly 40,000 commands per second.6
● Polling Frequency: The frontend polls every 5 seconds.
● Risk: If 200,000 users open the app simultaneously, we could hit 40k reads/sec.
● Mitigation: The useInterval logic in src/main.tsx includes a conditional check if
(userVoted). This ensures that only active participants (those who have finished the
game and are watching results) poll the server. Users who are currently reading the
question do not poll, significantly reducing the load.
6. Conclusion
This report has systematically validated and specified the architecture for "The Hive Mind
Gauntlet." By effectively utilizing Devvit's serverless scheduler as a proxy for a traditional
backend, and leveraging Redis for atomic state management, the application meets all
hackathon constraints. The included code provides a robust, production-ready foundation
that handles real-world edge cases like API rate limiting and high-concurrency voting,
positioning the entry as a strong contender for the "Best Daily Game" category.
Works cited

## Page 19

1. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
2. Global fetch allowlist - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/http-fetch-allowlist
3. Limitations - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/limits
4. Does Redis support concurrent updates (writes) on different keys on a hash data
structure? - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/redis/comments/11e2fxb/does_redis_support_concurre
nt_updates_writes_on/
5. How does Redis handle concurrency for a counter? - Reddit, accessed February
3, 2026,
https://www.reddit.com/r/redis/comments/12whrfr/how_does_redis_handle_conc
urrency_for_a_counter/
6. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis
7. Generate content with the Gemini API in Vertex AI - Google Cloud
Documentation, accessed February 3, 2026,
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/infe
rence
8. Structured outputs | Gemini API - Google AI for Developers, accessed February 3,
2026, https://ai.google.dev/gemini-api/docs/structured-output
9. Generate structured output (like JSON and enums) using the Gemini API |
Firebase AI Logic, accessed February 3, 2026,
https://firebase.google.com/docs/ai-logic/generate-structured-output
10. Improving Structured Outputs in the Gemini API - Google Blog, accessed
February 3, 2026,
https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-st
ructured-outputs/
11. Troubleshooting guide | Gemini API - Google AI for Developers, accessed
February 3, 2026, https://ai.google.dev/gemini-api/docs/troubleshooting
12. Learn how to handle 429 resource exhaustion errors in your LLMs | Google Cloud
Blog, accessed February 3, 2026,
https://cloud.google.com/blog/products/ai-machine-learning/learn-how-to-handl
e-429-resource-exhaustion-errors-in-your-llms
13. Devvit Web - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview
14. Migrating Blocks/Mod Tools to Devvit Web - Reddit for Developers, accessed
February 3, 2026,
https://developers.reddit.com/docs/guides/migrate/devvit-singleton
15. Configure Your App - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configura
tion
16. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler

## Page 20

17. Please help! : r/Devvit - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1h80z8x/please_help/
18. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/redis
19. Redis clients can update cache simultaneously causing wrong state to be saved -
Reddit, accessed February 3, 2026,
https://www.reddit.com/r/webdev/comments/z10s1m/redis_clients_can_update_c
ache_simultaneously/
20. Need help to fetch other posts data... - Devvit - Reddit, accessed February 3,
2026,
https://www.reddit.com/r/Devvit/comments/1n9wioy/need_help_to_fetch_other_p
osts_data/
21. Secrets storage - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/secrets-storage
22. Blocks PSA: Don't use setState within useAsync! : r/Devvit - Reddit, accessed
February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1jrjtp6/blocks_psa_dont_use_setstate
_within_useasync/


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/hive_mind/Devvit_Hackathon_Game_Design.md

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


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/memes/MemeWars__GenAI_Edition_Architecture.md

# MemeWars_ GenAI Edition Architecture.pdf

## Page 1

Architectural Blueprint: MemeWars
GenAI Edition
Engineering a Hybrid GenAI Multiplayer System on the
Reddit Developer Platform
1. Executive Summary
The "Reddit Daily Games 2026" Hackathon presents a convergence of constraints and
opportunities that define the modern era of systems architecture. The objective—to engineer
"MemeWars: GenAI Edition"—requires the synthesis of a constrained, community-embedded
frontend with high-performance, serverless artificial intelligence. As Principal Systems
Architect, the mandate is to deliver a robust technical roadmap that navigates the strict
containment fields of the Reddit Developer Platform (Devvit) while leveraging best-in-class
external infrastructure: Depot for accelerated containerization, Modal for ephemeral GPU
compute, and the advanced reasoning capabilities of Gemini 3 Pro.
The core engineering challenge lies in the "Split-Brain" nature of the application. The game
state, user interface, and social graph reside within Devvit's serverless runtime, which is
intentionally limited to ensure security and performance across the Reddit ecosystem.
Conversely, the generative logic—image synthesis via Flux.1/SDXL and semantic evaluation via
Gemini—requires massive compute resources and execution times that exceed Devvit's strict
30-second timeouts and resource quotas. A naive implementation attempting to bundle these
concerns will fail.
Success demands a decoupled, asynchronous architecture. This report details the design of a
"Long-Poll Relay" pattern, essentially a specialized Backend-for-Frontend (BFF) approach
that uses the Devvit Server as a secure proxy to orchestrate interactions between the Reddit
client and the external GPU cluster. We will dissect the implementation of main.tsx for state
synchronization without WebSockets, the optimization of app.py for high-throughput
orchestration, the deployment of modal_worker.py for millisecond-sensitive inference, and the
rigorous prompt engineering required for the Gemini Judge. Furthermore, strict adherence to
cost constraints dictates a strategic approach to resource utilization, specifically regarding
GPU "keep-warm" strategies and Large Language Model (LLM) token consumption. This
blueprint serves as the definitive guide for the engineering team to execute this vision.

## Page 2

2. The Devvit Containment Field: Constraints & Capabilities
To architect effectively, we must first rigorously map the boundaries of the deployment
environment. The Reddit Developer Platform (Devvit) is not a standard Node.js hosting
environment; it is a specialized runtime optimized for safety, statelessness, and deep
integration with Reddit's social primitives. Misunderstanding these constraints is the primary
cause of failure for external integrations.
2.1 The Networking Firewall: Absence of Client-Side Fetch and WebSockets
The most critical architectural constraint identified in the research material is the networking
policy. Devvit enforces a strict Content Security Policy (CSP) and runtime sandbox that
prohibits the client (the webview running in the user's browser) from making direct network
requests to arbitrary external domains.1
● No fetch() from Client: The main.tsx client code cannot execute
fetch('https://api.my-modal-app.com'). Any attempt to do so will be blocked by the
browser or the runtime sandbox.

## Page 3

● No WebSockets: The platform explicitly does not support WebSocket connections
(wss://) initiated from the client or the server to external third-party services.1 This
limitation fundamentally alters the approach to real-time multiplayer gaming. Traditional
patterns, where a client connects to a socket.io server for 60Hz state updates, are
impossible here.
The implication is that the "Devvit Server" (the backend component of the Devvit app)
becomes the sole gateway to the outside world. All external communication must be proxied
through this layer using the platform's HTTP Fetch API.4 This creates a "hub-and-spoke"
topology where the Devvit Server acts as a choke point for all data ingress and egress.
2.2 Execution Limits and The "Time-to-Fun" Threshold
The Devvit serverless functions are ephemeral. The documentation specifies a maximum
request time of 30 seconds.1 This hard limit applies to the duration the Devvit server
functions can run before being terminated.
● The GenAI Latency Problem: High-fidelity image generation using models like Flux.1 or
SDXL can take anywhere from 2 to 10 seconds depending on the hardware and
quantization. If we factor in cold starts (which can take 20+ seconds 5), network latency,
and the overhead of the Gemini Judge evaluation, a synchronous request-response
cycle risks timing out.
● Asynchronous Necessity: We cannot hold the HTTP connection open while waiting for
the GPU to finish. The architecture must adopt an asynchronous "Job Queue" pattern,
where the Devvit Server submits a job and immediately returns, leaving the client to poll
for the result.
2.3 Persistence and State Synchronization
Devvit provides a built-in Redis instance 6, which is the single source of truth for the game
state. Unlike a traditional SQL database, this Redis instance is siloed by subreddit installation.
This means "MemeWars" instances in r/gaming and r/funny share no state.
● Atomic Operations: For a game like MemeWars, race conditions are a significant risk
(e.g., two players submitting prompts simultaneously). We must leverage Redis
transactions and atomic increments (INCR, ZADD) to maintain integrity.7
● Realtime Plugin: While external WebSockets are banned, Devvit provides an internal
"Realtime" plugin (@devvit/realtime).8 This allows the server to push messages to
connected clients via an internal pub/sub mechanism. This is the only viable channel for
server-to-client push notifications and serves as the replacement for external
WebSockets.
3. Architectural Core: The Split-Brain Pattern
Given the constraints of a 30-second timeout and no external WebSockets, we define the
"Split-Brain" architecture. This design separates the system into two distinct hemispheres: the
State Hemisphere (Devvit/Reddit) and the Compute Hemisphere (Modal/Depot/Gemini).

## Page 4

3.1 The "Long-Poll Relay" Protocol
Since the external Compute Hemisphere cannot push data directly to the State Hemisphere
(due to the difficulty of exposing public ingress ports on Devvit 10), the State Hemisphere must
pull data. However, generic polling (setInterval) is often inefficient or restricted in modern
React-like environments.12 We implement a "Long-Poll Relay."
1. Initiation: The Client calls a Devvit Server Function (submitMeme). The Server makes an
HTTP POST to the External API (FastAPI on Modal) and receives a job_id.
2. The Polling Loop: The Client enters a polling state using useAsync 13, sending a "check
status" request to the Devvit Server every 2-3 seconds.
3. The Relay: The Devvit Server relays this check to the External API.
4. Completion & Broadcast: Once the External API reports status: "COMPLETED", the
Devvit Server downloads the result (or the URL), updates the Redis state,
and—crucially—uses context.realtime.send to broadcast the update to all clients.8
This pattern ensures that while the initiating player polls, the result is pushed to the entire
lobby instantly upon completion, simulating a real-time experience without direct socket
connections.

## Page 5

3.2 Data Flow and Security

## Page 6

The "Air Gap" between the two hemispheres is bridged by HTTP requests signed with a
shared secret. Since the Devvit backend source code is not public to the client, we can store a
MODAL_API_KEY in Devvit's Secret Storage.1 Every request from Devvit to Modal includes this
header. This prevents unauthorized users from discovering the Modal endpoint and draining
our GPU credits.
4. Frontend Engineering: main.tsx (Devvit)
The frontend is the player's window into MemeWars. It must be responsive, handle the "Game
Loop" visual states (Lobby, Writing, Generating, Voting, Results), and mask the latency of the
GenAI operations.
4.1 State Management and The Game Loop
We utilize the useState hook for local interaction (e.g., typing in a text box) and useChannel
for global state synchronization. The GameState object is the central data structure, stored in
Redis and broadcasted via Realtime.
Component Architecture:
The application is a single-page view that renders different sub-components based on
gameState.phase.
TypeScript
// main.tsx
import { Devvit, useState, useChannel, useAsync } from '@devvit/public-api';
// 1. Type Definitions for Strict Typing
type GamePhase = 'LOBBY' | 'PROMPT_ENTRY' | 'GENERATION' | 'VOTING' | 'LEADERBOARD';
interface GameState {
phase: GamePhase;
roundNumber: number;
players: Record<string, number>; // username -> score
currentPrompt?: string;
generatedMemeUrl?: string;
deadline: number; // Unix timestamp for phase end
}
// 2. Configuration
Devvit.configure({
redditAPI: true,
http: true, // Required for Fetch to Modal
realtime: true, // Required for Pub/Sub
redis: true, // Required for Persistence

## Page 7

});
// 3. The Main App Component
Devvit.addCustomPostType({
name: 'MemeWars GenAI',
height: 'tall',
render: (context) => {
// A. Local State (Client-specific)
const = useState('IDLE');
const [localPrompt, setLocalPrompt] = useState('');
const [jobId, setJobId] = useState<string | null>(null);
// B. Global State (Synced from Redis via Realtime)
const = useState<GameState>({
phase: 'LOBBY',
roundNumber: 1,
players: {},
deadline: Date.now(),
});
// C. Realtime Listener: The "Push" Receiver
// This hook listens for messages from the Devvit Server
const channel = useChannel({
name: 'memewars_global_channel',
onMessage: (message) => {
// When server says state changed, update local view
if (message.type === 'STATE_UPDATE') {
setGameState(message.data as GameState);
}
// Specific event for generation completion
if (message.type === 'GENERATION_COMPLETE') {
setJobId(null); // Stop polling
// Trigger confetti or reveal animation
}
},
onSubscribed: () => console.log('Connected to MemeWars Network'),
});
// D. The Polling Engine: The "Pull" Mechanism
// Only runs when we have an active Job ID waiting for the GPU
const { data: pollData, loading: pollLoading } = useAsync(
async () => {
if (!jobId) return null;

## Page 8

try {
// RPC Call to Server -> HTTP Fetch to Modal
return await context.callServerFunction('checkGenAIStatus', { jobId });
} catch (e) {
console.error('Polling error', e);
return null;
}
},
{
// Dependency array acts as the trigger.
// In Devvit, useAsync re-runs when deps change.
// We can toggle a counter to force re-runs if needed,
// or rely on the server function returning 'PENDING' to trigger a re-render/wait logic.
depends:,
}
);
// E. Rendering Logic based on Phase
if (gameState.phase === 'LOBBY') {
return (
<vstack alignment="center" padding="medium">
<text size="large" weight="bold">MemeWars 2026</text>
<button onPress={async () => {
await context.callServerFunction('joinGame', {});
}}>Join Game</button>
</vstack>
);
}
//... Additional blocks for PROMPT_ENTRY, GENERATION, etc.
return <text>Loading Game State...</text>;
},
});
4.2 Handling the useAsync Polling Limitation
Snippet 14 and 12 highlight a nuance: useAsync is generally for one-off fetches. For repeating
polls, we must be careful not to block the render loop. The optimal pattern in Devvit (which
lacks a native setInterval that persists across renders in the same way the browser does) is to
have the checkGenAIStatus server function return a status. If the status is "PENDING," the
client code can use a useState counter or a delayed recursion to trigger the useAsync again.
However, the most robust method found in recent Devvit patterns is the "Optimistic Update

## Page 9

with Server Verification," where the server manages the polling via a Scheduled Job if the wait
time is long, or the client manually re-triggers the async call via a button if it hangs. For this
Hackathon, a tight loop triggered by a state variable change is sufficient.
5. The Build System: Depot & Containerization
The external backend relies on heavy Python libraries: torch (PyTorch) for inference and
google-genai for the judge. Building these images on a standard local Docker daemon or a
basic CI runner is excruciatingly slow and often fails due to architecture mismatches (e.g.,
building on an M-series Mac for a Linux GPU server).
5.1 The Necessity of Depot
We integrate Depot to solve the build latency and compatibility issues. Depot provides
managed build instances with persistent layer caching.15
1. Architecture Compatibility: Modal runs on Linux x86_64. Developing on an Apple
Silicon (arm64) machine requires cross-compilation, which is slow in QEMU. Depot
handles this natively, building amd64 images on amd64 hardware.
2. Layer Caching: PyTorch is nearly 2GB. Depot caches this layer. If we change one line of
code in app.py, we don't want to re-download 2GB. Depot ensures we only rebuild the
changed layer.
depot.json Configuration:
This file resides in the root of the repository and links the build context to the
high-performance builders.
JSON
{
"projectID": "x92k-memewars-genai-2026",
"orgID": "hackathon-team-alpha"
}
5.2 Optimized Multi-Stage Dockerfile
We employ a multi-stage build pattern 16 to minimize the final image size and reduce the "Cold
Start" time on Modal. The smaller the image, the faster the container can be pulled and
started.
Dockerfile
# Stage 1: The Builder (Heavy Lifting)
FROM python:3.11-slim AS builder

## Page 10

# Set work directory
WORKDIR /app
# Copy dependency definition
COPY requirements.txt.
# Install system build dependencies (GCC, etc.) often needed for python extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
build-essential \
&& rm -rf /var/lib/apt/lists/*
# Create a virtual environment to isolate packages
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
# Install Python dependencies
# We use --no-cache-dir to keep the layer size down,
# relying on Depot's external cache instead.
RUN pip install --no-cache-dir -r requirements.txt
# Stage 2: The Runtime (Slim & Fast)
FROM python:3.11-slim AS runtime
WORKDIR /app
# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
# Copy application code
COPY..
# Environment variables for optimization
ENV PYTHONUNBUFFERED=1
# Application Entrypoint
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
6. The Compute Engine: Modal & Serverless GPUs
The generation of memes requires significant computational power. We utilize Modal 18
because it offers a "Serverless GPU" abstraction that is far simpler than managing Kubernetes
nodes.

## Page 11

6.1 GPU Selection and "Keep-Warm" Strategy
For "MemeWars," latency is the primary metric of success. A cold boot for a diffusion model
container can take 20-40 seconds.5 This is unacceptable for a fast-paced game.
● Hardware: We select the NVIDIA A10G.19 It offers the best price-performance ratio for
inference (approx. $0.0003/sec). It is fast enough to run Flux.1-schnell (a distilled,
faster version of Flux) in under 2 seconds.
● Strategy: We utilize Modal's keep_warm=1 parameter. This instructs Modal to keep at
least one container running with the model loaded in VRAM, even when no requests are
processing.
● Cost Management: To adhere to cost constraints, we can programmatically adjust
keep_warm based on time of day or use a "scaledown window" 5 that keeps the
container alive for 60 seconds after the last request, handling bursts effectively while
scaling to zero during inactivity.
6.2 modal_worker.py Implementation
This script defines the infrastructure-as-code. It sets up the environment, downloads the

## Page 12

model weights to a persistent volume (to speed up even cold starts), and exposes the
function.
Python
import modal
# 1. Define the Environment
# Install diffusers and accelerators
image = modal.Image.debian_slim().pip_install(
"diffusers", "transformers", "accelerate", "torch", "sentencepiece"
)
app = modal.App("memewars-renderer")
# 2. Persistent Volume for Model Weights
# Prevents re-downloading 10GB+ weights on every container start
vol = modal.Volume.from_name("flux-weights")
@app.function(
image=image,
gpu="A10G", # The "Goldilocks" GPU for this task
timeout=60, # Hard timeout
keep_warm=1, # The "Hot Standby" container
volumes={"/data": vol} # Mount volume
)
def generate_image(prompt: str, match_id: str):
import torch
from diffusers import FluxPipeline
import io
import base64
# 3. Model Loading (Cached)
# We load from the volume path /data if available, else download
model_id = "black-forest-labs/FLUX.1-schnell"
try:
pipe = FluxPipeline.from_pretrained(
"/data/flux-schnell",
torch_dtype=torch.bfloat16
).to("cuda")
except OSError:
# First run: download and save to volume

## Page 13

pipe = FluxPipeline.from_pretrained(
model_id,
torch_dtype=torch.bfloat16
)
pipe.save_pretrained("/data/flux-schnell")
pipe = pipe.to("cuda")
# 4. Inference
# 4 steps is sufficient for 'schnell' variant
image = pipe(prompt, num_inference_steps=4).images
# 5. Serialization
# Convert to Base64 to return via JSON.
# Note: For production, uploading to S3 and returning a URL is better
# to avoid payload limits, but Base64 works for prototypes.
buffered = io.BytesIO()
image.save(buffered, format="JPEG")
img_str = base64.b64encode(buffered.getvalue()).decode()
return {"status": "success", "image_base64": img_str}
7. The Orchestrator: FastAPI (app.py)
While Modal functions can be called directly, wrapping them in a standard web server
(FastAPI) provides a clean contract for the Devvit Server to consume. It allows us to perform
validation, logging, and potentially switch backend providers without changing the Devvit
code.
7.1 Interface Design
The app.py exposes two critical endpoints: /generate and /status.
Python
# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import modal_worker # Import the Modal definition
app = FastAPI()
class GenerateRequest(BaseModel):
prompt: str

## Page 14

user_id: str
secret_key: str # Simple security mechanism
@app.post("/generate")
async def start_generation(req: GenerateRequest):
# Security Check
if req.secret_key!= "YOUR_DEVVIT_SECRET":
raise HTTPException(status_code=403, detail="Unauthorized")
# Offload to Modal asynchronously
#.spawn() returns immediately with a handle to the background job
job_handle = modal_worker.generate_image.spawn(req.prompt, "match_123")
return {
"job_id": job_handle.object_id,
"status": "QUEUED"
}
@app.get("/status/{job_id}")
async def check_status(job_id: str):
from modal.functions import FunctionCall
try:
# Reconstruct handle from ID
fc = FunctionCall.from_id(job_id)
# Non-blocking check
result = fc.get(timeout=0)
return {"status": "COMPLETED", "data": result}
except TimeoutError:
return {"status": "PENDING"}
except Exception as e:
return {"status": "FAILED", "error": str(e)}
8. The Arbiter: Gemini 3 Pro Integration
The "Judge" functionality is what differentiates MemeWars from a simple image generator. We
use Gemini 3 Pro (simulated here via the most advanced available equivalent, Gemini 1.5/2.0
Pro logic) to evaluate the comedic value of the user's input combined with the visual context.
8.1 Prompt Engineering for Humor
Humor is subjective and notoriously difficult for AI.20 We cannot simply ask "Is this funny?". We
must utilize a Framework-Based Prompt. We instruct Gemini to act as a specific persona
("The Supreme Internet Historian") and evaluate based on specific criteria: Incongruity (does
the text subvert expectation?), Relatability (is it culturally relevant?), and Brevity.

## Page 15

8.2 JSON Schema Enforcement
To integrate the Judge's decision into the game logic (e.g., automatically awarding points), the
output must be machine-readable. We utilize Gemini's "Structured Output" capabilities (JSON
Mode).21
Python
# gemini_judge.py
from google import genai
from google.genai import types
def rank_submissions(submissions: list):
"""
submissions: List of dicts { 'user': 'abc', 'prompt': '...', 'image_desc': '...' }
"""
client = genai.Client()
# Define the output schema strictly
class RankingResult(types.TypedDict):
rank: int
user: str
score: int
roast: str # A funny comment on why they won/lost
prompt_context = f"""
You are a judge in a meme competition.
Analyze the following submissions based on humor, irony, and creativity.
Submissions: {submissions}
"""
response = client.models.generate_content(
model='gemini-2.0-pro-exp', # Placeholder for Gemini 3 Pro
contents=prompt_context,
config=types.GenerateContentConfig(
response_mime_type='application/json',
response_schema=list
)
)
return response.parsed

## Page 16

8.3 Rate Limits and Batching
Google's Generative AI models have rate limits (RPM - Requests Per Minute).23 If 100 players
submit memes, making 100 individual API calls to Gemini will trigger a 429 error.
● Strategy: We employ Request Aggregation. We do not judge memes one by one. We
collect all submissions for a round (e.g., 10-20 memes), bundle them into a single
massive prompt context, and ask Gemini to rank them in one pass. This reduces 20 API
calls to 1, keeping us safely within the quota.
9. Data Synchronization & Persistence
The "State Hemisphere" relies on Redis to maintain consistency across the distributed client
base.
9.1 Atomic State Transitions
Game phases (Lobby -> Game) must be synchronized. A common bug in distributed games is
the "Split Lobby," where half the players think the game has started and half don't.
● Solution: We use redis.set('game:phase', 'STARTING', { nx: true }) (Set if Not Exists) to
ensure only one "Start Game" signal is processed.
● The Clock: The server maintains the official time. Clients synchronize their local
countdowns based on the deadline timestamp stored in Redis, rather than relying on
their local clocks.
9.2 The "Realtime" Broadcast
When the Gemini Judge returns the rankings to the app.py -> Devvit Server, the server
updates Redis and immediately fires the broadcast:
TypeScript
// Devvit Server Side
await context.redis.set('leaderboard', JSON.stringify(rankings));
await context.realtime.send('memewars_global_channel', {
type: 'STATE_UPDATE',
data: {
phase: 'LEADERBOARD',
leaderboard: rankings
}
});
This single line of code is the trigger that updates the UI for all 100+ connected players
simultaneously.
10. Security & Compliance

## Page 17

10.1 Content Safety
Generating memes with AI carries the risk of offensive content.
● Text: We use the isFlagged property from the Reddit API's moderation tools or a
lightweight filter list on the input prompt before sending it to Modal.
● Image: Flux.1 has built-in safety checkers, but we can also instruct Gemini (during the
judging phase) to return a flagged: true boolean if the generated image violates safety
guidelines, filtering it from the final results screen.
10.2 Resource Quota Management
The chart above highlights that Redis Operations are our tightest constraint on the Devvit
side. To mitigate this, we must avoid excessive polling. The "Long-Poll Relay" is designed to hit
the server only once every few seconds per client, rather than hundreds of times per second.
11. Deployment & Operations
The deployment strategy involves a synchronized push.
1. Depot Build: depot build -t my-registry/memewars-backend:latest. pushes the

## Page 18

container.
2. Modal Deploy: modal deploy modal_worker.py updates the GPU functions.
3. Devvit Upload: devvit upload pushes the frontend and server logic to Reddit.
Monitoring: We rely on Modal's dashboard for backend logs and Devvit's CLI logs (devvit
logs) for frontend errors. Because the systems are decoupled, correlation IDs (passed from
Client -> Devvit -> Modal) are essential for tracing failed requests across the "Air Gap."
Conclusion
"MemeWars: GenAI Edition" represents a sophisticated interplay between constrained,
community-facing interfaces and high-power backend infrastructure. By acknowledging the
"Split-Brain" reality and engineering a robust "Long-Poll Relay" bridge, we bypass the
inherent limitations of the platform. This architecture not only satisfies the requirements of the
Reddit Daily Games 2026 Hackathon but sets a precedent for how complex, AI-driven
applications can be embedded within social platforms without compromising on performance
or security. The roadmap is set; the code is architected. It is time to build.
Works cited
1. Devvit Web - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview
2. Is a Devvit app limited to its reddit-hosted server for the webview's realtime
capabilities?, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1p20t3u/is_a_devvit_app_limited_to_i
ts_reddithosted/
3. Is it possible to use Devvit with WebSocket? - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1h4ugbg/is_it_possible_to_use_devvit
_with_websocket/
4. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
5. Cold start performance | Modal Docs, accessed February 3, 2026,
https://modal.com/docs/guide/cold-start
6. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/redis
7. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis
8. Realtime in Devvit Web - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/realtime/overview
9. Realtime in Devvit Blocks - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/capabilities/realtime/realtime_in_devvit_
blocks
10. Data Connection • Webhooks • Overview - Palantir, accessed February 3, 2026,
https://palantir.com/docs/foundry/data-connection/webhooks-overview/
11. Any event listening models for devvit? - Reddit, accessed February 3, 2026,
https://www.reddit.com/r/Devvit/comments/1psycdd/any_event_listening_models

## Page 19

_for_devvit/
12. Think Twice Before Using setInterval() for API Polling – It Might Not Be Ideal,
accessed February 3, 2026,
https://dev.to/igadii/think-twice-before-using-setinterval-for-api-polling-it-might
-not-be-ideal-3n3
13. useAsync - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/api/public-api/functions/useAsync
14. Working with useAsync - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/next/capabilities/blocks/working_with_useasy
nc
15. Local Development | Container Builds | Depot Documentation, accessed February
3, 2026,
https://depot.dev/docs/container-builds/how-to-guides/local-development
16. Slimmer FastAPI Docker Images with Multi-Stage Builds - David Muraya, accessed
February 3, 2026,
https://davidmuraya.com/blog/slimmer-fastapi-docker-images-multistage-builds/
17. Optimizing Dockerized FastAPI with TensorFlow: How to reduce a 1.57GB Image
Size?, accessed February 3, 2026,
https://www.reddit.com/r/FastAPI/comments/1e1lal6/optimizing_dockerized_fasta
pi_with_tensorflow_how/
18. Products - Inference - Modal, accessed February 3, 2026,
https://modal.com/products/inference
19. Plan Pricing - Modal, accessed February 3, 2026, https://modal.com/pricing
20. AI Humor Generation: Cognitive, Social and Creative Skills for Effective Humor -
arXiv, accessed February 3, 2026, https://arxiv.org/html/2502.07981v1
21. Structured outputs | Gemini API - Google AI for Developers, accessed February 3,
2026, https://ai.google.dev/gemini-api/docs/structured-output
22. Generate structured output (like JSON and enums) using the Gemini API |
Firebase AI Logic, accessed February 3, 2026,
https://firebase.google.com/docs/ai-logic/generate-structured-output
23. Generative AI on Vertex AI quotas and system limits - Google Cloud
Documentation, accessed February 3, 2026,
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/quotas


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/knowledge/imported_research/quiz/Devvit_Hackathon__Duel_of_Minds_Architecture.md

# Devvit Hackathon_ Duel of Minds Architecture.pdf

## Page 1

Architectural Blueprint: "Duel of Minds"
— Reddit Daily Games 2026
1. Executive Summary and Strategic Mandate
1.1 The Daily Games 2026 Challenge
The 2026 Reddit Daily Games Hackathon represents a pivotal moment in the evolution of
social gaming on the platform. The mandate is deceptive in its simplicity: construct a "Daily
Game" using the Devvit platform. However, the constraints imposed—specifically the "Zero
Local Infrastructure" requirement and the exclusive use of the Gemini 2.0 Flash API (Free
Tier)—transform this from a creative design challenge into a rigorous exercise in distributed
systems architecture and resource orchestration.
"Duel of Minds" is conceived as the answer to this challenge. It is a daily knowledge quiz that
pits the collective intellect of a subreddit against a procedurally generated challenge, or
individual users against the "Mind of the Day." The core loop involves a daily reset where new
content is generated, validated, and distributed without human intervention.
This report serves as the definitive technical guide for the implementation of "Duel of Minds."
It is not merely a set of instructions but a comprehensive analysis of the Devvit runtime
environment, the intricacies of the Gemini 2.0 Flash generative model, and the strategies
required to achieve high-fidelity gameplay within strict serverless limits. We will explore the
theoretical boundaries of the platform, the specific rate-limiting behaviors of Google's latest
APIs, and the "density-optimized" coding patterns necessary to deliver a AAA experience in a
constrained environment.
1.2 The Philosophy of Zero-Infrastructure Architecture
The "Zero Local Infra" constraint forces a fundamental shift in engineering philosophy. In
traditional web development, state is cheap, and persistence is taken for granted. We spin up
containers, maintain open WebSocket connections, and cache data in abundant memory. In
the Devvit serverless environment, these luxuries do not exist.
We are operating in a world of:
● Ephemerality: Compute resources exist only for the duration of a function call
(typically milliseconds to seconds).
● Statelessness: No memory persists between executions unless explicitly committed to
the database.
● Atomicity: Every action that modifies shared state must be protected against race
conditions, a non-trivial task without the aid of complex SQL locking mechanisms or
custom server daemons.
The architecture for "Duel of Minds" therefore relies on a Singleton Generation Pattern
coupled with a Backend-for-Frontend (BFF) caching layer. This approach decouples the

## Page 2

unpredictable latency and rate limits of the generative AI provider (Gemini) from the
high-frequency, low-latency demands of the user base.
1.3 Scope of Analysis
This report is structured into two primary phases, reflecting the user's mandate:
● Phase 1: Deep Research & Constraint Analysis: A rigorous examination of the
operational boundaries. We verify HTTP allowlists, dissect the specific token bucket
algorithms of Gemini 2.0 Flash as of February 2026, and map the execution limits of the
Devvit Scheduler.
● Phase 2: Architecture & Implementation Guide: A density-optimized technical
specification. This includes the full database schema, the devvit.json configuration
(replacing the requested YAML to align with platform realities), and the TypeScript logic
for the LLM service and main game loop.
2. Phase 1: Deep Research and Constraint Analysis
2.1 Network Security and the HTTP Allowlist
The primary bridge between our closed Devvit environment and the intelligence of Gemini 2.0
is the HTTP fetch capability. Understanding the security model here is critical to preventing
runtime failures.
2.1.1 The Global Allowlist vs. Explicit Permissions
Research indicates that Reddit maintains a Global Fetch Allowlist for widely used public
APIs. As of 2026, generativelanguage.googleapis.com—the endpoint for Gemini—is explicitly
listed as a globally allowed domain.1 This is a significant strategic advantage, as it obviates the
need for a manual domain approval process, which could otherwise jeopardize the hackathon
timeline.
However, a nuance in the platform's security model often traps unwary developers: Global
availability does not imply automatic permission. The application's manifest (the
devvit.json file) acts as a local firewall. Even if Reddit allows a domain globally, the individual
app must explicitly request access to it in its configuration. Failing to declare
generativelanguage.googleapis.com in the http.domains array will result in immediate runtime
errors, regardless of the global status.1
2.1.2 The Client-Side Sandbox (The "Webview Wall")
A critical architectural constraint verified during research is the strict bifurcation of network
capabilities between the Client (Webview) and the Server.
● Server-Side: Can make HTTP requests to allow-listed external domains (e.g., Google,
OpenAI, ESPN).1
● Client-Side: Is strictly sandboxed. It can only make requests to the app's own internal

## Page 3

API endpoints.1
This finding necessitates a Backend-for-Frontend (BFF) architecture. The React application
running in the user's browser cannot communicate directly with Gemini. It must instead
dispatch a request to a Devvit server endpoint (e.g., /api/get-quiz), which then proxies the
request to the external service or, more likely in our optimized design, retrieves the data from
Redis. This limitation is actually a security feature in disguise: it prevents the exposure of the
Gemini API Key to the client-side browser, ensuring that our quota cannot be hijacked by
malicious users.
2.2 Execution Constraints: The Time and Memory Walls
The Devvit runtime is a serverless environment, likely built on top of containerized ephemeral
functions (similar to AWS Lambda or Google Cloud Run). This imposes hard limits on
execution time and memory.
2.2.1 The 30-Second HTTP Timeout
While generic cloud functions might allow for execution times of up to 10 minutes 4, the Devvit
documentation specifically flags a 30-second timeout for HTTP fetch operations.1 This is the
"hard wall" for our AI interactions.
When we trigger a generation job:
1. Cold Start: The container initializes (~100-500ms).
2. Logic Execution: Pre-computation of prompts (~100ms).
3. External Request: The call to Gemini (~2s to 20s).
4. Processing: Parsing JSON and saving to Redis (~100ms).
The variability lies entirely in Step 3. Large language models, especially in their "Flash" or
"Preview" tiers, can exhibit variable latency (Time to First Token and Total Generation Time)
depending on global load. A complex "Chain of Thought" prompt that asks the model to
reflect, critique, and revise its own work could easily exceed 30 seconds, causing the job to
terminate abruptly.
Implication for "Duel of Minds": We must utilize Single-Shot Prompting. We cannot afford
the latency of multi-turn conversations. The prompt must be engineered to deliver the Topic,
Questions, Options, and Explanations in a single, strictly formatted JSON payload. This
maximizes the probability of success within the 30-second window.
2.2.2 Scheduler Drift and Reliability
The Scheduler allows for cron-based execution (e.g., 0 0 * * * for daily at midnight).5 However,
serverless schedulers are rarely precise to the millisecond. "Drift"—the delay between the
scheduled time and actual execution—is inevitable. Research suggests that while jobs are
guaranteed to run, they may be queued if the platform is under heavy load.7
This impacts the "Midnight Release" feature. If the job runs at 00:00:05, there is a 5-second
window where the day has changed but the content has not. Our architecture must handle
this "staleness gap" gracefully, likely by serving the previous day's content or a generic
fallback until the atomic switchover occurs.

## Page 4

2.3 Gemini 2.0 Flash: The Rate Limit Reality
The "Free Tier" of Gemini 2.0 Flash is the economic engine of this project, but it is also the
tightest bottleneck. Misunderstanding these limits leads to the "Viral Death" scenario, where a
popular app stops functioning immediately upon gaining traction.
2.3.1 The February 2026 Limits
Based on the provided research, the limits for Gemini 2.0 Flash (Free Tier) in early 2026 are as
follows 8:
● RPM (Requests Per Minute): 10 requests.
● TPM (Tokens Per Minute): 1,000,000 tokens.
● RPD (Requests Per Day): Approximately 500 to 1,500 (estimates vary, so we adopt the
conservative 500 limit).
Analysis of the "Viral Death" Scenario:
Consider an architecture where the app generates a quiz on demand for each user who
opens the post.
● User 1 opens app: 1 request. (OK)
● User 5 opens app: 5 requests. (OK)
● User 11 opens app (within same minute): 11 requests. FAILURE. The API returns a 429
Too Many Requests error. The app crashes for the 11th user.
● User 501 opens app (within same day): 501 requests. CATASTROPHIC FAILURE. The
Daily Quota is exhausted. The app is dead for everyone until the next day.
This data irrefutably proves that a direct-to-LLM architecture is non-viable. The Singleton
Generation Pattern is not just an optimization; it is a requirement. By decoupling generation
from consumption, we convert "N Users" of load into "1 Request" of load.
2.3.2 The Dynamic Shared Quota
Google's documentation mentions "Dynamic Shared Quotas" for free tier models.10 This
means that during periods of extreme global demand, the 10 RPM limit might be dynamically
lowered. This adds another layer of risk. Our "Backoff and Retry" logic must be robust enough
to handle not just 429 errors, but also 500 or 503 errors that indicate upstream congestion.
2.4 Devvit Redis: The Atomicity Challenge
In a serverless environment, Redis is the only source of truth. However, the Devvit
implementation of Redis has specific limitations compared to a standard Redis instance.
2.4.1 Storage Quotas
The limit is 500MB per subreddit installation.11
● For a simple app, this is infinite.
● For a game tracking stats for 100,000 unique users, it is tight.
○ 100,000 Users * 1KB per user profile = 100MB (20% of capacity).
○ 365 Days of Quizzes * 10KB per quiz = 3.6MB (Negligible).

## Page 5

○ Leaderboards (ZSET) overhead = Moderate.
This confirms that User Data Density is the primary optimization target. We cannot store
bloated JSON objects for every user. We must use compact data structures.
2.4.2 The Lua Limitation
Crucially, Devvit does not support Lua scripts (EVAL).11 In standard Redis, Lua is used to
execute complex transactional logic (read + logic + write) atomically. Without Lua, we must
rely on the WATCH / MULTI / EXEC pattern (Optimistic Concurrency Control).12
The Concurrency Risk:
If we want to increment a user's "Win Streak" only if their score is above 80:
1. GET user:stats
2. (Server Logic: Check if score > 80)
3. SET user:stats
If the user plays two games simultaneously (e.g., across two devices), a race condition could
occur between Step 1 and 3. WATCH detects if user:stats changed during Step 2. If it did, the
EXEC fails, and we must retry the whole operation. This complicates the code but guarantees
data integrity.
3. Architectural Blueprint (Phase 2 Design)
3.1 High-Level Architecture: The "Duel" Engine
The system architecture is defined by the separation of the Control Plane (automated
generation) and the Data Plane (user interaction). This separation is enforced by the
asynchronous nature of the Scheduler and the caching role of Redis.
3.1.1 System Components and Data Flow
1. The Scheduler (The Heartbeat): A server-side cron job running at 00:00 UTC. It is the
only component that speaks to Gemini.
2. The Generator (The Brain): A TypeScript service that constructs the prompt, handles
the API call with exponential backoff, validates the JSON schema, and commits the
result to Redis.
3. Redis (The State Layer): Acts as the synchronization bridge. It holds:
○ quiz:{date}: The immutable quiz payload.
○ config:current_date: The pointer to the active quiz.
○ user:{id}: Compact user statistics.
○ leaderboard:{date}: The daily ZSET for ranking.
4. The API Layer (BFF): Devvit server endpoints (router.get, router.post) that sanitize data
and handle client requests.
5. The Client (The View): A React-based webview that renders the game state.
Data Flow Narrative:

## Page 6

At midnight, the Scheduler wakes up. It checks if quiz:{today} exists (Idempotency Check). If
not, it invokes the Generator. The Generator asks Gemini for a "History Quiz". Gemini returns
a JSON blob. The Generator validates the schema. If valid, it writes the blob to quiz:{today}
and updates config:current_date in a single atomic transaction.
Simultaneously, Users are polling the API. Their requests read config:current_date. Before
00:00, they get "Yesterday's Quiz". The moment the atomic transaction completes, the next
poll returns "Today's Quiz". The transition is instant for all users globally.
3.2 The Singleton Generation Pattern
This is the central pillar of our "Efficiency Strategy."
Comparison of Resource Load:
Metric On-Demand Singleton Generation Impact
Generation (Naive) (Optimized)
Trigger User Action (Page System Clock (Cron) Decoupled from
Load) Traffic
Requests (10 Users) 10 API Calls 0 API Calls (Cached) 100% Savings
Requests (10k Users) 10,000 API Calls 1 API Call (Cached) Prevents Quota
Death
Latency 2s - 15s (Wait for AI) < 50ms (Read from Instant UX
Redis)
Cost High (Potential Zero (Free Tier) Sustainable
Overage/Blocks)
The Singleton pattern transforms the variable cost of AI generation into a fixed, negligible
cost, regardless of how viral the game becomes.
3.3 Data Schema Design (Density Optimization)
To fit 100,000+ users into 500MB, we employ a strict schema.
3.3.1 Quiz Storage (Strings)
● Key: quiz:YYYY-MM-DD
● Value: JSON String (Compressed)
● Size: ~2KB per quiz.
● TTL: 30 Days.
● Auto-Cleanup: Redis EXPIRE command is set on creation. This ensures old data
vanishes automatically, keeping storage usage strictly bounded.
3.3.2 User Statistics (Hashes)
Using a Redis Hash allows us to group fields for a single user, reducing the overhead of key
names.
● Key: u:{user_id} (Shortened key name to save bytes)
● Type: Hash

## Page 7

● Fields:
○ s (Score - Total): Integer
○ w (Wins): Integer
○ k (Streak): Integer
○ ld (Last Date Played): String (YYMMDD)
● Optimization: We use short field names (s instead of score) because Redis stores the
field strings for every user in some encoding configurations (though ziplist optimization
helps). Every byte counts at scale.
3.3.3 Leaderboards (Sorted Sets)
● Key: lb:{date}
● Type: ZSET
● Score: The user's score for that day.
● Member: {user_id}
● Atomicity: We use ZADD to upsert scores. This handles ranking automatically with
O(log(N)) complexity.
4. Implementation Specification
4.1 Configuration: devvit.json
The user request referenced "YAML config," but Devvit strictly uses devvit.json. We correct
this here. This file is the "permissions manifest" and is the single most common point of failure
for external fetch requests.
JSON
{
"name": "duel-of-minds-2026",
"version": "1.0.0",
"permissions": {
"http": {
"enable": true,
"domains": [
"generativelanguage.googleapis.com"
]
},
"scheduler": true,
"redis": true,
"reddit": {
"enable": true,

## Page 8

"asUser":
}
},
"scheduler": {
"tasks": {
"generate_daily_quiz": {
"endpoint": "/internal/cron/generate-quiz",
"cron": "0 0 * * *"
},
"cleanup_old_data": {
"endpoint": "/internal/cron/cleanup",
"cron": "0 2 * * 0"
}
}
}
}
Critical Details:
● generativelanguage.googleapis.com: Must be listed verbatim. No wildcards
(*.googleapis.com) are allowed.3
● Cron Schedule: 0 0 * * * targets midnight UTC. The cleanup job runs weekly (* * 0 -
Sunday) at 2 AM to avoid conflict with the generation job.
4.2 The LLM Service (TypeScript)
This service manages the "30-second wall" and "Rate Limit" risks.
Key Features:
1. Strict JSON Enforcement: Using responseMimeType: "application/json".13
2. Exponential Backoff: Handling 429 (Rate Limit) and 500 (Server Error).
3. Type Safety: Validating the output against a TypeScript interface.
TypeScript
import { Devvit } from '@devvit/public-api';
// Define the shape of our data to ensure type safety throughout the app
interface QuizQuestion {
id: number;
text: string;
options: string;
correctIndex: number;
explanation: string;

## Page 9

}
interface DailyQuiz {
date: string;
theme: string;
questions: QuizQuestion;
}
const GEMINI_API_URL =
'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
';
export class LLMService {
constructor(private context: Devvit.Context) {}
/**
* Generates a quiz for a specific date using Gemini 2.0 Flash.
* Implements retry logic with exponential backoff to handle rate limits.
*/
async generateDailyQuiz(dateStr: string): Promise<DailyQuiz | null> {
const apiKey = await this.context.settings.get('GEMINI_API_KEY');
if (!apiKey) {
console.error("Critical: GEMINI_API_KEY is missing in settings.");
return null;
}
// Prompt Engineering: Single-Shot, Strict Schema
const prompt = `
You are a game engine for "Duel of Minds".
Task: Generate a daily knowledge quiz for ${dateStr}.
Constraints:
1. Theme: Randomly select from History, Science, Literature, or Pop Culture.
2. Difficulty: 5 questions, starting easy, ending hard.
3. Format: Return ONLY raw JSON. No markdown formatting.
4. Content Safety: No political, religious, or NSFW topics.
JSON Schema:
{
"date": "${dateStr}",
"theme": "string",
"questions": [
{ "id": number, "text": "string", "options": ["string", "string", "string", "string"],
"correctIndex": number (0-3), "explanation": "string" }

## Page 10

]
}
`;
const maxRetries = 3;
let attempt = 0;
while (attempt < maxRetries) {
try {
console.log(` Attempt ${attempt + 1} for ${dateStr}`);
const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
responseMimeType: "application/json", // Enforce JSON mode
temperature: 0.7 // Balanced creativity/determinism
}
})
});
// Handle Non-200 Responses
if (!response.ok) {
const status = response.status;
console.warn(` Gemini API returned status ${status}`);
// If Rate Limited (429) or Server Error (5xx), we throw to trigger retry
if (status === 429 |
| status >= 500) {
throw new Error(`Transient Error ${status}`);
}
// If 400/401/403, it's a configuration error. Do not retry.
return null;
}
const data = await response.json();
const rawText = data.candidates?.?.content?.parts?.?.text;
if (!rawText) throw new Error("Empty response from model");

## Page 11

// Sanitization: Remove accidental markdown blocks if the model hallucinates them
const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
const quiz = JSON.parse(cleanJson) as DailyQuiz;
// Basic Validation: Ensure we actually got 5 questions
if (!quiz.questions |
| quiz.questions.length!== 5) {
throw new Error("Invalid quiz structure generated");
}
return quiz;
} catch (e) {
attempt++;
if (attempt >= maxRetries) {
console.error(` Failed after ${maxRetries} attempts: ${e}`);
return null;
}
// Exponential Backoff: 1s, 2s, 4s
// We cap wait time to ensure we don't hit the 30s Devvit execution limit
const backoffTime = Math.min(Math.pow(2, attempt) * 1000, 5000);
await new Promise(resolve => setTimeout(resolve, backoffTime));
}
}
return null;
}
}
4.3 The Scheduler Job (The Main Loop)
This script acts as the conductor. It orchestrates the "Midnight Handover" process detailed in
our design phase.
Key Logic:
1. Idempotency: Checks if the quiz already exists to prevent wasted API calls.
2. Fallback Strategy: If generation fails (Gemini outage), it loads a "Generic Backup" to
ensure the game continues.
3. Atomic Commit: Updates the quiz data and the current date pointer simultaneously.
TypeScript

## Page 12

// server/scheduler-job.ts
import { Devvit } from '@devvit/public-api';
import { LLMService } from './llm-service';
export async function generateQuizJob(event: any, context: Devvit.Context) {
const redis = context.redis;
const llm = new LLMService(context);
const today = new Date().toISOString().split('T'); // "2026-02-04"
const quizKey = `quiz:${today}`;
// 1. Idempotency Check
const exists = await redis.get(quizKey);
if (exists) {
console.log(` Quiz for ${today} already exists. Terminating.`);
return;
}
// 2. Generation Phase
console.log(` Starting generation for ${today}...`);
let quiz = await llm.generateDailyQuiz(today);
// 3. Fallback Mechanism
if (!quiz) {
console.error(` Generation failed. Engaging fallback protocol.`);
// Ideally, you have a pool of backups: "backup:1", "backup:2"
// Here we load a generic one.
const backupStr = await redis.get('quiz:backup:generic');
if (backupStr) {
quiz = JSON.parse(backupStr);
quiz.date = today; // Patch the date to match today
} else {
console.error(" FATAL: No backup quiz available.");
return; // Nothing we can do.
}
}
// 4. Atomic Commit Phase
// We use WATCH/MULTI/EXEC to ensure consistency
const configKey = 'config:current_date';
try {

## Page 13

const tx = await redis.watch(configKey);
await tx.multi();
// Store the quiz
await tx.set(quizKey, JSON.stringify(quiz));
// Update the pointer so clients see the new quiz
await tx.set(configKey, today);
// Set TTL for auto-cleanup (30 days)
await tx.expire(quizKey, 60 * 60 * 24 * 30);
await tx.exec();
console.log(` Successfully committed quiz for ${today}.`);
} catch (err) {
console.error(` Transaction failed: ${err}`);
// In a real app, you might schedule a retry job here
}
}
4.4 The API Layer (BFF Router)
This component serves the data to the client. It handles the "Sanitization" of the quiz data to
prevent cheating.
TypeScript
// server/main.ts (Fragment)
// Endpoint: Client fetches the daily quiz
context.router.get('/api/daily-quiz', async (req, res) => {
const redis = context.redis;
// Determine which quiz is "Live"
const liveDate = await redis.get('config:current_date');
if (!liveDate) {
return res.status(503).send("System initializing...");
}
const quizDataStr = await redis.get(`quiz:${liveDate}`);
if (!quizDataStr) {

## Page 14

return res.status(404).send("Quiz data missing.");
}
const fullQuiz = JSON.parse(quizDataStr);
// SECURITY: Sanitize the payload
// We strip out the 'correctIndex' and 'explanation' fields
// so the user cannot see the answers in their Network tab.
const clientSafeQuiz = {
date: fullQuiz.date,
theme: fullQuiz.theme,
questions: fullQuiz.questions.map((q: any) => ({
id: q.id,
text: q.text,
options: q.options
// correctIndex removed
// explanation removed
}))
};
return res.status(200).json(clientSafeQuiz);
});
// Endpoint: Client submits their answers
context.router.post('/api/submit-score', async (req, res) => {
// Logic:
// 1. Fetch full quiz from Redis (including answers).
// 2. Compare user answers.
// 3. Calculate score.
// 4. Update User Stats (HSET) and Leaderboard (ZADD).
// 5. Return result + rank.
});
5. Efficiency and Optimization Strategy
5.1 The "Midnight Handover" Sequence
One of the most complex aspects of a daily game is the transition at 00:00 UTC. If a user
loads the game at 23:59:59 and submits at 00:00:05, what happens?
● Problem: The user played Quiz A, but the global pointer now points to Quiz B.
Submitting answers for A against the key for B would result in a score of 0 and a

## Page 15

frustrated user.
● Solution: The client must send the date ID of the quiz they played (2026-02-03) along
with their answers. The server endpoint /api/submit-score uses this ID to fetch the
specific quiz key quiz:2026-02-03 for validation, rather than blindly using the "current"
quiz.
● Visualizing the Handover:
○ T-minus 10s: Scheduler wakes up.
○ T-minus 5s: Gemini generates content.
○ T-0s: Atomic Redis transaction updates config:current_date.
○ T+1s: Next user fetch gets the new quiz. Old users can still submit old quiz scores
because quiz:yesterday still exists (due to 30-day TTL).
5.2 Failure Mode Analysis: The "Circuit Breaker"
Despite our exponential backoff, Gemini 2.0 Flash might experience a prolonged outage.
● Detection: If the LLMService fails 5 times consecutively, we can flag a system health
key in Redis: system:gemini_health = DOWN.
● Action: Subsequent scheduler runs check this key. If DOWN, they skip the HTTP call
entirely and immediately load a pre-cached generic quiz.
● Recovery: A separate "Janitor" job or manual admin action can reset the health key to
UP once the service is stable.
5.3 Scalability Projections
Can this architecture handle 1 million users?
● Gemini Load: 0 increase. The Singleton pattern keeps this flat.
● Redis Reads: 1 million users fetching the quiz = 1 million Redis GET operations. Redis
can handle ~100k ops/sec. Spread over a day, this is trivial. The bottleneck would be the
"Midnight Spike" (everyone checking at once).
● Redis Writes: 1 million score submissions. The atomic ZADD is fast, but heavy
concurrency might cause WATCH collisions.
○ Mitigation: For extreme scale (Tier-1 Enterprise), we would shard the
leaderboards (e.g., leaderboard:2026-02-04:shard1, shard2) and aggregate
them, but for a Hackathon, the standard Optimistic Locking is sufficient for ~10k
concurrent users.
6. Conclusion and Future Outlook
The "Duel of Minds" architecture demonstrates that the constraints of the Devvit platform—its
statelessness, execution timeouts, and storage limits—are not barriers to innovation but
guiderails for better engineering. By strictly adhering to the Singleton Generation Pattern,
we neutralize the risk of the Gemini Free Tier limits. By implementing a BFF Sanitization
Layer, we secure the integrity of the game against client-side tampering. And by utilizing

## Page 16

Redis Primitives effectively, we achieve a data density that allows for massive scalability
within a modest memory footprint.
This report fulfills the mandate of the 2026 Hackathon: it presents a solution that is zero-infra,
operationally resilient, and architecturally sound. It transforms the ephemeral "serverless"
function into a persistent, living world for the players.
Key Takeaways for the Implementation Team
1. Strictly Verify devvit.json: Ensure generativelanguage.googleapis.com is present.
2. Trust the Singleton: Do not give in to the temptation of generating custom quizzes per
user; it is the path to rate-limit death.
3. Atomic Everything: Never write to Redis without WATCH if the data is shared.
4. Prompt Once: Single-shot JSON prompts are the only way to survive the 30-second
timeout.
Works cited
1. HTTP Fetch - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/http-fetch
2. Global fetch allowlist - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/http-fetch-allowlist
3. Overview - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/0.11/capabilities/http-fetch
4. Set task timeout for jobs | Cloud Run, accessed February 3, 2026,
https://docs.cloud.google.com/run/docs/configuring/task-timeout
5. Configure Your App - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configura
tion
6. Scheduler - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/scheduler
7. Job scheduler | dbt Developer Hub, accessed February 3, 2026,
https://docs.getdbt.com/docs/deploy/job-scheduler
8. Gemini API Free Tier Limits 2025: Complete Guide to Rate Limits, 429 Errors &
Solutions, accessed February 3, 2026,
https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit
9. Gemini API Rate Limits 2026: Complete Per-Tier Guide with All Models, accessed
February 3, 2026,
https://www.aifreeapi.com/en/posts/gemini-api-rate-limits-per-tier
10. Bypassing Gemini API Rate Limits with Smart Key Rotation in Next.js | by
Entekume jeffrey, accessed February 3, 2026,
https://medium.com/@entekumejeffrey/bypassing-gemini-api-rate-limits-with-s
mart-key-rotation-in-next-js-8acdee9f9550
11. Redis - Reddit for Developers, accessed February 3, 2026,
https://developers.reddit.com/docs/capabilities/server/redis
12. Redis - Reddit for Developers, accessed February 3, 2026,

## Page 17

https://developers.reddit.com/docs/0.11/capabilities/redis
13. Structured outputs | Gemini API - Google AI for Developers, accessed February 3,
2026, https://ai.google.dev/gemini-api/docs/structured-output


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/.agent/rules/devvit_constraints.md

description: Critical Devvit Platform Constraints
globs: ["**/*.ts", "**/*.tsx"]
rules:
- constraint: "Max Execution Time 30s"
  mandate: "Avoid unbounded loops. Use Scheduler for batch processing."
- constraint: "Max Redis 500MB"
  mandate: "Use bit-packing. Prefer ZSET/HSET. No verbose JSON."
- constraint: "No Client Fetch"
  mandate: "All external APIs must be proxied via Server."


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/README.md

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


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801/MANIFEST.json

{
  "source": "Reddit Devvit GitHub",
  "url": "https://github.com/reddit/devvit",
  "mode": "raw",
  "scraped_at": "2026-02-04T02:08:01.845004",
  "document_count": 1,
  "error_count": 0,
  "documents": [
    {
      "url": "https://raw.githubusercontent.com/reddit/devvit/main/README.md",
      "title": "devvit - README",
      "type": "markdown"
    }
  ],
  "errors": []
}

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801/devvit_-_README.md

# devvit - README

Source: https://raw.githubusercontent.com/reddit/devvit/main/README.md

# Devvit

## Contributing to the Devvit public repo

Reddit has a number of open source projects that developers are invited to contribute to in our GitHub repo. The Developer Platform has several [first-party example apps](https://github.com/reddit/devvit/tree/main/packages/apps) and the [developer documentation](https://github.com/reddit/devvit/tree/main/devvit-docs) open for contribution. There's also a [public issue board](https://github.com/reddit/devvit/issues) that tracks feature requests and bugs. All feedback is welcome!

## Contributor License Agreement

The first time you submit a pull request (PR) to a Reddit project, [you should complete our CLA](https://docs.google.com/forms/d/e/1FAIpQLScG6Bf3yqS05yWV0pbh5Q60AsaXP2mw35_i7ZA19_7jWNJKsg/viewform). We cannot accept PRs from GitHub users that have not agreed to the CLA. Note that this agreement applies to all open source Reddit projects, and you only need to submit it once.

[Submit your CLA here](https://docs.google.com/forms/d/e/1FAIpQLScG6Bf3yqS05yWV0pbh5Q60AsaXP2mw35_i7ZA19_7jWNJKsg/viewform?usp=sf_link).

## Bugs and requests

Most of our outstanding bugs and user requests are [visible here](https://github.com/reddit/devvit/issues). These are a combination of synced issues from our internal system and user contributions made directly in GitHub. We do our best to keep this up to date with internal progress of bugs and issues. Before adding an issue to the board, please search for a similar or duplicate issue. You can always comment or react to issues you’d like to see prioritized.

## Filing a new issue

Please use one of these labels when submitting a new issue:

- bug
- documentation
- enhancement

Once issues are added to our internal tracking system, they will be labeled as “synced”.

## Security issues

Security issues take special priority and are handled separately from our public tracker via [Hackerone](https://www.hackerone.com/). Please do not submit security issues here on GitHub, as all issues are public and publishing them increases the risk of abuse.

## How to make a pull request

Make sure to fork the repository and create a new branch when making changes to a project. Full instructions on setting up dependencies from your branch off our monorepo are detailed below. If you need to brush up on the process of creating a PR, [learn more here](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project).

## Best practices

- Keep PRs small and as specific to a feature or file as possible
- Review the code structure and patterns prior to making changes
- Keep your contributions consistent with the existing codebase
- Consider where to add helpful in-line comments or sample code
- Use language that is clear, concise, and simple

## When changes are reviewed

We'll try to review your PR as soon as possible within one business week of submission. Small changes or updates to our documentation will be faster than changes made to other projects, especially apps. Please note that not all PRs will be accepted and review times may vary.

# reddit-devplatform-monorepo

## Monorepo structure

This monorepo build is managed by [Turborepo](https://github.com/vercel/turborepo), which is a build tool for JavaScript projects.

Different logical parts of the code are split into separate `packages/<foo|bar|baz>` folders. Note that not all packages are pure JavaScript packages, but the scripts to build and install dependencies, as well as their interdependence on each other, are managed through `package.json` files. This enables TurboRepo to manage the build ordering and high-level commands.

Packages need to each provide their own `yarn build` command.

For an example of how to set things up, check out [turbo's kitchen-sink example](https://github.com/vercel/turborepo/tree/main/examples/kitchen-sink).

To make a new package quickly, you can copy the `template-package` directory and rename it and its `package.json->name` field.

## Building locally

### Dependencies

- Node v22 - specifically, v22.2.0 or later. We recommend you [install it using NVM.](https://github.com/nvm-sh/nvm)
- yarn, should be pre-installed on node18 with corepack enabled:
  ```sh
  corepack enable
  ```

#### Installing

Install JavaScript dependencies by running `yarn` from the repo root. This will install all
dependencies for all packages. It'll also generate a `yarn.lock` file, which is ignored - we
maintain that lockfile internally, so you don't need to worry about it in this repo.

### Running commands for a specific workspace

- Top level `yarn <foo>` commands run through [turborepo](https://github.com/vercel/turborepo) for
  all packages
- `yarn workspace <package-name> foo` will do `yarn run foo`only for the package with matching
  `<package-name>`field from a specific `package.json`

### Build all packages

- `yarn` to install
- `yarn build` to build all packages in order

### Testing, linting, and type checking

- `yarn` to install deps
- `yarn test` to test all packages and check their TypeScript types
- `yarn lint` to lint all packages

## Help

Need help? Check out the [Devvit](https://www.reddit.com/r/devvit/) community on
Reddit.


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/Devpost.md

# Devpost

Source: https://redditdailygames2026.devpost.com/forum_topics/new

Please sign up or log in to continue.

Already have an account? [Log in](/users/login?ref=signup-login&return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2Fnew)

[__Sign up with GitHub](https://devpost.com/authentications/initiate/github?return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2Fnew) [__Sign up with Facebook](https://devpost.com/authentications/initiate/facebook?return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2Fnew) [__Sign up with Google](https://devpost.com/authentications/initiate/google_oauth2?return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2Fnew) [__Sign up with LinkedIn](https://devpost.com/authentications/initiate/linkedin?return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2Fnew)

or sign up with email

First name

Last name

Email

Password

__Sign up with email

Subscribe me to Devpost's weekly newsletter (hackathons, community updates, and awesome projects)

By creating an account, you agree to our [Terms of Service](https://info.devpost.com/terms) and [Privacy Policy](https://info.devpost.com/privacy).

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/Google_Calendar_-_Sign_in_to_Access__amp__Edit_You.md

# Google Calendar - Sign in to Access &amp; Edit Your Schedule

Source: https://redditdailygames2026.devpost.com/calendar/google

![Google](//ssl.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png)

# Sign in

to continue to Google Calendar

Email or phone

[Forgot email?](/signin/usernamerecovery?continue=https://calendar.google.com/calendar/render?action%3DTEMPLATE%26dates%3D20260213T020000Z/20260213T020000Z%26details%3Dhttps://redditdailygames2026.devpost.com/%26location%26sprop%3Dhttps://redditdailygames2026.devpost.com/%26text%3DThe%2BReddit%2BDaily%2BGames%2BHackathon%2Bsubmission%2Bdeadline&dsh=S1746195370:1770167290436114&emr=1&flowEntry=ServiceLogin&flowName=WebLiteSignIn&followup=https://calendar.google.com/calendar/render?action%3DTEMPLATE%26dates%3D20260213T020000Z/20260213T020000Z%26details%3Dhttps://redditdailygames2026.devpost.com/%26location%26sprop%3Dhttps://redditdailygames2026.devpost.com/%26text%3DThe%2BReddit%2BDaily%2BGames%2BHackathon%2Bsubmission%2Bdeadline&ifkv=AXbMIuAMoTeIwGRzil_3aWV8JFOFnnu1IX4dkkqmOHploYIUSi9ULVHEzNmsk86lAIr_kyOZCIknUA&osid=1&service=cl)

Not your computer? Use a private browsing window to sign in. [Learn more about using Guest mode](https://support.google.com/accounts?p=signin_privatebrowsing&hl=en-US)

Next

[Create account](/lifecycle/flows/signup?continue=https://calendar.google.com/calendar/render?action%3DTEMPLATE%26dates%3D20260213T020000Z/20260213T020000Z%26details%3Dhttps://redditdailygames2026.devpost.com/%26location%26sprop%3Dhttps://redditdailygames2026.devpost.com/%26text%3DThe%2BReddit%2BDaily%2BGames%2BHackathon%2Bsubmission%2Bdeadline&dsh=S1746195370:1770167290436114&emr=1&flowEntry=SignUp&flowName=GlifWebSignIn&followup=https://calendar.google.com/calendar/render?action%3DTEMPLATE%26dates%3D20260213T020000Z/20260213T020000Z%26details%3Dhttps://redditdailygames2026.devpost.com/%26location%26sprop%3Dhttps://redditdailygames2026.devpost.com/%26text%3DThe%2BReddit%2BDaily%2BGames%2BHackathon%2Bsubmission%2Bdeadline&ifkv=AXbMIuAMoTeIwGRzil_3aWV8JFOFnnu1IX4dkkqmOHploYIUSi9ULVHEzNmsk86lAIr_kyOZCIknUA&osid=1&service=cl)

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/MANIFEST.json

{
  "source": "Reddit Daily Games Hackathon 2026",
  "url": "https://redditdailygames2026.devpost.com",
  "mode": "raw",
  "scraped_at": "2026-02-04T02:08:01.845060",
  "document_count": 17,
  "error_count": 2,
  "documents": [
    {
      "url": "https://redditdailygames2026.devpost.com",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/resources",
      "title": "Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/project-gallery",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/updates",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/calendar/outlook",
      "title": "Outlook",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/calendar/google",
      "title": "Google Calendar - Sign in to Access &amp; Edit Your Schedule",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/calendar",
      "title": "calendar",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/details/dates",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/register",
      "title": "Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/forum_topics",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/participants",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/rules",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/updates/41628-action-required-updated-submission-form-for-reddit-daily-games-hackathon",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/users/login",
      "title": "Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/forum_topics/42914-domain-exceptions-approval",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/forum_topics/new",
      "title": "Devpost",
      "type": "html"
    },
    {
      "url": "https://redditdailygames2026.devpost.com/forum_topics/42947-sawnoar",
      "title": "The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost",
      "type": "html"
    }
  ],
  "errors": [
    "https://redditdailygames2026.devpost.com/signin/usernamerecovery: 404 Client Error: Not Found for url: https://redditdailygames2026.devpost.com/signin/usernamerecovery",
    "https://redditdailygames2026.devpost.com/lifecycle/flows/signup: 404 Client Error: Not Found for url: https://redditdailygames2026.devpost.com/lifecycle/flows/signup"
  ]
}

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/Outlook.md

# Outlook

Source: https://redditdailygames2026.devpost.com/calendar/outlook



---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/The_Reddit_Daily_Games_Hackathon__Join_Reddit_and_.md

# The Reddit Daily Games Hackathon: Join Reddit and GameMaker to build incredible daily games for the Reddit community! - Devpost

Source: https://redditdailygames2026.devpost.com/forum_topics/42947-sawnoar

[ Back to all discussions ](/forum_topics)

[![Gue Gue](https://lh3.googleusercontent.com/a/ACg8ocIf8qs2rQec1k4H0b_xx-PYswh25_U2EozRJGI8tcsd1TTfxA=s96-c?type=square)](https://devpost.com/ggue6926)

[Gue Gue](https://devpost.com/ggue6926) • 1 day ago

### SAWNOAR 

0922419643

  * ### 0 comments

Email me when new comments are added 

**[Log in](https://secure.devpost.com/users/login)** or **[sign up for Devpost](https://secure.devpost.com/users/register?flow%5Bdata%5D%5Bcommentable_id%5D=42947&flow%5Bname%5D=comment_on_forum_topic&return_to=https%3A%2F%2Fredditdailygames2026.devpost.com%2Fforum_topics%2F42947-sawnoar)** to join the conversation.

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801_/calendar.md

# calendar

Source: https://redditdailygames2026.devpost.com/calendar

BEGIN:VCALENDAR VERSION:2.0 PRODID:-//Devpost\, Inc.//The Reddit Daily Games Hackathon//EN CALSCALE:GREGORIAN BEGIN:VTIMEZONE TZID:America/Los_Angeles BEGIN:DAYLIGHT DTSTART:20260308T030000 TZOFFSETFROM:-0800 TZOFFSETTO:-0700 RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3 TZNAME:PDT END:DAYLIGHT BEGIN:STANDARD DTSTART:20251102T010000 TZOFFSETFROM:-0700 TZOFFSETTO:-0800 RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11 TZNAME:PST END:STANDARD END:VTIMEZONE BEGIN:VEVENT DTSTAMP:20260204T010811Z UID:8e509f4e-15f6-4fe4-9844-c37a3bd20cf8 DTSTART;TZID=America/Los_Angeles:20260212T180000 DTEND;TZID=America/Los_Angeles:20260212T180000 DESCRIPTION:https://redditdailygames2026.devpost.com/ SUMMARY:The Reddit Daily Games Hackathon submission deadline BEGIN:VALARM ACTION:DISPLAY TRIGGER:-P7D SUMMARY:Just 7 left days until the submission deadline! END:VALARM END:VEVENT END:VCALENDAR

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/0_11.md

# 0.11

Source: https://developers.reddit.com/docs/0.11

This is documentation for Reddit for Developers **0.11** , which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](/docs/)** (0.12).

Version: 0.11

On this page

Meet Devvit: Reddit’s Developer Platform that lets you build powerful apps to enhance the communities you love.

## Bring your imagination to life​

Devvit lets you create rich, immersive posts that seamlessly integrate into Reddit’s ecosystem.

Build interactive posts that ignite your community:

  * [Live scoreboards](/docs/0.11/showcase/apps#live-scores) that give your community play-by-play updates and a space for shitposting during the game.
  * [Polls](/docs/0.11/showcase/playgrounds) to provoke spicy conversations or take the pulse of your community.
  * [Multiplayer games](/docs/0.11/showcase/apps#bingo) played asynchronously or with other redditors in real time.

Or create an entirely new [community game](/docs/0.11/community_games) around an app, like [r/Pixelary](https://www.reddit.com/r/Pixelary/), a multiplayer game created just for redditors to draw, guess, and compete for bragging rights.

## Tools at your fingertips​

Building on Devvit is simple and comes with built-in tools to help you succeed:

  * [Playground](/docs/0.11/playground) – an interactive code editor with a live preview window that lets you experiment with blocks and try out your ideas.
  * [@devvit/kit](/docs/0.11/devvit_kit) – a library of UI components and backend patterns you can use to build your apps fast.
  * [Devvit CLI](/docs/0.11/devvit_cli) – the bridge between your codebase and Reddit.

Reddit hosts your code with dedicated Redis-backed storage. The UI toolkit lets you build [interactive posts](/docs/0.11/interactive_posts), add new buttons, and create unique post layouts. Triggers let you listen to and respond to events. You only have to write code once, and it’s available on web, iOS, and Android platforms.

## Community and support​

Reddit’s Developer Platform provides a supportive environment where you can collaborate, ask questions, share knowledge, and inspire one another. Join [r/devvit](https://www.reddit.com/r/devvit/) or become a member of our [Discord](https://developers.reddit.com/discord) channel. Browse example apps in our [public repo](https://github.com/reddit/devvit/tree/main/packages/apps) for project code you can fork and make your own.

## Ready to explore?​

If you're a dev, checkout the [quickstart](/docs/0.11/quickstart).

If you’re a mod, here’s [everything you need to know](/docs/0.11/mod_resources) about adding apps to your community.

  * Bring your imagination to life
  * Tools at your fingertips
  * Community and support
  * Ready to explore?

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/Apps___Reddit_for_Developers.md

# Apps | Reddit for Developers

Source: https://developers.reddit.com/apps

*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/Bot_Bouncer___Reddit_for_Developers.md

# Bot Bouncer | Reddit for Developers

Source: https://developers.reddit.com/apps/bot-bouncer

Bot Bouncer is a Dev Platform app that bans bots and other harmful accounts from subreddits that use it. It is heavily inspired by BotDefense, which wrapped up operations in 2023.

Bots are classified via submissions on [/r/BotBouncer](https://www.reddit.com/r/BotBouncer/), via a mix of automated and human classification.

If you add Bot Bouncer to your sub via the Dev Platform app directory, it will watch for all new submissions and comments from users, and if the account is classified as a bot by the app, it will be banned.

Bot Bouncer is open source. [You can find the source code on GitHub here](https://github.com/fsvreddit/bot-bouncer). Bot Bouncer has a [wiki] that describes in more detail how the app operates.

## The ban process

If a user creates a post or comment on your subreddit and the user is classified as a bot already, the post or comment will be removed immediately and the user banned. Newly classified bots will also be banned if they have posted or commented on your subreddit within the past week shortly after being classified.

Mods can choose to configure the app to report users rather than ban and remove. This might be useful if you want to get a feel for the accuracy of Bot Bouncer's detections before putting it in full "ban" mode.

## Exempting Users

By default, any bots that you unban are automatically allowlisted and will not be banned again (although this can be turned off).

If you want to preemptively allowlist a user, add the account as an Approved Submitter to your subreddit - Bot Bouncer will never ban approved submitters or moderators.

You can also set a user flair with a CSS class that ends with `proof`. This is so that legacy flairs such as `botbustproof` will prevent a user from being banned.

## Submitting users for review

Subreddit moderators can report the bot from a post or comment's context menu. Choose "Report to /r/BotBouncer".

Otherwise, you can create a link post on [/r/BotBouncer](https://www.reddit.com/r/BotBouncer/) that links to the user's profile. Bot Bouncer will then remove your post and replace it with its own submission for the account, and then the evaluation process will start.

If you feel that you can add extra context to the submission, for example if you have detected bot-like activity that you think may not be obvious, you can create a comment on the new post explaining why the user is a bot. For example a user might look superficially human, but might be copying content from other users. If reporting via the post/comment menu, you will be prompted to optionally add context at this point.

Also, consider **reporting the account**. Bot accounts should be reported to Reddit as Spam->Disruptive use of bots or AI. Reddit's spam detection is getting better all the time and in many cases, the bot's account will be shadowbanned immediately.

## Accounts in scope for Bot Bouncer

Bot Bouncer bans any bot that makes automatic comments or posts without being explicitly summoned. This includes LLM karma farming bots, annoying "reply" bots that break Bottiquette, and so on.

Bot Bouncer will not ban useful service bots, such as ones that respond to user commands (e.g. RemindMeBot or stabbot), nor will it add bots that have been added as moderators or approved users, or have a flair with a CSS class ending in `proof`.

Bot Bouncer is not a generic anti-spam or anti-porn app. If someone is promoting a product, service or adult content in a human manner, they are out of scope.

## Dealing with classifications you feel are incorrect

If you think that you've found a bot that's already marked as human, write in to [/r/BotBouncer's modmail](https://www.reddit.com/message/compose/?to=/r/BotBouncer) with details of why you think that this is the case. Sometimes mistakes are made and we rely on assistance to get classifications right.

Users who have been unfairly banned by Bot Bouncer should be encouraged to modmail in to /r/BotBouncer to appeal their ban. Alternatively, you can do this on the user's behalf. While you can unban the user yourself, this only affects the user on your subreddit and does not prevent the user from being banned from other subreddits.

# Change History

## v1.24.0

  * Fixed erroneous errors referencing no recent posts/comments when reporting users
  * Add new evaluator type
  * Improved performance (reducing Dev Platform resource usage)
  * Improve reliability of banning users already classified as bots when they post or comment
  * Add option (disabled by default) to lock posts/comments when the app removes them
  * If "Add mod note on classification change" is turned on, a link to the account's tracking post is included on the mod note when banning or unbanning
  * Internal changes to support operations on /r/BotBouncer

## v1.23.1

  * Bot Bouncer can now accept a moderator invite if it has been accidentally removed from the mod list
  * Reduced Dev Platform resource usage
  * Internal changes to support operations on /r/BotBouncer

## v1.22.1

  * Improve resilience of app if required permissions are accidentally removed from the app's user account
  * Reduce false positives on one evaluator
  * Action summary (formerly daily digest) can now be sent either daily or weekly on Mondays
  * Action summary (formerly daily digest) no longer incorrectly shows deleted users as if they have been unbanned by Bot Bouncer
  * Improved performance to reduce compute load on Dev Platform infrastructure
  * Improved evaluation capabilities for the Bot Group Advanced evaluator
  * Internal changes to support operations on /r/BotBouncer

## v1.21.0

  * Faster response to bot classification changes, down from up to ten minutes to up to one minute
  * Faster refreshes of bot detection config, down from up to an hour to up to five minutes
  * Embolden instruction in default ban message to emphasise contacting /r/BotBouncer
  * Internal changes to support operations on /r/BotBouncer

For older versions, please see the [full changelog](https://github.com/fsvreddit/bot-bouncer/blob/main/changelog.md).

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/DEVVIT_DOCS_INDEX.md

# Devvit Developer Platform - Documentation Index

Source: https://developers.reddit.com/docs
Scraped: 2026-02-04T02:08:01

## Documentation URLs

### Introduction & Overview
| Page | URL |
|------|-----|
| Welcome to Devvit | https://developers.reddit.com/docs/ |
| Devvit Technical Overview | https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview |
| App Showcase | https://developers.reddit.com/docs/examples/app-showcase |

### Getting Started - Games
| Page | URL |
|------|-----|
| Introduction to Games | https://developers.reddit.com/docs/introduction/intro-games |
| Quickstart for Games | https://developers.reddit.com/docs/quickstart |
| Quickstart for Unity | https://developers.reddit.com/docs/quickstart/quickstart-unity |
| Quickstart for GameMaker | https://developers.reddit.com/docs/quickstart/quickstart-gamemaker |

### Getting Started - Mod Tools
| Page | URL |
|------|-----|
| Introduction to Mod Tools | https://developers.reddit.com/docs/introduction/intro-mod-tools |
| Quickstart for Mod Tools | https://developers.reddit.com/docs/quickstart/quickstart-mod-tool |

### Guides & Tools
| Page | URL |
|------|-----|
| Launch Guide | https://developers.reddit.com/docs/guides/launch/launch-guide |
| Devvit CLI | https://developers.reddit.com/docs/guides/tools/devvit_cli |
| Testing | https://developers.reddit.com/docs/guides/tools/devvit_test |

### Server Capabilities
| Page | URL |
|------|-----|
| Server Overview | https://developers.reddit.com/docs/capabilities/server/overview |
| HTTP Fetch | https://developers.reddit.com/docs/capabilities/server/http-fetch |
| Redis | https://developers.reddit.com/docs/capabilities/server/redis |

### API Reference
| Page | URL |
|------|-----|
| RedditAPIClient | https://developers.reddit.com/docs/api/redditapi/RedditAPIClient/classes/RedditAPIClient |

### Configuration & Release
| Page | URL |
|------|-----|
| Devvit Configuration | https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration |
| Changelog | https://developers.reddit.com/docs/changelog |

### External Resources
| Page | URL |
|------|-----|
| Reddit Developer Funds | https://support.reddithelp.com/hc/en-us/articles/27958169342996-Reddit-Developer-Funds-2025-Terms |

## Key Concepts

### Devvit Platform Overview
- **Build Games**: Interactive games that run directly on Reddit posts
- **Create Mod Tools**: Moderation utilities for subreddit management
- **Developer Funds**: Earn up to $167,000 per app through Reddit Developer Funds

### Stack Requirements
- **Node.js v22.2.0+** (use NVM for installation)
- **Yarn** (via corepack enable)
- **Devvit CLI**: `npx devvit`

### Key Features
- **Redis**: Built-in key-value storage for game state
- **HTTP Fetch**: Make external API calls from your app
- **Scheduler**: Run background tasks and jobs
- **Devvit Blocks**: UI framework (Stacks, Text, Icons, Buttons, Images)
- **Reddit API Client**: Direct access to Post, Comment, Subreddit APIs


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/MANIFEST.json

{
  "source": "Devvit Developer Platform",
  "url": "https://developers.reddit.com/docs",
  "mode": "raw",
  "scraped_at": "2026-02-04T02:08:01.844926",
  "document_count": 49,
  "error_count": 1,
  "documents": [
    {
      "url": "https://developers.reddit.com/docs",
      "title": "docs",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/discord",
      "title": "Reddit Developer Platform",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/examples/template-library",
      "title": "template-library",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/examples/app-showcase",
      "title": "app-showcase",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_overview",
      "title": "payments_overview",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/devvit_rules",
      "title": "devvit_rules",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/changelog",
      "title": "changelog",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/scheduler",
      "title": "scheduler",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/0.11",
      "title": "0.11",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/launch/launch-guide",
      "title": "launch-guide",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/reddit-api",
      "title": "reddit-api",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/migrate/devvit-singleton",
      "title": "devvit-singleton",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/realtime/overview",
      "title": "overview",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/blog",
      "title": "blog",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next",
      "title": "next",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com",
      "title": "Reddit for Developers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/http-fetch",
      "title": "http-fetch",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/redis",
      "title": "redis",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/launch/feature-guide",
      "title": "feature-guide",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/client/navigation",
      "title": "navigation",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/introduction/intro-games",
      "title": "intro-games",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/blocks/overview",
      "title": "overview",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/media-uploads",
      "title": "media-uploads",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/best-practices/community_games",
      "title": "community_games",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/tools/devvit_cli",
      "title": "devvit_cli",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/guides/ai",
      "title": "ai",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/introduction/intro-mod-tools",
      "title": "intro-mod-tools",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration",
      "title": "devvit_web_configuration",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview",
      "title": "devvit_web_overview",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/splash_migration",
      "title": "splash_migration",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next/examples/template-library",
      "title": "template-library",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/client/menu-actions",
      "title": "menu-actions",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next/examples/app-showcase",
      "title": "app-showcase",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/apps/bot-bouncer",
      "title": "Bot Bouncer | Reddit for Developers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/apps/community-home",
      "title": "\ud83d\ude80 \u200b\u200b\u200b\u200b\u200bCommunity Home + Topic Posts | Reddit for Developers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_manage",
      "title": "payments_manage",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_add",
      "title": "payments_add",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/my/settings",
      "title": "Reddit for Developers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/support_this_app",
      "title": "support_this_app",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next/earn-money/payments/payments_overview",
      "title": "payments_overview",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_migrate",
      "title": "payments_migrate",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_publish",
      "title": "payments_publish",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/earn-money/payments/payments_test",
      "title": "payments_test",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/triggers",
      "title": "triggers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/apps",
      "title": "Apps | Reddit for Developers",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next/devvit_rules",
      "title": "devvit_rules",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/0.11/devvit_rules",
      "title": "devvit_rules",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/next/changelog",
      "title": "changelog",
      "type": "html"
    },
    {
      "url": "https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/launch_screen_customization",
      "title": "launch_screen_customization",
      "type": "html"
    }
  ],
  "errors": [
    "https://developers.reddit.com/docs/help: 404 Client Error: Not Found for url: https://developers.reddit.com/docs/help"
  ]
}

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/Reddit_Developer_Platform.md

# Reddit Developer Platform

Source: https://developers.reddit.com/discord

You need to enable JavaScript to run this app.

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/Reddit_for_Developers.md

# Reddit for Developers

Source: https://developers.reddit.com/my/settings

![Animated goose from the Honk game](https://www.redditstatic.com/devvit-dev-portal/assets/landing-page/gif-honk.gif)

###  Honk 

Complete levels to earn loot & climb the leaderboard 

[ Learn more ](https://developers.reddit.com/docs/blog/honk) [ Play on Reddit ](https://www.reddit.com/r/honk/)

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/_______Community_Home___Topic_Posts___Reddit_for_D.md

# 🚀 ​​​​​Community Home + Topic Posts | Reddit for Developers

Source: https://developers.reddit.com/apps/community-home

##  #Community

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/ai.md

# ai

Source: https://developers.reddit.com/docs/guides/ai

On this page

Devvit ships with first class support for common AI tools and patterns.

## LLMs.txt files​

  * <https://developers.reddit.com/docs/llms.txt>: Most useful for pasting into the chat UI of common LLMs BEFORE your prompt. Place your prompt last as models are auto-regressive.
  * <https://developers.reddit.com/docs/llms-full.txt>: Useful for pasting into the chat UI of LLMs with large context windows (Gemini, Claude Sonnet 4). This lets you chat with the docs instead of reading them. It's easy to pollute your context if your using this for coding so we recommend only using this to learn about Devvit or plan. To execute, use `llms.txt` as most modern LLMs can tool call websites.

## Cursor Support​

The React, ThreeJS, and Phaser templates ship with support for cursor rules out of the box. We've found these helps Cursor output high quality code for Devvit. Feel free to add and remove them as you see fit.

## MCP​

Devvit ships with a MCP server to assist with agent driven development. There are two commands at the moment:

  * `devvit_search`: Executes hybrid search over all of our docs. This is preferable to pasting in tons of docs since it can be more specific and lowers the risk of polluting your context.
  * `devvit_logs` [experimental]: Queries for logs of your app and a subreddit to place into an agent's context. It can be fun any useful, and shows a glimpse of the future of AI Devvit! Try this after MCP is turned on in your agent, "find a bug in my app deployed to the subreddit <YOUR_SUBREDDIT_NAME> from the past week and a fix it". It might not work, but when it does, magic!

### Cursor​

> Note that React, ThreeJS, and Phaser ship with first class support. All you have to do is run a template from [/new](https://developers.reddit.com/new) in cursor and you will see a popup at the bottom-left corner to enable.

  1. In your project, ensure a `.cursor` directory exists at the root. Create it if necessary.

  2. Inside `.cursor`, create or open the `mcp.json` file.

  3. Paste the following configuration into `mcp.json`:

mcp.json
         
         {  
           "mcpServers": {  
             "devvit": {  
               "command": "npx",  
               "args": ["-y", "@devvit/mcp"]  
             }  
           }  
         }  
         

  4. Save the file.

  5. Check [Cursor](https://www.cursor.com/)'s **Settings/MCP** section. The Devvit MCP server should show an active status (green indicator). You might need to click "Refresh" if it doesn't appear immediately.

### Claude Code​
    
    
    claude mcp add devvit -- npx -y @devvit/mcp  
    

Things should work after that!

### Claude Desktop​

  1. Open the [Claude desktop](https://claude.ai/download) application and go to **Settings**.
  2. Navigate to the **Developer** tab and click **Edit Config**.
  3. Add the Devvit server configuration:

    
    
    {  
      "mcpServers": {  
        "devvit": {  
          "command": "npx",  
          "args": ["-y", "@devvit/mcp"]  
        }  
      }  
    }  
    

  4. Save the configuration file and restart the Claude desktop application.
  5. When starting a new chat, look for the MCP icon (hammer); the Devvit server should now be listed as available.

### Visual Studio Code (Copilot)​

  1. Ensure your project root contains a `.vscode` directory. Create one if it's missing.

  2. Create or open the `mcp.json` file within the `.vscode` directory.

  3. Insert the following configuration:

mcp.json
         
         {  
           "servers": {  
             "devvit": {  
               "command": "npx",  
               "args": ["-y", "@devvit/mcp"]  
             }  
           }  
         }  
         

  4. Save `mcp.json`.

  5. In the Copilot chat panel within [Visual Studio Code](https://code.visualstudio.com/), ensure you're in "Agent" mode. The tool icon should now indicate that Devvit MCP tools are available for use.

Refer to the [official Copilot documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for further details on VS Code MCP integration.

### Testing the Connection​

With your AI tool configured, you should now be able to leverage the Devvit MCP server. A good way to test this is to ask your AI assistant a question that requires accessing Devvit resources, for example: "Search the Devvit docs for information on redis."

If you encounter problems, refer to the official Devvit documentation or reach out in the [Discord](https://developers.reddit.com/discord).

  * LLMs.txt files
  * Cursor Support
  * MCP
    * Cursor
    * Claude Code
    * Claude Desktop
    * Visual Studio Code (Copilot)
    * Testing the Connection

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/app-showcase.md

# app-showcase

Source: https://developers.reddit.com/docs/next/examples/app-showcase

This is unreleased documentation for Reddit for Developers **Next** version.

For up-to-date documentation, see the **[latest version](/docs/examples/app-showcase)** (0.12).

Version: Next

[![Pixelary](/docs/assets/images/pixelary-91e3054ff99b5fe384a37a7563e56b02.png)PixelaryBy u/Oppdager](https://reddit.com/r/Pixelary)[![What The?!](/docs/assets/images/what-the-80d405976ac55e684a363f0a006ae5a4.png)What The?!By Lil Snack Studios](https://reddit.com/r/WhatTheGame)[![Community Home](/docs/assets/images/community-home-caf8675db1f45092a85b73725de00a6a.png)Community HomeBy u/xenc](https://developers.reddit.com/apps/community-home)[![Honk](/docs/assets/images/honk-9fe4aacaa3dc9d7b4e1fb1542b3e5d5b.png)HonkBy u/thejohnnyr](https://reddit.com/r/honk)[![Riddonkulous](/docs/assets/images/riddonkulous-538a8216f0bb9ddccb52ba7553bf2a43.png)RiddonkulousBy u/hammertimestudios](https://reddit.com/r/Riddonkulous)[![Bot Bouncer](/docs/assets/images/bot-bouncer-128e2f44f01a15833bd2ded7d9a53612.png)Bot BouncerBy u/fsv](https://developers.reddit.com/apps/bot-bouncer)[![Sword and Supper](/docs/assets/images/sword-and-supper-eaf417441ff9d6d7197026829c86e3d2.png)Sword and SupperBy Cabbage Studios](https://reddit.com/r/SwordAndSupperGame)[![Hightier](/docs/assets/images/hightier-ed8248a91a7173b2d24b91d2a5eecbc7.png)HightierBy u/mutualdisagreement](https://reddit.com/r/Hightier)

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/blog.md

# blog

Source: https://developers.reddit.com/docs/blog

Last month saw an incredible jump in payouts from Reddit’s Developer Funds! Thanks to a wave of new apps and games driving engagement and installs, our payouts more than doubled from October — yes, you read that right — surpassing **$163,000** in qualified rewards.

Here are just some examples of games and apps that made a big splash this month:

  * [Admin Tattler](https://developers.reddit.com/apps/admin-tattler)
  * [AI Moderator](https://developers.reddit.com/apps/ai-moderator)
  * [AITACheck](https://developers.reddit.com/apps/aitacheck)
  * [App Reply Notify](https://developers.reddit.com/apps/app-reply-notify)
  * [Modmail Automator](https://developers.reddit.com/apps/auto-modmail)
  * [Auto Post Lock](https://developers.reddit.com/apps/auto-post-lock)
  * [Automod Sync](https://developers.reddit.com/apps/automod-sync)
  * [Extended Ban](https://developers.reddit.com/apps/ban-extended)
  * [Ban Hammer App](https://developers.reddit.com/apps/banhammerapp)
  * [Binary Grid](https://developers.reddit.com/apps/binarygrid)
  * [Bot Bouncer](https://developers.reddit.com/apps/bot-bouncer)
  * [Chive Cutter](https://developers.reddit.com/apps/chive-cutter)
  * [Nuzzle-The-Puzzle](https://developers.reddit.com/apps/colloni-tuddlee)
  * [Critical State App](https://developers.reddit.com/apps/criticalstateapp)
  * [Daily Thread](https://developers.reddit.com/apps/daily-thread)
  * [Discord Relay](https://developers.reddit.com/apps/discord-relay)
  * [Drawing App](https://developers.reddit.com/apps/drawing-app)
  * [Duel Take](https://developers.reddit.com/apps/dueltake)
  * [Evasion Guard](https://developers.reddit.com/apps/evasion-guard)
  * [Find the Sniper](https://developers.reddit.com/apps/findthesniperapp)
  * [Flair Assistant](https://developers.reddit.com/apps/flairassistant)
  * [Flood Assistant](https://developers.reddit.com/apps/floodassistant)
  * [GeoTap](https://developers.reddit.com/apps/geotap-app)
  * [Harvest Match](https://developers.reddit.com/apps/harvestmatch)
  * [Hexaword](https://developers.reddit.com/apps/hexaword-game)
  * [Hive Protect](https://developers.reddit.com/apps/hive-protect)
  * [Ignorit App](https://developers.reddit.com/apps/ignorit-app)
  * [Image Moderator](https://developers.reddit.com/apps/image-moderator)
  * [Image Polls](https://developers.reddit.com/apps/image-polls)
  * [Mobile Links](https://developers.reddit.com/apps/mobile-links)
  * [Moderator Mentions](https://developers.reddit.com/apps/mod-mentions)
  * [Modmail Quick User Summary](https://developers.reddit.com/apps/modmail-userinfo)
  * [Modmail Assistant](https://developers.reddit.com/apps/modmailassistant)
  * [Modmail to Discord](https://developers.reddit.com/apps/modmailtodiscord)
  * [Modqueue Nuke](https://developers.reddit.com/apps/modqueue-nuke)
  * [Modqueue Tools](https://developers.reddit.com/apps/modqueue-tools)
  * [Ninigrams](https://developers.reddit.com/apps/ninigrams-game)
  * [One Chess App](https://developers.reddit.com/apps/onechess-app)
  * [One Day Flair](https://developers.reddit.com/apps/onedayflair)
  * [Pixel Peeker](https://developers.reddit.com/apps/pixel-peeker)
  * [Pixelsandbox](https://developers.reddit.com/apps/pixelsandbox)
  * [Pocket Grids](https://developers.reddit.com/apps/pocket-grids)
  * [Press App](https://developers.reddit.com/apps/press-app)
  * [Modqueue Pruner](https://developers.reddit.com/apps/queue-pruner)
  * [Quiz Planet](https://developers.reddit.com/apps/quiz-planet-game)
  * [Read the Rules](https://developers.reddit.com/apps/read-the-rules)
  * [Reputator Bot](https://developers.reddit.com/apps/reputatorbot)
  * [Reason without Remembering](https://developers.reddit.com/apps/saved-response)
  * [Spam Nuke](https://developers.reddit.com/apps/spam-nuke)
  * [Spam Source Spotter](https://developers.reddit.com/apps/spam-src-spotter)
  * [Spotlight App](https://developers.reddit.com/apps/spotlight-app)
  * [Spotit](https://developers.reddit.com/apps/spottit-game)
  * [Stop AI](https://developers.reddit.com/apps/stop-ai)
  * [SubStats Bot](https://developers.reddit.com/apps/sub-stats-bot)
  * [SubGuard](https://developers.reddit.com/apps/subguard)
  * [Subscriber Count](https://developers.reddit.com/apps/subscriber-count)
  * [Subscriber Goal](https://developers.reddit.com/apps/subscriber-goal)
  * [Toolbox Notes Transfer](https://developers.reddit.com/apps/toolboxnotesxfer)
  * [Trending Tattler](https://developers.reddit.com/apps/trendingtattler)
  * [Word Herd](https://developers.reddit.com/apps/word-herd)
  * [Daily Guess](https://developers.reddit.com/apps/word-hunt)
  * [Word Strands](https://developers.reddit.com/apps/word-strands)
  * [Wordseekr Quotes](https://developers.reddit.com/apps/wordseekr2)
  * [YouTube Showcase](https://developers.reddit.com/apps/yt-app)

If you’ve read that list and are thinking about creating games or unique experiences on Reddit, now’s the time to dive in. Check out the [Reddit Developer Funds](https://developers.reddit.com/docs/earn-money/reddit_developer_funds) and see how your creativity can be rewarded while building for the community.

_Oh, so you want in on this and want to learn more?_

[Reddit's Developer Funds](https://developers.reddit.com/docs/earn-money/reddit_developer_funds), powered by Devvit (Reddit's Developer Platform), champions a low barrier to entry. The current program lets eligible developers earn up to $167,500 per app by focusing on user engagement. Monetization can start once your creation hits just 500 qualified daily players maintained for seven days. You should also check out our previous blog post [here](https://developers.reddit.com/docs/blog/RDF) with more information!

Happy developing, and we’ll see you next year with more updates and payouts.

When [u/thejohnnyr](https://www.reddit.com/user/thejohnnyr/) first started coding, he wasn’t dreaming of millions of players or thriving online communities. He was just trying to make his own version of Pokémon. Years later, after a detour into software engineering, he quit his job to chase game development full-time — and ended up building one of Reddit’s most beloved community games: [_Honk_](https://www.reddit.com/r/redditgames/).

![Play honk](/docs/assets/images/honk_1-1971cacd52b7b27d53cf27df7e9d64d7.gif)

Today, Honk has more than **300,000 subscribers** , a passionate community of creators, and players who spend hours designing or conquering levels. We talked with Johnny to learn more about his journey, his experience building for Reddit, and what’s next for _Honk_.

## From side projects to full-time game development​

Johnny’s path to game dev wasn’t a straight line. After dabbling in coding games in college, he pursued a more traditional software engineering career. But two years ago, he decided to take the leap:

“On a whim, I jumped into building games full time! I wasn’t making any money, but picked up contract software work on the side to pay the bills. I chose web platforms because I love that web games are accessible to anyone, without downloads or installs. Plus, it’s a fun challenge to optimize for performance since players load the game fresh every time.” 

  

That passion for accessibility and optimization laid the foundation for what would become his breakout success.

## Discovering Reddit’s Developer Platform​

Johnny stumbled across Reddit’s new Developer Platform, [Devvit](https://developers.reddit.com/), in his own feed. At the time, he had already been experimenting with web games for two years.

When Reddit announced a hackathon, he decided to give it a shot — and won first prize with _Chook_ , a 3D low-poly multiplayer game where Redditors work together to feed a virtual chicken.

“This was my first hackathon ever, and I put a ton of work into Chook over three weeks. Winning felt incredible. It gave me the confidence to try something even bigger.” 

  

That “something bigger” arrived just days later.

## The birth of Honk​

Fresh off the [hackathon win](https://www.reddit.com/r/Devvit/comments/1jwwzsq/announcing_the_winners_of_hack_reddit/), Johnny hacked together another game over a weekend. His goal? A simple spin on _Honk_ , designed to feel “Reddit-y,” with a live leaderboard that would draw players in.

What started as a small experiment quickly evolved into a thriving ecosystem:

  * **User-generated levels** : Redditors can design and share their own Honk courses.

  * **Cosmetics and quests** : Players can customize their goose and unlock challenges.

  * **Community-driven updates** : Feedback from players directly shapes new features.

“Some days I spend the entire day just coding new Honk features. It’s addictive — every time I release an update, the community response is amazing.” 

  

The numbers speak for themselves: over 300,000 subscribers and countless hours poured into custom levels.

## The power of user-generated content​

Johnny credits Honk’s explosive growth to one feature: the **level builder**.

“I launched the game with just classic mode and was getting decent traction. But once I added the level builder, things really took off. People immediately started creating a new level every minute — and using game objects in ways I never expected. That fresh content kept pulling in new users through Reddit’s feed algorithm.” 

  

From self-playing “auto levels” to creative story-driven challenges, the ingenuity of Redditors has kept the game fresh and endlessly re-playable.

![Honk with cow](/docs/assets/images/honk_2-5026fc661498c411ba02777af186c8d1.gif)

Check out some of Johnny’s favorite player-made levels:

  * [The Doom of the Kittens](https://www.reddit.com/r/RedditGames/comments/1mhhjpa/the_doom_of_the_kittens/)

  * [Save the Train](https://www.reddit.com/r/FlappyGoose/comments/1mm2lr8/save_the_train_and_clear_the_tracks/)

  * [No Swimming](https://www.reddit.com/r/FlappyGoose/comments/1mukqlf/no_swimming/)

  * [Let the Clouds Guide You](https://www.reddit.com/r/FlappyGoose/comments/1m6rh6y/let_the_clouds_guide_you/)

## Keeping it free and fun​

Monetization is always a tricky question for indie developers. For Johnny, the answer was simple:

“I wanted to keep Honk totally free to play, with no pay-to-win features. Players can earn gems and feathers just by playing, but for those who don’t have time to grind, there’s an option to buy cosmetics. It supports development without compromising fairness.” 

  

That decision has kept the community happy — and growing.

## Building with Reddit​

Beyond the player community, Johnny highlights Reddit’s Developer Platform team as a key partner in _Honk_ ’s success.

“The Reddit team has been fantastic. They’ve helped with promotion, infrastructure, bug fixes, even hotfix approvals at odd hours. Honestly, all I’ve had to do is focus on building the game.” 

  

That support, paired with Reddit’s built-in network effects, makes the platform a dream for indie developers looking to find an audience.

## Advice for aspiring Reddit game devs​

For other developers considering Reddit’s Developer Platform, Johnny has some clear advice:

  * **Embrace UGC** : “User Generated Content is your friend.”

  * **Think mobile-first** : Most players will be on phones.

  * **Launch early** : Don’t wait for perfection — test ideas quickly and see what sticks.

And above all:

“Absolutely go for it! Even if your game doesn’t blow up, you can still reach new audiences and potentially earn money. Compared to past projects that went undiscovered, Reddit is magnitudes better.” 

## Looking ahead​

With _Honk_ soaring, Johnny’s eyes are on the future — not just for his game, but for Reddit’s developer ecosystem.

“I’d love to see Reddit host a convention or meetup for developers. Meeting fellow devs and the team in person would be amazing.” 

  

Until then, he’ll keep building, updating, and honking forward — one goose at a time.

After weeks of building, testing, and showcasing creativity, we’re excited to announce the winners of the [**Fun and Games with Devvit Web Hackathon**](https://redditfunandgames.devpost.com/)!

Our multi-disciplinary panel of judges had their work cut out for them—this was one of our most competitive hackathons yet, with an incredible range of submissions. The level of polish across the board was inspiring, and the scoring was razor-close.

You can browse all of the amazing projects in the [Hackathon Project Gallery](https://redditfunandgames.devpost.com/project-gallery), but today we’re celebrating the ones that rose to the very top.

## The Winners​

### Best UGC App​

  * [Oneline](https://www.reddit.com/r/OnelineGame/comments/1mn8x63/draw_and_guess/) by u/Due_Analyst_5617

### Best Daily Game App​

  * [Hexaword](https://www.reddit.com/r/hexaword/comments/1niggxb/hexaword_1/) by u/another_moose

#### Honorable Mentions​

  * [Colorwar](https://www.reddit.com/r/ColorwarPlay/) by u/ABINJITHTK
  * [Split Sketch](https://www.reddit.com/r/SplitSketch/comments/1nd81ms/split_sketch_collaborative_drawing_game/) by u/Due_Analyst_5617
  * [MiceMazeRace](https://www.reddit.com/r/MiceMazeRace/comments/1nksd3e/first_map/) by u/monomanj
  * [Space Tournament](https://www.reddit.com/r/spacetournament_dev/comments/1nisl67/space_tournament/) by u/space_tournament
  * [BlockJam – A Community-Powered Puzzle](https://www.reddit.com/r/BlockJamGame/comments/1nl6ies/blockjam_make_or_break_out/) by u/philosphorous
  * [Snoo's Crown](https://www.reddit.com/r/snoo_crown/comments/1niyml7/snoos_crown/) by u/SecurityHappy6608
  * [Reddiverse](https://www.reddit.com/r/reddiversegame_dev/comments/1nki6r7/for_devpost/) by u/Global-Peace7695
  * [Out Floop](https://www.reddit.com/r/OutFloop/comments/1nhjchr/out_floop_1/) by u/AuriCreeda
  * [Training Data Microgames](https://www.reddit.com/r/trainingdatagame_dev/comments/1nglqby/trainingdatagame/) by u/tutoring_jobs
  * [Word Soro](https://www.reddit.com/r/WordSoro/comments/1ng63nj/word_soro/) by u/xhila
  * [Tankdit!](https://www.reddit.com/r/test_db21_dev/comments/1nl7d57/new_map/) by u/theoleecj_n
  * [Blokkit](https://www.reddit.com/r/blokk_it_dev/comments/1nan62b/blokkit/) by u/DoubleGlass
  * [Wordpaths](https://www.reddit.com/r/Wordpaths/comments/1nl2ewu/wordpaths/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) by u/Thoughtful_Sage
  * [Exquisite Deck](https://www.reddit.com/r/exquisitedeck_dev/) by u/Light_Sweaty, u/sojounsociety, Nikolay@dc1ab
  * [Wreflecto – A Daily Word Square Game](https://www.reddit.com/r/wreflecto/comments/1niliov/wreflecto_sep_16_2025_reddit_word_game/) by u/Vocabulist

### A Special Thanks​

Beyond the projects themselves, the spirit of collaboration and support in this hackathon was amazing. We had more exceptional helpers and feedback-givers than we could possibly award—thank you to everyone who pitched in.

**Helpers Awardees:**

  * u/Beach-Brews
  * u/paskatulas
  * u/luuez

**Feedback Awardees:**

  * u/Cultural_Exercise_43
  * u/Palpable-2-3-7
  * u/Formal-Tax2410
  * u/vignesh-aithal
  * u/Terrible-Topic8700

A huge congratulations to all the winning developers and honorable mentions.

Thank you for making this hackathon an inspiring showcase of creativity and community. We can’t wait to see what you’ll build next!

Did you know? Our hackathon is live right now—with over $49,000 in cash prizes up for grabs! Submit your entry by September 17, 2025 for a chance to win.

## What we’re looking for​

When judging, we go beyond “fun to play.” We also look for:

  * Delightful user experiences
  * Polished, thoughtful UI
  * That unique sense of “Reddity-ness”
  * How well the game might work in Reddit feeds

## Past winning apps​

To spark some inspiration, we’re shining a spotlight on winning apps from our [Games & Puzzles Hackathon](https://www.reddit.com/r/Devvit/comments/1hvz8s8/announcing_the_games_and_puzzles_hackathon_winners/) earlier this year. Use these standout projects to get your creative gears turning!

### 📝 Word game winners​

  * [Emoji Charades](https://devpost.com/software/emoji-charades) by _Hayden Woods_

  * [Popped Corn](https://redditgamesandpuzzles.devpost.com/submissions/595969-poppedcorn-the-blockbuster-movie-cryptic-anagram-word-game) by _Bitan Nath and Swati_

  * [Word Trail Game](https://devpost.com/software/word-trail-game) by _Mihajlo Nestorović_

### 🧩 Puzzle game winners​

  * [Pixel Together](https://devpost.com/software/pixel-together) by _Fan Fang, Mai Hou, and Allison C_

  * [N_0V1](https://devpost.com/software/n_0v1) by _Abdulla Sogay, Mujtaba Naik, and Ajaay P_

  * [Laddergram](https://devpost.com/software/laddergram) by _Jenny Ho_

### 🎲 Tabletop game winners​

  * [Daily Dungeon](https://devpost.com/software/daily-dungeon) by _Justin L_

  * [Fingerholers](https://devpost.com/software/fingerholers) by _Drew Anderson_

  * [Suspicious Skyscrapers](https://devpost.com/software/suspicious-skyscraper) by _Srivats Shankar_

### 🌟 User generated content award​

  * [575](https://devpost.com/software/575) by _Thomas Park_

### 📯 Honorable Mentions​

  * [Froggy Flight](https://worldslargesthackathon.devpost.com/submissions/701718-froggy-flight) by _u/Due_Analyst_5617_

  * [Grumpy Granny](https://worldslargesthackathon.devpost.com/submissions/712067-grumpy-granny/judging) by _u/SecurityHappy6608_

  * [Wibbit](https://worldslargesthackathon.devpost.com/submissions/738377-wibbit) by _u/rum1nas_

  * [Around the World with Snoo](https://worldslargesthackathon.devpost.com/submissions/700211-around-the-world-with-snoo/judging) by _u/tanmayok_

  * [Snoo Pet](https://worldslargesthackathon.devpost.com/submissions/740105-snoo-pet-your-early-2000s-nostalgia-game) by _u/Used_Gear8871_

## Start coding​

Check out the [Developer Platform docs](https://developers.reddit.com/docs/) or jump right in to the [App Quickstart](https://developers.reddit.com/docs/quickstart/) to bring your ideas to life. We’d love to see your project on our next winner’s list!

As part of our efforts to spotlight developer insights, we interviewed a Staff Engineer on the Developer Platform team, [Marcus Wood](https://www.linkedin.com/in/mwood23), about building cross-platform apps on Reddit’s Developer Platform. Marcus has been integral in developing games (like our April Fools day experience, [r/Field](https://www.reddit.com/r/Field/)) and tools for iOS, Android, and web.

Below are the key takeaways from our interview, where he shared his perspective on designing for Reddit’s unique environment—one that rewards mobile-first design and thrives on user-generated content.

Devvit apps work across Reddit platforms to ensure all users can enjoy developer creations, no matter how or where they access our communities. However, this can often pose issues for developers trying to deliver a performant and consistent experience.

# Why Mobile-First is Important

A majority of Reddit’s logged-in user base accesses the platform via mobile. For developers building cross-platform experiences, this should be an indicator and a north star for designing. Developers should prioritize touch-first UX, optimize for mobile performance, and design interactive elements — especially around “thumb zones” for games.

Marcus also offered a few go-to mobile UX tips that have seen success across the platform:

  * Larger tap targets (44x44px) in games/experiences
  * Placing key buttons near the bottom of the screen (thumb-friendly)
  * Use in-game overlays and tutorials to educate users ([Ducky Dash](https://www.reddit.com/r/RedditGames/) is a great example)

# Integrate with Reddit, but Don’t Spam

Reddit is a _surprised Pikachu meme_ opinionated ecosystem of communities and users. So Marcus cautioned against spammy tactics like flooding comment threads with things like auto-progress updates with games. Instead, he recommended meeting users “where they are”—for example, prompting subreddit subscriptions within the game or encouraging comments only after an “aha” moment like completing a game level.

# Build with UGC in Mind

User-generated content is a game changer for your game being discovered on Reddit. For instance, [Flappy Goose](https://www.reddit.com/r/RedditGames/)’s level builder and [Karma Crunch](https://www.reddit.com/r/KarmaCrunch/)’s avatar customizer are prime examples of apps that encouraged community creativity. “Apps that lead to more posts are the ones that win.”

Reddit’s feeds generally reward fresh and engaging content, regardless of platform, and your app can help generate that. Additionally, Reddit’s biggest advantage is community. It's full of creative, engaged users who will run with whatever building blocks you give them.

“Build tools, not just toys,” Marcus advised. “The most magical moments happen when users do the unexpected.”

# Testing and Performance

Performance on Reddit isn't about smooth animations—it's about efficiency at scale. Apps like our April Fool's r/[Field](https://www.reddit.com/r/Field/) optimized bandwidth through bit-packing rather than device rendering. Knowing that he recommends:

  * Batching requests to reduce load
  * Using Redis for real-time features over constant polling
  * Minimizing unnecessary network chatter

Make sure you’re doing your best to monitor and test performance across as many devices as possible. If you don’t have access to testing your app on some platforms, we recommend requesting platform-specific feedback as part of [Feedback Friday](https://www.reddit.com/r/Devvit/comments/1lwfsuo/introducing_feedback_friday_on_rdevvit/).

Some important things to be mindful of when testing:

  * Platform and device light mode/dark mode settings
  * Responsiveness on mobile devices
  * Text and component sizes based on device and accessibility settings
  * Also (shameless plug) to use our new [UI simulator](https://developers.reddit.com/docs/ui_simulator)

# Final Advice for Aspiring Reddit Game Devs

For developers looking to get started:

  * Build apps with the mobile experience in mind
  * Focus on apps that drive new content (user generated content is a great way to achieve this)
  * Use popular frameworks
  * Avoid overly complex or unorthodox implementations
  * Join the [r/devvit](https://www.reddit.com/r/Devvit/) community and share feedback

![Cabbage Systems](data:image/webp;base64,UklGRiYTAABXRUJQVlA4TBkTAAAvbsEYEP8HJIT/59WICUjcwxv2/4uexv/3iuDuWgiaBIq7e2FLKMUJVmfRbnGoUNwpTqmlXiy47uKUUoK7JLgVd4iRPG683/OeuWaupXzkRkT/J0D+P8789d4ZMeOrb+dP+ahzpSyuy1K564CpC6K+mfXpew0K+YvC7T79JuqrofV8lz6sdFhR59KHlQ4r8kJSPKL3gh1Xn6E+OLt+yrtN87koT9P3pq4//wA18frv3/ZtHeoHyr4bdSoBeLLAd8Wjl0bPcK5U9JLoaS8ebWbvwcGk9eNru6L6uHWJOLh/XmdvdV6L9S7f1QOeO9cISHjBqDT7NM7v+CS/j3J/vB3nz86u5ZmKqzFd77uqwGnnagLHXygiduLjxCXhPghf8gwf/9HWG30xTIFtfyua7saNS8IdCvsVNx5o5YEJaC/91LlS8fyFXi39N6L4Otw6Lb0DQRNw65Ywt01Cvdpb3PviNAIXX2llq/lZXDzKXd1R5wbJ345XtuLuL2xMw93bSrooL+oIcfULUotHuP1QAYOcf+L2xDbu2aoMl78f/8KDN2voApvcwIMj3FIOYJP8/ZiENyM0aZ/jybku2aFk9UH2aj36vdskv3MZXu3Uu+cbRZ1KE9a+V682JQOdydv4nX7da+ZyKnv1Hv3faZjXsVdaftC3a/ksPpqBV9sr0sMbfO2KIgDzxfHInU9Qn58amk+k8enTZ34xa7LoDtpLc8s7UOfXG2ivfVnLVu6Bh5NQ43e9KyIfnzl95j2TjtufoCYd7p1Z5JMzp8/0Naky5wrahxtb+2IO3n1NkZ3e4Cs3DFCKOlX/CKaPI6URcMrqnKT5DeMJQUaxEjgf4/lpzXo8xPRoOYkCxlhV2I3p9RayAJhmlWkBxntedexzvFxQyecRJrhgNxArDg/Gbu+wFNhptfGVU9g8VsBkZc6j2DxT1uRn7NZ6Hxhi0R27TXsCIy2qXsJuN4fa4ukYRZZ7hEjf/QV86lBvtCe+nDDxh4sKhxKN4m6hbps9dtrS+wpXshocPoX65+xxUxbeUngcYhWNdtvssVOX3leSDpi0Q3slasLEH68pnDSphPbGL5PHzdmnob0j4Xi8vVLbK4T5qkAqUNeZVqgLa4i23n/QG2jHlxI1S/vzADEG2inlRE33xhmAaxZjUceXFjVLx7PodaGou5sEiIgENjuAXpflqbKvWRpRX52hEO7ERa/FKkFXvHIjrY8aApR2JHO88o4YDnTibk2xTrsQYJRRfGOxDpgLMENTA+BGVbEO/tnsqDJZDCeYrQKYLoavxwPHHfgGzzcQEZnpFZb6KBJILezIeICOYvyRAyFivAkgr0l1Mf4ZIKdyHEjNL8ZrTVoDzBbj6SYVAcaIcbnHQAdbtfD+UqWPZ3jNN+8DifmcyBwPTBWbm2z1EPOMN4DRBv3F5jXgRxGpCtBczIOuGOwADorNkwY7gf1icxiwL6ON4Gt+4IRS2zv3g3zyLpCc34nWwAOxmy/exkWx2we4FGQRJ3a7AUki8iuwXey2twoBqGmniVUJgIpm1RecAxhkYzR+MCGniGR95hlG+qQtQIgTvwJf25I1Nt6xleE+UNliuK0MT4B6ImeBFraCr1u8DZwQ23cs3gbOiunr0ejnmGXGL9YREYn1DgV9UVkp60QcUM9ef7PUPLbkP0B7i0a25HtgouRKBnLZku8shgFz7M23+A0YZhXc/zT66GpZzKb7hzeUAx761heZngGtHUhzEyhkr7zZzWB73wBDdU8z2+sJ/CwNgNNif4zFTOAze29ZHARq6sKn/oX22uSSYjNtsn9o7TWy+0AuAN85kO0xPMthL2+KRTUgVux/BszWnRL7kcBS6QiscaCPxY9AX3uvW5wCSil1F6M/MjBYbA/GP9ZRYr00xhfRwBMHcjyFR9ns5Um2qAiccmAoMF+kKnDEgU7AMukCLHPgPYuvgMH22lucBrJImg/+QL+8tTgZ5x8Sc4pI1mdeeuCLNwGa2ct4D5Lz2iuCRSngogPTgAkiZYDrDnQHFkoEsNOBoRajgSn2PrE4ASkte19GGz+/qjjaGv94XESkNp5u4YOMyh57cgUoZa+lVf7n8CyjvWjgXZGsCUCovc+ABRIOPEpnb7pFH2CNvf0WWyEF/aX++cThRX4iWuntre0+kMkAzeztBvram2mV5h5Q1d5JoKmI7AO62zsKvC0Bt4FwezssagOJeewUwGIUljs7BIvT6e/7iSbKDG8lBfkgs3I/0NZw4JC9WCvZDiy2VRVIyS0iXwPRtsoA5BT5ExhtKwQLuQDMsPO1VT3N8+jK4sOW+MezIiKBl71FJx/ICIDttkIBatjpicHbAPntrAOiRUTaAoTYWQwcE5F+wBNbPxuMAqhvVg2rjM+AP9KIebbmNj7zE5FKDTz+vS/kLMDv2WzIASDWRrZnJjmSge02ugA0VuQOsMdGA4CWIpIRINpGBAaZlPgyJiUfGcgQ4FJGG6sYaxbjHw6Juthru31SROFapI26AL8bZTqJiYwGmG1UH2CvaN8HWGj0ajxwVNSJAOOMqj83kT4AyT2t+sVjkuYxcDPcaB5wvoxBDvxjESU3Xk/O4wupo8DarmlMZCVATBWrZrGYpY0DWFjYqhdqcZ0cB1gTYvVuPEAZTdpLAD8VtHoPvU6Woe79vEXp0NdH7cFSI20BnkRalVgLkFzUoLx/aCXqFs/R2idS5akCN7Z/N6hX3ymDlaCTqBu7FQ8KCvvnTtTnBlJYIf7niPxBGauMPYbaSizzJQAkL21TKChd+WGHUPuLvrjCs58j8gdlrDL6GHZkjWIcNclA5qPGDC6bJqhIh6WpACmFxbCNX+gkaku838c3UniLxvKQIrniFODWLbRHByaaSJ1EtM9vPUDfWwzLPUCbeusu+pFi3VgBkm89QPvDF0Yyy8Yi6Q+M0sl3CnD7Fvo7r4rpaD/wV11R0z31AyN9JPLuVZPVGsmwSWd5PKAQsMtKih3VWN+KEOMCezTWj9qKacVzGutFMgAYaiXVdhqciBSZDXxqIYN01rvyivFi781OL9rd+MHvfSaBH6xMsjikE+kSY/DXaJFI4KyByODTBrcnZRS7PQ8Z3J2XW2x+fsXgUA+RRcB4A5HQT3/+99bNi6Y1FBH5FXjHSsp8n2wQ80+x+afH4kaWFv0G/OEO34lI/jf7jfthyXejI6xEmgyKPnYtdsukTulEpEDHDp0aGon8Y8Tq49dObxrXIZM42XxQ9NFrsVunRGYV+0Ftx2yKvXZ05bDmIiIVOnfoHGpk8wpQ20Ck0Duzdl64cmDRoCZiO847P3469O36Yv1v/OIJV3g1QHwaIJ4vCpDPyJe3vJJUU4yLHcfpJ9vHvVW/ZvMYt1wO8F/+fipwRFz6wCvfiPGQJJx9+EPdbKKPc8mtdC9M/d4zyw/QwS0PvTLNIODNUzi8IIcY/sslt9O/KE2AeiaBx4CH4tY7XrlVUBPUdNR5HD5YSYy/c8nVwBejzHEAA6waHAFo55oLXuHGJx8Nn7TkOo6vEfPmuPSMvBin+VHh+KcRxYpW7fk96jJx7X7P+HquWJYd/MOajb/j1t0+qvvN9tOX42KWD8r6305kimK+Wdy7yj/9ItrAD//A3Yt8Unsz1vfm5P5vJ70e2JglLp7ul2JEW+8Cbp/gi6GYP6zrvoDAgAB/IjnmPTD4o464ubs/uptOMwD3/8sHI7DdzG3Z465fv17an4hkaf5F9MbNa38cVFzcXc0f1RX1EzwY6Vx51H2jGpWo0S9awxsuyw1Q3r94tqAfihK1C14s6dxlZYDoy/6hdHJZzsdAmRcCOed3HqVTiuPFk+J4I4ApYriDpBrywjbd77QX9YwnFjn3K/BUjDc1kxe3Lv5mu6iT8OSHzp0CvjTz4ItEwRQ/U0wphjdzOncR6OKxHEr4i4Fs8i9Rou7yxnFx/hLQ1XXFKhQykodAWns5Qsvldyp9WFgGo/zlizlRqEJIgCd6+ZWkTMqbePMDH8QBUbYCJ8+dM+81Ox3nzZk7UekYfRk4tailkvmLubO/SQJ+nTVnXleDyB/3J0BK7IqP0hm8MW/OvNYivdbdhXsbhumKfnkwFa4s62JW7ccTwNXVvT2Q5rY/+UzUx95IFB9uApIz2JH9QHJGGwALRTKtwDo6u0gBjP9j0XEfhteHWX0PDJHVWB4qKyK9E7Bcl9tgPNZ7K7tOZvuRy6KOwptRvngbYL2tEgCRZpFKTsl4DtPrlSVPgtH3uhXYPJhfNxH4cB6GyaVlKKa38lsswfjtILcV8SMtlBzJHinpi8ypAMsL25DdwCGzA8B0kY2oJ/bEKayXPBivV9IeQHvxQEyshpsFDNTHBw/cVfi9BcCTg/tvK5zS9UU9v+e4hhxuk9V+Y5eoUXhzi/i0m0LiyLJmVQHKmlQEeEWqAeypIiJNdkBcIUnf5Z3uveOB4d2696ytbAdIiqojIlJ01GWAM0YJQ7KLZPzoKfrUT3KIZOhzD6CnkiEZuB0pIqG/wPMm4vrifqO4UgSPlveNfKsA20eUM5ATwC8mPwCrRWYB50S/8mZ20T8E0oh+EsCOYmKZdgbAXIMHYaItfl2TWkG0Ba4DF5XmwJPCoh3ysLZ4MNpPTBZ1h0cWiq/n6YBlXaw6A4mZrV5JAeqKHAE6Wkh20ed8DJTRlQTYLcafA5S3ekss62i6i2UVgMIiMhr4TSwLixdzpPqFy6K2w5up2X0mERcsYG8tXcBdYLDVWOCUiJwDwq2szX4CrgabyTfAUovrYngS+EsMjwH/FJEvgdFWHu3pF2oqAXc9MlBcGPz2bgsYrpGRQKxFmjtANxE5AozwSb4k4E0xb7QBoKDua5PfgE0mY4HpIjIG2Oox2eMHpok6C2+eEJeGTLqg43NN3hSgg64dkCAi8i2QEuaLNkCsmGZ4/zTaHrrPTMYAC0z6Al+KSGuADh4r6L0Toobh0RJuEZFmKzU0VmQxsEt3GBigNANIGhbu3ERgnkG5UbfRXp5Z1IHhwAw7X4tILoUFdTwl3bz2vKDmhEcixdWt/1KuBCjhAKFKWSA1QAk4izbms4hMzmwF2lnUj0J/eHiwiG6kyQhgtkk/4CsRkRkKnJgRWdA7Ms1jDUWdjzfnictzXQXoqcgmYL7yKzBTtCGPNMCt6emdOAuU1vTajn5ZG9Hb+tixwIMa4PlPZTwjaz01SNQmeHOruL6aEq1pAKQEi+R8BoTopOQ+C7hc34FrQF6RXKNOok2aWU+sXSPpf7EA3vaMxHhomqhZEr1xTDy4DYjVyAWgl8gUYIMYttlpAWH2zkNqjkI/P0V7fUh+MXWPSN1lSRb09EyaHZ6ZLGrgMTx5MJ0XpgDJuTRvA3dEbgD1TUReeTPqlOZYgK1dkHI8Ge3ujmnE3E0ieerP3K/hFa+I7PbIVFEDduPJI8HixeEAJTVpngJZywK7xX6rmwD1bc3EMnV5dbHtLrXsLuVT78hKTwwQ/UhPrBFvfg48z6WRCcCaFUBrByTfbeBjW510V8YVEQfdJ3IC2OMh+cR9iS3EuuFD930urk1v42vgpOjzpaC9Jo7OBH5TcilhmgLKljfSiKNeeA14mMZD0uqhy2JKimnhbS573ElcO+tqQbNLwCILWaD7yJkPgSVKtgdAuEZWABvE5tgzDTyTD3iczkuSd52rRondwa5an1fcWmQTnM9gMgygh1WoLtikfyarucBkJegO0FxXAWC1WUdgam5XDWlqFQGcEY93Pe+aXTXEftnNrrn4jrh3OcDFulYdAc6J4WpljhguYkuwLv9doKMifwInc2rkG4BVuQ2GopZy01CehVrEAgu8JgETnrjizPvibNfjroifHiQuDktEnVMvm0jGOl+iNjRppRSzKrgViGuVXiQw4hqQkkfTG+DO6Hfqi4gcBbj/YRklf/vDqP8Q92SaByS/m1dEqu0AaOg5kXxjb/vsYB9x/v0Yn90dV1jcXTFegUeHDt5FO1JMZwC/iXUo2lurl11BHSTaTLfQblSynUd7cuXi/cloe4iLctxBTdi68DDq7+IXsw6M8Ul0F/Ftx4XPffHnkBzi+tBjGsMvxDRvPFDeQKo/Uqw3iGW5VE2UIrl2aQwTu4mbJMNexfpcHv8gIpUHHnDm+fq3QsT3hTqvSnTm0JAq4s1RRuf/IcYjgT/FuNBakzliGL5f2aAR6f3Y6NfCov8OmG3yBbDEZCSwWtQZJluyij8N/ce4bWfvpVok3Ty5alCTAuLWvA0HLD9xI8ki5e7ZbeNfDxPvhny4967y17+7BIlx1vtAGzOR5iuuAqmXF9YR8/rDvl7ex0Jyf7DtpvLw5MRqYh25fPHydiZtli9e/o5Ji2WLl3+gkQrzziYAdze1ET+cMX/5xhGtX68fmjuNuD84d8m6zVu1bFQ+XwbxfoYi1aoUChK7A4AbYj+gYJXKBcTnaQpWqh6SRTybq1yNkAzy9/s6MNiBl9dtANK+RDsGzJCX59UAsr1EWw8slZfnZQAqvURbCuyXl+e1ANq/RGu6OCpqfpqXaP+/LwA=)| ![Reddit Logo](/docs/assets/images/reddit_logo-ee1722366f3520dad1a3ae19024fb82d.png)  
---|---  
  
Tokyo-based game studio [Cabbage Systems (キャベツ・システムズ合同会社)](https://www.cabbagesystems.com/) is no stranger to experimentation. Originally formed from a desire to build games in new places online — Reddit turned out to be a perfect fit. We caught up with their team to hear how they approached building their latest game on Reddit, how they leaned into the platform's unique culture, and what they learned along the way.

## A Gourmet Frog, Reddit-Style​

Cabbage began experimenting with Reddit games during a small prototype project, [r/DarkDungeonGame](https://www.reddit.com/r/DarkDungeonGame), and saw potential for something bigger.

> "We knew we wanted to go a lot bigger this time—something with the potential to sustain itself through monetization but that would also really work with the grain of how Redditors use Reddit."

After researching what types of games resonated with Reddit’s communities, they landed on an idle RPG format, with bite-sized gameplay loops that users could engage with throughout their feed.

That’s when the team asked a game-changing question: “Why are characters in these games always walking to the right? Where are they going?”

Their answer: Dinner of course!

Enter: a sword-fighting gourmet frog, battling through monsters on a mission for his next meal → [r/SwordAndSupperGame](https://www.reddit.com/r/SwordAndSupperGame/).

![r/SwordAndSupper](/docs/assets/images/sword_and_supper-3c0ef0463a8238ba64ebe5e47b7f036c.gif)

# Building on Reddit with Devvit

Cabbage leaned fully into Reddit’s developer platform and the new webview-powered interactive posts. Their tech stack includes React for UI and Phaser for the game viewport, all built on top of [Devvit](https://developers.reddit.com/docs/devvit_web/devvit_web_overview).

> "We were very happy with the way these pieces fit together."

They also invested early in developer infrastructure, setting up a smooth continuous integration pipeline with GitHub and a private subreddit for QA testing. This attention to tooling paid off — and now the Cabbage team ships with confidence.

# Designing with the grain of Reddit

Cabbage wasn’t just building a game on Reddit — they built a game for Reddit.

Their design centers on interactive posts: each mission in the game is its own post, created by a user and discoverable anywhere across the platform. In the Sword and Supper game your character persists across missions, gaining XP, loot, and abilities.

> "We believed intuitively that our game should live everywhere throughout a user's feed."

User-generated content is opt-in but highly encouraged, especially for discovery and growth of the community on Reddit. Mission creators can write short story intros and taunts for their enemies — with results ranging from witty burns to a full copy-paste of the Bee Movie script.

# Growing a Community

Cabbage’s launch strategy was as much about building a player community as it was about shipping the game.

They started with a small closed beta subreddit of a few hundred players who understood the game was in active development. Once ready, those beta testers seeded the early access subreddit, helping onboard waves of new users organically.

> "Once post discovery turned on, new users started streaming in and found an already active community."

This phased approach paid off. As the game scaled, so did its player base and content ecosystem. Cabbage was also active in their community – posting updates and interacting with the redditors who loved their game.

# Monetization, the Reddit Way

Cabbage integrated Reddit’s Payments API shortly after Early Access for it began. But rather than push aggressive monetization, they took a community-first approach.

Players can buy premium maps that create special missions — but everyone can play them.

> "Generosity is a deep part of the Reddit ethos… and we took that into mind with Sword and Supper. With payments it's been a real win-win for us, the community, and players."

They were pleased to find the API integration itself was smooth, and players appreciated the ability to give back in a way that benefited the whole community.

# Advice for Other Developers / Studios

To studios considering Reddit as a platform, Cabbage says:

> "It's the perfect time to experiment with new ways to get your stuff in front of players."

With traditional funding and distribution models in flux, Reddit offers a new way to launch games and build community-driven momentum from day one.

As for what they’re hoping for next?

> "The biggest thing we're excited for is for more Redditors to know that games, including ours, are on Reddit and to give them a try!"

# The TL;DR for Cabbage Systems Success:

  * Game Concept: An idle RPG featuring a sword-fighting frog chef, designed to feel native to Reddit posts and feed.
  * User Generated Content: Lean into the creativity of redditors to spread your content and games with UGC as a core aspect.
  * Tech Stack: React, Phaser, and Devvit + Reddit’s webviews and Payments API.
  * Launch Strategy: Closed beta > Early Access subreddit > full discovery rollout.
  * Monetization: Community-beneficial premium content through Reddit Payments API.
  * Reddit Fit: Deep integration with Reddit’s UX, culture, and community interaction.

What happens when you combine [Reddit's developer platform](https://developers.reddit.com/), a massive online hackathon, and a challenge to build the weirdest thing possible? You get [Skyboard](https://www.reddit.com/r/Skyboard/) — a pixel-based MMO city-builder that lives entirely _on Reddit_. And it just took home the win in the _Silly Sh!t Challenge_ at the [World's Largest Hackathon](https://hackathon.bolt.fun/) presented by [Bolt](https://bolt.new/).

Runner up winners to the Silly Sh!t Challenge include:

  * r/[FroggyFlight](https://www.reddit.com/r/froggyflight/) – this is what happens when you combine planes and launching frogs
  * r/[GrumpyGranny](https://www.reddit.com/r/GrumpyGranny/) – crack the passcode to grumpy granny's computer before she screams
  * r/[WibbitGame](https://www.reddit.com/r/WibbitGame/comments/1lo9h2a/wibbit_game/) \- make pixel art using tetrominoes
  * r/[RunningWithSnoo](https://www.reddit.com/r/RunningWithSnoo/) \- journey around the world in your Reddit avatar with help from the community
  * r/[bolt_gigapet](https://www.reddit.com/r/bolt_gigapet/) \- turns out tamagotchi and Reddit is a great combination

# More On Skyboard

Skyboard is a collaborative, city-builder game powered by Reddit’s developer platform and built using Bolt. This app transforms the r/Skyboard subreddit into a living, breathing digital landscape — where Redditors drop tiles, construct buildings, and shape the world together.

The result? A minimalist, endlessly scrolling MMO where your subreddit is the game world. There’s no download, no launcher — just your browser and your imagination.

Play it today: [r/Skyboard](https://www.reddit.com/r/Skyboard/)

![r/skyboard](/docs/assets/images/skyboard-7e80371ecc0fadf9a12fa8fa4047cf0b.png)

# The Silly Sh!t Challenge

The _Silly Sh!t Challenge_ within the hackathon asked developers to embrace the weird and wonderful:

  * _Build the silliest, strangest, most delightfully useless thing possible using Reddit x Bolt._

Skyboard nailed it by taking something familiar — the city-builder genre — and reimagining it in a Reddit way. It's a game built entirely out of community, creativity, and a bit of chaos.

# More on the Hackathon

The [_World's Largest Hackathon_](https://worldslargesthackathon.devpost.com/), presented by Bolt, brought together thousands of developers to _build with AI and Bolt_ for a shot at $1M+ in prizes. From tools to games to complete absurdities, the event celebrated boundary-pushing builds. Additionally, Reddit runs a ton of hackathons throughout the year with cash prizes and if you're interested in keeping up with the latest you should join our developer community on r/[devvit](https://www.reddit.com/r/Devvit/).

# Build Today

Reddit's Developer Platform + Bolt makes it easy to bring games, tools, and weird experiments to life — all within Reddit where online communities thrive. So whether you want to build the next big tower defense game or just something fun for your community, now's the time.

Check out [developers.reddit.com](https://developers.reddit.com/) to get started.

In November 2023, I launched the first version of [Pixelary](https://www.reddit.com/r/Pixelary/), a simple drawing and guessing game built using [Reddit’s developer platform](https://developers.reddit.com/).

As a designer, I’m particularly interested in how the developer platform can foster new experiences for Reddit’s users. The platform enables the creation of everything from interactive games in post units to sophisticated moderation tools, allowing communities to personalize their spaces through code—and turning code itself into content.

What began as a hackathon project has evolved into a thriving game, attracting more than 65,000 subscribers. The insights gained from building Pixelary extend beyond game design, offering valuable lessons for creating engaging, scalable experiences in any context.

![Guess what the drawing is on r/pixelary.](/docs/assets/images/pixelary-d256f627cc6642daf0936e2141441b3f.png)

Guess what the drawing is on r/[pixelary](https://www.reddit.com/r/Pixelary/).

# Create a content flywheel

Posts on Reddit fade away from the feed after a few days. If a game’s lifespan is longer, it needs to continuously produce content to maintain engagement.

In Pixelary, every interaction creates new content: drawing produces new posts and guessing generates comments, which boosts visibility across Reddit. This “content flywheel” ensures that Pixelary remains visible and engaging—more content means more interaction, and more interaction leads to more content.

# Create a distinctive first screen

In a feed, user attention is fleeting. If your post looks the same every time, it risks being ignored as a repost.

For Pixelary, I focused on showcasing the drawings. The first screen changes with every post, which offers users a new visual to engage with and prevents the sense of repetition. The more unique and intriguing the first screen, the more likely it is that users will stop scrolling and start playing.

# Make calls to action clear and focused

A game is only as good as its ability to get users to take an action. In Pixelary, I narrowed the focus to just a few key actions: submitting drawings and commenting. This simplicity helps reduce decision fatigue and encourages players to engage with the game on a deeper level. The game was designed to direct attention toward the most valuable interactions—those that contributed to the game’s ongoing content creation and distribution.

# Build for N players

Pixelary is an asynchronous game. Players don’t need to be online at the same time to enjoy it.

This flexibility allows for a scalable experience. As the user base grows, we don’t want the game to be limited by the number of people playing at any given moment.

Asynchronous mechanics reduce the commitment threshold—players can hop in, contribute a guess, and leave. The increased volume of guesses and drawings only improves the overall game experience, as it increases the variety and quality of posts.

This approach also means that players don’t need to dedicate large chunks of time to enjoy the game, making it easier for the user base to expand.

# Moderation through accountability

In any community, moderation is key to maintaining a healthy, engaging experience. By pairing usernames with their actions—whether drawing or commenting—Pixelary encourages accountability and helps reduce trolling, creating a safer space for users to interact.

# Scaling with Devvit

As Pixelary grew, I quickly realized that the way data was stored couldn’t keep up with the increased traffic. Initially, I stored all post data in a single object, but this approach became too slow. To fix it, I broke the data into smaller, more efficient pieces, optimizing how we queried the system. This change allowed Pixelary to scale and handle the growing user base more effectively.

Another challenge was the performance of Reddit’s legacy APIs. Some calls were slow, especially for international users, which led to slow load times and increased unsubscribe rates. Caching responses helped speed up the system, but it was a constant balancing act between performance and user experience.

# Working within constraints

Reddit's design system (RPL) presented challenges and opportunities. For example, RPL didn’t support a custom typeface, so I built a tool to convert text strings into a [pixel font](https://developers.reddit.com/play#pen/N4IgdghgtgpiBcIAKBLAHjANgAgGIHswAXEAGhAGcAnAYwRBSgAd8qjtgARGANx5SIBfbADMq+KNgDkAAQAmvfkQD0TAK4AjTChoBaCExRSAOmFPLl2AOKYAnkwAWFbBCoxsCkSjAw52DVj4AO6mRPbuAMpqTCxsvjb2TtgAvNgA1jC2+CLYYUww2dZ2jhQA3Kah4UWJKRym2NhMEEQO8NgURFTeAOblYA1BKHItbWBqUAFUfQ0OMCjdDkSj45N9gn2m3kQwVCIQNO6oGJgAKjBoREjiTM7A9dg0DiiYcm5gbR1dYL33FCgAXjAAPzLCY7aYPfCYVgg9qdHprCo+NCxdgiNRgGhEFCEbBHLBnC4ACiY1wobXxp3OlzJAEo2gApCIADQAdABRTAwWDEOr9SFgDocB5PF5vUjtAHuVIAJglNChrFqUi0+zSUmwwlSpPwNwhCsF7G0Plqj2erxgYAA2gAGAC6rIoTG0RCJUiktP1hCF3QMtQAjF7DdhZvNFrUEiUrVIAIJSB2hhZECFc9iDYYOWo2lMwdhoADyIhEFFzWY2-INQsern22yo5LhX26VrttRb5YaxpgrJErHZ+wcRKJ1aotZ2tJSAD4+Q0GigcsOHDWsTsUslUhqPTPZw0C0WS+wANSpABs2EP2F9TAhO7cRDUVDAN81SJ3lfY3WKrWqjgjX4oVojmOVAuM4UQxKw2xyJGTh2s+87YESACEn6JBOdz8reuYPk+9wNIIeEisudYUKy6gUIOAAGAA8TQtIRDRyMkxggAAJMAqGOGRzQOARIAMbko6Cr2VBQMxICdBAgqYM0MBEuxe7Frmwg2rSLECV4mCYLoVBqFy4m8Ja+ByHI6mYbONDaEwOl6TABk8EZJlmTuyiTpRnqvrOikHueqScQ4rLpi056XgYz5BZmqTebmEKCB5Zj8hY2AAErcvgDm5LMgkQM8PShUw9wRdguh+WFnnvu0NAQFycgABJzEmbTcHwAisgAQtCNBpKRERShE8LfLUlHsYm4YAFSSoCghMGglFBkKFBVTVADqQwjNgzVKO1nXdayvWAv1TZDexRUTX8U0zXNnl3jhiGEdRjAQN0MACY9z31WGRDJMAo1CK9UBPTAq0Zt9EUEeZMwNYs32LdVvgfUm4M7gMa0ODDS2+MDLRI8jCiLV0TDYoQ31mmKlq2naONYedMAALLGXZLGaZgznIw+mDfZRcjNBA8BvTAygUDw3SHmgUCYKUI4HskACqJy4LoAAcpACQ01FC90qvIxF4knajfFazuv26z9UN-fxEPIw0-AwEEbX4Gg4k2tgzt6xmwgjWbBuW1bzMmwq0JUN7VtW2LmCCuJixEEw8AWEE8eBQAzKyrDdMoMo2pngvC6zVuTlr7FASu9asgAVvg3huh6VPI9R2fdPnluUTXrn3PF4OmJtrUQCZADCagdBISD4B0JzhESGENJAsBtFIABy0AwFIKv8m8ChUG0AD6BrbBcU7bg0N2PndlvUTwHRqiGZvif6mcAKQsdgOssbfNoPyALjaN0YA8l9LEaPgIgRAJCPyaCZHo4kZJUGeo-DQapujiAxHIXuioqDiQAMQygACzYOwY-K84kKAAy0ixRuIdsDUScEQS+BCWJEOqizEAZDyEUMpISdgNNvoAFZhAB1YOJIITxtikPqlpfAdc2HUmYVbOuVC1TSNrnIrq+VCHEMYQomRki96cOADwyEgcBFCJekw5arAXgSPQASKRhtWGWKpNoqU3DeGoIwUWLBXDM6kM3hY447CNGzlkRfLq-i67n2ocEwial+TgzikiCqMFnCpEntgFiNoWJtGSQ0FidEHDpJSSAWmXCXa1X9AANX9LVG0pSuElNKSeWqXDqm1RPOUhppSbQAC1aZYOwBUmUpTE61UTqUrBtV+k1KwQMoZpSZS1Umf6DpLEV47hYhFPJJ5lmzhYr9PJAB2e4ghNkvzyZk-JOS8ksW6cU-pFSymzPGZUupzSmmTM6UswiqzUbrM2VkkAOyEDYH2dEo5IAZQnI+SAc5ALLn+mKY0ipLTZmNMGZM0ZwyaktPqVUmpZTRn9MGcM2Z8yxkzMebc9piyyAQrWQCjZEL-ltCBfhEFidwXmWyTxC5BTnY2meRUxpRKpmNNGS0mpjT6llJqVUvFLyRnTMGf02ZwyKlVLeVS9lIAaVtDpRqhlgKDkgqwWylZkLOXQoKUU3lyqSWzLKYM7F0z6mNIxXKxpnTaYymwMMtFUyZSUp+fkrV2AdUmr1UyzUIKuHGq2aa+i5raZnl5VUlFTT+mjIdWUp1TSWmDIFSShFFL3kaqDSGmNYaDX3BYieaNvyoVtBhXC1piq2mDNFW0iVTSqnkvdZ6iZvrqn+upV82lAbtlmz2RW-kLF9kAtORyuN9buXFMRS2uZcrhkdplQS0lxLVWDuLcO7Vo6-njoBeGw5laQCKxrWcs1i7CnFLKSq0ldrHk4qec655ubSUtP5RSq5yKSUTK6T0+5rTJl+qLSaktx7y3AsvQAThvfO3J8bYW8vhc80Zn7Jkdpqd6tdgy7lktqT27Agq+kzP3dBw9wbYOnsZZO35MZkOxtQ-ez1vLiV5sxWump-SsUvqbf+z1aa133OozGmD9KGP6vg1OkAbVWN1vyQ+pNH7s1Cp-a0t1IGvVAcI100T4HSWQfVTRjM3yZOfQnfJ35vdlN3tU+htpBaKMGdRc8sVTzJUkbKWq490ndWyfPSCzgjmF2qZ6ep+pkzvMitJZh15emlXCfw3KiDknflBdDSFpj+T2QRfY6pxNjz6ltvxW0sDBaAtDssyO6zSZbPMsvbgIrXLaY8r5Ta1dAnHm1YPfVo9jXFjNYjZeqw7W0PLrS2un1rafOdtaf5rLgbaOlt+XBlrCnapTfvV15trznmxf7YJgbFnIsbfyVt8bCmACSe3VNdd-Xx47b7839dW58obdGRtEDGxehTDJHuXNK3Fkl6ammZraS687Un1v0Zs2e-LLEADSIOCmcbKxD6ZfbytNOFeJ1zzyuOtMJSSuH2WEd-YByCgAMhjj1xSqn4-44W8z8OftXbHUjxjdnVOM4O2TndOn2m1V2RplN82SVna+5q2juzEdNeR-zlic9BfXOF4K3lvHwcEb63uqDnPLtK9Gyr7bvz8yM8tbU5976s0ur-e6nplG+0LKN1Trnpv-vm9u78pAGuWc48Ay9t1lSjO9KmcSszgXqfBd53Ji3+SACK1vH2tIzU89Fa7WdtIS07vTrvpmjPmXLnLZa8uq5AMlQPTyxPZ9w151doexfO96SSlN7uOee5NzT33gPfkREZy5zDzaQ8E8W32ojpKu2kbL3H3LCfQuXpOIz0rs++vEpaZTtbXu+986TyxGWgePNi944b7vu-e-x+Vwfv3+TSmM6x9K2pbOTvxZJ3Nin8+9837N3fgffJZaE-SrcnSZb9XlCXB3L-bPA3dnWPH7RXffRPe-FiZkEAkXHXRLOVXXOVOA0ZYjC-BA6-RfW-FAwAliAATSf2ZyEwVSeXAKq0-wg2-w9yv2K25xPSXxRxAEpQyQhRU1B1oIqXJ0q1xWxwq3XSj2wJqx-xIIr24KrwgGH3bx40n0eQIOkNtXKQj3B08xjzq3kM20r0PxAA0BoJixhy-SYP6Tb3oKnzkI4O91p0vRoBUL-TA28zw0eW0K72IOKy4WcP7xBVMlnQEKcyENJ20PtShyeW3wjynyA0cKsz-x9wAJBWMX4I1UEIKVhQ8KwwM3FVfx8NtwjxTTA0TmSIa1SJcIUxEDT15RuVqVmWTVqXqWGW-VSwLzYO+0i0COQOXwU01jCOyIiNyPb140aV2Wx3B3EKqV8N0KJzTSqOGxqOCMvWKznTYw6yFyRSmVwPoNlx6Pl1-1IP-3IJBRQEZ0TnIzFyfWmRaKmV8yDz1yo2OKDSwSCPSMvVLmuNuIwy13bTXWmKD0JRWOwH6LWO+IUzSAwO3T2KlysNwPSxlSOMv16KcIGJ4MYSyJNRyM62KQbyeUz2fR3wxLyU+KxKrygA10o3cxXSgLz1e312JJ0PeIVy+IuMvTMBGLxLGIJPyNwLA0Ez8MMMxKhK5IU3wHcKYLbSKOeKEwWSZz7U8PBM4JuwoMhVpNKWmIeUJxXUwzIzExYIMMGyMOuxMNQJAAAEc1929CC5VfNJlpjf0I9jTTM1TOTBjfkqBaTZStCZcyVPSqTTCKAZSV1Kt9SJ9BM+1NCYiFj2TTiFCyDvT8k0iD5b1ItLlosPt5iDMN0m8WCXtktEzzSecUyeC1A-SHkt91Cu1gyJTUyWIeAaDn1NC39XsoyKl9C2T0STiyyuCKyq8QheSY18TnZKN4TCNicJcEt39HValIdRSzTiskDGyeC0BqyRc3NV1PNP1kTAzM8t1migzSzxSzj0ymyQBbAtyS9Wk5SGCdTsds85jez-CUiLzajfl-g-SDTpCfUXUYzFyO8HjTy+zy9jDFDTDN4Ncii20yT+zzzkzzirzdANcCMc1w8zyPzkLLyeDWQNdG8xMEKg05QQyrSVZRza1+SbjNDBNdSs8RlwTE4vSeCiQGiPsHT2zAycM8Dty2kSLaNITPz1iFM1IqLMzitLkbj1NyVUtuLQTZVsN+LhlBKfthLcKvz8kkILCNC68lsZU1LIsyL1yq9DxWzpyWk7z6liL+1lyLskLIKhzTCxoZTydMMJdZlMLFYcCmlGTP0CzfNbL6CEzwLaNlZyLNSgQOL7i8ymiWCOiIdHy2c7zOjutdNsLqiRLoSO5kRUQPAYA9g9J2Au4SByAHJ6wcQwAEB-RBAgA). It wasn’t a major change, but it helped reinforce Pixelary’s identity and gave it a unique feel.

Constraints—whether technical, design, or platform-based—force us to think more creatively and push the boundaries of what’s possible.

# What’s next?

Pixelary is far from finished. There’s still much to explore, including:

  * A smarter dictionary for more dynamic guessing.
  * Enhanced drawing tools, like drag-to-draw and a broader color palette.
  * A deeper progression system.
  * More community-driven events and experimental game modes.

These ideas are just the beginning, and I’m excited to keep improving the game. You can dive into the open-source code for Pixelary [here](https://github.com/reddit/devvit/tree/main/packages/apps/pixelary).

# Join us!

If you’re interested in building community games, I encourage you to explore Reddit’s [developer platform documentation](https://developers.reddit.com/docs/quickstart).

![image](/docs/assets/images/riddonkulous-2734b0dc0e193b90637d2f8ac1e9615e.png)

Reddit’s Developer Platform provides first-class API and development tools and access to a massive, engaged user base. The vibrant developer community is a mix of independent devs and pro gaming shops creating innovative, successful games that work in Reddit’s unique ecosystem. One of those games is [r/Riddonkulous](https://www.reddit.com/r/Riddonkulous)

![image](/docs/assets/images/logo-e945d6d39bba51e0217352e12ec030b7.svg)

We’ve been hard at work building and expanding Reddit’s Developer Platform, and it’s growing fast.

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/changelog.md

# changelog

Source: https://developers.reddit.com/docs/next/changelog

This is unreleased documentation for Reddit for Developers **Next** version.

For up-to-date documentation, see the **[latest version](/docs/changelog)** (0.12).

Version: Next

On this page

While we're always shipping fixes and improvements, our team bundles new features, breaking changes, and other user-facing updates into regular releases. This page logs the changes to each version of Devvit.

To use the latest version of Devvit:

  1. Run `npm install devvit@latest` to update your CLI.
  2. Run `npx devvit update app` to update your @devvit dependencies.

**Please note** : you may see features available across Devvit packages that are not documented or noted in our changelog. These are experimental features that are not stable and are subject to change, or removal, from the platform. Please use caution when testing or implementing experimental features.

## Devvit 0.12.11: App Review Update​

**Release Date: Feb 2, 2026**

In this release, we’re cleaning up the app review process (literally). The CLI now uploads a clean, unbundled source zip (respecting .gitignore) for app review. This will help our human reviewers see properly formatted TypeScript and clearer diffs.

## Devvit 0.12.10: Good Karma​

**Release Date: Jan 26, 2026**

We've updated getUserKarmaForCurrentSubreddit() to allow users to fetch their own subreddit karma, even if they're not moderators.

## Devvit 0.12.9: Gaming Templates and Error Handling​

**Release Date: Jan 20, 2026**

In this release, we introduced a **Game Engines** tab on [developers.reddit.com/new](http://developers.reddit.com/new) to help you get started faster with gaming-specific templates.

You’ll also see **improved error handling** in submitCustomPost() that correctly decodes and surfaces messages when the post data size limit is exceeded.

## Devvit 0.12.8: Simplified Playtest Logs​

**Release Date: Jan 12, 2026**

In our first release of the year, we present to you simplified playtest logs. The playtest command now produces cleaner, less verbose output by default. Detailed logs, including webview asset uploads, are now hidden behind the `--verbose flag` for easier reading.

## Devvit 0.12.7: The REAL End-of-Year Updates​

**Release Date: Dec 22, 2025**

It turns out that we couldn't end the year without a couple more upgrades:

  * Added an `authorFlair` field to `Post` and `Comment` objects in `@devvit/public-api` and `@devvit/reddit` (a community contribution from u/PitchforkAssistant).

  * Added `getUserKarmaFromCurrentSubreddit` to the public API, which returns a user's subreddit karma instead of their total Reddit karma.

And now that's a wrap!

## Devvit 0.12.6: End-of-the-Year Updates​

**Release Date: Dec 15, 2025**

In the last release of 2025, we’ve made a slew of minor updates (they're still cool, though!).

  * **Added explicit version flag:** You can now specify an exact version number (e.g., `--version 1.2.3`) when publishing.
  * **Deprecated`webViewModeListener`:** Now you can use the `"focus"` event on the inline view to reliably detect when control returns from the expanded view.
  * **Fixed inconsistent casing:** The `Subreddit` type was previously printed in all lowercase for `getCurrentSubreddit()`, but in all uppercase for `getSubredditInfoByName()` and `getSubredditInfoById()`. This inconsistency has now been resolved.
  * **Clarified non-functional fields:** The Payments plugin does not currently support filtering, so specifying `start` or `end` has no effect. This will be supported in a later release.
  * **Added new User fields:** The `User` object now includes `displayName` and `about` to streamline user data experience.
  * **Bug fixes**
    * Corrected post height for Devvit Web apps to prevent layout jumps on the initial web view render.
    * Fixed an issue with the `reddit.reorderWidgets` method.
    * Resolved an issue where fetching image widgets without a linked URL would throw an error.

note

**2025 is a wrap!** All of us on the Dev Platform team wish you and yours the absolute best holiday season, and we can’t wait to create with you in 2026!

## Devvit 0.12.5: Payments for Devvit Web​

**Release Date: Dec 1, 2025**

In this release, we’re excited to bring payment support to Devvit Web. If you’re looking to add payments to your app, check out our [updated docs](/docs/next/earn-money/payments/payments_overview).

Devvit Web has reached full feature parity with blocks, and we strongly recommend using Devvit Web for all new apps. If you want to convert your existing blocks apps (including mod apps) to Devvit Web, check out the [migration guide](/docs/next/guides/migrate/devvit-singleton).

To keep things clear (and friendlier to AI-assisted IDEs), we're moving all [blocks documentation](/docs/next/capabilities/blocks/overview) into its own dedicated section.

## Devvit 0.12.4: Ins and Outs​

**Release Date: Nov 24, 2025**

Devvit 0.12.4 is packed with payments (experimental) polish, and new tooling for monitoring WebView traffic

**Devvit Web Payments (experimental) bugfixes and improvements**

  * Fixed a bug with payments refunds hitting incorrect backend endpoint
  * Fixed a bug where duplicate “Get Payments Help” menu items were showing
  * The CLI’s `playtest` command watches your products file for live reloads, and `devvit products add` understands both legacy JSON files and the new config block so Devvit Web apps stay in sync.
  * Payments types are re-exported from `@devvit/payments/shared`to `@devvit/web/shared`, preventing mismatched product/order typings downstream.

**WebView analytics and APIs**

  * Improved accuracy of clicks measurement for App Directory Analytics
  * Bundle size improvements
  * Deprecated remaining splash screen APIs (`setSplash` and `SubmitCustomPostSplashOptions` fields)

## Devvit 0.12.3: Odds and Ends​

**Release Date: Nov 17, 2025**

This release focuses on Reddit data access and instrumenting WebView clients

**Reddit data & proto updates**

  * `@devvit/reddit` now exposes `getUserKarmaForSubreddit()` (later renamed to `getUserKarmaFromCurrentSubreddit()).
  * `ModAction` trigger payloads now carries a stable `id` field for downstream tooling.

**Web client & realtime instrumentation**

  * `@devvit/realtime` now publishes separate `client/` and `server/` entry points, preventing accidental server-only imports in browser bundles.
  * Bundle size improvements
  * Web clients now annotate the request `Context` with the user’s client name/version
  * Improved accuracy of clicks measurement for App Directory Analytics

**Payments status**

  * `@devvit/payments` now tagged as `experimental`

## Devvit 0.12.2: Inline Mode, Launch Screens,Expanded App Experiences, and Developer Logs​

**Release Date: Nov 10, 2025**

Release 0.12.2 delivers a major evolution in how interactive Devvit apps load, display, and engage users. With this update, you can now leverage inline web views, in addition to expanded mode, to build your interactive posts with Devvit Web. We’re also deprecating [Splash Screens](/docs/next/capabilities/server/launch_screen_and_entry_points/splash_migration) in favor of more customizable HTML inline launch screens.

**Inline Mode**

Your app's web view can now load directly inside the post unit—right in the feed or on the post details page. Users can start interacting immediately, with no extra taps or page loads.

Inline experiences blend smoothly into Reddit’s native post layout, which means that inline apps must meet performance standards and avoid conflicting with Reddit gestures for a native-quality experience. We encourage developers to read the guidance and rules around inline carefully before building with this feature.

Check out [r/HotAndCold](https://www.reddit.com/r/HotAndCold/) and [r/Honk](https://www.reddit.com/r/honk/) for examples, and learn how to add [inline mode](/docs/next/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points#view-modes) to your app.

note

Devvit apps using inline web views are currently seeing inflated metrics in their App Analytics Dashboard. We're working on improving these estimations.

**Improved Inline Launch Screens**

Splash screens are yesterday’s news. The improved inline launch screens are now fully customizable, HTML-based entry points for your interactive posts. This update gives you control over design, animation, and loading behavior and uses the same tools and styles as the rest of your app.

The new first screen automatically loads before your app’s main entry point. Read the docs to learn how to [upgrade your app](/docs/next/capabilities/server/launch_screen_and_entry_points/splash_migration) and [customize your launch screen](/docs/next/capabilities/server/launch_screen_and_entry_points/launch_screen_customization).

note

**Deprecation notice** : We're deprecating the splash parameter in submitCustomPost() and removing it in the next major version update. Learn how to [update your app](/docs/next/capabilities/server/launch_screen_and_entry_points/splash_migration).

**Multiple App Entry Points**

[Entry points](/docs/next/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points#multiple-entry-points) act as a router that organizes your app across different view modes. Each entry point specifies the initial HTML file for the specific context. A user might experience your app inline, when it’s embedded in a post, or launch it in expanded mode for a larger, full-screen mobile experience.

**Expanded Mode**

Expanded Mode lets users open your app or game in a full-screen experience, which is perfect for mobile devices. This feature works hand-in-hand with multiple entry points, letting users start small (interacting inline in the feed) and then expanding into a full experience.

Learn how to add [Expanded Mode](/docs/next/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points#view-modes) functionality to your app.

**Developer Logs**

We’ve also shipped our first installation-level developer permissions. Developer logs read permission lets mods share read-only logs and install history of an installation with you. This is useful for debugging issues with a particular installation without having to be added as a mod to the subreddit.

![Developer permissions](/docs/assets/images/developer_permissions-9ada848580c10394c46b3da12756132d.png)

We’re really excited about these updates and can’t wait to hear what you think!

## Devvit 0.12.1: Cache Helper, Analytics dashboard for developers, and smaller fixes​

**Release Date: October 10, 2025**

In this release, we’ve added back the cache helper for Devvit Web and also included an App Analytics tab for you to track your app’s engagement metrics.

**Cache Helper** The cache helper helps your app reduce the number of server side calls by caching the response for all users. This is great for any data that you plan to share across users, like a global leaderboard or consistent data from an external source like the score of a sports game. We now have this feature available in Devvit Web, and you can look up how to use it in the [cache helper docs](/docs/next/capabilities/server/cache-helper).

**App Analytics** There’s a new App Analytics tab in your app settings that lets you track your progress against Reddit Developer Funds.

![App Analytics](/docs/assets/images/app_analytics-487b825258ce2cbdef442ea46f2af23d.png)

**Other fixes** This release also includes a handful of other fixes including:

  * Added a method mergePostData() to append to postData.
  * Fixed reddit.setPostFlair() method.
  * Added a new triggers field that fixed the issue where triggers within the blocks entrypoint weren’t working. The migration guide has been updated.
  * Added error handling when trying to `devvit new`on an already existing app name.
  * Added disconnectRealtime() and isRealtimeConnected() as helper methods for the realtime plugin.

## Devvit 0.12.0: Devvit Web​

**Release Date: August 13, 2025**

We're excited to introduce [Devvit Web](/docs/next/capabilities/devvit-web/devvit_web_overview), a new way to build [games](/docs/next/quickstart) and [apps](/docs/next/quickstart/quickstart-mod-tool) on Reddit using standard web technologies you already know and love. This release brings the power of modern web development to the Reddit platform, letting you build with React, Three.js, Phaser, and other industry-standard frameworks while maintaining access to all the Devvit capabilities you rely on. Moving forward, this will be the preferred way of building interactive post apps.

**What's New**

Devvit Web transforms how you build Reddit apps:

  * **Standard web development** : Build apps just like you would for the web, using familiar frameworks and tools
  * **Server endpoints** : Define /api/ endpoints using Node.js frameworks like Express.js or Koa
  * **New configuration system** : devvit.json provides a clean, declarative way to configure your app
  * **Unified SDK** : @devvit/web package with clear client/server separation Better AI compatibility: Standard web technologies work seamlessly with AI coding tools

There's also a new [web-based creation flow](https://developers.reddit.com/new/) that makes creating new apps faster:

  * A step-by-step UI guides you through the initial steps to create an app
  * Automatically builds a playtest subreddit for testing
  * Gives you the code you need to access your new app via the terminal

**Key Features**

  * **Client/server architecture** : Clear separation between frontend (@devvit/web/client) and backend (@devvit/web/server)
  * **Full platform access** : Continued access to Redis, Reddit API, and Devvit's hosting services
  * **Flexible development** : Use Devvit Web alongside existing Blocks - choose the right tool for each feature

**Current Limitations**

  * Serverless endpoints only (no long-running connections or streaming)
  * Package restrictions (no fs or external native packages)
  * Single request/response model (no websockets)
  * Client-side fetch is limited to app domain (enforced via CSP)

**Getting Started**

  * **New apps** : Go to developers.reddit.com/new to start building new apps
  * **Existing apps** : Migration is optional - your current apps continue to work on 0.11, but we recommend using these migration guides to move your app over to Devvit Web. 
    * [Devvit Web Experimental to Devvit Web](/docs/next/guides/migrate/devvit-web-experimental)
    * [useWebView to Devvit Web](/docs/next/guides/migrate/inline-web-view)
    * [Blocks app to Devvit Web](/docs/next/guides/migrate/devvit-singleton)

**Support & Feedback**

We'd love to hear about your experience with Devvit Web! Join the conversation in #devvit-web on Discord to share feedback, report issues, and connect with other developers building with Devvit Web.

**Even More Features**

In addition to Devvit Web, release 0.12 also adds:

  * **Post data** \- [Post data](/docs/next/capabilities/server/post-data) allows you to add data to your post when you submit it so that you can retrieve and use in your app without an additional Redis call.
  * **Splash screen** \- Having a compelling first screen of your app is one of the most important indicators of good post engagement. Every submitPost will come with a default per-post [splash screen](/docs/next/capabilities/server/splash-screen) you can customize.

  * Devvit 0.12.11: App Review Update
  * Devvit 0.12.10: Good Karma
  * Devvit 0.12.9: Gaming Templates and Error Handling
  * Devvit 0.12.8: Simplified Playtest Logs
  * Devvit 0.12.7: The REAL End-of-Year Updates
  * Devvit 0.12.6: End-of-the-Year Updates
  * Devvit 0.12.5: Payments for Devvit Web
  * Devvit 0.12.4: Ins and Outs
  * Devvit 0.12.3: Odds and Ends
  * Devvit 0.12.2: Inline Mode, Launch Screens,Expanded App Experiences, and Developer Logs
  * Devvit 0.12.1: Cache Helper, Analytics dashboard for developers, and smaller fixes
  * Devvit 0.12.0: Devvit Web

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/community_games.md

# community_games

Source: https://developers.reddit.com/docs/guides/best-practices/community_games

On this page

Reddit offers a unique platform for a new category of social games. This guide will help you create engaging community games that thrive in Reddit's ecosystem with lessons from some of the games we've seen so far.

## What are community games?​

Community games are asynchronous multiplayer experiences built specifically for Reddit's platform. They leverage Reddit's unique social dynamics and content mechanics to create engaging, bite-sized gaming experiences that scale from single players to thousands.

## Why build a community game?​

  * _Played by millions_ \- Successful apps will be distributed to millions of users in their home feed
  * _Hosted services_ \- We provide hosting, storage (redis), and robust backend capabilities (realtime, scheduler, trigger) with every app
  * _Build once, play everywhere_ \- if you build your apps once they will run on web, android, and iOS
  * _Monetization opportunities_ \- We have reddit developer funds and payments to reward successful apps with a handful of new monetization opportunities coming soon.

## Core design principles​

### 1\. Keep it bite-sized​

  * Focus on quick, discrete gameplay loops
  * Reduce "time to fun" - players should be having fun within seconds
  * Small scope = faster development and easier maintenance
  * Example: [r/ChessQuiz](https://reddit.com/r/chessquiz) offers daily chess puzzles rather than full matches

### 2\. Design for the feed​

  * Create an eye-catching first screen that stands out
  * Include a clear, immediate call to action
  * Remember: You're competing with cat videos and memes
  * Example: [r/Pixelary](https://reddit.com/r/pixelary) shows the drawing canvas right in the feed

### 3\. Build content flywheels​

Reddit posts naturally decay after a few days. Your game needs a strategy to stay relevant:

**Option A: Scheduled content**

  * Daily/weekly challenges
  * Automated post creation
  * Regular tournaments or events
  * Example: [r/Sections](https://reddit.com/r/sections) posts a new puzzle every day

**Option B: Player-generated content**

  * Players create content through gameplay
  * Each play creates new posts/comments
  * Moderation systems for quality control
  * Example: [r/CaptionContest](https://reddit.com/r/captioncontest) turns each submission into new content

### 4\. Embrace asynchronous play​

Benefits:

  * Players can participate anytime
  * Lower commitment (one move vs. entire game)
  * Larger player pool across time zones
  * Better scalability

### 5\. Scale from one to many​

Your game should be fun at any player count:

  * Single-player baseline experience
  * Scales smoothly as more players join
  * Uses leaderboards to create competition
  * Example: [r/DarkDungeonGame](https://reddit.com/r/darkdungeongame) works solo but gets better with more players solving together

## Successful examples​

### Pixelary (drawing and guessing game)​

  * **Primary loop** : Draw (hard) → Creates posts
  * **Secondary loop** : Guess (easy) → Creates comments (optionally)
  * **Why it works** : 
    * Clear mental model
    * Two-tiered engagement
    * Natural content generation
    * Scales with community size

### ChezzQuiz (competitive chess puzzles)​

  * **Core loop** : Daily puzzles with competitive solving
  * **Why it works** : 
    * Consistent content schedule
    * Built-in competition
    * Leverages existing chess knowledge
    * Clear success metrics

## Best practices checklist​

  * ✅ Create your own subreddit
  * ✅ Can be played in under 2 minutes
  * ✅ Has a striking first impression
  * ✅ Creates new content regularly
  * ✅ Works for both 1 and 1000 players
  * ✅ Has clear user actions
  * ✅ Includes social elements
  * ✅ Uses moderation tools

## Common pitfalls to avoid​

  * ❌ Complex game rules
  * ❌ Long time commitments
  * ❌ Requiring specific player counts
  * ❌ Dependency on real-time interactions
  * ❌ Unclear first actions
  * ❌ No content refresh strategy

## Key takeaway​

The most successful Reddit community games create interesting content while being played, establishing a virtuous cycle of engagement and discovery. Focus on simplicity, scalability, and social interaction to make your game thrive.

  * What are community games?
  * Why build a community game?
  * Core design principles
    * 1\. Keep it bite-sized
    * 2\. Design for the feed
    * 3\. Build content flywheels
    * 4\. Embrace asynchronous play
    * 5\. Scale from one to many
  * Successful examples
    * Pixelary (drawing and guessing game)
    * ChezzQuiz (competitive chess puzzles)
  * Best practices checklist
  * Common pitfalls to avoid
  * Key takeaway

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/devvit-singleton.md

# devvit-singleton

Source: https://developers.reddit.com/docs/guides/migrate/devvit-singleton

On this page

This guide covers migrating traditional Devvit apps (using only Blocks or Mod Tools, without web views) to the Devvit Web setup. This is a straightforward migration that requires minimal changes.

## Overview​

The migration primarily involves switching from `devvit.yaml` to `devvit.json` configuration. Your existing Blocks and Mod Tools code will continue to work with minimal changes.

## Migration steps​

### 1\. Create devvit.json​

Create a `devvit.json` file in your project root with your app configuration:
    
    
    {  
      "name": "your-app-name",  
      "blocks": {  
        "entry": "src/main.tsx",  
        "triggers": ["onPostCreate"]  
      }  
    }  
    

Replace:

  * `"your-app-name"` with your actual app name
  * `"src/main.tsx"` with the path to your main Blocks entry point (where you export your Devvit instance)
  * Include any triggers used in your src/main.tsx in the triggers array (or remove the parameter)

### 2\. Remove devvit.yaml​

Delete the `devvit.yaml` file from your project root. All configuration is now handled by `devvit.json`.

### 3\. Handle static assets​

If your app uses static assets (images, fonts, etc.) from an `assets` folder, you'll need to define this in update your `devvit.json` to point to these assets:
    
    
    {  
      "name": "your-app-name",  
      "blocks": {  
        "entry": "src/main.tsx",  
        "triggers": ["onPostCreate"]  
      },  
      "media": {  
        "dir": "assets/"  
      }  
    }  
    

### 4\. Test your app​

Run your app locally to ensure everything works:
    
    
    devvit playtest  
    

## That's it!​

Your Blocks and Mod Tools code should work as intended without any other changes. The Devvit runtime handles the compatibility layer automatically.

While your app will work with just these changes, we recommend exploring the additional capabilities available in Devvit Web over time.

  * Overview
  * Migration steps
    * 1\. Create devvit.json
    * 2\. Remove devvit.yaml
    * 3\. Handle static assets
    * 4\. Test your app
  * That's it!

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/devvit_cli.md

# devvit_cli

Source: https://developers.reddit.com/docs/guides/tools/devvit_cli

On this page

The Devvit CLI enables you to create, upload, and manage your apps. It's the bridge between your codebase and Reddit.

note

We collect usage metrics when you use the Devvit CLI. For more information, see [Reddit’s Developer Terms](https://www.redditinc.com/policies/developer-terms) and the [Reddit Privacy Policy](https://www.reddit.com/policies/privacy-policy). You can opt out at any time by running `npx devvit metrics off`.

## CLI Usage​

### devvit create icons​

Bundles all `SVG` files in the `/assets` folder into a new file (`src/icons.ts` by default). Enabling you to import local SVG assets in your app code.

#### Usage​
    
    
    $ npx devvit create icons [output-file]  
    

#### Optional argument​

  * `output-file`

Path to the output file. Defaults to `src/icons.ts`.

#### Generating the SVG bundle file​
    
    
    $ npx devvit create icons  
      
    $ npx devvit create icons "src/my-icons.ts"  
    

#### Using the SVG files in app code​
    
    
    import { Devvit } from '@devvit/public-api';  
    import Icons from './my-icons.ts';  
      
    Devvit.addCustomPostType({  
      name: 'my-custom-post',  
      render: (_context) => {  
        return (  
          <blocks>  
            <image url={Icons['my-image.svg']} imageHeight="32px" imageWidth="32px" />  
          </blocks>  
        );  
      },  
    });  
      
    export default Devvit;  
    

### devvit help​

Display help for devvit

#### Usage​
    
    
    $ npx devvit help  
    

### devvit install​

Install an app from the Apps directory to a subreddit that you moderate. You can specify a version to install or default to @latest (the latest version).

#### Usage​
    
    
    $ npx devvit install <subreddit> [app-name]@[version]  
    

#### Required arguments​

  * `subreddit`

Name of the installation subreddit. The "r/" prefix is optional.

#### Optional arguments​

  * `app-name`

Name of the app to install (defaults to current project).

  * `version`

Specify the desired version (defaults to latest).

#### Examples​
    
    
    $ npx devvit install r/mySubreddit  
      
    $ npx devvit install mySubreddit my-app  
      
    $ npx devvit install r/mySubreddit my-app@1.2.3  
      
    $ npx devvit install r/mySubreddit @1.2.3  
    

### devvit list apps​

To see a list of apps you've published

#### Usage​
    
    
    $ npx devvit list apps  
    

### devvit list installs​

To see a list of all apps currently installed on a specified subreddit.

If no subreddit is specified, you'll get a list of all apps installed by you.

#### Usage​
    
    
    $ npx devvit list installs [subreddit]  
    

#### Optional argument​

  * `subreddit`

Name of the subreddit to look up installations for. The "r/" prefix is optional.

#### Examples​
    
    
    $ npx devvit list installs  
      
    $ npx devvit list installs mySubreddit  
      
    $ npx devvit list installs r/mySubreddit  
    

### devvit login​

Login to Devvit with your Reddit account in the browser.

#### Usage​
    
    
    $ npx devvit login [--copy-paste]  
    

#### Optional argument​

  * `--copy-paste`

If present, user will copy-paste code from the browser instead of the localhost.

### devvit logout​

Logs the current user out of Devvit.

#### Usage​
    
    
    $ npx devvit logout  
    

### devvit logs​

Stream logs for an installation within a specified subreddit. You can see 5,000 logs or up to 7 days of log events.

#### Usage​
    
    
    $ npx devvit logs <subreddit> [app-name] [-d <value>] [-j] [-s <value>] [--verbose]  
    

#### Required arguments​

  * `subreddit`

The subreddit name. The "r/" prefix is optional.

  * `app-name`

The app name (defaults to working directory app).

#### Optional arguments​

  * `-d <value>, --dateformat <value>`

Specify the format for rendering dates. Defaults to `MMM d HH:mm:ss` (Jan 15 18:30:03). See more about format options [here](https://date-fns.org/v2.29.3/docs/format).

  * `-j, --json`

Output JSON for each log line

  * `-s <value>, --since <value>`

Specify how far back you want the log streaming to start. Defaults to a `0m` (now) if omitted.

Supported format:

    * `s` seconds
    * `m` minutes
    * `h` hours
    * `d` days
    * `w` weeks

For example `15s`, `2w1d`, or `30m`.

  * `--verbose`

Displays the log levels and timestamps when the logs were created.

#### Examples​
    
    
    $ npx devvit logs r/mySubreddit  
      
    $ npx devvit logs mySubreddit my-app  
      
    $ npx devvit logs mySubreddit my-app --since 15s  
      
    $ npx devvit logs mySubreddit my-app --verbose  
    

### devvit new​

Create a new app.

#### Usage​
    
    
    $ npx devvit new [directory-name] [--here]  
    

#### Optional arguments​

  * `directory-name`

Directory name for your new app project. This creates a new directory for your app code. If no name is entered, you will be prompted to choose one.

  * `--here`

Generate the project here and not in a subdirectory.

#### Examples​
    
    
    $ npx devvit new  
      
    $ npx devvit new tic-tac-toe  
      
    $ npx devvit new --here  
    

### devvit playtest​

Installs your app to your test subreddit and starts a playtest session. A new version of your app is installed whenever you save changes to your app code, and logs are continuously streamed. Press `ctrl+c` to end the playtest session. Once ended, the latest installed version will remain unless you revert to a previous version using `devvit install`. For more information, see the [playtest page](/docs/guides/tools/playtest).

#### Usage​
    
    
    $ npx devvit playtest  
    

#### Optional argument​

  * subreddit Name of a test subreddit with less than 200 subscribers that you moderate. The "r/" prefix is optional.

If no subreddit is specified, the command will use the first available option from:

  * DEVVIT_SUBREDDIT environment variable
  * dev.subreddit field in devvit.json
  * The playtest subreddit stored for your app

If none exist, a new playtest subreddit will be automatically created.

### devvit settings list​

List settings for your app. These settings exist at the global app-scope and are available to all instances of your app.

#### Usage​
    
    
    $ npx devvit settings list  
    

### devvit settings set​

Create and update settings for your app. These settings will be added at the global app-scope.

#### Usage​
    
    
    $ npx devvit settings set <my-setting>  
    

#### Example​
    
    
    $ npx devvit settings set my-feature-flag  
    

### devvit uninstall​

Uninstall an app from a specified subreddit.

#### Usage​
    
    
    $ npx devvit uninstall <subreddit> [app-name]  
    

#### Required argument​

  * `subreddit`

Name of the subreddit. The "r/" prefix is optional. Requires moderator permissions in the subreddit.

  * `app-name`

Name of the app (defaults to the working directory app).

#### Examples​
    
    
    $ npx devvit uninstall r/mySubreddit  
      
    $ npx devvit uninstall mySubreddit  
      
    $ npx devvit uninstall mySubreddit my-app  
    

### devvit update app​

Update @devvit project dependencies to the currently installed CLI's version

#### Usage​
    
    
    $ npx devvit update app  
    

### devvit upload​

Upload an app to the App directory. By default the app is private and visible only to you.

#### Usage​
    
    
    $ npx devvit upload [--bump major|minor|patch|prerelease] [--copyPaste]  
    

#### Optional arguments​

  * `--bump <option>`

Type of version bump (major|minor|patch|prerelease)

  * `--copyPaste`

Copy-paste the auth code instead of opening a browser

### devvit version​

Get the version of the locally installed Devvit CLI.

#### Usage​
    
    
    $ npx devvit version  
    

### devvit view​

Shows you the latest version of your app and some data about uploads. Includes an optional --json flag to get information in JSON format.

#### Usage​​
    
    
    $ npx devvit view [APPSLUG[@VERSION]] [--json] [version]  
    

### devvit whoami​

Display the currently logged in Reddit user.

#### Usage​
    
    
    $ npx devvit whoami  
    

## Updating the CLI​

There are currently two ways to update the Devvit CLI, depending on how you installed it.

How do I know how I installed the CLI?

The easiest way to check how you installed the CLI is to run this command in your terminal:
    
    
    npm list -g --depth=0  
    

If you see a line that starts with `devvit@`, it means you have the CLI installed globally. If not, you likely have it installed as a dev dependency in your project - you can check this by looking for `devvit` in your project's `package.json` file under the `devDependencies` section. (If you don't see it in either place, you may not have the CLI installed at all, in which case, you can follow the [quickstart guide](/docs/quickstart) to install it.)

### 1\. If you installed the CLI as a dev dependency​

This is the recommended way to install the CLI, as it ensures that your project uses a specific version of the CLI, and makes it substantially easier to both update the CLI, and know what version of the CLI you're using.

To update the CLI, run the following command in your project directory:
    
    
    npm install --save-dev devvit@latest  
    

(Or, if you're using a different package manager, use an equivalent command to update the `devvit` package to the latest version, and save it as a development dependency. _DO NOT_ save it as a regular dependency - we don't need the CLI code uploaded with your app!)

### 2\. If you installed the CLI globally​

If you installed the CLI globally, ideally, you should uninstall the global version and install it as a dev dependency in your project instead. To do this, inside your project, run the following commands:
    
    
    npm uninstall -g devvit  
    npm install --save-dev devvit@latest  
    

If you still want to keep the CLI installed globally, you can update it by running the following command:
    
    
    npm install -g devvit@latest  
    

This will update the global version of the Devvit CLI to the latest version. However, please note that this is not recommended, as it can lead to inconsistencies between the CLI version used in your project and the global version. It's best to use the CLI as a dev dependency in your project to ensure that you're always using the same version across different environments.

  * CLI Usage
    * devvit create icons
    * devvit help
    * devvit install
    * devvit list apps
    * devvit list installs
    * devvit login
    * devvit logout
    * devvit logs
    * devvit new
    * devvit playtest
    * devvit settings list
    * devvit settings set
    * devvit uninstall
    * devvit update app
    * devvit upload
    * devvit version
    * devvit view
    * devvit whoami
  * Updating the CLI
    * 1\. If you installed the CLI as a dev dependency
    * 2\. If you installed the CLI globally

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/devvit_rules.md

# devvit_rules

Source: https://developers.reddit.com/docs/0.11/devvit_rules

This is documentation for Reddit for Developers **0.11** , which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](/docs/devvit_rules)** (0.12).

Version: 0.11

On this page

## Overview​

Welcome to Reddit’s Developer Platform (or “**Devvit** ”)! Before you build, please read these Devvit Rules along with Reddit’s [Developer Terms](https://www.redditinc.com/policies/developer-terms). We want you and your Devvit app(s) to succeed, and our policies and developer documentation are designed to enable you to provide a fun, safe, and trusted experience for all redditors. We expect you to be honest about your app(s), and to respect the privacy, safety, and other rights of redditors.

You must comply with: these Devvit Rules and Reddit’s [Developer Terms](https://www.redditinc.com/policies/developer-terms), [Developer Data Protection Addendum](https://www.redditinc.com/policies/developer-dpa), and [Data API Terms](https://www.redditinc.com/policies/data-api-terms); our [User Agreement](https://www.redditinc.com/policies/), [Econ Terms](https://www.redditinc.com/policies/econ-terms), [Previews Terms](https://www.redditinc.com/policies/previews-terms), [Privacy Policy](https://www.reddit.com/policies/privacy-policy), [Public Content Policy](https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy), [Reddit Rules](https://www.redditinc.com/policies/reddit-rules) and [Advertising Policy](https://redditinc.force.com/helpcenter/s/article/Reddit-Advertising-Policy-Restricted-Advertisements); and all other policies and developer documentation governing the use of our developer services (collectively, “**Reddit Terms & Policies**”). We may update Reddit Terms & Policies from time to time, so please check in and review them regularly.

## Reddit app review​

Your app is subject to our app review and approval. Reddit may reject or remove any app that violates these Devvit Rules or any other Reddit Terms & Policies at our discretion. We may also suspend or ban accounts tied to developers who violate these Devvit Rules or any other Reddit Terms & Policies.

These Devvit Rules are intended to clarify how we review Devvit apps and streamline the process for you and Reddit. Our goal is to keep redditors safe and enable developers to build fun and useful apps for redditors. This means our Devvit Rules may evolve over time, which you should keep in mind when building or updating your app. Please [reach out](https://developers.reddit.com/docs/help) if you have any questions on these Devvit Rules. Any exceptions to these Devvit Rules or any other Reddit Terms & Policies must be approved in writing by Reddit.

You can use Devvit and test your app without needing to submit it to Reddit’s App Review. However, to make your app visible in the [Reddit App Directory](https://developers.reddit.com/apps) and publicly available for other mods and admins to install, you’ll need prior app approval. Additionally, if you want to unlock premium features for your app (for example, [payments](/docs/0.11/payments/payments_overview), [fetching](/docs/0.11/capabilities/http-fetch), or using LLMs), you’ll also need prior app approval.

You can start the Reddit app review process by [publishing your app](/docs/0.11/publishing). Before starting a Reddit app review, we recommend:

  * Thoroughly playtesting your app,
  * Carefully reviewing these Devvit Rules and other Reddit Terms & Policies, and
  * Providing a detailed app description.

As part of Reddit app review, we may review your code, read through your app’s description, test your app, and provide feedback. When your app review is complete, we’ll notify you about your app’s status, which could be:

  * Approved
  * Approved with non-blocking feedback
  * Rejected with feedback on how to get your app approved
  * Rejected due to a violation of Devvit Rules or other Reddit Terms & Policies

Our app review process typically takes approximately one week from receipt of a complete submission, but may take longer depending on app review volumes or complexity of a given app. We aim to promptly review all apps but cannot guarantee a specific review time, particularly if your app seeks to unlock premium features. Our Devvit Rules and Reddit Terms & Policies are also evolving, which can impact the status of previously reviewed apps. Please be patient with us as we build Devvit and review your app.

You are required to resubmit your app for Reddit app review every time you publish changes to it. However, if your updates do not alter your app’s functionality significantly or in a way that might impact its compliance with these Devvit Rules or any other Reddit Terms & Policies, then your updates will go through a streamlined review.

We may require you to provide additional information to us in order to complete our app review. We also may periodically or randomly re-review your app and require you to make changes or otherwise face a suspension or ban of your app if we find it to no longer be compliant with these Devvit Rules and Reddit Terms & Policies.

If you have questions about Reddit’s app review and approval process or these Devvit Rules, please reach out for [help](https://developers.reddit.com/docs/help).

## General rules​

### Build for a quality experience​

You and your app(s) must:

  * Provide discrete functionality and always try to make Reddit more enjoyable
  * Maintain functionality that communities rely on, communicate when you cannot, and make it easy to contact you for support
  * Be transparent and use clear naming and descriptions that accurately describe your app’s functionality, purpose, and data practices
  * Include your own terms of service and privacy policy if your app uses premium features (for example, [payments](/docs/0.11/payments/payments_overview), [fetching](/docs/0.11/capabilities/http-fetch), or using LLMs) or if requested by Reddit
  * Provide accurate information about your relationship with Reddit or any other person or entity, including other developers (for example, by including them in your app description)
  * Test your app locally and in sandbox subreddits when applicable
  * Avoid enabling or allowing others to violate these Devvit Rules or other Reddit Terms & Policies

### Make mod apps easy to use​

If your app is intended to be used by mods for moderation purposes, please consider how the app should be configured by mods and provide instructions in your app description. Your instructions should empower mods to know how to use your app safely and responsibly for community governance purposes.

# Safety Rules

### Protect redditors from harm​

You and your app(s) must:

  * Comply with our [Reddit Rules](https://www.redditinc.com/policies/reddit-rules) and our [Moderator Code of Conduct](https://www.redditinc.com/policies/moderator-code-of-conduct)

  * Avoid facilitating, promoting, or amplifying:

  * Any form of dangerous activities;

  * Harmful or illegal content; or

  * Illegal or legally restricted activities

  * Ensure proper labeling and warning prior to exposing redditors to graphic, sexually-explicit, or offensive content

  * Prevent the manipulation of Reddit's features (e.g., voting, karma) or the circumvention of safety mechanisms (e.g., user blocking, account bans)

  * Avoid deceptive content (e.g., spam, malware) or adverse actions that may interfere with the normal use of Reddit (e.g., introducing malicious code or programs that violate these Devvit Rules or other Reddit Terms & Policies)

  * Build and implement adequate safeguards to prevent illegal or harmful content or functionality that may violate our [Reddit Rules](https://www.redditinc.com/policies/reddit-rules)

  * Provide app users with a way to report issues with the app or violations of these Devvit Rules and review and appropriately action user reports

You and your app(s) must not:

  * Attempt to publish an app targeting anyone under 13 — redditors must be over the age of 13 to use the platform!

  * Display mature content to redditors without appropriate labels or age-gating functionality

  * Include, encourage, or promote illegal or harmful content or functionality, including violence, harassment, bullying, hate speech, threats, or self-harm

  * Include or promote deceptive content, functionality, actions, or terms (for example, any form of spam or malware)

### Don’t build restricted apps​

You should not create an app or functionality that promotes or facilitates transactions in a prohibited or regulated industry such as (but not limited to) gambling, healthcare, financial and cryptocurrency products and services, political, alcohol, recreational drugs, or any other restricted category listed in the [Reddit Advertising Policy](https://redditinc.force.com/helpcenter/s/article/Reddit-Advertising-Policy-Restricted-Advertisements).

### Apps may be limited or removed​

If your app violates any of these Devvit Rules or any other Reddit Terms & Policies, including by mods or redditors using your app, then we may suspend or remove your app from Devvit or require you to update it or add disclaimers. We may also limit your app (including its reach, access to content, and functionality) when appropriate.

All apps we deem to have potential safety issues will need to provide additional information. We expect you to be able to quickly and effectively handle any concerns raised about safety.

## Privacy and data rules​

### Handle data with care​

Your app must comply with all privacy and data protection requirements outlined in Reddit’s [Developer Terms](https://www.redditinc.com/policies/developer-terms), [Developer Data Protection Addendum](https://www.redditinc.com/policies/developer-dpa), and other Reddit Terms & Policies. We take the privacy of redditors seriously and expect you to do so as well. You must:

  * **Respect redditors' data and privacy** – never intrude on redditors’ privacy and autonomy in spaces your app isn't authorized to access or moderate, and never try to re-identify, de-anonymize, unscramble, unencrypt, or reverse hash or reverse engineer data about redditors, Reddit, or Devvit;

  * **Get consent from redditors** – get explicit consent and appropriate permissions before processing data, or taking any actions (automated or not), on behalf of redditors (including before making any modification to redditors’ accounts), respect user decisions to opt-out or block or remove your app (as applicable), and only use data necessary for your app's stated functionality;

  * **Minimize data used** – build with data minimization in mind and never request that redditors share their login credentials or any other personal information to access or complete any action through your app or otherwise collect passwords, credentials, or other personal information from redditors;

  * **Be honest (no scams or spam)** – never collect, solicit, or deceive redditors into providing passwords, credentials, or other personal information to you or your app, and never scam nor spam redditors (for example, by frequently sending unsolicited messages) about your app without permissions;

  * **Be transparent** – be up front about your data practices, ensure all consents and permissions are complete, accurate, and clearly labeled, and notify Reddit and your users if your app is compromised (e.g., data breach, unauthorized access);

  * **Never profile redditors** – never process data to profile or otherwise infer redditors' personal characteristics, such as racial or ethnic origin, political opinions, religious or philosophical beliefs, union membership, genetics or biometrics, health, sex life, or sexual orientation;

  * **Never surveil redditors** – never gather intelligence nor attempt to track redditors or Reddit content for the purpose of surveillance, or to provide that information to governments or other entities conducting surveillance;

  * **Never sell data** – never sell, license, share, or otherwise commercialize data about redditors or Reddit (including by mining or scraping data from Reddit or Devvit) to target ads, use data brokers, ad networks, or other related services, train machine learning or artificial intelligence models (including large language models), or otherwise commercialize data;

  * **Keep your app secure** – keep your app (including your app data and app user data) secure, and do not enable it to bypass or circumvent Reddit’s or Devvit’s privacy, safety, or security features and enforcement measures (including any taken against your app);

  * **Keep it legal** – never transmit data of persons under 13 or data that includes protected health info, financial info, or other sensitive info under law; and

  * **Comply with our Public Content Policy** – abide by all restrictions described in our [Public Content Policy](https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy).

### Be careful using external sites or services​

If your app uses [HTTP Fetch](/docs/0.11/capabilities/http-fetch) or otherwise collects personal information about app users, we require you to have a terms of service and privacy policy and include a link to both in your app. Your terms of service and privacy policy must completely and accurately describe how you and your app collects, uses, shares, and stores data and why. (Please note that links to Reddit’s [User Agreement](https://redditinc.com/policies/user-agreement) and/or [Privacy Policy](https://www.reddit.com/policies/privacy-policy) will not be accepted.)

If your app links to any third-party site that may collect redditor personal data, you are solely responsible for verifying the legitimacy and security of the third-party site and should ensure that they are in compliance with all applicable laws. For example, you should ensure that a site collecting personal data provides a privacy policy that clearly discloses what data is collected, how the data is used, and how the data is shared.

You’ll also need permission during app review to direct redditors outside of Reddit or otherwise collect personal information about them. To request HTTP Fetch functionality for a specific domain, please follow [these instructions](/docs/0.11/capabilities/http-fetch).

## Content rules​

### Keep user and app content safe​

Any content used or created by your Devvit app must comply with Reddit Terms & Policies. For example:

  * **Using Existing User Content** – your app may copy and display existing Reddit user content and modify it for display, but only in compliance with Reddit’s [Developer Terms](https://www.redditinc.com/policies/developer-terms). User content on Reddit is owned by redditors and not by Reddit, so you must also comply with all requirements or restrictions imposed by the owners of user content. Ask redditors for their permission if you want to use existing user content in ways they might not expect (e.g., by building an in-app pop-up asking for redditor approval).

  * **Generating New User Content** – your app may allow new user content to be created by redditors, but all user content must comply with Reddit’s [User Agreement](https://www.redditinc.com/policies/developer-terms), [Reddit Rules](https://www.redditinc.com/policies/reddit-rules), and [Advertising Policy](https://redditinc.force.com/helpcenter/s/article/Reddit-Advertising-Policy-Restricted-Advertisements).

    * _Post or Comment Attribution Rules_ – if your app supports the creation of new posts or comments on Reddit by redditors, then you should create a new post or comment with the content author clearly identified as the author of the submitted content. Until your app is approved by Reddit, new content from your app will be posted from your Devvit app account. If your app is approved, then submitPost will post on behalf of the content author.

    * _In-App Content Rules_ – if your app allows users to create new forms of user content within your app (for example, a form submission that modifies the content of your app), your app should limit the available forms of expression to prevent potential abuse. Appropriate examples of limited expression include emojis, symbols (e.g., stock tickers), and predefined, safe dictionaries. If you want to minimize the risk of abuse, avoid allowing users to create new in-app content through free-form text inputs in your app.

  * **Displaying Devvit App Content** – your app may include information, materials, and other content that you provide and make available through your app. Your app content must also comply with these Devvit Rules, Reddit’s [User Agreement](https://www.redditinc.com/policies/developer-terms), [Reddit Rules](https://www.redditinc.com/policies/reddit-rules), and [Advertising Policy](https://redditinc.force.com/helpcenter/s/article/Reddit-Advertising-Policy-Restricted-Advertisements). You may not use external logos or trademarks in your app without express written permission.

If any content created or otherwise displayed through your app violates these Devvit Rules or other Reddit Terms & Policies, then Reddit may remove the content and/or request you remove the content. Failure to do so can result in your app being removed from Devvit.

### Enable and respect user deletions​

Whether your app uses existing user content or otherwise allows users to create new user content, you and your app must always honor user deletion requests and respect redditors’ privacy rights. More specifically:

  * **Deleting Existing User Content** – you are required to remove any user content that has been deleted from Reddit, including from your Devvit app(s). We provide access to post and comment delete events via triggers to help facilitate this.

  * _Post/Comment Deletions_ – On PostDelete and CommentDelete event triggers, you must delete all content related to the post and/or comment (for example, title, body, embedded URLs, etc.) from your app. This includes data that is in the Redis/KVstore and data sent to an external service. Metadata required for contextualizing related content (for example, post or comment ID, createdAt, etc.) may be retained.

  * _Account Deletions_ – When a user account is deleted, the related user ID (t2_*) must be completely removed from your hosted datastores (e.g., Redis) and any external systems. You must also delete all references to the author-identifying information (including the author ID, name, profile URL, avatar image URL, user flair, etc.) from posts and comments created by that account. You may continue to keep posts and comments created by deleted accounts, provided that the posts and comments have not been explicitly deleted.

  * _Setting Up Auto-Deletion_ – To best comply with this policy, we recommend deleting any stored user data within 30 days. For any data you are storing in Redis, you can use the [expire function](/docs/0.11/capabilities/redis#key-expiration) to ensure data gets deleted automatically.

  * **Enabling Deletions of New User Content** – if your app allows users to create new user content, you must ensure that users have the ability to remove their own content when desired and comply with all legal requirements related to content removals. It is important to have safety guardrails in place if your app allows users to create new user content so that the content can be reported and removed by app users.

Any retention of content and data that has been deleted, even if disassociated, de-identified or anonymized, is a violation of our terms and policies.

## Reddit brand and IP rules​

### Don’t use Reddit IP​

Do not use any Reddit trademarks (e.g., REDDIT or SNOO) or other [brand assets](https://www.redditinc.com/brand) in your app. Check out our [Brand Guidelines](https://reddit.lingoapp.com/k/oYYL4W) and [Trademark Use Policy](https://www.redditinc.com/policies/trademark-use-policy) to learn more.

Your app should be creative and unique and have an original name and branding. It shouldn’t be similar to or confusingly reference Reddit. Do not suggest any endorsement, partnership, sponsorship, or affiliation with Reddit by using Reddit trademarks or other brand assets. For example, do not name your app “Reddit Community Fundraisers” or use Reddit’s alien mascot Snoo as a game character in your app.

Reddit may, at our discretion, permit you to use Reddit trademarks or other brand assets in your app, but all use must comply with our Brand Guidelines and Trademark Use Policy and must be approved by Reddit in writing before your app is published. This review-and-approval process is in addition to our standard app review; for example, if you are given permission to use Snoo in your app, any plot or dialogue with Snoo must be submitted to Reddit for review and approval.

Developers who fail to respect Reddit’s intellectual property may lose access to Devvit, as well as face other enforcement actions by Reddit.

### Don’t use third-party IP w/o permission​

Do not infringe any third-party intellectual property rights or otherwise use any third-party intellectual property in your app without explicit permission. This means no copycat or clone apps. We want apps built on Reddit’s Developer Platform to be unique and solve real use cases for communities and their users.

Your app must:

  * **Be original and innovative** – we know you have great ideas and can’t wait to see how you introduce new features or improve existing ones in a meaningful way.

  * **Respect intellectual property** – be fair to others. Don’t copy code, UI, images, or logos from other apps without permission and respect existing trademarks and copyrights.

  * **Not cause confusion** – apps that impersonate another app, developer, or service are prohibited. This includes cloning apps or suggesting that an app is another app that already exists.

Apps that violate any of these guidelines are subject to removal from Reddit’s Developer Platform at any time, and we may suspend or ban any developer who violates these Devvit Rules and other Reddit Terms & Policies.

## Payment rules​

### Pilot Devvit goods​

You may be able to monetize your Devvit app by offering certain digital avatars, goods, currencies, items, products, or features through your Devvit app (your “app goods”). In order to unlock and use Devvit Payments, you and your app must abide by Reddit’s [Earn Terms](http://redditinc.com/policies/earn-terms) and [Earn Policy](http://redditinc.com/policies/earn-policy), in addition to these Devvit Rules and other Reddit Terms & Policies. For example, you and your app cannot:

  * Enable gambling, including the purchase of cryptocurrencies or other digital assets that can be exchanged for real money,

  * Have deceptive pricing terms or limit functionality behind a paywall or in-app purchase, or

  * Direct redditors off-platform to provide payment to you (e.g., sending you money directly or offering to buy you a coffee).

We’re currently piloting Devvit Payments with a small number of developers. Check out our [Earn Terms](http://redditinc.com/policies/earn-terms) and [Earn Policy](http://redditinc.com/policies/earn-policy) for more information.

### Link carefully to external financial services​

If your app links to any third-party site that facilitates financial transactions, you are solely responsible for verifying the legitimacy and security of the third-party site and should ensure that they are in compliance with all applicable laws. For example, you should ensure that a charitable organization collecting donations is registered as a 501(c)(3) organization (or local equivalent) and provides necessary tax receipts. To the extent that you intend to include links to such third-party sites, you must provide your own terms of service and privacy policy.

## Account-linked services​

Devvit apps requiring association with external user accounts (Account-linked services) must adhere to specific guidelines. Examples include "Verified positions" apps for posting verified stock holdings, fitness apps for workout stats, and gaming accounts for leaderboard positions.

Such apps cannot be published in public subreddits until app review is complete.

### Guidelines for account-linked services​

  * Anonymize all user-identifying information (user IDs, usernames, profile image, etc.) before sending to external servers.
  * The only permitted linkage between identities on Reddit and external user accounts is a unique ID.
  * Information imported into Reddit must not contain any personal data (including but not limited to PII, real names, or other information that could be used to identify an individual).
  * Users must explicitly opt-in to connecting external services and a corresponding consent prompt must be present.
  * Provide ability to unlink connected accounts and log out of connected services.
  * Delete user data on external services within 30 days upon unlinking logging out.
  * Link to terms, conditions, and privacy policy that outline the type of data being collected.

### Guidelines for external services for account linking​

  * External services connecting [Reddit user data](https://www.reddit.com/policies/privacy-policy#policy-h2-3) to external account data must have SOC2 Type II compliance.
  * Provide evidence of recent (12 months prior) penetration test by an accredited third party with no High or Critical findings or appropriate remediation and retest attestation.
  * Account-linked services must be limited to read-only OAuth scopes to external user accounts. Username/password authentication is not permitted to external services.

## Generative AI/LLM rules​

### Only use approved LLMs​

Your Devvit apps can use approved Large Language Models (“LLMs”) via the fetch functionality, provided your app adheres to the following guidelines as well as the Reddit Terms & Policies. Your app:

  * Provides significant and unique benefit to Reddit users and communities through Reddit;
  * Uses an approved LLM (see approved LLM services below);
  * Does not use Reddit data to create, improve, modify, train, fine-tune or allow any third-party access to create, improve, modify, train or fine-tune any Generative AI, LLM, ML, or NLP models using Reddit Data*;
  * Includes terms of services and a privacy policy for handling user data; and
  * Adheres to all other rate limits and guidelines as outlined in our [Developer Terms](https://www.redditinc.com/policies/developer-terms).

_If you are interested in using Reddit data for LLM training for research or commercial purposes, please submit a request[here](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164)._

Approved LLMs:

  * Google Gemini

  * OpenAI ChatGPT

For the avoidance of doubt, self-hosted LLMs (e.g. LLama, mistral, hugging face) are not approved for use at this time.

Reddit reserves the right to update these guidelines, including approved LLMs, at any time. It is your responsibility to ensure your app is compliant with the latest guidelines.

## Reporting rules​

### Contact your app users​

If you want to contact users of your app, you'll currently need to coordinate with our team. This will change in the future, but please reach out to the Developer Platform team to communicate key updates, bugs, etc.

### See something, say something​

If you come across an app that you believe violates these Devvit Rules or other Reddit Terms & Policies, please [reach out](https://developers.reddit.com/docs/help) and report it.

  * Overview
  * Reddit app review
  * General rules
    * Build for a quality experience
    * Make mod apps easy to use
    * Protect redditors from harm
    * Don’t build restricted apps
    * Apps may be limited or removed
  * Privacy and data rules
    * Handle data with care
    * Be careful using external sites or services
  * Content rules
    * Keep user and app content safe
    * Enable and respect user deletions
  * Reddit brand and IP rules
    * Don’t use Reddit IP
    * Don’t use third-party IP w/o permission
  * Payment rules
    * Pilot Devvit goods
    * Link carefully to external financial services
  * Account-linked services
    * Guidelines for account-linked services
    * Guidelines for external services for account linking
  * Generative AI/LLM rules
    * Only use approved LLMs
  * Reporting rules
    * Contact your app users
    * See something, say something

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/devvit_web_configuration.md

# devvit_web_configuration

Source: https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration

On this page

The devvit.json file serves as your app's configuration file. Use it to specify entry points, configure features like [event triggers](/docs/capabilities/server/triggers) and [scheduled actions](/docs/capabilities/server/scheduler), and enable app functionality such as [image uploads](/docs/capabilities/server/media-uploads). This page covers all available devvit.json configuration options. A complete devvit.json example file is provided here.

## devvit.json​

The `devvit.json` [schema](https://developers.reddit.com/schema/config-file.v1.json) is available and is self-documented.

All configuration files should include a `$schema` property which many IDEs will use to make suggestions and present documentation:
    
    
    {  
      "$schema": "https://developers.reddit.com/schema/config-file.v1.json"  
    }  
    

## Required properties​

Your `devvit.json` must include:

  * **`name`** (required): App account name and Community URL slug. Must be 3-16 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.

Additionally, you must include at least one of:

  * **`post`** : For web view apps
  * **`server`** : For Node.js server apps
  * **`blocks`** : For Blocks

## Configuration sections​

### Core properties​

Property| Type| Description| Required| `name`| string| App account name and Community URL slug (3-16 chars, `^[a-z][a-z0-9-]*$`)| Yes| `$schema`| string| Schema version for IDE support| No (recommended)  
---|---|---|---  
  
### App components​

Property| Type| Description| Required| `post`| object| Custom post/web view configuration| One of post/server/blocks| `server`| object| Node.js server configuration| One of post/server/blocks| `blocks`| object| Blocks| One of post/server/blocks  
---|---|---|---  
  
### Permissions & capabilities​

Property| Type| Description| Required| `permissions`| object| What your app is allowed to do| No| `media`| object| Static asset configuration| No| `marketingAssets`| object| Assets for featuring your app| No  
---|---|---|---  
  
### Event handling​

Property| Type| Description| Required| `triggers`| object| Event trigger endpoints| No (requires server)| `scheduler`| object| Scheduled task configuration| No  
---|---|---|---  
  
### UI & interaction​

Property| Type| Description| Required| `menu`| object| Menu items in posts, comments, subreddits| No| `forms`| object| Form submission endpoints| No  
---|---|---|---  
  
### Development​

Property| Type| Description| Required| `dev`| object| Development configuration| No  
---|---|---|---  
  
## Detailed configuration​

### Post configuration​

Configure web views for custom post types:
    
    
    {  
      "post": {  
        "dir": "public",  
        "entrypoints": {  
          "default": {  
            "entry": "index.html",  
            "height": "tall"  
          }  
        }  
      }  
    }  
    

**Properties:**

  * `dir` (string): Client directory for web view assets (default: `"public"`)
  * `entrypoints` (object): Map of named entrypoints for post rendering 
    * Must include a `"default"` entrypoint
    * `entry` (string): HTML file path or `/api/` endpoint
    * `height` (enum): `"regular"` or `"tall"` (default: `"regular"`)

### Server configuration​

Configure Node.js server functionality:
    
    
    {  
      "server": {  
        "entry": "src/server/index.js"  
      }  
    }  
    

**Properties:**

  * `entry` (string): Server bundle filename (default: `"src/server/index.js"`)

Server bundles must be compiled to CommonJS (`cjs`). ES module output is not supported by the Devvit Web runtime.

### Permissions configuration​

Control what your app can access:
    
    
    {  
      "permissions": {  
        "http": {  
          "enable": true,  
          "domains": ["example.com", "api.github.com"]  
        },  
        "media": true,  
        "payments": false,  
        "realtime": false,  
        "redis": true,  
        "reddit": {  
          "enable": true,  
          "asUser": ["SUBMIT_POST", "SUBMIT_COMMENT"]  
        }  
      }  
    }  
    

**HTTP plugin:**

  * `enable` (boolean): Enable HTTP plugin (default: `true`)
  * `domains` (array): Allowed domains for `fetch()` calls

**Reddit API plugin:**

  * `enable` (boolean): Enable Reddit API (default: `true`)
  * `scope` (enum): `"user"` or `"moderator"` (default: `"user"`)
  * `asUser` (array): APIs to execute as user account

**Other permissions:**

  * `media` (boolean): Enable media uploads (default: `false`)
  * `payments` (boolean): Enable payments plugin (default: `false`)
  * `realtime` (boolean): Enable realtime messaging (default: `false`)
  * `redis` (boolean): Enable Redis storage (default: `false`)

### Triggers configuration​

Handle Reddit events:
    
    
    {  
      "triggers": {  
        "onPostCreate": "/internal/triggers/post-create",  
        "onCommentSubmit": "/internal/triggers/comment-submit",  
        "onModAction": "/internal/triggers/mod-action"  
      }  
    }  
    

**Available triggers:**

  * `onAppInstall`, `onAppUpgrade`
  * `onPostCreate`, `onPostDelete`, `onPostSubmit`, `onPostUpdate`, `onPostReport`, `onPostFlairUpdate`, `onPostNsfwUpdate`, `onPostSpoilerUpdate`
  * `onCommentCreate`, `onCommentDelete`, `onCommentSubmit`, `onCommentUpdate`, `onCommentReport`
  * `onModAction`, `onModMail`
  * `onAutomoderatorFilterPost`, `onAutomoderatorFilterComment`

**Note:** All trigger endpoints must start with `/internal/` and will receive POST requests with JSON data.

### Menu configuration​

Add menu items to subreddit interfaces:
    
    
    {  
      "menu": {  
        "items": [  
          {  
            "label": "Approve Post",  
            "description": "Quickly approve this post",  
            "forUserType": "moderator",  
            "location": ["post"],  
            "endpoint": "/internal/menu/approve-post",  
            "postFilter": "none"  
          },  
          {  
            "label": "Report Issue",  
            "description": "Report a problem with this post",  
            "forUserType": "user",  
            "location": ["post", "comment"],  
            "endpoint": "/internal/menu/report-issue"  
          }  
        ]  
      }  
    }  
    

**Menu item properties:**

  * `label` (string): Display text (required)
  * `description` (string): Short description
  * `forUserType` (enum): `"moderator"` or `"user"` (default: `"moderator"`)
  * `location` (string|array): Where menu appears (`"post"`, `"comment"`, `"subreddit"`)
  * `endpoint` (string): Internal endpoint to call (required)
  * `postFilter` (enum): `"none"` or `"currentApp"` (default: `"none"`)

### Scheduler configuration​

Configure scheduled tasks:
    
    
    {  
      "scheduler": {  
        "tasks": {  
          "daily-cleanup": {  
            "endpoint": "/internal/cron/daily-cleanup",  
            "cron": "0 2 * * *"  
          },  
          "hourly-check": {  
            "endpoint": "/internal/cron/hourly-check",  
            "cron": "0 * * * *",  
            "data": {  
              "checkType": "health"  
            }  
          },  
          "manual-task": "/internal/cron/manual-task"  
        }  
      }  
    }  
    

**Task configuration:**

  * `endpoint` (string): Internal endpoint to call (required)
  * `cron` (string): Cron schedule (optional, for automatic scheduling)
  * `data` (object): Additional data passed to cron tasks (optional)

**Cron format:** Standard five-part (`0 2 * * *`) or six-part (`*/30 * * * * *`) format.

### Forms configuration​

Map form identifiers to submission endpoints:
    
    
    {  
      "forms": {  
        "contact_form": "/internal/forms/contact",  
        "feedback_form": "/internal/forms/feedback"  
      }  
    }  
    

### Marketing assets​

Configure app presentation:
    
    
    {  
      "marketingAssets": {  
        "icon": "assets/icon.png"  
      }  
    }  
    

**Properties:**

  * `icon` (string): Path to 1024x1024 PNG icon (required)

### Development configuration​

Configure development settings:
    
    
    {  
      "dev": {  
        "subreddit": "my-test-subreddit"  
      }  
    }  
    

**Properties:**

  * `subreddit` (string): Default development subreddit (can be overridden by `DEVVIT_SUBREDDIT` env var)

## Migration from `devvit.yaml`​

  1. Create a new `devvit.json` file in the project root.
  2. Copy over the `name` property from `devvit.yaml`.
  3. Delete `devvit.yaml`.
  4. Move configuration from `Devvit.configure()` calls to `permissions`. For example, if the app called `Devvit.configure({redis: true})` set `permissions.redis` to `true` in `devvit.json`.
  5. If the app has a web view, set `post` in `devvit.json` and either configure `post.entry` to `webroot/` or to your build output directory. Optionally, delete calls to `Devvit.addCustomPostType()` and `Devvit.addMenuItem()`.
  6. If the app has a Node.js server, set `server` in `devvit.json`.
  7. (Optional) Set `blocks.entry` to `src/main.tsx` (or `src.main.ts`) to continue using `@devvit/public-api` legacy APIs.

## Validation rules​

The `devvit.json` configuration is validated against the JSON Schema at build time. Many IDEs will also underline errors as you write. Common validation errors include:

  * **JSON Syntax:** Adding comments or trailing commas (unsupported by JSON)
  * **Required Properties:** Missing the required `name` property
  * **App Components:** Missing at least one of `post`, `server`, or `blocks`
  * **Dependencies:** Missing `server` when `triggers` is specified
  * **File References:** Missing files referenced in `devvit.json`
  * **Permissions:** Missing required permissions for used features
  * **Pattern Validation:** Invalid patterns for names, paths, or endpoints

## Best practices​

  1. **Always include the`$schema` property** for IDE autocompletion and validation.
  2. **Use specific permission scopes.** Only request permissions your app actually uses.
  3. **Set appropriate menu scopes.** Consider whether features should be available to all users or just moderators.
  4. **Validate endpoints.** Ensure all internal endpoints start with `/internal/`.
  5. **Use meaningful names.** Choose descriptive names for entrypoints, tasks, and forms.
  6. **Test configurations.** Validate your config with `devvit build` before deployment.

## Environment variables​

  * `DEVVIT_SUBREDDIT`: Override the `dev.subreddit` value used during `devvit playtest`.
  * `DEVVIT_APP_NAME`: Override the `name` value used during `devvit playtest` (and other similar commands).

## Complete example​

devvit.json
    
    
    {  
      "$schema": "https://developers.reddit.com/schema/config-file.v1.json",  
      "name": "my-awesome-app",  
      "post": {  
        "dir": "public",  
        "entrypoints": {  
          "default": {  
            "entry": "index.html",  
            "height": "tall"  
          }  
        }  
      },  
      "server": {  
        "entry": "src/server/index.js"  
      },  
      "permissions": {  
        "http": {  
          "enable": true,  
          "domains": ["api.example.com"]  
        },  
        "redis": true  
      },  
      "triggers": {  
        "onPostCreate": "/internal/triggers/post-create"  
      },  
      "menu": {  
        "items": [  
          {  
            "label": "Approve",  
            "forUserType": "moderator",  
            "location": "post",  
            "endpoint": "/internal/menu/approve"  
          }  
        ]  
      },  
      "scheduler": {  
        "tasks": {  
          "daily-cleanup": {  
            "endpoint": "/internal/cron/cleanup",  
            "cron": "0 2 * * *"  
          }  
        }  
      },  
      "marketingAssets": {  
        "icon": "assets/icon.png"  
      },  
      "dev": {  
        "subreddit": "my-test-sub"  
      }  
    }  
    

  * devvit.json
  * Required properties
  * Configuration sections
    * Core properties
    * App components
    * Permissions & capabilities
    * Event handling
    * UI & interaction
    * Development
  * Detailed configuration
    * Post configuration
    * Server configuration
    * Permissions configuration
    * Triggers configuration
    * Menu configuration
    * Scheduler configuration
    * Forms configuration
    * Marketing assets
    * Development configuration
  * Migration from `devvit.yaml`
  * Validation rules
  * Best practices
  * Environment variables
  * Complete example

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/devvit_web_overview.md

# devvit_web_overview

Source: https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview

On this page

Devvit Web includes an easy way to build Devvit apps using a standard web stack.

## What it is​

Devvit Web allows developers to build Devvit apps just like you would for the web. At the core, Devvit Web provides:

  * **A standard web app** that allows you to build with industry-standard frameworks and technologies (like React, Three.js, or Phaser).
  * **Server endpoints** that you define to communicate between the webview client and the Devvit server, using industry-standard frameworks and technologies (like Express.js, Koa, etc.).
  * **Devvit configuration** with a traditional client/server split. Devvit capabilities are now in one of three places:
    * A configuration file in devvit.json for defining app metadata, permissions, and capabilities
    * Client capabilities in the @devvit/client SDK
    * Server capabilities, like Redis and Reddit API with the @devvit/server SDK

With Devvit Web, you have continued access to our hosting services, key capabilities like Redis and Reddit API, standard web technologies, and a typical client/server pattern to build your apps.

In addition, since you’re working with standard web technologies your apps should work with AI tools more effectively.

## Examples​

Visit <https://developers.reddit.com/new> and choose one of our templates or take a look at the github repositories:

  * [React](https://github.com/reddit/devvit-template-react)
  * [Phaser](https://github.com/reddit/devvit-template-phaser)
  * [Three.js](https://github.com/reddit/devvit-template-threejs)
  * [Hello World](https://github.com/reddit/devvit-template-hello-world)

## Limitations​

As with most experimental features, there are some caveats.

Limitation| What it means| Serverless endpoints| The node server will run just long enough to execute your endpoint function and return a response, which means you can’t use packages that require long-running connections like streaming.| Package limitations| Developers cannot use `fs` or external native packages. For now, we recommend using external services over the native dependencies, such as [StreamPot](https://streampot.io/) (instead of ffmpeg) and [OpenAI](https://platform.openai.com/docs/guides/embeddings) (instead of @xenova/transformers) .| Single request and single response handling only| Streaming or chunked responses and websockets are not supported. Long-polling is supported if it’s under the max request time.| No external requests from your client| You can’t have any external requests other than the app's webview domain. All backend responses are locked down to the webview domain via CSP. (Your backend can make external fetch requests though.)  
---|---  
  
Devvit Web still has the same technical requirements:

  * Server endpoint calls
  * Max request time: 30s
  * Max payload size: 4MB
  * Max response size: 10MB
  * HTML/CSS/JS only

## Devvit Web components​

Devvit Web uses endpoints between the client and server to make communication similar to standard web apps. A Devvit Web app has three components:

  * Client
  * Server
  * Configuration

Devvit Web templates all have the same file structure:
    
    
    - src  
      - client / // contains the webview code  
      - server / // endpoints for the client  
    - devvit.json; // the devvit config file  
    

Now, instead of passing messages with postMessage (old way), you’ll define `/api/endpoints` (new way).

### Client folder​

This folder includes client-side code. This includes any html/css/javascript and relevant web libraries, and it will appear in a webview inside of a post for Reddit users.

When you want to make server-side calls, or use server-side capabilities, you’ll use fetch and define what happens in your server folder.

### Server folder​

This folder includes server-side code. We provide a node server, and you can use typical node server frameworks like Koa or Express. This is where you can access key capabilities like [Redis](/docs/capabilities/server/redis), Reddit API client, and [fetch](/docs/capabilities/server/http-fetch).

We also provide an authentication middleware so you don’t have to worry about authentication.

note

All server endpoints must start with `/api/` (e.g. `/api/get-something` or `/api/widgets/42`).

![devvit web architecture](/docs/assets/images/devvit_web_arch-7c4a1eded4e6462277ab8169622722fa.png)

### Configuration in `devvit.json`​

`devvit.json` is the configuration file for Devvit apps. It defines an app's post configuration, Node.js server configuration, permissions, scheduled jobs, event triggers, menu entries, payments configuration, and project settings. `devvit.json` replaces the legacy `devvit.yaml` configuration. A project should have one or the other but not both.

Learn more about [devvit.json](/docs/capabilities/devvit-web/devvit_web_configuration)

  * What it is
  * Examples
  * Limitations
  * Devvit Web components
    * Client folder
    * Server folder
    * Configuration in `devvit.json`

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/docs.md

# docs

Source: https://developers.reddit.com/docs

Devvit allows you to build interactive games and apps that live on Reddit. Build experiences that can earn up to $167,000 per app with our [Reddit Developer Funds](https://support.reddithelp.com/hc/en-us/articles/27958169342996-Reddit-Developer-Funds-2025-Terms).

Build community games like [Hot and Cold](https://www.reddit.com/r/hotandcold/), [Sword and Supper](https://www.reddit.com/r/SwordAndSupper/), and [Honk](https://www.reddit.com/r/RedditGames/), or create [custom mod tools](https://www.reddit.com/r/ModSupport/comments/1k6szsj/devvit_apps_for_moderation_a_list/) to empower your community.

**More examples:** [App Showcase](/docs/examples/app-showcase)

**Questions?** Join [r/devvit](https://www.reddit.com/r/devvit/) or our [Discord](https://developers.reddit.com/discord).

[![Build Games](/docs/assets/images/SpotIllustration_Rocket-73c293fe486df84fe3d030458573dc09.webp)Build Games](/docs/introduction/intro-games)## [Create Mod Tools![Create Mod Tools](/docs/assets/images/SnooToolboxClipboard-cbf02e2b0d9b60614241984388bd6e77.webp)](/docs/introduction/intro-mod-tools)

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/feature-guide.md

# feature-guide

Source: https://developers.reddit.com/docs/guides/launch/feature-guide

On this page

Reddit celebrates creative games and experiences built by developers from our global community. Our Featuring Program does this by connecting exciting new apps with millions of active redditors.

Once your game has been launched, you may be the perfect candidate for our Featuring Program. As part of this program, Reddit works with developers to accelerate their game distribution and viewership.

Games that see great engagement as they grow will be featured across more prominent surfaces, which can expedite their qualification for [Reddit Developer Funds](https://developers.reddit.com/docs/earn-money/reddit_developer_funds), where developers can make up to $167,000 per app.

Learn how your game can be featured across Reddit and reach thousands of players.

* * *

## What is featuring?​

Whether you’re prototyping an early version of your first Reddit game or launching a polished experience to a wide audience, you have an opportunity to be featured. Our mission is to help developers grow by connecting their work with the Reddit users that will love it. Featuring selections are curated by our team and refreshed regularly to spotlight innovation, polished play, and player engagement.

Note that our top featuring slots are reserved for games that are of professional quality, as well as games that see exceptional engagement as they grow (CTR, dwell times, positive user engagement, retention).

Once your game is part of the program, it will be rotated in and out of featuring slots to support curatorial diversity.

* * *

## How to get featured​

Once your game has been published and approved, it may be considered for the Featuring Program. You can also apply directly for consideration using the [Featuring Request Form](https://forms.gle/BeKcqQy8yZEqEmtR6).

Please ensure you read this guide — especially the requirements and considerations — in its entirety before submitting your game.

Games that see organic growth are also likely to be scouted by our team for featuring.

* * *

## Ways we highlight developers​

Reddit features games and developers across multiple discovery surfaces to help players find new favorites:

  * **Games Feed.** The Games Feed showcases playable experiences directly within Reddit. When featured, games are rotated into a list of games that is algorythmically served to users visiting the feed.

![Featured games](/docs/assets/images/featured_games-ceb9ae35920816bed23739b131200188.png)

  * **Community Drawer.** Our lefthand drawer provides an easy access point for any redditor to see a mix of recently played games and curated popular games.

![Community drawer web](/docs/assets/images/featured_cd_web-8a26ae70e01ae860769c5b658004e0d5.png)

![Community drawer mobile](/docs/assets/images/featured_cd_mobile-dc6b10a1e7112a84209d1a4798e45bf2.png)

  * **Home Feed boosting.** One selected game per week is given an extra algorithmic boost in user home feeds, reaching broad audiences.
  * **r/GamesOnReddit.** The curated [r/GamesOnReddit](https://www.reddit.com/r/GamesOnReddit/) banner highlights new and trending games for Reddit players.
  * **Developer stories.** The [r/devvit](https://www.reddit.com/r/devvit/) community and [Devvit blog](https://kiro.dev/) regularly highlight developer journeys, tips, and behind-the-scenes insights. Some developers will also be tapped for key Reddit marketing and PR materials.

* * *

## Featuring tiers​

Tier| Description| Featuring Spots| Who It’s For| Level of Polish| Approximate Impressions*|  **Distributed**|  Games get initial exposure on r/GamesOnReddit featuring| Cross-posted by Reddit, pinned banner on r/GamesOnReddit| Developers seeking first players| Early builds of launched apps| Thousands| **Promoted**|  Polished games selected to gain more visibility and engagement| Games Feed listing, more visibility in r/GamesOnReddit launch pad| Developers ready to expand their reach| Polished, working seamlessly across all platforms| Tens of thousands of impressions| **Highlighted**|  High-performing games that drive significant player engagement| Games Feed top positions, added to Community Drawer “recently played” or one of the popular slots| Developers with highly polished, iterated games| Highly polished, optimized for scale and retention| Hundreds of thousands of impressions| **Hero**|  Top-tier, standout games featured broadly across Reddit| Games Feed highlight, featured in Community Drawer, Home Feed highlight| Developers with flagship-quality games| Pro quality, high retention and engagement| Millions to tens of millions of impressions  
---|---|---|---|---|---  
  
*This is a rough estimate and does not reflect what any particular game will reach at this tier.

Games can be promoted to our highest featuring tiers if they see exceptional engagement and retention at lower featuring levels. Our team looks at CTRs, day 1 and day 3 retention, dwell time, as well as qualitative user feedback. We hope to add more of these metrics to the developer analytics panel in the coming months.

* * *

## Featuring requirements​

In order to promote a game, we need to ensure the experience for redditors meets certain quality criteria. To be featured at any level you must have:

  * **A compelling first screen.** Your game must have a custom [splash screen](https://developers.reddit.com/docs/capabilities/server/splash-screen).
  * **Cross platform support.** Your game's viewport must be accessible and clean on both mobile and desktop platforms.
  * **Self-explanatory design.** Anyone should be able to click into your post and have the context needed to learn, play, or participate.
  * **Responsive design.** All screens should be visible within fullscreen, mobile, and desktop. Avoid unnecessary scrolls. Scrolling within inline webviews is prohibited.

* * *

## Featuring considerations​

Our goal is to feature games that feel great to play and reflect Reddit’s creative spirit. With each featuring tier, the quality of featured apps becomes more stringent. Beyond the basic featuring requirements, we want to see:

  * **Standout user experience.** Fast, intuitive, and responsive gameplay across devices.
  * **Design and polish.** Cohesive visuals, appealing splash screens, and optimized mobile layouts.
  * **Community engagement.** Features that encourage posts, comments, and user-generated content.
  * **Innovation.** Fresh mechanics or concepts that make Reddit play unique.
  * **Performance and retention.** Stable technical performance and meaningful player return rates.
  * **Iteration.** Regular updates and responsiveness to player feedback.

* * *

## Celebrating your app​

Games that reach featured tiers often see thousands of daily players and dedicated community followings. When your game is featured, you’ll receive promotional visibility through banners, feeds, and subreddit posts, as well as the opportunity to share your success across social channels and developer communities.

See stories about successful games like [Honk](https://developers.reddit.com/docs/blog/honk) and [Syllocrostic](https://www.reddit.com/r/Devvit/comments/1n0vn97/reddit_has_acquired_syllacrostic/), which Reddit acquired after successful featuring.

  * What is featuring?
  * How to get featured
  * Ways we highlight developers
  * Featuring tiers
  * Featuring requirements
  * Featuring considerations
  * Celebrating your app

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/http-fetch.md

# http-fetch

Source: https://developers.reddit.com/docs/capabilities/server/http-fetch

On this page

Make requests to allow-listed external domains.

Your Devvit app can make network requests to access allow-listed external domains using HTTP Fetch. This enables your app to leverage webhooks, personal servers, and other third-party integrations asynchronously across the network.

## Enabling HTTP fetch calls​

  * Devvit Web
  * Devvit Blocks / Mod Tools

devvit.json
    
    
    {  
      ...  
      "permissions": {  
        "http": {  
          "enable": true,  
          "domains": ["my-site.com", "another-domain.net"]  
        }  
      }  
    }  
    
    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({  
      http: {  
        domains: ['my-site.com', 'another-domain.net'],  
      },  
    });  
      
    

### Requesting a domain to be allow-listed​

Apps may request a domain to be added to the allow-list by specifying `domains` in the `http` configuration. This configuration is optional, and apps can still configure `http: true` as before.

Requested domains will be submitted for review when you playtest or upload your app. Admins may approve or deny domain requests.

Domain entries must be exact hostnames only, such as nytimes.com or wikipedia.org. These fetch requests are not allowed:

  * Be specific. No using `*.example.com` when you need `api.example.com`
  * No wildcards: `*.example.com`
  * No protocols: `https://api.example.com`
  * No paths: `api.example.com/webhooks`

Domains that are approved for your app will be displayed in the Developer Settings section for your app at `https://developers.reddit.com/apps/{your-app-slug}/developer-settings`. These domains are allow-listed for **your app only** and not globally.

Apps must request each individual domain that it intends to fetch, even if the domain is already globally allowed. See the global fetch allowlist to view the list of globally allowed domains.

## Limitations​

  * Access is only allowed to https URIs.
  * Supported HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` and `PATCH`.
  * HTTP timeout limit is 30 seconds.

## Example usage​

  * Devvit Web
  * Devvit Blocks / Mod Tools

Devvit Web applications have two different contexts for using fetch:

### Server-side fetch​

Server-side fetch allows your app to make HTTP requests to allowlisted external domains from your server-side code (e.g., API routes, server actions):

server/index.ts
    
    
      const response = await fetch('https://example.com/api/data', {  
        method: 'GET',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
      });  
        
      const data = await response.json();  
      console.log('External API response:', data);  
    

### Client-side fetch​

Client-side fetch has different restrictions and can only make requests to your own webview domain:

**Client-side restrictions:**

  * **Domain limitation** : Can only make requests to your own webview domain
  * **Endpoint requirement** : All requests must target endpoints that end with `/api`
  * **Authentication** : Handled automatically - no need to manage auth tokens
  * **No external domains** : Cannot make requests to external domains from client-side code

client/index.ts
    
    
      const handleFetchData = async () => {  
        // ✅ Correct: Fetching your own webview's API endpoint  
        const response = await fetch('/api/user-data', {  
          method: 'GET',  
          headers: {  
            'Content-Type': 'application/json',  
          },  
        });  
          
        const data = await response.json();  
        console.log('API response:', data);  
      };  
        
      // ❌ Incorrect: Cannot fetch external domains from client-side  
      // const response = await fetch('https://external-api.com/data');  
        
      // ❌ Incorrect: Endpoint must end with /api  
      // const response = await fetch('/user-data');  
    

For Devvit Blocks and Mod Tools, fetch is available within menu actions, triggers, and other server-side contexts:
    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({  
      http: {  
        domains: ['example.com'],  
      },  
    });  
      
    Devvit.addMenuItem({  
      location: 'comment',  
      label: 'Sample HTTP request',  
      onPress: async (_event, context) => {  
        console.log(`Comment ID: ${context.commentId}`);  
        const response = await fetch('https://example.com', {  
          method: 'post',  
          headers: {  
            'Content-Type': 'application/json',  
          },  
          body: JSON.stringify({ content: context.commentId }),  
        });  
        context.ui.showToast(  
          `Invoked HTTP request on comment: ${context.commentId}. Completed with status: ${response.status}`  
        );  
      },  
    });  
      
    export default Devvit;  
    

## Troubleshooting​

If you see the following error, it means HTTP Fetch requests are hitting the internal timeout limits. To resolve this:

  * Use a queue or kick off an async request in your back end. You can use [Scheduler](/docs/capabilities/server/scheduler) to monitor the result.
  * Optimize the overall HTTP request latency if you have a self-hosted server.

    
    
    HTTP request to domain: <domain> timed out with error: context deadline exceeded.  
    

### Terms and conditions​

Any app that uses `fetch` must upload Terms and Conditions and a Privacy Policy. Links to each of these documents must be saved in the app details form.

![App configuration form](/docs/assets/images/http-fetch-legal-links-97dc597d119c9e2606ff96ffe35ee974.png)

## Global fetch allowlist​

The following domains are globally allowed and can be fetched by any app:

  * example.com
  * site.api.espn.com
  * cdn.espn.com
  * discord.com
  * api.polygon.io
  * api.massive.com
  * polygon.io
  * slack.com
  * lichess.org
  * api.telegram.org
  * commentanalyzer.googleapis.com
  * language.googleapis.com
  * statsapi.mlb.com
  * api.openai.com
  * api.scryfall.com
  * api.nasa.gov
  * api.sportradar.us
  * api.sportradar.com
  * random.org
  * generativelanguage.googleapis.com
  * youtube.googleapis.com
  * api.weather.gov
  * wikipedia.org
  * finance.yahoo.com
  * api.twitter.com
  * api.petfinder.com
  * fonts.googleapis.com
  * nytimes.com
  * npr.org
  * propublica.org
  * pbs.org
  * i.giphy.com
  * chessboardjs.com

  * Enabling HTTP fetch calls
    * Requesting a domain to be allow-listed
  * Limitations
  * Example usage
    * Server-side fetch
    * Client-side fetch
  * Troubleshooting
    * Terms and conditions
  * Global fetch allowlist

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/intro-games.md

# intro-games

Source: https://developers.reddit.com/docs/introduction/intro-games

On this page

Unleash your creativity and build engaging games inside Reddit communities with Devvit's powerful platform. [Earn money](https://support.reddithelp.com/hc/en-us/articles/27958169342996-Reddit-Developer-Funds-2025-Terms) as players engage with your games.

Devvit is Reddit’s developer platform for building interactive, cross-platform games and apps that run natively on Reddit.

[Devvit Web](/docs/capabilities/devvit-web/devvit_web_overview) lets you build Devvit apps using standard web technologies—like React, Three.js, or Phaser—so you can use familiar tools and frameworks to create games for Reddit. It supports a traditional client/server split, and makes it easy to bring modern web games to Reddit using the tools you already know.

## Why build games on Reddit?​

Reddit is home to millions of communities, each with its own culture and interests. With Devvit, you can create games that:

  * Earn money through Reddit Gold payments and [Reddit Developer Funds](/docs/earn-money/reddit_developer_funds)
  * Reach Reddit’s massive audience
  * Free hosting through our platform

## Ready to get started?​

[![Quickstart](/docs/assets/images/SpotIllustration_Rocket-73c293fe486df84fe3d030458573dc09.webp)Quickstart](/docs/quickstart/)## [Showcase![Showcase](/docs/assets/images/SpotIllustration_Color_PartyHorn-23d7917eb3ec2984d3587e7c00091e28.webp)](/docs/examples/app-showcase)

* * *

## Community​

Have questions or want to share your game? Join [r/devvit](https://www.reddit.com/r/devvit/) or our [Discord](https://developers.reddit.com/discord) to connect with other game developers, get feedback, and show off your creations.

  * Why build games on Reddit?
  * Ready to get started?
  * Community

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/intro-mod-tools.md

# intro-mod-tools

Source: https://developers.reddit.com/docs/introduction/intro-mod-tools

On this page

Empower your community and streamline moderation with custom tools built on Devvit’s powerful platform.

Devvit is Reddit’s developer platform for building interactive, cross-platform tools and apps that run natively on Reddit.

## Why build mod tools on Reddit?​

Moderators can install an app on their subreddits to customize a community with bespoke mod tools, discussion bots, new governance tools, leaderboards, and more.

  * Automate repetitive moderation tasks
  * Improve community safety and engagement
  * Streamline mod workflows

## Get started​

[![Quickstart](/docs/assets/images/SpotIllustration_Rocket-73c293fe486df84fe3d030458573dc09.webp)Quickstart](/docs/quickstart/)## [Mod Resources![Three Strikes Tutorial](/docs/assets/images/SnooToolboxClipboard-cbf02e2b0d9b60614241984388bd6e77.webp)](/docs/guides/best-practices/mod_resources)

* * *

## Community​

Have questions or want to share your tool? Join [r/devvit](https://www.reddit.com/r/devvit/) or our [Discord](https://developers.reddit.com/discord) to connect with other developers, get feedback, and show off your creations.

  * Why build mod tools on Reddit?
  * Get started
  * Community

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/launch-guide.md

# launch-guide

Source: https://developers.reddit.com/docs/guides/launch/launch-guide

On this page

Once your app is ready, you can launch it to users and moderators across Reddit. This guide outlines what “launch-ready” means and the steps you need to take to submit your app for review.

Polished apps may also apply for **Reddit featuring** , which includes on-platform promotion and distribution support. Make sure to read [this guide](https://developers.reddit.com/docs/guides/launch/feature-guide) before submitting your app.

* * *

warning

Our team pauses all app reviews during the December holidays. Please see community announcements in [r/Devvit](https://www.reddit.com/r/Devvit/comments/1pnf6r6/reminder_limited_support_hours_december_23rd/) and Discord for specific limited support dates

## When is an app ready to be launched?​

Apps should be polished and stable before launch. Ensure your data schema is scalable and your UIs are clean and accessible, as **quality and performance directly impact organic distribution and adoption**.

Before submitting your app for review, be sure to:

  * Test all functionality across mobile and web.
  * Test from multiple accounts (developer, moderator, regular user), since permissions differ.
  * Have a stable prototype with clear UX flows.

We also recommend getting feedback from the community:

  * **All apps:**
    * [Cross-post](https://support.reddithelp.com/hc/en-us/articles/4835584113684-What-is-Crossposting) your post to r/Devvit using the **Feedback Friday** flair.
    * Share your app in the **#sharing** channel in the Reddit Devs Discord.
  * **Games:**
    * Cross-post gameplay posts to r/GamesOnReddit with the **Feedback** flair.
  * **Mod Apps:**
    * Share your app in the **#mod-discussion** Discord channel for moderator-specific feedback.

If your app is a **game** , ensure the experience:

  * Works across platforms with responsive design.
  * Includes a custom launch or first screen.
  * Avoids inline scrolling (scrolling inside inline webviews is prohibited).
  * Has a dedicated, non-test subreddit (e.g., [r/Pixelary](https://www.reddit.com/r/Pixelary/)).
  * Is immediately understandable to new users.

Launching your app signals to Reddit’s algorithmic feeds that it is ready for broader distribution. Engagement — clicks, dwell time, and voting — determines your organic reach.

* * *

## How to launch an app​

Apps are submitted for review through the CLI. To launch your app:

  1. Add a user-friendly overview in your app’s `README.md`.
  2. Run `npx devvit upload` for the version you want to launch.
  3. Run `npx devvit publish`.

Once submitted, your app enters Reddit’s review queue. Our team evaluates your code, example posts, and app documentation.

You will receive email confirmation when your app is approved. If we need more information, a team member may contact you via Modmail or Reddit chat.

Because you must run `npx devvit publish` for **every version** you want to launch, we recommend batching updates into weekly (or less frequent) releases.

Review times vary. We aim to review most apps — especially version updates — within **1–2 business days**. New apps, apps with policy ambiguity, or apps using higher-risk features (e.g., payments, fetch) may require more time.  
If you haven’t heard from us after a week, please reach out in Discord or via r/Devvit Modmail.

Ensuring your app complies with all [Devvit Rules](https://developers.reddit.com/docs/devvit_rules) will streamline review.

**By default, published apps are unlisted** , meaning other communities cannot install them. This is ideal for games and community-specific tools.

* * *

## How to list your app for any community to install​

If your app is a general-purpose moderation tool, community utility, or otherwise broadly applicable, you can request to list it in the [App Directory](https://developers.reddit.com/apps). Listing makes your app installable by any moderator.

Publicly listed apps must include a detailed `README.md` with:

  * A comprehensive app overview.
  * Installer-facing instructions.
  * Changelogs for major updates.

To list your app:

  1. Run `npx devvit publish --listed`
  2. Once approved, it will appear in the Apps Directory for any community to install.

We do not recommend listing apps built for a single subreddit, as this may confuse moderators and clutter the directory.

* * *

## Resources​

  * Questions? Join our Discord or post in [r/Devvit](https://www.reddit.com/r/Devvit/).
  * Review the [Devvit Rules](https://developers.reddit.com/docs/devvit_rules) before publishing.
  * Learn more about [how to earn](/docs/earn-money/payments/payments_overview) from your apps.

  * When is an app ready to be launched?
  * How to launch an app
  * How to list your app for any community to install
  * Resources

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/launch_screen_customization.md

# launch_screen_customization

Source: https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/launch_screen_customization

On this page

## Creating Your Launch (Preview) Screen​

Create an HTML file that serves as your app's launch screen in inline mode. This is what users see immediately when they encounter your post. Templates include a performant and compliant preview screen.

preview.html
    
    
    <html>  
      <head>  
        <meta charset="UTF-8" />  
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
        <title>My Game</title>  
        <script src="preview.js"></script>  
      </head>  
      <body>  
        <div class="preview-container">  
          <h1>Adventure Game</h1>  
          <p>Tap to play in fullscreen</p>  
          <button id="play-button">Play Now</button>  
        </div>  
      </body>  
    </html>  
    

preview.js
    
    
    import { requestExpandedMode } from '@devvit/web/client';  
      
    document.addEventListener('DOMContentLoaded', () => {  
      const playButton = document.getElementById('play-button');  
      
      playButton.addEventListener('click', async (event) => {  
        try {  
          await requestExpandedMode(event, 'game');  
        } catch (error) {  
          console.error('Failed to enter expanded mode:', error);  
        }  
      });  
    });  
    

## API Reference​

### requestExpandedMode()​

Requests expanded mode for the web view. This displays the web view in a larger modal presentation on web and full screen on mobile.
    
    
    import { requestExpandedMode } from '@devvit/web/client';  
      
    // Must be called from a trusted event (click, touch, etc.)  
    await requestExpandedMode(event, 'game');  
    

**Parameters**

  * `event` (PointerEvent): The gesture that triggered the request, must be a trusted event
  * `entry` (string): The destination URI name (e.g., `splash` or `game`). Entry names are the `devvit.json post.entrypoints` keys

### getWebViewMode()​

Get the current web view mode state.
    
    
    import { getWebViewMode } from '@devvit/web/client';  
      
    const currentMode = getWebViewMode(); // Returns 'inline' | 'expanded'  
      
    if (currentMode === 'expanded') {  
      // Show expanded UI  
    } else {  
      // Show inline UI  
    }  
    

### Mode Change Events​

Listen for mode changes to update your UI.
    
    
    import { addWebViewModeListener, removeWebViewModeListener } from '@devvit/web/client';  
      
    function useWebViewMode() {  
      const [mode, setMode] = useState(getWebViewMode());  
      
      useEffect(() => {  
        const handleModeChange = (newMode: 'inline' | 'expanded') => {  
          setMode(newMode);  
        };  
      
        addWebViewModeListener(handleModeChange);  
        return () => removeWebViewModeListener(handleModeChange);  
      }, []);  
      
      return mode;  
    }  
    

## Complete Example​

game.tsx
    
    
    import React, { useState, useEffect } from 'react';  
    import {  
      getWebViewMode,  
      requestExpandedMode,  
      exitExpandedMode,  
      addWebViewModeListener,  
      removeWebViewModeListener,  
    } from '@devvit/web/client';  
      
    export function GameApp() {  
      const [mode, setMode] = useState(getWebViewMode());  
      const [gameStarted, setGameStarted] = useState(false);  
      
      useEffect(() => {  
        const handleModeChange = (newMode: 'inline' | 'expanded') => {  
          setMode(newMode);  
      
          // Pause game when exiting expanded mode  
          if (newMode === 'inline' && gameStarted) {  
            pauseGame();  
          }  
        };  
      
        addWebViewModeListener(handleModeChange);  
        return () => removeWebViewModeListener(handleModeChange);  
      }, [gameStarted]);  
      
      const handlePlayClick = async (event: React.MouseEvent) => {  
        try {  
          await requestExpandedMode(event.nativeEvent, 'game');  
          setGameStarted(true);  
        } catch (error) {  
          console.error('Could not enter expanded mode:', error);  
          // Fallback: start game inline  
          setGameStarted(true);  
        }  
      };  
      
      const handleExitClick = async (event: React.MouseEvent) => {  
        try {  
          await exitExpandedMode(event.nativeEvent);  
        } catch (error) {  
          console.error('Could not exit expanded mode:', error);  
        }  
      };  
      
      if (mode === 'inline') {  
        return (  
          <div className="inline-view">  
            <h2>Adventure Game</h2>  
            <p>Tap to play in fullscreen</p>  
            <button onClick={handlePlayClick} className="play-button">  
              Play Now  
            </button>  
          </div>  
        );  
      }  
      
      return (  
        <div className="expanded-view">  
          <button onClick={handleExitClick} className="exit-button">  
            Exit  
          </button>  
          <GameCanvas />  
        </div>  
      );  
    }  
    

  * Creating Your Launch (Preview) Screen
  * API Reference
    * requestExpandedMode()
    * getWebViewMode()
    * Mode Change Events
  * Complete Example

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/media-uploads.md

# media-uploads

Source: https://developers.reddit.com/docs/capabilities/server/media-uploads

On this page

warning

Apps can only display images hosted on Reddit

You can upload images to Reddit at runtime using the `media` capability. This is different than static images, which are part of your [assets](/docs/capabilities/blocks/app_image_assets).

Runtime images are useful for embedding images in RTJSON (Posts and Comments) as well as displaying them within an interactive post app.

## Enabling media uploads​

Enable the `media` permission in your `devvit.json` file.

devvit.json
    
    
    {  
      "permissions": {  
        "media": true  
      }  
    }  
    

## Using media uploads​

On the server, you can pass the URL of any remotely hosted image (even if its not hosted on Reddit) to the `media.upload` function. The media function will return a Reddit URL.

  * Devvit Web
  * Devvit Blocks / Mod Tools

server/index.ts
    
    
    import { media } from '@devvit/media';  
    function submitImage() {  
      const response = await media.upload({  
        url: 'https://media2.giphy.com/media/xTiN0CNHgoRf1Ha7CM/giphy.gif',  
        type: 'gif',  
      });  
    }  
    
    
    
    import { Devvit } from '@devvit/public-api';  
      
    const response = await media.upload({  
      url: 'https://media2.giphy.com/media/xTiN0CNHgoRf1Ha7CM/giphy.gif',  
      type: 'gif',  
    });  
    

## Limitations​

Supported file types are:

  * GIF
  * PNG
  * JPEG

Maximum size is 20 MB.

  * Enabling media uploads
  * Using media uploads
  * Limitations

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/menu-actions.md

# menu-actions

Source: https://developers.reddit.com/docs/capabilities/client/menu-actions

On this page

Add an item to the three dot menu for posts, comments, or subreddits. Menu actions can perform immediate client effects or trigger server processing followed by client effects.

![Subreddit menu actions](/docs/assets/images/menu-actions-subreddit-3e97829e4e0f6703a0d3b161319b8fc2.png)

## Basic Menu Actions​

**For most menu actions, use direct client effects.** These provide immediate responses and are perfect for simple actions that don't require server processing.

  * Devvit Web
  * Devvit Blocks / Mod Tools

**Menu items defined in devvit.json:**

devvit.json
    
    
    {  
      "menu": {  
        "items": [  
          {  
            "description": "Show user information",  
            "endpoint": "/internal/menu/show-info",  
            "location": "post"  
          }  
        ]  
      }  
    }  
    

**Simple endpoint with direct client effects:**

server/index.ts
    
    
    router.post("/internal/menu/show-info", async (_req, res) => {  
      // Simple actions don't need server processing  
      res.json({  
        showToast: 'Menu action clicked!'  
      });  
    });  
    
    
    
    import { Devvit } from '@devvit/public-api';  
      
    // Simple menu action with direct client effects  
    Devvit.addMenuItem({  
      label: 'Show user info',  
      location: 'post', // 'post', 'comment', 'subreddit', or array  
      onPress: async (event, context) => {  
        // Direct client effect - no server processing needed    
        context.ui.showToast('Menu action clicked!');  
      },  
    });  
      
    // Menu action with form  
    const surveyForm = Devvit.createForm(  
      {  
        fields: [  
          {  
            type: 'string',  
            name: 'feedback',  
            label: 'Your feedback',  
          },  
        ],  
      },  
      (event, context) => {  
        // onSubmit handler  
        context.ui.showToast({ text: `Thanks for the feedback: ${event.values.feedback}` });  
      }  
    );  
      
    Devvit.addMenuItem({  
      label: 'Quick survey',  
      location: 'subreddit',  
      forUserType: 'moderator', // Optional: restrict to moderators  
      onPress: async (event, context) => {  
        context.ui.showForm(surveyForm);  
      },  
    });  
    

## Supported Contexts​

You can decide where the menu action shows up by specifying the location property.

Property| Values| Description| location (required)| `comment`, `post`, `subreddit`| Determines where the menu action appears.| postFilter (optional)| `currentApp`| Shows the action created by your app. The default is no filtering.| forUserType (optional)| `moderator`| Specifies the user types that can see the menu action. The default is everyone.  
---|---|---  
  
note

For moderator permission security, when opening a form from a menu action with `forUserType: moderator`, the user initiating the action must complete all actions within 10 minutes.

## Menu responses​

In Devvit Web, your menu item should respond with a client side effect to give feedback to users. This is available as a UIResponse as you do not have access to the `@devvit/web/client` library from your server endpoints.

  * Devvit Web
  * Devvit Blocks / Mod Tools

**Menu items with server processing:**

devvit.json
    
    
    {  
      "menu": {  
        "items": [  
          {  
            "label": "Process and validate data",  
            "endpoint": "/internal/menu/complex-action",  
            "forUserType": "moderator",  
            "location": "subreddit"  
          }  
        ]  
      }  
    }  
    

server/index.ts
    
    
    import { UIResponse } from '@devvit/web/shared';  
      
    router.post("/internal/menu/complex-action", async (_req, res: Response<UIResponse>) => {  
      try {  
        // Perform server-side processing  
        const userData = await validateAndProcessData();  
          
        // Show form with server-fetched data  
        res.json({  
          showForm: {  
            name: 'processForm',  
            form: {  
              fields: [  
                {  
                  type: 'string',  
                  name: 'processedData',  
                  label: 'Processed Data',  
                },  
              ],  
            },  
            data: { processedData: userData.processed }  
          }  
        });  
      } catch (error) {  
        res.json({  
          showToast: 'Processing failed. Please try again.'  
        });  
      }  
    });  
    

For Devvit Blocks, use the direct context approach even for complex workflows:
    
    
    Devvit.addMenuItem({  
      label: 'Process and validate data',  
      location: 'post', // 'post', 'comment', 'subreddit', or array  
      forUserType: 'moderator', // Optional: restrict to moderators  
      onPress: async (event, context) => {  
        try {  
          // Perform server-side processing  
          const userData = await validateAndProcessData();  
            
          // Show form with server-fetched data  
          const result = await context.ui.showForm({  
            fields: [  
              {  
                type: 'string',  
                name: 'processedData',  
                label: 'Processed Data',  
              },  
            ],  
          }, (values) => {  
            context.ui.showToast(`Processed: ${values.processedData}`);  
          });  
        } catch (error) {  
          context.ui.showToast('Processing failed. Please try again.');  
        }  
      },  
    });  
    

### Menu response examples​

Menu responses can trigger any client effect after server processing:

**Show toast after processing:**
    
    
    res.json({  
      showToast: {  
        text: 'Processing completed!',  
        appearance: 'success'  
      }  
    });  
    

**Navigate after data fetching:**
    
    
    const post = await reddit.getPostById(postId);  
    res.json({  
      navigateTo: post  
    });  
    

**Chain multiple forms:**
    
    
      
      
    // First form response leads to second form  
    res.json({  
      showForm: {  
        name: 'secondForm',  
        form: { fields: [...] },  
        data: { fromStep1: processedData }  
      }  
    });  
    

## Limitations​

  * A sort order of actions in the context menu can't be specified.
  * The context, name, and description fields do not support dynamic logic.

  * Basic Menu Actions
  * Supported Contexts
  * Menu responses
    * Menu response examples
  * Limitations

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/navigation.md

# navigation

Source: https://developers.reddit.com/docs/capabilities/client/navigation

On this page

Use navigation functions to redirect users to Reddit content or external websites in response to user actions, such as button clicks. You can redirect to a `url` string or to objects such as [`Subreddit`](/docs/api/redditapi/models/classes/Subreddit), [`Post`](/docs/api/redditapi/models/classes/Post), or [`Comment`](/docs/api/redditapi/models/classes/Comment).

**For most navigation interactions, use the direct client library functions.** These provide immediate navigation and are perfect for user interactions within your app components.

warning

When linking to Reddit content, the navigation function requires the app account to have access to the content. If the app account does not have access, the redirect will fail.

## Basic navigation​

  * Devvit Web
  * Devvit Blocks / Mod Tools

client/index.ts
    
    
    import { navigateTo } from '@devvit/web/client';  
      
    // Navigate to external URLs  
    navigateTo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');  
      
    // Navigate to Reddit URLs  
    navigateTo('https://www.reddit.com/r/movies/comments/tzxev3/');  
      
    // Navigate to Reddit objects  
    async function goToPost() {  
      const post = await fetch('/api/getPost').then(r => r.json());  
      navigateTo(post);  
    }  
      
    // Use in button handlers or user interactions  
    function handleNavigateClick() {  
      navigateTo('https://www.reddit.com/r/webdev');  
    }  
    

### Parameters​

**`navigateTo(target)`**

  * `target`: Either a URL string or a Reddit object (Subreddit, Post, Comment)

    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({ redditAPI: true });  
      
    // Navigate to URL  
    Devvit.addMenuItem({  
      label: 'Navigate to url',  
      location: 'subreddit',  
      onPress: async (_event, context) => {  
        const url = 'https://www.reddit.com/r/movies/comments/tzxev3/';  
        context.ui.navigateTo(url);  
      },  
    });  
      
    // Navigate to subreddit  
    Devvit.addMenuItem({  
      label: 'Navigate to subreddit',  
      location: 'subreddit',  
      onPress: async (_event, context) => {  
        const subredditId = 't5_2qh1o';  
        const subreddit = await context.reddit.getSubredditById(subredditId);  
        context.ui.navigateTo(subreddit);  
      },  
    });  
      
    // Navigate to post  
    Devvit.addMenuItem({  
      label: 'Navigate to post',  
      location: 'subreddit',  
      onPress: async (_event, context) => {  
        const postId = 't3_tzxev3';  
        const post = await context.reddit.getPostById(postId);  
        context.ui.navigateTo(post);  
      },  
    });  
      
    // Navigate to comment  
    Devvit.addMenuItem({  
      label: 'Navigate to comment',  
      location: 'subreddit',  
      onPress: async (_event, context) => {  
        const commentId = 't1_i426ob1';  
        const comment = await context.reddit.getCommentById(commentId);  
        context.ui.navigateTo(comment);  
      },  
    });  
      
    // Interactive post with navigation  
    Devvit.addCustomPostType({  
      name: 'Navigation Post',  
      render: (context) => {  
        return (  
          <vstack height="100%" alignment="middle center">  
            <button  
              onPress={async () => {  
                const postId = 't3_tzxev3';  
                const post = await context.reddit.getPostById(postId);  
                context.ui.navigateTo(post);  
              }}  
            >  
              Navigate to post  
            </button>  
          </vstack>  
        );  
      },  
    });  
      
    // Menu action to create interactive post  
    Devvit.addMenuItem({  
      label: 'Add navigation post',  
      location: 'subreddit',  
      onPress: async (_event, context) => {  
        const subreddit = await context.reddit.getCurrentSubreddit();  
        await context.reddit.submitPost({  
          title: 'Navigate to post',  
          subredditName: subreddit.name,  
          preview: (  
            <vstack height="100%" width="100%" alignment="middle center">  
              <text>Loading ...</text>  
            </vstack>  
          ),  
        });  
        context.ui.showToast('Created post!');  
      },  
    });  
    

### Parameters​

**`context.ui.navigateTo(target)`**

  * `target`: Either a URL string or a Reddit object (Subreddit, Post, Comment)

Menu response navigation

For navigation in menu response workflows (when you need server processing before navigation), see the [Menu Actions](/docs/capabilities/client/menu-actions) documentation.

## External URLs​

Users see a confirmation dialog before going to external URLs.

![Confirmation dialog for external links](/docs/assets/images/adding-links-external-link-dialog-d07bf90a429c0952019ece90d101ba17.png)

## Limitations​

  * `url` must be http/https
  * `url` must have a domain

  * Basic navigation
    * Parameters
    * Parameters
  * External URLs
  * Limitations

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/next.md

# next

Source: https://developers.reddit.com/docs/next

This is unreleased documentation for Reddit for Developers **Next** version.

For up-to-date documentation, see the **[latest version](/docs/)** (0.12).

Version: Next

Devvit allows you to build interactive games and apps that live on Reddit. Build experiences that can earn up to $167,000 per app with our [Reddit Developer Funds](https://support.reddithelp.com/hc/en-us/articles/27958169342996-Reddit-Developer-Funds-2025-Terms).

Build community games like [Hot and Cold](https://www.reddit.com/r/hotandcold/), [Sword and Supper](https://www.reddit.com/r/SwordAndSupper/), and [Honk](https://www.reddit.com/r/RedditGames/), or create [custom mod tools](https://www.reddit.com/r/ModSupport/comments/1k6szsj/devvit_apps_for_moderation_a_list/) to empower your community.

**More examples:** [App Showcase](/docs/next/examples/app-showcase)

**Questions?** Join [r/devvit](https://www.reddit.com/r/devvit/) or our [Discord](https://developers.reddit.com/discord).

[![Build Games](/docs/assets/images/SpotIllustration_Rocket-73c293fe486df84fe3d030458573dc09.webp)Build Games](/docs/next/introduction/intro-games)## [Create Mod Tools![Create Mod Tools](/docs/assets/images/SnooToolboxClipboard-cbf02e2b0d9b60614241984388bd6e77.webp)](/docs/next/introduction/intro-mod-tools)

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/overview.md

# overview

Source: https://developers.reddit.com/docs/capabilities/blocks/overview

On this page

warning

With the introduction of [inline webviews](/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points), Devvit Web is now the recommended approach for all interactive experiences that need in-feed interactions or pop-out views.

The Blocks documentation below remains to support developers maintaining existing apps built with Blocks.

Devvit Blocks is a framework that allows you to build apps with Reddit native components. Blocks is optimized for speed and ease of use, but is not recommended for games due to technical constraints and limitations.

warning

With the introduction of [0.12.2](/docs/changelog#devvit-0122-inline-mode-launch-screensexpanded-app-experiences-and-developer-logs), you can now render apps directly within the feed using Devvit Web. This makes Devvit Web the recommended path for all new projects.

## Examples​

### [r/WallStreetBets](https://www.reddit.com/r/wallstreetbets)​

Wall Street Bets's daily thread tracks stock performance and discussion on r/wallstreetbets. It's able to render in the feed quickly, and refresh automatically as new data is available.

## Available blocks​

We support the following elements:

### Containers​

  * **Blocks**
  * [**HStack**](/docs/blocks/stacks)
  * [**VStack**](/docs/blocks/stacks)
  * [**ZStack**](/docs/blocks/stacks)

### Objects​

  * [**Text**](/docs/blocks/text)
  * [**Button**](/docs/blocks/button)
  * [**Spacer**](/docs/blocks/spacer)
  * [**Image**](/docs/blocks/image)
  * [**Icon**](/docs/blocks/icon)

Further elements (components) may be derived from these blocks, and obey the same rules.

## Sizing​

### Paddings and gaps​

  * We're operating in a [border-box](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) model, where the padding is counted as part of the size of an element.
  * Padding is incompressible.
  * Gaps are implemented as if we're injecting spacers between all children.

### Units​

There are two supported units:

  * `px`: device-independent pixels
  * `%`: percent of parent container's available content area (i.e. subtracting the parent's padding and gaps)

### Intrinsic size​

All elements have an _intrinsic size_. This is the size that they would be if there were no sizing modifiers applied to them.

  * **HStack** : Sum of the intrinsic widths of the children × the max of the intrinsic heights of the children (+ gaps and padding)
  * **VStack** : Max of the intrinsic widths of the children × the sum of the intrinsic heights of the children (+ gaps and padding)
  * **ZStack** : Max of the intrinsic sizes of the children (+ padding)
  * **Text** : Size of the text without wrapping or truncation
  * **Button** : Size of the text without wrapping or truncation (+ padding)
  * **Spacer** : Size in pixels, as specified
  * **Image** : imageWidth × imageHeight

This size provides a baseline, which can be modified by attributes. There are a few sizing attributes:

  * `width` / `height`
  * `minWidth` / `minHeight`
  * `maxWidth` / `maxHeight`
  * `grow` (operates in the _current direction_).

note

Setting both `width` and `grow` simultaneously is not recommended, because then `grow` would become a no-op (overridden by `width`).

### Preferred size​

The preferred size is calculated based on the intrinsic size and the modifier attributes. The modifiers can conflict, in which case the precedence order is:

`(most important) minWidth > maxWidth > width > aspect-ratio > grow > intrinsic width (least important)`

Here, `grow` attempts to set `width="100%"`. Unlike actually setting `width="100%"`, `grow` can be flexibly adjusted later. Examples:

  * `<text width="50px" grow />` will always have a preferred size of 50px. (width overrides `grow`)
  * `<text minWidth="50px" grow />` will always take at least 50px, and will attempt to consume the available `width`.

### Adjusted size​

Grow elements are flexible. Whenever the full width (or height) of a parent element is not fully utilized, a grow element will expand to fit the parent element, assuming that the other constraints permit. Grow is prioritized lower than the other sizing attributes, e.g. an element will never grow beyond its maxWidth.

### Direction​

All elements inherit a direction for the purposes of growing. Things only grow in one direction at a time.

Element| Self Direction| Child Direction| Blocks| N/A| Vertical| [HStack](/docs/blocks/stacks)| Inherit| Horizontal| [VStack](/docs/blocks/stacks)| Inherit| Vertical| [ZStack](/docs/blocks/stacks)| Inherit| Inherit| [Text](/docs/blocks/text)| Horizontal| N/A| [Button](/docs/blocks/button)| Horizontal| N/A| [Spacer](/docs/blocks/spacer)| Inherit| N/A| [Image](/docs/blocks/image)| Inherit| N/A  
---|---|---  
  
### Overflow​

All containers clip overflown content.

  * Examples
    * r/WallStreetBets
  * Available blocks
    * Containers
    * Objects
  * Sizing
    * Paddings and gaps
    * Units
    * Intrinsic size
    * Preferred size
    * Adjusted size
    * Direction
    * Overflow

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_add.md

# payments_add

Source: https://developers.reddit.com/docs/earn-money/payments/payments_add

On this page

The Devvit payments API is available in Devvit Web. Keep reading to learn how to configure your products and accept payments.

note

Devvit Web is recommended for payments. Check out how to [migrate blocks apps](/docs/earn-money/payments/payments_migrate) if you're app is currently using a blocks version of payments.

To start with a template, select the payments template when you create a new project or run:
    
    
    devvit new  
    

To add payments functionality to an existing app, run:
    
    
    npm install @devvit/payments  
    

note

Make sure you’re on Devvit 0.11.3 or higher. See the [quickstart](https://developers.reddit.com/docs/next/quickstart) to get up and running.

## Implement Devvit Web payments​

### Configure devvit.json​

You can reference an external `products.json` file, or define products directly. Endpoints are required for fulfillment and optional for refunds.

devvit.json
    
    
    {  
      "payments": {  
        "productsFile": "./products.json",  
        // optionally define products here: "products": [...] instead  
        "endpoints": {  
          "fulfillOrder": "/internal/payments/fulfill",  
          "refundOrder": "/internal/payments/refund"  
        }  
      }  
    }  
    

### Server: fulfill (and optional refund)​

Create endpoints to fulfill and optionally revoke purchases.

server/index.ts
    
    
    import type { PaymentHandlerResponse } from '@devvit/web/server';  
      
    router.post('/internal/payments/fulfill', async (req, res) => {  
      // Fulfill the order (grant entitlements, record delivery, etc.)  
      res.json({ success: true } satisfies PaymentHandlerResponse);  
    });  
      
    router.post('/internal/payments/refund', async (req, res) => {  
      // Optionally revoke entitlements for a refunded order  
      res.json({ success: true } satisfies PaymentHandlerResponse);  
    });  
      
    export default router;  
    

### Server: Fetch products​

On the server, use `payments.getProducts()` and `payments.getOrders()`. If the client needs product metadata, expose it via your own `/api/` endpoint.

server/index.ts
    
    
    // Example: expose products for client display  
    import { payments } from '@devvit/web/server';  
      
    const products = await payments.getProducts();  
    res.json(products);  
    

### Client: trigger checkout​

Use `purchase()` from `@devvit/web/client` with a product SKU (or array of SKUs).

client/index.ts
    
    
    import { purchase, OrderResultStatus } from '@devvit/web/client';  
      
    export async function buy(sku: string) {  
      const result = await purchase(sku);  
      if (result.status === OrderResultStatus.STATUS_SUCCESS) {  
        // show success  
      } else {  
        // show error or retry (result.errorMessage may be set)  
      }  
    }  
    

## Register products​

Register products in the src/products.json file in your local app. To add products to your app, run the following command:
    
    
    devvit products add  
    

Registered products are updated every time an app is uploaded, including when you use [Devvit playtest](/docs/guides/tools/playtest).

Click here for instructions on how to add products manually to your products.json file.

The JSON schema for the file format is available at <https://developers.reddit.com/schema/products.json>. 

Each product in the products field has the following attributes:

**Attribute**| **Description**| `sku`| A product identifier that can be used to group orders or organize your products. Each sku must be unique for each product in your app.| `displayName`| The official name of the product that is displayed in purchase confirmation screens. The name must be fewer than 50 characters, including spaces.| `description`| A text string that describes the product and is displayed in purchase confirmation screens. The description must be fewer than 150 characters, including spaces.| `price`| An predefined integer that sets the product price in Reddit gold. See details below.| `image.icon`| **(optional)** The path to the icon that represents your product in your assets folder.| `metadata`| **(optional)** An optional object that contains additional attributes you want to use to group and filter products. Keys and values must be alphanumeric (a - Z, 0 - 9, and - ) and contain 30 characters or less. You can add up to 10 metadata keys. Metadata keys cannot start with "devvit-".| `accountingType`| Categories for how buyers consume your products. Possible values are: 

  * `INSTANT` for purchased items that are used immediately and disappear.
  * `DURABLE` for purchased items that are permanently applied to the account and can be used any number of times
  * `CONSUMABLE` for items that can be used at a later date but are removed once they are used.
  * `VALID_FOR_` values indicate a product can be used throughout a period of time after it is purchased.

  
---|---  
  
## Price products​

Product prices are predefined and must be one of the following gold values:

  * 5 gold ($0.10)
  * 25 gold ($0.50)
  * 50 gold ($1)
  * 100 gold ($2)
  * 150 gold ($3)
  * 250 gold ($5)
  * 500 gold ($10)
  * 1000 gold ($20)
  * 2500 gold ($50)

note

Actual payments will not be processed until your products are approved. While your app is under development, you can use sandbox payments to [simulate purchases](/docs/earn-money/payments/payments_test#simulate-purchases).

## Design guidelines​

You’ll need to clearly identify paid products or services. Here are some best practices to follow:

  * Use a short name, description, and image for each product.
  * Don’t overwhelm users with too many items.
  * Try to keep purchases in a consistent location or use a consistent visual pattern.
  * Only use the gold icon to indicate purchases for Reddit gold.

### Product image​

Product images need to meet the following requirements:

  * Minimum size: 256x256
  * Supported file type: .png

If you don’t provide an image, the default Reddit product image is used.

![default image](/docs/assets/images/default_product_image-550c52f2d1c20755f657435ba9db5362.png)

**Example**
    
    
    {  
      "$schema": "https://developers.reddit.com/schema/products.json",  
      "products": [  
        {  
          "sku": "god_mode",  
          "displayName": "God mode",  
          "description": "God mode gives you superpowers (in theory)",  
          "price": 25,  
          "images": {  
            "icon": "products/extra_life_icon.png"  
          },  
          "metadata": {  
            "category": "powerup"  
          },  
          "accountingType": "CONSUMABLE"  
        }  
      ]  
    }  
    

### Purchase buttons (required)​

#### Blocks​

The `ProductButton` is a Devvit blocks component designed to render a product with a purchase button. It can be customized to match your app's look and feel.

**Usage:**
    
    
    <ProductButton  
      showIcon  
      product={product}  
      onPress={(p) => payments.purchase(p.sku)}  
      appearance="tile"  
    />  
    

##### `ProductButtonProps`​

**Prop Name**| **Type**| **Description**| `product`| `Product`| The product object containing details such as `sku`, `price`, and `metadata`.| `onPress`| `(product: Product) => void`| Callback function triggered when the button is pressed.| `showIcon`| `boolean`| Determines whether the product icon is displayed on the button. Defaults to `false`.| `appearance`| `'compact'` | `'detailed'` | `'tile'`| Defines the visual style of the button. Defaults to `compact`.| `buttonAppearance`| `string`| Optional [button appearance](/docs/blocks/button#appearance).| `textColor`| `string`| Optional [text color](/docs/blocks/text#color).  
---|---|---  
  
#### Webviews​

Use Reddit’s primary, secondary, or bordered button component and gold icon in one of the following formats:

![default image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAAoCAYAAADjRnEsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABXkSURBVHgB7Z19cBTnfcd/z+nApDIgmdiR0NspSe3ExqC4+cOY2pxa8JA4OOA2NiZ+ESkgEqcFGpx27M5Imkk8Y4ODaOlYgF2f33HaMYyJA5jMIOzYuDNxgm1wY6cthwSSbIJ1Ainl5W6f/r7P7h53p7273bu908nZz8zDid1n9/ZuV9/n93yf3/NIUI5cOm9bMEbUJEjOJUFNJEUFb64gDxARgsJSyjCReMdH1D38ixXdNI7oPzkYlKQ18fWr+ytxb6V3f3NGUIS/v7Agfi5I8jPh666+vLKbxhcBLlUJr5OM4pEbZ7lEjDLAJWwUxwgnlSsWPVlxfji6mn9cQ55oO0MI/BJ3Tygr64jsWRamEuTo4GDFpCit1oRc44l2ERD4pZXdvjJfR3VlZZhKEwj19UYZoIuCg9ezRvHIDXy3ZgAcMAq2hbl0ky7wtrAl5BDwC8PRNqkLuEeeCCFCpSToEPBLosT3V3r3d6wQMlRigg5BCXLhXhm9xeUQORAWj5yBqAdJF/Uw2RT0rEL+mflbVwsp2smLwN1FRehax8i+lSEaQwZODa6OSdnuReAlAOw4TeuoveKzIRpbEH0HSRdwFC/qLj74fWwySjfpDWlaMgp5+bxtG70ovLAIH3WOvLpiLY0BfScHN3pReOnB406d0y+fNibPBLOAy5e4bCfdPvEYWyDoLVx+y2VPukqWQm5YKTuk3ip7FBgeGD00odzfHNm5rChdV91Kkd79LW0OnfeL5sbKymLZGbBSlpDejYdgeFF46YB7s4h0UQ+Rxb3xWR11YSS63/slLx5SUhMaTioSE6PSu7+lTxMaWyoeLaSL+E7yRLzUwP0we0hLrCqMEnJlp0jly3gUEQhr+c3bNlKBgZ1C5N3f8QCeib6Tpwr+TJBup5gi7lG64P7gPi1I3ZEk5OXzt7Z4nvjYITVa85l5Wwr2/R//+Pctnic+vpAk1vQNnCrkPUOjDk/cE/HxAWwv3K/rEzfGPfJJCx4L+GJl+0mKAHmMJZGJl/ob3fbL+wcHAzLGlopUaU0e44sI++WNBfDLzYG0EHmpheMJTMZq4dJJhg0Wj8h9sQlt+Yh4xaUTaeYXptFNs6rVzx45U3HhD9E2chktprXlI+JnzpyhDz/4gN7+1a/Uzx5FhQenNdefCdLHSXLODw8EAhU1NYGmqtpAED+TR7GAV4600KC5QUXkKhqP+o9SDkC071s8g773VzOoovyigP/rS4fph4+9RR65wVF5pVtROaJxLSpzur8Q7eeff55eeO65JAG/89vfpnXr1pFH8eCovNLFqDznaByifTaqrRZCrJEJ8w+EkJ39vT1jlTb5xwYyWWC5qahcReQqGs+BmV+8jN7suo0euOe6JBEH9902g95/dgk1VF1KHs45Pxx1zRdFNE45gAh86ZIltLWra1QUDmFfeMst1NfXRx7FYeJ5zU2vPEj6zEFHIl4TCDSdjcnfsGy3y5RJZFKKNVV1DUerWOnJo9DAUkGkrLxyw1rRguQQCPXuDd+ghs+lF2rse/+ZJfR9jtg9HLOaXEKQCJJDEIWvXLEio1BjH8T8eRZ1jyLgE649E6RPAe92UJ+q6wOrNR5noUwWHfZx76+6JuANqhce2GJKyAVWMdSI9ts9ElZK1/030cIbAqP29QwMq9d6iyj82Vc/pIee+TUdM+qMZ/AdTC2/hI59dCavOtngVrY531UTsYqhRtL2/UXk3d7WRt37Rx8yffp09Wol7gtvvZVWtrbG63yaOD00pF6nTJ1a8DrZ0Eg01+W/amKA9BS2LluV2Uo5F5NPcgS+aNROYazWZyXuQoaozNcxEA6H6VOGOSbAHy1S6DpZaOHS7dMcTAyBTQIrxUrEwYJ1P1PFirtuvlKP4B1YLS92zGN75o5R23Xb5g5aOCdAheBGHrA92LVYvccsHsBN5JHvXk9H2DLCPlhH+Fyp2Kljh5gL+d6ag94WBBpWipWIgy3btqlixa6XX6bWLBF8Ktu2dNH11zXR4cPvJW3v7e1R29v+6QEqBBDU79xzt3oPXEM6ent66K8X3Upf/mKjKjc3z6XjvK0QdexSppYWzpsA2VwuFTYJrBRLEVcXJJpVsUKKFuII3onVwlH/mqqahqMYRE29Dmyvrq3vpAIAQa2ua9ih3qM+fW9CXUdtw/6zUTmIUl3b8JvUz+dWHZtg4LOKgz4xy+4RmawURNzHPhpW5ccceVuBY7esm0t2mcIRbcPnJo/aPpX9eGyfWu5+dgwaiT0bblHnV++RkIEDgcb+5/Z+SK3rD3DAweLGvRNk6jipYxdBMkh5Y//+ZhJiRNyItlFaOfK2AscimrfLmdNDSrTPGJFqIth++vQQuc3BN36phHTv7lf0987wHt9i8T3CjUz7j36sCupDkE8nXK9bdewiNec2mQVIXwvbqpnJShEihGhbj7hFh2Ud3Wp5kmwiNfbdBQViwmIRN94uhS/37kwakHUTb6zwHlqGBeT4+xCCmoRPrEVBfWxLytpxq449wlwCfsH/SBu1EaVaifjQ8Hl6539O0UNPXxRvZKzcOLNaRbNTU1IRcR6I2mvv9JOb4LwLb2hQdsbr7/arhiURiOvMz0+joZFz9LM3j1m+Pz4fhBjZNmgkHuRB3Pg+7kngHK/zcWY2Dn5GxP3A3dfx+V5RnzVbHUcIn20RTgff24CdtYqRVmgl4pMnT6arrrpK2SYmyFh5++236QMeDE0dBMV5UP7sq18lN0FU+8TWLTTEwltXV0e333En1dbXx/dDoPfu3q32z75hDt2+5E7L8zy6/hG6esYM6vjRQ/Sde+9K+34/3f6CEtyN/7KZz7VUbTszdJqPf5j27P65On+mOj998QVavnKVrTqOKKO8nwnSM1ayduUhcDyCGUjdzgIU4YHNQ3wtcfGe5KfOs1ExVwjZJEevpBnEuQaOh7vJRRDBipi2WpIPf/TkGPkplGjj4D2F0L6p9hMdGOgNh9Kcqo3HkQ7x51qryfTLIlTVBVrwfUghlg306Ofi9+Bzy7azMdVjCWWqc+6Cnvttpw7ZR4/IJY2+UVZAmBPZ9WaYrr7rRZq++Gn62rpXVCRuAnHHNuyrWfQ0bd5xOOnYaz8/jdwEWTOIoq81Gg5EwPi/yUG2gyDQyLKBLbSb91kNwEZGztPsVS+phiiVaw2LJbEBwGd+lxuxmca+mTbqOELKvHNzBdnLHYf4JhJsbqZdr7xC3a+9puyURO8b4o5t2IeydOnSpGOR7eImEHFE0S9uf15FsRDH+X9x0Z549JGHVYQLMce2tX97n/q/FT+4/4f0b08/yz71lIzvuZfFGlw949r4tm/dqTcOB9/8ZdY6Rwy7yE4dR7iz3LAtIacU21UIsZP8orG/91gli3JzomjC48U27JvkF5UsjJuSjnV52Q9dxFX2TIvA5xHyXhGVcXuChZG7huhN+IKqVyDlk7Ay0pyuo783vFiTmb8T7iF/E69lWsKSsn6VvgnmZqsjfXojbKeOA5C9MglZK7YejCEWuUSEFLYG8iCOmTJb3OCum/+UxfIT1Xgsad9Hd3CBmELU4U/P/MJlKkKevWoHffnu7WofxD+1t4AGCOexwrRxej5KHqyN8DE4D2yYeuNzptbp4e/JrOMQt35pswJxTsXOwCWO6+t3t3eVyhNbu5TN8u87X6YnnnpGva5oXaWib4j8Tzi6RYS8d/8Bte8H9/+DEnWUVGbP+XNb7zlk2B4zEgR46hS9V3+8pzdtnbq6esd1HOLGM4Ec5KwLYwlfirBxqG1n4FIN3AnZQAVEREnlsPs00QwRhk8vufEou0AVupjLdlg//cfDX0EDY1g/qmeQei67PQWp/zlLOnEiHBfgSWaDaPRcrOrEvzMHdRwQF3JbIKpM5BtzGlTkm40tFhku7/3vKXITZMJArF9sn6+sDWTPIEMGwnzjrCpVB0IMewMFVgOENeBcWHMCXn+pcyXbJ4lgwNOO322V4ZJ6rnyBFQKW8wAlRBtR99+zWF/D4ni8V4/Kh06fVvtQTG/94JtvkJvkk20yHpFa8h8zYJtuUVVdfVa/u6qmflSGC8d9h8hFzPPFfHIHi3M7RSnAgtyuxDGq90IF92ixD0VcbACD5CJ5ZJu4CoTc1oXA64UwJoJoF5ZFOhD1pmZsQGTd8sfNXsIqHlSEJ460R1wPMk4g6sBcLsAcvESB8D+793dkZ2wglXQDrOidmNeTqY5D3HhIbJ0DnnZqVI5MlA0bNqQ9ZktXl6qTCKJ4p/74UJZBP3jL8Jjr2BM3bRRknEDQe3v1qBaWC35GgajffudSqmUvPVfq6vVjzYYCmFbIZMOWcauOQ9x4JlQUl60SIlX44UkbpWiprgukXZFRiaoQLUkbBYWd+uM+kbnnofxu9pj5esLwlmGjxCcjGYOzUqiB0wYU/nkqIvR4umQusAmBl8TsEkyQ0neJIVfr2Ef1rnzcbNl+MJ5JGUDMhpWgvfau/fS00zwwCVIzPswUxqFhfT986Nb1rynr5Oq7titRR48Bg61hI28dEXrrhgNJJbWXkQkMkIKFcxqSrgPX9rrRMJmvmeo4Ip+HzjyFsP+Lv3DhwtHHy/TN3bDFmitORLzWsBjeP5I8JnHwDT2SNq0MADGHbXLi5Cc8UKlnfjzOlss1RrR+w5w5tPGfNycVc3AxF665RrdC9hgeNzhyWL/OBV/7uqt1HBKm/LEl5Aopnhq9TUs7fi4srR/RTXaR+ufTZEqaZUyPpIXU4kIHMVde/fFjQmV+sICLqLambIIR/UuJAc5lKSVEOSKMXoC4cLG3EYvp3j83FDvdrOMANd7hY3fddpfHFLNEMk3wSfWKwXOv/o7ssvmlI+q16/65KrJHVgoibvxsRvawSPp23KMyQ/QBRRH3viPD5+LXvL1jnhJUZLeg7n89s4ScgN4I3g/HY6AU53rY6I08a3wm1Nn1xjFV50G2cKzqOELKY5QnrMO27y8GOFPJ5JNb7bNqDNIBITOjbOSMw9NGXnfbg3r++PJWPaNj7d/dRzWXX6YGORHZDg2dVtthucBewTlwnLkf50L9PT93liWE49E4AHjusFIe516H6bf/hK8T73WD4bO7VccRGuX9TJCR6WCnorRa3lb6wmkP8Fk0NJKeIptMmsDvpwIY0VZdV78RnjbyunmAUPUCpN/XidequkCIBy8lMkAQ2bINpFp9KXyHToTZXuFzcHS72tyvn6tBTq8LLCIH4HhzluolPgqpjB2fXI3r0v127g3gesv0WbJu1XGAEnK/JHlAENn6cKa9kjhI2POxLtameNVXTVapiHpeeXLE5tRWMdP4IJyJfjzOATsF4HpWcnS9ftVsZamY23CcmdeOwU/s321ksiASbzWOdwIGUrfydTz8vYt2kvlZTRDpC3GTspXS1bGPyNtX5F+AAzwIZOv+mvZKYkphtSHWyGrZsmUL9ff1qVRE5JVXpwi5U1sFAocoG3nWj7MQP25MzoHIdW7eHI/Y4YdjYBDZKCYY7DQjbpwD/rm5H+dFeuGCr99CTkADMJsje6QE4hz/wef9m3vvjmfA4Low2Gpel1Udc5uTOo7wSTe85jDp2Uy/zVYRlkh1XUMkaXEsQ6wTBCiAwUREu4Ij6qQ+HGyVXvu2CjxnFt5mUksuCxZQuYZFWp3Hx1ZKnzkoWEbsi4sGZKOwJ268ldzU33sspO8Xzbx9R3y/EBEhxdq+42FHEa9qQISAWHTi2tgCaY7FkKIYny0dLisTi08Y12VVRyBi5utxUscBAS4DjqfoI8L8/m0XU/cglD0DZ5SQJ2KmIyZmrEDMYIHkwkwjtRCNQTqv2cwKyXW/02t5779PqaycXOtkw40p+r0nB4M+B1P0H12/Xq2zYgJxhmCnpidaTdeHuLd3dFAuwDeGzw2xTCdwGMREHQjhlClT0+7PRSBxHGZdJuZ7myCKxntek5B5koqTOviMVtdvBxen6AeJ4qlzGamuDXRywHdxnRdEjroFEkyqaDVdH5OG2NKgHIBvHItyA+KncLpsGbUSI0elyB6xGng09+eyTIC+yqMchBefasmgESvzU0RF/2lwUmeC0vecBk7Rbd2jvK4/mbdtkGymNUGwE3O0nYD0QLcnAn1qESL8h33LG8kF2Fe2fX8h2FgsKxe2btvm+kSgYgGRRcT8n78+lFukXAxYPGuuuMyVZ4L5R9LXWrE3MchBMJCMaHZ7IlCxiH9uv2gs0fVizKWIO830w012j4TdkTrBxw6wFzwRt48gx15ZBqTt+wshTp3gYwdM2x+vIg4QKa9o/W7pijjwORg0zA6mHjfZqaiyV1Im+NhDdoxXEQeIlIUQnSW86FeQjMFvFZFXBJ+sOO+PDjo5Azzgu+dfabnSYSLwq7H2itVsSY/0TPT7GyN7loXJBY4ODlZMRBfRAViDfNeuXVkXwYKnDhHHtH2PwuKLisbq6sowuUPSHyawc4CeWijvpSx/aUplSmmio/9EuJM8CoUZjYe4ROJpROV/+XinFNLxesc3ZlgMCiIO/zxXj/iPFY4CQiP7lufkK6aj9/enOn3S+XrWqd54IhBx+OdWs0I9XIafiZrPVrr6TJC+lC1EvNvJQVazI03y9Hs97BMkXcz1lEZzqxGVHyV3pgB75Ap74xPLyprdisZNjKjcu7/jEfbGfTHR7GI0bmJG5SHSUxI9xgdJ0Tg2xKfoR7qXITzPLeXAwzUEaR1uizjA33qU6ZYa9ShpcN8KIOLAjMYxqcLeBCGPsQb3qYX0+xbv9SSttTLyixWdQuYyqOHhBmypbBrZtzJEBaL28spOTUjv/o4jNCk31V5RGaLCgUFP5JMvII/xAOaE4H4lpTRaTrUtn7dtv3R5cRmPzGDa7si+FV+hItB38hPv/o4HJB2queKyojwTpEd5iPCcThH3KB4QcczIHfVnrSxXP5wQ9S8W5O5qZR7pESS6J5T7m6lInPMLTIH17m8Jg/TT8yOiaM8Es510kfBsltID9wMiDm88ZFVBZDo610wWD/vodsryNTQG5JrJ4lFYYKfUXTFtTJ4J0i2WL1HCQJrHmGI2rrBT9qSrlFHIQfn8rS3cDW8jKQLk4SY8+Egd/8fjEjSGHP94sMVHsk2KzLnBHkWBnwnZUXv5tLHOv8ZEoSDpvTYUT9CLD6Lw643STfpYRlqyCrk644LHAr6Yv509u3vJI28QhU8oL2uP7FxWEr8g/f2DgViZ1s7X5d3fMQJReHTE197YWFkqoolufJD0dVnClJIl4VEw8L2jIYWAoxHtJjt/zYkcEBd0knO9CN0x+CXYNPFSf2epCHgqpqD7SMz1IvSiENGIBXzY11lCAp5KoqBDUMJGiRjF1qxQD0smGQX2ScB4RXnLKLa/W0dCnoixamKQTzELf+DX+CPO3mQTnQiWzUTWAZYJLuOWNd9VDIuNvmqiFuSB2FlSf8hQvPubOxE1dV2tDy8OxPiZcGEVw2IToIuCU2EUb2A0d84aBZOxwgmvjvl/QnDJNh83zTsAAAAASUVORK5CYII=)

Use a consistent and clear product component to display paid goods or services to your users. Product components can be customized to fit your app, like the examples below.

![default image](/docs/assets/images/payments_component_button-d663655b01d9c6346a5d8a13a8b9ca24.png)

![default image](/docs/assets/images/payments_component_list-d0c9426edcee85b69989aee16f368f87.png)

![default image](/docs/assets/images/payments_component_tile-f945f5cfa58496a33439b250f846e7fd.png)

## Complete the payment flow​

Use `addPaymentHandler` to specify the function that is called during the order flow. This customizes how your app fulfills product orders and provides the ability for you to reject an order.

Errors thrown within the payment handler automatically reject the order. To provide a custom error message to the frontend of your application, you can return {success: false, reason: } with a reason for the order rejection.

This example shows how to issue an "extra life" to a user when they purchase the "extra_life" product.
    
    
    import { type Context } from '@devvit/public-api';  
    import { addPaymentHandler } from '@devvit/payments';  
    import { Devvit, useState } from '@devvit/public-api';  
      
    Devvit.configure({  
      redis: true,  
      redditAPI: true,  
    });  
      
    const GOD_MODE_SKU = 'god_mode';  
      
    addPaymentHandler({  
      fulfillOrder: async (order, ctx) => {  
        if (!order.products.some(({ sku }) => sku === GOD_MODE_SKU)) {  
          throw new Error('Unable to fulfill order: sku not found');  
        }  
        if (order.status !== 'PAID') {  
          throw new Error('Becoming a god has a cost (in Reddit Gold)');  
        }  
      
        const redisKey = godModeRedisKey(ctx.postId, ctx.userId);  
        await ctx.redis.set(redisKey, 'true');  
      },  
    });  
    

## Implement payments​

The frontend and backend of your app coordinate order processing.

![Order workflow diagram](/docs/assets/images/payments_order_flow_diagram-87cf8d2e76dde9612ee794f9a95f4bcf.png)

To launch the payment flow, create a hook with `usePayments()` followed by `hook.purchase()` to initiate the purchase from the frontend.

This triggers a native payment flow on all platforms (web, iOS, Android) that works with the Reddit backend to process the order. The `fulfillOrder()` hook calls your app during this process.

Your app can acknowledge or reject the order. For example, for goods with limited quantities, your app may reject an order once the product is sold out.

### Get your product details​

Use the `useProducts` hook or `getProducts` function to fetch details about products.
    
    
    import { useProducts } from '@devvit/payments';  
      
    export function ProductsList(context: Devvit.Context): JSX.Element {  
      // Only query for products with the metadata "category" of value "powerup".  
      // The metadata field can be empty - if it is, useProducts will not filter on metadata.  
      const { products } = useProducts(context, {  
        metadata: {  
          category: 'powerup',  
        },  
      });  
      
      return (  
        <vstack>  
          {products.map((product) => (  
            <hstack>  
              <text>{product.name}</text>  
              <text>{product.price}</text>  
            </hstack>  
          ))}  
        </vstack>  
      );  
    }  
    

You can also fetch all products using custom-defined metadata or by an array of skus. Only one is required; if you provide both then they will be AND’d.
    
    
    import { getProducts } from '@devvit/payments';  
    const products = await getProducts({,  
    });  
    

### Initiate orders​

Provide the product sku to trigger a purchase. This automatically populates the most recently-approved product metadata for that product id.

**Example**
    
    
    import { usePayments } from '@devvit/payments';  
      
    // handles purchase results  
    const payments = usePayments((result: OnPurchaseResult) => { console.log('Tried to buy:', result.sku, '; result:', result.status); });  
      
    // for each sku in products:  
    <button onPress{payments.purchase(sku)}>Buy a {sku}</button>  
    

  * Implement Devvit Web payments
    * Configure devvit.json
    * Server: fulfill (and optional refund)
    * Server: Fetch products
    * Client: trigger checkout
  * Register products
  * Price products
  * Design guidelines
    * Product image
    * Purchase buttons (required)
  * Complete the payment flow
  * Implement payments
    * Get your product details
    * Initiate orders

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_manage.md

# payments_manage

Source: https://developers.reddit.com/docs/earn-money/payments/payments_manage

On this page

Once your app and products have been approved, you’re ready to use Reddit’s production payments system. Real payments will be triggered automatically when invoked from approved app versions. No code changes are required.

## Check orders​

Reddit keeps track of historical purchases and lets you query user purchases.

Orders are returned in reverse chronological order and can be filtered based on user, product, success state, or other attributes.

**Example**
    
    
    import { useOrders, OrderStatus } from '@devvit/payments';  
      
    export function CosmicSwordShop(context: Devvit.Context): JSX.Element {  
      const { orders } = useOrders(context, {  
        sku: 'cosmic_sword',  
      });  
      
      // if the user hasn’t already bought the cosmic sword  
      // then show them the purchase button  
      if (orders.length > 0) {  
        return <text>Purchased!</text>;  
      } else {  
        return <button onPress={/* Trigger purchase */}>Buy Cosmic Sword</button>;  
      }  
    }  
    

## Update products​

Once your app is in production, existing installations will need to be manually updated via the admin tool if you release a new version. Contact the Developer Platform team if you need to update your app installation versions.

Automatic updates will be supported in a future release.

## Issue a refund​

Reddit may reverse transactions under certain circumstances, such as card disputes, policy violations, or technical issues. If there’s a problem with a digital good, a user can submit a request for a refund via [Reddit Help](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=29770197409428).

When a transaction is reversed for any reason, you may optionally revoke product functionality from the user by adding a `refundOrder` handler.

**Example**
    
    
    addPaymentHandler({  
      fulfillOrder: async (order: Order, ctx: Context) => {  
        // Snip order fulfillment  
      },  
      refundOrder: async (order: Order, ctx: Context) => {  
        // check if the order contains an extra life  
        if (order.products.some(({ sku }) => sku === GOD_MODE_SKU)) {  
          // redis key for storing number of lives user has left  
          const livesKey = `${ctx.userId}:lives`;  
      
          // if so, decrement the number of lives  
          await ctx.redis.incrBy(livesKey, -1);  
        }  
      },  
    });  
    

## Payments help​

When you enable payments, a **Get Payments Help** menu item is automatically added to the three dot menu in your app. This connects the user to [Reddit Help](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=29770197409428) for assistance.

  * Check orders
  * Update products
  * Issue a refund
  * Payments help

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_migrate.md

# payments_migrate

Source: https://developers.reddit.com/docs/earn-money/payments/payments_migrate

If you already have payments set up on a Blocks app, use the following steps to migrate your payments functionality.

  1. Update devvit.json

Reference your `products.json` and declare endpoints.

devvit.json
    
    
    {  
      "permissions": { "payments": true },  
      "payments": {  
        "productsFile": "./products.json",  
        "endpoints": {  
          "fulfillOrder": "/internal/payments/fulfill",  
          "refundOrder": "/internal/payments/refund"  
        }  
      }  
    }  
      
    

  2. Replace payment hooks with endpoints

  * Blocks: `addPaymentHandler({ fulfillOrder, refundOrder })`
  * Devvit Web: implement `/internal/payments/fulfill` and `/internal/payments/refund`

    
    
    import type { PaymentHandlerResponse } from '@devvit/web/server';  
      
    router.post('/internal/payments/fulfill', async (req, res) => {  
      // migrate your old fulfillOrder logic here  
      res.json({ success: true } satisfies PaymentHandlerResponse);  
    });  
    

  3. Update client purchase calls

  * Blocks: `usePayments().purchase(sku)`
  * Devvit Web: `purchase(sku)` from`@devvit/web/client`

  4. Update products and orders APIs

  * Blocks: `useProducts`, `useOrders`
  * Devvit Web: server‑side `payments.getProducts()`, `payments.getOrders()`; expose via `/api/` if needed by the client

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_overview.md

# payments_overview

Source: https://developers.reddit.com/docs/next/earn-money/payments/payments_overview

This is unreleased documentation for Reddit for Developers **Next** version.

For up-to-date documentation, see the **[latest version](/docs/earn-money/payments/payments_overview)** (0.12).

Version: Next

On this page

Add products to your app and get paid for what you sell. The payments plugin lets you prompt users to buy premium features that you build into your app, like in-game items, additional lives, or exclusive features into your app.

![Sample payment app screen](/docs/assets/images/payments_example-1314fca40291b74262d0d421301d2241.png)

## How to get paid​

You’ll set the price of the products in your app in Reddit [gold](https://support.reddithelp.com/hc/en-us/articles/17331548463764-What-is-gold-and-how-do-I-use-it). Users will use gold to acquire the items, and an equivalent amount of gold will accumulate in your app account.

Information about payouts is located [here](https://support.reddithelp.com/hc/en-us/articles/30641905617428-Developer-Program#h_01J8GCHXEG24ZNR5EZZ9SPN48S).

## Prerequisites​

You can use the sandbox to build and test payments, but before you can publish your app and sell products, you’ll need to:

  * Verify you meet the [eligibility criteria](https://support.reddithelp.com/hc/en-us/articles/30641905617428-Developer-Program#h_01J8GCHXEG24ZNR5EZZ9SPN48S).
  * Complete the verification process. You can start the process and check the status of your verification via your [settings page](https://developers.reddit.com/my/settings).
  * Accept and comply with our [Earn Terms](https://redditinc.com/policies/earn-terms) and [Earn Policy](https://www.redditinc.com/policies/earn-policy).

All products will be reviewed by the Developer Platform team to ensure compliance with our content policy. Products are approved during the app review process after you publish your app.

note

Payment functionality is supported on [Devvit Blocks](/docs/next/capabilities/blocks/overview) only. [Devvit Web](/docs/next/capabilities/devvit-web/devvit_web_overview) is currently not supported.

  * How to get paid
  * Prerequisites

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_publish.md

# payments_publish

Source: https://developers.reddit.com/docs/earn-money/payments/payments_publish

On this page

note

The Developer Platform team reviews and approves apps and their products before products can be sold.

To publish your app:

  1. Run `devvit publish`.
  2. Select how you want your app to appear in the Apps directory:

  * **Unlisted** means that the app is only visible to you in the directory, and you can install your app on larger subreddits that you moderate.
  * **Public** means that your app is visible to all users in the Apps directory and can be installed by mods and admins across Reddit.

You can change your app visibility at any time. See publishing an app for details.

### Ineligible products​

Any apps or products for which you wish to enable payments must comply with our [Earn Policy](/docs/earn-money/reddit_developer_funds#terms-and-conditions) and [Devvit Guidelines](/docs/devvit_rules).

  * Ineligible products

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/payments_test.md

# payments_test

Source: https://developers.reddit.com/docs/earn-money/payments/payments_test

On this page

Use the payments sandbox environment to simulate payment transactions. All apps automatically start in the payments sandbox.

## Start a playtest​

To test your app:

  1. Run `devvit upload` to upload your app to the Apps directory.
  2. Run `devvit playtest` .

Once you start a playtest session, a new pre-release version of your app is automatically created and installed on your test subreddit. The pre-release version has a fourth decimal place, so if your current app is 0.0.1, the first pre-release version will be 0.0.1.1.

The pre-release version is updated and uploaded to your test subreddit every time you save your app code. You’ll need to refresh your subreddit to see the updated app. This may take a couple of seconds, so be patient.

## Simulate purchases​

In your test subreddit, you can make simulated purchases to test your app. No gold deducted in this state.

![Sample payment simulation](/docs/assets/images/payment_simulation-f82bbb4a4d989d73560fedd59a1a9496.png)

To end your playtest, press CTRL + C in the terminal session where you started it.

  * Start a playtest
  * Simulate purchases

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/reddit-api.md

# reddit-api

Source: https://developers.reddit.com/docs/capabilities/server/reddit-api

On this page

The Reddit API allows you to read and write Reddit content such as posts / comments / upvotes, in order to integrate your app's behavior with the content of the community it's installed in.

## The Reddit client​

Here's how to obtain a reference to the Reddit client

  * Devvit Web
  * Devvit Blocks / Mod Tools

devvit.json
    
    
    {  
      "permissions": {  
        "reddit": true  
      }  
    }  
    

server/index.ts
    
    
    import { reddit } from '@devvit/reddit';  
    

devvit.tsx
    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({  
      redditAPI: true,  
    });  
      
    //Then, in any function that has a reference to Devvit.Context:  
    const reddit = context.reddit;  
    

## Example usage​

### Submitting a post​

  * Devvit Web
  * Devvit Blocks / Mod Tools

    
    
    import { Devvit } from '@devvit/public-api';  
    import { context, reddit } from '@devvit/web/server';  
      
    export const createPost = async () => {  
    const { subredditName } = context;  
    if (!subredditName) {  
      throw new Error('subredditName is required');  
    }  
      
    return await reddit.submitCustomPost({  
      userGeneratedContent: {  
        text: 'Hello there! This is a post from a Devvit app',  
      },  
      subredditName: subredditName,  
      title: 'New Post',  
      entry: 'default',  
    });  
    };  
    
    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({  
      redditAPI: true,  
    });  
      
    function createPost(context: Devvit.Context) {  
      const currentSubreddit = context.reddit.getCurrentSubreddit();  
      if (!currentSubreddit) {  
        throw new Error('No subreddit found');  
      }  
      
      return context.reddit.submitPost({  
        title: 'My custom post',  
        subredditName: currentSubreddit.name,  
        preview: (  
          <vstack height="100%" width="100%" alignment="middle center">  
            <text size="large">Loading...</text>  
          </vstack>  
        ),  
      });  
    }  
    

### Submitting a comment​

note

Auto-comments should be used to spark conversation in the post comments, but you should avoid lower-signal updates (e.g., level/progress pings).

  * Devvit Web
  * Devvit Blocks / Mod Tools

    
    
        import { context, reddit } from '@devvit/web/server';  
      
        export const createComment = async () => {  
            const { subredditName } = context;  
            if (!subredditName) {  
                throw new Error('subredditName is required');  
            }  
      
            reddit.submitComment({  
                postId: 't3_123456', // Replace with the actual post ID  
                text: 'This is a comment from a Devvit app',  
                runAs: 'USER' // Optional: specify the user to run as  
            });  
        };  
    
    
    
        import { Devvit } from '@devvit/public-api';  
      
        Devvit.configure({  
            redditAPI: true,  
        });  
      
        function createComment(context: Devvit.Context) {  
            const { reddit } = context;  
      
            reddit.submitComment({  
                postId: 't3_123456', // Replace with the actual post ID  
                text: 'This is a comment from a Devvit app',  
                runAs: RunAs.USER, // Optional: specify the user to run as  
            });  
        };  
    

  * The Reddit client
  * Example usage
    * Submitting a post
    * Submitting a comment

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/redis.md

# redis

Source: https://developers.reddit.com/docs/capabilities/server/redis

On this page

You can add a database to your app to store and retrieve data. The Redis plugin is designed to be fast, scalable, and secure. It supports a subset of the full Redis API, including:

  * Transactions for things like counting votes atomically in polls
  * String operations for persisting information
  * Number operations for incrementing numbers
  * Sorted sets for creating leaderboards
  * Hashes for managing a collection of key-value pairs
  * Bitfields for efficient operation on sequences of bits

Each installation of an app is uniquely name-spaced, which means Redis data is siloed by subreddit. Keep in mind that there won’t be a single source of truth for all installations of your app, since each app installation can only access the data that it has stored in the Redis database.

## Limits and quotas​

  * Max commands per second: 40000
  * Max request size: 5 MB
  * Max storage: 500 MB
  * [Pipelining](https://redis.io/docs/latest/develop/using-commands/pipelining/) is not supported
  * [Sets](https://redis.io/docs/latest/commands/set/) \- only sorted sets are supported
  * No support for listing keys
  * No support for lua scripts to execute custom logic on redis server

All limits are applied at a per-installation granularity.

## Examples​

### Menu actions​

  * Devvit Web
  * Devvit Blocks / Mod Tools

devvit.json
    
    
    {  
      "menuActions": [  
        {  
        "label": "Redis Test",  
        "endpoint": "/internal/menu/redis-test",  
        "forUserType": "moderator",  
        "location": "subreddit"  
        }  
      ]  
    }  
    

server/index.ts
    
    
    // Assumes Express.js  
    import { redis } from '@devvit/redis';  
    router.post("/internal/menu/redis-test", async (_req, res: Response<UiResponse>) => {  
      const key = 'hello';  
      await redis.set(key, 'world');  
      const value = await redis.get(key);  
      console.log(`${key}: ${value}`);  
    });  
    
    
    
    Devvit.addMenuItem({  
      location: 'subreddit',  
      label: 'Test Redis',  
      onPress: async (event, { redis }) => {  
        const key = 'hello';  
        await redis.set(key, 'world');  
        const value = await redis.get(key);  
        console.log(`${key}: ${value}`);  
      },  
    });  
    

### Games​

You can take a look at this [Game Template](https://github.com/reddit/devvit-template-phaser/) to see a basic implementation of Redis in a game built with Phaser.JS

## Supported Redis commands​

note

Not all Redis features are supported. If you would like to request a specific Redis feature, please reach out to our team [via modmail](https://www.reddit.com/message/compose/?to=%2Fr%2FDevvit) or Discord.

For all examples below, we assume that you already have obtained a Redis Client. Here's how to obtain a Redis Client for Devvit Web, Devvit Blocks and Mod Tools:

  * Devvit Web
  * Devvit Blocks / Mod Tools

devvit.json
    
    
    {  
      "permissions": {  
        "redis": true  
      }  
    }  
    

server/index.ts
    
    
    import { redis } from '@devvit/redis';  
    

devvit.tsx
    
    
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.configure({  
      redis: true,  
    });  
      
    //Then, in any function that has a reference to Devvit.Context:  
    const redis = context.redis;  
    

### Simple read/write​

**Command**| **Action**| **Limits**| [get](https://redis.io/commands/get)| Gets the value of key.| None| [set](https://redis.io/commands/set)| Sets key to hold a string value.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [exists](https://redis.io/commands/exists)| Returns number of given keys that exist.| None| [del](https://redis.io/commands/del)| Removes the specified keys.| None| [type](https://redis.io/commands/type)| Returns the string representation of the type of value stored at key.| None| [rename](https://redis.io/commands/rename)| Renames a key.| None  
---|---|---  
  
Code Example
    
    
    async function simpleReadWriteExample() {  
      // Set a key  
      await redis.set('color', 'red');  
      
      // Check if a key exists  
      console.log('Key exists: ' + (await redis.exists('color')));  
      
      // Get a key  
      console.log('Color: ' + (await redis.get('color')));  
      
      // Get the type of a key  
      console.log('Type: ' + (await redis.type('color')));  
      
      // Delete a key  
      await redis.del('color');  
    }  
    
    
    
    Color: red  
    Type: string  
    

### Batch read/write​

**Command**| **Action**| **Limits**| [mGet](https://redis.io/commands/mget)| Returns the values of all specified keys.| None| [mSet](https://redis.io/commands/mset)| Sets the given keys to their respective values.| Subject to storage quota gating (writes may be blocked if quota exceeded)  
---|---|---  
  
Code Example
    
    
    async function batchReadWriteExample() {  
      // Set multiple keys at once  
      await redis.mSet({  
        name: 'Devvit',  
        occupation: 'Developer',  
        yearsOfExperience: '9000',  
      });  
      
      // Get multiple keys  
      console.log('Result: ' + (await redis.mGet(['name', 'occupation'])));  
    }  
    
    
    
    Result: Devvit,Developer  
    

### Strings​

**Command**| **Action**| **Limits**| [getRange](https://redis.io/commands/getrange)| Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).| None| [setRange](https://redis.io/commands/setrange)| Overwrites part of the string stored at key, starting at the specified offset, for the entire length of value.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [strLen](https://redis.io/commands/strlen)| Returns the length of the string value stored at key.| None  
---|---|---  
  
Code Example
    
    
    async function stringsExample() {  
      // First, set 'word' to 'tacocat'  
      await redis.set('word', 'tacocat');  
      
      // Use getRange() to get the letters in 'word' between index 0 to 3, inclusive  
      console.log('Range from index 0 to 3: ' + (await redis.getRange('word', 0, 3)));  
      
      // Use setRange() to insert 'blue' at index 0  
      await redis.setRange('word', 0, 'blue');  
      
      console.log('Word after using setRange(): ' + (await redis.get('word')));  
      
      // Use strLen() to verify the word length  
      console.log('Word length: ' + (await redis.strLen('word')));  
    }  
    
    
    
    Range from index 0 to 3: taco  
    Word after using setRange(): bluecat  
    Word length: 7  
    

### Hash​

Redis hashes can store up to ~ 4.2 billion key-value pairs. We recommend using hash for managing collections of key-value pairs whenever possible and iterating over it using a combination of `hscan`, `hkeys` and `hgetall`.

**Command**| **Action**| **Limits**| [hGet](https://redis.io/commands/hget)| Returns the value associated with field in the hash stored at key.| None| [hMGet](https://redis.io/commands/hmget)| Returns the value of all specified field in the hash stored at multiple keys.| May be disabled for your app (allowlisted feature)| [hSet](https://redis.io/commands/hset/)| Sets the specified fields to their respective values in the hash stored at key.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [hSetNX](https://redis.io/commands/hsetnx/)| Sets field in the hash stored at key to value, only if field does not yet exist.ƒ| Subject to storage quota gating (writes may be blocked if quota exceeded)| [hDel](https://redis.io/commands/hdel/)| Removes the specified fields from the hash stored at key.| None| [hGetAll](https://redis.io/commands/hgetall/)| Returns a map of fields and their values stored in the hash.| None| [hKeys](https://redis.io/commands/hkeys/)| Returns all field names in the hash stored at key.| None| [hScan](https://redis.io/commands/hscan/)| Iterates fields of Hash types and their associated values.| No server-side cap; uses requested count| [hIncrBy](https://redis.io/commands/hincrby/)| Increments the score of member in the sorted set stored at key by value.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [hLen](https://redis.io/commands/hlen/)| Returns the number of fields contained in the hash stored at key.| None  
---|---|---  
  
Code Examples

**Example 1**
    
    
     // Example using hGet(), hSet(), and hDel()  
    async function hashExample1() {  
      // Set 'inventory' with multiple fields and values  
      await redis.hSet('inventory', {  
        sword: '1',  
        potion: '4',  
        shield: '2',  
        stones: '8',  
      });  
      
      // Get the value of 'shield' from 'inventory'  
      console.log('Shield count: ' + await redis.hGet('inventory', 'shield'));  
      
      // Get the values of both of 'shield' and 'potion' from 'inventory'  
      console.log('Shield and potion count: ' + await redis.hMGet('inventory', ['shield', 'potion']));  
      
      // Delete some fields from 'inventory'  
      console.log(  
        'Number of fields deleted: ' +  
          await redis.hDel('inventory', ['sword', 'shield', 'stones']);  
      );  
    }  
    
    
    
    Shield count: 2  
    Shield and potion count: 2,4  
    Number of fields deleted: 3  
    

* * *

**Example 2**
    
    
     // Example using hGetAll()  
    async function hashExample2() {  
      // Set 'groceryList' to fields containing products with quantities  
      await redis.hSet('groceryList', {  
        eggs: '12',  
        apples: '3',  
        milk: '1',  
      });  
      
      // Get the groceryList record  
      const record = await redis.hGetAll('groceryList');  
      
      if (record != undefined) {  
        console.log('Eggs: ' + record.eggs + ', Apples: ' + record.apples + ', Milk: ' + record.milk);  
      }  
    }  
    
    
    
    Eggs: 12, Apples: 3, Milk: 1  
    

* * *

**Example 3**
    
    
     // Example using hKeys()  
    async function hashExample3() {  
      await redis.hSet('prices', {  
        chair: '48',  
        desk: '95',  
        whiteboard: '23',  
      });  
      
      console.log('Keys: ' + (await redis.hKeys('prices')));  
    }  
    
    
    
    Keys: chair,desk,whiteboard  
    

* * *

**Example 4**
    
    
     // Example using hScan()  
    async function hashExample4() {  
      await redis.hSet('userInfo', {  
        name: 'Bob',  
        startDate: '01-05-20',  
        totalAwards: '12',  
      });  
      
      // Scan and interate over all the fields within 'userInfo'  
      const hScanResponse = await redis.hScan('userInfo', 0);  
      
      hScanResponse.fieldValues.forEach((x) => {  
        console.log("Field: '" + x.field + "', Value: '" + x.value + "'");  
      });  
    }  
    
    
    
    Field: 'name', Value: 'Bob'  
    Field: 'totalAwards', Value: '12'  
    Field: 'startDate', Value: '01-05-20'  
    

* * *

**Example 5**
    
    
     // Example using hIncrBy()  
    async function hashExample5() {  
      // Set user123's karma to 100  
      await redis.hSet('user123', { karma: '100' });  
      
      // Increase user123's karma by 5  
      console.log('Updated karma: ' + (await redis.hIncrBy('user123', 'karma', 5)));  
    }  
    
    
    
    Updated karma: 105  
    

* * *

**Example 6**
    
    
     // Example using hLen()  
    async function hashExample6() {  
      await redis.hSet('supplies', {  
        paperclips: '25',  
        pencils: '10',  
        erasers: '5',  
        pens: '7',  
      });  
      
      console.log('Number of fields: ' + (await redis.hLen('supplies')));  
    }  
    
    
    
    Number of fields: 4  
    

### Numbers​

**Command**| **Action**| **Limits**| [incrBy](https://redis.io/commands/incrby)| Increments the number stored at key by increment.| Subject to storage quota gating (writes may be blocked if quota exceeded)  
---|---|---  
  
Code Example
    
    
    async function numbersExample() {  
      await redis.set('totalPoints', '53');  
      
      console.log('Updated points: ' + (await redis.incrBy('totalPoints', 100)));  
    }  
    
    
    
    Updated points: 153  
    

### Key expiration​

**Command**| **Action**| **Limits**| [expire](https://redis.io/commands/expire/)| Sets a timeout on key.| None| [expireTime](https://redis.io/commands/expiretime/)| Returns the remaining seconds at which the given key will expire.| None  
---|---|---  
  
Code Example
    
    
    async function keyExpirationExample() {  
      // Set a key 'product' with value 'milk'  
      await redis.set('product', 'milk');  
      
      // Get the current expireTime for the product  
      console.log('Expire time: ' + (await redis.expireTime('product')));  
      
      // Set the product to expire in 60 seconds  
      await redis.expire('product', 60);  
      
      // Get the updated expireTime for the product  
      console.log('Updated expire time: ' + (await redis.expireTime('product')));  
    }  
    
    
    
    Expire time: 0  
    Updated expire time: 60  
    

### [Transactions](https://redis.io/topics/transactions)​

Redis transactions allow a group of commands to be executed in a single isolated step. For example, to implement voting action in a polls app, these three actions need to happen together:

  * Store the selected option for the user.
  * Increment the count for selected option.
  * Add the user to voted user list.

The `watch` command provides an entrypoint for transactions. It returns a [TxClientLike](https://developers.reddit.com/docs/api/public-api/#-txclientlike) which can be used to call `multi`, `exec`, `discard`, `unwatch`, and all other Redis commands to be executed within a transaction.

You can sequence all of the above steps in a single transaction using `multi` and `exec` to ensure that either all of the steps happen together or none at all.

If an error occurs inside a transaction before `exec` is called, Redis discards the transaction automatically. See the Redis docs: [Errors inside a transaction](https://redis.io/docs/latest/develop/interact/transactions/#errors-inside-a-transaction) for more info.

**Command**| **Action**| **Limits**| [multi](https://redis.io/commands/multi/)| Marks the start of a transaction block.| Max concurrent transactions per installation: 20 (default)| [exec](https://redis.io/commands/exec/)| Executes all previously queued commands in a transaction and restores the connection state to normal.| Transaction execution timeout: 5 seconds| [discard](https://redis.io/commands/discard/)| Flushes all previously queued commands in a transaction and restores the connection state to normal.| None| [watch](https://redis.io/commands/watch/)| Marks the given keys to be watched for conditional execution of a transaction. `watch` returns a [TxClientLike](https://developers.reddit.com/docs/api/public-api/#-txclientlike) which should be used to call Redis commands in a transaction.| None| [unwatch](https://redis.io/commands/unwatch/)| Flushes all the previously watched keys for a transaction.| None  
---|---|---  
  
Code Examples

**Example 1**
    
    
     // Example using exec()  
    async function transactionsExample1() {  
      await redis.mSet({ quantity: '5', karma: '32' });  
      
      const txn = await redis.watch('quantity');  
      
      await txn.multi(); // Begin a transaction  
      await txn.incrBy('karma', 10);  
      await txn.set('name', 'Devvit');  
      await txn.exec(); // Execute the commands in the transaction  
      
      console.log(  
        'Keys after completing transaction: ' +  
          (await redis.mGet(['quantity', 'karma', 'name']))  
      );  
    }  
    
    
    
    Keys after completing transaction: 5,42,Devvit  
    

* * *

**Example 2**
    
    
     // Example using discard()  
    async function transactionsExample2() {  
      await redis.set('price', '25');  
      
      const txn = await redis.watch('price');  
      
      await txn.multi(); // Begin a transaction  
      await txn.incrBy('price', 5);  
      await txn.discard(); // Discard the commands in the transaction  
      
      console.log('Price value: ' + (await redis.get('price'))); // 'price' should still be '25'  
    }  
    
    
    
    Price value: 25  
    

* * *

**Example 3**
    
    
     // Example using unwatch()  
    async function transactionsExample3() {  
      await redis.set('gold', '50');  
      
      const txn = await redis.watch('gold');  
      
      await txn.multi(); // Begin a transaction  
      await txn.incrBy('gold', 30);  
      await txn.unwatch(); // Unwatch "gold"  
      
      // Now that "gold" has been unwatched, we can increment its value  
      // outside the transaction without canceling the transaction  
      await redis.incrBy('gold', -20);  
      
      await txn.exec(); // Execute the commands in the transaction  
      
      console.log('Gold value: ' + (await redis.get('gold'))); // The value of 'gold' should be 50 + 30 - 20 = 60  
    }  
    
    
    
    Gold value: 60  
    

### Sorted set​

**Command**| **Action**| **Limits**| [zAdd](https://redis.io/commands/zadd/)| Adds all the specified members with the specified scores to the sorted set stored at key.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [zCard](https://redis.io/commands/zcard)| Returns the sorted set cardinality (number of elements) of the sorted set stored at key.| None| [zRange](https://redis.io/commands/zrange/)| Returns the specified range of elements in the sorted set stored at key.   
  
When using `by: 'lex'`, the start and stop inputs will be prepended with `[` by default, unless they already begin with `[`, `(` or are one of the special values `+` or `-`.| BYSCORE/BYLEX: LIMIT count capped to 1000 per call (server default). RANK: no server cap. Client default for by: 'score'/'lex' is count=1000 when no limit is provided.| [zRem](https://redis.io/commands/zrem/)| Removes the specified members from the sorted set stored at key.| None| [zScore](https://redis.io/commands/zscore/)| Returns the score of member in the sorted set at key.| None| [zRank](https://redis.io/commands/zrank/)| Returns the rank of member in the sorted set stored at key.| None| [zIncrBy](https://redis.io/commands/zincrby/)| Increments the score of member in the sorted set stored at key by value.| Subject to storage quota gating (writes may be blocked if quota exceeded)| [zScan](https://redis.io/commands/zscan/)| Iterates elements of sorted set types and their associated scores. Note that there is no guaranteed ordering of elements in the result.| No server-side cap; uses requested count| [zRemRangeByLex](https://redis.io/commands/zremrangebylex/)| When all elements in a sorted set are inserted with the same score, this command removes the elements at key between the lexicographical range specified by min and max.| None| [zRemRangeByRank](https://redis.io/commands/zremrangebyrank/)| Removes all elements in the sorted set stored at key with rank between start and stop.| None| [zRemRangeByScore](https://redis.io/commands/zremrangebyscore/)| Removes all elements in the sorted set stored at key with a score between min and max (inclusive).| None  
---|---|---  
  
Code Examples

**Example 1**
    
    
     // Example using zRange() with by 'score'  
    async function sortedSetExample1() {  
      await redis.zAdd(  
        'leaderboard',  
        { member: 'louis', score: 37 },  
        { member: 'fernando', score: 10 },  
        { member: 'caesar', score: 20 },  
        { member: 'alexander', score: 25 }  
      );  
      
      // Cardinality should be '4' as there are 4 elements in the leaderboard set  
      console.log('Cardinality: ' + (await redis.zCard('leaderboard')));  
      
      // View elements with scores between 0 and 30 inclusive, sorted by score  
      let scores = await redis.zRange('leaderboard', 0, 30, { by: 'score' });  
      console.log('Scores: ' + JSON.stringify(scores));  
      
      // Remove 'fernando' from the leaderboard  
      await redis.zRem('leaderboard', ['fernando']);  
      
      // View the elements sorted by score again. This time 'fernando' should not appear in the output  
      scores = await redis.zRange('leaderboard', 0, 30, { by: 'score' });  
      console.log('Updated scores: ' + JSON.stringify(scores));  
      
      // View caesar's score  
      console.log("Caesar's score: " + (await redis.zScore('leaderboard', 'caesar')));  
    }  
    
    
    
    Cardinality: 4  
    Scores: [{"score":10,"member":"fernando"},{"score":20,"member":"caesar"},{"score":25,"member":"alexander"}]  
    Updated scores: [{"score":20,"member":"caesar"},{"score":25,"member":"alexander"}]  
    Caesar's score: 20  
    

* * *

**Example 2**
    
    
     // Example using zRange() with by 'lex'  
    async function sortedSetExample2() {  
      await redis.zAdd(  
        'checkpoints',  
        { member: 'delta', score: 0 },  
        { member: 'omega', score: 0 },  
        { member: 'alpha', score: 0 },  
        { member: 'charlie', score: 0 }  
      );  
      
      // View elements between the words 'alpha' and 'fox' inclusive, sorted lexicographically  
      // Note that 'by: "lex"' only works if all elements have the same score  
      const members = await redis.zRange('checkpoints', 'alpha', 'fox', { by: 'lex' });  
      console.log('Members: ' + JSON.stringify(members));  
    }  
    
    
    
    Members: [{"score":0,"member":"alpha"},{"score":0,"member":"charlie"},{"score":0,"member":"delta"}]  
    

* * *

**Example 3**
    
    
     // Example using zRange() with by 'rank'  
    async function sortedSetExample3() {  
      await redis.zAdd(  
        'grades',  
        { member: 'sam', score: 80 },  
        { member: 'norma', score: 95 },  
        { member: 'alex', score: 77 },  
        { member: 'don', score: 84 },  
        { member: 'zeek', score: 92 }  
      );  
      
      // View elements with a rank between 2 and 4 inclusive. Note that ranks start at index 0.  
      const members = await redis.zRange('grades', 2, 4, { by: 'rank' });  
      console.log('Members: ' + JSON.stringify(members));  
    }  
    
    
    
    Members: [{"score":84,"member":"don"},{"score":92,"member":"zeek"},{"score":95,"member":"norma"}]  
    

* * *

**Example 4**
    
    
     // Example using zRank() and zIncrBy()  
    async function sortedSetExample4() {  
      await redis.zAdd(  
        'animals',  
        { member: 'zebra', score: 92 },  
        { member: 'cat', score: 100 },  
        { member: 'dog', score: 95 },  
        { member: 'elephant', score: 97 }  
      );  
      
      // View the rank of 'dog' in the animals set  
      // Rank should be '1' since 'dog' has the second lowest score. Note that ranks start at index 0.  
      console.log("Dog's rank: " + (await redis.zRank('animals', 'dog')));  
      
      // View the rank of 'zebra'  
      console.log("Zebra's rank: " + (await redis.zRank('animals', 'zebra')));  
      
      // Increase the score of 'dog' by 10  
      await redis.zIncrBy('animals', 'dog', 10);  
      
      // View the rank of 'dog' again. This time it should be '3' because dog has the highest score.  
      console.log(  
        "Dog's rank after incrementing score: " + (await redis.zRank('animals', 'dog'))  
      );  
    }  
    
    
    
    Dog's rank: 1  
    Zebra's rank: 0  
    Dog's rank after incrementing score: 3  
    

* * *

**Example 5**
    
    
     // Example using zRemRangeByLex()  
    async function sortedSetExample5() {  
      await redis.zAdd(  
        'fruits',  
        { member: 'kiwi', score: 0 },  
        { member: 'mango', score: 0 },  
        { member: 'banana', score: 0 },  
        { member: 'orange', score: 0 },  
        { member: 'apple', score: 0 }  
      );  
      
      // Remove fruits alphabetically ordered between 'kiwi' inclusive and 'orange' exclusive  
      // Note: The symbols '[' and '(' indicate inclusive or exclusive, respectively. These must be included in the call to zRemRangeByLex().  
      await redis.zRemRangeByLex('fruits', '[kiwi', '(orange');  
      
      // Only 'apple', 'banana', and 'orange' should remain in the set  
      const zScanResponse = await redis.zScan('fruits', 0);  
      console.log('zScanResponse: ' + JSON.stringify(zScanResponse));  
    }  
    
    
    
    zScanResponse: {"cursor":0,"members":[{"score":0,"member":"apple"},{"score":0,"member":"banana"},{"score":0,"member":"orange"}]}  
    

* * *

**Example 6**
    
    
     // Example using zRemRangeByRank()  
    async function sortedSetExample6() {  
      await redis.zAdd(  
        'fruits',  
        { member: 'kiwi', score: 10 },  
        { member: 'mango', score: 20 },  
        { member: 'banana', score: 30 },  
        { member: 'orange', score: 40 },  
        { member: 'apple', score: 50 }  
      );  
      
      // Remove fruits ranked 1 through 3 inclusive  
      await redis.zRemRangeByRank('fruits', 1, 3);  
      
      // Only 'kiwi' and 'apple' should remain in the set  
      const zScanResponse = await redis.zScan('fruits', 0);  
      console.log('zScanResponse: ' + JSON.stringify(zScanResponse));  
    }  
    
    
    
    zScanResponse: {"cursor":0,"members":[{"score":10,"member":"kiwi"},{"score":50,"member":"apple"}]}  
    

* * *

**Example 7**
    
    
     // Example using zRemRangeByScore() example  
    async function sortedSetExample7() {  
      await redis.zAdd(  
        'fruits',  
        { member: 'kiwi', score: 10 },  
        { member: 'mango', score: 20 },  
        { member: 'banana', score: 30 },  
        { member: 'orange', score: 40 },  
        { member: 'apple', score: 50 }  
      );  
      
      // Remove fruits scored between 30 and 50 inclusive  
      await redis.zRemRangeByScore('fruits', 30, 50);  
      
      // Only 'kiwi' and 'mango' should remain in the set  
      const zScanResponse = await redis.zScan('fruits', 0);  
      console.log('zScanResponse: ' + JSON.stringify(zScanResponse));  
    }  
    
    
    
    zScanResponse: {"cursor":0,"members":[{"score":10,"member":"kiwi"},{"score":20,"member":"mango"}]}  
    

### Bitfield​

**Command**| **Action**| **Limits**| [bitfield](https://redis.io/docs/latest/commands/bitfield/)| Performs a sequence of operations on a bit string| Subject to storage quota gating (writes may be blocked if quota exceeded)  
---|---|---  
  
Code Example
    
    
    async function bitfieldExample() {  
      const setBits: number[] = await redis.bitfield('foo', 'set', 'i5', '#0', 11);  
      console.log('Set result: ' + setBits); // [0]  
      
      const getBits: number[] = await redis.bitfield('foo', 'get', 'i5', '#0');  
      console.log('Get result: ' + setBits); // [11]  
      
      const manyOperations: number[] = await redis.bitfield(  
        'bar',  
        'set',  
        'u2',  
        0,  
        3,  
        'get',  
        'u2',  
        0,  
        'incrBy',  
        'u2',  
        0,  
        1,  
        'overflow',  
        'sat',  
        'get',  
        'u2',  
        0,  
        'set',  
        'u2',  
        0,  
        3,  
        'incrBy',  
        'u2',  
        0,  
        1  
      );  
      console.log('Results of many operations: ' + manyOperations); // [0, 3, 0, 0, 3, 3]  
    }  
    
    
    
    fooResults: [1, 0]  
    barResults: [0, 3, 0, 0, 3, 3]  
    

## Compression (Experimental)​

The Redis package includes a `redisCompressed` client that transparently handles compression and decompression of values. This is useful for storing large strings or JSON objects that exceed the Redis storage limits or to optimize storage usage.

To use it, update your import:
    
    
    // import { redis } from '@devvit/redis';  
    import { redisCompressed as redis } from '@devvit/redis';  
    

warning

**One-Way Migration** : Once you start using `redisCompressed` and writing compressed data, switching back to the standard `redis` client will result in errors when reading that data, as the standard client does not know how to decompress the values.

The `redisCompressed` client automatically:

  * Compresses values on write (`set`, `hSet`, `mSet`, `hSetNX`) if it saves space.
  * Decompresses values on read (`get`, `hGet`, `mGet`, `hMGet`, `hGetAll`).

**Note:** Existing uncompressed data is **not** automatically compressed when read. It is only compressed when you write it back. To migrate existing large datasets, you need to read and re-write the data.

### Migration Example​

Migrating large datasets can take time. To avoid the 30-second execution timeout, we recommend using a scheduled job that processes data in chunks and "daisy chains" itself until completion.

Here is an example of how to implement a migration tool using a Menu Item and the Scheduler.

Register your form handler, menu trigger, and scheduler endpoint here.
    
    
    {  
      "forms": {  
        "migrateExampleForm": "/internal/form/ops/migrate-example"  
      },  
      "menu": {  
        "items": [  
          {  
            "label": "[ops] Migrate Data to Compression",  
            "location": "subreddit",  
            "forUserType": "moderator",  
            "endpoint": "/internal/menu/ops/migrate-example"  
          }  
        ]  
      },  
      "scheduler": {  
        "tasks": {  
          "migrate-example-data": {  
            "endpoint": "/internal/scheduler/migrate-example-data"  
          }  
        }  
      }  
    }  
    

Add these route handlers to your Express app.
    
    
    import { redis, scheduler } from '@devvit/web/server';  
    // Import the compressed client  
    import { redisCompressed } from '@devvit/redis';  
      
    const MY_DATA_HASH_KEY = 'my:app:large:dataset';  
      
    // 1. Menu Endpoint: Returns the form definition  
    app.post('/internal/menu/ops/migrate-example', async (_req, res) => {  
      res.json({  
        showForm: {  
          name: 'migrateExampleForm', // Must match key in devvit.json "forms"  
          form: {  
            title: 'Migrate Hash to Compression',  
            acceptLabel: 'Start Migration',  
            fields: [  
              {  
                name: 'startCursor',  
                label: 'Start Cursor (0 for beginning)',  
                type: 'string',  
                defaultValue: '0',  
              },  
              {  
                name: 'chunkSize',  
                label: 'Items per batch',  
                type: 'number',  
                defaultValue: 20000,  
              },  
            ],  
          },  
        },  
      });  
    });  
      
    // 2. Form Handler: Receives input and schedules the first job  
    app.post('/internal/form/ops/migrate-example', async (req, res) => {  
      const { startCursor, chunkSize } = req.body ?? {};  
      const cursor = startCursor || '0';  
      const size = Number(chunkSize) || 20000;  
      
      console.log(`[Migration] Manual start requested. Cursor: ${cursor}, Chunk: ${size}`);  
      
      // Kick off the first job in the chain  
      await scheduler.runJob({  
        name: 'migrate-example-data',  
        runAt: new Date(), // Run immediately  
        data: {  
          cursor,  
          chunkSize: size,  
          processed: 0,  
        },  
      });  
      
      res.json({  
        showToast: {  
          text: 'Migration started in background',  
          appearance: 'success',  
        },  
      });  
    });  
      
    // 3. Scheduler Endpoint: The recursive worker  
    app.post('/internal/scheduler/migrate-example-data', async (req, res) => {  
      const startTime = Date.now();  
      
      try {  
        const body = req.body ?? {};  
        const data = body.data ?? {};  
      
        let cursor = Number(data.cursor) || 0;  
        const chunkSize = Number(data.chunkSize) || 20000;  
        const processedTotal = Number(data.processed) || 0;  
      
        console.log(`[Migration] Job started. Cursor: ${cursor}, Target Chunk: ${chunkSize}`);  
      
        let keepRunning = true;  
        let processedInJob = 0;  
        const SCAN_COUNT = 250; // Internal batch size to keep event loop moving  
      
        while (keepRunning) {  
          // Stop if we've processed enough items for this single execution  
          if (processedInJob >= chunkSize) {  
            break;  
          }  
      
          const { cursor: nextCursor, fieldValues } = await redis.hScan(  
            MY_DATA_HASH_KEY,  
            cursor,  
            undefined, // match pattern  
            SCAN_COUNT  
          );  
      
          // Parallel Processing:  
          // We treat the batch as a set of promises to execute simultaneously.  
          // Promise.allSettled ensures one failure doesn't crash the whole job.  
          await Promise.allSettled(  
            fieldValues.map(async ({ field, value }) => {  
              // LOGIC:  
              // 1. We read the raw value.  
              // 2. We write it back using 'redisCompressed'.  
              //    The proxy detects the write and compresses the string if beneficial.  
              if (value && value.length > 0) {  
                await redisCompressed.hSet(MY_DATA_HASH_KEY, { [field]: value });  
              }  
            })  
          );  
      
          processedInJob += fieldValues.length;  
      
          // Cursor logic: 0 means iteration is complete  
          if (nextCursor === 0) {  
            cursor = 0;  
            keepRunning = false;  
          } else {  
            cursor = nextCursor;  
          }  
      
          // Safety: Check execution time.  
          // If we are close to 30s (Devvit limit), stop early and requeue.  
          if (Date.now() - startTime > 20000) {  
            console.log('[Migration] Time limit approaching, stopping early.');  
            keepRunning = false;  
          }  
        }  
      
        const newTotal = processedTotal + processedInJob;  
      
        // Daisy Chaining:  
        // If the cursor is not 0, we still have more data to scan.  
        // We schedule *this same job* to run again immediately.  
        if (cursor !== 0) {  
          console.log(`[Migration] Requeueing. Next cursor: ${cursor}. Processed so far: ${newTotal}`);  
          await scheduler.runJob({  
            name: 'migrate-example-data',  
            runAt: new Date(),  
            data: {  
              cursor,  
              chunkSize,  
              processed: newTotal,  
            },  
          });  
      
          res.json({ status: 'requeued', processed: newTotal, cursor });  
        } else {  
          console.log(`[Migration] COMPLETE. Total items processed: ${newTotal}`);  
          res.json({ status: 'success', processed: newTotal });  
        }  
      } catch (error) {  
        console.error('[Migration] Critical Job Error', error);  
        res.status(500).json({ status: 'error', message: error.message });  
      }  
    });  
    

Note that the job may timeout, in which case you will need to find the last logged cursor to start the menu item action job again. Try adjusting the chunk size if you experience timeouts.

You can monitor the migration progress using the logs command:
    
    
    devvit logs r/my-subreddit-to-migrate --since=1h --verbose  
    

  * Limits and quotas
  * Examples
    * Menu actions
    * Games
  * Supported Redis commands
    * Simple read/write
    * Batch read/write
    * Strings
    * Hash
    * Numbers
    * Key expiration
    * Transactions
    * Sorted set
    * Bitfield
  * Compression (Experimental)
    * Migration Example

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/scheduler.md

# scheduler

Source: https://developers.reddit.com/docs/capabilities/server/scheduler

On this page

The scheduler allows your app to perform actions at specific times, such as sending private messages, tracking upvotes, or scheduling timeouts for user actions. You can schedule both recurring and one-off jobs using the scheduler.

* * *

## Scheduling recurring jobs​

To create a regularly occurring event in your app, declare a task in your `devvit.json` and handle the event in your server logic.

### 1\. Add a recurring task to `devvit.json`​

Ensure the endpoint follows the format `/internal/.+` and specify a `cron` schedule:

devvit.json
    
    
    "scheduler": {  
      "tasks": {  
        "regular-interval-example-task": {  
          "endpoint": "/internal/scheduler/regular-interval-task-example",  
          "cron": "*/1 * * * *"  
        }  
      }  
    },  
    

  * The `cron` parameter uses the standard [UNIX cron format](https://en.wikipedia.org/wiki/Cron): 
        
        # * * * * *  
        # | | | | |  
        # | | | | day of the week (0–6, Sunday to Saturday; 7 is also Sunday on some systems)  
        # | | | month (1–12)  
        # | | day of the month (1–31)  
        # | hour (0–23)  
        # minute (0–59)  
        

  * We recommend using [Cronitor](https://crontab.guru/) to build cron strings.

### 2\. Handle the event in your server​
    
    
    router.post('/internal/scheduler/regular-interval-task-example', async (req, res) => {  
      console.log(`Handle event for cron example at ${new Date().toISOString()}!`);  
      // Handle the event here  
      res.status(200).json({ status: 'ok' });  
    });  
    

* * *

## Scheduling one-off jobs at runtime​

One-off tasks must also be declared in `devvit.json`.

### 1\. Add the tasks to `devvit.json`​

devvit.json
    
    
    "scheduler": {  
      "tasks": {  
        "regular-interval-task-example": {  
          "endpoint": "/internal/scheduler/regular-interval-task-example",  
          "cron": "*/1 * * * *"  
        },  
        "one-off-task-example": {  
          "endpoint": "/internal/scheduler/one-off-task-example"  
        }  
      }  
    }  
    

### 2\. Schedule a job at runtime​

Example usage:
    
    
    import { scheduler } from '@devvit/web/server';  
      
    // Handle the occurrence of the event  
    router.post('/internal/scheduler/one-off-task-example', async (req, res) => {  
      const oneMinuteFromNow = new Date(Date.now() + 1000 * 60);  
      
      let scheduledJob: ScheduledJob = {  
        id: `job-one-off-for-post${postId}`,  
        name: 'one-off-task-example',  
        data: { postId },  
        runAt: oneMinuteFromNow,  
      };  
      
      let jobId = await scheduler.runJob(scheduledJob);  
      console.log(`Scheduled job ${jobId} for post ${postId}`);  
      console.log(`Handle event for one-off event at ${new Date().toISOString()}!`);  
      // Handle the event here  
      res.status(200).json({ status: 'ok' });  
    });  
    

## Cancel a scheduled job​

Use the job ID to cancel a scheduled action and remove it from your app. This example shows how to set up a moderator menu action to cancel a job.

### 1\. Add menu item to `devvit.json`​

devvit.json
    
    
    {  
      "menu": {  
        "items": [  
          {  
            "label": "Cancel Job",  
            "description": "Cancel a scheduled job",  
            "forUserType": "moderator",  
            "location": "post",  
            "endpoint": "/internal/menu/cancel-job"  
          }  
        ]  
      },  
      "permissions": {  
        "redis": true  
      }  
    }  
    

### 2\. Handle the menu action in your server​

server/index.ts
    
    
    import { redis } from '@devvit/redis';  
    import { scheduler } from '@devvit/web/server';  
      
    router.post('/internal/menu/cancel-job', async (req, res) => {  
      try {  
        // Get the post ID from the menu action request  
        const postId = req.body.targetId;  
      
        // Retrieve the job ID from Redis (stored when the job was created)  
        const jobId = await redis.get(`job:${postId}`);  
      
        if (!jobId) {  
          return res.json({  
            showToast: {  
              text: 'No scheduled job found for this post',  
              appearance: 'neutral',  
            },  
          });  
        }  
      
        // Cancel the scheduled job  
        await scheduler.cancelJob(jobId);  
      
        // Clean up the stored job ID  
        await redis.del(`job:${postId}`);  
      
        res.json({  
          showToast: {  
            text: 'Successfully cancelled the scheduled job',  
            appearance: 'success',  
          },  
        });  
      } catch (error) {  
        console.error('Error cancelling job:', error);  
        res.json({  
          showToast: {  
            text: 'Failed to cancel job',  
            appearance: 'neutral',  
          },  
        });  
      }  
    });  
    

### Example: Storing a job ID when creating a job​

When you create a scheduled job, store its ID in Redis so you can reference it later

server/index.ts
    
    
    router.post('/api/schedule-action', async (req, res) => {  
      const { postId, delayMinutes } = req.body;  
      const runAt = new Date(Date.now() + delayMinutes * 60 * 1000);  
      
      const scheduledJob: ScheduledJob = {  
        id: `job-${postId}-${Date.now()}`,  
        name: 'one-off-task-example',  
        data: { postId },  
        runAt,  
      };  
      
      const jobId = await scheduler.runJob(scheduledJob);  
      
      // Store the job ID in Redis for later cancellation  
      await redis.set(`job:${postId}`, jobId);  
      
      res.json({  
        jobId,  
        message: 'Job scheduled successfully',  
      });  
    });  
    

## List jobs​

This example shows how to handle a request within your server/index.ts to list your scheduled jobs and return them to the client.

server/index.ts
    
    
    router.get("/api/list-jobs", async (_req, res): Promise<void> => {  
      try {  
        const jobs: (ScheduledJob | ScheduledCronJob)[] = await scheduler.listJobs();  
      
        console.log(`[LIST] Found ${jobs.length} scheduled jobs`);  
      
        res.json({  
          status: "success",  
          jobs: jobs,  
          count: jobs.length  
        });  
      } catch (error) {  
        console.error(`[LIST] Error listing jobs:`, error);  
        res.status(500).json({  
          status: "error",  
          message: error instanceof Error ? error.message : "Failed to list jobs"  
        });  
      }  
    

## Faster scheduler​

note

This feature is experimental, which means the design is not final but it's still available for you to use.

Scheduled jobs currently perform one scheduled run per minute. To go faster, you can now run jobs every second by adding seconds granularity to your cron expression.
    
    
    await scheduler.runJob({  
      name: 'run_every_30_seconds',  
      cron: '*/30 * * * * *',  
    });  
    

How frequent a scheduled job runs will depend on how long the job takes to complete and how many jobs are running in parallel. This means a job may take a bit longer than scheduled, but the overall resolution should be better than a minute.

* * *

## Limitations​

_Limits are per installation of an app:_

  1. An installation can have up to **10 live recurring actions**.
  2. The `runJob()` method enforces two rate limits when creating actions: 
     * **Creation rate:** Up to 60 calls to `runJob()` per minute
     * **Delivery rate:** Up to 60 deliveries per minute

  * Scheduling recurring jobs
    * 1\. Add a recurring task to `devvit.json`
    * 2\. Handle the event in your server
  * Scheduling one-off jobs at runtime
    * 1\. Add the tasks to `devvit.json`
    * 2\. Schedule a job at runtime
  * Cancel a scheduled job
    * 1\. Add menu item to `devvit.json`
    * 2\. Handle the menu action in your server
    * Example: Storing a job ID when creating a job
  * List jobs
  * Faster scheduler
  * Limitations

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/splash_migration.md

# splash_migration

Source: https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/splash_migration

If you're updating an existing app that used the deprecated splash parameter in `submitCustomPost()`, you'll need to migrate to HTML-based launch screens with multiple entry points.

**The old splash parameter (deprecated)**
    
    
    await reddit.submitCustomPost({  
      subredditName: context.subredditName,  
      title: 'My Game',  
      splash: {  
        appDisplayName: 'My Game',  
        backgroundUri: 'background.png',  
        buttonLabel: 'Play Now',  
        description: 'An exciting game',  
        heading: 'Welcome!',  
      },  
    });  
    

**The new launch screen (current)**
    
    
    await reddit.submitCustomPost({ title: 'Tennis Match #37' }); // implicitly default entry  
    await reddit.submitCustomPost({ title: 'Tennis Leaderboard', entry: 'leaderboard' }); // not a URI, an entry name.  
    

**Migration instructions**

  1. Update your `devvit.json` to define both preview and game entry points.

devvit.json
    
    
    {  
      "post": {  
        "dir": "dist/client",  
        "entrypoints": {  
          "default": {  
            "entry": "splash.html",  
            "height": "regular",  
    	 "inline": true  
          },  
          "game": {  
            "entry": "index.html",  
            "height": "tall"  
          }  
        }  
      }  
    }  
    

Esbuild would probably be simpler and add fewer dependencies, but you can also use Vite.
    
    
    {  
      ...all your normal vite nonsense...  
      build: {  
        input: ['splash.html', 'game.html'], <-- add your entrypoints  
        ...  
      }  
    }  
    

  2. Create a `splash.html` file with a button to launch into the game.

splash.html
    
    
    <html>  
      <head>  
        <meta charset="UTF-8" />  
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
        <title>My Game</title>  
        <script src="preview.js"></script>  
      </head>  
      <body>  
        <div class="preview-container">  
          <h1>My Game</h1>  
          <p>An exciting game</p>  
          <button id="play-button">Play Now</button>  
        </div>  
      </body>  
    </html>  
    

preview.js
    
    
    import { requestExpandedMode } from '@devvit/web/client';  
      
    document.addEventListener('DOMContentLoaded', () => {  
      const playButton = document.getElementById('play-button');  
      
      playButton.addEventListener('click', async (event) => {  
        try {  
          await requestExpandedMode(event, 'game');  
        } catch (error) {  
          console.error('Failed to enter expanded mode:', error);  
        }  
      });  
    });  
    

  3. Update your post creation to use the default (preview) entry point.

    
    
    await reddit.submitCustomPost({  
      subredditName: context.subredditName,  
      title: 'My Game',  
      entry: 'default',  
    });  
    

Now your app will load the launch screen in inline mode. When users click "Play Now", the game will transition to expanded mode (`index.html`).

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/support_this_app.md

# support_this_app

Source: https://developers.reddit.com/docs/earn-money/payments/support_this_app

On this page

You can ask users to contribute to your app’s development by adding the “support this app” feature. This allows users to support your app with Reddit gold in exchange for some kind of award or recognition.

## Requirements​

  1. You must give something in return to users who support your app. This could be unique custom user flair, an honorable mention in a thank you post, or another creative way to show your appreciation.
  2. The “Support this App” purchase button must meet the Developer Platform’s [design guidelines](/docs/earn-money/payments/payments_add#design-guidelines).

## How to integrate app support​

### Create the product​

Use the Devvit CLI to generate the [product configuration](/docs/earn-money/payments/payments_add#register-products).
    
    
    devvit products add support-app  
    

### Add a payment handler​

The [payment handler](/docs/earn-money/payments/payments_add#complete-the-payment-flow) is where you award the promised incentive to your supporters. For example, this is how you can award custom user flair:
    
    
    addPaymentHandler({  
      fulfillOrder: async (order, context) => {  
        const username = await context.reddit.getCurrentUsername();  
        if (!username) {  
          throw new Error('User not found');  
        }  
      
        const subredditName = await context.reddit.getCurrentSubredditName();  
      
        await context.reddit.setUserFlair({  
          text: 'Super Duper User',  
          subredditName,  
          username,  
          backgroundColor: '#ffbea6',  
          textColor: 'dark',  
        });  
      },  
    });  
    

### Initiate purchases​

Next you need to provide a way for users to support your app:

  * If you use Devvit blocks, you can use the ProductButton helper to render a purchase button.
  * If you use webviews, make sure that your design follows the [design guidelines](/docs/earn-money/payments/payments_add#design-guidelines) to [initiate purchases](/docs/earn-money/payments/payments_add#initiate-orders).

![Support App Example](/docs/assets/images/support_this_app-9a4c545c397aeb378365f02af339be12.png)

Here's how you create a ProductButton in blocks:
    
    
    import { usePayments, useProducts } from '@devvit/payments';  
    import { ProductButton } from '@devvit/payments/helpers/ProductButton';  
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.addCustomPostType({  
      render: (context) => {  
        const { products } = useProducts(context);  
        const payments = usePayments((result: OnPurchaseResult) => {  
          if (result.status === OrderResultStatus.Success) {  
            context.ui.showToast({  
              appearance: 'success',  
              text: 'Thanks for your support!',  
            });  
          } else {  
            context.ui.showToast(  
              `Purchase failed! Please try again.`  
            );  
          }  
        });  
       const supportProduct = products.find(products.find((p) => p.sku === 'support-app');  
       return (  
         <ProductButton  
           product={supportProduct}  
           onPress={(p) => payments.purchase(p.sku)}  
         />  
       );  
    })  
    

## Example​

At [r/BirbGame](https://www.reddit.com/r/BirbGame/), they created the Birb Club. Members can join the club and get exclusive flair to support the app.

![Birb gif](/docs/assets/images/support_birbclub-177516bc359c40d59f54648b6b0a9bd3.gif)

![Birb flair](/docs/assets/images/support_birbclub_flair-0c834b968319297b5115b3b9d04b9bd2.png)

  * Requirements
  * How to integrate app support
    * Create the product
    * Add a payment handler
    * Initiate purchases
  * Example

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/template-library.md

# template-library

Source: https://developers.reddit.com/docs/next/examples/template-library

This is unreleased documentation for Reddit for Developers **Next** version.

For up-to-date documentation, see the **[latest version](/docs/examples/template-library)** (0.12).

Version: Next

On this page

Here are some starter projects and templates for your Devvit projects

## Devvit Web​

[Devvit Web](/docs/next/capabilities/devvit-web/devvit_web_overview) lets you use most web technologies to build your app, and we’ve created a few templates with preinstalled libraries to help you get started. You can clone the repos just like you did in the quickstart.

  * [React starter](https://github.com/reddit/devvit-template-react) \- a boilerplate project scaffolding to help you kickstart your React project. It includes preinstalled libraries for Devvit, Vite, React, Express, Tailwind, and TypeScript for faster development.

  * [Three.js starter](https://github.com/reddit/devvit-template-threejs) \- a tower blocks example that shows you how to create 3D graphics in the browser. It includes preinstalled libraries for Devvit, Vite, Three.js, Express, and TypeScript. This template is great for visualizations and games.

  * [Phaser starter](https://github.com/reddit/devvit-template-phaser) \- a feature-rich HTML5 game framework for building 2D games in the browser. It includes preinstalled libraries for Devvit, Vite, Phaser, Express, and TypeScript. This template is good for handling physics, animations, input, sound, and asset management.

  * [Hello world](https://github.com/reddit/devvit-template-hello-world/tree/main) \- a simple template to build a counter app with no frameworks or opinions.

## Devvit Blocks​

[Devvit Blocks](/docs/next/capabilities/blocks/overview) lets you build applications that run inside of a Reddit post, using Reddit's own design system: optimized for performance and cross-platform compatibility.

  * [Blocks Empty Template](https://github.com/reddit/devvit-template-blocks) \- an empty project leveraging Devvit Blocks

  * [Payments Template](https://github.com/reddit/devvit-template-payments) \- a template that contains all boilerplate code to enable [Devvit Payments](/docs/next/earn-money/payments/payments_overview) in your Blocks app.

## Mod Tools​

Devvit allows you to build custom mod tools, to help Moderators on Reddit manage the conversations in their subreddits, keeping their communities safe.

  * [Mod tool template](https://github.com/reddit/devvit-template-mod-tool) \- a fully functional repository containing the code for Comment Mop, a mod tool that helps moderators clear a comment and all of its descendants. This template shows [Menu Actions](/docs/next/capabilities/client/menu-actions) and [Reddit API](/docs/next/capabilities/server/reddit-api) at work.

## Contributing​

Do you have another template for a framework in mind? You can add to our library — learn how to [contribute a template](https://github.com/reddit/devvit-examples)! Here’s an example of a [tRPC template](https://github.com/reddit/devvit-examples/tree/main/examples/trpc).

  * Devvit Web
  * Devvit Blocks
  * Mod Tools
  * Contributing

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/import_DR/import_documentation/20260204_020801__/triggers.md

# triggers

Source: https://developers.reddit.com/docs/capabilities/server/triggers

On this page

Triggers allow your app to automatically respond to specific events or actions within a Reddit community. Use triggers to build automation, moderation, and engagement features that react to user or moderator activity.

## What are triggers?​

A trigger is an action you can build into your app that will occur automatically when a specified condition is met. For example, you can set up a trigger to respond when a new post is submitted, a comment is created, or a moderator takes action.

## Supported trigger types​

Event triggers let your app automatically respond to a user's or moderator's action. The following trigger types are supported:

  * `onPostSubmit`
  * `onPostCreate`
  * `onPostUpdate`
  * `onPostReport`
  * `onPostDelete`
  * `onPostFlairUpdate`
  * `onCommentCreate`
  * `onCommentDelete`
  * `onCommentReport`
  * `onCommentSubmit`
  * `onCommentUpdate`
  * `onPostNsfwUpdate`
  * `onPostSpoilerUpdate`
  * `onAppInstall`
  * `onAppUpgrade`
  * `onModActions`
  * `onModMail`
  * `onAutomoderatorFilterPost`
  * `onAutomoderatorFilterComment`

A full list of events and their payloads can be found in the [EventTypes documentation](/docs/api/public-api/@devvit/namespaces/EventTypes). For more details on Mod specific actions, see [ModActions](/docs/api/redditapi/models/interfaces/ModAction) and [ModMail](/docs/api/public-api/type-aliases/ModMailDefinition).

## Setting up triggers​

### 1\. Add triggers and endpoints to `devvit.json`​

  * Devvit Web
  * Devvit Blocks / Mod Tools

Declare the triggers and their corresponding endpoints in your `devvit.json`:
    
    
    "triggers": {  
      "onAppUpgrade": "/internal/on-app-upgrade",  
      "onCommentCreate": "/internal/on-comment-create",  
      "onPostSubmit": "/internal/on-post-submit"  
    }  
    

Declare the triggers in your `devvit.json`:
    
    
    {  
      "name": "your-app-name",  
      "blocks": {  
        "entry": "src/main.tsx",  
        "triggers": ["onPostCreate"]  
      }  
    }  
    

### 2\. Handle trigger events in your server logic​

  * Devvit Web
  * Devvit Blocks / Mod Tools

Listen for the events in your server and access the data passed into the request:

server/index.ts
    
    
      const router = express.Router();  
      
      // ..  
      
      router.post('/internal/on-app-upgrade', async (req, res) => {  
        console.log(`Handle event for on-app-upgrade!`);  
        const installer = req.body.installer;  
        console.log('Installer:', JSON.stringify(installer, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
      
      router.post('/internal/on-comment-create', async (req, res) => {  
        console.log(`Handle event for on-comment-create!`);  
        const comment = req.body.comment;  
        const author = req.body.author;  
        console.log('Comment:', JSON.stringify(comment, null, 2));  
        console.log('Author:', JSON.stringify(author, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
      
      router.post('/internal/on-post-submit', async (req, res) => {  
        console.log(`Handle event for on-post-submit!`);  
        const post = req.body.post;  
        const author = req.body.author;  
        console.log('Post:', JSON.stringify(post, null, 2));  
        console.log('Author:', JSON.stringify(author, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
    

Handle trigger events in your main file. Example (`src/main.tsx`):
    
    
    import { Devvit } from '@devvit/public-api';  
      
    // Handling a PostSubmit event  
    Devvit.addTrigger({  
      event: 'PostSubmit', // Event name from above  
      onEvent: async (event) => {  
        console.log(`Received OnPostSubmit event:\n${JSON.stringify(event)}`);  
      },  
    });  
      
    // Handling multiple events: PostUpdate and PostReport  
    Devvit.addTrigger({  
      events: ['PostUpdate', 'PostReport'], // An array of events  
      onEvent: async (event) => {  
        if (event.type == 'PostUpdate') {  
          console.log(`Received OnPostUpdate event:\n${JSON.stringify(request)}`);  
        } else if (event.type === 'PostReport') {  
          console.log(`Received OnPostReport event:\n${JSON.stringify(request)}`);  
        }  
      },  
    });  
      
    export default Devvit;  
    

## Best practices​

  * Avoid creating recursive triggers that could cause infinite loops or crashes (for example, a comment trigger that creates a comment).
  * Always check the event payload to ensure your app is not the source of the event before taking action.
  * Review the [EventTypes documentation](/docs/api/public-api/@devvit/namespaces/EventTypes) for details on event payloads.

  * What are triggers?
  * Supported trigger types
  * Setting up triggers
    * 1\. Add triggers and endpoints to `devvit.json`
    * 2\. Handle trigger events in your server logic
  * Best practices

---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/packages/game-01-strategy/devvit.yaml

name: get-rich-lazy
version: 0.0.1
scheduler:
  hourly_tick: 0 * * * *


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/packages/game-02-trivia/devvit.yaml

name: hyper-hive-minds
version: 0.0.1
scheduler:
  daily_reset: 0 0 * * *


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/packages/game-03-meme/devvit.yaml

name: meme-wars
version: 0.0.1
scheduler:
  process_queue: '* * * * *'


---

## /Users/cosmopax/Desktop/projx/reddit_hackathon_games/packages/game-04-duel/devvit.yaml

name: outsmarted-again
version: 0.0.1
