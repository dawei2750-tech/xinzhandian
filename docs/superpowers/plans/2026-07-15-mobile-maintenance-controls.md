# Mobile Maintenance Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add private GitHub Actions entries that let the owner safely enable or restore maintenance mode for both HB production sites from Android or iPhone.

**Architecture:** Two `workflow_dispatch` workflows call one dependency-free Node.js controller. The controller operates on two checked-out private repositories, recognizes their state from immutable maintenance assets, prepares ordinary commits, verifies exact path scope and unchanged remote heads, pushes sequentially, and polls stable Vercel URLs.

**Tech Stack:** GitHub Actions, Node.js ESM and `node:test`, Git CLI, Vercel-hosted Next.js sites.

## Global Constraints

- Never modify or clean the original dirty checkout at `C:\Users\Administrator\heibai-workspace\projects\hb-chain-finance`.
- Never use force push, reset, clean, history rewriting, or credential-bearing remote URLs.
- `HB_MAINTENANCE_PAT` is a GitHub Secret and must never be committed, echoed, or written to `WORK_RECORD.md`.
- The token may grant Contents read/write only to `hei905595-byte/web3-finance-dashboard` and `hei905595-byte/wb3-chain-finance-admin`.
- Only `vercel.json` and `public/maintenance.html` may change in a toggle commit.
- Both workflows share one concurrency group and default to read-only workflow permissions.
- No production maintenance or restore action is triggered during local implementation verification.

---

### Task 1: Portable state and safety core

**Files:**
- Create: `scripts/maintenance-remote.test.mjs`
- Create: `scripts/maintenance-remote.mjs`
- Create: `.github/maintenance-assets/vercel.json`
- Create: `.github/maintenance-assets/maintenance.html`

**Interfaces:**
- Produces: `classifyState({ configMatches, pageMatches, maintenanceCommit }) -> 'online' | 'maintenance' | 'unknown'`
- Produces: `assertActionAllowed(mode, states) -> 'proceed' | 'noop'`, throwing on mixed/unknown/unsafe states.
- Produces: `assertChangedPaths(paths)`, accepting exactly `vercel.json` and `public/maintenance.html`.
- Produces: `findMaintenanceCommit(repository, assetBytes, git) -> commit | null`.

- [ ] **Step 1: Write failing unit tests**

Create `scripts/maintenance-remote.test.mjs` with `node:test` cases covering online, maintenance, partial-template unknown state, mixed states, idempotent no-op, exact changed-path scope, and maintenance marker discovery through an injected Git runner.

- [ ] **Step 2: Verify RED**

Run: `node --test scripts/maintenance-remote.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/maintenance-remote.mjs`.

- [ ] **Step 3: Implement the minimal pure core**

Create `scripts/maintenance-remote.mjs` exporting the four interfaces above. Use `spawnSync` with argument arrays, compare file bytes rather than terminal text, and keep side effects behind the CLI entry point.

- [ ] **Step 4: Add immutable maintenance assets**

Copy the approved local templates from `C:\Users\Administrator\Desktop\HB\maintenance-toggle\vercel.json` and `maintenance.html` into `.github/maintenance-assets/`, preserving UTF-8 bytes.

- [ ] **Step 5: Verify GREEN**

Run: `node --test scripts/maintenance-remote.test.mjs`

Expected: all Task 1 tests PASS with zero failures.

- [ ] **Step 6: Commit**

Run:

```powershell
git add scripts/maintenance-remote.mjs scripts/maintenance-remote.test.mjs .github/maintenance-assets
git commit -m "feat: add portable maintenance controller core"
```

### Task 2: Safe repository mutation and deployment verification

**Files:**
- Modify: `scripts/maintenance-remote.test.mjs`
- Modify: `scripts/maintenance-remote.mjs`

**Interfaces:**
- Produces CLI: `node scripts/maintenance-remote.mjs --mode <enable|restore|status> --main-dir <path> --admin-dir <path> [--preflight-only]`.
- Produces workflow summary at the path in `GITHUB_STEP_SUMMARY` when present.

- [ ] **Step 1: Add failing integration tests**

Use temporary local Git repositories with bare remotes to prove: enable prepares only the two approved files; restore creates a normal revert of the marker commit; changed remote head stops before push; re-running the satisfied state is a no-op; and a simulated second push failure reports the first repository as already updated.

- [ ] **Step 2: Verify RED**

Run: `node --test scripts/maintenance-remote.test.mjs`

Expected: new CLI/integration cases FAIL because orchestration is not implemented.

- [ ] **Step 3: Implement repository orchestration**

Implement argument parsing, fixed target metadata, fetch/state inspection, commit preparation, remote-head recheck, sequential normal push, remote verification, cleanup, and secret-free summary writing. Configure commit identity as `github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>`.

- [ ] **Step 4: Implement deployment polling**

