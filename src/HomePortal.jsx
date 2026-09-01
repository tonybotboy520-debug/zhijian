import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowSquareOut, Books, CalendarBlank, CaretLeft, CaretRight,
  ChartLineUp, Check, CheckCircle, CirclesThreePlus, Clock, Database, GlobeHemisphereWest,
  Lightning, LinkSimple, List, Megaphone, MonitorPlay, Newspaper, PencilLine,
  Pulse, Robot, ShareNetwork, ShieldCheck, Sparkle, SquaresFour, Stack, Target, TrendUp, UsersThree,
} from "@phosphor-icons/react";
import { HeaderActions, ProductMatrixPage } from "./HomePage.jsx";

const HOME_TABS = [
  { id: "news", label: "资讯", icon: Newspaper },
  { id: "products", label: "产品介绍", icon: Stack },
  { id: "matrix", label: "产品矩阵", icon: SquaresFour },
];

const NEWS_CATEGORIES = ["全部", "版本更新", "客户案例", "行业洞察", "产品教程", "活动动态"];

const ARTICLE_SECTIONS = {
  update: [
    { title: "从项目目标到可执行词包", body: "新版选词将关键词从一次性输入变成可持续运营的项目资产。团队可以从业务目标、用户问题和搜索意图出发，建立词包后再与 GEO 项目关联。" },
    { title: "五阶段任务链路更清晰", body: "项目统一按诊断、选词、创作、发布、统计五个阶段推进。每个阶段都会留下计划、确认和结果，方便客户与执行团队使用同一套进度语言。" },
    { title: "这次更新会带来什么", body: "对客户而言，每个关键节点的输入和产出更容易理解；对运营团队而言，词包、内容和媒体之间的关系更易于查找和复盘。" },
  ],
  case: [
    { title: "业务背景", body: "演示客户“云启制造”拥有完整的产品资料，但在 AI 平台中的品牌表达不一致，且缺少面向不同采购角色的问题覆盖。" },
    { title: "解决方案", body: "团队先将产品参数、服务案例与常见问题沉淀到 AI 知识库，再由 AI 诊断识别缺口，最后用 GEO 项目完成选词、内容与信源布局。" },
    { title: "阶段性结果", body: "本页的客户名称与数据为产品演示内容，不代表真实客户成果。案例重点用于展示从知识沉淀到 GEO 执行的标准路径。" },
  ],
  insight: [
    { title: "AI 答案正在成为新的认知入口", body: "用户不再只通过搜索结果页逐条比较信息，而是直接向 AI 描述问题、场景和限制条件。品牌能否被正确理解，开始影响用户的第一轮候选。" },
    { title: "GEO 不只是内容数量", body: "有效的 GEO 需要统一企业事实、客群场景、用户问题和可信信源。它更像一套跨知识、内容和媒体的持续运营方法。" },
    { title: "从被看见到能转化", body: "品牌在 AI 中建立认知后，仍需要由 AI 官网和 AI 运营承接用户的进一步了解、咨询与跟进。认知、承接和转化应该被放在同一条增长链路中观察。" },
  ],
};

