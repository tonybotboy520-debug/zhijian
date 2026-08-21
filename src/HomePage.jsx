import { useMemo, useState } from "react";
import {
  ArrowRight, Bell, Brain, Buildings, CaretDown, Check, Database,
  GlobeHemisphereWest, HouseLine, Megaphone, Pulse, Sparkle, UsersThree, X,
} from "@phosphor-icons/react";

const PRODUCT_CATALOG = {
  diagnosis: {
    name: "AI诊断", eyebrow: "持续监测", icon: Pulse,
    building: "/product-buildings/ai-diagnosis-tower.png",
    visualSummary: "港口观察塔",
    summary: "持续发现问题，给出下一步建议",
    description: "以轻量方式持续监控企业在 GEO、AIGC、AI 官网与运营链路中的表现，定位问题、判断优先级，并给出可执行的产品建议。",
    capabilities: ["跨产品健康度监测", "机会与问题自动识别", "按优先级输出行动建议"],
    relation: "像港口的观察与控制塔，从全局俯瞰每条获客、承接与转化路径。",
  },
  geo: {
    name: "GEO", eyebrow: "AI 认知入口", icon: GlobeHemisphereWest,
    building: "/product-buildings/geo-lighthouse.png",
    visualSummary: "AI认知灯塔",
    summary: "在 AI 世界中被发现与理解",
    description: "帮助企业进入豆包、DeepSeek 等 AI 平台的答案与推荐，在用户产生需求和建立品牌认知时被看见、被理解。",
    capabilities: ["AI 平台品牌可见度优化", "高意图问题与关键词策略", "权威内容与信源建设"],
    relation: "像海港外的灯塔，让企业在 AI 世界中成为清晰、可信的目的地。",
  },
  aigc: {
    name: "AIGC", eyebrow: "内容获客", icon: Megaphone,
    building: "/product-buildings/aigc-workshop.png",
    visualSummary: "内容传播工坊",
    summary: "全媒体内容与广告获客",
    description: "生成面向真实用户的文章、图片和视频内容，并投放到搜索引擎、社交媒体与第三方媒体，持续扩大触达。",
    capabilities: ["多媒体内容批量生产", "多渠道分发与投放", "围绕客群与场景持续迭代"],
    relation: "像海港中的内容工坊与船坞，持续生产素材，并将内容送往不同媒体。",
  },
  website: {
    name: "AI官网", eyebrow: "承接与转化", icon: HouseLine,
    building: "/product-buildings/ai-website-terminal.png",
    visualSummary: "客户抵达港",
    summary: "承接流量、建立信任、理解需求",
    description: "重塑企业官网：既为 GEO 提供更清晰的品牌与知识表达，也主动理解访客需求，通过内容与对话建立信任。",
    capabilities: ["GEO 友好的官网结构", "访客意图识别与内容匹配", "线索承接与私域导入"],
    relation: "像中央港口大厅，统一承接 GEO 与 AIGC 获得的流量，再交给 AI 运营持续转化。",
  },
  operation: {
    name: "AI运营", eyebrow: "公私域运营", icon: UsersThree,
    building: "/product-buildings/ai-operation-clubhouse.png",
    visualSummary: "客户经营会馆",
    summary: "持续培育客户并推动转化",
    description: "托管企业在公域和私域中的用户运营，承接广告与官网线索，按用户阶段持续触达、培育和分层。",
    capabilities: ["公私域用户统一承接", "自动化分层与培育", "运营任务持续托管"],
    relation: "像港口后的客户会馆，把一次到访沉淀为可持续经营的客户关系。",
  },
  knowledge: {
    name: "AI知识库", eyebrow: "数据与策略底座", icon: Database,
    building: "/product-buildings/ai-knowledge-vault.png",
    visualSummary: "企业知识与策略底座",
    summary: "让所有产品理解企业、客群与需求",
    description: "沉淀企业上传和提炼的信息，并进一步推演客群、场景、需求、关键词和问题，形成面向营销决策的知识图谱。",
    capabilities: ["企业知识统一沉淀", "客群与需求知识图谱", "前置策略推演与共用数据"],
    relation: "像港口的档案馆和基础设施，为所有产品提供可信知识、统一理解与策略支持。",
  },
};

const DEFAULT_OPENED = ["diagnosis", "geo", "website", "knowledge"];
const VISIBLE_PRODUCT_KEYS = ["diagnosis", "geo", "aigc", "website", "operation", "knowledge"];

