import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const evidenceDir = join(root, 'public', 'evidence');
const mediaDir = join(root, 'public', 'media');
const rawDir = join(root, '.video-raw-cy');
const htmlFile = 'D:/大学/JetRover三合一ROS智能车（Pi5版本）/结项材料_长耀健行助手/长耀健行助手_老人实时监控系统.html';

await mkdir(evidenceDir, { recursive: true });
await mkdir(mediaDir, { recursive: true });
await rm(rawDir, { recursive: true, force: true });
await mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: rawDir, size: { width: 1600, height: 900 } },
  reducedMotion: 'reduce'
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);

// 1. Load dashboard prototype, wait for fonts/layout
await page.goto(`file:///${htmlFile.replaceAll('\\', '/')}`, { waitUntil: 'domcontentloaded' });
await pause(5000);

// 2. Overview
await page.mouse.move(800, 450);
await pause(3500);
await page.screenshot({ path: join(evidenceDir, 'changyao-overview.webp'), type: 'webp', quality: 88 });

// 3. Scroll to vital-signs / KPI area
await page.evaluate(() => window.scrollTo({ top: 420, behavior: 'smooth' }));
await pause(2200);
await page.mouse.wheel(0, 120);
await pause(2000);

// 4. Trigger fall alert exactly like the original screenshot script
await page.evaluate(() => {
  const alertEl = document.getElementById('fall-alert');
  if (alertEl) alertEl.style.display = 'flex';
  const timeEl = document.getElementById('alert-time');
  if (timeEl) timeEl.textContent = new Date().toLocaleTimeString('zh-CN');
  const pose = document.getElementById('pose-status');
  if (pose) { pose.textContent = '跌倒!'; pose.className = 'pose-val c-danger'; }
  const fig = document.getElementById('fig-status');
  if (fig) { fig.textContent = '跌倒 FALL_DETECTED'; fig.className = 'pose-fig-status c-danger'; }
  const risk = document.getElementById('fall-risk');
  if (risk) { risk.textContent = '高'; risk.className = 'c-danger'; }
});
await pause(3200);
await page.screenshot({ path: join(evidenceDir, 'changyao-alert.webp'), type: 'webp', quality: 88 });

// 5. Show event log panel
await page.evaluate(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const ev = document.getElementById('events-panel');
  if (ev) ev.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
await pause(2600);

// 6. Back to overview and exit
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await pause(1800);

await context.close();
await browser.close();

const videos = (await readdir(rawDir)).filter((name) => name.endsWith('.webm'));
if (videos.length !== 1) {
  throw new Error(`Expected one WebM recording, found ${videos.length}`);
}
await rename(join(rawDir, videos[0]), join(mediaDir, 'changyao-demo.webm'));
console.log('ChangYao screenshots + demo WebM generated.');
