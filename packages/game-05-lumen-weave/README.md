# Lumen Weave

**Reshape a neon grid in 9 moves. Or don't. The light doesn't judge.**

A high-contrast grid puzzle where every tap bends a live light-field. Match a daily target pattern using three nonlinear sigils -- each one warps the board in a different way. Think Rubik's Cube meets a plasma lamp.

## How It Works

- **Daily target pattern** -- deterministic seed from the date, same puzzle for everyone
- **Three sigils:**
  - **Prism Burst** -- pulses a cross around your tapped cell
  - **Orbit Fold** -- rotates a local ring around your tap point
  - **Phase Lattice** -- twists row/column + diagonal channels
- **9 moves** to match the target. Solve fast for high flux, partial solves still score
- **Resonance Echo** -- improving your match fills a resonance meter; at full charge, your next move mirrors across the board
- **5x5 compact board** -- small grid, deep combinatorics

## Tech

Devvit native blocks (no webview), deterministic day seed, compact numeric board state, Redis-backed leaderboard via shared primitives.

```bash
npm install
devvit upload
```

## Part of Something Bigger

Lumen Weave trains spatial reasoning and transformation logic -- the ability to think several moves ahead through nonlinear operations. It's the same cognitive muscle used for understanding state machines, signal processing, and any system where inputs propagate through layers of transformation. A puzzle-shaped primer for the Age of Mind.

---

*Built for the Reddit Daily Games Hackathon 2026. The grid remembers every move you didn't make.*
