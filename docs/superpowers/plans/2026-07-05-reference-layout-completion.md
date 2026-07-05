# Reference Layout Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐参考图缺失模块并消除桌面两块 Grid 空白。

**Architecture:** PC 使用两个独立纵向列，左列顶部再拆 Hero/Stats；H5 使用 contents/order 复用同一组件。新增内容全部数据驱动。

**Tech Stack:** Next.js、React、TypeScript、Tailwind CSS、Vitest

---

### Task 1: 数据和布局回归测试

**Files:**
- Modify: `src/__tests__/page.test.tsx`, `src/__tests__/finance-data.test.ts`

- [ ] 断言摘要卡和快捷入口各四项。
- [ ] 断言 PC 独立主列/侧列和 H5 区块顺序，确认测试失败。

### Task 2: 新增右侧模块

**Files:**
- Modify: `src/constants/finance.ts`, `src/types/finance.ts`
- Create: `src/components/finance/summary-tiles.tsx`, `quick-actions.tsx`

- [ ] 定义静态数据与组件。
- [ ] 运行对应测试确认通过。

### Task 3: 重构响应式布局

**Files:**
- Modify: `src/app/page.tsx`

- [ ] 实现独立左右列和左列 Hero/Stats 子网格。
- [ ] 使用 contents/order 保持 H5 顺序。

### Task 4: 补齐参考图装饰

**Files:**
- Modify: `src/components/hero/hero-section.tsx`, `eth-visual.tsx`
- Modify: `src/components/finance/savings-rate-table.tsx`

- [ ] 加入 Hero 指示点、底部光环和利率表 SVG 插画。
- [ ] 运行全量测试、Lint、构建和 PC/H5 Chrome 验收。

> 不创建 Git 提交。
