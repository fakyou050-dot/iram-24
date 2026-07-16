import { chromium } from '@playwright/test';

const base = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });

const result = { home: {}, article: {}, logs: [] };
page.on('console', (msg) => result.logs.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (err) => result.logs.push(`pageerror: ${err.message}`));

try {
  await page.goto(base, { waitUntil: 'networkidle', timeout: 45000 });
  result.home.url = page.url();
  result.home.title = await page.title();
  result.home.cards = await page.locator('article').count();
  result.home.bodyText = (await page.locator('body').innerText()).slice(0, 1500);
  await page.screenshot({ path: '/tmp/iram_home.png', fullPage: true });

  const firstLink = page.locator('a[href*="/article/"]').first();
  if (await firstLink.count()) {
    await firstLink.click();
    await page.waitForLoadState('networkidle', { timeout: 45000 });
    result.article.url = page.url();
    result.article.title = await page.title();
    result.article.bodyText = (await page.locator('body').innerText()).slice(0, 1200);
    await page.screenshot({ path: '/tmp/iram_article.png', fullPage: true });
  }
} catch (e) {
  result.error = String(e);
}

console.log(JSON.stringify(result, null, 2));
await browser.close();
