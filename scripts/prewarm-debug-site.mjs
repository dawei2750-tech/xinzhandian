const baseUrl = process.env.PREWARM_BASE_URL || "https://hb-chain-finance-frontend-debug.vercel.app";

const pages = [
  "/",
  "/savings-pool?tab=deposit",
  "/savings-pool?tab=plan",
  "/savings-pool?tab=account",
  "/docs",
  "/loan",
];

async function timedFetch(url) {
  const started = Date.now();
  const response = await fetch(url, { redirect: "follow" });
  const body = await response.text();
  return {
    url,
    status: response.status,
    ms: Date.now() - started,
    bytes: body.length,
    cache: response.headers.get("x-vercel-cache"),
    region: response.headers.get("x-vercel-id"),
    body,
  };
}

const pageResults = [];
const assetUrls = new Set();

for (const path of pages) {
  const result = await timedFetch(new URL(path, baseUrl).href);
  pageResults.push({ ...result, body: undefined });
  for (const match of result.body.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith("/_next/") || value.startsWith("/images/")) {
      assetUrls.add(new URL(value, baseUrl).href);
    }
  }
}

const assetResults = [];
for (const url of assetUrls) {
  const started = Date.now();
  const response = await fetch(url, { redirect: "follow" });
  const bytes = (await response.arrayBuffer()).byteLength;
  assetResults.push({
    url,
    status: response.status,
    ms: Date.now() - started,
    bytes,
    cache: response.headers.get("x-vercel-cache"),
  });
}

console.log(JSON.stringify({
  baseUrl,
  pages: pageResults,
  assets: {
    count: assetResults.length,
    slowest: assetResults.sort((a, b) => b.ms - a.ms).slice(0, 10),
  },
}, null, 2));
