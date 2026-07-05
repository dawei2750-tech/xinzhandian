# HB Chain Illuminated Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用统一 SVG 与霓虹发光容器替换全站占位图标。

**Architecture:** `Icon` 提供纯 SVG 图形，`GlowIcon` 提供统一尺寸和主题外观；业务组件只读取 constants 中的图标名称和 tone。Tailwind tokens 管理全部视觉值。

**Tech Stack:** React、TypeScript、Tailwind CSS、Vitest、Testing Library

---

### Task 1: 图标类型与渲染测试

**Files:**
- Create: `src/__tests__/icons.test.tsx`
- Modify: `src/types/finance.ts`, `src/constants/finance.ts`

- [ ] 断言数据引用的所有图标均渲染为带名称的 SVG，并确认测试因组件缺失而失败。
- [ ] 定义 `IconName` 并将所有数据图标改为语义化名称。

Run: `npm.cmd test -- --run src/__tests__/icons.test.tsx`
Expected: first FAIL, then PASS after implementation.

### Task 2: SVG 与发光容器

**Files:**
- Create: `src/components/ui/icon.tsx`, `src/components/ui/glow-icon.tsx`
- Modify: `tailwind.config.ts`

- [ ] 实现导航、市场、功能、币种、优势所需 SVG。
- [ ] 增加图标尺寸、光晕和渐变 tokens。
- [ ] 运行图标测试。

### Task 3: 全站替换占位符

**Files:**
- Modify: `src/components/layout/header.tsx`, `mobile-bottom-nav.tsx`
- Modify: `src/components/finance/platform-stats.tsx`, `feature-cards.tsx`, `benefits-bar.tsx`
- Modify: `src/components/market/popular-coins.tsx`
- Remove: `src/components/ui/tone-icon.tsx`

- [ ] 将全部占位符替换为 `GlowIcon`。
- [ ] 测试页面 SVG 数量、关键 aria-label 和占位符消失。
- [ ] 运行全部测试。

### Task 4: 视觉与构建验收

**Files:**
- Modify only files proven necessary by browser findings.

- [ ] 运行测试、Lint 和生产构建。
- [ ] Chrome 检查 PC/H5 图标亮度、对齐和溢出。
- [ ] 保留最终预览页并更新交接记录。

> 工作区禁止未经用户要求创建提交，因此不执行 Git commit。