const PRIMARY_ROUTES = [
  { id: "geo-website", from: "geo", to: "website", d: "M 286 307 C 380 307 430 355 500 382", duration: 2.8 },
  { id: "aigc-website", from: "aigc", to: "website", d: "M 315 520 C 402 518 448 472 505 436", duration: 3.1 },
  { id: "website-operation", from: "website", to: "operation", d: "M 716 414 C 784 414 826 426 886 430", duration: 2.5 },
];

const SUPPORT_ROUTES = [
  { id: "diagnosis-geo", from: "diagnosis", to: "geo", d: "M 545 171 C 456 186 352 220 268 260", duration: 4.4 },
  { id: "diagnosis-website", from: "diagnosis", to: "website", d: "M 611 184 C 611 224 611 260 611 295", duration: 3.7 },
  { id: "diagnosis-operation", from: "diagnosis", to: "operation", d: "M 684 174 C 775 198 850 264 918 342", duration: 4.8 },
  { id: "knowledge-geo", from: "knowledge", to: "geo", d: "M 535 613 C 432 584 346 469 278 372", duration: 5.2 },
  { id: "knowledge-aigc", from: "knowledge", to: "aigc", d: "M 536 642 C 450 625 370 582 312 548", duration: 4.7 },
  { id: "knowledge-website", from: "knowledge", to: "website", d: "M 621 593 C 621 558 621 524 621 492", duration: 4.1 },
  { id: "knowledge-operation", from: "knowledge", to: "operation", d: "M 716 620 C 804 590 864 528 918 490", duration: 5 },
];

function HeaderActions({ notify }) {
  return <div className="home-header-actions">
    <button className="home-icon-button" aria-label="通知" onClick={() => notify("暂无新的通知")}><Bell size={18} /><i /></button>
    <button className="home-account" onClick={() => notify("已打开个人账户菜单")}><span>ZJ</span><strong>张景</strong><CaretDown size={12} /></button>
    <button className="home-team" onClick={() => notify("已打开团队切换器")}><Buildings size={17} />运营团队<CaretDown size={12} /></button>
  </div>;
}

function FlowNetwork({ hoveredProduct }) {
  const renderRoute = (route, type, index) => {
    const highlighted = hoveredProduct && (route.from === hoveredProduct || route.to === hoveredProduct);
    return <g className={`harbor-route ${type} ${highlighted ? "highlighted" : ""}`} key={route.id}>
      <path className="harbor-route-base" d={route.d} markerEnd={`url(#harbor-${type}-arrow)`} />
      <path className="harbor-route-flow" d={route.d} pathLength="100" />
      <circle className="harbor-route-particle" r={type === "primary" ? 4 : 2.6}>
        <animateMotion dur={`${route.duration}s`} begin={`${index * -.72}s`} repeatCount="indefinite" path={route.d} />
      </circle>
      {type === "primary" ? <circle className="harbor-route-particle second" r="3">
        <animateMotion dur={`${route.duration}s`} begin={`${index * -.72 - 1.35}s`} repeatCount="indefinite" path={route.d} />
      </circle> : null}
    </g>;
  };

  return <svg className="harbor-flow-network" viewBox="0 0 1180 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <marker id="harbor-primary-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 1 1 L 10 6 L 1 11" fill="none" stroke="#158f72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
      <marker id="harbor-support-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 1 1 L 10 6 L 1 11" fill="none" stroke="#82ad9f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
    {SUPPORT_ROUTES.map((route, index) => renderRoute(route, "support", index))}
    {PRIMARY_ROUTES.map((route, index) => renderRoute(route, "primary", index))}
  </svg>;
}

function BuildingNode({ productKey, opened, hovered, onHover, onOpen, onActivate }) {
  const product = PRODUCT_CATALOG[productKey];
  return <article
    className={`building-node node-${productKey} ${opened ? "opened" : "closed"} ${hovered ? "hovered" : ""}`}
    onMouseEnter={() => onHover(productKey)}
    onMouseLeave={() => onHover(null)}
    onFocus={() => onHover(productKey)}
    onBlur={() => onHover(null)}
  >
    <button className="building-visual" aria-label={`查看${product.name}详情`} onClick={() => onOpen(productKey)}>
      <span className="building-local-ambient" />
      <span className="building-ripple first" /><span className="building-ripple second" />
      <img src={product.building} alt={`${product.name}：${product.visualSummary}`} draggable="false" />
      <span className="building-spark spark-one" /><span className="building-spark spark-two" /><span className="building-spark spark-three" />
    </button>
    <div className="building-label">
      <div className="building-label-title"><h3>{product.name}</h3>{opened ? <span className="open-state"><i />已开通</span> : null}</div>
      <p>{product.visualSummary}</p>
      {opened
        ? <button className="building-detail-button" onClick={() => onOpen(productKey)}>查看详情 <ArrowRight size={11} /></button>
        : <button className="open-product-button" onClick={() => onActivate(productKey)}>开通</button>}
    </div>
  </article>;
}

