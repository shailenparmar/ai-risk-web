# AI Risk Web — project brain

Interactive concept map of 80,000 Hours' "11 essential resources on AI risk" (2025 edition).
67 concept briefings + 11 reading dossiers + 8 theme pages, ~290 links, all in ONE self-contained
HTML file — no libraries, no build step, everything hand-rolled on canvas.

**Live (canonical — SINGLE source of truth):** https://airiskweb.com — the primary URL, serves directly
  (no redirect), URL stays put. Portfolio card links here directly. www.airiskweb.com also works.
  - Own standalone Cloudflare Worker (`wrangler.jsonc` in this repo, name `airiskweb`), deployed via `./deploy-domain.sh`.
  - **ONE deploy, always:** `./deploy-domain.sh`. There is no longer a copied "mirror" anywhere.
  - DNS: attached via a zone-level Workers Route (`airiskweb.com/*` → `airiskweb` Worker); the old 301 redirect
    rule was deleted (2026-07-07, manual dashboard action — the wrangler token only has zone:read, not DNS write,
    so this step can't be automated).
  - **Legacy shailenparmar.com paths now 301-redirect here** (2026-07-07): `/airiskweb/*`, `/airisk*`, and
    `/ai-risk-web*` → `https://airiskweb.com/`, via `public/_redirects` in the shailenparmar.com repo. The old
    duplicate copy (`public/airiskweb/index.html`) was DELETED. `build.sh` here is RETIRED (stub that errors out) —
    do NOT recreate the mirror. Editing the app never touches the shailenparmar.com repo now.
**Portfolio card:** 2nd project in `~/projects/shailenparmar.com/src/pages/Design.tsx`; thumbnail `public/design/ai-risk-web.png`;
  links to https://airiskweb.com directly.

## Files here

- `app.html` — THE canonical source (everything: CSS, data, renderer, UI). Edit this.
- `check.mjs` — data-integrity gate (`node check.mjs`): every rel/src/concept/walk/crux/vs id must resolve,
  walks 5+ stops with 30+ char notes, walk stops must be among the source's concepts, no orphan nodes.
  RUN AFTER EVERY DATA EDIT.
- `preview.sh` — wraps app.html + serves http://localhost:8931/local-test.html for review.
- `build.sh` — RETIRED 2026-07-07 (now a stub that errors). The mirror is gone; use `./deploy-domain.sh`.
- `capture-card.mjs` — regenerates the portfolio thumbnail (puppeteer-core borrowed from
  `~/projects/good-days-mobile-design/node_modules`; hides panel+header, label-aware refit, web only,
  NO cursor/hover state). Needs preview server running.
- `HISTORY.md` + `history/` — archive of every deployed version (v01 = original from-scratch dark build,
  2026-07-05), recovered from the `shailenparmar.com` deploy git history because the early sessions predate
  this repo. Each `history/vNN_*.html` is a complete runnable snapshot. Regenerate/extend by extracting new
  deploy commits from the site repo the same way.

## Architecture (all inside app.html)

- **Data:** `THEMES` (8, radial: Foundations center, 7 on a 560-radius ring, each with `desc`),
  `SOURCES` (11 readings: blurb, claims, concepts, url), `CONCEPTS` (67: blurb `b`, rel, src),
  `VS` (13 opposition pairs → dashed red edges; audited 2026-07-06), `CRUX` (16 crux boxes), `WALKS`
  (per-reading ordered stops with hand-written notes).
- **Layout:** deterministic force sim (seeded PRNG, 420 iterations, frozen) → identical geography every visit.
  Theme labels positioned by `themeLabelPos()` — uniform gap beyond the cluster's outermost node in the
  label's own direction; per-theme overrides `la` (angle) / `lp` (pad). `fit()` includes label bboxes.
- **Renderer:** 2D canvas, pan/zoom (wheel zoom `Math.exp(-deltaY*0.000805)`, +15% per user 2026-07-06;
  zoom-out floor = `minZoom()` = `fit().z*0.85`, i.e. only a slight touch past the esc/reset framing),
  hover/selection dimming, label collision by priority, theme labels are hover+click hit-tested
  (`themeLabelBoxes`).
- **Panel (single, DOCKED left sidebar, 376px; `PANEL_W`=388):** flush full-height column (no floating
  card), thin right divider, no shadow. Wordmark "AI RISK WEB" is the first *scrolling* line of the body
  (`#panelScroll::before`; the floating header `.brand` is `display:none` on desktop) — scrolls off, never
  overlays. Home (description → readings → themes) ⇄ detail pages. `select(id)`, `selectTheme(k)`,
  `navStack` history (◀ BACK), ◀ HOME. Back/home buttons use ◀ (bigger head) and are bold. Reading numbers
  render as circled badges matching the map source circles (plain 1..11, no zero-pad). Desktop redesign is
  in an `@media (min-width:861px)` block appended INSIDE the main `<style>`; mobile (`max-width:860px`) keeps
  the bottom-sheet. NOTE: two overrides (saturated `tintStyle`, matrix `--tc`/label strip) live in a small JS
  block at the END of the main `<script>` (before `</script>`) — keep them inside the single script/style so
  `check.mjs`'s greedy `<script>…</script>` regex still parses.
- **Walks:** reading title+byline in dossier formatting above a blue note box; PREV / "n / N" / NEXT;
  arrow keys; Esc exits walk first.
- **Matrix tab:** concepts × readings grid; tinted theme header pills (clickable → theme page); source
  column headers are the reading name only (NO number, NO "CONCEPT / READING" label — reclaims vertical
  space), 11.5px. Rows/hover/selected tint toward the row's own theme color via `--tc` (`color-mix`, not
  blue). 6px corners (= search bar), `overscroll-behavior:none` (no rubber-band). 11px dots.

