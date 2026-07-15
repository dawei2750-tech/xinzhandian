import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cases = [
  {
    file: "enable-maintenance.yml",
    name: "一键维护",
    mode: "enable",
  },
  {
    file: "restore-site.yml",
    name: "一键恢复",
    mode: "restore",
  },
];

function readWorkflow(file) {
  return readFileSync(
    new URL(`../.github/workflows/${file}`, import.meta.url),
    "utf8",
  );
}

for (const workflow of cases) {
  test(`${workflow.name} is a private manual mobile entry`, () => {
    const source = readWorkflow(workflow.file);
    assert.match(source, new RegExp(`^name: ${workflow.name}$`, "mu"));
    assert.match(source, /^\s*workflow_dispatch:\s*$/mu);
    assert.match(source, /^permissions:\s*\r?\n\s+contents: read$/mu);
    assert.match(source, /^\s+group: hb-production-maintenance-toggle$/mu);
    assert.match(source, /^\s+cancel-in-progress: false$/mu);
    assert.match(source, /^\s+timeout-minutes: 15$/mu);
  });

  test(`${workflow.name} checks out only the two fixed private repositories`, () => {
    const source = readWorkflow(workflow.file);
    assert.match(
      source,
      /repository: hei905595-byte\/web3-finance-dashboard/u,
    );
    assert.match(
      source,
      /repository: hei905595-byte\/wb3-chain-finance-admin/u,
    );
    assert.match(source, /path: main-site/u);
    assert.match(source, /path: admin-site/u);
    assert.equal(
      (source.match(/token: \$\{\{ secrets\.HB_MAINTENANCE_PAT \}\}/gu) ?? [])
        .length,
      2,
    );
    assert.deepEqual(
      [...source.matchAll(/secrets\.([A-Z0-9_]+)/gu)].map((match) => match[1]),
      ["HB_MAINTENANCE_PAT", "HB_MAINTENANCE_PAT"],
    );
  });

  test(`${workflow.name} invokes the expected controller mode without a secret argument`, () => {
    const source = readWorkflow(workflow.file);
    assert.match(
      source,
      new RegExp(
        `node main-site/scripts/maintenance-remote\\.mjs --mode ${workflow.mode} --main-dir main-site --admin-dir admin-site`,
        "u",
      ),
    );
    assert.doesNotMatch(source, /--token|--secret|HB_MAINTENANCE_PAT=/u);
  });
}
