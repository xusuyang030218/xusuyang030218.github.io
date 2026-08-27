/**
 * 工程随笔。
 * 全部改写自真实经历：DTS 内网提交、NexusAgent 本地仓库实现、长耀健行结项材料。
 * 不引用无法核验的数字，不展示企业源码。
 */

export interface Note {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  summary: string;
  tags: string[];
  related?: { label: string; href: string };
  paragraphs: (
    | { type: 'text'; value: string }
    | { type: 'heading'; value: string }
    | { type: 'list'; value: string[] }
    | { type: 'code'; language: string; caption: string; value: string }
    | { type: 'quote'; value: string }
  )[];
}

export const notes: Note[] = [
  {
    slug: 'one-word-every-to-some',
    title: '一个 every 改成 some：被误读的"列宽不生效"',
    date: '2026-08-20',
    readingTime: '约 4 分钟',
    summary: '用户报的是"设置了列宽没反应"，最后落到一个布尔判断的量词上。真正花时间的不是改代码，是确认它到底该在什么条件下生效。',
    tags: ['遗留系统', 'Vue 2', '根因定位'],
    related: { label: '查看 DTS Dashboard 案例', href: '/projects/dts-dashboard/' },
    paragraphs: [
      {
        type: 'text',
        value: '表格组件收到一个反馈：给某一列配置了宽度，页面上没有任何变化。第一反应通常是去查渲染层，怀疑样式被覆盖或者重绘时机不对。但这类问题更常见的原因，是判断条件本身写得比需求更严格。'
      },
      { type: 'heading', value: '先复现，再决定看哪一层' },
      {
        type: 'text',
        value: '复现路径很短：配置一列宽度，保存，刷新，宽度不生效；把所有列都配上宽度，宽度生效了。这个对比直接把范围缩小到"触发条件"，而不是"宽度怎么应用"。渲染逻辑是对的，只是它没被允许执行。'
      },
      {
        type: 'code',
        language: 'diff',
        caption: 'TableBuild.js · 触发条件修正',
        value: `- var allCustomWidth = leafColumns.length > 0 && leafColumns.every(function (col) {\n-   return !col.field || (col.width !== '' && col.width !== undefined && col.width !== null);\n+ var hasCustomWidth = leafColumns.length > 0 && leafColumns.some(function (col) {\n+   return col.field && col.width !== '' && col.width !== undefined && col.width !== null;\n  });\n- $('.chart').css('width', allCustomWidth ? 'auto' : '');\n+ $('.chart').css('width', hasCustomWidth ? 'auto' : '');`
      },
      {
        type: 'text',
        value: '原逻辑要求"每一个末级列都配置了宽度"才切换成自适应宽度。只要有一列没配，整张表就退回默认行为。改成 some 之后，任意一个有效业务列配置了宽度即可触发。同时把 `!col.field` 的短路条件收紧为 `col.field`，避免把没有字段绑定的占位列也算进来。'
      },
      { type: 'heading', value: '为什么不是"加个样式盖掉它"' },
      {
        type: 'text',
        value: '在遗留系统里，用更高优先级的样式强行覆盖是最快的路径，也是最容易积累债务的路径。下一个人看到这段样式时，无法判断它在修什么，只能继续叠加。把判断条件改对，代码量更小，后续也解释得清。'
      },
      {
        type: 'quote',
        value: '"能运行"和"可交付"之间的差距，往往就是一个说不清楚为什么要这样写的补丁。'
      },
      { type: 'heading', value: '留下的东西' },
      {
        type: 'list',
        value: [
          '改动落在一个文件、四行，提交 ace6dfd，可回退。',
          '触发条件从"全部满足"变成"存在即可"，与产品预期一致。',
          '没有引入新的样式覆盖，也没有改动渲染链路本身。'
        ]
      },
      {
        type: 'text',
        value: '这类问题的价值不在于难度，而在于它提醒了一件事：读需求的时候要顺便读一遍判断的量词。every 和 some 只差一个词，行为差了一整个功能。'
      }
    ]
  },
  {
    slug: 'react-loop-needs-a-fallback',
    title: 'ReAct 循环必须有降级路径',
    date: '2026-07-13',
    readingTime: '约 5 分钟',
    summary: '让模型自己决定调用哪个工具，问题不在成功路径，而在模型不可用、返回空内容、或者撞上高风险工具时，系统还能不能给出确定的行为。',
    tags: ['Agent', 'SSE', 'Spring Boot'],
    related: { label: '查看 NexusAgent 案例', href: '/projects/nexus-agent/' },
    paragraphs: [
      {
        type: 'text',
        value: '把 Agent 从"能回答一次问题"做到"能放进业务系统"，中间隔着的不是模型能力，是确定性。一个 ReAct 循环在演示里跑通很容易，但它至少有三种情况会不按预期结束：模型服务不可用、达到最大迭代仍未给出答案、以及中途要调用需要审批的高风险工具。'
      },
      { type: 'heading', value: '三个出口，而不是一个' },
      {
        type: 'text',
        value: '流式执行入口的结构可以概括成：先跑工具循环，再根据循环的结束状态决定怎么产出最终回答。关键在于循环返回的不是一个字符串，而是一个带状态的上下文。'
      },
      {
        type: 'code',
        language: 'java',
        caption: 'NexusAgentRuntimeEngine.java · 流式执行入口',
        value: `ReActContext context = runReactToolLoop(safeRequest, loop);\n\n// 出口一：撞上高风险工具，暂停并转审批\nif (context.isPendingApproval()) {\n  return buildPendingApprovalResponse(\n    safeRequest, context.getApprovalTool(), loop);\n}\n\nif (context.isLlmAvailable()) {\n  // 出口二：基于完整对话历史流式生成最终答案\n  streamingResult = callLlmStreamingWithMessages(\n    modelConfig, context.getMessages(), onToken);\n} else {\n  // 出口三：模型不可用，降级到规则工具规划\n  List<AiTool> plannedTools = planToolsByKeyword(safeRequest);\n}`
      },
      { type: 'heading', value: '降级不是兜底，是产品行为' },
      {
        type: 'text',
        value: '把降级写进主流程而不是 catch 块，意味着"模型挂了"这件事有明确的用户可见结果：系统改用关键词规划工具，仍然完成一次可解释的执行，而不是抛出一个栈信息。日志里会记录降级原因，执行链路里也会追加一条 thought，说明这一轮为什么没有走模型路径。'
      },
      {
        type: 'list',
        value: [
          '高风险工具不由模型直接执行，先转人工审批。',
          '模型不可用时切换到规则规划，保留可用性。',
          '每次降级都在执行链路里留痕，便于事后追溯。'
        ]
      },
      { type: 'heading', value: '还没做完的部分' },
      {
        type: 'text',
        value: '工具选择目前不是完全由 function calling 驱动，检索也还没有做成 BM25 与向量的混合方案。这些写在路线图里，按节奏推进。把未完成的部分标清楚，比把它说成已完成更省事。'
      }
    ]
  },
  {
    slug: 'prototype-as-evidence',
    title: '先做一个能触发告警的原型',
    date: '2026-05-29',
    readingTime: '约 4 分钟',
    summary: '跌倒检测这类项目，最难向外说明的不是模型，而是"告警发生的那一刻界面是什么样"。与其描述，不如把它做成可以当场触发的原型。',
    tags: ['原型', '可视化', 'Playwright'],
    related: { label: '查看长耀健行助手案例', href: '/projects/fall-detection/' },
    paragraphs: [
      {
        type: 'text',
        value: '做安全相关的监控系统，汇报时最容易卡住的一步是：正常状态大家都见过，异常状态怎么证明？真实摔倒不能演，等待真实告警又不可控。所以把监控大屏做成了一个可以用脚本触发状态切换的原型。'
      },
      { type: 'heading', value: '把异常状态变成可复现的一步操作' },
      {
        type: 'text',
        value: '大屏本身是一个自包含的页面，姿态状态、跌倒风险、事件日志都由 DOM 驱动。于是触发告警不需要真的接摄像头，只需要把这几个节点切换到告警态，界面的其余部分（配色、布局、事件流）会按照真实逻辑响应。'
      },
      {
        type: 'code',
        language: 'javascript',
        caption: '截图脚本 · 触发跌倒告警',
        value: `await page.evaluate(() => {\n  document.getElementById('fall-alert').style.display = 'flex';\n  document.getElementById('pose-status').textContent = '跌倒!';\n  document.getElementById('pose-status').className = 'pose-val c-danger';\n  document.getElementById('fall-risk').textContent = '高';\n});`
      },
      {
        type: 'text',
        value: '配合 Playwright，同一套脚本既能产出结项材料需要的静态截图，也能录制成演示视频。每次界面调整后重新跑一遍，材料自动保持同步，不需要手工重截。'
      },
      { type: 'heading', value: '要说清楚它证明了什么' },
      {
        type: 'quote',
        value: '原型能证明信息架构和交互路径成立，不能证明模型在真实场景下的准确率。'
      },
      {
        type: 'text',
        value: '这一点必须在材料里写明。原型展示的是"告警发生时，值班人员看到什么、能做什么"，这是产品设计问题；而误报率、漏检率、推理延迟属于模型评估问题，要用真实测试环境和原始记录来回答。把两件事混在一起说，是这类项目最常见的夸大方式。'
      },
      {
        type: 'list',
        value: [
          '原型负责验证信息架构与告警交互路径。',
          '性能指标留给真实测试记录，不用原型数据代替。',
          '截图与视频由脚本生成，界面改动后可一键重出。'
        ]
      }
    ]
  }
];
