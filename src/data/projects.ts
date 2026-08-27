import type { ImageMetadata } from 'astro';

import wbDashboard from '../assets/evidence/wb-dashboard.webp';
import meetingDashboard from '../assets/evidence/meeting-dashboard.webp';
import mineDashboard from '../assets/evidence/mine-dashboard.webp';
import changyaoMonitor from '../assets/evidence/changyao-monitor.webp';
import nexusDashboard from '../assets/evidence/nexus-dashboard.webp';
import dtsCover from '../assets/evidence/dts-cover.webp';
import compassCover from '../assets/evidence/compass-cover.webp';
import skillsCover from '../assets/evidence/skills-cover.webp';

export type ProjectCategory = 'enterprise' | 'agent' | 'backend' | 'iot' | 'tooling';

/**
 * Importable copies of the card images so Astro's build can emit a real
 * responsive srcset. `Project.image` stays a plain public path because
 * Open Graph tags need an absolute, unhashed URL.
 */
export const projectImages: Record<string, ImageMetadata> = {
  'dts-dashboard': dtsCover,
  'nexus-agent': nexusDashboard,
  workbuddy: wbDashboard,
  'smart-meeting': meetingDashboard,
  'refactor-compass': compassCover,
  'smart-mine': mineDashboard,
  'fall-detection': changyaoMonitor,
  'agent-skills': skillsCover
};

export interface Project {
  slug: string;
  image: string;
  /** Layered architecture diagram rendered on the project detail page. */
  architecture?: {
    src: string;
    alt: string;
    caption: string;
  };
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  period: string;
  role: string;
  summary: string;
  statement: string;
  stack: string[];
  highlights: string[];
  evidence: string[];
  sections: {
    title: string;
    paragraphs?: string[];
    items?: string[];
  }[];
  repository?: string;
  featured: boolean;
  tone: 'amber' | 'green' | 'graphite';
}

