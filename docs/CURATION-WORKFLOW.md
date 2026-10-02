# Curation workflow

## 1. Curate a page

Open the numbered file in `slides/`. Edit the page title, purpose, takeaway, bullets, visual selection, links, source references, and speaker notes. Keep the page status as `outline` until the claim and visual are both defensible.

Every page chooses one theme variant and one layout from `design/design-system.json`. Add a new shared variant only when the existing system cannot express a recurring need across multiple pages.

## 2. Select evidence

Register factual sources in `sources/manifest.json`. Register screenshots and charts in `sources/assets.json` with a pinned revision, path, caption, and intended crop. A slide refers to an asset by `asset_id`; it does not embed an untracked filesystem path.

When an asset becomes final, copy it into `assets/imported/` without altering the source file. Keep the source URL and revision in the registry.

## 3. Preserve the talk budget

The main deck must fit within `presentation_minutes - reserved_qa_minutes`. Appendix pages count toward the 20-page limit but not the spoken run time. The live demo has a fixed page and explicit fallback notes so a failed network or model call does not derail the talk.

## 4. Generate later

Generation should consume these page specs, the shared design system, and only registered assets. Generated PPTX, PDF, thumbnails, and QA renders belong in `build/`. The curation files remain the source of truth.

## 5. Validate

Run `npm run validate`. The check enforces page count, ordering, timing, valid theme/layout choices, registered sources, registered visuals, unique hyperlinks, and required demo fallback notes.