const NEWS_ITEMS = [
  {
    id: "geo-keyword-workflow", category: "版本更新", date: "2026-08-29", readTime: "6 分钟", featured: true,
    title: "智见 GEO 选词工作流升级：让每个关键词都进入增长链路",
    summary: "从词包建立、客户确认到项目执行，新版选词让 GEO 的目标、过程和产出更容易被追踪。",
    image: "/product-buildings/geo-lighthouse-v6.png", tone: "mint", sections: ARTICLE_SECTIONS.update,
  },
  {
    id: "yunqi-case", category: "客户案例", date: "2026-08-26", readTime: "8 分钟", featured: true, demo: true,
    title: "从企业知识到 AI 推荐：云启制造的 GEO 实践路径",
    summary: "一个演示案例：如何把分散的产品资料变成 AI 能理解、能引用、能推荐的企业知识。",
    image: "/product-buildings/ai-knowledge-vault-v6.png", tone: "sky", sections: ARTICLE_SECTIONS.case,
  },
  {
    id: "answer-economy", category: "行业洞察", date: "2026-08-22", readTime: "7 分钟", featured: true,
    title: "从搜索入口到 AI 答案：品牌认知正在发生什么变化？",
    summary: "当用户开始直接向 AI 询问产品建议，企业的内容、信源和官网需要建立新的协同方式。",
    image: "/product-buildings/ai-diagnosis-tower-v6.png", tone: "amber", sections: ARTICLE_SECTIONS.insight,
  },
  {
    id: "diagnosis-guide", category: "产品教程", date: "2026-08-19", readTime: "5 分钟",
    title: "如何读懂一份 AI 营销诊断报告",
    summary: "从问题严重度、影响链路到建议行动，帮你快速找到最值得先做的一件事。",
    image: "/product-buildings/ai-diagnosis-tower-v6.png", tone: "violet", sections: ARTICLE_SECTIONS.update,
  },
  {
    id: "growth-live", category: "活动动态", date: "2026-08-16", readTime: "3 分钟",
    title: "AI 营销增长实战公开课：从诊断到转化的完整路径",
    summary: "一场面向市场与增长团队的线上公开课，现场拆解 GEO、AIGC 与 AI 官网如何协同。",
    image: "/product-buildings/aigc-workshop-v6.png", tone: "coral", sections: ARTICLE_SECTIONS.insight,
  },
  {
    id: "website-release", category: "版本更新", date: "2026-08-13", readTime: "4 分钟",
    title: "AI 官网访客意图识别上线，让每次到访都有下一步",
    summary: "通过内容理解、问题匹配与对话承接，为不同意图的访客给出更合适的内容与行动。",
    image: "/product-buildings/ai-website-terminal-v6.png", tone: "teal", sections: ARTICLE_SECTIONS.update,
  },
  {
    id: "retail-case", category: "客户案例", date: "2026-08-09", readTime: "7 分钟", demo: true,
    title: "山川零售如何用 AI 运营承接内容流量",
    summary: "演示案例：将内容互动、官网咨询与私域跟进纳入一条可观察的客户经营链路。",
    image: null, tone: "paper", sections: ARTICLE_SECTIONS.case,
  },
  {
    id: "aigc-playbook", category: "产品教程", date: "2026-08-05", readTime: "6 分钟",
    title: "AIGC 内容项目快速入门：从客群到渠道的四步法",
    summary: "用一个简单项目理解如何确定客群、选择内容形式、匹配发布渠道并复盘结果。",
    image: "/product-buildings/aigc-workshop-v6.png", tone: "blue", sections: ARTICLE_SECTIONS.insight,
  },
];

const PRODUCT_ORDER = ["knowledge", "diagnosis", "geo", "aigc", "website", "operation", "agent"];

