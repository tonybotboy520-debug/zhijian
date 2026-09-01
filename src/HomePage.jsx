import { useEffect, useState } from "react";
import {
  ArrowRight, Bell, Brain, Buildings, CaretDown, Check, Database,
  GlobeHemisphereWest, HouseLine, Megaphone, Pulse, Sparkle, User, UsersThree, X,
} from "@phosphor-icons/react";

const PRODUCT_CATALOG = {
  diagnosis: {
    name: "AI诊断", eyebrow: "持续监测", icon: Pulse,
    building: "/product-buildings/ai-diagnosis-tower-v6.png",
    visualSummary: "AI体检中心",
    cardSummary: "AI体检中心",
    hoverDescription: "持续监控企业在GEO、AIGC、官网、运营中的各类AI问题，并给出评估报告与迭代建议。",
    summary: "持续发现问题，给出下一步建议",
    description: "以轻量方式持续监控企业在 GEO、AIGC、AI 官网与运营链路中的表现，定位问题、判断优先级，并给出可执行的产品建议。",
    capabilities: ["跨产品健康度监测", "机会与问题自动识别", "按优先级输出行动建议"],
    relation: "像港口的观察与控制塔，从全局俯瞰每条获客、承接与转化路径。",
  },
  geo: {
    name: "GEO", eyebrow: "AI 认知入口", icon: GlobeHemisphereWest,
    building: "/product-buildings/geo-lighthouse-v6.png",
    visualSummary: "AI认知灯塔",
    cardSummary: "在 AI 世界中被发现与理解",
    hoverDescription: "提升企业品牌在AI各平台回答中的提及率与排名，抢占用户认知与新流量入口。",
    summary: "在 AI 世界中被发现与理解",
    description: "帮助企业进入豆包、DeepSeek 等 AI 平台的答案与推荐，在用户产生需求和建立品牌认知时被看见、被理解。",
    capabilities: ["AI 平台品牌可见度优化", "高意图问题与关键词策略", "权威内容与信源建设"],
    relation: "像海港外的灯塔，让企业在 AI 世界中成为清晰、可信的目的地。",
  },
  aigc: {
    name: "AIGC", eyebrow: "内容获客", icon: Megaphone,
    building: "/product-buildings/aigc-workshop-v6.png",
    visualSummary: "内容传播工坊",
    cardSummary: "全媒体内容与广告获客",
    hoverDescription: "自动分析市场热点，批量生成爆款内容素材，并自动完成各平台的投放，持续获取公域流量。",
    summary: "全媒体内容与广告获客",
    description: "生成面向真实用户的文章、图片和视频内容，并投放到搜索引擎、社交媒体与第三方媒体，持续扩大触达。",
    capabilities: ["多媒体内容批量生产", "多渠道分发与投放", "围绕客群与场景持续迭代"],
    relation: "像海港中的内容工坊与船坞，持续生产素材，并将内容送往不同媒体。",
  },
  website: {
    name: "AI官网", eyebrow: "承接与转化", icon: HouseLine,
    building: "/product-buildings/ai-website-terminal-v6.png",
    visualSummary: "企业营销阵地",
    cardSummary: "承接流量，理解客户并推动转化",
    hoverDescription: "承接GEO与AIGC流量，官网全站GEO内容优化，与三方媒体发文联动，AI理解访客需求并推动咨询与留资。",
    summary: "承接流量、建立信任、理解需求",
    description: "重塑企业官网：既为 GEO 提供更清晰的品牌与知识表达，也主动理解访客需求，通过内容与对话建立信任。",
    capabilities: ["GEO 友好的官网结构", "访客意图识别与内容匹配", "线索承接与私域导入"],
    relation: "像中央港口大厅，统一承接 GEO 与 AIGC 获得的流量，再交给 AI 运营持续转化。",
  },
  operation: {
    name: "AI运营", eyebrow: "公私域运营", icon: UsersThree,
    building: "/product-buildings/ai-operation-clubhouse-v6.png",
    visualSummary: "客户经营中心",
    cardSummary: "持续培育客户并推动转化",
    hoverDescription: "统一承接公私域客户，各平台账号代运营，持续跟进、培育并促进转化。",
    summary: "持续培育客户并推动转化",
    description: "托管企业在公域和私域中的用户运营，承接广告与官网线索，按用户阶段持续触达、培育和分层。",
    capabilities: ["公私域用户统一承接", "自动化分层与培育", "运营任务持续托管"],
    relation: "像港口后的客户会馆，把一次到访沉淀为可持续经营的客户关系。",
  },
  knowledge: {
    name: "AI知识库", eyebrow: "数据与策略底座", icon: Database,
    building: "/product-buildings/ai-knowledge-vault-v6.png",
    visualSummary: "企业智慧中枢",
    cardSummary: "企业智慧中枢",
    hoverDescription: "沉淀企业知识，生成分客群、场景下的知识图谱，让所有产品共享可信知识底座与营销策略。",
    summary: "让所有产品理解企业、客群与需求",
    description: "沉淀企业上传和提炼的信息，并进一步推演客群、场景、需求、关键词和问题，形成面向营销决策的知识图谱。",
    capabilities: ["企业知识统一沉淀", "客群与需求知识图谱", "前置策略推演与共用数据"],
    relation: "像港口的档案馆和基础设施，为所有产品提供可信知识、统一理解与策略支持。",
  },
};

