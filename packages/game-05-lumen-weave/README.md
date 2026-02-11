# LUMEN WEAVE

> **Part of the 2026 Reddit Daily Games Portfolio**

**Lumen Weave** is a high-contrast grid puzzle where every tap bends a live light-field.
Your objective is to match a generated target pattern in **9 moves** using three nonlinear sigils.

## Core Gameplay
- **Daily Pattern:** A deterministic daily target drives shared challenge conditions.
- **Three Sigils:**
  - **Prism Burst:** pulses a cross around your tapped cell.
  - **Orbit Fold:** rotates a local ring around your tap.
  - **Phase Lattice:** twists row/column + diagonal channels.
- **Resonance Echo:** improving your match fills a resonance meter; at full charge, your next move mirrors across the board.
- **Scoring:** solve fast for high flux; partial solves still award progress points.

## Tech Notes
- **Stack:** Devvit + TypeScript + Redis.
- **State Model:** compact 5x5 numeric board + deterministic day seed.
- **Leaderboard:** cumulative flux via shared leaderboard primitives.

## Setup
```bash
npm install
```

Upload flow:
```bash
devvit whoami
devvit upload
```

---
Built by **cosmopax** for Reddit Developers Hackathon 2026.