const PRODUCT_INTROS = {
  knowledge: {
    name: "AI知识库", short: "知识库", eyebrow: "统一知识与策略底座", icon: Database, opened: true,
    asset: "/product-buildings/ai-knowledge-vault-v6.png", accent: "cyan",
    headline: "让每一个 AI 产品，都真正理解你的企业",
    lead: "将分散在文档、网页与团队经验中的知识，变成可信、可追溯、可被所有 AI 营销产品共用的企业智慧。",
    metrics: [["知识资产", "1,286"], ["客群场景", "36"], ["知识健康度", "92%"]],
    features: [
      ["知识统一沉淀", "支持产品资料、官网、规则与案例统一管理，建立清晰的来源与版本。", Books],
      ["客群场景图谱", "从企业事实向客群、场景、需求和问题继续推演，为营销执行提供策略。", CirclesThreePlus],
      ["全产品知识共享", "GEO、AIGC、AI 官网和 AI 运营共用同一份企业理解，减少重复配置。", Lightning],
    ],
  },
  diagnosis: {
    name: "AI诊断", short: "AI诊断", eyebrow: "增长问题的前置入口", icon: Pulse, opened: true,
    asset: "/product-buildings/ai-diagnosis-tower-v6.png", accent: "violet",
    headline: "先看清问题，再把力气用在最值得的地方",
    lead: "持续观察品牌在 AI 认知、内容触达、官网承接与客户运营中的表现，自动识别问题并给出优先级。",
    metrics: [["综合健康度", "78"], ["发现机会", "12"], ["高优问题", "3"]],
    features: [
      ["跨产品健康监测", "用一套诊断视图理解 GEO、内容、官网与运营链路的主要问题。", Pulse],
      ["问题优先级判断", "结合影响范围、严重度和修复成本，帮助团队统一行动顺序。", Target],
      ["可执行产品建议", "每个问题都对应处理建议、预期产出和可进入的智见产品。", CheckCircle],
    ],
  },
  geo: {
    name: "GEO", short: "GEO", eyebrow: "AI 认知与推荐增长", icon: GlobeHemisphereWest, opened: true,
    asset: "/product-buildings/geo-lighthouse-v6.png", accent: "green",
    headline: "当用户问 AI 时，让你的品牌被看见、被理解、被选择",
    lead: "围绕高意图问题建立关键词、内容和权威信源，持续提升品牌在主流 AI 平台中的提及、引用与推荐机会。",
    metrics: [["品牌提及率", "62%"], ["平均排名", "2.8"], ["问题覆盖", "186"]],
    features: [
      ["从诊断定义增长目标", "定位品牌在不同 AI 平台、问题和对比场景中的认知缺口。", Pulse],
      ["用词包连接用户意图", "从业务、客群和问题出发建立关键词资产，并持续与项目关联。", Target],
      ["内容与信源协同", "生成可被 AI 理解的内容，并通过适合的媒体网络建立可信引用。", ShieldCheck],
    ],
  },
  aigc: {
    name: "AIGC", short: "AIGC", eyebrow: "全域内容与广告获客", icon: PencilLine, opened: false,
    asset: "/product-buildings/aigc-workshop-v6.png", accent: "orange",
    headline: "把客群洞察变成能在每个渠道发生作用的内容",
    lead: "面向小红书、抖音、视频号、搜索引擎与第三方媒体，持续生成文章、图片、视频和广告素材。",
    metrics: [["内容产出", "248"], ["渠道覆盖", "12"], ["内容互动", "+36%"]],
    features: [
      ["客群与热点对齐", "让内容主题同时响应客群需求、行业热点与品牌策略。", TrendUp],
      ["多形式内容生产", "在统一策略下生成文章、社交内容、图片与短视频脚本。", PencilLine],
      ["多渠道发布与复盘", "为不同媒体调整内容表达，统一追踪发布进度与结果。", Megaphone],
    ],
  },
  website: {
    name: "AI官网", short: "AI官网", eyebrow: "自有流量承接与转化阵地", icon: MonitorPlay, opened: true,
    asset: "/product-buildings/ai-website-terminal-v6.png", accent: "blue",
    headline: "不只展示企业，更要理解每一个到访者为什么而来",
    lead: "用 GEO 友好的信息结构建立品牌可信表达，并通过 AI 理解访客意图、回答问题、消除顾虑。",
    metrics: [["意图识别率", "86%"], ["对话解决率", "74%"], ["有效线索", "+28%"]],
    features: [
      ["GEO 友好的官网结构", "让企业事实、产品价值和用户问题被 AI 与真实访客同时理解。", GlobeHemisphereWest],
      ["访客意图与内容匹配", "根据来源、浏览路径和对话内容，为访客给出更相关的信息。", Target],
      ["咨询、留资与私域承接", "将高意向访客自然引导到对话、留资或 AI 运营的持续跟进链路。", UsersThree],
    ],
  },
  operation: {
    name: "AI运营", short: "AI运营", eyebrow: "公私域客户持续经营", icon: UsersThree, opened: false,
    asset: "/product-buildings/ai-operation-clubhouse-v6.png", accent: "rose",
    headline: "让一次访问和互动，变成可持续经营的客户关系",
    lead: "统一承接公域互动、官网线索与私域客户，按客户阶段自动安排跟进、培育和运营任务。",
    metrics: [["运营客户", "4,820"], ["自动任务", "326"], ["转化机会", "184"]],
    features: [
      ["公私域客户统一承接", "整合广告、社交平台、官网和私域的客户线索与互动记录。", UsersThree],
      ["客户分层与自动培育", "根据意向、阶段和行为触发沟通与任务，降低遗漏。", CirclesThreePlus],
      ["AI 客服与 AI 销售协同", "即时回答与长期跟进共享客户背景，推动从问题解决到销售转化。", CheckCircle],
    ],
  },
  agent: {
    name: "Agent应用市场", short: "Agent市场", eyebrow: "全链路开放工具层", icon: Robot, opened: false,
    asset: null, accent: "gold",
    headline: "把专项营销能力，变成随时可调用的 Agent 工具",
    lead: "从企业知识库出发，按需使用调研、策划、内容、分析与运营 Agent，为每条 AI 营销链路增加专项能力。",
    metrics: [["上架 Agent", "48"], ["任务模板", "126"], ["本月调用", "8.6k"]],
    features: [
      ["按营销场景找工具", "从 GEO、内容、官网和运营场景出发，快速找到适合的 Agent。", Robot],
      ["基于企业知识工作", "Agent 在授权范围内调用企业知识与策略，输出更符合品牌的结果。", Database],
      ["从模板到持续扩展", "支持智见自研与后续第三方工具，为新任务保留扩展空间。", CirclesThreePlus],
    ],
  },
};