Use built-in `fetch` with a 20-second request timeout. Poll every ten seconds for at most sixty attempts. Enable requires HTTP 200 plus approved maintenance copy; restore requires HTTP 200, absence of that copy, and response length over 200 bytes.

- [ ] **Step 5: Verify GREEN and preflight**

Run:

```powershell
node --test scripts/maintenance-remote.test.mjs
node scripts/maintenance-remote.mjs --mode status --main-dir C:\Users\Administrator\Desktop\HB\_maintenance-worktrees\web3-finance-dashboard --admin-dir C:\Users\Administrator\Desktop\HB\_maintenance-worktrees\wb3-chain-finance-admin --preflight-only
```

Expected: all tests PASS; preflight reports two recognized matching states and states that no push occurred.

- [ ] **Step 6: Commit**

Run:

```powershell
git add scripts/maintenance-remote.mjs scripts/maintenance-remote.test.mjs
git commit -m "feat: automate safe dual-site maintenance switching"
```

### Task 3: Mobile GitHub Actions entry points

**Files:**
- Create: `.github/workflows/enable-maintenance.yml`
- Create: `.github/workflows/restore-site.yml`
- Create: `scripts/maintenance-workflows.test.mjs`
- Modify: `WORK_RECORD.md`

**Interfaces:**
- Produces private Actions entry `一键维护` running controller mode `enable`.
- Produces private Actions entry `一键恢复` running controller mode `restore`.
- Consumes repository secret `HB_MAINTENANCE_PAT`.

- [ ] **Step 1: Write failing workflow contract tests**

Create `scripts/maintenance-workflows.test.mjs` to assert both workflow files exist, use `workflow_dispatch`, share concurrency group `hb-production-maintenance-toggle`, set `permissions: contents: read`, reference only `secrets.HB_MAINTENANCE_PAT`, check out the two fixed private repositories, and invoke the expected controller mode.

- [ ] **Step 2: Verify RED**

Run: `node --test scripts/maintenance-workflows.test.mjs`

Expected: FAIL because both workflow files are absent.

- [ ] **Step 3: Add the two workflows**

Each workflow uses Ubuntu, a 15-minute timeout, `actions/checkout@v4` for both fixed repositories, the shared concurrency group with `cancel-in-progress: false`, and a controller invocation from the checked-out main repository. No secret is passed as a command-line value.

- [ ] **Step 4: Verify GREEN**

Run: `node --test scripts/maintenance-workflows.test.mjs`

Expected: all workflow contract tests PASS.

- [ ] **Step 5: Run full local verification**

Run:

```powershell
node --test scripts/maintenance-remote.test.mjs scripts/maintenance-workflows.test.mjs
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
git diff --check origin/main...HEAD
git status --short --branch
```

Expected: controller/workflow tests, existing Vitest suite, lint, and build all PASS; diff check has no errors; status contains only intended committed changes.

- [ ] **Step 6: Update the project record**

Update `WORK_RECORD.md` with commit IDs, RED/GREEN evidence, full verification counts, Git state, the remote-helper limitation if unresolved, and the exact remaining action: configure `HB_MAINTENANCE_PAT`, push the branch/merge to private `main`, then perform one action-time-approved live toggle and verify production.

- [ ] **Step 7: Commit**

Run:

```powershell
git add .github/workflows scripts/maintenance-workflows.test.mjs WORK_RECORD.md docs/superpowers/plans/2026-07-15-mobile-maintenance-controls.md
git commit -m "feat: add mobile maintenance actions"
```

### Task 4: Publication and first live validation

**Files:**
- Modify: `WORK_RECORD.md`

**Interfaces:**
- Publishes the workflows to the private main repository.
- Configures the secret through authenticated GitHub controls without exposing its value.

- [ ] **Step 1: Verify authenticated GitHub access and repository privacy**

Confirm both repositories remain private and the authenticated account can create repository Actions secrets and push the reviewed commits.

- [ ] **Step 2: Configure the scoped secret**

Create a fine-grained token limited to the two named repositories with Contents read/write, store it as `HB_MAINTENANCE_PAT` in `web3-finance-dashboard`, and never display its value in logs or records.

- [ ] **Step 3: Publish without overwriting unrelated work**

Fetch current remote state, rebase or transplant the reviewed commits only if required, re-run all verification after any integration change, then push the branch and merge through a normal commit/PR path. Never force push.

- [ ] **Step 4: Stop for action-time approval**

Before running either production workflow, state the current two-site status, the requested test action, affected stable URLs, rollback head IDs, and that the operation creates and pushes one commit to each private repository.

- [ ] **Step 5: Run and verify the approved action**

From a mobile-compatible GitHub Actions page, run the approved workflow. Confirm both repository heads, the workflow summary, and every stable Vercel URL. If the test changed production into maintenance mode, obtain/confirm the paired restore action and verify the normal pages again.

- [ ] **Step 6: Record final evidence**

Append the workflow run URL, final remote commit IDs, final production state, verification result, and any degraded item to `WORK_RECORD.md`; commit the record without secrets.