const DEFAULT_OPENED = ["diagnosis", "geo", "website", "knowledge"];
const VISIBLE_PRODUCT_KEYS = ["diagnosis", "geo", "aigc", "website", "operation", "knowledge"];
const HARBOR_MASTER_SCENERY = "/product-backgrounds/source/harbor-city-islands-master-v11.avif";

const PRIMARY_ROUTES = [
  { id: "geo-website", from: "geo", to: "website", d: "M 315 300 C 390 300 440 345 500 365", duration: 2.8 },
  { id: "aigc-website", from: "aigc", to: "website", d: "M 340 500 C 410 490 450 420 500 385", duration: 3.1 },
  { id: "website-operation", from: "website", to: "operation", d: "M 680 385 C 745 385 800 389 845 392", duration: 2.5 },
  { id: "geo-operation", from: "geo", to: "operation", d: "M 315 280 C 470 185 745 205 885 345", duration: 8.65, trafficGap: 2.7 },
  { id: "aigc-operation", from: "aigc", to: "operation", d: "M 340 510 C 500 545 735 535 885 420", duration: 8.8, trafficGap: 2.7 },
];
const TRAFFIC_PERSON_SPEED_FACTOR = 1.25;

const SUPPORT_ROUTES = [
  { id: "diagnosis-geo", from: "diagnosis", to: "geo", d: "M 545 145 C 430 155 330 210 285 260", duration: 4.4 },
  { id: "diagnosis-website", from: "diagnosis", to: "website", d: "M 610 185 C 610 230 605 280 600 320", duration: 3.7 },
  { id: "diagnosis-operation", from: "diagnosis", to: "operation", d: "M 675 150 C 780 180 865 250 910 330", duration: 4.8 },
  { id: "knowledge-geo", from: "knowledge", to: "geo", d: "M 515 565 C 410 535 325 425 275 335", duration: 5.2 },
  { id: "knowledge-aigc", from: "knowledge", to: "aigc", d: "M 495 610 C 415 600 350 550 320 520", duration: 4.7 },
  { id: "knowledge-website", from: "knowledge", to: "website", d: "M 580 550 C 590 515 605 470 610 425", duration: 4.1 },
  { id: "knowledge-operation", from: "knowledge", to: "operation", d: "M 675 570 C 775 540 850 485 905 430", duration: 5 },
];
const ALL_ROUTES = [...PRIMARY_ROUTES, ...SUPPORT_ROUTES];
const PRIMARY_ROUTE_IDS = new Set(PRIMARY_ROUTES.map((route) => route.id));

