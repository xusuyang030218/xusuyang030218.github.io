import { defineConfig, devices } from '@playwright/test';

/**
 * 针对静态站的端到端测试配置。
 * 直接跑构建产物（dist），保证测的就是将要部署的内容，而不是 dev server 的即时编译结果。
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry'
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],

  // 用 preview 跑构建产物；CI 上复用已有服务器可省一次启动
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
