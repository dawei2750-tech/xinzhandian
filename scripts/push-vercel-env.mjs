import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const envPath = resolve(projectRoot, ".env.example");
const targets = ["production", "preview"];

function readEnv(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      if (index === -1) throw new Error(`Invalid env line: ${line}`);
      return [line.slice(0, index), line.slice(index + 1)];
    });
}

function runVercel(args, options = {}) {
  const result = spawnSync("vercel", args, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: true,
    ...options,
  });
  return result;
}

function requireSuccess(result, label) {
  if (result.status === 0) return;
  const stderr = result.stderr?.trim();
  const stdout = result.stdout?.trim();
  throw new Error(`${label} failed\n${stderr || stdout || "No output"}`);
}

const entries = readEnv(envPath);

for (const target of targets) {
  console.log(`Syncing ${entries.length} variables to Vercel ${target}`);
  for (const [key, value] of entries) {
    runVercel(["env", "rm", key, target, "--yes"]);
    const add = runVercel(["env", "add", key, target], { input: `${value}\n` });
    requireSuccess(add, `vercel env add ${key} ${target}`);
    console.log(`  ${key}`);
  }
}

console.log("Vercel env sync complete.");
