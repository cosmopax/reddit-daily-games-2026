description: Critical Devvit Platform Constraints
globs: ["**/*.ts", "**/*.tsx"]
rules:
- constraint: "Max Execution Time 30s"
  mandate: "Avoid unbounded loops. Use Scheduler for batch processing."
- constraint: "Max Redis 500MB"
  mandate: "Use bit-packing. Prefer ZSET/HSET. No verbose JSON."
- constraint: "No Client Fetch"
  mandate: "All external APIs must be proxied via Server."
