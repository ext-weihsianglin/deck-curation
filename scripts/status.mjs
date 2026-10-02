import { readFile } from "node:fs/promises";

const deck = JSON.parse(await readFile("deck.json", "utf8"));
const slides = await Promise.all(deck.slide_order.map(async (id) => JSON.parse(await readFile(`slides/${id}.json`, "utf8"))));

console.log(`${deck.title}\n`);
for (const slide of slides) {
  const marker = slide.appendix ? "APP" : `${slide.time_minutes}m`.padStart(4, " ");
  const asset = slide.visual.asset_id ? ` · ${slide.visual.asset_id}` : "";
  console.log(`${slide.id.padEnd(28)} ${marker} · ${slide.status.padEnd(8)} · ${slide.theme}/${slide.layout}${asset}`);
}

const mainMinutes = slides.filter((slide) => !slide.appendix).reduce((sum, slide) => sum + slide.time_minutes, 0);
console.log(`\n${slides.length}/${deck.max_pages} pages · ${mainMinutes} min deck · ${deck.reserved_qa_minutes} min Q&A`);
