# Work trial presentation curation

A presentation-only workspace for a 45-minute work-trial presentation: 21 directly authored HTML slides (inserts 4.5 and 9.5 included; slide 17 removed), 29 minutes of narration and 16 minutes available for demo and discussion.

The research system and demo application remain separate, read-only sources. This repo stores narrative decisions, page-level content, visual selections, hyperlinks, citations, and future generated deck artifacts.

## Start here

```sh
npm run validate
npm run build
npm run preview
```

Open `http://localhost:4173` while previewing, or open `build/index.html` directly. Use arrow keys to navigate, `N` for notes and sources, the fullscreen button to present, and click any screenshot to enlarge the original evidence. Browser printing produces one slide per page.

To review the proposed 20-page storyline, run `npm run preview:workshop` and open `http://localhost:4173/storyline-workshop.html`. Comments and answers autosave in the browser. Export the collaboration JSON when the review is ready to merge into the slide specs.

Edit the numbered sections in `presentation.html` directly. The build copies authored HTML and local evidence; it does not generate slides from bullet arrays. Source provenance lives in `sources/manifest.json` and crop selections in `sources/assets.json`. The older `slides/` and `deck.json` are retained as historical outlines, not the rendered deck's source.

## Repository map

- `presentation.html`: authored 21-slide presentation, shared styles, notes and navigation
- `deck.json` and `slides/`: historical outline specs
- `storyline.json`: 20-page working narrative used by the collaboration workshop
- `design/`: coherent theme variants, type scale, color, and layout rules
- `sources/`: pinned source references and visual candidate registry
- `assets/imported/`: intentionally copied presentation assets, ignored until selected
- `docs/`: curation workflow and narrative rationale
- `scripts/`: deterministic checks and status summaries
- `build/`: generated HTML deck and optional browser exports; always ignored

## Current narrative

The deck moves from the product and data to the content contract, scorer, informed baseline prompt, multi-query workflow, observed failures, GEPA and live demo. It closes with the conservative-prompt lesson and future initiatives. Source reports, original PDFs and complete notes open from the relevant slide without adding appendix pages.