const ROUTE_DETAILS = {
  "geo-website": {
    label: "AI认知流量承接", kind: "主要转化", tip: [410, 325],
    description: "将AI平台提及与排名带来的高意向流量导入官网，继续建立信任并推动咨询与留资。",
    input: "AI认知与意向流量", output: "官网访问与咨询",
  },
  "aigc-website": {
    label: "内容与广告流量承接", kind: "主要转化", tip: [425, 455],
    description: "将热点内容与多平台投放带来的公域流量导入官网，由AI理解访客需求并推动咨询与留资。",
    input: "内容与广告流量", output: "官网访问与线索",
  },
  "website-operation": {
    label: "官网线索持续转化", kind: "主要转化", tip: [785, 372], labelAt: [770, 425],
    description: "将官网识别的访客需求、咨询与留资线索交给AI运营，持续跟进、培育并促进转化。",
    input: "访客需求与销售线索", output: "跟进培育与转化",
  },
  "geo-operation": {
    label: "AI意向客户直达", kind: "直接承接", tip: [650, 190],
    description: "将AI平台内直接咨询或下单的意向客户交给AI运营，统一承接并持续跟进转化。",
    input: "AI平台意向客户", output: "客户跟进与转化",
  },
  "aigc-operation": {
    label: "内容互动客户直达", kind: "直接承接", tip: [650, 535],
    description: "将各平台内容与广告产生的互动、私信和留资客户交给AI运营，通过账号代运营持续培育转化。",
    input: "内容互动与留资客户", output: "账号运营与客户转化",
  },
  "diagnosis-geo": {
    label: "GEO评估与迭代建议", kind: "诊断驱动", tip: [405, 175],
    description: "输出企业在AI平台提及率、排名与问题覆盖上的评估结论，形成GEO优化与持续迭代建议。",
    input: "GEO诊断问题", output: "评估报告与迭代建议",
  },
  "diagnosis-website": {
    label: "官网评估与迭代建议", kind: "诊断驱动", tip: [625, 245],
    description: "输出官网全站GEO、媒体内容联动、访客理解与转化链路的评估报告，形成官网迭代建议。",
    input: "官网诊断问题", output: "评估报告与迭代建议",
  },
  "diagnosis-operation": {
    label: "运营评估与迭代建议", kind: "诊断驱动", tip: [810, 225],
    description: "输出公私域承接、账号代运营、客户跟进与培育问题的评估报告，形成运营迭代建议。",
    input: "运营诊断问题", output: "评估报告与迭代建议",
  },
  "knowledge-geo": {
    label: "客群场景与提问策略", kind: "知识支撑", tip: [390, 455],
    description: "从企业知识和分客群、场景知识图谱中输出目标客群、提问意图与可信事实，指导GEO提升提及率与排名。",
    input: "企业知识与客群图谱", output: "客群、场景与提问策略",
  },
  "knowledge-aigc": {
    label: "客群热点与内容策略", kind: "知识支撑", tip: [430, 575],
    description: "输出不同客群在各类场景中的关注热点、搜索词与内容策略，指导爆款素材生成和多平台投放。",
    input: "客群场景知识图谱", output: "热点、关键词与内容策略",
  },
  "knowledge-website": {
    label: "官网知识与客户洞察", kind: "知识支撑", tip: [635, 495],
    description: "向官网提供可信企业知识、客群场景与需求洞察，支撑全站GEO内容、智能交互和线索承接。",
    input: "企业知识与客户图谱", output: "官网内容与交互策略",
  },
  "knowledge-operation": {
    label: "客户画像与运营策略", kind: "知识支撑", tip: [825, 500],
    description: "输出分客群、场景的客户画像、触达话术与运营规则，指导各平台账号代运营和持续培育。",
    input: "客群场景知识图谱", output: "客户画像与运营策略",
  },
};

export function HeaderActions({ notify }) {
  return <div className="home-header-actions">
    <button className="home-icon-button" aria-label="通知" onClick={() => notify("暂无新的通知")}><Bell size={18} /><i /></button>
    <button className="home-account" onClick={() => notify("已打开个人账户菜单")}><span>景</span><strong>张景</strong><CaretDown size={12} /></button>
    <button className="home-team" onClick={() => notify("已打开团队切换器")}><Buildings size={17} />运营团队<CaretDown size={12} /></button>
  </div>;
}

