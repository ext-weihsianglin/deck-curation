# Presentation curation repository

This repository owns presentation curation only. Treat every source repository, local data directory, report, and tracker as read-only evidence.

## Working boundary

- Write only inside this repository.
- Read source repositories from their existing checkout, GitHub, or a temporary shallow clone.
- Copy an asset into `assets/imported/` only when a slide selects it, and record its origin in `sources/assets.json`.
- Keep generated HTML and browser exports in `build/`.
- Never edit, commit, run migrations against, or reorganize the research system, demo webapp, datasets, reports, or source documentation while doing deck work.

## Curation workflow

Read `docs/CURATION-WORKFLOW.md` before changing slide structure or rendering the deck. Read `design/design-system.json` before changing slide appearance. Each page lives in one numbered file under `slides/`; preserve coherence by choosing an existing theme variant and layout before proposing a new one.

Run `npm run validate` after changing the deck manifest, slide specs, source registry, or asset registry. Completion means the validator passes and every factual claim names at least one registered source.
