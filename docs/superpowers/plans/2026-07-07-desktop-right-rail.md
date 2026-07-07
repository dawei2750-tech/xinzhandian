# Desktop Right Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the desktop lower-right gap without changing responsive sizing or mobile behavior.

**Architecture:** Stretch the existing desktop sidebar to the left column height and let the final savings panel consume remaining space. Keep all changes isolated to the desktop sidebar and `SavingsSnapshot`.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock the layout contract

**Files:**
- Modify: `src/__tests__/page.test.tsx`
- Test: `src/__tests__/page.test.tsx`

- [ ] Add an assertion that `desktop-sidebar` uses `flex`, `flex-col`, and `gap-3`, and that `savings-snapshot` uses `flex-1`.
- [ ] Run `npm.cmd test -- src/__tests__/page.test.tsx` and confirm the new assertion fails on the missing classes.

### Task 2: Stretch the right rail

**Files:**
- Modify: `src/components/home/desktop-home-page.tsx`
- Modify: `src/components/finance/savings-snapshot.tsx`

- [ ] Replace the sidebar spacing utility with a vertical flex layout while retaining `col-span-3`.
- [ ] Add `flex-1` and a vertical content layout to `SavingsSnapshot`.
- [ ] Add compact plan-flow and protection content inside the existing panel; do not add a new route or interaction.
- [ ] Run the focused test and confirm it passes.

### Task 3: Verify both responsive targets

**Files:**
- Modify: `DAILY_HANDOFF.md` only after verification

- [ ] Run `npm.cmd test -- --run`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Inspect PC at 1536x1100 and H5 at 540x1100, checking overflow, right-rail alignment, and header/menu clicks.
- [ ] Record exact results and remaining limitations in the workspace handoff.

No commit or deployment is included because neither is authorized.
