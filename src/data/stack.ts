/**
 * 技术栈总览。
 * 每一项都来自 projects.ts 中真实声明过的技术，projects 字段记录它出现在哪些案例里，
 * 避免出现"简历上写了但站内查无此项"的情况。
 */

export interface StackItem {
  name: string;
  projects: string[];
}

export interface StackGroup {
  title: string;
  summary: string;
  items: StackItem[];
}

export const stackGroups: StackGroup[] = [
  {
    title: '后端与服务',
    summary: '以 Spring Boot 为主的业务服务、持久层与中间件。',
    items: [
      { name: 'Spring Boot', projects: ['NexusAgent', '灵犀会议室', '煤矿监管', '长耀健行'] },
      { name: 'MyBatis Plus', projects: ['灵犀会议室'] },
      { name: 'MySQL', projects: ['灵犀会议室', '煤矿监管', '长耀健行'] },
      { name: 'Redis · Redisson', projects: ['灵犀会议室'] },
      { name: 'Kafka', projects: ['煤矿监管'] },
      { name: 'Flyway', projects: ['NexusAgent'] },
      { name: 'FastAPI', projects: ['WorkBuddy'] }
    ]
  },
  {
    title: '大模型与检索',
    summary: '模型接入、流式输出、检索增强与 Agent 执行链路。',
    items: [
      { name: 'SSE 流式输出', projects: ['NexusAgent', '灵犀会议室'] },
      { name: 'ReAct 执行循环', projects: ['NexusAgent'] },
      { name: 'BM25 检索', projects: ['NexusAgent'] },
      { name: 'LangChain', projects: ['WorkBuddy'] },
      { name: 'Chroma 向量库', projects: ['WorkBuddy'] },
      { name: 'BGE Reranker', projects: ['WorkBuddy'] },
      { name: 'DeepSeek / Moonshot API', projects: ['WorkBuddy', '灵犀会议室'] }
    ]
  },
  {
    title: '前端与可视化',
    summary: '业务前端、遗留系统重构与图表可视化。',
    items: [
      { name: 'Vue 2 · Vue 3', projects: ['DTS Dashboard', 'WorkBuddy', '灵犀会议室'] },
      { name: 'React', projects: ['NexusAgent'] },
      { name: 'Element UI', projects: ['DTS Dashboard'] },
      { name: 'ECharts', projects: ['DTS Dashboard', '长耀健行'] },
      { name: 'bootstrapTable', projects: ['DTS Dashboard'] },
      { name: 'WebSocket · STOMP', projects: ['长耀健行'] }
    ]
  },
  {
    title: '视觉与设备',
    summary: '计算机视觉模型与机器人侧设备通信。',
    items: [
      { name: 'YOLOv8', projects: ['煤矿监管'] },
      { name: 'YOLO11 Pose', projects: ['长耀健行'] },
      { name: 'ROS', projects: ['长耀健行'] }
    ]
  },
  {
    title: '工程与交付',
    summary: '容器化、部署、测试与协作规范。',
    items: [
      { name: 'Docker · Docker Compose', projects: ['NexusAgent', '煤矿监管'] },
      { name: 'Nginx', projects: ['煤矿监管'] },
      { name: 'Git', projects: ['DTS Dashboard', 'Agent Skills'] },
      { name: 'E2E Testing', projects: ['Agent Skills'] },
      { name: 'RBAC 权限模型', projects: ['NexusAgent'] }
    ]
  },
  {
    title: '方法与协议',
    summary: '把工程判断固化为可复用、可审查的执行协议。',
    items: [
      { name: 'Agent Skills', projects: ['重构罗盘', 'Agent Skills'] },
      { name: 'ADR 决策记录', projects: ['重构罗盘'] },
      { name: 'DoD 完成定义', projects: ['重构罗盘'] },
      { name: '对抗式审查', projects: ['重构罗盘'] },
      { name: 'MarkItDown 文档摄取', projects: ['Agent Skills'] }
    ]
  }
];
