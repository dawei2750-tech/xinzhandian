# HB Chain Finance Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建与参考图一致的 HB Chain 静态理财首页，并兼容 1280px、1440px 与移动端。

**Architecture:** 使用 Next.js App Router 组织单页应用；展示数据集中在 constants，组件按页面区域拆分；CSS design tokens 统一控制视觉变量，Tailwind 负责布局与响应式。Vitest 与 Testing Library 验证静态内容和组件结构，浏览器验证最终视口表现。

**Tech Stack:** Next.js、React、TypeScript、Tailwind CSS、Vitest、Testing Library

---

### Task 1: 建立项目与测试基线

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `src/__tests__/page.test.tsx`

- [ ] 创建 Next.js、Tailwind、Vitest 和 Testing Library 配置。
- [ ] 编写首页关键区域存在的测试并运行，确认因页面组件缺失而失败。

Run: `npm test -- --run`
Expected: FAIL，提示无法导入首页或找不到关键文案。

### Task 2: 定义数据模型和静态常量

**Files:**
- Create: `src/types/finance.ts`
- Create: `src/constants/finance.ts`
- Test: `src/__tests__/finance-data.test.ts`

- [ ] 先编写数据数量、利率边界和导航内容测试。
- [ ] 运行测试并确认常量模块缺失导致失败。
- [ ] 定义强类型数据并录入用户提供的全部静态内容。
- [ ] 运行测试确认通过。

Run: `npm test -- --run src/__tests__/finance-data.test.ts`
Expected: PASS，所有静态数据断言通过。

### Task 3: 建立 design tokens 与页面骨架

**Files:**
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/components/layout/header.tsx`, `market-ticker.tsx`, `mobile-bottom-nav.tsx`
- Test: `src/__tests__/page.test.tsx`

- [ ] 在页面测试中加入导航、市场横条和移动底栏断言，确认失败。
- [ ] 在 `globals.css` 定义颜色、边框、阴影、圆角、渐变和间距 tokens。
- [ ] 实现根布局、页面骨架和三个导航组件。
- [ ] 运行测试确认通过。

### Task 4: 实现 Hero、平台指标和功能卡

**Files:**
- Create: `src/components/hero/hero-section.tsx`, `eth-visual.tsx`
- Create: `src/components/finance/platform-stats.tsx`, `feature-cards.tsx`
- Test: `src/__tests__/page.test.tsx`

- [ ] 添加 Hero 标题、按钮、四项平台指标和四张功能卡测试，确认失败。
- [ ] 使用 CSS/SVG 实现 ETH、轨道与币种装饰。
- [ ] 从 constants 渲染平台指标和功能卡。
- [ ] 运行测试确认通过。

### Task 5: 实现行情与利率表

**Files:**
- Create: `src/components/market/popular-coins.tsx`, `trend-sparkline.tsx`
- Create: `src/components/finance/savings-rate-table.tsx`
- Test: `src/__tests__/page.test.tsx`

- [ ] 添加六个币种、两张表标题和首尾利率档位测试，确认失败。
- [ ] 实现静态 SVG 趋势折线与热门币种列表。
- [ ] 实现可复用、容器内横向滚动的利率表。
- [ ] 运行测试确认通过。

### Task 6: 实现优势栏与响应式布局

**Files:**
- Create: `src/components/finance/benefits-bar.tsx`
- Modify: `src/app/page.tsx`, `src/app/globals.css`
- Test: `src/__tests__/page.test.tsx`

- [ ] 添加四项优势文案测试，确认失败。
- [ ] 实现优势栏，并完成 PC 75%/25%、H5 单列和固定底栏规则。
- [ ] 增加页面级防溢出规则，运行全部测试。

### Task 7: 质量与视觉验证

**Files:**
- Modify only files proven necessary by verification findings.

- [ ] 运行 `npm test -- --run`，要求 0 失败。
- [ ] 运行 `npm run lint`，要求 0 错误。
- [ ] 运行 `npm run build`，要求退出码 0。
- [ ] 启动 `npm run dev`，在 1440px、1280px 和移动视口检查页面。
- [ ] 验证 `document.documentElement.scrollWidth <= window.innerWidth`。
- [ ] 根据截图修正视觉偏差后，重新运行测试、Lint 和构建。

### Task 8: 项目交接

**Files:**
- Create: `README.md`
- Modify: workspace handoff files required by `AGENTS.md`.

- [ ] 记录安装、开发、测试和构建命令。
- [ ] 列出主要文件结构与静态范围限制。
- [ ] 更新工作区交接，记录验证结果和下一步。

> 工作区明确禁止未经用户要求创建提交，因此本计划不执行 Git commit 步骤。
