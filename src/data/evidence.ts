export interface EvidenceLink {
  label: string;
  url: string;
  kind: 'commit' | 'source' | 'repository';
  note: string;
}

export interface CodeEvidence {
  language: string;
  title: string;
  file: string;
  lines: string;
  code: string;
  sourceUrl?: string;
  note: string;
}

export interface CommitEvidence {
  hash: string;
  date: string;
  subject: string;
  stat?: string;
  url?: string;
}

export interface ProjectEvidence {
  verification: '公开可复核' | '本地可追溯 / 企业脱敏';
  verificationNote: string;
  links?: EvidenceLink[];
  commits: CommitEvidence[];
  code?: CodeEvidence[];
  screenshots?: {
    src: string;
    alt: string;
    caption: string;
    span?: boolean;
  }[];
  media?: {
    poster: string;
    videoWebm?: string;
    videoMp4?: string;
    caption: string;
    transcript: string[];
  }[];
}

export const evidenceBySlug: Record<string, ProjectEvidence> = {
  'dts-dashboard': {
    verification: '本地可追溯 / 企业脱敏',
    verificationNote: '提交来自亚信科技内网 Git，外部访客无法访问仓库。为避免泄露公司代码，这里公开个人提交哈希、时间、主题和变更统计，并仅展示经过脱敏的最小 diff。',
    commits: [
      { hash: 'ef3031c', date: '2026-08-24', subject: 'fix: 144 滚动条问题', stat: '4 files · +6254 / -6250（包含格式化变更）' },
      { hash: 'ace6dfd', date: '2026-08-20', subject: 'fix: 81 列宽问题', stat: 'TableBuild.js · +4 / -4' },
      { hash: '6ed6bda', date: '2026-08-20', subject: 'fix: 122 折线图颜色设置问题' },
      { hash: 'e77f47f', date: '2026-08-12', subject: 'fix: 修复 51 导出条状图失败问题' },
      { hash: '94ea645', date: '2026-08-07', subject: 'fix: 表头修改' },
      { hash: 'bc01736', date: '2026-08-06', subject: '撤销 133 修改', stat: '主动回退有风险的统计合计方案' }
    ],
    code: [
      {
        language: 'diff',
        title: '问题 81：列宽触发条件修正',
        file: 'dts-z-dashboard/src/newDesign/view/plugins/table/TableBuild.js',
        lines: '1897–1905 · commit ace6dfd',
        code: `- var allCustomWidth = leafColumns.length > 0 && leafColumns.every(function (col) {\n-   return !col.field || (col.width !== '' && col.width !== undefined && col.width !== null);\n+ var hasCustomWidth = leafColumns.length > 0 && leafColumns.some(function (col) {\n+   return col.field && col.width !== '' && col.width !== undefined && col.width !== null;\n  });\n- $('.chart').css('width', allCustomWidth ? 'auto' : '');\n+ $('.chart').css('width', hasCustomWidth ? 'auto' : '');`,
        note: '原逻辑要求所有末级列都配置宽度才切换为自适应，导致单列自定义宽度不生效。修正为任意有效业务列配置宽度即触发。选择器中的业务容器标识已脱敏。'
      }
    ],
    media: [
      {
        poster: '/evidence/dts-evidence.webp',
        videoWebm: '/media/portfolio-evidence-tour.webm',
        videoMp4: '/media/portfolio-evidence-tour.mp4',
        caption: '完整作品站证据导览：从项目归档进入 DTS、NexusAgent 与公开代码卷宗。',
        transcript: ['展示个人 Git 提交时间线。', '放大问题 81 的列宽条件 diff。', '说明企业源码、客户信息和内网地址不对外公开。']
      }
    ]
  },
  'nexus-agent': {
    verification: '本地可追溯 / 企业脱敏',
    verificationNote: '项目位于本人 Gitee 仓库和本地 Git 工作区。当前详情页展示真实提交统计与核心代码片段；远程仓库是否开放访问取决于 Gitee 仓库设置。',
    commits: [
      { hash: '6dd0fe35', date: '2026-07-13', subject: '添加个人设备管理与修复 SSE 安全上下文', stat: '11 files · +1228 / -3' },
      { hash: 'fc0a37dc', date: '2026-06-29', subject: 'LLM few-shot + ReAct 循环 + BM25 检索', stat: '5 files · +1778 / -41' },
      { hash: 'ec6733cc', date: '2026-06-24', subject: '添加 SSE 流式输出、单元测试和 trace_id 修复' },
      { hash: '88c4c85c', date: '2026-06-29', subject: '补前端三个核心组件单元测试与 CI workflow' }
    ],
    code: [
      {
        language: 'java',
        title: 'ReAct 流式执行与降级路径',
        file: 'NexusAgentRuntimeEngine.java',
        lines: '216–270',
        code: `public ExternalRawResponse runSessionStreaming(\n    AgentRuntimeSessionRequest request, TokenStreamCallback onToken) {\n  ReActContext context = runReactToolLoop(safeRequest, loop);\n\n  if (context.isPendingApproval()) {\n    return buildPendingApprovalResponse(\n      safeRequest, context.getApprovalTool(), loop);\n  }\n\n  if (context.isLlmAvailable()) {\n    streamingResult = callLlmStreamingWithMessages(\n      modelConfig, context.getMessages(), onToken);\n  } else {\n    // ReAct 不可用时降级到规则规划流程\n    List<AiTool> plannedTools = planToolsByKeyword(safeRequest);\n  }\n}`,
        note: '片段证明系统不是前端模拟打字：运行时先执行 ReAct 工具循环，高风险工具进入审批，模型不可用时回退规则流程。为控制篇幅省略了与证据点无关的样板代码。'
      }
    ],
    media: [
      {
        poster: '/evidence/nexus-evidence.webp',
        caption: 'NexusAgent 证据卷宗：真实提交统计与 ReAct/SSE 执行代码。',
        transcript: ['展示 ReAct、BM25 与设备管理提交。', '阅读流式执行入口和审批分支。', '指出明确记录的降级路径与工程债务。']
      }
    ]
  },
  'refactor-compass': {
    verification: '公开可复核',
    verificationNote: 'Skill 目前以完整本地发行包留存，包含 SKILL.md、五份参考手册、模板和 Agent 元信息。以下流程来自 v1.0.1 原文件。',
    commits: [],
    code: [
      {
        language: 'markdown',
        title: '阶段退出条件不是口头完成',
        file: 'refactor-compass/SKILL.md',
        lines: '49–58',
        code: `| 阶段 | 动作 | 验收 |\n| 0 盘点 | 五维盘点 + 行为基准 | 入口枚举基线 |\n| 1 设计 | 评分矩阵 → PoC → ADR | 文档冻结 |\n| 3 Migrate | 按能力域逐批迁移 | 每批通过 DoD |\n| 4 量化复查 | 覆盖矩阵 + 占位扫描 | P0–P3 缺口 |\n| 7 Contract | 双跑观察 + 旧系统归档 | 对照零差异 |\n| 9 终局审计 | 四维差距审计 | P0 清零 |`,
        note: '原 Skill 共定义 0–9 十个阶段。这里保留关键门禁，完整发行包还包含反编译、技术选型、自检和模板手册。'
      }
    ]
  },
  'agent-skills': {
    verification: '公开可复核',
    verificationNote: '以下链接固定到具体提交，而不是会随 main 分支变化的浮动地址。访客可以直接查看源代码、提交差异和限制条件。',
    links: [
      { kind: 'commit', label: 'dsh-code-workbench · 52fa886', url: 'https://github.com/xusuyang030218/dsh-code-workbench/commit/52fa88698cc12621eaaa9f8f3fbbbaecce04870a', note: 'TypeScript 重写与 AI 直连' },
      { kind: 'source', label: 'AI 调用实现 · ai.ts', url: 'https://github.com/xusuyang030218/dsh-code-workbench/blob/52fa88698cc12621eaaa9f8f3fbbbaecce04870a/src/host/ai.ts', note: 'Provider 发现、密钥读取、OpenAI 兼容调用' },
      { kind: 'source', label: 'Office 解析 · parse.ts', url: 'https://github.com/xusuyang030218/dsh-preview-ui/blob/a46570cc11e23cf88983cbe7de4e34cbb2ded87f/src/host/parse.ts', note: 'DOCX/XLSX/PPTX OOXML 内容提取' },
      { kind: 'commit', label: 'dsh-session-viz · 2a1d22d', url: 'https://github.com/xusuyang030218/dsh-session-viz/commit/2a1d22d79758388c5efe701d5c03d31999e67479', note: 'ECharts 与 SVG 九阶段可视化改造' },
      { kind: 'source', label: '批量文档解析测试', url: 'https://github.com/xusuyang030218/dsh-doc-import/blob/8a3e8a623daaebc31a5c093bfb179e9cd917415e/test/parse.test.mjs', note: '小型合成样本，不代表完整格式兼容性' }
    ],
    commits: [
      { hash: '52fa886', date: '2026-08-21', subject: 'dsh-code-workbench TypeScript rewrite + AI direct-connect', url: 'https://github.com/xusuyang030218/dsh-code-workbench/commit/52fa88698cc12621eaaa9f8f3fbbbaecce04870a' },
      { hash: '2a1d22d', date: '2026-08-21', subject: 'dsh-session-viz ECharts + SVG 可视化改造', url: 'https://github.com/xusuyang030218/dsh-session-viz/commit/2a1d22d79758388c5efe701d5c03d31999e67479' },
      { hash: '8a3e8a6', date: '2026-08-19', subject: 'dsh-doc-import 批量导入与 docIds 读取', url: 'https://github.com/xusuyang030218/dsh-doc-import/commit/8a3e8a623daaebc31a5c093bfb179e9cd917415e' }
    ],
    code: [
      {
        language: 'typescript',
        title: 'OpenAI 兼容调用不是按钮占位',
        file: 'dsh-code-workbench/src/host/ai.ts',
        lines: '93–121 · commit 52fa886',
        code: `const base = opts.baseURL.replace(/\\/$/, '')\nconst url = /\\/v1$/.test(base)\n  ? \`\${base}/chat/completions\`\n  : \`\${base}/v1/chat/completions\`\n\nconst res = await fetch(url, {\n  method: 'POST',\n  headers: {\n    'content-type': 'application/json',\n    authorization: \`Bearer \${opts.apiKey}\`,\n  },\n  body: JSON.stringify({\n    model: opts.model, messages: opts.messages, stream: false,\n  }),\n})`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-code-workbench/blob/52fa88698cc12621eaaa9f8f3fbbbaecce04870a/src/host/ai.ts#L93-L121',
        note: '代码从 DSH 设置解析 Provider 与环境变量名，再调用兼容 chat/completions 的服务。兼容性仍受具体模型输出格式影响。'
      },
      {
        language: 'typescript',
        title: 'Office 预览基于真实 OOXML 内容提取',
        file: 'dsh-preview-ui/src/host/parse.ts',
        lines: '58–89 · commit a46570c',
        code: `function textNodes(xml: string, tag: string): string[] {\n  return [...xml.matchAll(\n    new RegExp(\`<\${tag}[^>]*>([\\s\\S]*?)</\${tag}>\`, 'g')\n  )].map((match) => decodeXml(match[1]))\n}\n\nconst slides = [...entries.keys()]\n  .filter((name) => /^ppt\\/slides\\/slide\\d+\\.xml$/.test(name))\n  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-preview-ui/blob/a46570cc11e23cf88983cbe7de4e34cbb2ded87f/src/host/parse.ts#L58-L89',
        note: '这是内容抽取，不是 Office 像素级渲染；复杂样式、扫描件和特殊字体仍有明确限制。'
      },
      {
        language: 'typescript',
        title: '会话可视化建立可搜索事件索引',
        file: 'dsh-session-viz/src/host/parser.ts',
        lines: '363–421 · commit 2a1d22d',
        code: `export function parseLogText(text: string): ParsedSession {\n  const events: LightEvent[] = []\n  const search = new Map<number, string>()\n\n  for (const [i, raw] of text.split('\\n').entries()) {\n    const ev = parseLine(raw, i)\n    if (!ev) continue\n    events.push(ev)\n    // 按工具参数、推理文本和任务内容建立轻量索引\n    if (joined) search.set(i, joined)\n  }\n\n  meta.eventCount = events.length\n  return { meta, events, typeCounts, groupCounts, search }\n}`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-session-viz/blob/2a1d22d79758388c5efe701d5c03d31999e67479/src/host/parser.ts#L363-L421',
        note: '源码可确认事件解析与索引结构；实际正确性依赖 DSH JSONL 事件格式，本站不将源码存在等同于生产环境验证。'
      }
    ],
    media: [
      {
        poster: '/evidence/public-code-evidence.webp',
        caption: '公开代码证据：固定提交、真实文件路径、短代码片段和限制说明。',
        transcript: ['打开公开固定提交链接。', '展示 AI 调用、OOXML 解析和会话索引代码。', '说明每项实现仍存在的兼容性边界。']
      }
    ]
  },
  'fall-detection': {
    verification: '本地可追溯 / 企业脱敏',
    verificationNote: '以下画面来自长耀健行助手自建的「老人实时监控大屏」HTML 原型（YOLO11-Pose v2.0）真实渲染截图与现场录制，不是 AI 生成的示意图，也不包含真实老人画面、姓名或医疗数据。原型负责展示跌倒检测、生命体征与事件日志的信息架构；真实摄像头推理性能等待原始测试记录。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/changyao-monitor.webp',
        alt: '老人实时监控大屏全览',
        caption: '老人实时监控大屏：摄像头区域、姿态状态、跌倒风险与 KPI 面板同屏。',
        span: true
      },
      {
        src: '/evidence/changyao-fall-alert.webp',
        alt: '跌倒检测告警界面',
        caption: '跌倒检测告警：姿态状态切换为「跌倒!」，风险等级置高并高亮告警。'
      },
      {
        src: '/evidence/changyao-monitor-center.webp',
        alt: '实时监控中心',
        caption: '实时监控中心视图：房间区域与实时状态标签。'
      },
      {
        src: '/evidence/changyao-vitals.webp',
        alt: '生命体征监测面板',
        caption: '生命体征监测面板：心率、血氧等指标卡片布局。'
      }
    ],
    media: [
      {
        poster: '/evidence/changyao-overview.webp',
        videoWebm: '/media/changyao-demo.webm',
        videoMp4: '/media/changyao-demo.mp4',
        caption: '长耀健行助手监控大屏现场演示：从实时总览到跌倒告警触发与事件日志。',
        transcript: [
          '打开老人实时监控大屏原型，展示摄像头区域、姿态状态与 KPI 面板。',
          '滚动到生命体征与健康指标区域。',
          '触发跌倒告警：姿态状态切换为「跌倒!」，风险等级置高，告警面板弹出。',
          '展示事件日志面板后回到总览。',
          '注意：这是自建原型演示，不代表真实摄像头推理性能。'
        ]
      }
    ]
  },
  'smart-meeting': {
    verification: '公开可复核',
    verificationNote: '以下画面来自灵犀会议室真实运行界面的录制与截图：看板图、AI 自然语言预订、时间轴可视化预订。两段视频由原 2156×1356 素材转码压缩而来。截图与视频均为项目实际演示记录。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/meeting-dashboard.webp',
        alt: '灵犀会议室看板',
        caption: '会议室预订与数据看板：房间状态、预订分布与统计指标。',
        span: true
      }
    ],
    media: [
      {
        poster: '/evidence/meeting-dashboard.webp',
        videoWebm: '/media/meeting-ai-booking.webm',
        videoMp4: '/media/meeting-ai-booking.mp4',
        caption: 'AI 智能预订：以自然语言向对话助手描述会议需求，系统解析意图并完成预订。',
        transcript: ['打开会议室看板。', '向 AI 助手输入自然语言预订需求。', '系统解析意图并展示可预订时段，完成预订。']
      },
      {
        poster: '/evidence/meeting-dashboard.webp',
        videoWebm: '/media/meeting-timeline.webm',
        videoMp4: '/media/meeting-timeline.mp4',
        caption: '时间轴可视化预订：在时间轴上直接查看并选择会议室空闲时段。',
        transcript: ['进入时间轴视图。', '查看各会议室空闲时段。', '选择时段完成可视化预订。']
      }
    ]
  },
  'workbuddy': {
    verification: '公开可复核',
    verificationNote: '以下为 WorkBuddy / Research Buddy 的「可重复模拟数据验收流程」截图，由自动化脚本基于模拟数据生成（AI 输出为 Mock 流式返回，RAG 与导出均为稳定 Mock 接口）。它们证明产品流程已跑通，但不代表生产数据或真实模型性能。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/wb-dashboard.webp',
        alt: 'WorkBuddy 首页看板',
        caption: '首页看板：KPI 与知识库资料入口。',
        span: true
      },
      {
        src: '/evidence/wb-chat.webp',
        alt: '研思对话',
        caption: '研思对话：输入问题并发送。'
      },
      {
        src: '/evidence/wb-rag.webp',
        alt: 'RAG 检索',
        caption: '知识库检索：输入关键词触发 RAG 搜索。'
      },
      {
        src: '/evidence/wb-close-read.webp',
        alt: '资料精读与启发库',
        caption: '精读页：填写价值并加入启发库。'
      },
      {
        src: '/evidence/wb-topic.webp',
        alt: 'AI 选题',
        caption: 'AI 选题：填写要求并生成候选标题。'
      },
      {
        src: '/evidence/wb-workspace.webp',
        alt: '论文写作工作区',
        caption: '论文任务写作工作区。'
      },
      {
        src: '/evidence/wb-draft.webp',
        alt: 'AI 生成初稿',
        caption: '分阶段 AI 生成：进入文案初稿阶段。'
      },
      {
        src: '/evidence/wb-mobile.webp',
        alt: '移动端响应式',
        caption: '移动端响应式效果。'
      }
    ]
  },
  'smart-mine': {
    verification: '本地可追溯 / 企业脱敏',
    verificationNote: '以下为煤矿全域智能监管平台「AI 核心平台大屏」运行界面截图。该大屏是项目竞赛材料中的真实界面记录；项目为团队竞赛成果，具体个人模块边界与可公开范围待补充项目材料后完善。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/mine-dashboard.webp',
        alt: '煤矿 AI 核心平台大屏',
        caption: 'AI 核心平台大屏：全域监管指标、实时监测与预警总览。',
        span: true
      }
    ]
  }
};
