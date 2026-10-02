# Work trial presentation curation

A presentation-only workspace for curating a 45-minute work-trial presentation. The deck is capped at 20 pages and currently plans 14 main pages plus 2 appendix pages, leaving 9.5 minutes for discussion.

The research system and demo application remain separate, read-only sources. This repo stores narrative decisions, page-level content, visual selections, hyperlinks, citations, and future generated deck artifacts.

## Start here

```sh
npm run validate
npm run status
```

Edit one file in `slides/` for each page. Shared visual rules live in `design/design-system.json`; source provenance lives in `sources/manifest.json`; selectable screenshots and charts live in `sources/assets.json`.

## Repository map

- `deck.json`: timing, order, audience, and deck-wide constraints
- `slides/`: one independently curatable JSON spec per page
- `design/`: coherent theme variants, type scale, color, and layout rules
- `sources/`: pinned source references and visual candidate registry
- `assets/imported/`: intentionally copied presentation assets, ignored until selected
- `docs/`: curation workflow and narrative rationale
- `scripts/`: deterministic checks and status summaries
- `build/`: generated PPTX, PDF, and slide renders; always ignored

## Current narrative

The main deck moves from the assignment and dataset constraints to the extraction decision, evidence, scorer, product workflow, trust boundaries, and live demo. It closes with lessons and next steps. Appendix pages preserve definitions and source links without slowing the main story.

