import packageJson from "../../package.json";

describe("deployment package configuration", () => {
  it("does not require platform-specific binaries on every operating system", () => {
    expect(Object.keys(packageJson.dependencies)).not.toContain("@next/swc-win32-x64-msvc");
  });
});
