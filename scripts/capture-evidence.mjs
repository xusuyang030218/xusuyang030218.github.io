import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.CAPTURE_URL || 'http://127.0.0.1:4321';
const root = fileURLToPath(new URL('..', import.meta.url));
const evidenceDir = join(root, 'public', 'evidence');
const mediaDir = join(root, 'public', 'media');
const rawDir = join(root, '.video-raw');

await mkdir(evidenceDir, { recursive: true });
await mkdir(mediaDir, { recursive: true });
await rm(rawDir, { recursive: true, force: true });
await mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: rawDir, size: { width: 1440, height: 900 } },
  colorScheme: 'light',
  reducedMotion: 'reduce'
});
const page = await context.newPage();

const pause = (ms) => page.waitForTimeout(ms);

await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
await pause(1800);
await page.screenshot({ path: join(evidenceDir, 'home.webp'), type: 'webp', quality: 86, fullPage: false });

await page.locator('a[href="/projects/"]').first().click();
await page.waitForLoadState('networkidle');
await pause(1400);
await page.screenshot({ path: join(evidenceDir, 'projects.webp'), type: 'webp', quality: 86, fullPage: false });

await page.goto(`${baseURL}/projects/dts-dashboard/`, { waitUntil: 'networkidle' });
await pause(1400);
const dtsDossier = page.locator('.evidence-dossier');
await dtsDossier.scrollIntoViewIfNeeded();
await pause(1700);
await page.screenshot({ path: join(evidenceDir, 'dts-evidence.webp'), type: 'webp', quality: 88, fullPage: false });
const dtsCode = page.locator('.code-case').first();
await dtsCode.scrollIntoViewIfNeeded();
await pause(2000);

await page.goto(`${baseURL}/projects/nexus-agent/`, { waitUntil: 'networkidle' });
const nexusDossier = page.locator('.evidence-dossier');
await nexusDossier.scrollIntoViewIfNeeded();
await pause(1600);
await page.screenshot({ path: join(evidenceDir, 'nexus-evidence.webp'), type: 'webp', quality: 88, fullPage: false });
const nexusCode = page.locator('.code-case').first();
await nexusCode.scrollIntoViewIfNeeded();
await pause(2000);

await page.goto(`${baseURL}/projects/agent-skills/`, { waitUntil: 'networkidle' });
const publicDossier = page.locator('.evidence-dossier');
await publicDossier.scrollIntoViewIfNeeded();
await pause(1600);
await page.screenshot({ path: join(evidenceDir, 'public-code-evidence.webp'), type: 'webp', quality: 88, fullPage: false });
const links = page.locator('.source-links');
await links.scrollIntoViewIfNeeded();
await pause(1600);
const code = page.locator('.code-case').first();
await code.scrollIntoViewIfNeeded();
await pause(2400);

await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
await pause(1400);

await context.close();
await browser.close();

const videos = (await readdir(rawDir)).filter((name) => name.endsWith('.webm'));
if (videos.length !== 1) {
  throw new Error(`Expected one WebM recording, found ${videos.length}`);
}
await rename(join(rawDir, videos[0]), join(mediaDir, 'portfolio-evidence-tour.webm'));
console.log('Evidence screenshots and WebM tour generated.');
