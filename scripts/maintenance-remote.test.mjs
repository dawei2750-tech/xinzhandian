import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertActionAllowed,
  assertChangedPaths,
  assertRemoteUnchanged,
  classifyState,
  createGitRunner,
  findMaintenanceCommit,
  inspectTarget,
  prepareTarget,
  pushPreparedTarget,
  pushPreparedTargets,
  withSafeDirectory,
} from "./maintenance-remote.mjs";

const localGitExecutable =
  process.env.HB_GIT_EXE ??
  "C:\\Users\\Administrator\\AppData\\Local\\GitHubDesktop\\app-3.6.2\\resources\\app\\git\\cmd\\git.exe";

function runGit(repository, args) {
  const result = spawnSync(localGitExecutable, args, {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `git ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`,
  );
  return result.stdout.trim();
}

function createOnlineRepository() {
  const root = mkdtempSync(path.join(tmpdir(), "hb-maintenance-test-"));
  const bare = path.join(root, "remote.git");
  const seed = path.join(root, "seed");
  const work = path.join(root, "work");
  mkdirSync(seed);
  runGit(root, ["init", "--bare", "--initial-branch=main", bare]);
  runGit(seed, ["init", "--initial-branch=main"]);
  runGit(seed, ["config", "user.name", "Test User"]);
  runGit(seed, ["config", "user.email", "test@example.invalid"]);
  writeFileSync(path.join(seed, "vercel.json"), '{"normal":true}\n');
  runGit(seed, ["add", "vercel.json"]);
  runGit(seed, ["commit", "-m", "initial online site"]);
  runGit(seed, ["remote", "add", "origin", bare]);
  runGit(seed, ["push", "-u", "origin", "main"]);
  runGit(root, ["clone", bare, work]);
  runGit(work, ["config", "user.name", "github-actions[bot]"]);
  runGit(work, [
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  ]);
  return { bare, root, seed, work };
}

function readAssets() {
  return {
    config: readFileSync(
      new URL("../.github/maintenance-assets/vercel.json", import.meta.url),
    ),
    page: readFileSync(
      new URL("../.github/maintenance-assets/maintenance.html", import.meta.url),
    ),
  };
}

test("classifies a target without maintenance assets as online", () => {
  assert.equal(
    classifyState({
      configMatches: false,
      pageMatches: false,
      maintenanceCommit: null,
    }),
    "online",
  );
});

test("classifies matching assets with an identified marker commit as maintenance", () => {
  assert.equal(
    classifyState({
      configMatches: true,
      pageMatches: true,
      maintenanceCommit: "abc123",
    }),
    "maintenance",
  );
});

test("classifies a partial maintenance template as unknown", () => {
  assert.equal(
    classifyState({
      configMatches: true,
      pageMatches: false,
      maintenanceCommit: null,
    }),
    "unknown",
  );
});

test("classifies matching assets without a marker commit as unknown", () => {
  assert.equal(
    classifyState({
      configMatches: true,
      pageMatches: true,
      maintenanceCommit: null,
    }),
    "unknown",
  );
});

test("allows enable only when both targets are online", () => {
  assert.equal(assertActionAllowed("enable", ["online", "online"]), "proceed");
  assert.throws(
    () => assertActionAllowed("enable", ["online", "maintenance"]),
    /same recognized state/i,
  );
});

test("returns a no-op when the requested state is already satisfied", () => {
  assert.equal(
    assertActionAllowed("enable", ["maintenance", "maintenance"]),
    "noop",
  );
  assert.equal(assertActionAllowed("restore", ["online", "online"]), "noop");
});

test("allows restore only when both targets are in maintenance", () => {
  assert.equal(
    assertActionAllowed("restore", ["maintenance", "maintenance"]),
    "proceed",
  );
  assert.throws(
    () => assertActionAllowed("restore", ["unknown", "unknown"]),
    /recognized state/i,
  );
});

test("accepts exactly the two approved changed paths", () => {
  assert.doesNotThrow(() =>
    assertChangedPaths(["public/maintenance.html", "vercel.json"]),
  );
  assert.throws(
    () =>
      assertChangedPaths([
        "public/maintenance.html",
        "vercel.json",
        "src/app/page.tsx",
      ]),
    /unexpected commit scope/i,
  );
  assert.throws(
    () => assertChangedPaths(["vercel.json"]),
    /unexpected commit scope/i,
  );
});

test("scopes Git safe-directory trust to the current repository", () => {
  assert.deepEqual(withSafeDirectory("C:\\HB\\repo", ["status", "--porcelain"]), [
    "-c",
    "safe.directory=C:/HB/repo",
    "status",
    "--porcelain",
  ]);
});

test("finds the newest commit whose assets and marker match", () => {
  const calls = [];
  const git = ({ args, encoding = "utf8" }) => {
    calls.push(args);
    const key = args.join(" ");
    const values = new Map([
      [
        "log -50 --format=%H HEAD -- vercel.json public/maintenance.html",
        "newer\nmaintenance\n",
      ],
      ["show newer:vercel.json", Buffer.from("normal-config")],
      ["show maintenance:vercel.json", Buffer.from("maintenance-config")],
      [
        "show maintenance:public/maintenance.html",
        Buffer.from("maintenance-page"),
      ],
      [
        "show -s --format=%s%n%b maintenance",
        "chore: enable full-site maintenance\n\nHB-Maintenance-Toggle: enable",
      ],
    ]);
    const value = values.get(key);
    if (value === undefined) {
      return encoding === null ? Buffer.from("") : "";
    }
    return encoding === null && typeof value === "string"
      ? Buffer.from(value)
      : value;
  };

  assert.equal(
    findMaintenanceCommit({
      repository: "repo",
      head: "HEAD",
      configAsset: Buffer.from("maintenance-config"),
      pageAsset: Buffer.from("maintenance-page"),
      git,
    }),
    "maintenance",
  );
  assert.ok(calls.length >= 4);
});

test("prepares and pushes enable with only the approved paths", () => {
  const repository = createOnlineRepository();
  const git = createGitRunner({ executable: localGitExecutable });
  const assets = readAssets();
  const target = { key: "test", name: "Test site", repository: repository.work };
  const state = inspectTarget({ target, assets, git });

  assert.equal(state.state, "online");
  const prepared = prepareTarget({ mode: "enable", inspected: state, assets, git });
  assert.deepEqual(prepared.changedPaths.sort(), [
    "public/maintenance.html",
    "vercel.json",
  ]);
  assert.match(
    runGit(repository.work, ["show", "-s", "--format=%B", "HEAD"]),
    /HB-Maintenance-Toggle: enable/,
  );

  pushPreparedTarget(prepared, git);
  assert.equal(
    runGit(repository.root, ["--git-dir", repository.bare, "rev-parse", "main"]),
    prepared.newHead,
  );
});

test("restores maintenance with a normal revert commit", () => {
  const repository = createOnlineRepository();
  const git = createGitRunner({ executable: localGitExecutable });
  const assets = readAssets();
  const target = { key: "test", name: "Test site", repository: repository.work };
  const online = inspectTarget({ target, assets, git });
  const enabled = prepareTarget({ mode: "enable", inspected: online, assets, git });
  pushPreparedTarget(enabled, git);

  const maintenance = inspectTarget({ target, assets, git });
  assert.equal(maintenance.state, "maintenance");
  const restored = prepareTarget({
    mode: "restore",
    inspected: maintenance,
    assets,
    git,
  });

  assert.match(
    runGit(repository.work, ["show", "-s", "--format=%s", "HEAD"]),
    /^Revert /,
  );
  assert.deepEqual(restored.changedPaths.sort(), [
    "public/maintenance.html",
    "vercel.json",
  ]);
  assert.deepEqual(
    JSON.parse(readFileSync(path.join(repository.work, "vercel.json"), "utf8")),
    { normal: true },
  );
});

test("stops when remote main changes after preparation", () => {
  const repository = createOnlineRepository();
  const git = createGitRunner({ executable: localGitExecutable });
  const assets = readAssets();
  const target = { key: "test", name: "Test site", repository: repository.work };
  const inspected = inspectTarget({ target, assets, git });
  const prepared = prepareTarget({ mode: "enable", inspected, assets, git });

  writeFileSync(path.join(repository.seed, "concurrent.txt"), "change\n");
  runGit(repository.seed, ["add", "concurrent.txt"]);
  runGit(repository.seed, ["commit", "-m", "concurrent remote change"]);
  runGit(repository.seed, ["push", "origin", "main"]);

  assert.throws(
    () => assertRemoteUnchanged(prepared, git),
    /remote main changed/i,
  );
});

test("reports a partial update when a later push fails", () => {
  const pushed = [];
  assert.throws(
    () =>
      pushPreparedTargets(
        [
          { target: { name: "Main site" } },
          { target: { name: "Admin site" } },
        ],
        (item) => {
          if (item.target.name === "Admin site") {
            throw new Error("simulated push failure");
          }
          pushed.push(item.target.name);
        },
      ),
    /already pushed: Main site/i,
  );
  assert.deepEqual(pushed, ["Main site"]);
});
