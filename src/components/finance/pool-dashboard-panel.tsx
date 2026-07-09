"use client";

import { useEffect, useState } from "react";
import { GlowIcon } from "@/components/ui/glow-icon";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";
import { routeCopy } from "@/i18n/route-copy";
import type { IconName, Tone } from "@/types/finance";

const accountActions: Record<Locale, string> = {
  en: "Connect Wallet",
  "zh-CN": "连接钱包",
  "zh-TW": "連接錢包",
  ja: "ウォレット接続",
  ko: "지갑 연결",
  th: "เชื่อมต่อวอลเล็ต",
};

type IconSpec = { icon: IconName; tone: Tone };

const overviewIcons: IconSpec[] = [
  { icon: "gift", tone: "orange" },
  { icon: "users", tone: "cyan" },
  { icon: "usdc", tone: "purple" },
];

function DecorativeIcon({ icon, tone, label, size = "xl", bright = false }: IconSpec & { label: string; size?: "lg" | "xl"; bright?: boolean }) {
  return (
    <span
      data-testid="pool-decorative-icon"
      className={`pointer-events-none absolute bottom-4 right-4 z-0 ${bright ? "opacity-60 sm:opacity-70" : "opacity-40 sm:opacity-50"}`}
    >
      <GlowIcon name={icon} tone={tone} label={label} size={size} />
    </span>
  );
}

function CardContent({ children, testId }: { children: React.ReactNode; testId?: string }) {
  return <div data-testid={testId} className="relative z-10 max-w-[min(100%,22rem)]">{children}</div>;
}

export function PoolDashboard() {
  const [tab, setTab] = useState(0);
  const { locale } = useLocale();
  const c = routeCopy[locale].pool;

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("tab");
    if (value !== "account" && value !== "plan") return;
    const timer = window.setTimeout(() => setTab(value === "account" ? 2 : 1), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const plans: Array<{ title: string; desc: string } & IconSpec> = [
    { title: c.flexible, desc: c.flexibleDesc, icon: "coins", tone: "cyan" },
    { title: c.fixed, desc: c.fixedDesc, icon: "vault", tone: "purple" },
  ];

  return (
    <section data-testid="pool-dashboard" className="panel overflow-hidden">
      <div role="tablist" aria-label={c.title} className="scrollbar-none flex overflow-x-auto border-b border-line p-2">
        {c.tabs.map((x, i) => (
          <button
            key={x}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`min-w-24 flex-1 rounded-control px-4 py-3 text-sm font-medium ${tab === i ? "bg-brand-gradient text-ink shadow-glow" : "text-muted"}`}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-6">
        {tab === 0 && (
          <div data-testid="pool-overview-panel">
            <h2 className="text-xl font-semibold">{c.overview}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {c.metrics.map((x, i) => {
                const giftCard = i === 0;
                return (
                <article
                  key={x}
                  data-testid={giftCard ? "pool-overview-gift-card" : undefined}
                  className={`panel relative isolate min-h-44 overflow-hidden p-5 pr-24 ${giftCard ? "pool-gift-card-bright border-warning/60 bg-warning/10 shadow-glow" : "border-line-bright/60 bg-surface-soft/80"}`}
                >
                  <CardContent>
                    <p className="text-sm text-muted">{x}</p>
                    <p className="mt-3 text-3xl font-semibold">-</p>
                    <p className="mt-1 text-xs text-muted">{c.unavailable}</p>
                  </CardContent>
                  <DecorativeIcon {...overviewIcons[i]} label={x} size="lg" bright={giftCard} />
                </article>
              )})}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div data-testid="pool-plans-panel">
            <h2 className="text-xl font-semibold">{c.plans}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.title} className="panel relative isolate min-h-44 overflow-hidden border-line-bright/60 bg-surface-soft/80 p-5 pr-24">
                  <CardContent>
                    <h3 className="font-semibold">{plan.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{plan.desc}</p>
                  </CardContent>
                  <DecorativeIcon icon={plan.icon} tone={plan.tone} label={plan.title} size="lg" />
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === 2 && (
          <div data-testid="pool-account-panel" className="relative isolate min-h-52 overflow-hidden rounded-panel border border-line-bright/60 bg-surface-soft/80 p-6 pr-28">
            <CardContent testId="pool-account-content">
              <h2 className="text-xl font-semibold">{c.account}</h2>
              <p className="mt-3 text-muted">{c.accountDesc}</p>
              <button className="primary-button mt-6 rounded-control px-5 py-2.5 font-medium">{accountActions[locale]}</button>
            </CardContent>
            <DecorativeIcon icon="wallet" tone="purple" label={c.account} />
          </div>
        )}
        {tab === 3 && (
          <div data-testid="pool-transfer-panel" className="relative isolate min-h-52 overflow-hidden rounded-panel border border-line-bright/60 bg-surface-soft/80 p-6 pr-28">
            <CardContent testId="pool-transfer-content">
              <h2 className="text-xl font-semibold">{c.transfer}</h2>
              <p className="mt-3 text-muted">{c.transferDesc}</p>
              <button disabled className="mt-6 cursor-not-allowed rounded-control border border-line px-5 py-2.5 text-muted">{c.unavailable}</button>
            </CardContent>
            <DecorativeIcon icon="swap" tone="cyan" label={c.transfer} />
          </div>
        )}
      </div>
    </section>
  );
}