function NewsArtwork({ item, compact = false }) {
  const Icon = item.category === "客户案例" ? CheckCircle : item.category === "行业洞察" ? TrendUp : item.category === "产品教程" ? Books : item.category === "活动动态" ? Megaphone : Sparkle;
  return <div className={`news-artwork tone-${item.tone} ${compact ? "compact" : ""}`}>
    <div className="news-artwork-grid" />
    <span className="news-artwork-orbit orbit-one" /><span className="news-artwork-orbit orbit-two" />
    <div className="news-artwork-badge"><Icon size={compact ? 18 : 24} weight="duotone" /></div>
    {item.image ? <img src={item.image} alt="" /> : <div className="news-artwork-letter">智见</div>}
    <div className="news-artwork-caption"><strong>{item.category}</strong></div>
  </div>;
}

function NewsArticle({ item, onBack, onSelect, notify }) {
  const index = NEWS_ITEMS.findIndex((article) => article.id === item.id);
  const previous = NEWS_ITEMS[index - 1] ?? null;
  const next = NEWS_ITEMS[index + 1] ?? null;
  const related = NEWS_ITEMS.filter((article) => article.id !== item.id && article.category === item.category).slice(0, 2);

  const share = async () => {
    try { await navigator.clipboard?.writeText(window.location.href); } catch { /* clipboard may be unavailable in preview */ }
    notify("文章链接已复制");
  };

  return <div className="news-article-page">
    <div className="article-progress" />
    <header className="article-masthead">
      <button className="article-back" onClick={onBack}><ArrowLeft size={17} />返回资讯</button>
      <div className="article-heading">
        <div className="article-kicker"><span>{item.category}</span>{item.demo ? <em>演示案例</em> : null}</div>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <div className="article-meta"><span><CalendarBlank size={15} />{item.date}</span><span><Clock size={15} />{item.readTime}阅读</span><button onClick={share}><ShareNetwork size={15} />分享</button></div>
      </div>
    </header>

    <div className="article-cover"><NewsArtwork item={item} /></div>

    <div className="article-layout">
      <aside className="article-toc"><div><List size={15} /><strong>本文目录</strong></div>{item.sections.map((section, sectionIndex) => <a href={`#article-section-${sectionIndex}`} key={section.title}><span>0{sectionIndex + 1}</span>{section.title}</a>)}</aside>
      <article className="article-body">
        <p className="article-lead">{item.summary}</p>
        {item.demo ? <div className="demo-disclaimer"><ShieldCheck size={20} /><div><strong>演示数据说明</strong><p>文中客户名称、执行过程与结果数据均为产品原型演示内容。</p></div></div> : null}
        {item.sections.map((section, sectionIndex) => <section id={`article-section-${sectionIndex}`} key={section.title}><span className="article-section-index">0{sectionIndex + 1}</span><h2>{section.title}</h2><p>{section.body}</p>{sectionIndex === 0 ? <blockquote><Sparkle size={19} weight="fill" /><p>智见将“看见问题”与“进入行动”放在同一条工作链路中，让策略不停留在报告里。</p></blockquote> : null}</section>)}
        <div className="article-ending"><span>完</span><p>本文为智见产品资讯静态演示内容。</p></div>
      </article>
      <aside className="article-share-rail"><button onClick={share} aria-label="复制文章链接"><LinkSimple size={18} /></button><span>分享</span></aside>
    </div>

    <section className="article-more">
      <div className="article-pager">
        {previous ? <button onClick={() => onSelect(previous.id)}><CaretLeft size={18} /><span><small>上一篇</small><strong>{previous.title}</strong></span></button> : <span />}
        {next ? <button className="next" onClick={() => onSelect(next.id)}><span><small>下一篇</small><strong>{next.title}</strong></span><CaretRight size={18} /></button> : null}
      </div>
      {related.length ? <><div className="section-title-row"><div><h2>相关推荐</h2></div></div><div className="related-news-grid">{related.map((article) => <button onClick={() => onSelect(article.id)} key={article.id}><NewsArtwork item={article} compact /><div><span>{article.category} · {article.date}</span><h3>{article.title}</h3><p>{article.summary}</p></div></button>)}</div></> : null}
    </section>
  </div>;
}

