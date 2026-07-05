# Mobile Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the mobile drawer, styled banner carousel and complete 1–11 advantages accordion to the existing split desktop/mobile homepage.

**Architecture:** Shared constants define all new content. Focused components own drawer state, carousel rendering and accordion state; desktop and mobile shells only place them. Code-native visuals preserve the HB Chain theme and avoid external image dependencies.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Shared content contracts

- [ ] Add failing tests for five drawer items, three banners and eleven FAQ entries with non-empty bodies.
- [ ] Run the focused data test and confirm it fails.
- [ ] Add types and constants, including the recovered FAQ content.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Mobile drawer

- [ ] Add failing interaction tests for mobile drawer open and close behavior.
- [ ] Implement an H5-only drawer trigger, overlay, navigation cards and language control.
- [ ] Verify the focused component/page tests pass.

### Task 3: Banner carousel and advantages accordion

- [ ] Add failing tests for three themed slides and 1–11 expandable bodies.
- [ ] Implement code-native banner art and accessible carousel structure.
- [ ] Implement a single-open advantages accordion.
- [ ] Place the accordion in the desktop reserved region and H5 after savings tables.
- [ ] Verify focused tests pass.

### Task 4: Automated and browser verification

- [ ] Run the full test suite, lint, build and source scans.
- [ ] Reload the local production server.
- [ ] Verify 542×806 H5 layout and interactions in Chrome.
- [ ] Record any remaining visual uncertainty without claiming it complete.
