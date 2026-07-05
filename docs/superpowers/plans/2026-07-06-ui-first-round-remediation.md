# UI First-Round Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver separate desktop and mobile homepage layouts with the requested removals, copy changes, rate-table simplification, and ticker endorsements.

**Architecture:** `page.tsx` renders two breakpoint-controlled layout shells. The shells share content components and `finance.ts` constants, while each owns ordering and spacing. Behavioral and structural requirements are locked by Vitest/Testing Library before production edits.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock revised content and data contracts

**Files:**
- Modify: `src/__tests__/finance-data.test.ts`
- Modify: `src/types/finance.ts`
- Modify: `src/constants/finance.ts`

- [ ] Write failing assertions for `Blockchain Savings`, `ReceiveVoucher`, five endorsement ticker items, three remaining feature cards, and rate objects without `annualRate`.
- [ ] Run `npm test -- src/__tests__/finance-data.test.ts` and verify failures describe the old content/data shape.
- [ ] Remove unused statistics constants/types, remove `annualRate`, update shared copy/data, and keep invite behavior unchanged.
- [ ] Rerun the focused test and verify it passes.

### Task 2: Lock and build separate PC/H5 composition

**Files:**
- Modify: `src/__tests__/page.test.tsx`
- Create: `src/components/home/desktop-home-page.tsx`
- Create: `src/components/home/mobile-home-page.tsx`
- Create: `src/components/home/reserved-stats-slot.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/finance/feature-cards.tsx`
- Modify: `src/components/finance/savings-rate-table.tsx`
- Modify: `src/components/layout/mobile-bottom-nav.tsx`

- [ ] Write failing DOM assertions for desktop/mobile shells, removed modules/content, rate-table order, two-column rate rows, reserved stats slot, and mobile-nav ownership.
- [ ] Run `npm test -- src/__tests__/page.test.tsx` and verify it fails against the old single-layout page.
- [ ] Add the two layout shells and shared reserved slot, simplify table rendering, and make the mobile nav owned only by the mobile shell.
- [ ] Rerun the focused test and verify it passes.

### Task 3: Implement continuous ticker and responsive polish

**Files:**
- Modify: `src/__tests__/page.test.tsx`
- Modify: `src/components/layout/market-ticker.tsx`
- Modify: `src/app/globals.css`

- [ ] Add failing assertions for duplicated ticker tracks and animation semantics.
- [ ] Run the page test and verify the ticker assertion fails.
- [ ] Render two aria-safe ticker copies, add continuous animation with reduced-motion handling, and preserve horizontal containment.
- [ ] Rerun page tests and verify they pass.

### Task 4: Full automated verification

**Files:**
- Modify only if a verification failure identifies an in-scope defect.

- [ ] Run `npm test` and require all tests to pass.
- [ ] Run `npm run lint` and require zero errors.
- [ ] Run `npm run build` and require a successful production build.
- [ ] Search source output for forbidden annual-rate and deleted-stat copy and verify no rendered source remains.

### Task 5: Browser verification

**Files:**
- Modify only if browser evidence identifies an in-scope responsive defect.

- [ ] Start the local production or development server.
- [ ] Verify PC at 1280px, 1440px, and 1600px: desktop shell visible, mobile shell/nav hidden, rates left flexible/right fixed, reserved slot retained.
- [ ] Verify representative iPhone and Android widths: mobile shell/nav visible, desktop shell hidden, rates stacked flexible then fixed, no horizontal page overflow.
- [ ] Verify title, wallet copy, deleted sections, two-column rates, and scrolling endorsements visually on both layouts.
