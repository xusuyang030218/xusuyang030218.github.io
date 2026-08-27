# 徐苏洋个人成果站

基于 Astro 构建的静态个人博客与项目作品集，目标部署地址为：

https://xusuyang030218.github.io

## 本地运行

```bash
npm install
npm run dev
```

## 构建验证

```bash
npm run build
```

构建产物位于 `dist/`。

## GitHub Pages 部署

1. 创建仓库 `xusuyang030218.github.io`。
2. 将本项目推送到 `main` 分支。
3. 在仓库 Settings > Pages > Build and deployment 中选择 GitHub Actions。
4. 推送后 `.github/workflows/deploy.yml` 会自动构建并发布。

## 内容维护

- 项目数据：`src/data/projects.ts`
- 个人资料：首页与 `src/pages/about.astro`
- 全局视觉：`src/styles/global.css`
- SEO：`src/layouts/BaseLayout.astro`

企业项目仅展示可公开的职责、技术决策和脱敏成果，不提交内部代码、截图、地址或客户数据。
