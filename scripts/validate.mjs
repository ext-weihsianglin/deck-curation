import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
const errors = [];

const deck = await readJson("deck.json");
const design = await readJson(deck.design_system);
const sourceRegistry = await readJson("sources/manifest.json");
const assetRegistry = await readJson("sources/assets.json");
const sourceIds = new Set(sourceRegistry.sources.map((source) => source.id));
const assetIds = new Set(assetRegistry.assets.map((asset) => asset.id));
const themeIds = new Set(Object.keys(design.theme_variants));
const layoutIds = new Set(design.layouts);

const slideFiles = (await readdir(path.join(root, "slides")))
  .filter((file) => /^\d{2}-.+\.json$/.test(file))
  .sort();
const slides = await Promise.all(slideFiles.map((file) => readJson(path.join("slides", file))));
const slideById = new Map(slides.map((slide) => [slide.id, slide]));

if (deck.slide_order.length > deck.max_pages) {
  errors.push(`Deck has ${deck.slide_order.length} pages; maximum is ${deck.max_pages}.`);
}
if (deck.slide_order.length !== new Set(deck.slide_order).size) errors.push("Deck order contains duplicate slide IDs.");
if (slides.length !== deck.slide_order.length) errors.push(`Found ${slides.length} slide files but ${deck.slide_order.length} ordered slides.`);

for (const id of deck.slide_order) {
  if (!slideById.has(id)) errors.push(`Ordered slide ${id} has no matching file.`);
}

for (const slide of slides) {
  const filename = slideFiles[slides.indexOf(slide)].replace(/\.json$/, "");
  if (slide.id !== filename) errors.push(`${filename}: id must match the filename.`);
  if (!deck.slide_order.includes(slide.id)) errors.push(`${slide.id}: slide is not in deck order.`);
  if (!themeIds.has(slide.theme)) errors.push(`${slide.id}: unknown theme ${slide.theme}.`);
  if (!layoutIds.has(slide.layout)) errors.push(`${slide.id}: unknown layout ${slide.layout}.`);
  if (!slide.title || !slide.purpose || !slide.takeaway) errors.push(`${slide.id}: title, purpose, and takeaway are required.`);
  if (!Array.isArray(slide.content?.bullets) || slide.content.bullets.length > 5) errors.push(`${slide.id}: bullets must be an array with at most five entries.`);
  if (!Array.isArray(slide.source_refs) || slide.source_refs.length === 0) errors.push(`${slide.id}: register at least one source reference.`);
  for (const sourceId of slide.source_refs ?? []) {
    if (!sourceIds.has(sourceId)) errors.push(`${slide.id}: unknown source ${sourceId}.`);
  }
  if (slide.visual?.asset_id && !assetIds.has(slide.visual.asset_id)) errors.push(`${slide.id}: unknown asset ${slide.visual.asset_id}.`);
  const urls = (slide.links ?? []).map((link) => link.url);
  if (urls.length !== new Set(urls).size) errors.push(`${slide.id}: duplicate hyperlink URLs.`);
  for (const link of slide.links ?? []) {
    try { new URL(link.url); } catch { errors.push(`${slide.id}: invalid URL ${link.url}.`); }
  }
}

const spokenMinutes = slides.filter((slide) => !slide.appendix).reduce((sum, slide) => sum + slide.time_minutes, 0);
const availableMinutes = deck.presentation_minutes - deck.reserved_qa_minutes;
if (spokenMinutes > availableMinutes) {
  errors.push(`Main deck uses ${spokenMinutes} minutes; only ${availableMinutes} are available before Q&A.`);
}

const demoSlide = slideById.get("12-live-demo");
if (!demoSlide || (demoSlide.speaker_notes ?? []).filter((note) => /fallback/i.test(note)).length < 2) {
  errors.push("Live demo slide needs at least two explicit fallback notes.");
}

if (errors.length) {
  console.error("Deck validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Deck valid: ${slides.length}/${deck.max_pages} pages, ${spokenMinutes}/${availableMinutes} spoken minutes, ${deck.reserved_qa_minutes} minutes reserved for Q&A.`);