function NewsPage({ notify }) {
  const [category, setCategory] = useState("全部");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef(null);
  const feedRef = useRef(null);
  const featured = NEWS_ITEMS.filter((item) => item.featured);
  const filteredNews = useMemo(() => category === "全部" ? NEWS_ITEMS : NEWS_ITEMS.filter((item) => item.category === category), [category]);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize));
  const visibleNews = filteredNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (selectedArticle) return undefined;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % featured.length), 5000);
    return () => window.clearInterval(timer);
  }, [activeSlide, featured.length, selectedArticle]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [selectedArticle]);

  const openArticle = (id) => setSelectedArticle(NEWS_ITEMS.find((item) => item.id === id) ?? null);
  const changePage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: Math.max((feedRef.current?.offsetTop ?? 0) - 18, 0), behavior: "smooth" }));
  };
  const slide = featured[activeSlide];
  const sideNews = [NEWS_ITEMS[3], NEWS_ITEMS[4]];

  return <div className="portal-page-scroll newsroom-scroll" ref={scrollRef}>
    {selectedArticle ? <NewsArticle item={selectedArticle} onBack={() => setSelectedArticle(null)} onSelect={openArticle} notify={notify} /> : <div className="newsroom-page">
      <section className="news-hero-composite" aria-label="焦点资讯组合">
        <div className="news-hero" aria-label="焦点资讯轮播">
          <div className="news-hero-copy" key={`copy-${slide.id}`} aria-live="polite">
            <h1>{slide.title}</h1>
          </div>
          <div className="news-hero-visual" key={`visual-${slide.id}`}><NewsArtwork item={slide} /></div>
          <button className="news-hero-click-target" onClick={() => openArticle(slide.id)} aria-label={`阅读${slide.title}`} />
          <div className="news-slider-controls">
            <div>{featured.map((item, index) => <button className={activeSlide === index ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`切换到第${index + 1}张资讯`} key={item.id}><i /></button>)}</div>
          </div>
        </div>
        <aside className="news-hero-side" aria-label="推荐资讯">
          {sideNews.map((item) => <button className="news-side-card" onClick={() => openArticle(item.id)} aria-label={`阅读${item.title}`} key={item.id}>
            <NewsArtwork item={item} compact />
            <span className="news-side-card-copy"><strong>{item.title}</strong></span>
          </button>)}
        </aside>
      </section>

      <section className="news-feed-shell" ref={feedRef}>
        <div className="news-feed-header">
          <div><h2>最新资讯</h2><p>产品进展、客户实践与 AI 营销新知</p></div>
          <div className="demo-chip"><ShieldCheck size={15} />静态演示内容</div>
        </div>
        <nav className="news-category-tabs" aria-label="资讯分类">{NEWS_CATEGORIES.map((item) => <button className={category === item ? "active" : ""} onClick={() => { setCategory(item); setCurrentPage(1); }} key={item}>{item}<span>{item === "全部" ? NEWS_ITEMS.length : NEWS_ITEMS.filter((article) => article.category === item).length}</span></button>)}</nav>
        <div className="news-feed-list">{visibleNews.map((item) => <article className="news-feed-item" key={item.id}>
          {item.image ? <button className="news-feed-visual" onClick={() => openArticle(item.id)} aria-label={`阅读${item.title}`}><NewsArtwork item={item} compact /></button> : <div className="news-feed-no-image"><strong>{item.category}</strong><i /></div>}
          <button className="news-feed-copy" onClick={() => openArticle(item.id)}>
            <div className="news-feed-meta"><span>{item.category}</span>{item.demo ? <em>演示案例</em> : null}<time>{item.date}</time><i />{item.readTime}</div>
            <h3>{item.title}</h3><p>{item.summary}</p>
            <span className="news-read-more">阅读全文 <ArrowRight size={15} /></span>
          </button>
        </article>)}</div>
        <nav className="news-pagination" aria-label="资讯分页">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}><CaretLeft size={16} />上一页</button>
          <div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button className={currentPage === page ? "active" : ""} onClick={() => changePage(page)} aria-label={`第${page}页`} key={page}>{page}</button>)}</div>
          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>下一页<CaretRight size={16} /></button>
          <span>共 {filteredNews.length} 条资讯</span>
        </nav>
      </section>
    </div>}
  </div>;
}