## Settled design decisions (user rulings — DO NOT relitigate)

1. Light theme (white/ink, ai-2027.com vibe). Dark theme was v1, rejected.
2. 2D always. 3D was v0, rejected as gimmicky.
3. Single left panel; map gets all remaining space. No dual columns.
4. Tabs say WEB | MATRIX (segmented control, white raised pill — NOT blue underline, "vibecodey").
5. Reading-walks (per-source) not cross-source trails; counter word is "concept" never "stop".
6. NO study features — no "mark as studied", no progress counters. Only walk-completion ✓ (localStorage `aira-walks`).
7. Color system = "option 2.5", saturation bumped 2026-07-06: `tintStyle(hex)` → 26% wash + 85% border + `shade(hex,0.60)` text (was 18/75/0.62 — user wanted more pop).
   Used for: theme sidebar rows, theme tag on concept pages (clickable), concept chips, matrix theme pills.
8. Themes are first-class pages (click theme anywhere → description page, camera frames cluster,
   "Other themes" chips for hopping). Theme labels on the web: hover spotlights, click opens page —
   NEVER toggles visibility. No hide/show UI at all (themeOn machinery still exists, reset turns all on).
9. Esc / double-click background / wordmark click = full reset AND return to WEB view.
   - Refresh RESTORES the current page (node/theme/walk-position/web-vs-matrix) AND the ◀ BACK chain
     (`nav` field), persisted to localStorage `aira-view` via `saveState()`; `restoreState()` runs last
     in the script (after `histDepth`/`pushHistLevel` exist — it calls `startWalk`). The three resets
     above still clear to home.
   - HOME/BACK route through `goHistBack()`, which clamps to `uiDepth()` and mixes history unwinds
     with direct `unwindOneLevel()` calls (`extraUnwind`) because after a refresh `histDepth` resets
     to 0 while the restored UI is deep. NEVER let it reach `history.go(0)` — browsers reload on that
     (this was the "HOME click does nothing" bug, 2026-07-08). Load also does
     `history.replaceState({d:0})` to clear stale pre-refresh depth stamps; keep it try/catch-wrapped
     (check.mjs evals the script in Node, where `history` doesn't exist).
10. Minimal chrome: no stats, no instructions except "double-click or esc to reset" (bottom-right).
    Section headers: DESCRIPTION / READINGS / THEMES, plain grey.
11. Home description is first-person, links "11 resources" inline, includes the no-affiliation note
    (user's exact copy — don't rewrite).
12. Walk notes must NEVER claim a red dashed edge that isn't in VS. Content claims trace to sources
    (e.g. AI 2027 note cites their actual bounty program).
13. ONE hover cue site-wide (2026-07-08, revised same day): the element's OWN border thickens 1px→2px
    with padding reduced 1px to compensate (zero layout shift — verified per element). Color-neutral by
    ruling: NO blue/accent border on hover ("blue isn't neutral, it clashes"), and NEVER
    `filter:brightness()` — it shades inner elements (e.g. the white circled-number badge). Applies to
    chips, eyebrow theme tag, home theme ovals, matrix theme pills, backBtn, walkBtn, tn-nav, linkout.
    Rows (.rd/.sr/matrix) keep their background-wash hover; text links keep accent underline/color.
    If an element's padding changes, update its :hover padding pair too.
    GOTCHA (2026-07-08 flicker regression): the home theme ovals' contiguous hit zones (`.lg::before`
    fills the 4px legend gap) anchor to the padding box, which the hover cue shrinks — the hit zone
    must stay IDENTICAL in rest+hover states or hover oscillates mid-gap. `.lg::before` (-3px) and
    `.lg:hover::before` (-4px) compensate; keep them in sync with any `.lg` border/padding change.
    Border-strength hierarchy: `--line` (#E2E5EB) is for DIVIDERS/surfaces only; interactive controls
    (backBtn, tn-nav, linkout) use `--ctrl` (ink 45%) so they read as pressable — content pills stay
    strongest (theme 85% / ink 60%). Rest weight is always 1px (2px is the hover cue). WEB|MATRIX tabs,
    search input, and the `.k` key-hint stay on --line (chrome/non-interactive, not action buttons).
    Full ruling: rest-state COLOR says what a thing is (blue text = link/action, theme tint = concept,
    ink = content); hover/focus says you're on it via INTENSITY ONLY, never a hue change. Search:
    hover thickens, focus = thickened + --ctrl border (mobile media has its own padding pair).
    titleLink hovers to an underline (+ ↗ glyph darkens); footer links intensify muted→ink. The only
    accent-on-hover rule left is .plink (blue link intensifying its own blue underline — allowed:
    intensity of self). The wordmark (mobile .brand AND the desktop #panelScroll::before, which is
    click-to-reset via a hit-test on #panelScroll) stays ink with NO hover/active hue — user ruling
    2026-07-09: the reset itself is the feedback.

14. Copy register — SITE-WIDE (2026-07-08): editorializing has NO place on this site. Every piece of
    copy (walk notes, briefings, theme descriptions, crux boxes, summaries) is an objective summary
    whose job is sharing useful condensed information — plain declarative sentences, no conversational
    idioms, no editorial winks, no nonchalance, no voice-y flourishes. Example rejection: "everything
    else follows from taking it seriously" → "The rest of the paper works out the consequences."
    This extends the earlier de-editorializing passes (ddc26eb voice restyle, 513c3b6, 6ca717b) —
    treat those as precedent, not one-offs. When writing NEW copy, default to the register of an
    encyclopedia entry, not a newsletter.
    Full-content register audit ran 2026-07-09 (4 parallel reviewers, 15 fixes applied). User rulings
    from it: first-person plural "we/us" is ALLOWED (mirrors the literature's framing, not reader
    address); vivid-but-factual compressions stay ("Genius as a utility.", "nuclear-plant territory",
    "random SF startup", theme P's "worth fighting for"). Banned residue patterns: evaluative
    adverbs/superlatives in site voice (strikingly/landmark/rigorous/"strongest available"), casual
    idioms (punt, tap out, "& co.", "back in 2020"), insinuating adverbs ("quietly assume"),
    generic-you ("a utility you can point at problems"), newsletter framing ("The takeaway is...").

## Concurrent sessions (ACTIVE as of 2026-07-09)

Another Claude session is editing content in this same repo/working tree (e.g. f03325f lock-in copy,
23adad8 epistemics copy). Protocol to avoid steamrolling it:
1. Re-read the target lines IMMEDIATELY before every edit — never trust cached file state.
2. Before committing: `git status` + `git log --oneline -3` first. NEVER blanket `git add -A` without
   looking — stage only your own changes; if unrelated uncommitted changes exist, leave them unstaged
   and say so.
3. Before deploying: remember deploy ships the WHOLE current app.html, including the other session's
   uncommitted work-in-progress. If the tree is dirty with changes you didn't make, hold the deploy
   and check with the user.
4. If an Edit fails on a stale old_string, assume the other session touched that region — re-read and
   reconcile, don't force.

## Workflow

1. Edit `app.html` → `node check.mjs` → `./preview.sh` → user reviews at localhost:8931.
2. Deploy = `./deploy-domain.sh` (that's it — airiskweb.com is the only copy), then `git add -A &&
   git commit && git push` in THIS repo. The shailenparmar.com repo is only touched if you change the
   redirects/portfolio, not for app edits.
   **AUTOPUSH (his standing instruction, 2026-07-09): for SMALL changes — copy tweaks, small UI/UX
   fixes, one-liners — deploy+commit+push immediately after check.mjs passes, without waiting for
   his "push", unless he says otherwise in the moment. Bigger work (new features, redesigns, data
   restructuring) still goes through preview review first.**
3. Artifact mirror (dev history): republish to
   https://claude.ai/code/artifact/043ebb40-e1ce-450c-8ff1-0aa9678a28c7 via the Artifact tool with `url` param.
4. Verification gotcha: Chrome extension screenshots fail on artifacts/minimized windows — test against
   localhost with javascript_tool DOM assertions instead. Beware stale tabs: always cache-bust (`?v=n`).
   BIGGER gotcha (2026-07-09): when the Chrome window is minimized/backgrounded, style recalc is
   throttled — javascript_tool DOM mutations then report STALE computed styles/rects (a class add
   showed transform:identity; even rAF hangs and times out CDP). If mutation-based assertions look
   impossible, don't debug the CSS — verify headlessly instead: puppeteer-core borrowed from
   good-days-mobile-design (see capture-card.mjs / the scratchpad test-notch.mjs pattern,
   setViewport 390x700 isMobile for the bottom sheet).

## State as of 2026-07-06

FULLY DEPLOYED AND IN SYNC: app.html == site public/airiskweb/index.html == live. (Artifact mirror NOT
re-synced after the 2026-07-06 redesign — republish if you want it current.)
Light theme, theme pages, nav history, matrix restyle, light thumbnail shipped earlier.
**2026-07-06 redesign shipped:** docked left sidebar + scrolling wordmark; trimmed padding + narrower column
(more map space); matrix cleanup (no numbers/label, bigger source titles, theme-color hover/selected, 6px
corners, no rubber-band); saturated theme tints (26% wash); circled reading-number badges; bolder ◀ back/home;
+15% zoom sensitivity + zoom-out floor; 3 new VS "in tension" edges (13 total); title "an interactive concept
map for AI risk". **Favicon:** airiskweb-specific `public/airiskweb/favicon.svg` (dashed-red tension pair,
dark-mode aware) referenced as relative `favicon.svg` in build.sh — do NOT point it at the site-wide `/favicon.svg`.
NOTE: a second Claude was concurrently building the mobile bottom-sheet (`#panelHandle`, `panelCollapsed`,
`wirePanelHandle`, `botOccupied`) in the same app.html; that work shares the file and is now live too.

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