function HarborEnvironment({ hoveredProduct }) {
  const regionProps = (productKey) => ({
    className: `harbor-background-region region-${productKey} ${hoveredProduct === productKey ? "highlighted" : ""}`,
    role: "img",
    "aria-label": `${PRODUCT_CATALOG[productKey].name}背景分区`,
  });

  return <svg className="harbor-environment" viewBox="0 0 1180 700" preserveAspectRatio="none">
    <defs>
      <radialGradient id="harbor-environment-fade" cx="50%" cy="52%" r="63%">
        <stop offset="0" stopColor="white" />
        <stop offset=".7" stopColor="white" stopOpacity=".96" />
        <stop offset=".88" stopColor="white" stopOpacity=".48" />
        <stop offset="1" stopColor="black" />
      </radialGradient>
      <radialGradient id="harbor-water-field" cx="51%" cy="48%" r="58%">
        <stop offset="0" stopColor="#b8eee1" stopOpacity=".58" />
        <stop offset=".48" stopColor="#cdeee7" stopOpacity=".33" />
        <stop offset="1" stopColor="#edf8f4" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="harbor-land-wash" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8fcfa" stopOpacity=".92" />
        <stop offset=".52" stopColor="#d8eee7" stopOpacity=".56" />
        <stop offset="1" stopColor="#bbded3" stopOpacity=".18" />
      </linearGradient>
      <radialGradient id="harbor-hover-glow">
        <stop offset="0" stopColor="#b7f6e4" stopOpacity=".86" />
        <stop offset=".55" stopColor="#8de5cf" stopOpacity=".34" />
        <stop offset="1" stopColor="#c8f2e8" stopOpacity="0" />
      </radialGradient>
      <filter id="harbor-soften" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id="harbor-region-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.72  0 0 0 0 0.56  0 0 0 .46 0" result="glow" />
        <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <mask id="harbor-edge-mask"><rect width="1180" height="700" fill="url(#harbor-environment-fade)" /></mask>
    </defs>

    <g mask="url(#harbor-edge-mask)">
      <ellipse className="harbor-environment-water" cx="598" cy="377" rx="570" ry="318" />
      <path className="harbor-environment-channel broad" d="M 80 330 C 250 270 352 366 497 363 C 655 360 773 286 1100 335" />
      <path className="harbor-environment-channel" d="M 162 554 C 320 455 452 461 590 518 C 727 574 865 541 1040 420" />
      <path className="harbor-environment-channel fine" d="M 226 172 C 378 224 425 263 593 250 C 752 238 870 189 1030 252" />

      <g {...regionProps("diagnosis")}>
        <ellipse className="harbor-region-glow" cx="610" cy="118" rx="195" ry="108" />
        <path className="harbor-region-wash" d="M 435 78 C 483 28 565 26 642 42 C 730 26 802 65 790 132 C 782 191 704 214 622 198 C 552 217 457 190 427 140 C 410 112 417 94 435 78 Z" />
        <path className="harbor-region-land" d="M 474 121 C 527 84 567 100 610 87 C 662 72 732 95 742 135 C 750 168 687 178 631 169 C 570 187 506 170 474 145 C 463 137 465 127 474 121 Z" />
        <path className="harbor-region-contour" d="M 462 138 C 521 102 562 119 610 104 C 672 85 746 117 751 148" />
        <path className="harbor-region-contour secondary" d="M 493 165 C 548 147 583 158 630 143 C 680 127 707 144 727 158" />
        <circle className="harbor-region-scan" cx="610" cy="126" r="54" />
        <circle className="harbor-region-scan delay" cx="610" cy="126" r="86" />
        <path className="harbor-region-hit" d="M 414 47 H 804 V 219 H 414 Z" />
      </g>

      <g {...regionProps("geo")}>
        <ellipse className="harbor-region-glow" cx="145" cy="295" rx="185" ry="142" />
        <path className="harbor-region-wash" d="M 7 204 C 58 155 163 152 230 190 C 298 225 332 293 300 355 C 271 411 179 435 95 399 C 24 369 -11 295 7 204 Z" />
        <path className="harbor-region-land" d="M 35 265 C 72 220 116 208 161 220 C 216 211 270 251 265 302 C 262 345 210 368 163 355 C 114 376 48 344 35 301 C 30 284 29 275 35 265 Z" />
        <path className="harbor-region-contour" d="M 26 318 C 72 273 104 268 149 276 C 199 256 245 281 273 319" />
        <path className="harbor-region-contour secondary" d="M 46 346 C 91 317 120 323 159 325 C 202 315 229 331 248 347" />
        <path className="harbor-coast-dots" d="M 50 238 C 96 189 174 185 231 220" />
        <path className="harbor-region-hit" d="M 0 154 H 330 V 432 H 0 Z" />
      </g>

      <g {...regionProps("aigc")}>
        <ellipse className="harbor-region-glow" cx="176" cy="527" rx="210" ry="148" />
        <path className="harbor-region-wash" d="M 0 430 C 68 380 166 381 237 416 C 320 412 375 471 355 548 C 338 615 255 663 167 650 C 76 674 1 614 -8 539 C -14 493 -12 456 0 430 Z" />
        <path className="harbor-region-land" d="M 25 504 C 74 458 125 463 170 444 C 218 425 294 460 310 506 C 327 554 268 583 213 579 C 165 602 92 584 43 551 C 19 535 14 516 25 504 Z" />
        <path className="harbor-region-contour" d="M 29 542 C 92 502 133 510 183 493 C 237 476 279 500 307 529" />
        <path className="harbor-region-contour secondary" d="M 55 575 C 113 552 159 557 202 540 C 246 527 267 542 286 555" />
        <path className="harbor-dock-line" d="M 72 461 L 72 507 M 104 450 L 104 494 M 136 441 L 136 486" />
        <path className="harbor-region-hit" d="M 0 382 H 386 V 694 H 0 Z" />
      </g>

      <g {...regionProps("website")}>
        <ellipse className="harbor-region-glow" cx="612" cy="388" rx="248" ry="182" />
        <path className="harbor-region-wash" d="M 369 295 C 438 226 526 226 595 247 C 681 212 788 247 834 317 C 884 392 827 483 758 518 C 682 557 565 527 502 505 C 416 506 342 442 347 369 C 349 337 357 310 369 295 Z" />
        <path className="harbor-region-land" d="M 441 366 C 487 306 550 310 606 290 C 673 266 759 312 775 372 C 790 427 733 460 679 457 C 622 486 536 466 486 438 C 447 418 421 392 441 366 Z" />
        <ellipse className="harbor-basin-ring outer" cx="612" cy="392" rx="177" ry="105" />
        <ellipse className="harbor-basin-ring" cx="612" cy="392" rx="138" ry="80" />
        <ellipse className="harbor-basin-ring inner" cx="612" cy="392" rx="102" ry="57" />
        <path className="harbor-region-contour" d="M 414 428 C 485 385 521 394 586 368 C 658 339 741 369 801 414" />
        <path className="harbor-region-hit" d="M 347 224 H 864 V 564 H 347 Z" />
      </g>

      <g {...regionProps("operation")}>
        <ellipse className="harbor-region-glow" cx="990" cy="405" rx="208" ry="167" />
        <path className="harbor-region-wash" d="M 818 285 C 891 239 997 242 1060 282 C 1141 312 1197 385 1172 468 C 1150 540 1063 584 972 558 C 900 577 818 527 790 459 C 766 401 776 327 818 285 Z" />
        <path className="harbor-region-land" d="M 842 375 C 889 326 940 334 989 310 C 1045 282 1122 322 1137 380 C 1151 433 1102 476 1042 469 C 987 500 907 474 867 445 C 831 420 818 399 842 375 Z" />
        <path className="harbor-region-contour" d="M 830 442 C 888 402 927 410 981 386 C 1035 363 1094 382 1135 417" />
        <path className="harbor-region-contour secondary" d="M 858 472 C 918 447 955 454 1005 432 C 1053 413 1087 431 1113 451" />
        <circle className="harbor-courtyard-dot" cx="1090" cy="350" r="8" />
        <circle className="harbor-courtyard-dot" cx="1115" cy="367" r="6" />
        <circle className="harbor-courtyard-dot" cx="1071" cy="371" r="5" />
        <path className="harbor-region-hit" d="M 775 235 H 1180 V 598 H 775 Z" />
      </g>

      <g {...regionProps("knowledge")}>
        <ellipse className="harbor-region-glow" cx="620" cy="620" rx="260" ry="132" />
        <path className="harbor-region-wash" d="M 353 547 C 426 505 522 515 595 535 C 673 509 779 522 847 571 C 890 603 866 661 817 680 C 751 705 670 686 615 680 C 538 705 438 691 381 658 C 333 630 318 574 353 547 Z" />
        <path className="harbor-region-land" d="M 418 596 C 477 561 531 572 588 560 C 653 546 735 563 787 604 C 818 628 788 654 751 657 C 690 674 645 655 607 653 C 548 674 474 657 434 637 C 410 625 398 608 418 596 Z" />
        <path className="harbor-region-contour" d="M 397 638 C 475 604 528 618 589 600 C 656 581 744 603 801 637" />
        <path className="harbor-region-contour secondary" d="M 451 663 C 510 643 553 650 607 635 C 670 619 722 635 760 651" />
        <path className="harbor-archive-grid" d="M 491 586 H 741 M 520 570 V 649 M 567 560 V 658 M 666 559 V 658 M 713 572 V 650" />
        <path className="harbor-region-hit" d="M 328 498 H 884 V 700 H 328 Z" />
      </g>

      <path className="harbor-land-bridge" d="M 260 328 C 357 340 397 364 444 380" />
      <path className="harbor-land-bridge" d="M 307 519 C 393 505 429 476 468 444" />
      <path className="harbor-land-bridge" d="M 760 405 C 831 395 859 393 891 397" />
      <path className="harbor-land-bridge" d="M 623 497 C 623 535 622 552 622 575" />
      <path className="harbor-land-bridge fine" d="M 618 190 C 617 231 616 258 614 294" />
    </g>
  </svg>;
}