export const projects: Project[] = [
  {
    slug: 'dts-dashboard',
    image: '/evidence/dts-cover.webp',
    architecture: {
      src: '/architecture/dts-dashboard-architecture.svg',
      alt: 'DTS Dashboard 分层结构图：使用入口、交互配置层、渲染链路与数据服务',
      caption: '系统分层示意。多套渲染链路并存是这个遗留系统最主要的复杂度来源。'
    },
    title: 'DTS Dashboard 版本升级与前端重构',
    shortTitle: 'DTS Dashboard',
    category: 'enterprise',
    categoryLabel: '企业工程',
    period: '2026.07 - 2026.08',
    role: '前端开发实习生',
    summary: '在 Vue 2 遗留系统中推进版本升级、复杂问题修复与前端重构，建立从根因分析到回归打包的交付闭环。',
    statement: '不是把旧页面重新画一遍，而是在双设计器、图表与表格多链路并存的系统中恢复可预测性。',
    stack: ['Vue 2', 'Element UI', 'ECharts', 'bootstrapTable', 'JavaScript', 'Git'],
    highlights: ['40+ 条可归属功能与修复提交', '筛选、导出、引用链路重构', '遗留组件边界问题治理'],
    evidence: ['61 条个人作者提交', '去除 Merge 与打包后 47 条', '连续实习周报与 Git 历史交叉核验'],
    sections: [
      {
        title: '项目背景',
        paragraphs: [
          'DTS Dashboard 是企业级拖拽式数据可视化设计器。用户可以配置字段、图表、筛选条件、引用已有设计并导出结果。系统长期演进后形成 design 与 newDesign 双目录，以及 ECharts、bootstrapTable 等多套渲染链路。',
          '我的工作聚焦版本升级开发与前端重构：既修复用户可见的问题，也梳理隐藏在组件边界、字段映射和重绘生命周期里的结构性原因。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '统一筛选状态与导出数据链路，处理编辑态数据缺失和字段映射不一致。',
          '重构已保存设计的引用选择与数据回填流程。',
          '治理 Element UI Popper 越界、sticky 操作区遮挡与滚动容器冲突。',
          '处理 bootstrapTable 重绘覆盖列宽、表头构建和合计展示问题。',
          '统一日期、整数、小数位、图表标签与颜色等显示规则。'
        ]
      },
      {
        title: '工作方法',
        paragraphs: [
          '遗留系统改造中，能运行不等于可交付。每项问题先复现，再沿请求、状态、字段映射与组件生命周期逐层定位根因；涉及后端配合时，以接口与数据结构说明对齐方案。',
          '任何存在风险的修改都会重新评估，并准备可回退路径，确保每次改动都可解释、可验证、可回退。'
        ]
      },
      {
        title: '关于公开范围',
        paragraphs: [
          '这是企业项目，页面上只写可授权公开的产品方向、技术栈与工作方法，不涉及公司源代码、内网仓库、客户信息、工单原文与生产环境配置。'
        ]
      }
    ],
    featured: true,
    tone: 'amber'
  },
  {
    slug: 'nexus-agent',
    image: '/evidence/nexus-dashboard.webp',
    architecture: {
      src: '/architecture/nexus-agent-architecture.svg',
      alt: 'NexusAgent 分层结构图：前端、接入层、Agent 运行时、治理平面与数据运维',
      caption: '治理平面与 Agent 运行时并列，是这个平台区别于普通聊天 Demo 的地方。'
    },
    title: 'NexusAgent 企业智能体平台',
    shortTitle: 'NexusAgent',
    category: 'agent',
    categoryLabel: 'Agent 平台',
    period: '2026',
    role: '主要开发者',
    summary: '从模型调用与 Agent 执行扩展到权限、审计、设备、评估和部署，构建可治理的企业智能体平台原型。',
    statement: '聊天窗口只是入口，权限、审计、评估和运行追踪才让 Agent 进入工程系统。',
    stack: ['Spring Boot', 'React', 'SSE', 'ReAct', 'BM25', 'RBAC', 'Flyway', 'Docker'],
    highlights: ['SSE 真实流式输出', 'ReAct 与 BM25 检索', '治理平面与工程化交付'],
    evidence: ['本地 Git 历史核验', '前端测试与 CI', '启动、测试与容器化文档'],
    sections: [
      {
        title: '项目背景',
        paragraphs: [
          '许多 Agent Demo 只证明模型能回答一次问题，却没有解决企业内部的模型配置、权限控制、审计追踪、设备接入、提示词版本和用量治理。NexusAgent 尝试把这些能力放进同一个可运行系统。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '以 OpenAI 兼容接口接入模型，并将模拟分块输出替换为真实 SSE token 流。',
          '实现 few-shot 意图识别、ReAct 执行循环与 BM25 检索。',
          '构建人员、设备、权限、审批、审计和用量管理模块。',
          '加入模型配置脱敏、Prompt 版本、离线评估与低分反馈分析。',
          '使用 Flyway 管理迁移，补充前端单元测试、CI 和容器化文档。'
        ]
      },
      {
        title: '后续计划',
        paragraphs: [
          '系统仍在迭代：Redis 安全配置、Token 存储迁移、更完整的工具选择机制，以及 BM25 与向量的混合检索都已经排进后续版本。'
        ]
      }
    ],
    featured: true,
    tone: 'green'
  },
  {
    slug: 'workbuddy',
    image: '/evidence/wb-dashboard.webp',
    architecture: {
      src: '/architecture/workbuddy-architecture.svg',
      alt: 'WorkBuddy 分层结构图：用户侧、应用服务、检索链路与模型存储',
      caption: '检索链路是整个产品的核心：切片、向量检索、重排，再交给模型作答。'
    },
    title: 'WorkBuddy 科研写作伙伴',
    shortTitle: 'WorkBuddy',
    category: 'agent',
    categoryLabel: 'RAG 应用',
    period: '2026',
    role: '需求分析与全栈开发',
    summary: '以 20 条需求决策卡和 18 版原型驱动产品从固定流程工作台演进为对话式科研伙伴。',
    statement: '先解决科研人员如何判断与引用，再决定模型应该生成什么。',
    stack: ['LangChain', 'FastAPI', 'Vue 3', 'Chroma', 'BGE Reranker', 'DeepSeek API'],
    highlights: ['20 条需求决策卡', '18 版可交互原型', 'RAG 检索与引用链路'],
    evidence: ['需求说明与决策记录', '原型演进材料', '指标等待原始评测报告'],
    sections: [
      {
        title: '产品是怎么定下来的',
        paragraphs: [
          '最初方案试图把科研工作拆成固定的六阶段流程。通过持续原型验证，我们发现真实科研任务并不总按固定顺序发生，最终把核心体验收敛为以对话为入口、以文献依据为约束的科研写作伙伴。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '将访谈、冲突、可行性与风险整理为 20 条需求决策卡。',
          '完成 18 版 HTML 可交互原型，用实际操作推动需求确认。',
          '统一需求说明、项目报告与架构文档中的历史矛盾。',
          '设计导入、切片、向量检索、重排、引用回答和上下文管理链路。',
          '明确人、AI 与系统边界，保留用户对研究结论和引用的最终责任。'
        ]
      },
      {
        title: '关于效果数据',
        paragraphs: [
          '检索效果以原始数据集、指标口径和运行记录为准。当前版本使用 500 到 800 token 语义切片配合 BGE Reranker，完整对比结果会随原始评测报告一起公开。'
        ]
      }
    ],
    featured: true,
    tone: 'graphite'
  },
  {
    slug: 'smart-meeting',
    image: '/evidence/meeting-dashboard.webp',
    architecture: {
      src: '/architecture/smart-meeting-architecture.svg',
      alt: '灵犀会议室分层结构图：前端、业务服务、外部能力与数据部署',
      caption: '预订冲突用分布式锁解决，AI 纪要通过 SSE 流式返回。'
    },
    title: '灵犀会议室',
    shortTitle: '灵犀会议室',
    category: 'backend',
    categoryLabel: 'Java 全栈',
    period: '2026',
    role: '后端负责人',
    summary: '在会议预订与协作流程中接入 LLM，以分布式锁处理时间冲突，并用 SSE 生成结构化会议内容。',
    statement: '让 AI 进入业务事务，而不是把对话能力悬挂在系统之外。',
    stack: ['Spring Boot', 'Vue 3', 'MyBatis Plus', 'MySQL', 'Redis', 'Redisson', 'Moonshot AI', 'SSE'],
    highlights: ['会议预订冲突治理', '结构化流式纪要', 'Docker Compose 编排'],
    evidence: ['Gitee 公开仓库', '技术方案交叉核验', '性能数字等待压测报告'],
    sections: [
      {
        title: '系统设计',
        paragraphs: [
          '系统围绕用户、组织、会议室、预订、纪要、决议和待办建立数据模型。MySQL 保存事务性业务数据，Redis 承担缓存、Token 和分布式协调。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '使用 Redisson 分布式锁与看门狗机制降低并发预订冲突。',
          '通过 Moonshot AI 与 SSE 输出会议摘要、关键决议、待办事项和下一步计划。',
          '使用 Docker Compose 编排应用、MySQL 与 Redis。',
          '整理接口回归、异常处理和部署流程。'
        ]
      },
      {
        title: '当前进度',
        paragraphs: [
          '仓库与技术实现可以公开查看；并发与响应指标会随压测脚本、运行环境和原始报告一起补充。'
        ]
      }
    ],
    repository: 'https://gitee.com/anhuiwuhu_xsy/smart-meeting',
    featured: true,
    tone: 'amber'
  },
  {
    slug: 'refactor-compass',
    image: '/evidence/compass-cover.webp',
    architecture: {
      src: '/architecture/refactor-compass-architecture.svg',
      alt: 'Refactor Compass 阶段流程图：起点评估、决策冻结、分批迁移、完成度量化与终局交付',
      caption: '十个阶段串成一条带退出条件的迁移路径，每一批都可以独立回退。'
    },
    title: 'Refactor Compass 重构罗盘',
    shortTitle: '重构罗盘',
    category: 'tooling',
    categoryLabel: 'Agent Skill',
    period: '2026',
    role: '设计与开发',
    summary: '将遗留系统改造拆为可验证、可回退、可交接的阶段化流程，避免用代码量代替真实完成度。',
    statement: '重构不是一次豪赌，而是一组带退出条件的工程实验。',
    stack: ['Agent Skills', 'SDLC', 'ADR', 'DoD', '对抗式审查', '迁移审计'],
    highlights: ['10 阶段迁移流程', '入口枚举与覆盖矩阵', '双 AI 独立复核'],
    evidence: ['本地 v1.0.1', 'MIT License', '完整参考手册与模板'],
    sections: [
      {
        title: '为什么做这个',
        paragraphs: [
          '遗留系统重构最容易在三个地方失败：需求没有盘全、审查没有查到、交付行为与旧系统对不上。重构罗盘为这三类问题提供入口枚举、对抗式审查、行为基准与差距台账。'
        ]
      },
      {
        title: '流程怎么走',
        items: [
          '以源码、环境、文档和领域知识做起点评估。',
          '通过评分矩阵、PoC 与 ADR 冻结技术选型。',
          '按能力域分批迁移，每批设置 DoD 与独立回退点。',
          '用覆盖矩阵、占位扫描和行为差距量化完成度。',
          '完成双跑观察、部署移交与四维终局审计。'
        ]
      },
      {
        title: '交付形态',
        paragraphs: [
          'Skill 由入口说明、五份按需参考手册、模板集和 Agent 元信息组成。它不绑定某一个项目，目标是把个人的工程判断沉淀成可复用、可审查的执行协议。'
        ]
      }
    ],
    featured: true,
    tone: 'green'
  },
  {
    slug: 'smart-mine',
    image: '/evidence/mine-dashboard.webp',
    architecture: {
      src: '/architecture/smart-mine-architecture.svg',
      alt: '煤矿全域智能监管平台架构图：感知层、AI 推理、Kafka 消息总线、业务服务与展示部署',
      caption: 'Kafka 把摄像头、AI 检测和业务预警解耦开，任何一环重启都不会丢事件。'
    },
    title: '煤矿全域智能监管平台',
    shortTitle: '矿智未来',
    category: 'iot',
    categoryLabel: 'IoT 与 AI',
    period: '2025',
    role: '后端开发',
    summary: '将 IoT 数据、AI 检测、Kafka 消息总线与业务预警整合为可容器化部署的行业监管平台。',
    statement: '模型检测只是事件源，可靠的消息与业务链路才构成监管系统。',
    stack: ['Spring Boot 3', 'RuoYi Vue', 'Kafka', 'MySQL', 'Docker Compose', 'YOLOv8', 'Nginx'],
    highlights: ['IoT 与 AI 预警总线', '容器化服务编排', '国家级与省级竞赛成果'],
    evidence: ['竞赛系统清单核验', '历史源码盘点', '职责边界等待案例页素材'],
    sections: [
      {
        title: '项目背景',
        paragraphs: [
          '平台面向矿山全域监管，把设备状态、AI 检测结果和业务预警统一接进来。重点不是单独跑一个 YOLO 模型，而是让检测结果能进入可追踪的消息和处置流程。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '用 Kafka 解耦 IoT 事件、AI 检测结果和预警消费三条链路。',
          '用 Spring Boot 和 MySQL 搭建监管业务服务。',
          '用 Docker Compose 编排服务、数据库、中间件和反向代理。',
          '把 YOLOv8 的检测结果接进告警链路。'
        ]
      },
      {
        title: '相关成果',
        paragraphs: [
          '这个方向的工作参加过 2025 年第六届辽宁省中软国际卓越杯 AI 挑战赛，以及第七届全球校园人工智能算法精英大赛东北赛区选拔赛。平台界面和参赛材料都可以当面看。'
        ]
      }
    ],
    featured: true,
    tone: 'graphite'
  },
  {
    slug: 'fall-detection',
    image: '/evidence/changyao-monitor.webp',
    architecture: {
      src: '/architecture/fall-detection-architecture.svg',
      alt: '长耀健行助手架构图：设备端、检测服务、后端服务与监护端',
      caption: '小车负责采集，检测服务负责判定，后端负责推送，最后一步交给人确认。'
    },
    title: '长耀健行助手',
    shortTitle: '长耀健行',
    category: 'iot',
    categoryLabel: 'IoT 与 CV',
    period: '2025',
    role: '后端与 Web 协作',
    summary: '基于 ROS 智能车与 YOLO11 Pose 构建跌倒检测链路，并将监测和告警状态实时推送到 Web 仪表盘。',
    statement: '安全关键场景中，模型负责初筛，人保留最终确认权。',
    stack: ['Spring Boot', 'WebSocket', 'STOMP', 'YOLO11 Pose', 'ROS', 'MySQL', 'ECharts'],
    highlights: ['软硬件协同', '实时状态推送', '大创验收合格'],
    evidence: ['学校大创记录', '项目文档摘要', '精确性能等待测试记录'],
    sections: [
      {
        title: '系统怎么串起来',
        paragraphs: [
          'JetRover ROS 智能车负责现场视频采集和设备通信，YOLO11 Pose 做姿态估计，后端管理业务数据并通过 WebSocket 和 STOMP 推送实时状态，Web 大屏展示检测结果、告警和设备状态。'
        ]
      },
      {
        title: '我做的事',
        items: [
          '普通业务数据走 REST API，实时检测状态走 WebSocket 推送。',
          '处理连接中断、自动重连，以及 ECharts 高频重绘带来的性能压力。',
          '在安全相关的判定上保留人工确认，模型结果不直接当成医疗结论。'
        ]
      },
      {
        title: '目前的进度',
        paragraphs: [
          '监控大屏、结项材料和现场演示都可以看。延迟、误报率、漏检率这些数据还需要在标准测试环境下重新测一遍再补上，现在不想凭印象写数字。'
        ]
      }
    ],
    featured: false,
    tone: 'amber'
  },
  {
    slug: 'agent-skills',
    image: '/evidence/skills-cover.webp',
    architecture: {
      src: '/architecture/agent-skills-architecture.svg',
      alt: 'Agent Skills 工具集结构图：触发入口、Skill 集合、执行约定与产出物',
      caption: '每个 Skill 都是一套固定的触发条件、执行步骤和产出格式。'
    },
    title: 'Agent Skills 工程工具集',
    shortTitle: 'Agent Skills',
    category: 'tooling',
    categoryLabel: '开发者工具',
    period: '2026',
    role: '设计与开发',
    summary: '将代码检视、文档摄取、测试执行、Git 规范与周报汇总沉淀为可复用的 Agent 执行协议。',
    statement: '好的 Skill 不替人做决定，而是让依据、步骤和边界可复用。',
    stack: ['Agent Skills', 'Git', 'HTML Report', 'MarkItDown', 'E2E Testing', 'Automation'],
    highlights: ['人工代码检视报告', '多格式文档摄取', '测试与协作自动化'],
    evidence: ['GitHub 公开仓库', '本地完整 Skill 资产', '个人项目确认'],
    sections: [
      {
        title: '包含哪些工具',
        items: [
          'explain diff for human review：把 Git 差异整理成一份自包含的 HTML 检视报告。',
          'markitdown：把 PDF、Office 文档、图片和网页转成适合 LLM 和 RAG 使用的 Markdown。',
          '测试类 Skills：从需求或真实页面生成用例，再逐条执行并输出报告。',
          'Git 与周报 Skills：固化分支提交规范，按提交记录汇总一周的工作。'
        ]
      },
      {
        title: '设计上的考虑',
        paragraphs: [
          '每个 Skill 都要写清楚什么时候触发、输入是什么、输出是什么、分几步执行、失败了怎么降级、边界在哪里。用到外部工具或者第三方基础的地方会在说明里注明来源，不把集成工作写成自己原创。'
        ]
      }
    ],
    repository: 'https://github.com/GitHubxsy/agent-skills',
    featured: false,
    tone: 'green'
  }
];

export const featuredProjects = projects.filter((project) => project.featured);

export const categoryLabels: Record<ProjectCategory, string> = {
  enterprise: '企业工程',
  agent: 'Agent 与 RAG',
  backend: 'Java 全栈',
  iot: 'IoT 与视觉',
  tooling: '开发者工具'
};
