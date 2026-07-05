# Mobile Destination Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real pool, loan and docs destinations to the H5 drawer with honest read-only states and themed illustrations.

**Architecture:** Shared route content lives in constants. A reusable route shell supplies header, ticker, responsive main area and H5 bottom navigation. Each page component owns only its domain layout; the pool tab state is isolated in one client component.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Route contracts

- [ ] Write failing tests for drawer hrefs and each route's headings/states.
- [ ] Run focused tests and confirm failures.
- [ ] Add shared route types and constants.
- [ ] Rerun data tests.

### Task 2: Shared shell and pages

- [ ] Create the reusable secondary-page shell.
- [ ] Implement `/pool` with four local tabs and honest placeholder values.
- [ ] Implement `/loan` with disabled download/upload actions.
- [ ] Implement `/docs` with unconfigured document actions.
- [ ] Add glow illustrations to sparse cards.
- [ ] Rerun focused route tests.

### Task 3: Verification

- [ ] Run all tests, lint and production build.
- [ ] Restart local preview.
- [ ] Click every H5 drawer route in Chrome and verify URL/content/overflow.
