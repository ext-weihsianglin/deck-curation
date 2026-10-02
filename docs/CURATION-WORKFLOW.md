# Curation workflow

## Current HTML authoring workflow

The user requested a directly authored presentation after rejecting the generated bullet layouts. `presentation.html` is now the presentation source. Each numbered section owns its composition, evidence, source IDs, speaking time and notes. Keep the common CSS coherent while composing each slide around its evidence. The legacy numbered JSON specs are historical outlines.

`npm run build` copies the authored presentation and selected assets into `build/`. `npm run validate` checks the actual 21-slide HTML, narration budget, source registration, asset paths and navigation script. The user requested inserts 4.5 and 9.5 and removal of slide 17. Existing IDs remain stable. Narration totals 29 minutes, leaving 16 minutes for demo and discussion. The workshop remains separately editable in `storyline.json`.

The sections below describe the earlier JSON workflow for historical reference.

## 1. Curate a page

Open the numbered file in `slides/`. Edit the page title, purpose, takeaway, bullets, visual selection, links, source references, and speaker notes. Keep the page status as `outline` until the claim and visual are both defensible.

Every page chooses one theme variant and one layout from `design/design-system.json`. Add a new shared variant only when the existing system cannot express a recurring need across multiple pages.

## 2. Select evidence

Register factual sources in `sources/manifest.json`. Register screenshots and charts in `sources/assets.json` with a pinned revision, path, caption, and intended crop. A slide refers to an asset by `asset_id`; it does not embed an untracked filesystem path.

When an asset becomes final, copy it into `assets/imported/` without altering the source file. Keep the source URL and revision in the registry.

## 3. Preserve the talk budget

The main deck must fit within `presentation_minutes - reserved_qa_minutes`. Appendix pages count toward the 20-page limit but not the spoken run time. The live demo has a fixed page and explicit fallback notes so a failed network or model call does not derail the talk.

## 4. Render the HTML deck

Run `npm run build`. The renderer consumes the page specs, shared design system, and registered assets and writes `build/index.html`. The curation files remain the source of truth. Use `npm run preview` for a local server and browser-based visual review.

## 5. Validate

Run `npm run validate`. The check enforces page count, ordering, timing, valid theme/layout choices, registered sources, registered visuals, unique hyperlinks, and required demo fallback notes. A finished change also requires a fresh HTML build and visual review at a 16:9 viewport.