function HarborScenery({ hoveredProduct }) {
  const regionShapes = {
    diagnosis: <path d="M 318 -18 H 932 L 884 236 C 802 284 704 278 615 248 C 519 285 401 263 325 215 Z" />,
    geo: <path d="M -35 -18 H 391 L 440 203 C 423 325 349 421 223 458 L -35 409 Z" />,
    aigc: <path d="M -35 362 C 116 330 302 357 443 434 L 489 700 H -35 Z" />,
    website: <path d="M 354 181 C 476 130 693 139 828 238 L 850 490 C 721 579 501 586 344 494 L 309 303 Z" />,
    operation: <path d="M 785 142 H 1215 V 700 H 785 L 746 488 C 833 380 838 263 785 142 Z" />,
    knowledge: <path d="M 363 493 C 494 456 705 457 838 503 L 879 718 H 322 Z" />,
  };

  return <div className="harbor-scenery-layer" aria-label="同一张港湾母图的产品背景分区">
    <svg className="harbor-master-scenery" viewBox="0 0 1180 700" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="harbor-master-edge-fade" cx="50%" cy="49%" r="60%">
          <stop offset="0" stopColor="white" />
          <stop offset=".66" stopColor="white" stopOpacity=".98" />
          <stop offset=".82" stopColor="white" stopOpacity=".5" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
        <mask id="harbor-master-edge-mask">
          <rect width="1180" height="700" fill="url(#harbor-master-edge-fade)" />
        </mask>
        <filter id="harbor-region-feather" x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        {VISIBLE_PRODUCT_KEYS.map((productKey) => <mask id={`harbor-master-mask-${productKey}`} key={`mask-${productKey}`} maskUnits="userSpaceOnUse" x="-80" y="-80" width="1340" height="860">
          <g fill="white" filter="url(#harbor-region-feather)">{regionShapes[productKey]}</g>
        </mask>)}
      </defs>

      <g mask="url(#harbor-master-edge-mask)">
        <image className="harbor-master-base" href={HARBOR_MASTER_SCENERY} width="1180" height="700" preserveAspectRatio="none" />
        {VISIBLE_PRODUCT_KEYS.map((productKey) => <g
          className={`harbor-master-region region-${productKey} ${hoveredProduct === productKey ? "highlighted" : ""}`}
          mask={`url(#harbor-master-mask-${productKey})`}
          key={`region-${productKey}`}
        >
          <image href={HARBOR_MASTER_SCENERY} width="1180" height="700" preserveAspectRatio="none" />
        </g>)}
      </g>
    </svg>
    <span className={`harbor-scenery-focus ${hoveredProduct ? `focus-${hoveredProduct}` : ""}`} aria-hidden="true" />
  </div>;
}

