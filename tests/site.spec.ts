import { test, expect } from '@playwright/test';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 路由从构建产物 dist/ 推导，而不是 import 源数据。
 * 一是避免把 Astro 的图片资源导入拖进测试运行器，
 * 二是这样测的就是真正会被部署的页面。
 */
function routesUnder(dir: string, prefix: string): string[] {
  const full = join(process.cwd(), 'dist', dir);
  if (!existsSync(full)) return [];
  return readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${prefix}${entry.name}/`);
}

const staticRoutes = ['/', '/projects/', '/notes/', '/about/'];
const projectRoutes = routesUnder('projects', '/projects/');
const noteRoutes = routesUnder('notes', '/notes/');
const allRoutes = [...staticRoutes, ...projectRoutes, ...noteRoutes];

test.describe('可达性与基础结构', () => {
  for (const route of allRoutes) {
    test(`${route} 正常渲染且结构完整`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} 应返回 200`).toBe(200);

      // 每页恰好一个 h1
      await expect(page.locator('main h1')).toHaveCount(1);

      // SEO 基本信息
      await expect(page).toHaveTitle(/.+/);
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.{10,}/);

      // 图片必须有 alt，否则无障碍不过关
      const imagesWithoutAlt = await page.locator('main img:not([alt])').count();
      expect(imagesWithoutAlt, `${route} 存在缺少 alt 的图片`).toBe(0);
    });
  }
});

test.describe('布局硬规则', () => {
  test('无横向溢出', async ({ page }) => {
    for (const route of ['/', '/projects/', '/notes/']) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      expect(overflow, `${route} 出现横向滚动`).toBe(false);
    }
  });

  test('导航栏保持单行且不超过 80px', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', '移动端使用折叠菜单');
    await page.goto('/');
    const box = await page.locator('.nav').boundingBox();
    expect(box!.height).toBeLessThanOrEqual(80);
  });

  test('正文不出现破折号', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('main').innerText();
    expect(text).not.toContain('\u2014');
  });
});

test.describe('设计系统一致性', () => {
  test('强调色不是 AI 紫', async ({ page }) => {
    await page.goto('/');
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    );
    expect(accent.toUpperCase()).not.toBe('#7C3AED');
    expect(accent).toBeTruthy();
  });

  test('导航栏滚动后转为磨砂玻璃', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.site-header');

    await expect(header).toHaveAttribute('data-scrolled', 'false');

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveAttribute('data-scrolled', 'true');

    const backdrop = await header.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(backdrop).toContain('blur');
  });
});

test.describe('内容真实性约束', () => {
  test('技术栈每项都标注了来源项目', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.stack-card li');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const projectsLabel = await items.nth(i).locator('.stack-projects').innerText();
      expect(projectsLabel.trim().length, '技术栈条目缺少来源项目').toBeGreaterThan(0);
    }
  });

  test('随笔详情页均带有相关案例链接', async ({ page }) => {
    expect(noteRoutes.length, '未发现随笔页面').toBeGreaterThan(0);

    for (const route of noteRoutes) {
      await page.goto(route);
      await expect(page.locator('.related'), `${route} 缺少相关案例链接`).toBeVisible();
    }
  });

  test('企业案例保留披露边界说明', async ({ page }) => {
    // 断言"实质"而非某个具体小标题：企业案例必须声明不公开公司源码等内部信息。
    // 标题可以改写，这条承诺不能消失。
    await page.goto('/projects/dts-dashboard/');
    const body = await page.locator('main').innerText();

    expect(body, 'DTS 案例缺少公开范围声明').toMatch(/公开范围|披露|不涉及公司源代码|不展示公司源代码/);
    expect(body, '公开范围声明未覆盖源码与客户信息').toMatch(/源代码|内网仓库|客户信息/);
  });
});

test.describe('导航连通性', () => {
  test('主导航覆盖全部主要板块', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', '移动端使用折叠菜单');
    await page.goto('/');

    for (const href of ['/projects/', '/notes/', '/about/']) {
      await expect(page.locator(`.nav-links a[href="${href}"]`)).toBeVisible();
    }
  });

  test('首页可进入项目详情', async ({ page }) => {
    await page.goto('/');
    await page.locator('.project-grid a').first().click();
    await expect(page).toHaveURL(/\/projects\/.+\//);
    await expect(page.locator('main h1')).toBeVisible();
  });
});
