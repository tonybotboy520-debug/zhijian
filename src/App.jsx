import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Article, ArrowDown, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowUp, At, Bell, Buildings, CalendarBlank, CaretDown, CaretLeft,
  CaretRight, ChartBar, ChartLineUp, Check, CheckCircle, ClockCountdown,
  Database, DotsThree, Eye, FileText, FilmStrip, FolderSimple, FunnelSimple,
  GlobeHemisphereWest, House, Lightning, MagnifyingGlass, Minus, MonitorPlay,
  Newspaper, PaperPlaneTilt, PencilLine, Percent, Plus, Pulse, Quotes, Robot, SelectionAll,
  Sparkle, Target, TrendDown, TrendUp, VideoCamera, X, UsersThree, ListNumbers,
} from "@phosphor-icons/react";
import { HomePortal as HomePage } from "./HomePortal.jsx";

const PRIMARY_NAV = [
  ["首页", House], ["知识库", Database], ["AI诊断", Pulse],
  ["GEO", GlobeHemisphereWest], ["AIGC", PencilLine],
  ["AI官网", MonitorPlay], ["AI运营", UsersThree], ["Agent市场", Robot],
];

const SECONDARY_NAV = [
  ["项目", FolderSimple], ["选词", SelectionAll], ["创作", PencilLine],
  ["发布", PaperPlaneTilt], ["统计", ChartLineUp],
];

const TERTIARY_NAV = {
  创作: ["文章", "短视频"],
  发布: ["选择媒体", "发布任务"],
  统计: ["项目概览", "关键词表现", "内容表现", "媒体表现"],
};

const STAGES = ["选词", "诊断", "提案", "信源", "创作", "统计"];

const STAGE_DETAILS = [
  { title: "关键词策略与选词", description: "基于业务、用户需求和搜索意图生成项目关键词方案。", output: "选词策略报告" },
  { title: "GEO 现状诊断", description: "围绕已选关键词分析品牌、内容与 AI 平台表现，明确优化机会。", output: "GEO 诊断报告" },
  { title: "项目策略提案", description: "结合选词与诊断结论，形成内容方向、执行节奏和验收口径。", output: "GEO 项目提案" },
  { title: "可信信源规划", description: "筛选并确认与项目主题匹配的权威信源、媒体和引用依据。", output: "信源策略报告" },
  { title: "内容策略与创作", description: "围绕关键词和诊断结论生成、审核并管理项目内容。", output: "内容创作报告" },
  { title: "GEO 数据统计", description: "汇总 AI 收录、品牌提及、引用和关键词表现。", output: "GEO 统计分析报告" },
];

const STAGE_STATUS_LABELS = {
  review: "待客户确认",
  executing: "执行中",
  complete: "已完成",
  locked: "待前序完成",
};

const PROJECTS = [
  {
    id: 1, name: "智服云 · 智能客服系统优化", order: "DD202608130001",
    keyword: "智能客服系统", keywordCount: 10, content: [30, 30], media: [20, 20],
    strategyCounts: { keywords: 10, media: 20, articles: 30 },
    phase: 4, updated: "08-13 10:23",
    articles: [
      { title: "智能客服系统核心功能解析与应用场景", status: "已完成", time: "2026-08-12 15:30", media: ["知乎", "百家号"] },
      { title: "如何选择适合企业的智能客服系统？7个关键指标", status: "生成中", time: "2026-08-13 09:45", media: ["今日头条", "搜狐号"] },
    ],
  },
  {
    id: 2, name: "企信源 · 品牌舆情监测服务", order: "DD202608120008",
    keyword: "品牌舆情监测", keywordCount: 4, content: [6, 8], media: [5, 6],
    phase: 3, updated: "08-12 18:42",
    articles: [
      { title: "企业品牌舆情监测的完整方法", status: "已完成", time: "2026-08-11 16:20", media: ["知乎", "搜狐号"] },
      { title: "2026舆情监测工具选择指南", status: "已完成", time: "2026-08-12 11:05", media: ["百家号", "今日头条"] },
    ],
  },
  {
    id: 3, name: "智学教育 · AI课程推广项目", order: "DD202608110015",
    keyword: "AI课程推荐", keywordCount: 3, content: [8, 8], media: [6, 6],
    phase: 5, updated: "08-11 21:17",
    articles: [
      { title: "零基础学习AI课程的路径建议", status: "已完成", time: "2026-08-10 13:10", media: ["知乎", "百家号", "今日头条"] },
      { title: "企业AI培训课程怎么选", status: "已完成", time: "2026-08-10 17:30", media: ["搜狐号", "知乎"] },
    ],
  },
  {
    id: 4, name: "美妆优选 · 新品种草计划", order: "DD202608100023",
    keyword: "护肤新品推荐", keywordCount: 5, content: [10, 10], media: [6, 6],
    phase: 5, completed: true, updated: "08-10 17:09",
    articles: [
      { title: "换季护肤新品成分与肤质匹配指南", status: "已完成", time: "2026-08-09 14:00", media: ["小红书", "知乎"] },
      { title: "敏感肌新品选购的五个关键点", status: "已完成", time: "2026-08-09 15:40", media: ["百家号", "搜狐号"] },
    ],
  },
  {
    id: 5, name: "星驰汽车 · 口碑提升项目", order: "DD202608080030",
    keyword: "新能源汽车口碑", keywordCount: 6, content: [0, 6], media: [0, 0],
    phase: 0, updated: "08-08 11:33",
    articles: [
      { title: "新能源汽车真实用车口碑调研", status: "待生成", time: "—", media: ["汽车之家", "知乎"] },
      { title: "城市通勤新能源汽车怎么选", status: "待生成", time: "—", media: ["今日头条", "百家号"] },
    ],
  },
];

const INITIAL_WORD_PACKAGES = [
  { id: "WP-260813-01", name: "智能客服系统核心词包", project: PROJECTS[0].name, seed: "智能客服系统", keywordCount: 18, status: "已确认", created: "2026-08-13" },
  { id: "WP-260812-04", name: "品牌舆情监测场景词包", project: PROJECTS[1].name, seed: "品牌舆情监测", keywordCount: 14, status: "已确认", created: "2026-08-12" },
  { id: "WP-260811-02", name: "AI课程决策词包", project: PROJECTS[2].name, seed: "AI课程推荐", keywordCount: 9, status: "待确认", created: "2026-08-11" },
  { id: "WP-260810-06", name: "护肤新品人群词包", project: PROJECTS[3].name, seed: "护肤新品推荐", keywordCount: 12, status: "已确认", created: "2026-08-10" },
  { id: "WP-260808-03", name: "新能源汽车口碑词包", project: PROJECTS[4].name, seed: "新能源汽车口碑", keywordCount: 6, status: "生成中", created: "2026-08-08" },
];

const ARTICLE_ITEMS = [
  { id: 1, title: "智能客服系统核心功能解析与应用场景", project: PROJECTS[0].name, keyword: PROJECTS[0].keyword, status: "已完成", media: 2, updated: "08-13 10:12" },
  { id: 2, title: "如何选择适合企业的智能客服系统？7个关键指标", project: PROJECTS[0].name, keyword: PROJECTS[0].keyword, status: "生成中", media: 2, updated: "08-13 09:45" },
  { id: 3, title: "2026舆情监测工具选择指南", project: PROJECTS[1].name, keyword: PROJECTS[1].keyword, status: "待审核", media: 3, updated: "08-12 18:22" },
  { id: 4, title: "企业AI培训课程怎么选", project: PROJECTS[2].name, keyword: PROJECTS[2].keyword, status: "已完成", media: 3, updated: "08-11 16:30" },
  { id: 5, title: "敏感肌新品选购的五个关键点", project: PROJECTS[3].name, keyword: PROJECTS[3].keyword, status: "已发布", media: 4, updated: "08-10 14:06" },
];

const VIDEO_ITEMS = [
  { id: 101, title: "60秒看懂智能客服系统", project: PROJECTS[0].name, keyword: PROJECTS[0].keyword, status: "生成中", duration: "00:58", updated: "08-13 11:08" },
  { id: 102, title: "舆情危机黄金处理流程", project: PROJECTS[1].name, keyword: PROJECTS[1].keyword, status: "待审核", duration: "01:24", updated: "08-12 19:20" },
  { id: 103, title: "AI课程三步选择法", project: PROJECTS[2].name, keyword: PROJECTS[2].keyword, status: "已完成", duration: "00:46", updated: "08-11 18:44" },
  { id: 104, title: "新品成分亮点拆解", project: PROJECTS[3].name, keyword: PROJECTS[3].keyword, status: "已发布", duration: "01:10", updated: "08-10 16:18" },
];

const MEDIA = [
  ["知乎", "知识社区", "高权重", 92], ["百家号", "综合资讯", "高收录", 88], ["今日头条", "综合资讯", "高流量", 95], ["搜狐号", "新闻媒体", "高权重", 84],
  ["网易号", "新闻媒体", "高权重", 82], ["腾讯新闻", "新闻媒体", "高流量", 90], ["新浪看点", "新闻媒体", "高收录", 81], ["一点资讯", "综合资讯", "稳定收录", 76],
  ["小红书", "生活方式", "高互动", 94], ["微信公众号", "私域内容", "强触达", 89], ["抖音", "短视频", "高流量", 97], ["视频号", "短视频", "强触达", 91],
  ["B站", "短视频", "年轻用户", 86], ["汽车之家", "垂直媒体", "行业精准", 83], ["什么值得买", "垂直媒体", "消费决策", 80], ["36氪", "商业科技", "行业权威", 78],
  ["钛媒体", "商业科技", "行业精准", 75], ["界面新闻", "新闻媒体", "品牌影响", 79], ["东方财富", "财经媒体", "行业精准", 77], ["雪球", "财经社区", "高互动", 74],
].map(([name, category, strength, score], index) => ({ id: index + 1, name, category, strength, score }));

const PUBLISH_TASKS = [
  { id: "PUB-0813-006", project: PROJECTS[0].name, content: "2篇文章", media: "4家媒体", progress: 75, status: "发布中", updated: "08-13 10:28" },
  { id: "PUB-0812-014", project: PROJECTS[1].name, content: "6篇文章", media: "6家媒体", progress: 100, status: "已完成", updated: "08-12 18:40" },
  { id: "PUB-0811-009", project: PROJECTS[2].name, content: "8篇文章", media: "6家媒体", progress: 92, status: "发布中", updated: "08-11 21:12" },
  { id: "PUB-0810-021", project: PROJECTS[3].name, content: "10篇文章", media: "6家媒体", progress: 100, status: "已完成", updated: "08-10 17:02" },
];

const PLATFORM_STATS = [
  ["DeepSeek", 78, 12, "2.4"], ["豆包", 72, 10, "2.8"], ["千问", 65, 9, "3.1"],
  ["文心一言", 59, 8, "3.4"], ["Kimi", 54, 7, "3.7"], ["智谱", 48, 6, "4.0"],
];

const AI_PLATFORM_OPTIONS = [
  { id: "doubao", name: "豆包", mark: "豆" },
  { id: "deepseek", name: "DeepSeek", mark: "DS" },
  { id: "qwen", name: "千问", mark: "千" },
  { id: "yuanbao", name: "腾讯元宝", mark: "元" },
  { id: "kimi", name: "Kimi", mark: "K" },
  { id: "wenxin", name: "文心一言", mark: "文" },
  { id: "chatglm", name: "智谱清言", mark: "智" },
];

const CONTENT_TYPE_OPTIONS = ["对比测评", "深度分析", "客户案例", "分析报告", "选型指南", "实操教程"];

const cx = (...names) => names.filter(Boolean).join(" ");

