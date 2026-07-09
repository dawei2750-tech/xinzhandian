"use client";

import { useState, type CSSProperties } from "react";
import { actionLinks } from "@/constants/links";

const spotlightItems = [
  { key: "flexible", title: "Flexible Access", eyebrow: "DAILY FLOW", detail: "Enter the flexible pool and keep assets available for daily settlement.", href: actionLinks.fixedSavings, action: "Enter Pool" },
  { key: "fixed", title: "Fixed Maturity", eyebrow: "LOCKED PATH", detail: "Choose a fixed plan and view the matched maturity yield route.", href: actionLinks.fixedSavings, action: "View Plans" },
  { key: "mystery", title: "Mystery Box", eyebrow: "REWARD", detail: "Reward events stay visible here while the activity page is prepared.", action: "Preparing" },
  { key: "invite", title: "Invite Friends", eyebrow: "MEMBER", detail: "Non-high-net-worth members cannot share dividend vouchers.", action: "Unavailable" },
  { key: "contract", title: "Smart Contract", eyebrow: "PROOF", detail: "Savings routes are presented with contract-driven proof signals.", href: "/docs", action: "Read Proof" },
  { key: "chain", title: "Multi-chain Proof", eyebrow: "NETWORK", detail: "EVM and TRON paths are organized as separate on-chain settlement lanes.", href: "/docs", action: "Explore" },
] as const;

export function MobileSpotlightHub() {
  const [activeKey, setActiveKey] = useState<(typeof spotlightItems)[number]["key"]>("flexible");
  const active = spotlightItems.find((item) => item.key === activeKey) ?? spotlightItems[0];

  return (
    <section data-testid="spotlight-hub" className="mobile-spotlight-hub lg:hidden" aria-label="Savings feature spotlight">
      <div data-testid="spotlight-core" className="spotlight-core" aria-hidden="true"><span /><span /></div>
      <div className="spotlight-beam-stage">
        {spotlightItems.map((item, index) => (
          <button
            key={item.key}
            type="button"
            data-testid="spotlight-beam"
            className={`spotlight-beam spotlight-beam-${item.key} ${item.key === active.key ? "spotlight-beam-active" : ""}`}
            style={{ "--beam-index": index } as CSSProperties}
            onClick={() => setActiveKey(item.key)}
            onFocus={() => setActiveKey(item.key)}
            onPointerEnter={() => setActiveKey(item.key)}
          >
            <span className="spotlight-beam-ray" aria-hidden="true" />
            <span className="spotlight-beam-label"><span>{item.eyebrow}</span><strong>{item.title}</strong></span>
          </button>
        ))}
      </div>
      <div data-testid="spotlight-active-panel" className="spotlight-active-panel">
        <span>{active.eyebrow}</span>
        <strong>{active.title}</strong>
        <p>{active.detail}</p>
        {"href" in active ? <a href={active.href}>{active.action}</a> : <button type="button">{active.action}</button>}
      </div>
    </section>
  );
}