function DetailDrawer({ productKey, opened, onClose, onActivate }) {
  if (!productKey) return null;
  const product = PRODUCT_CATALOG[productKey];
  const Icon = product.icon;
  return <div className="product-drawer-backdrop" onMouseDown={onClose}>
    <aside className="product-detail-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={`${product.name}产品详情`}>
      <header>
        <div className="drawer-product-icon"><Icon size={33} weight="duotone" /></div>
        <div><span>{product.eyebrow}</span><h2>{product.name}</h2></div>
        <button onClick={onClose} aria-label="关闭详情"><X size={19} /></button>
      </header>
      <div className="product-drawer-body">
        <section className="drawer-building-preview"><img src={product.building} alt="" /><div><strong>{product.visualSummary}</strong><p>{product.summary}</p></div></section>
        <section className="drawer-lead"><span>{opened ? "已开通" : "待开通"}</span><p>{product.description}</p></section>
        <section><h3>核心能力</h3><div className="capability-list">{product.capabilities.map((item) => <div key={item}><Check size={14} weight="bold" /><span>{item}</span></div>)}</div></section>
        <section><h3>在全链路中的角色</h3><p>{product.relation}</p></section>
        <section className="knowledge-note"><Brain size={20} weight="duotone" /><div><strong>统一知识驱动</strong><p>能力由 AI 知识库中的企业知识与策略图谱持续支持。</p></div></section>
      </div>
      <footer>{opened ? <button onClick={() => onActivate(productKey, true)}>进入产品 <ArrowRight size={16} /></button> : <button onClick={() => onActivate(productKey)}>立即开通 <Sparkle size={15} weight="fill" /></button>}</footer>
    </aside>
  </div>;
}

export function HomePage({ notify, onNavigate }) {
  const [openedProducts, setOpenedProducts] = useState(() => new Set(DEFAULT_OPENED));
  const [detailProduct, setDetailProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const openedCount = openedProducts.size;
  const progress = useMemo(() => Math.round(openedCount / VISIBLE_PRODUCT_KEYS.length * 100), [openedCount]);

  const activate = (productKey, enter = false) => {
    if (enter) {
      setDetailProduct(null);
      if (productKey === "geo") onNavigate("GEO");
      else notify(`${PRODUCT_CATALOG[productKey].name}工作台即将开放`);
      return;
    }
    setOpenedProducts((current) => new Set([...current, productKey]));
    notify(`${PRODUCT_CATALOG[productKey].name} 已开通，建筑节点正在启用`);
  };

  return <section className="home-shell light only-light harbor-home">
    <header className="home-topbar"><div className="home-crumb"><Sparkle size={15} weight="fill" />AI 营销全景</div><HeaderActions notify={notify} /></header>
    <div className="home-scroll">
      <div className="home-hero harbor-hero">
        <h1>从全域触达，到持续转化</h1>
        <p>连接 AI 认知、内容获客、官网承接与公私域长期运营</p>
        <button onClick={() => setDetailProduct("diagnosis")}><Pulse size={20} weight="duotone" />开始 AI 诊断</button>
      </div>

      <div className={`harbor-map ${hoveredProduct ? "has-hover" : ""}`} aria-label="智见 AI 营销海港产品地图">
        <div className="harbor-map-summary"><span><i />{openedCount}/{VISIBLE_PRODUCT_KEYS.length} 个产品已激活</span><strong>{progress}%</strong></div>
        <FlowNetwork hoveredProduct={hoveredProduct} />
        {VISIBLE_PRODUCT_KEYS.map((productKey) => <BuildingNode
          key={productKey}
          productKey={productKey}
          opened={openedProducts.has(productKey)}
          hovered={hoveredProduct === productKey}
          onHover={setHoveredProduct}
          onOpen={setDetailProduct}
          onActivate={activate}
        />)}
        <div className="harbor-route-caption caption-geo">AI 认知获客</div>
        <div className="harbor-route-caption caption-aigc">内容与广告获客</div>
        <div className="harbor-route-caption caption-operation">流量承接后转化</div>
        <div className="harbor-map-legend"><span><i className="main" />主要转化路径</span><span><i className="support" />知识与诊断支持</span></div>
      </div>
    </div>
    <DetailDrawer productKey={detailProduct} opened={detailProduct ? openedProducts.has(detailProduct) : false} onClose={() => setDetailProduct(null)} onActivate={activate} />
  </section>;
}
