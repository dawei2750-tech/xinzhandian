import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const mode = process.argv[2] || "sepolia";
const templates = {
  sepolia: ".env.example",
  "bsc-testnet": ".env.bsc-testnet.example",
  local: ".env.local.example",
};

const template = templates[mode];
if (!template) {
  throw new Error("Usage: node scripts/use-env-template.mjs sepolia|bsc-testnet|local");
}

const source = resolve(projectRoot, template);
const target = resolve(projectRoot, ".env.local");
if (!existsSync(source)) {
  throw new Error(`Environment template not found: ${template}`);
}

copyFileSync(source, target);
console.log(`Wrote ${mode} environment to .env.local`);
