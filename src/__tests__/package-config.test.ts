import packageJson from "../../package.json";
import { readFileSync } from "node:fs";

describe("deployment package configuration", () => {
  it("does not require platform-specific binaries on every operating system", () => {
    expect(Object.keys(packageJson.dependencies)).not.toContain("@next/swc-win32-x64-msvc");
  });

  it("uses public testnet templates instead of local 31337 for project-party testing", () => {
    const sepolia = readFileSync(".env.example", "utf8");
    const bsc = readFileSync(".env.bsc-testnet.example", "utf8");

    expect(sepolia).toContain("NEXT_PUBLIC_WEB3_ENV=sepolia");
    expect(sepolia).toContain("NEXT_PUBLIC_EVM_CHAIN_ID=11155111");
    expect(sepolia).toContain("NEXT_PUBLIC_EVM_RPC_URL=https://sepolia.drpc.org");
    expect(sepolia).not.toContain("NEXT_PUBLIC_EVM_CHAIN_ID=31337");
    expect(sepolia).not.toContain("http://127.0.0.1:8545");
    expect(bsc).toContain("NEXT_PUBLIC_WEB3_ENV=bsc-testnet");
    expect(bsc).toContain("NEXT_PUBLIC_EVM_CHAIN_ID=97");
    expect(bsc).toContain("NEXT_PUBLIC_EVM_RPC_URL=https://bsc-testnet.drpc.org");
  });
});