function TypewriterText({ text, active, className = "" }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!active) {
      setVisibleText("");
      return undefined;
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleText(text);
      return undefined;
    }

    let characterIndex = 0;
    setVisibleText("");
    const timer = window.setInterval(() => {
      characterIndex += 1;
      setVisibleText(text.slice(0, characterIndex));
      if (characterIndex >= text.length) window.clearInterval(timer);
    }, 28);

    return () => window.clearInterval(timer);
  }, [active, text]);

  return <span className={`typewriter-text ${className}`} aria-label={text}>
    <span aria-hidden="true">{visibleText}</span>
    {active && visibleText.length < text.length ? <i className="typewriter-caret" aria-hidden="true" /> : null}
  </span>;
}

function RouteHoverCard({ route }) {
  if (!route) return null;
  const detail = ROUTE_DETAILS[route.id];
  const from = PRODUCT_CATALOG[route.from].name;
  const to = PRODUCT_CATALOG[route.to].name;
  const [tipX, tipY] = detail.tip;

  return <aside
    className="route-hover-card"
    style={{ left: `${tipX / 11.8}%`, top: `${tipY / 7}%` }}
    aria-live="polite"
  >
    <header>
      <span>{from}</span><ArrowRight size={13} weight="bold" /><span>{to}</span>
      <em>{detail.kind}</em>
    </header>
    <p><TypewriterText text={detail.description} active /></p>
    <footer>
      <span><small>输入</small>{detail.input}</span>
      <ArrowRight size={12} />
      <span><small>输出</small>{detail.output}</span>
    </footer>
  </aside>;
}

