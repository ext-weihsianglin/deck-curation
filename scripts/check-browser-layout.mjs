import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 957 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('build/qa', { recursive: true });
await page.goto(process.env.DECK_URL || 'http://localhost:4173/');
await page.evaluate(() => document.fonts.ready);
const results = [];
const slideCount = await page.locator('.slide').count();
for (let index = 0; index < slideCount; index++) {
  await page.selectOption('#jump', String(index));
  const result = await page.locator('.slide.active').evaluate(slide => {
    const footerTop = slide.querySelector('.foot').getBoundingClientRect().top;
    const overflow = Array.from(slide.children)
      .filter(child => !child.matches('.foot,.notes,.cover-orbit,.cover-visual'))
      .filter(child => child.getBoundingClientRect().bottom > footerTop - 8)
      .map(child => ({ element: child.className || child.tagName, bottom: child.getBoundingClientRect().bottom, footerTop }));
    const brokenImages = Array.from(slide.querySelectorAll('img')).filter(img => !img.complete || !img.naturalWidth).map(img => img.src);
    return { slide: slide.id, overflow, brokenImages };
  });
  results.push(result);
  await page.locator('.slide.active').screenshot({ path: `build/qa/slide-${result.slide}.png` });
}
await page.selectOption('#jump', '0');
await page.locator('.slide.active .screen').first().click();
if (!await page.locator('#lightbox').evaluate(dialog => dialog.open)) errors.push('Evidence zoom failed');
await page.locator('#lightbox button').click();
await page.locator('#notes-button').click();
if (!await page.locator('#notes-panel').isVisible()) errors.push('Notes failed');
await page.locator('#close-notes').click();
await page.locator('#next').click();
if (await page.locator('.slide.active').getAttribute('id') !== '02') errors.push('Navigation failed');
await writeFile('build/qa/checks.json', JSON.stringify({ results, errors }, null, 2));
await browser.close();
const failures = results.filter(result => result.overflow.length || result.brokenImages.length);
console.log(JSON.stringify({ checked: results.length, failures, errors }, null, 2));
if (failures.length || errors.length) process.exitCode = 1;
