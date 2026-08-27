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
  /** Short badge describing how much of this project can be shown publicly. */
  verification: '开源可查' | '内部项目 · 已脱敏';
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
    verification: '内部项目 · 已脱敏',
    verificationNote:
      '这是亚信科技的内网项目，仓库和界面都不能对外公开。所以这里只放我自己的提交记录，以及一段去掉业务标识的最小改动，用来说明我具体改了什么。',
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
        note: '原来的判断要求所有末级列都配了宽度才切自适应，结果用户只改一列宽度时完全没反应。改成只要有一个有效业务列配了宽度就触发。选择器里的业务容器标识做了脱敏。'
      }
    ]
  },
  'nexus-agent': {
    verification: '内部项目 · 已脱敏',
    verificationNote:
      '这是我自己从零搭的项目，代码在个人 Gitee 仓库和本地工作区。下面是平台各个模块的实际运行界面，加上两段核心代码。',
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
        note: '这段是运行时的主干：先跑 ReAct 工具循环，高风险工具停下来等审批，模型不可用时回落到规则规划。为了篇幅省掉了样板代码。'
      }
    ],
    screenshots: [
      {
        src: '/evidence/nexus-dashboard.webp',
        alt: 'NexusAgent 平台总览看板',
        caption: '平台总览：会话量、工具调用、模型消耗与近期运行状态。',
        span: true
      },
      {
        src: '/evidence/nexus-chat.webp',
        alt: 'Agent 对话执行界面',
        caption: '对话执行页：SSE 流式返回，可以看到工具调用过程而不只是最终答案。'
      },
      {
        src: '/evidence/nexus-agents.webp',
        alt: 'Agent 列表管理',
        caption: 'Agent 管理：每个 Agent 绑定自己的模型、工具集与提示词。'
      },
      {
        src: '/evidence/nexus-skills.webp',
        alt: '技能与工具注册',
        caption: '工具注册：声明入参出参和风险等级，高风险工具走审批。'
      },
      {
        src: '/evidence/nexus-knowledge.webp',
        alt: '知识库管理',
        caption: '知识库：文档入库、切片与 BM25 检索配置。'
      },
      {
        src: '/evidence/nexus-models.webp',
        alt: '模型配置列表',
        caption: '模型配置：多家 Provider 并存，按 Agent 指定默认模型。'
      },
      {
        src: '/evidence/nexus-models-operator.webp',
        alt: '模型运营视图',
        caption: '模型运营视图：调用量、成功率与成本按模型维度拆分。'
      },
      {
        src: '/evidence/nexus-prompts.webp',
        alt: '提示词模板管理',
        caption: '提示词模板：版本化管理，改动可回溯。'
      },
      {
        src: '/evidence/nexus-approval.webp',
        alt: '高风险工具审批',
        caption: '审批队列：Agent 触发高风险工具时挂起，人工确认后才继续执行。'
      },
      {
        src: '/evidence/nexus-audit.webp',
        alt: '审计日志',
        caption: '审计日志：每次会话、工具调用与审批动作都带 trace_id 落库。'
      },
      {
        src: '/evidence/nexus-usage.webp',
        alt: '用量统计',
        caption: '用量统计：按用户、Agent 和模型统计 token 与调用次数。'
      },
      {
        src: '/evidence/nexus-usage-trend.webp',
        alt: '用量趋势曲线',
        caption: '用量趋势：观察增长和异常尖峰，用于排查跑飞的会话。'
      },
      {
        src: '/evidence/nexus-kanban.webp',
        alt: '任务看板',
        caption: '任务看板：把 Agent 产出的任务落到可跟踪的卡片上。'
      },
      {
        src: '/evidence/nexus-self-iteration.webp',
        alt: '自迭代记录',
        caption: '自迭代记录：把失败会话回流成改进项，用来调提示词和工具定义。'
      },
      {
        src: '/evidence/nexus-login.webp',
        alt: '登录页',
        caption: '登录页：基于 Spring Security 的账号体系与权限入口。'
      }
    ]
  },
  'refactor-compass': {
    verification: '开源可查',
    verificationNote:
      '这是一套写给 AI Agent 用的重构方法论 Skill，以完整发行包形式留存，包含 SKILL.md、五份参考手册、模板和元信息。下面这段流程来自 v1.0.1 原文件。',
    commits: [],
    code: [
      {
        language: 'markdown',
        title: '每个阶段都有明确的退出条件',
        file: 'refactor-compass/SKILL.md',
        lines: '49–58',
        code: `| 阶段 | 动作 | 验收 |\n| 0 盘点 | 五维盘点 + 行为基准 | 入口枚举基线 |\n| 1 设计 | 评分矩阵 → PoC → ADR | 文档冻结 |\n| 3 Migrate | 按能力域逐批迁移 | 每批通过 DoD |\n| 4 量化复查 | 覆盖矩阵 + 占位扫描 | P0–P3 缺口 |\n| 7 Contract | 双跑观察 + 旧系统归档 | 对照零差异 |\n| 9 终局审计 | 四维差距审计 | P0 清零 |`,
        note: '完整 Skill 定义了 0–9 共十个阶段，这里挑了几个关键门禁。发行包里还有反编译、技术选型、自检和模板手册。'
      }
    ]
  },
  'agent-skills': {
    verification: '开源可查',
    verificationNote:
      '下面的链接都固定到具体提交，不是会随 main 分支漂移的地址，可以直接点进去看源码和改动。',
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
        title: 'AI 调用是真的打出去了',
        file: 'dsh-code-workbench/src/host/ai.ts',
        lines: '93–121 · commit 52fa886',
        code: `const base = opts.baseURL.replace(/\\/$/, '')\nconst url = /\\/v1$/.test(base)\n  ? \`\${base}/chat/completions\`\n  : \`\${base}/v1/chat/completions\`\n\nconst res = await fetch(url, {\n  method: 'POST',\n  headers: {\n    'content-type': 'application/json',\n    authorization: \`Bearer \${opts.apiKey}\`,\n  },\n  body: JSON.stringify({\n    model: opts.model, messages: opts.messages, stream: false,\n  }),\n})`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-code-workbench/blob/52fa88698cc12621eaaa9f8f3fbbbaecce04870a/src/host/ai.ts#L93-L121',
        note: '从 DSH 设置里解析 Provider 和环境变量名，再调用兼容 chat/completions 的服务。兼容性还是受具体模型输出格式影响。'
      },
      {
        language: 'typescript',
        title: 'Office 预览走的是真实 OOXML 解析',
        file: 'dsh-preview-ui/src/host/parse.ts',
        lines: '58–89 · commit a46570c',
        code: `function textNodes(xml: string, tag: string): string[] {\n  return [...xml.matchAll(\n    new RegExp(\`<\${tag}[^>]*>([\\s\\S]*?)</\${tag}>\`, 'g')\n  )].map((match) => decodeXml(match[1]))\n}\n\nconst slides = [...entries.keys()]\n  .filter((name) => /^ppt\\/slides\\/slide\\d+\\.xml$/.test(name))\n  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-preview-ui/blob/a46570cc11e23cf88983cbe7de4e34cbb2ded87f/src/host/parse.ts#L58-L89',
        note: '这是内容抽取，不是 Office 那种像素级渲染。复杂样式、扫描件和特殊字体都还有限制。'
      },
      {
        language: 'typescript',
        title: '会话可视化建了可搜索的事件索引',
        file: 'dsh-session-viz/src/host/parser.ts',
        lines: '363–421 · commit 2a1d22d',
        code: `export function parseLogText(text: string): ParsedSession {\n  const events: LightEvent[] = []\n  const search = new Map<number, string>()\n\n  for (const [i, raw] of text.split('\\n').entries()) {\n    const ev = parseLine(raw, i)\n    if (!ev) continue\n    events.push(ev)\n    // 按工具参数、推理文本和任务内容建立轻量索引\n    if (joined) search.set(i, joined)\n  }\n\n  meta.eventCount = events.length\n  return { meta, events, typeCounts, groupCounts, search }\n}`,
        sourceUrl: 'https://github.com/xusuyang030218/dsh-session-viz/blob/2a1d22d79758388c5efe701d5c03d31999e67479/src/host/parser.ts#L363-L421',
        note: '解析和索引结构都在源码里。实际效果依赖 DSH 的 JSONL 事件格式，源码存在不等于生产环境已验证。'
      }
    ]
  },
  'fall-detection': {
    verification: '内部项目 · 已脱敏',
    verificationNote:
      '下面是长耀健行助手的实际界面截图和现场录制。系统跑的是 YOLO11-Pose，画面里不包含真实老人影像、姓名或医疗数据。真实摄像头的推理性能数字我还没拿到原始测试记录，所以先不写。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/changyao-monitor.webp',
        alt: '老人实时监控大屏全览',
        caption: '实时监控大屏：摄像头画面、姿态状态、跌倒风险和 KPI 在同一屏。',
        span: true
      },
      {
        src: '/evidence/changyao-fall-alert.webp',
        alt: '跌倒检测告警界面',
        caption: '跌倒告警触发：姿态状态切到「跌倒」，风险等级置高并高亮。'
      },
      {
        src: '/evidence/changyao-alert.webp',
        alt: '告警事件详情',
        caption: '告警事件详情：时间、位置和处理状态，需要人工确认后关闭。'
      },
      {
        src: '/evidence/changyao-monitor-center.webp',
        alt: '实时监控中心',
        caption: '监控中心：多房间区域与各自的实时状态标签。'
      },
      {
        src: '/evidence/changyao-vitals.webp',
        alt: '生命体征监测面板',
        caption: '生命体征面板：心率、血氧等指标卡片。'
      }
    ],
    media: [
      {
        poster: '/evidence/changyao-vision-demo-poster.webp',
        videoMp4: '/media/changyao-vision-demo.mp4',
        caption: '视觉检测演示：摄像头画面实时姿态识别，跌倒发生时触发告警。',
        transcript: [
          '摄像头画面接入，姿态骨架点实时叠加。',
          '模拟跌倒动作，姿态状态切换并触发告警。',
          '告警进入待处理队列，等人工确认。'
        ]
      },
      {
        poster: '/evidence/changyao-robot-demo-poster.webp',
        videoMp4: '/media/changyao-robot-demo.mp4',
        caption: '巡检小车演示：JetRover 底盘按路线巡检并回传画面。',
        transcript: [
          '小车按预设路线移动。',
          '车载摄像头回传画面到检测服务。',
          '检测结果同步到后台监控大屏。'
        ]
      }
    ]
  },
  'smart-meeting': {
    verification: '开源可查',
    verificationNote:
      '下面是灵犀会议室实际运行界面的截图和录屏：数据看板、AI 自然语言预订、时间轴可视化预订。两段视频由原 2156×1356 素材压缩而来。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/meeting-dashboard.webp',
        alt: '灵犀会议室看板',
        caption: '预订看板：房间状态、预订分布与统计指标。',
        span: true
      }
    ],
    media: [
      {
        poster: '/evidence/meeting-dashboard.webp',
        videoWebm: '/media/meeting-ai-booking.webm',
        videoMp4: '/media/meeting-ai-booking.mp4',
        caption: 'AI 预订：直接用自然语言说需求，系统解析意图后完成预订。',
        transcript: ['打开会议室看板。', '向助手输入自然语言预订需求。', '系统解析意图、展示可用时段并完成预订。']
      },
      {
        poster: '/evidence/meeting-dashboard.webp',
        videoWebm: '/media/meeting-timeline.webm',
        videoMp4: '/media/meeting-timeline.mp4',
        caption: '时间轴预订：在时间轴上直接看空闲时段并框选。',
        transcript: ['切到时间轴视图。', '查看各会议室空闲时段。', '选中时段完成预订。']
      }
    ]
  },
  'workbuddy': {
    verification: '开源可查',
    verificationNote:
      '下面这组截图来自一套可重复执行的验收脚本，跑的是模拟数据（AI 输出为 Mock 流式返回，RAG 和导出也是稳定的 Mock 接口）。它们说明产品流程已经跑通，但不代表生产数据或真实模型效果。',
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
        caption: '分阶段生成：进入文案初稿阶段。'
      },
      {
        src: '/evidence/wb-mobile.webp',
        alt: '移动端响应式',
        caption: '移动端响应式效果。'
      }
    ]
  },
  'smart-mine': {
    verification: '内部项目 · 已脱敏',
    verificationNote:
      '下面是煤矿全域智能监管平台的实际运行界面，涵盖数据集管理、标注、模型训练、模型管理和告警处置全链路。这是团队竞赛项目，界面里的矿区名称和点位信息已做处理。',
    commits: [],
    screenshots: [
      {
        src: '/evidence/mine-dashboard.webp',
        alt: '煤矿 AI 核心平台大屏',
        caption: 'AI 核心平台大屏：全域监管指标、实时监测与预警总览。',
        span: true
      },
      {
        src: '/evidence/mine-system.webp',
        alt: '平台系统主界面',
        caption: '平台主界面：各业务模块入口与权限划分。'
      },
      {
        src: '/evidence/mine-dataset.webp',
        alt: '数据集管理',
        caption: '数据集管理：按场景组织训练素材，支持版本管理。'
      },
      {
        src: '/evidence/mine-annotation.webp',
        alt: '在线标注工具',
        caption: '在线标注：直接在平台上画框打标签，产出 YOLO 训练集。'
      },
      {
        src: '/evidence/mine-model-train.webp',
        alt: '模型训练任务',
        caption: '训练任务：提交训练、跟踪 loss 与 mAP 曲线。'
      },
      {
        src: '/evidence/mine-model-manage.webp',
        alt: '模型管理与发布',
        caption: '模型管理：多版本并存，选定版本发布到推理服务。'
      },
      {
        src: '/evidence/mine-alarm-list.webp',
        alt: '告警列表',
        caption: '告警列表：AI 检测结果落库，按等级和时间筛选。'
      },
      {
        src: '/evidence/mine-alarm-config.webp',
        alt: '告警规则配置',
        caption: '告警规则：按点位配置检测类型、阈值和通知方式。'
      },
      {
        src: '/evidence/mine-alarm-handle.webp',
        alt: '告警处置流程',
        caption: '告警处置：指派、处理、归档，形成闭环记录。'
      }
    ],
    media: [
      {
        poster: '/evidence/mine-monitor-demo-poster.webp',
        videoMp4: '/media/mine-monitor-demo.mp4',
        caption: '实时监控演示：视频流接入 AI 检测，违规行为直接推成告警。',
        transcript: [
          '打开实时监控画面，多路视频同屏。',
          'AI 检测框实时叠加在画面上。',
          '识别到违规行为后推送告警到列表。'
        ]
      },
      {
        poster: '/evidence/mine-train-demo-poster.webp',
        videoMp4: '/media/mine-train-demo.mp4',
        caption: '模型训练演示：从数据集选择到训练启动，再到指标曲线回看。',
        transcript: [
          '选择数据集并配置训练参数。',
          '启动训练任务，日志实时输出。',
          '训练完成后查看 loss 与 mAP 曲线。'
        ]
      }
    ]
  }
};
