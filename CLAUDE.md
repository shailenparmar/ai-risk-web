# AI Risk Web — project brain

Interactive concept map of 80,000 Hours' "11 essential resources on AI risk" (2025 edition).
67 concept briefings + 11 reading dossiers + 8 theme pages, ~290 links, all in ONE self-contained
HTML file — no libraries, no build step, everything hand-rolled on canvas.

**Live:** https://shailenparmar.com/ai-risk-web/ (old /airisk/ 301-redirects)
**Portfolio card:** 2nd project in `~/projects/shailenparmar.com/src/pages/Design.tsx`; thumbnail `public/design/ai-risk-web.png`

## Files here

- `app.html` — THE canonical source (everything: CSS, data, renderer, UI). Edit this.
- `check.mjs` — data-integrity gate (`node check.mjs`): every rel/src/concept/walk/crux/vs id must resolve,
  walks 5+ stops with 30+ char notes, walk stops must be among the source's concepts, no orphan nodes.
  RUN AFTER EVERY DATA EDIT.
- `preview.sh` — wraps app.html + serves http://localhost:8931/local-test.html for review.
- `build.sh` — wraps app.html → `shailenparmar.com/public/ai-risk-web/index.html`, `npm run build`,
  `npx wrangler deploy`. Commit+push the site repo separately after.
- `capture-card.mjs` — regenerates the portfolio thumbnail (puppeteer-core borrowed from
  `~/projects/good-days-mobile-design/node_modules`; hides panel+header, label-aware refit, web only,
  NO cursor/hover state). Needs preview server running.

## Architecture (all inside app.html)

- **Data:** `THEMES` (8, radial: Foundations center, 7 on a 560-radius ring, each with `desc`),
  `SOURCES` (11 readings: blurb, claims, concepts, url), `CONCEPTS` (67: blurb `b`, rel, src),
  `VS` (9 opposition pairs → dashed red edges), `CRUX` (16 crux boxes), `WALKS` (per-reading ordered
  stops with hand-written notes).
- **Layout:** deterministic force sim (seeded PRNG, 420 iterations, frozen) → identical geography every visit.
  Theme labels positioned by `themeLabelPos()` — uniform gap beyond the cluster's outermost node in the
  label's own direction; per-theme overrides `la` (angle) / `lp` (pad). `fit()` includes label bboxes.
- **Renderer:** 2D canvas, pan/zoom (wheel zoom `Math.exp(-deltaY*0.0007)` — DON'T make it faster),
  hover/selection dimming, label collision by priority, theme labels are hover+click hit-tested
  (`themeLabelBoxes`).
- **Panel (single, left, 392px):** home (description → readings → themes) ⇄ detail pages for
  concepts / readings / themes. `select(id)`, `selectTheme(k)`, `navStack` history (← BACK), ← HOME.
- **Walks:** reading title+byline in dossier formatting above a blue note box; PREV / "n / N" / NEXT;
  arrow keys; Esc exits walk first.
- **Matrix tab:** concepts × readings grid; tinted theme header pills (clickable → theme page),
  horizontal short-name column headers (`SHORT` map), 11px dots.

## Settled design decisions (user rulings — DO NOT relitigate)

1. Light theme (white/ink, ai-2027.com vibe). Dark theme was v1, rejected.
2. 2D always. 3D was v0, rejected as gimmicky.
3. Single left panel; map gets all remaining space. No dual columns.
4. Tabs say WEB | MATRIX (segmented control, white raised pill — NOT blue underline, "vibecodey").
5. Reading-walks (per-source) not cross-source trails; counter word is "concept" never "stop".
6. NO study features — no "mark as studied", no progress counters. Only walk-completion ✓ (localStorage `aira-walks`).
7. Color system = "option 2.5": `tintStyle(hex)` → 18% wash + 75% border + `shade(hex,0.62)` text.
   Used for: theme sidebar rows, theme tag on concept pages (clickable), concept chips, matrix theme pills.
8. Themes are first-class pages (click theme anywhere → description page, camera frames cluster,
   "Other themes" chips for hopping). Theme labels on the web: hover spotlights, click opens page —
   NEVER toggles visibility. No hide/show UI at all (themeOn machinery still exists, reset turns all on).
9. Esc / double-click background / wordmark click = full reset AND return to WEB view.
10. Minimal chrome: no stats, no instructions except "double-click or esc to reset" (bottom-right).
    Section headers: DESCRIPTION / READINGS / THEMES, plain grey.
11. Home description is first-person, links "11 resources" inline, includes the no-affiliation note
    (user's exact copy — don't rewrite).
12. Walk notes must NEVER claim a red dashed edge that isn't in VS. Content claims trace to sources
    (e.g. AI 2027 note cites their actual bounty program).

## Workflow

1. Edit `app.html` → `node check.mjs` → `./preview.sh` → user reviews at localhost:8931.
2. On his "push": `./build.sh`, then in `~/projects/shailenparmar.com`:
   `git add -A && git commit && git push`.
3. Artifact mirror (dev history): republish to
   https://claude.ai/code/artifact/043ebb40-e1ce-450c-8ff1-0aa9678a28c7 via the Artifact tool with `url` param.
4. Verification gotcha: Chrome extension screenshots fail on artifacts/minimized windows — test against
   localhost with javascript_tool DOM assertions instead. Beware stale tabs: always cache-bust (`?v=n`).

## State as of 2026-07-06

FULLY DEPLOYED AND IN SYNC: app.html == site public/ai-risk-web/index.html == live == artifact.
Light theme, theme pages, nav history (← BACK), bottom nav rows, matrix restyle, light thumbnail all shipped.

**Accuracy audit (2026-07-06):** 11 parallel agents verified every source-attributed claim against the
actual sources (~280 assertions). ~60 corrections applied. Notable fixes to KEEP (do not regress):
- Carlsmith multiplies to ~5%; >10% is his later 2022 holistic revision (3 locations). Year is 2022.
- Karnofsky quote is "we should be doing a double take..." — the earlier "sweating profusely" was FABRICATED.
- Erdil's claim is ~20yr median to full automation of REMOTE WORK (not "the economy"); no diffusion/Narayanan
  alliance (his s4 walk stop is 'takeoff', concept 'diffusion' is NOT sourced to s4); Moravec point is speed/cost.
- Cotra in s6: back-loaded impacts + illegitimate-uses-not-gated; the substitution-vs-adoption argument was
  fabricated. Bio-anchors framed as background "not the dialogue itself". s6 URL is issues/10.
- MacAskill/Moorhouse: no severity rankings ("most serious/underrated/among the worst" all removed); "value
  lock-in" not "premature lock-in"; century of TECHNOLOGICAL progress.
- Aschenbrenner: The Project ≠ "nationalization" (he disclaims it); decade of ALGORITHMIC progress into a year.
- Epoch s7: HBM is SK Hynix not TSMC; algorithmic-progress 3×/yr is Epoch's SEPARATE work; synthetic data is
  the excluded speculative upside; latency wall 10⁵–10⁶× (interconnect, not light-speed).
- Kulveit et al.: no "royalty" metaphor, no "welfare states" claim; concentration walk note reflects their
  power-passes-to-AI-itself addition.
- AI 2027: race ending = extinction; probes fire in BOTH endings (branch = the 6–4 vote); bounties past tense.
- Welfare paper: authors "Long, Sebo, Butlin, et al."; predictive processing not IIT; acknowledge→assess→prepare.
- Amodei: compression claim is biology/neuroscience only; courts/consensus/services not "journalism";
  "neuroscientist by training", not computational.
RULE: any NEW content claim about a source must be verified against the source before shipping.