function ProductVisual({ product }) {
  const Icon = product.icon;
  return <div className={`product-visual product-accent-${product.accent}`}>
    <div className="product-visual-grid" />
    <div className="product-visual-window">
      <header><div><span /><span /><span /></div><em>{product.name}数据看板</em><i /></header>
      <div className="product-visual-body">
        <div className="product-visual-sidebar"><Icon size={22} weight="duotone" />{[0, 1, 2, 3].map((item) => <i key={item} />)}</div>
        <div className="product-visual-stage">
          <div className="visual-stat-row">{product.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong><i /></div>)}</div>
          <div className="visual-chart"><span /><span /><span /><span /><span /><span /><svg viewBox="0 0 420 90" preserveAspectRatio="none"><path d="M0,74 C42,69 50,44 91,51 C135,59 151,31 198,39 C245,48 258,18 308,26 C350,34 372,8 420,14" /></svg></div>
          <div className="visual-activity"><div><i /><span><strong>智能任务正在执行</strong><small>企业知识与营销策略已同步</small></span><em>进行中</em></div><div><i /><span><strong>新结果已生成</strong><small>可查看详情并进入下一步</small></span><Check size={14} /></div></div>
        </div>
      </div>
    </div>
    <div className="product-asset-pedestal"><div>{product.asset ? <img src={product.asset} alt="" /> : <Robot size={88} weight="duotone" />}</div><span /><span /></div>
    <div className="product-visual-seal"><Sparkle size={17} weight="fill" /><span><strong>智见 AI 驱动</strong></span></div>
  </div>;
}

