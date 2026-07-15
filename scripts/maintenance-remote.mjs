import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APPROVED_PATHS = ["public/maintenance.html", "vercel.json"];
const ENABLE_MARKER = "HB-Maintenance-Toggle: enable";

export function classifyState({
  configMatches,
  pageMatches,
  maintenanceCommit,
}) {
  if (!configMatches && !pageMatches) {
    return "online";
  }
  if (configMatches && pageMatches && maintenanceCommit) {
    return "maintenance";
  }
  return "unknown";
}

export function assertActionAllowed(mode, states) {
  if (!new Set(["enable", "restore"]).has(mode)) {
    throw new Error(`Unsupported action: ${mode}`);
  }
  if (
    states.length !== 2 ||
    states.some((state) => !new Set(["online", "maintenance"]).has(state))
  ) {
    throw new Error("Both repositories must be in a recognized state.");
  }
  if (new Set(states).size !== 1) {
    throw new Error("Both repositories must have the same recognized state.");
  }

  const current = states[0];
  if (
    (mode === "enable" && current === "maintenance") ||
    (mode === "restore" && current === "online")
  ) {
    return "noop";
  }
  return "proceed";
}

export function assertChangedPaths(paths) {
  const actual = [...new Set(paths)].sort();
  const expected = [...APPROVED_PATHS].sort();
  if (
    actual.length !== expected.length ||
    actual.some((path, index) => path !== expected[index])
  ) {
    throw new Error(`Unexpected commit scope: ${actual.join(", ") || "none"}`);
  }
}

function asBuffer(value) {
  return Buffer.isBuffer(value) ? value : Buffer.from(value ?? "");
}

function asText(value) {
  return Buffer.isBuffer(value) ? value.toString("utf8") : String(value ?? "");
}

export function findMaintenanceCommit({
  repository,
  head,
  configAsset,
  pageAsset,
  git,
}) {
  const history = asText(
    git({
      repository,
      args: [
        "log",
        "-50",
        "--format=%H",
        head,
        "--",
        "vercel.json",
        "public/maintenance.html",
      ],
    }),
  );
  const candidates = history.split(/\r?\n/u).filter(Boolean);

  for (const candidate of candidates) {
    const config = asBuffer(
      git({
        repository,
        args: ["show", `${candidate}:vercel.json`],
        encoding: null,
        allowFailure: true,
      }),
    );
    if (!config.equals(configAsset)) {
      continue;
    }
    const page = asBuffer(
      git({
        repository,
        args: ["show", `${candidate}:public/maintenance.html`],
        encoding: null,
        allowFailure: true,
      }),
    );
    if (!page.equals(pageAsset)) {
      continue;
    }
    const message = asText(
      git({
        repository,
        args: ["show", "-s", "--format=%s%n%b", candidate],
      }),
    );
    if (
      message.includes(ENABLE_MARKER) ||
      message.includes("enable full-site maintenance")
    ) {
      return candidate;
    }
  }

  return null;
}

function gitEnvironment(executable) {
  const environment = { ...process.env };
  const normalized = executable.replaceAll("/", "\\").toLowerCase();
  const marker = "\\git\\cmd\\git.exe";
  if (normalized.endsWith(marker)) {
    const gitRoot = path.resolve(path.dirname(executable), "..");
    const core = path.join(gitRoot, "mingw64", "libexec", "git-core");
    environment.GIT_EXEC_PATH ??= core;
    environment.PATH = [
      path.join(gitRoot, "cmd"),
      path.join(gitRoot, "mingw64", "bin"),
      environment.PATH,
    ]
      .filter(Boolean)
      .join(path.delimiter);
  }
  return environment;
}

export function withSafeDirectory(repository, args) {
  const safePath = path.resolve(repository).replaceAll("\\", "/");
  return ["-c", `safe.directory=${safePath}`, ...args];
}

