/**
 * DSH（DeepSeek Harness）自研插件清单。
 *
 * 数字来源：本机插件清单（2026-09-18 整理）+ dsh-recommend 官方插件榜实读
 * （C:\Users\23074\.dsh\dsh-recommend\registry.json）+ 各仓库 package.json。
 *
 * 刻意保留的边界：
 * - refactorkit 是 2026-10 新增的第 8 个可安装插件，清单整理时只有 7 个；
 * - 旧材料里出现过「8 个」，那是把 3 个学习性 fork 算了进去，与本表的 8 个不是一回事；
 * - 未入榜不等于能力差——榜单权重里「热度」占 0.30，没有 star 就吃亏。
 */

export interface PluginEntry {
  /** 插件包名 / 仓库名 */
  name: string;
  /** 仓库地址（未开源或私有则省略） */
  repo?: string;
  version: string;
  /** 所属职责层 */
  layer: '观察层' | '产出层' | '协作层' | '编排层';
  /** 一句话能力 */
  capability: string;
  /** dsh-recommend 官方插件榜评分；未收录为 null */
  boardScore: number | null;
  /** 需要说明的边界 */
  note?: string;
}

export const plugins: PluginEntry[] = [
  {
    name: 'dsh-preview-ui',
    repo: 'https://github.com/xusuyang030218/dsh-preview-ui',
    version: 'v1.0.0',
    layer: '产出层',
    capability: '浏览器内工作区文件树 + 多格式预览 + 在线编辑与版本回滚 + 全文搜索',
    boardScore: 0.5748,
    note: 'MIT；8 个插件里榜单评分最高'
  },
  {
    name: 'dsh-session-viz',
    repo: 'https://github.com/xusuyang030218/dsh-session-viz',
    version: 'v1.1.0',
    layer: '观察层',
    capability: '会话轨迹可视化：摘要卡 / 故事线 / 事件树三层查看器 + SVG 轮环会话图',
    boardScore: 0.4891,
    note: '14/14 次提交全部为本人，含 5 个 spec、22 个 it() 用例'
  },
  {
    name: 'dsh-code-workbench',
    repo: 'https://github.com/xusuyang030218/dsh-code-workbench',
    version: 'v0.4.0',
    layer: '产出层',
    capability: '代码上传 → AI 修改 / 审查 / 评测 → 下载 + diff + 结构化评测报告',
    boardScore: 0.4888,
    note: 'TypeScript 源码，零运行时依赖'
  },
  {
    name: 'dsh-doc-import',
    repo: 'https://github.com/xusuyang030218/dsh-doc-import',
    version: 'v0.1.0',
    layer: '产出层',
    capability: '零外部依赖把 md / docx / pdf / xlsx / pptx 解析为纯文本，供 Agent 读取',
    boardScore: null,
    note: '只读不回写；与 code-workbench 分工明确'
  },
  {
    name: 'dsh-skill-ui',
    repo: 'https://github.com/xusuyang030218/dsh-skill-ui',
    version: 'v0.5.1',
    layer: '协作层',
    capability: '技能中心：本地技能管理 + skillhub 市场（13 分类）+ 向导创建 + AI 辅助',
    boardScore: null,
    note: '基于他人 BSD-3-Clause 项目二次开发，来源已在 README 声明'
  },
  {
    name: 'dsh-team-console',
    repo: 'https://github.com/xusuyang030218/agent-team',
    version: 'v0.1.0',
    layer: '协作层',
    capability: '用 /team 命令启停与释放官方 Agent Teams 成员，不改官方包',
    boardScore: null,
    note: '仓库名 agent-team 与包名不一致，已在 README 说明'
  },
  {
    name: 'dsh-chat',
    repo: 'https://github.com/xusuyang030218/dsh-chat',
    version: 'v0.1.0',
    layer: '协作层',
    capability: 'DSH 实例之间的 1 对 1 私聊与群聊，消息经自建零依赖中继投递',
    boardScore: null,
    note: '与微信协议无关；AI 侧仍是本地 stub'
  },
  {
    name: 'refactorkit',
    repo: 'https://github.com/xusuyang030218/refactor-kit',
    version: 'v0.1.0 核心 + v0.2 面板',
    layer: '编排层',
    capability: '自主编排的遗留系统重构插件：13 个工具、CP0–CP6 审核点、底线由代码强制',
    boardScore: null,
    note: '2026-10 新增；54 项自动化测试；未入榜（新发布）'
  }
];

/** 未计入可安装插件的留档仓 */
export const pluginOutOfScope = {
  name: 'dsh-roleplay-studio',
  why: '不是可安装插件（无 package.json），是把上游 memory 插件的角色扮演页抽出做可审查版本的留档仓'
};

export const pluginBoundaries = [
  '8 个可安装插件均为本人作者；dsh-skill-ui 基于他人 BSD-3 项目二次开发并已声明来源。',
  '另有 3 个学习性 fork（dsh-lookseek、dsh-withskillhub、dsh-weixin-clawbot），不计入自研。',
  '目前全部通过 GitHub 直接安装，尚未发布 npm 包，也没有版本 tag。',
  '8 个仓库 star 合计为 1。榜单里热度占 0.30，未入榜主要吃亏在这一点，不代表可用性。'
];
