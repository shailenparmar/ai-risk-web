# AI Risk Web

An interactive concept map of 80,000 Hours' [11 essential resources on AI risk](https://80000hours.org/articles/11-essential-resources-ai-risk/).

**Live: [airiskweb.com](https://airiskweb.com)**

Instead of reading eleven separate papers and essays cold, this maps out the 67 concepts they share and argue over — where they agree, where they contradict each other, and which readings anchor which ideas. Click through the web, walk a reading's key concepts in order, or scan the matrix view for the full concepts-by-source grid.

![AI Risk Web screenshot](https://shailenparmar.com/design/ai-risk-web.png)

## What it does

- **Web view** — a force-directed map of 67 concepts across 8 themes (Foundations, Governance & Strategy, Timelines & Takeoff, Scaling & Compute, Misalignment, Disempowerment, Digital Minds, Positive Futures), drawn from 11 source readings, with ~290 links between them.
- **Reading walks** — each source has a guided, ordered walk through the concepts it introduces, with a note on how it uses each one.
- **Tension edges** — dashed red lines mark direct disagreements between sources (e.g. Cotra vs. Narayanan on diffusion speed, Carlsmith vs. Kulveit et al. on sudden vs. gradual disempowerment).
- **Matrix view** — every concept × every source, at a glance.
- **Full mobile support** — a collapsible bottom sheet, free two-finger pan/zoom, and gesture-trapped in-app back navigation (a swipe back steps through your nav history before it ever leaves the page).

## How it's built

The entire thing is **one self-contained HTML file** (`app.html`) — no framework, no build step, no dependencies. Canvas-rendered force simulation with a seeded PRNG for a deterministic, identical layout on every visit. Vanilla JS throughout.

- `app.html` — the whole app: data, layout, renderer, UI. This is the only file that matters.
- `check.mjs` — a data-integrity gate. Every concept/source/walk/crux reference must resolve, every walk needs 5+ stops with real notes, no orphan nodes. Run this after any data edit.
- `preview.sh` — serves a local preview at `localhost:8931`.
- `build.sh` / `deploy-domain.sh` — wrap `app.html` into a deployable page and push it to Cloudflare (two targets: a mirror at shailenparmar.com/airiskweb/, and the canonical airiskweb.com).

## Running it locally

```bash
git clone https://github.com/shailenparmar/ai-risk-web.git
cd ai-risk-web
./preview.sh
# → http://localhost:8931/local-test.html
```

To check a data edit before committing:

```bash
node check.mjs
```

## Content accuracy

Every claim attributed to a source has been checked against that source directly — not just proofread, but independently re-verified by re-reading the actual papers/essays/scenario and confirming each summary, claim, and walk note is faithful to what the source actually argues.

---

This is a personal project with no official association with 80,000 Hours.
