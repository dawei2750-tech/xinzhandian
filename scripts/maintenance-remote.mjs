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

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  console.error("The maintenance CLI orchestration is not implemented yet.");
  process.exitCode = 1;
}