function RouteNameLabels({ hoveredProduct }) {
  return <div className="route-name-labels" aria-hidden="true">
    {ALL_ROUTES.map((route) => {
      const detail = ROUTE_DETAILS[route.id];
      const [tipX, tipY] = detail.labelAt ?? detail.tip;
      const visible = hoveredProduct && (route.from === hoveredProduct || route.to === hoveredProduct);
      return <div
        className={`route-name-label ${PRIMARY_ROUTE_IDS.has(route.id) ? "primary" : "support"} ${visible ? "visible" : ""}`}
        style={{ left: `${tipX / 11.8}%`, top: `${tipY / 7}%` }}
        key={route.id}
      >
        <i />
        <span>{detail.label}</span>
      </div>;
    })}
  </div>;
}

function FlowNetwork({ hoveredProduct, hoveredRoute, onRouteHover }) {
  const renderTrafficPerson = (route, begin, className = "") => <g className={`harbor-traffic-person ${className}`}>
    <g className="harbor-traffic-person-glyph">
      <circle className="harbor-traffic-person-glow" cx="0" cy="0" r="13" />
      <circle className="harbor-traffic-person-badge" cx="0" cy="0" r="9.6" />
      <User className="harbor-traffic-person-icon" x="-5.75" y="-5.75" size={11.5} weight="fill" aria-hidden="true" />
    </g>
    <animateMotion
      dur={`${(route.duration * TRAFFIC_PERSON_SPEED_FACTOR).toFixed(2)}s`}
      begin={`${(begin * TRAFFIC_PERSON_SPEED_FACTOR).toFixed(2)}s`}
      repeatCount="indefinite"
      path={route.d}
    />
  </g>;

  const renderRoute = (route, type, index) => {
    const highlighted = hoveredProduct && (route.from === hoveredProduct || route.to === hoveredProduct);
    const routeHovered = hoveredRoute === route.id;
    const hasStandaloneArrow = type === "primary" && route.id === "website-operation";
    const pathNumbers = route.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    const [endX, endY] = pathNumbers.slice(-2);
    return <g
      className={`harbor-route ${type} ${highlighted ? "highlighted" : ""} ${routeHovered ? "route-hovered" : ""}`}
      key={route.id}
      onMouseEnter={() => onRouteHover(route.id)}
      onMouseLeave={() => onRouteHover(null)}
    >
      {type === "primary" ? <>
        <path className="harbor-route-aura" d={route.d} />
        <path className="harbor-route-halo" d={route.d} />
      </> : null}
      <path className="harbor-route-base" d={route.d} markerEnd={hasStandaloneArrow ? undefined : `url(#harbor-${type}-arrow)`} />
      <path className="harbor-route-flow" d={route.d} pathLength="100" />
      {hasStandaloneArrow ? <>
        <path className="harbor-route-standalone-arrow-glow" d="M 817 376 L 845 392 L 817 408" />
        <path className="harbor-route-standalone-arrow" d="M 817 376 L 845 392 L 817 408" />
      </> : null}
      {type === "primary" ? <>
        {renderTrafficPerson(route, index * -.72)}
        {renderTrafficPerson(route, index * -.72 - (route.trafficGap ?? 1.35), "second")}
      </> : <circle className="harbor-route-particle" r="2.6">
        <animateMotion dur={`${route.duration}s`} begin={`${index * -.72}s`} repeatCount="indefinite" path={route.d} />
      </circle>}
      <circle className="harbor-route-end-hit" cx={endX} cy={endY} r={type === "primary" ? 24 : 18} aria-hidden="true" />
      <path
        className="harbor-route-hit"
        d={route.d}
        tabIndex="0"
        role="img"
        aria-label={`${PRODUCT_CATALOG[route.from].name}到${PRODUCT_CATALOG[route.to].name}：${ROUTE_DETAILS[route.id].description}`}
        onFocus={() => onRouteHover(route.id)}
        onBlur={() => onRouteHover(null)}
      />
    </g>;
  };

  return <svg className="harbor-flow-network" viewBox="0 0 1180 700" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="harbor-primary-route-soft-glow" x="-30%" y="-70%" width="160%" height="240%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id="harbor-primary-route-glow" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="3.4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <marker id="harbor-primary-arrow" viewBox="0 0 30 30" refX="27" refY="15" markerWidth="34" markerHeight="34" orient="auto" markerUnits="userSpaceOnUse" overflow="visible">
        <path d="M 4 3 L 27 15 L 4 27" fill="none" stroke="#f1fffb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
      <marker id="harbor-support-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1 L 10 6 L 1 11" fill="none" stroke="#6eaa98" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
    {SUPPORT_ROUTES.map((route, index) => renderRoute(route, "support", index))}
    {PRIMARY_ROUTES.filter((route) => route.id !== "website-operation").map((route, index) => renderRoute(route, "primary", index))}
    {PRIMARY_ROUTES.filter((route) => route.id === "website-operation").map((route, index) => renderRoute(route, "primary", PRIMARY_ROUTES.length - 1 + index))}
  </svg>;
}

