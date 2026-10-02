import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('presentation.html', 'utf8');
const slides = [...html.matchAll(/<section class="slide[^>]*id="(\d+(?:\.\d+)?)"[^>]*data-minutes="([\d.]+)"[^>]*data-source="([^"]+)"/g)];
if (slides.length !== 21) throw new Error('Expected original slides minus 17, plus inserts 4.5 and 9.5');
if (new Set(slides.map(slide => slide[1])).size !== slides.length) throw new Error('Duplicate page IDs');
const minutes = slides.reduce((total, slide) => total + Number(slide[2]), 0);
if (minutes > 35) throw new Error('Talk plus demo exceeds 35 minutes');
const sources = JSON.parse(await readFile('sources/manifest.json', 'utf8')).sources;
const sourceIds = new Set(sources.map(source => source.id));
for (const slide of slides) for (const source of slide[3].split(',')) {
  if (!sourceIds.has(source)) throw new Error('Unregistered source: ' + source);
}
for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+)[^"]*"/g)) await access(match[1]);
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
if ((html.match(/class="notes"/g) || []).length !== slides.length) throw new Error('Missing speaker notes');
console.log('Presentation valid: ' + slides.length + ' slides, ' + minutes + ' minutes of narration, ' + (45 - minutes) + ' minutes available for demo and discussion.');