function ProductIntroPage({ notify, onNavigate }) {
  const [activeProduct, setActiveProduct] = useState("geo");
  const product = PRODUCT_INTROS[activeProduct];
  const Icon = product.icon;

  const primaryAction = () => {
    if (product.opened) {
      const route = { knowledge: "知识库", diagnosis: "AI诊断", geo: "GEO", website: "AI官网" }[activeProduct];
      if (route) onNavigate(route);
      else notify(`${product.name}工作台即将开放`);
    } else notify(`${product.name}开通申请已提交，顾问将尽快与你联系`);
  };

  return <div className="portal-page-scroll product-intro-scroll">
    <div className="product-intro-page">
      <nav className="product-subtabs" aria-label="产品介绍二级导航">{PRODUCT_ORDER.map((key) => {
        const item = PRODUCT_INTROS[key]; const ProductIcon = item.icon;
        return <button className={activeProduct === key ? "active" : ""} onClick={() => setActiveProduct(key)} key={key}><ProductIcon size={17} weight={activeProduct === key ? "fill" : "regular"} /><span>{item.short}</span></button>;
      })}</nav>

      <section className={`product-story product-story-${product.accent}`} key={activeProduct}>
        <div className="product-story-copy">
          <div className="product-story-kicker"><span><Icon size={17} weight="duotone" /></span>{product.eyebrow}<i>{product.opened ? "已开通" : "待开通"}</i></div>
          <h1>{product.headline}</h1>
          <p>{product.lead}</p>
          <div className="product-story-actions"><button onClick={primaryAction}>{product.opened ? "进入产品" : "申请开通"}<ArrowRight size={17} /></button><button onClick={() => notify("已为你预约产品顾问")}>联系顾问 <ArrowSquareOut size={15} /></button></div>
          <div className="product-story-footnote"><ShieldCheck size={15} /><span>统一由 AI 知识库提供企业知识与策略支撑</span></div>
        </div>
        <ProductVisual product={product} />
      </section>

      <section className="product-value-strip">
        {product.metrics.map(([label, value], index) => <div key={label}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
        <div className="value-strip-statement"><Sparkle size={21} weight="duotone" /><p>从策略到执行，<br /><strong>每一步都可观察、可追踪。</strong></p></div>
      </section>

      <section className="product-feature-editorial">
        <div className="section-title-row"><div><h2>{product.name}如何改变工作方式</h2><p>不只提供功能，而是让目标、过程与结果进入同一条可执行的链路。</p></div></div>
        <div className="feature-editorial-list">{product.features.map(([title, description, FeatureIcon], index) => <article className={index % 2 ? "reverse" : ""} key={title}>
          <div className="feature-editorial-copy"><span>0{index + 1}</span><FeatureIcon size={25} weight="duotone" /><h3>{title}</h3><p>{description}</p><button onClick={() => notify(`已展开“${title}”功能说明`)}>了解功能 <ArrowRight size={14} /></button></div>
          <div className="feature-editorial-visual"><div className="feature-mini-toolbar"><i /><span>{title}</span><em>已启用</em></div><div className="feature-mini-grid"><div><span /><span /><span /></div><div><strong>{index === 0 ? "92%" : index === 1 ? "36" : "+28%"}</strong><small>当前核心结果</small><svg viewBox="0 0 220 60" preserveAspectRatio="none"><path d="M0 52 C28 48 35 31 62 36 C91 41 104 18 132 24 C160 30 178 8 220 12" /></svg></div></div></div>
        </article>)}</div>
      </section>

      <section className="product-workflow">
        <div className="workflow-heading"><h2>从企业知识出发，把结果带回增长链路</h2></div>
        <div className="workflow-track">{[["连接", "对齐企业知识与当前业务目标", Database], ["策略", "识别客群、场景与最值得执行的任务", Target], ["执行", `进入 ${product.name} 的标准工作流`, Lightning], ["复盘", "将结果回流到诊断与后续优化", ChartLineUp]].map(([title, text, StepIcon], index) => <div key={title}><span>0{index + 1}</span><StepIcon size={22} weight="duotone" /><strong>{title}</strong><p>{text}</p>{index < 3 ? <ArrowRight size={17} /> : null}</div>)}</div>
      </section>

      <section className="product-final-cta"><div><h2>{product.opened ? `回到 ${product.name}，继续推进当前任务` : `让 ${product.name} 进入你的 AI 营销链路`}</h2><p>从一个明确问题开始，逐步建立可持续运转的增长体系。</p></div><button onClick={primaryAction}>{product.opened ? "进入产品" : "申请开通"}<ArrowRight size={18} /></button></section>
    </div>
  </div>;
}

export function HomePortal({ notify, onNavigate }) {
  const [activeTab, setActiveTab] = useState("news");
  return <section className="home-shell light only-light harbor-home home-portal">
    <header className="secondary-bar home-portal-topbar">
      <nav className="home-primary-tabs" aria-label="首页导航">{HOME_TABS.map((tab) => { const TabIcon = tab.icon; return <button className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)} key={tab.id}><TabIcon size={17} /><span>{tab.label}</span></button>; })}</nav>
      <HeaderActions notify={notify} />
    </header>
    <main className="home-portal-content">
      {activeTab === "news" ? <NewsPage notify={notify} /> : null}
      {activeTab === "products" ? <ProductIntroPage notify={notify} onNavigate={onNavigate} /> : null}
      {activeTab === "matrix" ? <ProductMatrixPage notify={notify} onNavigate={onNavigate} /> : null}
    </main>
  </section>;
}
