const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const frontendRoot = "C:\\Users\\Administrator\\heibai-workspace\\projects\\hb-chain-finance";
const mode = process.argv[2];
const sources = {
  local: path.join(root, "env", "frontend.local.env"),
  sepolia: path.join(root, "env", "frontend.sepolia.env")
};

if (!sources[mode]) throw new Error("Usage: node scripts\\write-frontend-env.cjs local|sepolia");
if (!fs.existsSync(frontendRoot)) throw new Error(`Frontend project not found: ${frontendRoot}`);
const body = fs.readFileSync(sources[mode], "utf8");
fs.writeFileSync(path.join(frontendRoot, ".env.local"), body.endsWith("\n") ? body : `${body}\n`);
console.log(`Wrote ${mode} frontend environment to ${path.join(frontendRoot, ".env.local")}`);