export function createGitRunner({ executable = process.env.HB_GIT_EXE ?? "git" } = {}) {
  const environment = gitEnvironment(executable);
  return function git({
    repository,
    args,
    encoding = "utf8",
    allowFailure = false,
  }) {
    const safeArguments = withSafeDirectory(repository, args);
    const result = spawnSync(executable, safeArguments, {
      cwd: repository,
      encoding,
      env: environment,
      maxBuffer: 10 * 1024 * 1024,
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      if (allowFailure) {
        return encoding === null ? Buffer.alloc(0) : "";
      }
      const stderr = asText(result.stderr).trim();
      const stdout = asText(result.stdout).trim();
      throw new Error(
        `Git command failed (${result.status}): git ${args.join(" ")}\n${stderr || stdout}`,
      );
    }
    if (encoding === null) {
      return result.stdout;
    }
    return asText(result.stdout).trim();
  };
}

function gitBlob(git, repository, revision, filePath) {
  return asBuffer(
    git({
      repository,
      args: ["show", `${revision}:${filePath}`],
      encoding: null,
      allowFailure: true,
    }),
  );
}

export function inspectTarget({ target, assets, git, refresh = true }) {
  const status = asText(
    git({ repository: target.repository, args: ["status", "--porcelain"] }),
  );
  if (status) {
    throw new Error(`${target.name} checkout is not clean.`);
  }
  if (target.remoteUrl) {
    const remote = asText(
      git({
        repository: target.repository,
        args: ["remote", "get-url", "origin"],
      }),
    );
    if (remote.replace(/\/$/u, "") !== target.remoteUrl.replace(/\/$/u, "")) {
      throw new Error(`Unexpected origin for ${target.name}: ${remote}`);
    }
  }
  if (refresh) {
    git({
      repository: target.repository,
      args: ["fetch", "--no-tags", "origin", "main"],
    });
  }
  const head = asText(
    git({
      repository: target.repository,
      args: ["rev-parse", refresh ? "origin/main" : "HEAD"],
    }),
  );
  const localHead = asText(
    git({ repository: target.repository, args: ["rev-parse", "HEAD"] }),
  );
  if (head !== localHead) {
    throw new Error(
      `${target.name} checkout does not match the current remote main.`,
    );
  }

  const config = gitBlob(git, target.repository, head, "vercel.json");
  const page = gitBlob(
    git,
    target.repository,
    head,
    "public/maintenance.html",
  );
  const configMatches = config.equals(assets.config);
  const pageMatches = page.equals(assets.page);
  const maintenanceCommit =
    configMatches && pageMatches
      ? findMaintenanceCommit({
          repository: target.repository,
          head,
          configAsset: assets.config,
          pageAsset: assets.page,
          git,
        })
      : null;

  return {
    target,
    originalHead: head,
    state: classifyState({
      configMatches,
      pageMatches,
      maintenanceCommit,
    }),
    maintenanceCommit,
  };
}

export function prepareTarget({ mode, inspected, assets, git }) {
  const { target } = inspected;
  const currentHead = asText(
    git({ repository: target.repository, args: ["rev-parse", "HEAD"] }),
  );
  if (currentHead !== inspected.originalHead) {
    throw new Error(`${target.name} checkout changed before preparation.`);
  }

  git({
    repository: target.repository,
    args: ["config", "user.name", "github-actions[bot]"],
  });
  git({
    repository: target.repository,
    args: [
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ],
  });

  if (mode === "enable") {
    writeFileSync(path.join(target.repository, "vercel.json"), assets.config);
    const publicDirectory = path.join(target.repository, "public");
    mkdirSync(publicDirectory, { recursive: true });
    writeFileSync(
      path.join(publicDirectory, "maintenance.html"),
      assets.page,
    );
    git({
      repository: target.repository,
      args: ["add", "--", ...APPROVED_PATHS],
    });
    git({
      repository: target.repository,
      args: [
        "commit",
        "-m",
        "chore: enable full-site maintenance",
        "-m",
        ENABLE_MARKER,
      ],
    });
  } else if (mode === "restore") {
    if (!inspected.maintenanceCommit) {
      throw new Error(`No maintenance commit was identified for ${target.name}.`);
    }
    git({
      repository: target.repository,
      args: ["revert", "--no-edit", inspected.maintenanceCommit],
    });
  } else {
    throw new Error(`Unsupported action: ${mode}`);
  }

  const changedPaths = asText(
    git({
      repository: target.repository,
      args: ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
    }),
  )
    .split(/\r?\n/u)
    .filter(Boolean);
  assertChangedPaths(changedPaths);
  const newHead = asText(
    git({ repository: target.repository, args: ["rev-parse", "HEAD"] }),
  );
  return { ...inspected, changedPaths, newHead };
}

function remoteMainHead(item, git) {
  const line = asText(
    git({
      repository: item.target.repository,
      args: ["ls-remote", "origin", "refs/heads/main"],
    }),
  );
  return line.split(/\s+/u)[0] ?? "";
}

export function assertRemoteUnchanged(item, git) {
  const remoteHead = remoteMainHead(item, git);
  if (remoteHead !== item.originalHead) {
    throw new Error(`Remote main changed for ${item.target.name}. No push was made.`);
  }
}

export function pushPreparedTarget(item, git) {
  assertRemoteUnchanged(item, git);
  git({
    repository: item.target.repository,
    args: ["push", "origin", `${item.newHead}:refs/heads/main`],
  });
  const remoteHead = remoteMainHead(item, git);
  if (remoteHead !== item.newHead) {
    throw new Error(`Remote verification failed for ${item.target.name}.`);
  }
  return remoteHead;
}

export function pushPreparedTargets(items, push = () => {}) {
  const pushedNames = [];
  for (const item of items) {
    try {
      push(item);
      pushedNames.push(item.target.name);
    } catch (error) {
      const partial = pushedNames.length
        ? ` Already pushed: ${pushedNames.join(", ")}.`
        : " No repository was pushed.";
      throw new Error(`${error.message}${partial}`, { cause: error });
    }
  }
  return pushedNames;
}

function parseArguments(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--preflight-only") {
      values.set("preflightOnly", true);
      continue;
    }
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    const [rawKey, inlineValue] = argument.slice(2).split("=", 2);
    const value = inlineValue ?? argv[index + 1];
    if (!inlineValue) {
      index += 1;
    }
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${rawKey}`);
    }
    values.set(rawKey, value);
  }
  return {
    mode: values.get("mode"),
    mainDir: values.get("main-dir"),
    adminDir: values.get("admin-dir"),
    preflightOnly: values.get("preflightOnly") === true,
  };
}

function appendSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    appendFileSync(summaryPath, `${lines.join("\n")}\n`, "utf8");
  }
}

async function fetchPage(url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
    headers: { "cache-control": "no-cache" },
  });
  return { status: response.status, body: await response.text() };
}

async function waitForDeployment(mode, targets) {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    let allPassed = true;
    for (const target of targets) {
      for (const url of target.verifyUrls) {
        try {
          const result = await fetchPage(url);
          const isMaintenance =
            result.body.includes("HB正常维护中") &&
            result.body.includes("新的项目即将呈现");
          const passed =
            mode === "enable"
              ? result.status === 200 && isMaintenance
              : result.status === 200 &&
                !isMaintenance &&
                result.body.length > 200;
          if (!passed) allPassed = false;
        } catch {
          allPassed = false;
        }
      }
    }
    if (allPassed) return;
    if (attempt < 60) {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
    }
  }
  throw new Error(
    "Git was updated, but production verification did not finish within 10 minutes.",
  );
}

async function main(argv) {
  const options = parseArguments(argv);
  if (!new Set(["enable", "restore", "status"]).has(options.mode)) {
    throw new Error("--mode must be enable, restore, or status.");
  }
  if (!options.mainDir || !options.adminDir) {
    throw new Error("--main-dir and --admin-dir are required.");
  }
  const assetRoot = fileURLToPath(
    new URL("../.github/maintenance-assets/", import.meta.url),
  );
  const assets = {
    config: readFileSync(path.join(assetRoot, "vercel.json")),
    page: readFileSync(path.join(assetRoot, "maintenance.html")),
  };
  const targets = [
    {
      key: "main",
      name: "Main site",
      repository: path.resolve(options.mainDir),
      remoteUrl: "https://github.com/hei905595-byte/web3-finance-dashboard.git",
      verifyUrls: [
        "https://web3-finance-dashboard-sbpa.vercel.app/",
        "https://web3-finance-dashboard-sbpa.vercel.app/admin",
        "https://web3-finance-dashboard-sbpa.vercel.app/pool",
      ],
    },
    {
      key: "admin",
      name: "Admin site",
      repository: path.resolve(options.adminDir),
      remoteUrl: "https://github.com/hei905595-byte/wb3-chain-finance-admin.git",
      verifyUrls: [
        "https://wb3-chain-finance-admin.vercel.app/",
        "https://wb3-chain-finance-admin.vercel.app/admin",
      ],
    },
  ];
  const git = createGitRunner();
  const inspected = targets.map((target) =>
    inspectTarget({ target, assets, git }),
  );
  for (const item of inspected) {
    console.log(`${item.target.name}: ${item.state} (${item.originalHead.slice(0, 7)})`);
  }
  appendSummary([
    "## HB maintenance control",
    "",
    `Requested action: **${options.mode}**`,
    ...inspected.map(
      (item) =>
        `- ${item.target.name}: ${item.state} (${item.originalHead.slice(0, 7)})`,
    ),
  ]);
  if (options.mode === "status" || options.preflightOnly) {
    console.log("Preflight completed. No commit or push was made.");
    return;
  }
  const decision = assertActionAllowed(
    options.mode,
    inspected.map((item) => item.state),
  );
  if (decision === "noop") {
    console.log("The requested state is already active. No change was made.");
    appendSummary(["", "Result: already satisfied; no change made."]);
    return;
  }
  const prepared = inspected.map((item) =>
    prepareTarget({ mode: options.mode, inspected: item, assets, git }),
  );
  prepared.forEach((item) => assertRemoteUnchanged(item, git));
  const pushed = pushPreparedTargets(prepared, (item) =>
    pushPreparedTarget(item, git),
  );
  appendSummary([
    "",
    ...prepared.map(
      (item) => `- Pushed ${item.target.name}: ${item.newHead.slice(0, 7)}`,
    ),
  ]);
  await waitForDeployment(options.mode, targets);
  console.log(`Completed ${options.mode}: ${pushed.join(", ")}.`);
  appendSummary(["", "Result: production verification passed."]);
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    appendSummary(["", `Result: failed — ${error.message}`]);
    process.exitCode = 1;
  });
}