function BuildingNode({ productKey, opened, hovered, onHover, onOpen, onActivate }) {
  const product = PRODUCT_CATALOG[productKey];
  return <article
    className={`building-node node-${productKey} ${opened ? "opened" : "closed"} ${hovered ? "hovered" : ""}`}
  >
    <span className={`building-activation-ring ${opened ? "active" : "inactive"}`} aria-hidden="true"><i /><i /></span>
    <button
      className="building-visual"
      aria-label={`查看${product.name}详情`}
      onClick={() => onOpen(productKey)}
      onFocus={() => onHover(productKey)}
      onBlur={() => onHover(null)}
    >
      {productKey === "geo" ? <svg className="geo-opaque-body-fill" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
        <path d="M420 308 C420 398 417 498 413 585 C410 638 405 686 407 706 C410 734 439 750 501 751 C562 749 593 734 598 706 C598 684 594 637 591 585 C587 498 584 398 582 308 Z" />
        <path d="M316 708 L419 689 L459 708 L459 804 L336 824 L316 808 Z" />
      </svg> : null}
      <img
        src={product.building}
        alt={`${product.name}：${product.visualSummary}`}
        draggable="false"
        onMouseEnter={() => onHover(productKey)}
        onMouseLeave={() => onHover(null)}
      />
    </button>
    {!opened ? <img className="building-lock" src="/product-buildings/product-lock-v2.png" alt="" aria-hidden="true" draggable="false" /> : null}
    <div
      className="building-info-panel"
      onMouseEnter={() => onHover(productKey)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        className="building-info-open"
        onClick={() => onOpen(productKey)}
        onFocus={() => onHover(productKey)}
        onBlur={() => onHover(null)}
        aria-label={`打开${product.name}产品介绍`}
      >
        <span className="building-info-title"><strong>{product.name}</strong><span className={`card-product-status ${opened ? "active" : "inactive"}`}><i />{opened ? "已开通" : "未开通"}</span></span>
        <span className="building-summary">{productKey === "diagnosis" ? product.cardSummary : product.visualSummary}</span>
        <span className="building-hover-detail" aria-hidden={!hovered}>
          <span><em>解决</em><TypewriterText text={product.hoverDescription} active={hovered} /></span>
        </span>
      </button>
      {!opened ? <button className="card-status-action activate" onClick={() => onActivate(productKey)}>开通</button> : null}
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

export function ProductMatrixPage({ notify, onNavigate }) {
  const [openedProducts, setOpenedProducts] = useState(() => new Set(DEFAULT_OPENED));
  const [detailProduct, setDetailProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredRoute, setHoveredRoute] = useState(null);

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

  return <>
    <div className="home-scroll portal-page-scroll matrix-page-scroll">
      <div className="home-hero harbor-hero">
        <h1>让AI营销产品矩阵协同运转，驱动完整增长链路</h1>
        <p>以企业知识库为统一底座，由AI诊断发现增长机会，协同GEO、AIGC、AI官网与AI运营，推动企业从品牌认知走向持续转化</p>
      </div>

      <div className={`harbor-map ${hoveredProduct ? "has-hover" : ""} ${hoveredRoute ? "has-route-hover" : ""}`} aria-label="智见 AI 营销海港产品地图">
        <HarborScenery hoveredProduct={hoveredProduct} />
        <FlowNetwork hoveredProduct={hoveredProduct} hoveredRoute={hoveredRoute} onRouteHover={setHoveredRoute} />
        <RouteNameLabels hoveredProduct={hoveredProduct} />
        <RouteHoverCard route={hoveredRoute ? ALL_ROUTES.find((route) => route.id === hoveredRoute) : null} />
        {VISIBLE_PRODUCT_KEYS.map((productKey) => <BuildingNode
          key={productKey}
          productKey={productKey}
          opened={openedProducts.has(productKey)}
          hovered={hoveredProduct === productKey}
          onHover={setHoveredProduct}
          onOpen={setDetailProduct}
          onActivate={activate}
        />)}
      </div>
    </div>
    <DetailDrawer productKey={detailProduct} opened={detailProduct ? openedProducts.has(detailProduct) : false} onClose={() => setDetailProduct(null)} onActivate={activate} />
  </>;
}
