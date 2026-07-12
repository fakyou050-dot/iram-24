import { chromium } from '@playwright/test';

const base = 'http://127.0.0.1:4173/iram-24/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

const result = { home: {}, admin: {} };
try {
  await page.goto(base, { waitUntil: 'networkidle', timeout: 45000 });
  result.home.url = page.url();
  result.home.title = await page.title();
  result.home.hasRoot = await page.locator('#root').count();
  result.home.newsMatches = await page.locator('body').innerText();

  await page.goto(base + 'admin-dashboard-ERAM-SECURE/login', { waitUntil: 'networkidle', timeout: 45000 });
  result.admin.url = page.url();
  result.admin.bodyText = (await page.locator('body').innerText()).slice(0, 1000);
} catch (e) {
  result.error = String(e);
}
result.home.newsMatches = result.home.newsMatches?.slice(0, 2000);
console.log(JSON.stringify(result, null, 2));
await browser.close();
