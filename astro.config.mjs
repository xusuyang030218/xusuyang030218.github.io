import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://xusuyang030218.github.io',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory'
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true
    }
  }
});
