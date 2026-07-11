"use client";

import Image from "next/image";
import { useState } from "react";
import { mobileMysteryCopy, mobileYieldCopy } from "./savings-command-center";
import { spotlightCopy, type SpotlightKey } from "./mobile-spotlight-hub";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

const deckCopy: Record<
  Locale,
  { eyebrow: string; title: string; live: string }
> = {
  en: {
    eyebrow: "OPPORTUNITY NETWORK",
    title: "Savings access console",
    live: "LIVE",
  },
  "zh-CN": { eyebrow: "机会网络", title: "储蓄功能控制台", live: "实时" },
  "zh-TW": { eyebrow: "機會網絡", title: "儲蓄功能控制台", live: "即時" },
  ja: {
    eyebrow: "機会ネットワーク",
    title: "貯蓄アクセスコンソール",
    live: "稼働中",
  },
  ko: { eyebrow: "기회 네트워크", title: "저축 액세스 콘솔", live: "운영 중" },
  th: {
    eyebrow: "เครือข่ายโอกาส",
    title: "ศูนย์ควบคุมการออม",
    live: "ออนไลน์",
  },
};

export function DesktopOpportunityDeck() {
  const { locale } = useLocale();
  const items = spotlightCopy[locale];
  const [activeKey, setActiveKey] = useState<SpotlightKey>("fixed");
  const active = items.find((item) => item.key === activeKey) ?? items[0];
  const mystery = mobileMysteryCopy[locale];
  const stats = mobileYieldCopy[locale];
  const deck = deckCopy[locale];
  return (
    <section
      data-testid="desktop-opportunity-deck"
      className="mb-3 grid grid-cols-12 gap-3"
    >
      <div className="relative col-span-8 min-h-[390px] overflow-hidden rounded-panel border border-violet/35 bg-[radial-gradient(circle_at_70%_35%,rgba(115,76,255,.22),transparent_36%),linear-gradient(145deg,#0d172c,#070d1d)] p-6 shadow-glow">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(75,211,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(75,211,255,.08)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[.22em] text-cyan">
              {deck.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{deck.title}</h2>
          </div>
          <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success">
            {deck.live}
          </span>
        </div>
        <div className="relative mt-6 grid grid-cols-[210px_1fr] gap-5">
          <div className="space-y-2">
            {items.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveKey(item.key)}
                onPointerEnter={() => setActiveKey(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                  active.key === item.key
                    ? "border-cyan/60 bg-cyan/10 shadow-[0_0_22px_rgba(34,211,238,.14)]"
                    : "border-line bg-bg/35 hover:border-violet/45"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-black ${
                    active.key === item.key
                      ? "bg-cyan text-bg"
                      : "bg-violet/15 text-violet"
                  }`}
                >
                  0{index + 1}
                </span>
                <span>
                  <small className="block text-[.6rem] tracking-[.14em] text-muted">
                    {item.eyebrow}
                  </small>
                  <strong className="text-sm">{item.title}</strong>
                </span>
              </button>
            ))}
          </div>
          <div
            data-testid="desktop-opportunity-active"
            className="relative flex min-h-[270px] flex-col justify-end overflow-hidden rounded-xl border border-violet/35 bg-bg/55 p-6"
          >
            <div className="absolute -right-10 -top-10 size-56 rounded-full border border-cyan/20 shadow-[0_0_80px_rgba(34,211,238,.18)]">
              <span className="absolute inset-8 rounded-full border border-violet/30" />
              <span className="absolute inset-16 rounded-full border border-cyan/25" />
            </div>
            <div className="relative">
              <span className="text-xs font-bold tracking-[.2em] text-cyan">
                {active.eyebrow}
              </span>
              <h3 className="mt-2 text-3xl font-bold">{active.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                {active.detail}
              </p>
              {active.href ? (
                <a
                  href={active.href}
                  className="primary-button mt-5 inline-flex rounded-lg px-5 py-2.5 text-sm font-bold"
                >
                  {active.action}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 cursor-not-allowed rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-muted"
                >
                  {active.action}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 grid gap-3">
        <section
          data-testid="desktop-yield-stats"
          className="rounded-panel border border-cyan/30 bg-surface-soft/85 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{stats.title}</h2>
            <span className="size-2 rounded-full bg-success shadow-[0_0_12px_#22c55e]" />
          </div>
          <div className="mt-3 divide-y divide-line/70">
            {stats.items.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <span className="text-muted">{label}</span>
                <strong className="text-right">{value}</strong>
              </div>
            ))}
          </div>
        </section>
        <a
          href="/docs"
          data-testid="desktop-mystery-card"
          className="group relative min-h-40 overflow-hidden rounded-panel border border-warning/35 bg-[#151027] p-5"
        >
          <Image
            src="/images/blockchain-savings-reward.png"
            alt=""
            fill
            sizes="340px"
            className="object-cover opacity-30 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#151027] via-[#151027]/80 to-transparent" />
          <div className="relative max-w-[72%]">
            <span className="text-[.65rem] font-bold tracking-[.2em] text-warning">
              {mystery.eyebrow}
            </span>
            <h2 className="mt-2 text-xl font-bold">{mystery.title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted">
              {mystery.detail}
            </p>
            <span className="mt-3 inline-flex text-xs font-bold text-warning">
              {mystery.action} →
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
