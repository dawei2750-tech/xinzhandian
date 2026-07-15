import assert from "node:assert/strict";
import test from "node:test";

import {
  assertActionAllowed,
  assertChangedPaths,
  classifyState,
  findMaintenanceCommit,
} from "./maintenance-remote.mjs";

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