function StatusPill({ children }) {
  const tone = children === "已完成" || children === "已发布" || children === "已确认" ? "success" : children === "生成中" || children === "发布中" ? "active" : children === "待审核" || children === "待确认" ? "warning" : "muted";
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function StageTrack({ phase, compact = false }) {
  return <div className={cx("stage-track", compact && "compact")} aria-label={`当前阶段：${STAGES[phase]}`}>
    {STAGES.map((stage, index) => <div className={cx("stage-step", index < phase && "done", index === phase && "current")} key={stage}>
      <span className="stage-dot">{index < phase ? <Check size={10} weight="bold" /> : null}</span><span className="stage-label">{stage}</span>
    </div>)}
  </div>;
}

function ProgressCell({ value, total, suffix }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return <div className="progress-cell"><span><strong>{value}</strong>/{total} {suffix}</span><progress max="100" value={percent} aria-label={`${percent}%`} /></div>;
}

function EmptyStub({ title }) {
  return <section className="empty-stub"><Lightning size={28} /><h2>{title}正在规划中</h2><p>当前原型优先完成 GEO 产品链路。</p></section>;
}

function ProjectExecution({ project, onViewStats }) {
  const keywordItems = getProjectKeywords(project);
  return <div className="execution-panel">
    <div className="execution-kicker"><span>项目执行路径</span><strong>{project.keyword}</strong><ArrowRight size={15} /><span>文章生成</span><ArrowRight size={15} /><span>媒体发布</span><ArrowRight size={15} /><span>统计分析</span></div>
    <div className="execution-grid">
      <div className="trace-column keyword-column"><h3>关键词（{keywordItems.length}个）</h3><div className="keyword-list">{keywordItems.map((keyword) => <button className="keyword-list-item" key={keyword}><CheckCircle size={14} />{keyword}</button>)}</div></div>
      <div className="trace-column article-column"><h3>文章生成（{project.articles.length}/{project.articles.length}）</h3>{project.articles.map((article) => <div className="trace-article" key={article.title}><div><strong>{article.title}</strong><small>生成时间：{article.time}</small></div><StatusPill>{article.status}</StatusPill></div>)}</div>
      <div className="trace-column media-column"><h3>媒体发布（{project.media[0]}/{project.media[1] || 4}）</h3>{[...new Set(project.articles.flatMap((article) => article.media))].map((medium, index) => <div className="media-publish-row" key={medium}><span className="media-avatar">{medium.slice(0, 1)}</span><strong>{medium}</strong><StatusPill>{index < project.media[0] ? "已发布" : project.phase >= 3 ? "发布中" : "待发布"}</StatusPill><ArrowSquareOut size={15} /></div>)}</div>
      <div className="trace-column trace-stats"><h3>统计分析</h3><div><span>AI曝光量</span><strong>82,450</strong><small><TrendUp size={13} />12.5%</small></div><div><span>互动量</span><strong>3,250</strong><small><TrendUp size={13} />8.3%</small></div><div><span>引用量</span><strong>1,120</strong><small><TrendUp size={13} />15.6%</small></div><button className="ghost-button accent" onClick={() => onViewStats(project.id)}>查看统计</button></div>
    </div>
  </div>;
}

function getProjectKeywords(project) {
  const keyword = project.keyword;
  return [
    keyword,
    `${keyword}平台对比`,
    `${keyword}解决方案`,
    `${keyword}价格`,
    `${keyword}应用场景`,
    `${keyword}服务商`,
    `${keyword}功能评测`,
    `${keyword}选型指南`,
    `${keyword}部署方案`,
    `${keyword}成功案例`,
  ].slice(0, project.strategyCounts?.keywords || project.keywordCount);
}

function getProjectStageLabel(project) {
  return project.completed ? "已完成" : STAGES[project.phase];
}

function ProjectCardTimeline({ phase, completed }) {
  const stageLabel = completed ? "已完成" : STAGES[phase];
  return <div className="project-card-timeline" aria-label={completed ? `项目${STAGES.length}个环节已全部完成` : `项目当前位于第 ${phase + 1} 个环节：${stageLabel}`}>
    <div className="card-timeline-heading"><span>项目进展</span><strong>{stageLabel}</strong><small>{completed ? `${STAGES.length}/${STAGES.length} 环节已完成` : `第 ${phase + 1}/${STAGES.length} 环节`}</small></div>
    <div className="card-timeline-track">{STAGES.map((stage, index) => {
      const done = completed || index < phase;
      return <div className={cx("card-timeline-step", done && "done", index === phase && "current")} key={stage}><span>{done ? <Check size={10} weight="bold" /> : index + 1}</span><small>{stage}</small></div>;
    })}</div>
  </div>;
}

function ProjectCard({ project, onOpenDetail, onViewStats }) {
  const keywords = getProjectKeywords(project);
  const visibleKeywords = keywords.slice(0, 3);
  const openProject = () => onOpenDetail(project.id);
  return <article className="project-card">
    <button className="project-card-hit" aria-label={`查看项目：${project.name}`} onClick={openProject} />
    <header className="project-card-header">
      <div><h2>{project.name}</h2><p>订单号：{project.order}</p></div>
      <span className={cx("project-stage-badge", `stage-${project.phase}`)}><i />{getProjectStageLabel(project)}</span>
    </header>
    <section className="project-keyword-panel"><header><span><Target size={16} />关键词</span><strong>共 {project.keywordCount} 个</strong></header><div className="project-keyword-tags">{visibleKeywords.map((keyword) => <span title={keyword} key={keyword}>{keyword}</span>)}{keywords.length > visibleKeywords.length ? <span className="keyword-more">+{keywords.length - visibleKeywords.length}</span> : null}</div></section>
    <div className="project-card-counts">
      <div><span className="project-count-icon"><FileText size={17} /></span><span>已创建文章</span><strong>{project.content[0]}<small>篇</small></strong></div>
      <div><span className="project-count-icon"><PaperPlaneTilt size={17} /></span><span>投放媒体</span><strong>{project.media[0]}<small>家</small></strong></div>
    </div>
    <ProjectCardTimeline phase={project.phase} completed={project.completed} />
    <footer className="project-card-footer">{project.completed ? <button className="ghost-button project-stats-button" onClick={() => onViewStats(project.id)}><ChartLineUp size={15} />查看统计</button> : <span />}<button className="text-button project-open-button" onClick={openProject}>查看项目<ArrowRight size={14} /></button></footer>
  </article>;
}

function ProjectTableTimeline({ project }) {
  const stageLabel = getProjectStageLabel(project);
  return <div className="project-table-timeline" aria-label={project.completed ? `项目${STAGES.length}个环节已全部完成` : `项目当前位于第 ${project.phase + 1} 个环节：${stageLabel}`}>
    <div className="table-timeline-track">{STAGES.map((stage, index) => {
      const done = project.completed || index < project.phase;
      return <div className={cx("table-timeline-step", done && "done", !project.completed && index === project.phase && "current")} key={stage}><span>{done ? <Check size={9} weight="bold" /> : index + 1}</span><small>{stage}</small></div>;
    })}</div>
  </div>;
}

function ProjectList({ onOpenDetail, notify }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("全部阶段");
  const projects = useMemo(() => PROJECTS.filter((project) => `${project.name}${project.order}${project.keyword}`.toLowerCase().includes(query.toLowerCase()) && (stage === "全部阶段" || getProjectStageLabel(project) === stage)), [query, stage]);
  return <section className="page-section project-page">
    <div className="page-heading"><div><p className="eyebrow">GEO OPERATIONS</p><h1>GEO项目</h1><p>围绕订单关键词管理内容生成、媒体发布和最终效果。</p></div><div className="heading-actions">
      <label className="search-control"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目名称 / 订单号 / 关键词" /></label>
      <label className="select-control"><FunnelSimple size={16} /><select value={stage} onChange={(event) => setStage(event.target.value)}><option>全部阶段</option>{[...STAGES, "已完成"].map((item) => <option key={item}>{item}</option>)}</select></label>
      <button className="primary-button" onClick={() => notify("已创建一个空白 GEO 项目草稿")}><Plus size={17} />新建项目</button>
    </div></div>
    <div className="project-table-shell" aria-label="GEO项目列表">
      <table className="project-list-table">
        <thead><tr><th>项目 / 订单</th><th>关键词</th><th>文章</th><th>投放媒体</th><th>项目进展</th></tr></thead>
        <tbody>{projects.map((project) => {
          const keywords = getProjectKeywords(project);
          return <tr key={project.id}>
            <td><button className="project-table-name" onClick={() => onOpenDetail(project.id)}><span className="project-table-icon"><FolderSimple size={17} /></span><span><strong>{project.name}</strong><small>{project.order}</small></span></button></td>
            <td><div className="project-table-keywords"><div>{keywords.slice(0, 3).map((keyword) => <span title={keyword} key={keyword}>{keyword}</span>)}</div><small>共 {project.keywordCount} 个关键词</small></div></td>
            <td><div className="project-table-number"><strong>{project.content[0]}</strong><span>篇</span></div></td>
            <td><div className="project-table-number"><strong>{project.media[0]}</strong><span>家</span></div></td>
            <td><ProjectTableTimeline project={project} /></td>
          </tr>;
        })}</tbody>
      </table>
      {!projects.length ? <div className="project-table-empty">没有符合筛选条件的项目</div> : null}
    </div>
    <div className="table-footer"><span>共 12 个项目</span><div className="pagination"><button disabled>‹</button><button className="active">1</button><button>2</button><button>›</button></div></div>
  </section>;
}

function buildProjectRelations(project) {
  const mockNow = Date.now();
  const articleUpdateAgeHours = [3, 7, 28, 72, 160, 360, 720, 1080, 1500, 2200, 3500, 5200, 8000, 10000, 14000, 32, 120, 480, 1680, 2880, 6000, 9000, 12000, 18000, 36, 240, 960, 4320, 9600, 16000];
  const mediaUpdateAgeHours = [2, 5, 8, 16, 26, 32, 72, 120, 240, 480, 800, 1080, 1440, 1680, 2160, 2880, 4320, 9600, 12000, 16000];
  const keywordIntents = ["产品选型", "方案对比", "场景了解", "价格评估", "应用研究", "服务商筛选", "功能验证", "采购决策", "部署评估", "案例参考"];
  const keywordPlatformCounts = [6, 5, 4, 7, 3, 6, 5, 4, 7, 3];
  const keywords = getProjectKeywords(project)
    .map((label, index) => ({
      id: `k${index + 1}`,
      label,
      intent: keywordIntents[index] || "需求研究",
      aiSearch: Math.round(12800 * Math.pow(.84, index)),
      pcSearch: Math.round(8600 * Math.pow(.82, index)),
      platforms: Array.from({ length: keywordPlatformCounts[index % keywordPlatformCounts.length] }, (_, offset) => AI_PLATFORM_OPTIONS[(index + offset) % AI_PLATFORM_OPTIONS.length]),
      updatedAt: Date.UTC(2026, 7, 13, 10) - index * 5 * 60 * 60 * 1000,
      type: "keyword",
    }));
  if (!project.completed && project.phase < STAGES.indexOf("创作")) {
    return { keywords, articles: [], media: [], edges: [] };
  }
  const articleFallbacks = [
    `${project.keyword}核心功能解析与应用场景`,
    `如何选择适合企业的${project.keyword}？7个关键指标`,
    `企业落地${project.keyword}的完整实施指南`,
    `2026年${project.keyword}选型与成本分析`,
    `${project.keyword}与传统客服系统有什么区别`,
    `${project.keyword}提升服务效率的五种方式`,
    `中小企业如何低成本部署${project.keyword}`,
    `${project.keyword}知识库建设最佳实践`,
    `${project.keyword}常见问题与避坑指南`,
    `${project.keyword}数据安全与隐私保护详解`,
    `${project.keyword}如何对接企业微信与公众号`,
    `${project.keyword}在电商售后场景中的应用`,
    `${project.keyword}在金融服务中的落地案例`,
    `${project.keyword}在教育咨询场景中的实践`,
    `${project.keyword}多轮对话能力评测报告`,
    `${project.keyword}意图识别准确率如何提升`,
    `${project.keyword}坐席协同功能深度解析`,
    `${project.keyword}从试用到上线的完整流程`,
    `${project.keyword}采购前必须确认的十个问题`,
    `${project.keyword}项目实施周期与人员配置`,
    `${project.keyword}运营指标体系搭建方法`,
    `${project.keyword}如何降低人工客服压力`,
    `${project.keyword}客户满意度提升案例`,
    `${project.keyword}高峰期流量承载能力分析`,
    `${project.keyword}私有化部署与SaaS方案对比`,
    `${project.keyword}API接入与系统集成指南`,
    `${project.keyword}效果评估与复盘模板`,
    `${project.keyword}行业发展趋势与技术展望`,
    `${project.keyword}服务商能力评估清单`,
    `${project.keyword}上线后持续优化的方法`,
  ];
  const articleCount = project.strategyCounts?.articles || Math.max(4, project.articles.length);
  const articleSeeds = articleFallbacks.slice(0, articleCount).map((title, index) => {
    const time = project.articles[index]?.time || `2026-08-${String(Math.max(1, 30 - index)).padStart(2, "0")} ${String(9 + (index % 9)).padStart(2, "0")}:${index % 2 ? "45" : "20"}`;
    return {
      id: `a${index + 1}`,
      title: project.articles[index]?.title || title,
      time,
      updatedAt: mockNow - articleUpdateAgeHours[index % articleUpdateAgeHours.length] * 60 * 60 * 1000,
      status: project.articles[index]?.status || (index < Math.ceil(articleCount * .72) ? "已完成" : "生成中"),
      contentType: CONTENT_TYPE_OPTIONS[index % CONTENT_TYPE_OPTIONS.length],
      type: "article",
    };
  });
  const mediaCatalog = [
    ["官网", "自有阵地", "/media-logos/official-site.png"], ["微信公众号", "自有阵地", "/media-logos/wechat.svg"], ["百家号", "综合资讯", "/media-logos/baijiahao.png"], ["今日头条", "综合资讯", "/media-logos/toutiao.png"],
    ["搜狐号", "新闻媒体", "/media-logos/sohu.png"], ["网易号", "新闻媒体", "/media-logos/netease.png"], ["知乎", "知识社区", "/media-logos/zhihu.svg"], ["小红书", "生活社区", "/media-logos/xiaohongshu.svg"],
    ["哔哩哔哩", "视频平台", "/media-logos/bilibili.svg"], ["抖音", "视频平台", "/media-logos/douyin.png"], ["快手", "视频平台", "/media-logos/kuaishou.svg"], ["腾讯新闻", "新闻媒体", "/media-logos/tencent-news.jpg"],
    ["新浪新闻", "新闻媒体", "/media-logos/sina-news.jpg"], ["36氪", "科技媒体", "/media-logos/36kr.png"], ["虎嗅", "科技媒体", "/media-logos/huxiu.png"], ["钛媒体", "科技媒体", "/media-logos/tmtpost.png"],
    ["澎湃新闻", "新闻媒体", "/media-logos/thepaper.jpg"], ["界面新闻", "新闻媒体", "/media-logos/jiemian.jpg"], ["CSDN", "技术社区", "/media-logos/csdn.svg"], ["InfoQ", "技术社区", "/media-logos/infoq.svg"],
  ];
  const mediaCount = project.strategyCounts?.media || 5;
  const mediaBlueprints = mediaCatalog.slice(0, mediaCount).map(([name, category, logo], index) => ({
    id: `m${index + 1}`,
    name,
    category,
    logo,
    updatedAt: mockNow - mediaUpdateAgeHours[index % mediaUpdateAgeHours.length] * 60 * 60 * 1000,
    keywordIds: Array.from({ length: Math.min(3, keywords.length) }, (_, offset) => `k${((index * 2 + offset * 3) % keywords.length) + 1}`),
    articleIds: Array.from({ length: Math.min(3, articleSeeds.length) }, (_, offset) => `a${((index + offset * 10) % articleSeeds.length) + 1}`),
  }));
  const media = mediaBlueprints.map((medium, index) => {
    const pendingContentCount = ["百家号", "网易号", "小红书"].includes(medium.name) ? 1 : index < project.media[0] ? 0 : 1;
    return {
      ...medium,
      keywordIds: medium.keywordIds.filter((id) => keywords.some((item) => item.id === id)),
      articleIds: medium.articleIds.filter((id) => articleSeeds.some((item) => item.id === id)),
      pendingContentCount,
      published: pendingContentCount === 0,
      type: "media",
    };
  });
  const articles = articleSeeds.map((article) => {
    const linkedMedia = media.filter((medium) => medium.articleIds.includes(article.id));
    return {
      ...article,
      mediaIds: linkedMedia.map((medium) => medium.id),
      keywordIds: [...new Set(linkedMedia.flatMap((medium) => medium.keywordIds))],
    };
  });
  const edges = [
    ...media.flatMap((medium) => medium.keywordIds.map((keywordId) => ({ id: `${keywordId}-${medium.id}`, from: keywordId, to: medium.id }))),
    ...media.flatMap((medium) => medium.articleIds.map((articleId) => ({ id: `${medium.id}-${articleId}`, from: medium.id, to: articleId }))),
  ];
  return { keywords, articles, media, edges };
}

const STRATEGY_DATA_METRICS = {
  keyword: {
    k1: { mentionRate: 42.6, mentionDelta: 3.8, rank: 3.2, rankDelta: .7, mentionTrend: [31, 33, 32, 36, 37, 39, 38, 41, 40, 43], rankTrend: [4.6, 4.4, 4.5, 4.1, 3.9, 3.8, 3.7, 3.5, 3.4, 3.2] },
    k2: { mentionRate: 36.8, mentionDelta: 1.4, rank: 4.1, rankDelta: .3, mentionTrend: [31, 32, 34, 33, 35, 34, 36, 37, 36, 37], rankTrend: [4.8, 4.7, 4.6, 4.7, 4.5, 4.4, 4.3, 4.2, 4.3, 4.1] },
    k3: { mentionRate: 29.5, mentionDelta: -2.2, rank: 5.6, rankDelta: -.5, mentionTrend: [36, 35, 34, 33, 34, 32, 31, 30, 31, 29], rankTrend: [4.7, 4.8, 4.9, 5.1, 5, 5.2, 5.3, 5.5, 5.4, 5.6] },
    k4: { mentionRate: 24.2, mentionDelta: .2, rank: 6.3, rankDelta: .1, mentionTrend: [23, 24, 23, 25, 24, 24, 25, 24, 24, 24], rankTrend: [6.5, 6.4, 6.5, 6.3, 6.4, 6.3, 6.2, 6.3, 6.4, 6.3] },
    k5: { mentionRate: 18.7, mentionDelta: 2.6, rank: 7.2, rankDelta: .8, mentionTrend: [11, 12, 13, 14, 13, 15, 16, 17, 18, 19], rankTrend: [8.6, 8.4, 8.3, 8.1, 8, 7.8, 7.7, 7.5, 7.4, 7.2] },
  },
  media: {
    m1: { citationRate: 58.4, rateDelta: 5.1, citationCount: 126, countDelta: 18, rateTrend: [44, 47, 46, 49, 51, 53, 54, 55, 57, 58], countTrend: [7, 9, 8, 11, 10, 13, 12, 15, 16, 18] },
    m2: { citationRate: 36.8, rateDelta: 1.4, citationCount: 74, countDelta: 6, rateTrend: [32, 33, 34, 33, 35, 35, 34, 36, 37, 37], countTrend: [5, 6, 7, 5, 8, 7, 6, 9, 10, 11] },
    m3: { citationRate: 29.5, rateDelta: -2.2, citationCount: 51, countDelta: -9, rateTrend: [37, 35, 34, 33, 34, 32, 31, 30, 31, 29], countTrend: [9, 8, 7, 8, 6, 7, 5, 5, 4, 4] },
    m4: { citationRate: 22.7, rateDelta: 0, citationCount: 38, countDelta: 1, rateTrend: [22, 23, 22, 23, 23, 22, 23, 22, 23, 23], countTrend: [3, 4, 3, 5, 4, 3, 4, 4, 4, 4] },
    m5: { citationRate: 18.3, rateDelta: .9, citationCount: 27, countDelta: 3, rateTrend: [14, 15, 14, 16, 16, 17, 16, 18, 18, 18], countTrend: [2, 3, 2, 3, 4, 3, 4, 4, 5, 5] },
  },
  article: {
    a1: { citationRate: 31.8, rateDelta: 4.2, citationCount: 68, countDelta: 11, lifecycle: 43, ongoing: true, rateTrend: [21, 23, 24, 25, 27, 26, 29, 30, 31, 32], countTrend: [3, 5, 4, 6, 7, 8, 7, 9, 10, 11], lifecycleTrend: [8, 12, 16, 20, 24, 29, 33, 37, 40, 43] },
    a2: { citationRate: 24.6, rateDelta: 1.8, citationCount: 52, countDelta: 7, lifecycle: 29, ongoing: true, rateTrend: [19, 20, 19, 21, 22, 23, 22, 24, 24, 25], countTrend: [3, 4, 5, 4, 6, 5, 7, 7, 8, 8], lifecycleTrend: [5, 8, 11, 14, 17, 20, 23, 25, 27, 29] },
    a3: { citationRate: 18.9, rateDelta: -1.6, citationCount: 36, countDelta: -4, lifecycle: 21, ongoing: false, inactiveDays: 12, rateTrend: [25, 24, 23, 22, 22, 21, 20, 20, 19, 19], countTrend: [7, 6, 6, 5, 5, 4, 4, 3, 3, 2], lifecycleTrend: [5, 8, 11, 14, 17, 19, 21, 21, 21, 21] },
    a4: { citationRate: 12.4, rateDelta: .6, citationCount: 19, countDelta: 2, lifecycle: 12, ongoing: false, inactiveDays: 5, rateTrend: [9, 10, 9, 11, 10, 11, 12, 11, 12, 12], countTrend: [1, 2, 1, 2, 2, 2, 3, 2, 3, 3], lifecycleTrend: [2, 4, 6, 7, 9, 10, 11, 12, 12, 12] },
  },
};

function roundMetric(value) {
  return Math.round(value * 10) / 10;
}

function buildMockTrend(finalValue, movement, floor = 0) {
  const values = Array.from({ length: 10 }, (_, index) => {
    const distance = 9 - index;
    const texture = ((index % 3) - 1) * Math.max(.18, Math.abs(movement) * .12);
    return roundMetric(Math.max(floor, finalValue - movement * distance / 3 + texture));
  });
  values[values.length - 1] = finalValue;
  return values;
}

function createMockStrategyMetric(type, id) {
  const index = Math.max(1, Number.parseInt(id.slice(1), 10) || 1);
  if (type === "keyword") {
    const mentionRate = roundMetric(Math.max(8.6, 39.5 - index * 2.15 + (index % 3) * 1.3));
    const mentionDelta = roundMetric(((index % 5) - 2) * .8 + .4);
    const rank = roundMetric(2.6 + index * .58 + (index % 2) * .25);
    const rankDelta = roundMetric(((index % 4) - 1.5) * .3);
    return {
      mentionRate, mentionDelta, rank, rankDelta,
      mentionTrend: buildMockTrend(mentionRate, mentionDelta || .15, 0),
      rankTrend: buildMockTrend(rank, -rankDelta || -.12, 1),
    };
  }
  if (type === "media") {
    const citationRate = roundMetric(Math.max(6.4, 39 - index * 1.45 + (index % 4) * 1.1));
    const rateDelta = roundMetric(((index % 6) - 2.5) * .62);
    const citationCount = Math.max(9, Math.round(105 - index * 4.1 + (index % 3) * 5));
    const countDelta = Math.round(((index % 7) - 3) * 2.2);
    return {
      citationRate, rateDelta, citationCount, countDelta,
      rateTrend: buildMockTrend(citationRate, rateDelta || .18, 0),
      countTrend: buildMockTrend(citationCount, countDelta || .4, 0),
    };
  }
  const citationRate = roundMetric(Math.max(4.8, 31 - index * .55 + (index % 5) * .72));
  const rateDelta = roundMetric(((index % 7) - 3) * .48);
  const citationCount = Math.max(8, Math.round(74 - index * 1.8 + (index % 4) * 4));
  const countDelta = Math.round(((index % 8) - 3.5) * 1.5);
  const lifecycle = 12 + ((index * 7) % 52);
  const ongoing = index % 4 !== 0;
  const lifecycleTrend = buildMockTrend(lifecycle, ongoing ? 3.2 : .25, 1);
  if (!ongoing) lifecycleTrend.splice(-3, 3, lifecycle, lifecycle, lifecycle);
  return {
    citationRate, rateDelta, citationCount, countDelta, lifecycle, ongoing,
    inactiveDays: ongoing ? 0 : 3 + (index % 11),
    rateTrend: buildMockTrend(citationRate, rateDelta || .16, 0),
    countTrend: buildMockTrend(citationCount, countDelta || .35, 0),
    lifecycleTrend,
  };
}

function getRangeDays(range, customRange) {
  if (range !== "custom") {
    const presetDays = Number(range);
    return Number.isFinite(presetDays) && presetDays > 0 ? presetDays : 30;
  }
  const start = new Date(`${customRange.start}T00:00:00`);
  const end = new Date(`${customRange.end}T00:00:00`);
  const days = Math.floor((end - start) / 86400000) + 1;
  return Number.isFinite(days) && days > 0 ? Math.min(days, 365) : 30;
}

function getPeriodMetric(type, id, days) {
  const source = STRATEGY_DATA_METRICS[type]?.[id] || createMockStrategyMetric(type, id);
  const durationScale = Math.max(.35, Math.min(3, days / 30));
  const averageShift = Math.max(-1, Math.min(1, (days - 30) / 60));
  if (type === "keyword") return {
    ...source,
    mentionRate: Math.max(0, source.mentionRate - source.mentionDelta * averageShift * .28),
    mentionDelta: source.mentionDelta / Math.sqrt(durationScale),
    rank: Math.max(1, source.rank + source.rankDelta * averageShift * .2),
    rankDelta: source.rankDelta / Math.sqrt(durationScale),
  };
  return {
    ...source,
    citationRate: Math.max(0, source.citationRate - source.rateDelta * averageShift * .24),
    rateDelta: source.rateDelta / Math.sqrt(durationScale),
    citationCount: Math.max(0, Math.round(source.citationCount * durationScale)),
    countDelta: Math.round(source.countDelta * Math.sqrt(durationScale)),
  };
}

function MiniTrend({ values, direction = "up", invert = false, currentLabel }) {
  const width = 88;
  const height = 26;
  const displayValues = invert ? values.map((value) => -value) : values;
  const min = Math.min(...displayValues);
  const max = Math.max(...displayValues);
  const span = max - min || 1;
  const coordinates = displayValues.map((value, index) => ({
    x: (index / (displayValues.length - 1)) * width,
    y: height - 3 - ((value - min) / span) * (height - 7),
  }));
  const lastPoint = coordinates[coordinates.length - 1];
  const pointTop = 7 + (lastPoint.y / height) * 14;
  const labelTop = Math.max(0, Math.min(14, pointTop > 10 ? pointTop - 8 : pointTop + 3));
  const points = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  return <span className={cx("mini-trend-wrap", `trend-${direction}`)} style={{ "--trend-point-top": `${pointTop}px`, "--trend-label-top": `${labelTop}px` }} aria-hidden="true">
    <svg className={cx("mini-trend", `trend-${direction}`)} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"><polyline points={points} /></svg>
    <span className="mini-trend-point" />
    <span className="mini-trend-current">{currentLabel}</span>
  </span>;
}

function MetricTrend({ label, value, trend, direction, values, invert = false }) {
  const TrendIcon = direction === "up" ? TrendUp : direction === "down" ? TrendDown : Minus;
  return <div className="data-metric">
    <span className="data-metric-label">{label}</span>
    <strong>{value}</strong>
    <span className={cx("metric-trend-label", `trend-${direction}`)}><TrendIcon size={12} weight="bold" />{trend}</span>
    <MiniTrend values={values} direction={direction} invert={invert} currentLabel={value} />
  </div>;
}

function metricDirection(value) {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

const DATA_SORT_OPTIONS = {
  keyword: [
    { key: "mentionRate", label: "提及率", Icon: At },
    { key: "rank", label: "平均排名", Icon: ListNumbers },
  ],
  media: [
    { key: "citationRate", label: "引用率", Icon: Percent },
    { key: "citationCount", label: "引用次数", Icon: Quotes },
  ],
  article: [
    { key: "citationRate", label: "引用率", Icon: Percent },
    { key: "citationCount", label: "引用次数", Icon: Quotes },
    { key: "lifecycle", label: "生命周期", Icon: ClockCountdown },
  ],
};

function DataSortControls({ type, sort, onChange }) {
  return <div className="data-column-sort" role="group" aria-label={`${type === "keyword" ? "关键词" : type === "media" ? "媒体信源" : "文章视频"}排序`}>
    {DATA_SORT_OPTIONS[type].map(({ key, label, Icon }) => {
      const active = sort.key === key;
      const DirectionIcon = sort.direction === "asc" ? ArrowUp : ArrowDown;
      const directionLabel = sort.direction === "asc" ? "升序" : "降序";
      return <button className={cx("data-sort-button", active && "active")} type="button" aria-pressed={active} aria-label={`${label}${active ? `，当前${directionLabel}，点击切换为${sort.direction === "asc" ? "降序" : "升序"}` : "，点击排序"}`} title={`${label}${active ? ` · ${directionLabel}` : ""}`} onClick={() => onChange(key)} key={key}>
        <Icon size={14} weight={active ? "bold" : "regular"} />
        {active ? <><span>{label}</span><DirectionIcon className="data-sort-direction" size={12} weight="bold" /></> : null}
      </button>;
    })}
  </div>;
}

function StrategyTimeSort({ type, direction, onChange }) {
  const DirectionIcon = direction === "asc" ? ArrowUp : ArrowDown;
  const directionLabel = direction === "asc" ? "正序" : "倒序";
  return <button className="data-sort-button active strategy-time-sort" type="button" aria-label={`${type === "keyword" ? "关键词" : type === "media" ? "媒体信源" : "文章视频"}按更新时间${directionLabel}，点击切换为${direction === "asc" ? "倒序" : "正序"}`} title={`更新时间 · ${directionLabel}`} onClick={onChange}>
    <ClockCountdown size={14} weight="bold" /><span>更新时间</span><DirectionIcon className="data-sort-direction" size={12} weight="bold" />
  </button>;
}

function CanvasMultiFilter({ label, options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!filterRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return <div className={cx("strategy-filter", open && "open", selected.size && "filtered")} ref={filterRef}>
    <button className="data-sort-button strategy-filter-trigger" type="button" aria-label={`${label}筛选${selected.size ? `，已选择${selected.size}项` : "，当前显示全部"}`} aria-expanded={open} title={`${label}筛选`} onClick={() => setOpen((current) => !current)}>
      <FunnelSimple size={14} weight={selected.size ? "fill" : "regular"} />
      {selected.size ? <span className="strategy-filter-count">{selected.size}</span> : null}
    </button>
    {open ? <div className="strategy-filter-menu" role="group" aria-label={`${label}多选筛选`}>
      <div className="strategy-filter-menu-head"><strong>{label}</strong><span>可多选</span></div>
      <button className={cx("strategy-filter-option", !selected.size && "selected")} type="button" onClick={onClear}><span className="strategy-filter-check">{!selected.size ? <Check size={11} weight="bold" /> : null}</span><span>全部</span></button>
      {options.map((option) => <button className={cx("strategy-filter-option", selected.has(option.id) && "selected")} type="button" role="checkbox" aria-checked={selected.has(option.id)} onClick={() => onToggle(option.id)} key={option.id}><span className="strategy-filter-check">{selected.has(option.id) ? <Check size={11} weight="bold" /> : null}</span><span>{option.label}</span></button>)}
    </div> : null}
  </div>;
}

function formatFullUpdatedAt(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "更新时间未知";
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatRelativeUpdatedAt(timestamp, now = Date.now()) {
  const elapsed = Math.max(0, now - timestamp);
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(elapsed / 3600000);
  const days = Math.floor(elapsed / 86400000);
  if (minutes < 1) return "刚刚更新";
  if (hours < 1) return `${minutes}分钟前更新`;
  if (hours < 24) return `${hours}小时前更新`;
  if (days < 2) return "1天前更新";
  if (days < 60) return `${days}天前更新`;
  if (days < 365) return `${Math.floor(days / 30)}个月前更新`;
  return `${(days / 365).toFixed(1)}年前更新`;
}

function StrategyRelativeTime({ timestamp }) {
  const fullTime = formatFullUpdatedAt(timestamp);
  return <time dateTime={new Date(timestamp).toISOString()} title={`最后更新：${fullTime}`}>{formatRelativeUpdatedAt(timestamp)}</time>;
}

function KeywordPlatformSummary({ platforms, mediaCount }) {
  const platformNames = platforms.map((platform) => platform.name).join("、");
  return <small className="keyword-platform-summary" aria-label={`已选择 ${platforms.length} 个平台：${platformNames}；${mediaCount} 家发布媒体`} title={`${platformNames} · ${mediaCount} 家发布媒体`}>
    <span className="keyword-platform-icons" aria-hidden="true">
      {platforms.slice(0, 4).map((platform) => <span className={`keyword-platform-icon ${platform.id}`} title={platform.name} key={platform.id}>{platform.mark}</span>)}
    </span>
    <span className="keyword-platform-count">共{platforms.length}个平台</span>
    <span className="keyword-publish-count">{mediaCount}家发布媒体</span>
  </small>;
}

function sortRelationIdsByUpdatedAt(ids, items, direction = "desc") {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const factor = direction === "asc" ? 1 : -1;
  return [...ids].sort((firstId, secondId) => {
    const firstTime = itemsById.get(firstId)?.updatedAt || 0;
    const secondTime = itemsById.get(secondId)?.updatedAt || 0;
    if (firstTime === secondTime) return firstId.localeCompare(secondId);
    return (firstTime - secondTime) * factor;
  });
}

function createStrategyOrder(relationData) {
  return {
    keyword: sortRelationIdsByUpdatedAt(relationData.keywords.map((item) => item.id), relationData.keywords, "desc"),
    media: sortRelationIdsByUpdatedAt(relationData.media.map((item) => item.id), relationData.media, "desc"),
    article: sortRelationIdsByUpdatedAt(relationData.articles.map((item) => item.id), relationData.articles, "desc"),
  };
}

function getKeywordContext(relationData, activeKeywordId) {
  const media = relationData.media.filter((medium) => medium.keywordIds.includes(activeKeywordId));
  const mediaIds = new Set(media.map((medium) => medium.id));
  const articleIds = new Set(media.flatMap((medium) => medium.articleIds));
  const articles = relationData.articles.filter((article) => articleIds.has(article.id));
  const edges = relationData.edges.filter((edge) =>
    (edge.from === activeKeywordId && mediaIds.has(edge.to)) ||
    (mediaIds.has(edge.from) && articleIds.has(edge.to)),
  );
  return { media, mediaIds, articles, articleIds, edges };
}

function buildActiveNetwork(activeNode, relationData, activeKeywordId) {
  const context = getKeywordContext(relationData, activeKeywordId);
  const nodeIds = new Set([activeKeywordId]);
  if (activeNode.type === "keyword") {
    context.media.forEach((medium) => { nodeIds.add(medium.id); medium.articleIds.forEach((id) => nodeIds.add(id)); });
  } else if (activeNode.type === "article" && context.articleIds.has(activeNode.id)) {
    nodeIds.add(activeNode.id);
    context.media.filter((medium) => medium.articleIds.includes(activeNode.id)).forEach((medium) => nodeIds.add(medium.id));
  } else if (activeNode.type === "media" && context.mediaIds.has(activeNode.id)) {
    const medium = context.media.find((item) => item.id === activeNode.id);
    nodeIds.add(activeNode.id);
    medium?.articleIds.forEach((id) => nodeIds.add(id));
  }
  const edgeIds = new Set(context.edges.filter((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to)).map((edge) => edge.id));
  return { nodeIds, edgeIds };
}

const CREATE_MEDIA_NODE_ID = "create-media-source";
const CREATE_ARTICLE_NODE_ID = "create-article-content";
const RELATION_REORDER_DURATION = 440;

function RelationMap({ project, viewMode, timeRange, customRange, onAddContent, onAddMedia, onInspect }) {
  const relationData = useMemo(() => buildProjectRelations(project), [project]);
  const rangeDays = getRangeDays(timeRange, customRange);
  const [activeKeywordId, setActiveKeywordId] = useState("k1");
  const [activeNode, setActiveNode] = useState({ type: "keyword", id: "k1" });
  const [dataSort, setDataSort] = useState({
    keyword: { key: "mentionRate", direction: "desc" },
    media: { key: "citationRate", direction: "desc" },
    article: { key: "citationRate", direction: "desc" },
  });
  const [strategySort, setStrategySort] = useState({ keyword: "desc", media: "desc", article: "desc" });
  const [canvasFilters, setCanvasFilters] = useState({ keyword: new Set(), media: new Set(), article: new Set() });
  const [isReordering, setIsReordering] = useState(false);
  const [strategyOrder, setStrategyOrder] = useState(() => createStrategyOrder(relationData));
  const [dataOrder, setDataOrder] = useState(() => ({
    keyword: relationData.keywords.map((item) => item.id),
    media: relationData.media.map((item) => item.id),
    article: relationData.articles.map((item) => item.id),
  }));
  const [paths, setPaths] = useState([]);
  const canvasRef = useRef(null);
  const linesRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const previousNodeRectsRef = useRef(null);
  const reorderTimerRef = useRef(null);
  const reorderFrameRef = useRef(null);
  const previousViewModeRef = useRef(viewMode);

  const keywordContext = useMemo(() => getKeywordContext(relationData, activeKeywordId), [activeKeywordId, relationData]);
  const activeNetwork = useMemo(() => buildActiveNetwork(activeNode, relationData, activeKeywordId), [activeKeywordId, activeNode, relationData]);
  const canvasFilterOptions = useMemo(() => ({
    keyword: AI_PLATFORM_OPTIONS.map((platform) => ({ id: platform.id, label: platform.name })),
    media: [...new Set(relationData.media.map((medium) => medium.category))].map((category) => ({ id: category, label: category })),
    article: CONTENT_TYPE_OPTIONS.map((contentType) => ({ id: contentType, label: contentType })),
  }), [relationData.media]);
  const creationEdges = useMemo(() => {
    if (activeNode.type === "keyword") return [{ id: `${activeNode.id}-${CREATE_MEDIA_NODE_ID}`, from: activeNode.id, to: CREATE_MEDIA_NODE_ID, creation: true }];
    if (activeNode.type === "media") return [{ id: `${activeNode.id}-${CREATE_ARTICLE_NODE_ID}`, from: activeNode.id, to: CREATE_ARTICLE_NODE_ID, creation: true }];
    return [{ id: `${CREATE_MEDIA_NODE_ID}-${activeNode.id}`, from: CREATE_MEDIA_NODE_ID, to: activeNode.id, creation: true }];
  }, [activeNode]);
  const strategyData = useMemo(() => {
    const applyOrder = (type, items) => {
      const itemsById = new Map(items.map((item) => [item.id, item]));
      return strategyOrder[type].map((id) => itemsById.get(id)).filter(Boolean);
    };
    return {
      keyword: applyOrder("keyword", relationData.keywords).filter((keyword) => !canvasFilters.keyword.size || keyword.platforms.some((platform) => canvasFilters.keyword.has(platform.id))),
      media: applyOrder("media", keywordContext.media).filter((medium) => !canvasFilters.media.size || canvasFilters.media.has(medium.category)),
      article: applyOrder("article", keywordContext.articles).filter((article) => !canvasFilters.article.size || canvasFilters.article.has(article.contentType)),
    };
  }, [canvasFilters, keywordContext, relationData.keywords, strategyOrder]);

  useEffect(() => {
    setStrategySort({ keyword: "desc", media: "desc", article: "desc" });
    setCanvasFilters({ keyword: new Set(), media: new Set(), article: new Set() });
    setStrategyOrder(createStrategyOrder(relationData));
    setDataOrder({
      keyword: relationData.keywords.map((item) => item.id),
      media: relationData.media.map((item) => item.id),
      article: relationData.articles.map((item) => item.id),
    });
  }, [relationData]);

  const updatePaths = useCallback(() => {
    const canvas = canvasRef.current;
    const lines = linesRef.current;
    if (!canvas || !lines) return;
    const linesRect = lines.getBoundingClientRect();
    const nextPaths = [...keywordContext.edges, ...creationEdges].flatMap((edge) => {
      const from = nodeRefs.current.get(edge.from);
      const to = nodeRefs.current.get(edge.to);
      if (!from || !to) return [];
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const [startRect, endRect] = fromRect.left <= toRect.left ? [fromRect, toRect] : [toRect, fromRect];
      const x1 = startRect.right - linesRect.left;
      const y1 = startRect.top + startRect.height / 2 - linesRect.top;
      const x2 = endRect.left - linesRect.left;
      const y2 = endRect.top + endRect.height / 2 - linesRect.top;
      const bend = Math.max(28, (x2 - x1) * .45);
      return [{ ...edge, x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}` }];
    });
    setPaths(nextPaths);
  }, [creationEdges, keywordContext.edges]);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(updatePaths);
    const observer = new ResizeObserver(updatePaths);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); };
  }, [updatePaths, viewMode, rangeDays, dataSort, canvasFilters]);

  useEffect(() => {
    if (!strategyData.keyword.some((keyword) => keyword.id === activeKeywordId)) {
      const nextKeyword = strategyData.keyword[0];
      if (nextKeyword) {
        setActiveKeywordId(nextKeyword.id);
        setActiveNode({ type: "keyword", id: nextKeyword.id });
      }
      return;
    }
    if (activeNode.type === "media" && !strategyData.media.some((medium) => medium.id === activeNode.id)) setActiveNode({ type: "keyword", id: activeKeywordId });
    if (activeNode.type === "article" && !strategyData.article.some((article) => article.id === activeNode.id)) setActiveNode({ type: "keyword", id: activeKeywordId });
  }, [activeKeywordId, activeNode, strategyData]);

  useLayoutEffect(() => {
    const previousRects = previousNodeRectsRef.current;
    if (!previousRects) return undefined;
    previousNodeRectsRef.current = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.cancelAnimationFrame(reorderFrameRef.current);
    if (!reduceMotion) {
      nodeRefs.current.forEach((element, id) => {
        const previousRect = previousRects.get(id);
        if (!previousRect) return;
        const nextRect = element.getBoundingClientRect();
        const deltaY = previousRect.top - nextRect.top;
        if (Math.abs(deltaY) < 1) return;
        element.animate(
          [
            { transform: `translateY(${deltaY}px)`, zIndex: 3 },
            { transform: "translateY(0)", zIndex: 3 },
          ],
          { duration: RELATION_REORDER_DURATION, easing: "cubic-bezier(.22,.78,.24,1)" },
        );
      });
      const startedAt = performance.now();
      const syncLinesWithCards = (now) => {
        updatePaths();
        if (now - startedAt <= RELATION_REORDER_DURATION + 32) {
          reorderFrameRef.current = window.requestAnimationFrame(syncLinesWithCards);
        }
      };
      reorderFrameRef.current = window.requestAnimationFrame(syncLinesWithCards);
    } else {
      updatePaths();
    }
    window.clearTimeout(reorderTimerRef.current);
    reorderTimerRef.current = window.setTimeout(() => {
      setIsReordering(false);
      updatePaths();
    }, reduceMotion ? 0 : RELATION_REORDER_DURATION);
    return undefined;
  }, [activeNode, dataSort, strategySort, updatePaths, viewMode]);

  useEffect(() => () => {
    window.clearTimeout(reorderTimerRef.current);
    window.cancelAnimationFrame(reorderFrameRef.current);
  }, []);

  const bindNode = (id) => (element) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };
  const nodeClass = (type, id) => {
    const isActive = type === "keyword" ? activeKeywordId === id : activeNode.type === type && activeNode.id === id;
    return cx("relation-card", isActive && "active", !isActive && activeNetwork.nodeIds.has(id) && "related", !activeNetwork.nodeIds.has(id) && "dimmed");
  };
  const selectionLabel = activeNode.type === "keyword" ? relationData.keywords.find((item) => item.id === activeNode.id)?.label : activeNode.type === "article" ? relationData.articles.find((item) => item.id === activeNode.id)?.title : relationData.media.find((item) => item.id === activeNode.id)?.name;

  const formatDecimal = (value) => value.toFixed(1);
  const trendCopy = (value, unit) => value === 0 ? "持平" : `${formatDecimal(Math.abs(value))}${unit}`;
  const countTrendCopy = (value) => value === 0 ? "持平" : `${Math.abs(value)}次`;
  const orderRelatedByMetric = useCallback((type, ids, network, sort) => {
    const direction = sort.direction === "asc" ? 1 : -1;
    const related = ids.filter((id) => network.nodeIds.has(id));
    const unrelated = ids.filter((id) => !network.nodeIds.has(id));
    related.sort((firstId, secondId) => {
      const firstValue = getPeriodMetric(type, firstId, rangeDays)[sort.key] ?? 0;
      const secondValue = getPeriodMetric(type, secondId, rangeDays)[sort.key] ?? 0;
      if (firstValue === secondValue) return firstId.localeCompare(secondId);
      return (firstValue - secondValue) * direction;
    });
    return [...related, ...unrelated];
  }, [rangeDays]);
  const selectNode = (type, id) => {
    if (viewMode === "strategy" && ((type === "keyword" && activeKeywordId === id) || (type !== "keyword" && activeNode.type === type && activeNode.id === id))) return;
    previousNodeRectsRef.current = new Map(
      [...nodeRefs.current.entries()].map(([nodeId, element]) => [nodeId, element.getBoundingClientRect()]),
    );
    const nextKeywordId = type === "keyword" ? id : activeKeywordId;
    const nextNetwork = buildActiveNetwork({ type, id }, relationData, nextKeywordId);
    if (viewMode === "strategy") {
      setStrategyOrder((current) => Object.fromEntries(
        Object.entries(current).map(([columnType, ids]) => {
          if (columnType === "keyword" || columnType === type) return [columnType, ids];
          const related = ids.filter((nodeId) => nextNetwork.nodeIds.has(nodeId));
          const unrelated = ids.filter((nodeId) => !nextNetwork.nodeIds.has(nodeId));
          return [columnType, [...related, ...unrelated]];
        }),
      ));
    } else {
      setDataOrder((current) => Object.fromEntries(
        Object.entries(current).map(([columnType, ids]) => [
          columnType,
          columnType === "keyword" || columnType === type ? ids : orderRelatedByMetric(columnType, ids, nextNetwork, dataSort[columnType]),
        ]),
      ));
    }
    setIsReordering(true);
    if (type === "keyword") setActiveKeywordId(id);
    setActiveNode({ type, id });
  };
  const changeStrategySort = (type) => {
    const nextDirection = strategySort[type] === "desc" ? "asc" : "desc";
    const items = type === "keyword" ? relationData.keywords : type === "media" ? relationData.media : relationData.articles;
    previousNodeRectsRef.current = new Map(
      [...nodeRefs.current.entries()].map(([nodeId, element]) => [nodeId, element.getBoundingClientRect()]),
    );
    setIsReordering(true);
    setStrategySort((current) => ({ ...current, [type]: nextDirection }));
    setStrategyOrder((current) => ({
      ...current,
      [type]: sortRelationIdsByUpdatedAt(current[type], items, nextDirection),
    }));
  };
  const toggleCanvasFilter = (type, value) => {
    setCanvasFilters((current) => {
      const nextValues = new Set(current[type]);
      if (nextValues.has(value)) nextValues.delete(value);
      else nextValues.add(value);
      return { ...current, [type]: nextValues };
    });
  };
  const clearCanvasFilter = (type) => setCanvasFilters((current) => ({ ...current, [type]: new Set() }));
  const changeDataSort = (type, key) => {
    const nextSort = dataSort[type].key === key
      ? { key, direction: dataSort[type].direction === "desc" ? "asc" : "desc" }
      : { key, direction: "desc" };
    previousNodeRectsRef.current = new Map(
      [...nodeRefs.current.entries()].map(([nodeId, element]) => [nodeId, element.getBoundingClientRect()]),
    );
    setIsReordering(true);
    setDataSort((current) => ({
      ...current,
      [type]: nextSort,
    }));
    setDataOrder((current) => ({
      ...current,
      [type]: orderRelatedByMetric(type, current[type], activeNetwork, nextSort),
    }));
  };
  const sortedData = useMemo(() => {
    const applyOrder = (type, items) => {
      const itemsById = new Map(items.map((item) => [item.id, item]));
      return dataOrder[type].map((id) => itemsById.get(id)).filter(Boolean);
    };
    return {
      keyword: applyOrder("keyword", relationData.keywords).filter((keyword) => !canvasFilters.keyword.size || keyword.platforms.some((platform) => canvasFilters.keyword.has(platform.id))),
      media: applyOrder("media", keywordContext.media).filter((medium) => !canvasFilters.media.size || canvasFilters.media.has(medium.category)),
      article: applyOrder("article", keywordContext.articles).filter((article) => !canvasFilters.article.size || canvasFilters.article.has(article.contentType)),
    };
  }, [canvasFilters, dataOrder, keywordContext, relationData.keywords]);

  useLayoutEffect(() => {
    if (previousViewModeRef.current === viewMode) return;
    previousViewModeRef.current = viewMode;
    if (viewMode === "strategy") {
      setStrategyOrder((current) => Object.fromEntries(
        Object.entries(current).map(([columnType, ids]) => {
          if (columnType === "keyword" || columnType === activeNode.type) return [columnType, ids];
          const related = ids.filter((id) => activeNetwork.nodeIds.has(id));
          const unrelated = ids.filter((id) => !activeNetwork.nodeIds.has(id));
          return [columnType, [...related, ...unrelated]];
        }),
      ));
      return;
    }
    setDataOrder((current) => Object.fromEntries(
      Object.entries(current).map(([columnType, ids]) => [
        columnType,
        columnType === "keyword" || columnType === activeNode.type ? ids : orderRelatedByMetric(columnType, ids, activeNetwork, dataSort[columnType]),
      ]),
    ));
  }, [activeNetwork, activeNode.type, dataSort, orderRelatedByMetric, viewMode]);

  return <div className={cx("relation-canvas", viewMode === "data" && "data-view-canvas", isReordering && "reordering")} ref={canvasRef}>
    <svg ref={linesRef} className={cx("relation-lines", viewMode === "data" ? "relation-lines-data" : "relation-lines-strategy")} aria-hidden="true">
      <defs>{paths.flatMap((path) => [
        <clipPath id={`endpoint-start-${path.id}`} clipPathUnits="userSpaceOnUse" key={`start-${path.id}`}><rect x={path.x1} y={path.y1 - 5} width="5" height="10" /></clipPath>,
        <clipPath id={`endpoint-end-${path.id}`} clipPathUnits="userSpaceOnUse" key={`end-${path.id}`}><rect x={path.x2 - 5} y={path.y2 - 5} width="5" height="10" /></clipPath>,
      ])}</defs><g>{paths.map((path) => {
      const pathState = path.creation || activeNetwork.edgeIds.has(path.id) ? "active" : "muted";
      return <g className={cx("relation-edge", pathState, path.creation && "creation-edge")} key={path.id}>
        <path className={cx("relation-line", pathState)} d={path.d} />
        <circle className={cx("relation-endpoint", pathState)} cx={path.x1} cy={path.y1} r="3.2" clipPath={`url(#endpoint-start-${path.id})`} />
        <circle className={cx("relation-endpoint", pathState)} cx={path.x2} cy={path.y2} r="3.2" clipPath={`url(#endpoint-end-${path.id})`} />
      </g>;
    })}</g></svg>
    {viewMode === "strategy" ? <div className="relation-columns canvas-view-panel canvas-view-strategy" key="strategy-view">
      <section className="relation-column keyword-relation-column"><div className="relation-column-title"><span><Target size={17} />关键词</span><small>{relationData.keywords.length} 个</small><CanvasMultiFilter label="AI 平台" options={canvasFilterOptions.keyword} selected={canvasFilters.keyword} onToggle={(value) => toggleCanvasFilter("keyword", value)} onClear={() => clearCanvasFilter("keyword")} /><StrategyTimeSort type="keyword" direction={strategySort.keyword} onChange={() => changeStrategySort("keyword")} /></div><div className="relation-card-list">{strategyData.keyword.map((keyword) => <div ref={bindNode(keyword.id)} className={cx(nodeClass("keyword", keyword.id), "split-card")} role="group" key={keyword.id}><button className="relation-card-main" aria-pressed={activeKeywordId === keyword.id} onClick={() => selectNode("keyword", keyword.id)}><span className="relation-card-icon"><Target size={16} /></span><span><strong>{keyword.label}</strong><KeywordPlatformSummary platforms={canvasFilters.keyword.size ? keyword.platforms.filter((platform) => canvasFilters.keyword.has(platform.id)) : keyword.platforms} mediaCount={relationData.media.filter((medium) => medium.keywordIds.includes(keyword.id)).length} /></span></button><button className="relation-card-inspect" aria-label={`查看关键词详情：${keyword.label}`} title="查看详情" onClick={() => onInspect("keyword", keyword)}><Eye size={17} /></button></div>)}</div></section>
      <section className="relation-column media-relation-column"><div className="relation-column-title"><span><GlobeHemisphereWest size={17} />媒体信源</span><small>{relationData.media.length} 家</small><CanvasMultiFilter label="媒体类型" options={canvasFilterOptions.media} selected={canvasFilters.media} onToggle={(value) => toggleCanvasFilter("media", value)} onClear={() => clearCanvasFilter("media")} /><StrategyTimeSort type="media" direction={strategySort.media} onChange={() => changeStrategySort("media")} /></div><div className="relation-card-list"><button ref={bindNode(CREATE_MEDIA_NODE_ID)} className={cx("relation-card", "relation-create-card", (activeNode.type === "keyword" || activeNode.type === "article") && "linked")} onClick={onAddMedia}><span className="relation-create-icon"><Plus size={16} weight="bold" /></span><strong>新建媒体信源</strong></button>{keywordContext.media.length ? strategyData.media.map((medium) => <button ref={bindNode(medium.id)} className={cx(nodeClass("media", medium.id), "strategy-media-card")} aria-pressed={activeNode.type === "media" && activeNode.id === medium.id} onClick={() => selectNode("media", medium.id)} key={medium.id}><span className="media-source-logo" aria-hidden="true"><img src={medium.logo} alt="" /></span><span><span className="strategy-card-title-row"><strong>{medium.name}</strong>{medium.pendingContentCount ? <span className="strategy-state-badge pending">{medium.pendingContentCount}条内容待发布</span> : null}</span><small className="strategy-card-meta-line"><span>{medium.category}</span><span>{medium.articleIds.length} 条内容</span><StrategyRelativeTime timestamp={medium.updatedAt} /></small></span></button>) : <div className="relation-card relation-empty-card media-empty-card" aria-disabled="true"><span className="relation-card-icon"><GlobeHemisphereWest size={16} /></span><span><strong>该关键词暂无媒体信源</strong><small>可通过上方入口新建媒体</small></span></div>}</div></section>
      <section className="relation-column article-relation-column"><div className="relation-column-title"><span><FileText size={17} />文章/视频</span><small>{relationData.articles.length} 条</small><CanvasMultiFilter label="内容类型" options={canvasFilterOptions.article} selected={canvasFilters.article} onToggle={(value) => toggleCanvasFilter("article", value)} onClear={() => clearCanvasFilter("article")} /><StrategyTimeSort type="article" direction={strategySort.article} onChange={() => changeStrategySort("article")} /></div><div className="relation-card-list"><button ref={bindNode(CREATE_ARTICLE_NODE_ID)} className={cx("relation-card", "relation-create-card", activeNode.type === "media" && "linked")} onClick={onAddContent}><span className="relation-create-icon"><Plus size={16} weight="bold" /></span><strong>新建文章/视频</strong></button>{keywordContext.articles.length ? strategyData.article.map((article) => <div ref={bindNode(article.id)} className={cx(nodeClass("article", article.id), "split-card")} role="group" key={article.id}><button className="relation-card-main" aria-pressed={activeNode.type === "article" && activeNode.id === article.id} onClick={() => selectNode("article", article.id)}><span className="relation-card-icon"><FileText size={16} /></span><span className="relation-card-copy"><span className="strategy-card-title-row"><strong>{article.title}</strong>{article.status === "生成中" ? <span className="strategy-state-badge generating">生成中</span> : null}</span><small className="strategy-card-meta-line"><span>{article.contentType}</span><span>{keywordContext.media.filter((medium) => medium.articleIds.includes(article.id)).length} 家媒体</span><StrategyRelativeTime timestamp={article.updatedAt} /></small></span></button><button className="relation-card-inspect" aria-label={`查看文章内容：${article.title}`} title="查看内容" onClick={() => onInspect("article", article)}><Eye size={17} /></button></div>) : null}</div></section>
    </div> : <div className="relation-columns data-relation-columns canvas-view-panel canvas-view-data" key="data-view">
      <section className="relation-column keyword-relation-column"><div className="relation-column-title data-column-title"><div className="data-column-heading"><span><Target size={17} />关键词</span><small>{relationData.keywords.length} 个</small></div><CanvasMultiFilter label="AI 平台" options={canvasFilterOptions.keyword} selected={canvasFilters.keyword} onToggle={(value) => toggleCanvasFilter("keyword", value)} onClear={() => clearCanvasFilter("keyword")} /><DataSortControls type="keyword" sort={dataSort.keyword} onChange={(key) => changeDataSort("keyword", key)} /></div><div className="relation-card-list">{sortedData.keyword.map((keyword) => {
        const metrics = getPeriodMetric("keyword", keyword.id, rangeDays);
        return <button ref={bindNode(keyword.id)} className={cx(nodeClass("keyword", keyword.id), "data-relation-card")} aria-pressed={activeKeywordId === keyword.id} onClick={() => selectNode("keyword", keyword.id)} key={keyword.id}>
          <span className="data-card-heading"><span className="relation-card-icon"><Target size={16} /></span><strong>{keyword.label}</strong></span>
          <div className="data-metric-grid"><MetricTrend label="提及率" value={`${formatDecimal(metrics.mentionRate)}%`} trend={trendCopy(metrics.mentionDelta, "pp")} direction={metricDirection(metrics.mentionDelta)} values={metrics.mentionTrend} /><MetricTrend label="平均排名" value={formatDecimal(metrics.rank)} trend={trendCopy(metrics.rankDelta, "位")} direction={metricDirection(metrics.rankDelta)} values={metrics.rankTrend} invert /></div>
        </button>;
      })}</div></section>
      <section className="relation-column media-relation-column"><div className="relation-column-title data-column-title"><div className="data-column-heading"><span><GlobeHemisphereWest size={17} />媒体信源</span><small>{relationData.media.length} 家</small></div><CanvasMultiFilter label="媒体类型" options={canvasFilterOptions.media} selected={canvasFilters.media} onToggle={(value) => toggleCanvasFilter("media", value)} onClear={() => clearCanvasFilter("media")} /><DataSortControls type="media" sort={dataSort.media} onChange={(key) => changeDataSort("media", key)} /></div><div className="relation-card-list"><button ref={bindNode(CREATE_MEDIA_NODE_ID)} className={cx("relation-card", "relation-create-card", (activeNode.type === "keyword" || activeNode.type === "article") && "linked")} onClick={onAddMedia}><span className="relation-create-icon"><Plus size={16} weight="bold" /></span><strong>新建媒体信源</strong></button>{keywordContext.media.length ? sortedData.media.map((medium) => {
        const metrics = getPeriodMetric("media", medium.id, rangeDays);
        return <button ref={bindNode(medium.id)} className={cx(nodeClass("media", medium.id), "data-relation-card")} aria-pressed={activeNode.type === "media" && activeNode.id === medium.id} onClick={() => selectNode("media", medium.id)} key={medium.id}>
          <span className="data-card-heading"><span className="media-source-logo" aria-hidden="true"><img src={medium.logo} alt="" /></span><strong>{medium.name}</strong></span>
          <div className="data-metric-grid"><MetricTrend label="引用率" value={`${formatDecimal(metrics.citationRate)}%`} trend={trendCopy(metrics.rateDelta, "pp")} direction={metricDirection(metrics.rateDelta)} values={metrics.rateTrend} /><MetricTrend label="引用次数" value={metrics.citationCount} trend={countTrendCopy(metrics.countDelta)} direction={metricDirection(metrics.countDelta)} values={metrics.countTrend} /></div>
        </button>;
      }) : <div className="relation-card relation-empty-card media-empty-card" aria-disabled="true"><span className="relation-card-icon"><GlobeHemisphereWest size={16} /></span><span><strong>暂无媒体数据</strong><small>开始发布后生成趋势</small></span></div>}</div></section>
      <section className="relation-column article-relation-column"><div className="relation-column-title data-column-title"><div className="data-column-heading"><span><FileText size={17} />文章/视频</span><small>{relationData.articles.length} 条</small></div><CanvasMultiFilter label="内容类型" options={canvasFilterOptions.article} selected={canvasFilters.article} onToggle={(value) => toggleCanvasFilter("article", value)} onClear={() => clearCanvasFilter("article")} /><DataSortControls type="article" sort={dataSort.article} onChange={(key) => changeDataSort("article", key)} /></div><div className="relation-card-list"><button ref={bindNode(CREATE_ARTICLE_NODE_ID)} className={cx("relation-card", "relation-create-card", activeNode.type === "media" && "linked")} onClick={onAddContent}><span className="relation-create-icon"><Plus size={16} weight="bold" /></span><strong>新建文章/视频</strong></button>{keywordContext.articles.length ? sortedData.article.map((article) => {
        const metrics = getPeriodMetric("article", article.id, rangeDays);
        return <button ref={bindNode(article.id)} className={cx(nodeClass("article", article.id), "data-relation-card", "content-data-card")} aria-pressed={activeNode.type === "article" && activeNode.id === article.id} onClick={() => selectNode("article", article.id)} key={article.id}>
          <span className="data-card-heading"><span className="relation-card-icon"><FileText size={16} /></span><strong>{article.title}</strong></span>
          <div className="data-metric-grid three-metrics"><MetricTrend label="引用率" value={`${formatDecimal(metrics.citationRate)}%`} trend={trendCopy(metrics.rateDelta, "pp")} direction={metricDirection(metrics.rateDelta)} values={metrics.rateTrend} /><MetricTrend label="引用次数" value={metrics.citationCount} trend={countTrendCopy(metrics.countDelta)} direction={metricDirection(metrics.countDelta)} values={metrics.countTrend} /><MetricTrend label="生命周期" value={`${metrics.lifecycle}天`} trend={metrics.ongoing ? "持续中" : `停滞${metrics.inactiveDays}天`} direction={metrics.ongoing ? "up" : "flat"} values={metrics.lifecycleTrend} /></div>
        </button>;
      }) : <button className="relation-card relation-empty-card article-empty-card" onClick={onAddContent}><span className="relation-card-icon"><Plus size={16} /></span><span><strong>暂无内容数据</strong><small>生成并发布内容后展示</small></span></button>}</div></section>
    </div>}
    <div className="relation-selection"><span>当前选中</span><strong>{selectionLabel}</strong><small>{viewMode === "data" ? `数据周期：${rangeDays} 天 · 点击卡片查看完整数据链路` : "关系路径：关键词 → 发布媒体 → 文章/视频"}</small></div>
  </div>;
}

function StrategyDrawer({ type, project, onClose, notify }) {
  const [name, setName] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(new Set());
  const submit = (event) => {
    event.preventDefault();
    if (type !== "媒体" && !name.trim()) return;
    notify(`${type}已添加到策略画布`);
    onClose();
  };
  const toggleMedia = (id) => setSelectedMedia((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return <div className="strategy-drawer-backdrop" onMouseDown={onClose}>
    <aside className="strategy-drawer" aria-label={`添加${type}`} onMouseDown={(event) => event.stopPropagation()}>
      <header className="strategy-drawer-header"><div><span>策略画布</span><h2>添加{type}</h2><p>{project.name}</p></div><button className="icon-button" onClick={onClose} aria-label="关闭添加面板"><X size={20} /></button></header>
      <form className="strategy-drawer-form" onSubmit={submit}>
        {type === "关键词" ? <>
          <label><span>关键词名称</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="输入需要覆盖的 GEO 关键词" autoFocus /></label>
          <label><span>搜索意图</span><select defaultValue="方案对比"><option>品牌认知</option><option>方案对比</option><option>产品选型</option><option>购买决策</option></select></label>
          <label><span>关键词优先级</span><div className="strategy-option-row"><button type="button">高优先级</button><button type="button" className="active">普通</button><button type="button">观察</button></div></label>
          <div className="drawer-guidance"><Sparkle size={18} /><div><strong>小智建议</strong><p>优先补充能够体现用户决策问题的长尾关键词，便于后续生成更容易被 AI 引用的内容。</p></div></div>
        </> : null}
        {type === "文章" ? <>
          <label><span>文章标题</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="输入文章标题或选题方向" autoFocus /></label>
          <label><span>关联关键词</span><select defaultValue={project.keyword}><option>{project.keyword}</option><option>{project.keyword}推荐</option><option>{project.keyword}哪家好</option></select></label>
          <label><span>内容目标</span><textarea rows="5" placeholder="说明文章需要回答的用户问题、核心结论和期望引用场景" /></label>
          <div className="drawer-guidance"><Sparkle size={18} /><div><strong>生成建议</strong><p>文章会自动继承项目知识和所选关键词，并在生成后加入中间文章列。</p></div></div>
        </> : null}
        {type === "媒体" ? <>
          <label><span>选择媒体信源</span><input placeholder="搜索媒体名称或分类" /></label>
          <div className="drawer-media-grid">{MEDIA.slice(0, 8).map((medium) => <button type="button" className={cx(selectedMedia.has(medium.id) && "selected")} onClick={() => toggleMedia(medium.id)} key={medium.id}><span>{medium.name.slice(0, 1)}</span><div><strong>{medium.name}</strong><small>{medium.category}</small></div>{selectedMedia.has(medium.id) ? <Check size={15} weight="bold" /> : null}</button>)}</div>
          <div className="drawer-guidance"><Sparkle size={18} /><div><strong>已选择 {selectedMedia.size} 家媒体</strong><p>添加后可继续为具体文章建立多对多发布关系。</p></div></div>
        </> : null}
        <footer><button type="button" className="ghost-button" onClick={onClose}>取消</button><button type="submit" className="primary-button" disabled={type === "媒体" ? selectedMedia.size === 0 : !name.trim()}><Plus size={16} />确认添加</button></footer>
      </form>
    </aside>
  </div>;
}

function StrategyItemDrawer({ kind, item, project, onClose, notify }) {
  const isKeyword = kind === "keyword";
  return <div className="strategy-drawer-backdrop" onMouseDown={onClose}>
    <aside className="strategy-drawer strategy-item-drawer" aria-label={isKeyword ? `查看关键词：${item.label}` : `查看内容：${item.title}`} onMouseDown={(event) => event.stopPropagation()}>
      <header className="strategy-drawer-header"><div><span>{isKeyword ? "KEYWORD INSIGHT" : "CONTENT PREVIEW"}</span><h2>{isKeyword ? "关键词详情" : "文章完整内容"}</h2><p>{project.name}</p></div><button className="icon-button" onClick={onClose} aria-label="关闭详情"><X size={20} /></button></header>
      {isKeyword ? <div className="strategy-item-body keyword-insight-body">
        <div className="keyword-insight-hero"><span>关键词</span><h3>{item.label}</h3><p>所属意图：<strong>{item.intent}</strong></p></div>
        <div className="keyword-volume-grid"><div><span>AI 搜索量预估</span><strong>{item.aiSearch.toLocaleString()}</strong><small>次 / 月</small></div><div><span>PC 搜索量预估</span><strong>{item.pcSearch.toLocaleString()}</strong><small>次 / 月</small></div></div>
        <section className="strategy-item-section"><h4>意图判断</h4><p>用户正在进行“{item.intent}”相关的信息搜集，内容需要优先回答核心判断标准、选择差异和决策风险。</p></section>
        <section className="strategy-item-section"><h4>内容建议</h4><ul><li>在标题和首段明确回答用户的核心问题。</li><li>补充可验证的数据、案例和产品能力证据。</li><li>关联同一词包内的长尾问题，形成完整语义覆盖。</li></ul></section>
      </div> : <div className="strategy-item-body article-full-preview">
        <div className="article-preview-heading"><span>文章</span><h3>{item.title}</h3><div><span>{item.keywordIds.length} 个关联关键词</span><span>{item.mediaIds.length} 家预期媒体</span></div></div>
        <article><p>在生成式搜索成为用户获取信息的重要入口之后，企业内容不仅要满足真实用户的阅读需求，还需要具备清晰、可信、易于被模型理解和引用的信息结构。</p><h4>一、从真实决策问题出发</h4><p>围绕用户在了解、对比和选择过程中的关键问题组织内容，先给出明确结论，再补充判断依据、应用场景和可验证证据，减少模糊表达。</p><h4>二、建立完整的信息证据链</h4><p>内容应引用企业知识库中的产品资料、服务案例和权威来源，并解释数据口径与适用范围，让用户和 AI 都能判断信息的可靠程度。</p><h4>三、形成适合多信源发布的内容结构</h4><p>在保持核心观点一致的前提下，根据不同媒体的受众和内容偏好调整标题、摘要与案例，使文章能够覆盖更多搜索意图并获得稳定引用。</p><blockquote>建议结论：优先保证内容真实、结构清楚和证据充分，再根据目标媒体完成差异化发布。</blockquote></article>
      </div>}
      <footer className="stage-artifact-footer"><button className="ghost-button" onClick={onClose}>关闭</button><button className="primary-button" onClick={() => notify(isKeyword ? "已打开关键词编辑" : "已打开文章编辑器")}><PencilLine size={16} />{isKeyword ? "编辑关键词" : "编辑内容"}</button></footer>
    </aside>
  </div>;
}

function StageArtifactDrawer({ kind, stageIndex, project, onClose, onConfirm, notify }) {
  const detail = STAGE_DETAILS[stageIndex];
  const isPlan = kind === "plan";
  const planItems = [
    `明确“${STAGES[stageIndex]}”阶段目标与验收标准`,
    "校验本阶段输入资料、负责人与计划排期",
    `执行并沉淀《${detail.output}》`,
  ];
  return <div className="strategy-drawer-backdrop stage-artifact-backdrop" onMouseDown={onClose}>
    <aside className="strategy-drawer stage-artifact-drawer" aria-label={isPlan ? `查看${STAGES[stageIndex]}计划` : `查看${STAGES[stageIndex]}报告`} onMouseDown={(event) => event.stopPropagation()}>
      <header className="strategy-drawer-header"><div><span>{isPlan ? "STAGE PLAN" : "STAGE REPORT"}</span><h2>{isPlan ? "阶段执行计划" : "阶段产出报告"}</h2><p>{project.name} · {STAGES[stageIndex]}</p></div><button className="icon-button" onClick={onClose} aria-label="关闭"><X size={20} /></button></header>
      <div className="stage-artifact-body">
        <div className="stage-artifact-summary"><span>{isPlan ? "本阶段目标" : "执行结论"}</span><h3>{detail.title}</h3><p>{isPlan ? detail.description : `本阶段已按客户确认计划执行完成，已形成《${detail.output}》。`}</p></div>
        <section className="stage-artifact-section"><div className="stage-artifact-section-title"><FileText size={18} /><strong>{isPlan ? "执行步骤" : "产出清单"}</strong></div><div className="stage-artifact-list">{planItems.map((item, index) => <div key={item}><span>{isPlan ? index + 1 : <Check size={13} weight="bold" />}</span><p>{item}</p>{!isPlan ? <small>已验证</small> : null}</div>)}</div></section>
        <div className="stage-artifact-meta"><div><span>计划负责人</span><strong>GEO 运营团队</strong></div><div><span>{isPlan ? "预计周期" : "完成时间"}</span><strong>{isPlan ? "2–3 个工作日" : "2026-08-16 14:30"}</strong></div><div><span>客户确认人</span><strong>{isPlan ? onConfirm ? "待确认" : "已确认" : "张景"}</strong></div></div>
      </div>
      <footer className="stage-artifact-footer"><button className="ghost-button" onClick={onClose}>{isPlan && onConfirm ? "暂不确认" : "关闭"}</button>{isPlan && onConfirm ? <button className="primary-button" onClick={onConfirm}><CheckCircle size={16} />客户确认并开始执行</button> : null}{!isPlan ? <button className="primary-button" onClick={() => notify(`《${detail.output}》已生成导出任务`)}><ArrowSquareOut size={16} />导出报告</button> : null}</footer>
    </aside>
  </div>;
}

function formatCountdown(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function ProjectStageFloor({ project, initialPhase, notify }) {
  const [stageStatuses, setStageStatuses] = useState(() => STAGES.map((_, index) => {
    if (project.completed || index < initialPhase) return "complete";
    if (index === initialPhase) return "review";
    return "locked";
  }));
  const [artifact, setArtifact] = useState(null);
  const [autoConfirmSeconds, setAutoConfirmSeconds] = useState(48 * 60 * 60);
  const confirmStage = (stageIndex) => {
    setStageStatuses((current) => current.map((status, index) => index === stageIndex ? "executing" : status));
    setArtifact(null);
    notify(`客户已确认“${STAGES[stageIndex]}”计划，现在开始执行`);
  };
  const reviewIndex = stageStatuses.indexOf("review");
  useEffect(() => {
    if (reviewIndex < 0) return undefined;
    const timer = window.setInterval(() => {
      setAutoConfirmSeconds((current) => {
        if (current <= 1) {
          setStageStatuses((statuses) => statuses.map((status, index) => index === reviewIndex ? "executing" : status));
          setArtifact(null);
          notify(`“${STAGES[reviewIndex]}”计划已到期自动确认，现在开始执行`);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [reviewIndex]);

  return <section className="project-stage-floor compact-stage-flow" aria-label="项目六阶段流程">
    <div className="compact-stage-grid">{STAGES.map((stage, index) => {
      const status = stageStatuses[index];
      return <article className={cx("compact-stage-card", status)} key={stage}>
        <header><span className="compact-stage-index">{status === "complete" ? <Check size={14} weight="bold" /> : index + 1}</span><div><strong>{stage}</strong><small>{STAGE_STATUS_LABELS[status]}</small></div>{index < STAGES.length - 1 ? <CaretRight className="compact-stage-arrow" size={22} weight="bold" /> : null}</header>
        <div className="compact-stage-actions">
          {status !== "locked" ? <button className="ghost-button" onClick={() => setArtifact({ kind: "plan", stageIndex: index })}><Eye size={15} />{status === "review" ? "查看并确认计划" : "查看计划"}</button> : null}
          {status === "complete" ? <button className="primary-button" onClick={() => setArtifact({ kind: "report", stageIndex: index })}><FileText size={15} />查看报告</button> : null}
          {status === "review" ? <span className="stage-auto-confirm"><strong>{formatCountdown(autoConfirmSeconds)}</strong> 后自动确认</span> : null}
          {status === "locked" ? <span className="stage-waiting-note">等待上一阶段报告</span> : null}
        </div>
      </article>;
    })}</div>
    {artifact ? <StageArtifactDrawer kind={artifact.kind} stageIndex={artifact.stageIndex} project={project} onClose={() => setArtifact(null)} onConfirm={artifact.kind === "plan" && stageStatuses[artifact.stageIndex] === "review" ? () => confirmStage(artifact.stageIndex) : null} notify={notify} /> : null}
  </section>;
}

function ProjectDetail({ projectId, onBack, onViewStats, notify }) {
  const project = PROJECTS.find((item) => item.id === projectId) || PROJECTS[0];
  const [canvasView, setCanvasView] = useState("strategy");
  const [timeRange, setTimeRange] = useState("30");
  const [customRange, setCustomRange] = useState({ start: "2026-08-08", end: "2026-09-06" });
  const [drawerType, setDrawerType] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const openDrawer = (type) => setDrawerType(type);
  const switchCanvasView = (nextView) => setCanvasView(nextView);
  return <section className="page-section detail-page">
    <div className="detail-titlebar"><div><button className="back-link" onClick={onBack}><ArrowLeft size={16} />返回项目列表</button><div className="title-line"><h1>{project.name}</h1><StatusPill>{getProjectStageLabel(project)}</StatusPill></div><p>订单号：{project.order} · 创建时间：2026-08-08</p></div><div className="heading-actions"><button className="primary-button" onClick={() => onViewStats(project.id)}><ChartBar size={17} />查看统计</button></div></div>
    <ProjectStageFloor key={project.id} project={project} initialPhase={project.phase} notify={notify} />
    <div className="section-title relation-section-title"><div className="strategy-canvas-title-group"><h2>策略画布</h2><div className="canvas-view-switch" role="group" aria-label="策略画布视图"><button className={cx(canvasView === "strategy" && "active")} aria-pressed={canvasView === "strategy"} onClick={() => switchCanvasView("strategy")}>策略视图</button><button className={cx(canvasView === "data" && "active")} aria-pressed={canvasView === "data"} onClick={() => switchCanvasView("data")}>数据视图</button></div></div>
      {canvasView === "data" ? <div className="strategy-canvas-toolbar"><div className="canvas-time-range"><label><CalendarBlank size={16} /><span className="sr-only">时间范围</span><select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} aria-label="选择数据时间范围"><option value="7">近 7 天</option><option value="30">近 30 天</option><option value="90">近 90 天</option><option value="custom">自定义</option></select><CaretDown size={13} /></label>{timeRange === "custom" ? <div className="custom-date-range"><input type="date" value={customRange.start} max={customRange.end} onInput={(event) => { const value = event.currentTarget.value; setCustomRange((current) => ({ ...current, start: value })); }} aria-label="开始日期" /><span>至</span><input type="date" value={customRange.end} min={customRange.start} onInput={(event) => { const value = event.currentTarget.value; setCustomRange((current) => ({ ...current, end: value })); }} aria-label="结束日期" /></div> : null}</div></div> : null}
    </div>
    <RelationMap project={project} viewMode={canvasView} timeRange={timeRange} customRange={customRange} onAddContent={() => openDrawer("文章")} onAddMedia={() => openDrawer("媒体")} onInspect={(kind, item) => setPreviewItem({ kind, item })} />
    {drawerType ? <StrategyDrawer type={drawerType} project={project} onClose={() => setDrawerType(null)} notify={notify} /> : null}
    {previewItem ? <StrategyItemDrawer kind={previewItem.kind} item={previewItem.item} project={project} onClose={() => setPreviewItem(null)} notify={notify} /> : null}
  </section>;
}

function KeywordPackages({ projectId, notify }) {
  const [packages, setPackages] = useState(INITIAL_WORD_PACKAGES);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("全部状态");
  const [editor, setEditor] = useState(null);
  const scopeProject = PROJECTS.find((item) => item.id === projectId);
  const scopedPackages = useMemo(() => scopeProject ? packages.filter((item) => item.project === scopeProject.name) : packages, [packages, scopeProject]);
  const filtered = useMemo(() => scopedPackages.filter((item) => `${item.name}${item.project}${item.seed}`.toLowerCase().includes(query.toLowerCase()) && (status === "全部状态" || item.status === status)), [scopedPackages, query, status]);
  const keywordTotal = scopedPackages.reduce((sum, item) => sum + item.keywordCount, 0);
  const pendingTotal = scopedPackages.filter((item) => item.status === "待确认").length;
  const openCreate = () => setEditor({ id: null, name: "", project: scopeProject?.name || PROJECTS[0].name, seed: "" });
  const savePackage = (event) => {
    event.preventDefault();
    if (!editor.name.trim() || !editor.seed.trim()) return;
    if (editor.id) {
      setPackages((current) => current.map((item) => item.id === editor.id ? { ...item, name: editor.name.trim(), project: editor.project, seed: editor.seed.trim() } : item));
      notify("词包信息已更新");
    } else {
      const created = { ...editor, id: `WP-${Date.now().toString().slice(-8)}`, name: editor.name.trim(), seed: editor.seed.trim(), keywordCount: 1, status: "生成中", created: "2026-08-16" };
      setPackages((current) => [created, ...current]);
      notify("词包已创建，正在生成扩展关键词");
    }
    setEditor(null);
  };
  const confirmPackage = (id) => {
    setPackages((current) => current.map((item) => item.id === id ? { ...item, status: "已确认" } : item));
    notify("词包已确认，可用于项目选词");
  };

  return <section className="page-section keyword-pack-page">
    <div className="page-heading"><div><p className="eyebrow">KEYWORD LIBRARY</p><h1>选词</h1><p>{scopeProject ? `仅管理“${scopeProject.name}”项目下的关键词词包。` : "按词包沉淀关键词策略，统一创建、确认和管理项目关键词。"}</p></div><div className="heading-actions"><button className="primary-button" onClick={openCreate}><Plus size={17} />新建词包</button></div></div>
    {scopeProject ? <div className="management-scope-bar"><FolderSimple size={16} /><span>当前项目</span><strong>{scopeProject.name}</strong><small>仅展示项目相关数据</small></div> : null}
    <div className="keyword-pack-summary" aria-label="词包概览">
      <div><span className="pack-summary-icon"><SelectionAll size={19} /></span><span>词包总数</span><strong>{packages.length}<small>个</small></strong></div>
      <div><span className="pack-summary-icon"><Target size={19} /></span><span>关键词总数</span><strong>{keywordTotal}<small>个</small></strong></div>
      <div><span className="pack-summary-icon"><ClockCountdown size={19} /></span><span>待客户确认</span><strong>{pendingTotal}<small>个</small></strong></div>
    </div>
    <div className="keyword-pack-toolbar"><div><h2>全部关键词词包</h2><p>一个词包可以关联一个 GEO 项目，并持续补充和维护关键词。</p></div><div className="heading-actions"><label className="search-control"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索词包 / 项目 / 种子词" /></label><label className="select-control"><FunnelSimple size={16} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>全部状态</option><option>生成中</option><option>待确认</option><option>已确认</option></select></label></div></div>
    <div className="keyword-pack-table-shell">
      <table className="keyword-pack-table">
        <thead><tr><th>词包名称</th><th>关联项目</th><th>种子词</th><th>关键词数</th><th>状态</th><th>创建日期</th><th>操作</th></tr></thead>
        <tbody>{filtered.map((item) => <tr key={item.id}>
          <td><div className="word-pack-name"><span><SelectionAll size={16} /></span><div><strong>{item.name}</strong><small>{item.id}</small></div></div></td>
          <td><span className="pack-project-name">{item.project}</span></td>
          <td><span className="seed-keyword">{item.seed}</span></td>
          <td><strong className="pack-keyword-count">{item.keywordCount}<small> 个</small></strong></td>
          <td><StatusPill>{item.status}</StatusPill></td>
          <td><span className="pack-created-date">{item.created}</span></td>
          <td><div className="keyword-pack-actions"><button className="text-button" onClick={() => notify(`${item.name}当前包含 ${item.keywordCount} 个关键词`)}>查看关键词</button>{item.status === "待确认" ? <button className="ghost-button" onClick={() => confirmPackage(item.id)}>确认</button> : null}<button className="icon-button" aria-label={`编辑${item.name}`} onClick={() => setEditor({ ...item })}><PencilLine size={15} /></button></div></td>
        </tr>)}</tbody>
      </table>
      {!filtered.length ? <div className="project-table-empty">没有符合筛选条件的词包</div> : null}
    </div>
    <div className="table-footer"><span>共 {scopedPackages.length} 个词包</span><div className="pagination"><button disabled>‹</button><button className="active">1</button><button disabled>›</button></div></div>
    {editor ? <div className="modal-backdrop" onMouseDown={() => setEditor(null)}><form className="modal keyword-pack-modal" onSubmit={savePackage} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">KEYWORD PACKAGE</p><h2>{editor.id ? "编辑词包" : "新建词包"}</h2><p>从一个种子词开始生成并管理项目关键词。</p></div><button type="button" className="icon-button" aria-label="关闭" onClick={() => setEditor(null)}><X size={19} /></button></div><label className="field-label">词包名称<input value={editor.name} onChange={(event) => setEditor((current) => ({ ...current, name: event.target.value }))} placeholder="例如：智能客服系统核心词包" autoFocus /></label><label className="field-label">关联项目<select value={editor.project} onChange={(event) => setEditor((current) => ({ ...current, project: event.target.value }))}>{(scopeProject ? [scopeProject] : PROJECTS).map((project) => <option key={project.id}>{project.name}</option>)}</select></label><label className="field-label">种子词<input value={editor.seed} onChange={(event) => setEditor((current) => ({ ...current, seed: event.target.value }))} placeholder="输入一个核心业务词" /></label><div className="keyword-pack-guidance"><Sparkle size={17} weight="fill" /><p>创建后，小智会基于业务场景、用户问题和搜索意图扩展候选关键词。</p></div><div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setEditor(null)}>取消</button><button type="submit" className="primary-button" disabled={!editor.name.trim() || !editor.seed.trim()}>{editor.id ? "保存修改" : "创建并生成"}</button></div></form></div> : null}
  </section>;
}

function ContentDrawer({ item, type, onClose, notify }) {
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="content-drawer" onMouseDown={(event) => event.stopPropagation()}>
    <div className="drawer-header"><div><p className="eyebrow">CONTENT PREVIEW</p><h2>{type}预览</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div>
    <div className="drawer-meta"><StatusPill>{item.status}</StatusPill><span>#{item.keyword}</span><span>{item.updated}</span></div><h3>{item.title}</h3>
    {type === "文章" ? <div className="article-preview"><p>在生成式搜索成为用户获取信息的重要入口之后，企业内容需要同时满足真实用户与大模型引用的双重需求。</p><h4>一、明确用户真实问题</h4><p>围绕关键词拆解搜索场景、决策因素与常见疑问，形成清晰且可验证的内容结构。</p><h4>二、建立可信内容证据</h4><p>使用企业知识库中的产品资料、服务案例和权威来源，使内容具备明确的事实支撑。</p></div> : <div className="video-preview"><FilmStrip size={48} /><strong>{item.duration === "—" ? "脚本生成中" : item.duration}</strong><span>短视频预览区域</span></div>}
    <div className="drawer-footer"><button className="ghost-button" onClick={() => notify("内容编辑器已打开")}>编辑内容</button><button className="primary-button" onClick={() => notify("已加入发布内容池")}>加入发布</button></div>
  </aside></div>;
}

function ContentManager({ type, projectId, notify }) {
  const [items, setItems] = useState(type === "文章" ? ARTICLE_ITEMS : VIDEO_ITEMS);
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("全部状态");
  const [createOpen, setCreateOpen] = useState(false); const [preview, setPreview] = useState(null); const [draftTitle, setDraftTitle] = useState("");
  const scopeProject = PROJECTS.find((item) => item.id === projectId);
  const scopedItems = scopeProject ? items.filter((item) => item.project === scopeProject.name) : items;
  const filtered = scopedItems.filter((item) => `${item.title}${item.project}${item.keyword}`.toLowerCase().includes(query.toLowerCase()) && (status === "全部状态" || item.status === status));
  const createContent = (event) => { event.preventDefault(); if (!draftTitle.trim()) return; const targetProject = scopeProject || PROJECTS[0]; const newItem = type === "文章" ? { id: Date.now(), title: draftTitle, project: targetProject.name, keyword: targetProject.keyword, status: "生成中", media: 0, updated: "刚刚" } : { id: Date.now(), title: draftTitle, project: targetProject.name, keyword: targetProject.keyword, status: "生成中", duration: "—", updated: "刚刚" }; setItems([newItem, ...items]); setDraftTitle(""); setCreateOpen(false); notify(`${type}生成任务已创建`); };
  return <section className="page-section content-page">
    <div className="page-heading"><div><p className="eyebrow">GEO CONTENT STUDIO</p><h1>{type}创作</h1><p>{scopeProject ? `仅管理“${scopeProject.name}”项目下的${type}内容。` : `生成、查看和管理与 GEO 项目关键词关联的${type}内容。`}</p></div><button className="primary-button" onClick={() => setCreateOpen(true)}><Sparkle size={17} />生成{type}</button></div>
    {scopeProject ? <div className="management-scope-bar"><FolderSimple size={16} /><span>当前项目</span><strong>{scopeProject.name}</strong><small>仅展示项目相关数据</small></div> : null}
    <div className="summary-line"><span><strong>{scopedItems.length}</strong> 全部内容</span><span><strong>{scopedItems.filter((item) => item.status === "生成中").length}</strong> 生成中</span><span><strong>{scopedItems.filter((item) => item.status === "待审核").length}</strong> 待审核</span><span><strong>{scopedItems.filter((item) => item.status === "已发布").length}</strong> 已发布</span></div>
    <div className="list-toolbar"><label className="search-control"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索${type}标题 / 关键词`} /></label><label className="select-control"><FunnelSimple size={16} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>全部状态</option><option>生成中</option><option>待审核</option><option>已完成</option><option>已发布</option></select></label></div>
    <div className="data-surface content-table"><div className="content-grid table-head"><span>{type}标题</span><span>所属项目</span><span>关联关键词</span><span>{type === "文章" ? "预期媒体" : "时长"}</span><span>状态</span><span>更新时间</span><span>操作</span></div>{filtered.map((item) => <div className="content-grid content-row" key={item.id}><div className="content-title"><span className="content-icon">{type === "文章" ? <Article size={18} /> : <VideoCamera size={18} />}</span><strong>{item.title}</strong></div><span>{item.project}</span><span className="keyword-text">#{item.keyword}</span><span>{type === "文章" ? `${item.media} 家` : item.duration}</span><StatusPill>{item.status}</StatusPill><span className="muted-text">{item.updated}</span><div className="row-actions"><button className="icon-button" onClick={() => setPreview(item)} aria-label="查看"><Eye size={17} /></button><button className="icon-button" onClick={() => notify("已打开内容管理菜单")} aria-label="更多"><DotsThree size={19} /></button></div></div>)}</div>
    {createOpen ? <div className="modal-backdrop" onMouseDown={() => setCreateOpen(false)}><form className="modal" onSubmit={createContent} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">AI GENERATION</p><h2>生成{type}</h2></div><button type="button" className="icon-button" onClick={() => setCreateOpen(false)}><X size={19} /></button></div><label className="field-label">所属项目<select>{(scopeProject ? [scopeProject] : PROJECTS).map((project) => <option key={project.id}>{project.name}</option>)}</select></label><label className="field-label">关联关键词<select><option>{(scopeProject || PROJECTS[0]).keyword}</option><option>{(scopeProject || PROJECTS[0]).keyword}推荐</option></select></label><label className="field-label">内容主题<input autoFocus value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder={`请输入${type}主题`} /></label><div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setCreateOpen(false)}>取消</button><button className="primary-button"><Sparkle size={16} />开始生成</button></div></form></div> : null}
    {preview ? <ContentDrawer item={preview} type={type} onClose={() => setPreview(null)} notify={notify} /> : null}
  </section>;
}

function MediaLibrary({ projectId, selectedMedia, setSelectedMedia, onCreateTask, notify }) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("全部媒体");
  const scopeProject = PROJECTS.find((item) => item.id === projectId);
  const relatedMediaNames = new Set(scopeProject?.articles.flatMap((article) => article.media) || []);
  const availableMedia = scopeProject ? MEDIA.filter((item) => relatedMediaNames.has(item.name)) : MEDIA;
  const categories = ["全部媒体", ...new Set(availableMedia.map((item) => item.category))];
  const filtered = availableMedia.filter((item) => (category === "全部媒体" || item.category === category) && item.name.includes(query));
  const toggle = (id) => setSelectedMedia((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const selectVisible = () => setSelectedMedia((current) => new Set([...current, ...filtered.map((item) => item.id)]));
  return <section className="page-section media-page">
    <div className="page-heading"><div><p className="eyebrow">GEO MEDIA NETWORK</p><h1>选择发布媒体</h1><p>{scopeProject ? `仅管理“${scopeProject.name}”项目关联的媒体信源。` : "从媒体库中搜索、筛选并批量选择本次内容的发布渠道。"}</p></div><div className="selection-counter"><span>已选媒体</span><strong>{selectedMedia.size}</strong></div></div>
    {scopeProject ? <div className="management-scope-bar"><FolderSimple size={16} /><span>当前项目</span><strong>{scopeProject.name}</strong><small>仅展示项目相关数据</small></div> : null}
    <div className="media-workspace"><aside className="media-filter-panel"><div className="filter-title"><FunnelSimple size={17} /><strong>媒体分类</strong></div>{categories.map((item) => <button className={cx(category === item && "active")} onClick={() => setCategory(item)} key={item}><span>{item}</span><small>{item === "全部媒体" ? availableMedia.length : availableMedia.filter((medium) => medium.category === item).length}</small></button>)}</aside>
      <div className="media-main"><div className="media-toolbar"><label className="search-control"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索媒体名称" /></label><div><button className="ghost-button" onClick={selectVisible}><SelectionAll size={16} />全选当前</button><button className="text-button" onClick={() => setSelectedMedia(new Set())}>清空选择</button></div></div>
      <div className="media-grid">{filtered.map((medium) => { const selected = selectedMedia.has(medium.id); return <button className={cx("media-card", selected && "selected")} onClick={() => toggle(medium.id)} key={medium.id}><span className="media-card-check">{selected ? <Check size={13} weight="bold" /> : null}</span><span className="media-logo">{medium.name.slice(0, 1)}</span><span className="media-card-copy"><strong>{medium.name}</strong><small>{medium.category}</small></span><span className="media-score"><small>推荐度</small><strong>{medium.score}</strong></span><span className="media-strength">{medium.strength}</span></button>; })}</div></div></div>
    <div className={cx("selection-dock", selectedMedia.size && "visible")}><div><CheckCircle size={20} weight="fill" /><strong>已选择 {selectedMedia.size} 家媒体</strong><span>预计形成 {selectedMedia.size * 2} 个发布任务</span></div><div><button className="ghost-button" onClick={() => notify("已保存当前媒体组合")}>保存媒体组合</button><button className="primary-button" onClick={onCreateTask}>创建发布任务<ArrowRight size={16} /></button></div></div>
  </section>;
}

function PublishTasks({ notify }) {
  return <section className="page-section publish-page"><div className="page-heading"><div><p className="eyebrow">PUBLISH QUEUE</p><h1>发布任务</h1><p>跟踪内容在各媒体渠道的投放进度和发布结果。</p></div><button className="primary-button" onClick={() => notify("请先在“选择媒体”中创建发布任务")}><Plus size={17} />新建发布</button></div><div className="metric-strip compact-metrics"><div><PaperPlaneTilt size={20} /><span>今日发布</span><strong>28</strong></div><div><ClockCountdown size={20} /><span>发布中</span><strong>7</strong></div><div><CheckCircle size={20} /><span>成功发布</span><strong>126</strong></div><div><Pulse size={20} /><span>成功率</span><strong>96.2%</strong></div></div><div className="data-surface task-table"><div className="task-grid table-head"><span>任务编号</span><span>关联项目</span><span>发布内容</span><span>目标媒体</span><span>发布进度</span><span>状态</span><span>更新时间</span><span>操作</span></div>{PUBLISH_TASKS.map((task) => <div className="task-grid task-row" key={task.id}><strong>{task.id}</strong><span>{task.project}</span><span>{task.content}</span><span>{task.media}</span><div className="task-progress"><progress max="100" value={task.progress} /><span>{task.progress}%</span></div><StatusPill>{task.status}</StatusPill><span className="muted-text">{task.updated}</span><button className="icon-button" onClick={() => notify("已打开任务详情")}><Eye size={17} /></button></div>)}</div></section>;
}

function Kpi({ icon: Icon, label, value, delta }) { return <div className="kpi"><span className="kpi-icon"><Icon size={20} /></span><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></div>; }

function ProjectOverview() {
  return <><div className="kpi-grid"><Kpi icon={Target} label="监测关键词" value="24" delta="+4" /><Kpi icon={Newspaper} label="AI品牌提及" value="186" delta="+18.6%" /><Kpi icon={TrendUp} label="平均提及率" value="68.4%" delta="+7.2%" /><Kpi icon={ChartBar} label="平均提及排名" value="2.8" delta="提升 0.6" /></div><div className="stats-grid"><div className="data-surface coverage-panel"><div className="panel-title"><div><h2>AI平台覆盖表现</h2><p>各平台近30天品牌提及率</p></div><span>更新于 10:30</span></div><div className="bar-list">{PLATFORM_STATS.map(([name, rate, count]) => <div className="bar-row" key={name}><span>{name}</span><div className="bar-track"><i style={{ width: `${rate}%` }} /></div><strong>{rate}%</strong><small>{count} 次提及</small></div>)}</div></div><div className="data-surface insight-panel"><div className="panel-title"><div><h2>本期结论</h2><p>基于项目数据自动总结</p></div><Sparkle size={18} /></div><div className="insight-score"><span>综合表现</span><strong>良好</strong><small>较上期提升 12%</small></div><ul><li>DeepSeek 的品牌提及率最高，建议保持当前发布频率。</li><li>“智能客服系统推荐”排名提升最明显。</li><li>搜狐号发布内容的跨平台引用表现突出。</li></ul></div></div></>;
}

function StatsTable({ columns, rows }) { return <div className="data-surface stats-table"><div className="simple-stats-row table-head">{columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.map((row, index) => <div className="simple-stats-row" key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <strong key={cellIndex}>{cell}</strong> : <span key={cellIndex}>{cell}</span>)}</div>)}</div>; }

function Statistics({ tab, projectId }) {
  const [selectedProject, setSelectedProject] = useState(projectId || 1); const project = PROJECTS.find((item) => item.id === selectedProject) || PROJECTS[0];
  const keywordRows = [["智能客服系统", "82%", "2.1", "32", "+14%"], ["智能客服系统推荐", "76%", "2.6", "28", "+20%"], ["智能客服系统哪家好", "69%", "3.0", "21", "+8%"], ["智能客服系统价格", "61%", "3.4", "18", "+5%"], ["智能客服系统应用场景", "58%", "3.8", "15", "+11%"]];
  const contentRows = [["智能客服系统核心功能解析与应用场景", "文章", "12", "6", "74%"], ["如何选择适合企业的智能客服系统？", "文章", "10", "5", "68%"], ["60秒看懂智能客服系统", "短视频", "8", "4", "63%"], ["企业AI培训课程怎么选", "文章", "7", "4", "59%"]];
  const mediaRows = PLATFORM_STATS.map(([name, rate, count, rank]) => [name, `${count} 篇`, `${rate}%`, rank, rate > 70 ? "高价值" : "稳定"]);
  return <section className="page-section stats-page"><div className="page-heading"><div><p className="eyebrow">GEO PERFORMANCE</p><h1>{tab}</h1><p>查看内容发布后的 AI 收录、品牌提及和媒体表现。</p></div><div className="heading-actions"><label className="select-control wide"><FolderSimple size={16} /><select value={selectedProject} onChange={(event) => setSelectedProject(Number(event.target.value))}>{PROJECTS.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><button className="ghost-button"><CalendarBlank size={16} />近30天</button><button className="ghost-button"><ArrowSquareOut size={16} />导出</button></div></div><div className="stats-context"><span>当前项目</span><strong>{project.name}</strong><span>订单号 {project.order}</span><StatusPill>{getProjectStageLabel(project)}</StatusPill></div>{tab === "项目概览" ? <ProjectOverview /> : null}{tab === "关键词表现" ? <StatsTable columns={["关键词", "提及率", "平均排名", "提及次数", "环比"]} rows={keywordRows} /> : null}{tab === "内容表现" ? <StatsTable columns={["内容", "类型", "引用次数", "覆盖平台", "提及率"]} rows={contentRows} /> : null}{tab === "媒体表现" ? <StatsTable columns={["媒体 / 平台", "收录内容", "品牌提及率", "平均排名", "表现"]} rows={mediaRows} /> : null}</section>;
}

let chatMessageSequence = 0;
const createChatMessage = (role, text, kind = "message") => ({ id: `xz-${Date.now().toString(36)}-${++chatMessageSequence}-${Math.random().toString(36).slice(2, 7)}`, role, text, kind });

function getAssistantContext(secondary, tertiary, projectView, projectId) {
  const project = PROJECTS.find((item) => item.id === projectId) || PROJECTS[0];
  if (secondary === "项目" && projectView === "detail") return {
    key: `项目详情-${project.id}`,
    label: "项目详情",
    prompt: `你正在查看「${project.name}」。目前处于“${getProjectStageLabel(project)}”阶段，要我先帮你分析进度，还是解释关键词、文章与媒体之间的关系？`,
    chips: ["分析当前进度", "解释关联关系", "告诉我下一步"],
    next: "建议先确认生成中的文章，再核对每篇文章的目标媒体；内容完成后即可进入发布阶段。",
  };
  if (secondary === "项目") return {
    key: "项目列表",
    label: "项目",
    prompt: "你正在查看 GEO 项目列表。需要我帮你定位进度异常的项目、梳理下一步，还是说明如何新建项目？",
    chips: ["哪些项目需关注", "帮我梳理下一步", "如何新建项目"],
    next: "建议优先处理处于“创作”和“发布”的项目，并检查是否有计划长时间未确认。",
  };
  if (secondary === "选词") return {
    key: "关键词词包",
    label: "选词",
    prompt: "已进入选词页。你想创建一个新词包、扩展种子词，还是检查待确认的关键词词包？",
    chips: ["帮我创建词包", "扩展种子词", "查看待确认词包"],
    next: "建议先选择关联项目并输入一个种子词，再由我按业务场景、用户问题和搜索意图生成候选关键词，最后提交客户确认。",
  };
  if (secondary === "创作") {
    const type = tertiary.创作;
    return {
      key: `创作-${type}`,
      label: `创作 · ${type}`,
      prompt: `已进入${type}创作页。你想先生成一个${type === "文章" ? "选题与大纲" : "短视频脚本"}，还是检查当前内容的完成状态？`,
      chips: type === "文章" ? ["帮我生成选题", "优化文章结构", "查看待审核内容"] : ["生成短视频脚本", "优化视频标题", "查看生成进度"],
      next: `建议先确定目标关键词和受众，再生成${type === "文章" ? "文章大纲" : "分镜脚本"}，最后进入审核。`,
    };
  }
  if (secondary === "发布") {
    const type = tertiary.发布;
    return {
      key: `发布-${type}`,
      label: `发布 · ${type}`,
      prompt: type === "选择媒体" ? "已进入媒体选择页。要我根据内容类型推荐媒体组合，还是说明如何提高收录率？" : "已进入发布任务页。需要我检查失败任务、汇总当前进度，还是说明发布状态？",
      chips: type === "选择媒体" ? ["推荐媒体组合", "怎样提高收录", "检查发布条件"] : ["汇总发布进度", "检查异常任务", "解释任务状态"],
      next: type === "选择媒体" ? "建议同时选择高权重媒体与高流量媒体，兼顾 AI 引用可信度和内容曝光。" : "建议先处理失败或长时间停留在发布中的任务，再确认媒体账号与内容审核状态。",
    };
  }
  const tab = tertiary.统计;
  return {
    key: `统计-${tab}`,
    label: `统计 · ${tab}`,
    prompt: `已进入“${tab}”。需要我解读关键指标、发现异常，还是根据数据给出下一轮优化建议？`,
    chips: ["解读关键指标", "发现数据异常", "给出优化建议"],
    next: "建议先看品牌提及率和平均排名的变化，再追溯贡献最大的关键词、内容与媒体。",
  };
}

function getAssistantReply(question, context) {
  if (/进度|阶段|状态/.test(question)) return `${context.next} 我也可以继续帮你拆成可执行的检查清单。`;
  if (/下一步|优先|关注|异常/.test(question)) return context.next;
  if (/关键词|关联|关系/.test(question)) return "关键词与文章、文章与媒体都是多对多关系。点击任一卡片后，绿色动态连线会显示它直接关联的上下游信息。";
  if (/词包|种子词|拓词/.test(question)) return "每个词包从一个种子词出发，按业务场景、用户问题和搜索意图扩展候选词。完成筛选并确认后，就可以关联到 GEO 项目。";
  if (/媒体|发布|收录/.test(question)) return "媒体选择要同时考虑权重、受众匹配和历史收录表现。当前建议优先组合知乎、百家号、今日头条与搜狐号。";
  if (/文章|选题|结构|创作/.test(question)) return "可以先用选定的关键词确定用户问题，再按“结论—证据—场景—行动建议”组织内容，这样更利于 AI 理解和引用。";
  if (/视频|脚本|标题/.test(question)) return "短视频建议在前 3 秒直接给出问题与收益点，正文控制为三个信息段，结尾补充明确的品牌关联。";
  if (/指标|数据|统计|优化|引用|提及|排名/.test(question)) return "先看品牌提及率、平均排名和引用量，再对比关键词、内容与媒体贡献，优先优化高曝光但低引用的内容。";
  if (/新建项目/.test(question)) return "点击项目页右上角“新建项目”，补充订单、关键词和目标媒体后即可创建执行计划。";
  return `我会结合当前的“${context.label}”页面回答。你可以告诉我具体想了解的数据、操作或目标，我会直接给出下一步。`;
}

function GeoAssistant({ context, messages, input, typing, collapsed, onToggleCollapsed, onInputChange, onSend }) {
  const messageAreaRef = useRef(null);
  useEffect(() => {
    const area = messageAreaRef.current;
    if (area) area.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);
  const submit = (event) => { event.preventDefault(); onSend(input); };
  return <aside className={cx("geo-assistant", collapsed && "collapsed")} aria-label="GEO全局对话助手小智">
    <div className="assistant-profile">
      <span className="xiaozhi-avatar"><Robot size={25} weight="duotone" /><i /></span>
      <div><strong>小智</strong><span><i />GEO 智能助手</span><span className="assistant-context">{context.label}</span></div>
      <button className="assistant-collapse-button" onClick={onToggleCollapsed} aria-label={collapsed ? "展开小智" : "收起小智"} title={collapsed ? "展开小智" : "收起小智"}>{collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}</button>
    </div>
    {!collapsed ? <><div className="assistant-message-area" ref={messageAreaRef} aria-live="polite">
      <div className="assistant-daymark"><span>本次对话</span></div>
      {messages.map((message) => <div className={cx("assistant-message", message.role, message.kind === "context" && "context-message")} key={message.id}>
        {message.role === "assistant" ? <span className="message-avatar"><Robot size={14} weight="duotone" /></span> : null}
        <div className="message-bubble">{message.text}</div>
      </div>)}
      {typing ? <div className="assistant-message assistant"><span className="message-avatar"><Robot size={14} /></span><div className="message-bubble typing-bubble"><i /><i /><i /></div></div> : null}
    </div>
    <div className="assistant-composer">
      <div className="quick-question-title"><Sparkle size={13} weight="fill" />你可以这样问</div>
      <div className="assistant-chips">{context.chips.map((chip) => <button type="button" onClick={() => onSend(chip)} key={chip}>{chip}</button>)}</div>
      <form className="assistant-input-box" onSubmit={submit}>
        <textarea value={input} onChange={(event) => onInputChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(input); } }} rows="2" placeholder="问小智任何 GEO 问题…" />
        <div><span>Enter 发送</span><button type="submit" disabled={!input.trim()} aria-label="发送消息"><PaperPlaneTilt size={16} weight="fill" /></button></div>
      </form>
    </div></> : null}
  </aside>;
}

export function App() {
  const [primary, setPrimary] = useState("首页"); const [secondary, setSecondary] = useState("项目");
  const [tertiary, setTertiary] = useState({ 创作: "文章", 发布: "选择媒体", 统计: "项目概览" });
  const [projectView, setProjectView] = useState("list");
  const [projectId, setProjectId] = useState(1); const [selectedMedia, setSelectedMedia] = useState(new Set([1, 2, 3])); const [toast, setToast] = useState("");
  const [managementScope, setManagementScope] = useState(null);
  const [assistantMessages, setAssistantMessages] = useState([createChatMessage("assistant", "你好，我是小智。你在 GEO 工作台里有什么问题，都可以直接问我。")]);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [assistantCollapsed, setAssistantCollapsed] = useState(true);
  const assistantContext = useMemo(() => getAssistantContext(secondary, tertiary, projectView, projectId), [secondary, tertiary, projectView, projectId]);
  const lastAssistantContext = useRef("");
  useEffect(() => {
    if (primary !== "GEO" || lastAssistantContext.current === assistantContext.key) return;
    lastAssistantContext.current = assistantContext.key;
    setAssistantMessages((current) => [...current, createChatMessage("assistant", assistantContext.prompt, "context")].slice(-40));
  }, [primary, assistantContext]);
  const notify = (message) => { setToast(message); window.clearTimeout(window.__zjToastTimer); window.__zjToastTimer = window.setTimeout(() => setToast(""), 2400); };
  const switchTertiary = (item) => setTertiary((current) => ({ ...current, [secondary]: item }));
  const viewStats = (id) => { setProjectId(id); setManagementScope(null); setSecondary("统计"); setTertiary((current) => ({ ...current, 统计: "项目概览" })); };
  const openDetail = (id) => { setProjectId(id); setManagementScope(null); setProjectView("detail"); };
  const openProjectManagement = (kind, id) => {
    setProjectId(id);
    setManagementScope({ kind, projectId: id });
    if (kind === "keyword") setSecondary("选词");
    if (kind === "content") { setSecondary("创作"); setTertiary((current) => ({ ...current, 创作: "文章" })); }
    if (kind === "media") { setSecondary("发布"); setTertiary((current) => ({ ...current, 发布: "选择媒体" })); }
  };
  const createPublishTask = () => { notify(`已创建 ${selectedMedia.size} 家媒体的发布任务`); setSecondary("发布"); setTertiary((current) => ({ ...current, 发布: "发布任务" })); };
  const sendToAssistant = (rawMessage) => {
    const message = rawMessage.trim();
    if (!message) return;
    setAssistantMessages((current) => [...current, createChatMessage("user", message)].slice(-40));
    setAssistantInput("");
    setAssistantTyping(true);
    window.clearTimeout(window.__zjAssistantTimer);
    window.__zjAssistantTimer = window.setTimeout(() => {
      setAssistantMessages((current) => [...current, createChatMessage("assistant", getAssistantReply(message, assistantContext))].slice(-40));
      setAssistantTyping(false);
    }, 420);
  };
  const HeaderActions = () => <div className="top-actions"><button className="icon-button top-notification" aria-label="通知" onClick={() => notify("暂无新的通知")}><Bell size={19} /><i /></button><button className="user-account" aria-label="用户账户" onClick={() => notify("已打开个人账户菜单")}><span className="avatar">ZJ</span><span>张景</span><CaretDown size={13} /></button><button className="team-switcher"><Buildings size={17} />运营团队<CaretDown size={13} /></button></div>;
  let content;
  if (primary === "首页") content = <HomePage notify={notify} onNavigate={setPrimary} />;
  else if (primary !== "GEO") content = <EmptyStub title={primary} />;
  else if (secondary === "项目" && projectView === "list") content = <ProjectList onOpenDetail={openDetail} notify={notify} />;
  else if (secondary === "项目") content = <ProjectDetail projectId={projectId} onBack={() => setProjectView("list")} onViewStats={viewStats} notify={notify} />;
  else if (secondary === "选词") content = <KeywordPackages projectId={managementScope?.kind === "keyword" ? managementScope.projectId : null} notify={notify} />;
  else if (secondary === "创作") content = <ContentManager key={`${tertiary.创作}-${managementScope?.kind === "content" ? managementScope.projectId : "all"}`} type={tertiary.创作} projectId={managementScope?.kind === "content" ? managementScope.projectId : null} notify={notify} />;
  else if (secondary === "发布" && tertiary.发布 === "选择媒体") content = <MediaLibrary projectId={managementScope?.kind === "media" ? managementScope.projectId : null} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} onCreateTask={createPublishTask} notify={notify} />;
  else if (secondary === "发布") content = <PublishTasks notify={notify} />;
  else content = <Statistics tab={tertiary.统计} projectId={projectId} />;
  return <div className={cx("app-frame", primary === "首页" && "home-active")}>
    <aside className="primary-rail"><button className="brand-mark" aria-label="智见新版" onClick={() => setPrimary("首页")}><Sparkle size={24} weight="fill" /><span>智见</span><small>新版</small></button><nav aria-label="一级导航">{PRIMARY_NAV.map(([label, Icon]) => <button className={cx("rail-item", primary === label && "active")} onClick={() => { setPrimary(label); setManagementScope(null); if (label === "GEO") { setSecondary("项目"); setProjectView("list"); } }} key={label}><Icon size={22} weight={primary === label ? "fill" : "regular"} /><span>{label}</span></button>)}</nav></aside>
    <main className="app-main">{primary === "首页" ? content : primary === "GEO" ? <>
      <header className="secondary-bar"><nav aria-label="GEO二级导航">{SECONDARY_NAV.map(([label, Icon]) => <button className={cx(secondary === label && "active")} onClick={() => { setManagementScope(null); setSecondary(label); if (label === "项目") setProjectView("list"); }} key={label}><Icon size={17} /><span>{label}</span></button>)}</nav><HeaderActions /></header>
      <div className="geo-workspace">
        <GeoAssistant context={assistantContext} messages={assistantMessages} input={assistantInput} typing={assistantTyping} collapsed={assistantCollapsed} onToggleCollapsed={() => setAssistantCollapsed((current) => !current)} onInputChange={setAssistantInput} onSend={sendToAssistant} />
        <div className="geo-content">{TERTIARY_NAV[secondary] ? <div className="tertiary-bar" aria-label="三级导航">{TERTIARY_NAV[secondary].map((item) => <button className={cx(tertiary[secondary] === item && "active")} onClick={() => switchTertiary(item)} key={item}>{item}</button>)}</div> : null}<div className="page-scroll">{content}</div></div>
      </div>
    </> : <><header className="secondary-bar empty-header"><strong>{primary}</strong><HeaderActions /></header><div className="page-scroll">{content}</div></>}
    </main>
    {toast ? <div className="toast"><CheckCircle size={19} weight="fill" />{toast}</div> : null}
  </div>;
}
