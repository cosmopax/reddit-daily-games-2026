# Codex Handoff (local)

## Where the context pack is
- `/Users/cosmopax/Desktop/projx/reddit_hackathon_games/.codex_context_pack/20260204-032533`
- `BUNDLE.md` = concatenated docs/configs
- `MANIFEST.tsv` = checksums + sizes (integrity / change tracking)
- `TREE.txt` = repo file overview (bounded)

## What Codex should do first
1. Identify Devvit Web apps by locating `devvit.json` files.
2. For each app folder:
   - run `npm ci` (or `npm install` if no lockfile)
   - run `npm run check` (if present)
   - run `npm run dev` (or the template’s dev script)
3. Verify deploy/playtest scripts exist (`deploy`, `launch`, `login` etc. in package.json).
4. Produce a “Submission Checklist” doc (video, description, install steps, known limitations).
5. Ensure publishing flow is correct: upload → publish (and `--public` only if needed).

## Hard constraints (hackathon)
- Must be an Interactive Post (mobile + web)
- Must use Devvit Web
- Must run reliably as described

