"use client";
import { useLocale } from "@/i18n/locale-provider";

const flowItems = [
  "USDC settlement",
  "Daily yield stream",
  "Flexible pool routing",
  "Fixed-term maturity",
  "On-chain proof",
  "Risk control signal",
  "Global volume feed",
  "Tier matched rate",
];

export function DesktopFlowFooter() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN" || locale === "zh-TW";
  const localizedItems = zh ? ["USDC 结算", "每日收益流", "灵活池路由", "定期到期", "链上证明", "风险控制信号", "全球交易量", "档位匹配利率"] : flowItems;
  const lanes = [localizedItems, [...localizedItems].reverse()];
  const stats = [
    ["24H", "$64.94B"],
    ["Plans", "Live"],
    ["Proof", "On-chain"],
  ];

  return (
    <section data-testid="desktop-flow-footer" className="desktop-flow-footer panel" aria-label="On-chain data flow">
      <div className="desktop-flow-roots" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="desktop-flow-copy">
        <p>{zh ? "实时链上路由" : "LIVE ON-CHAIN ROUTING"}</p>
        <h2>{zh ? "每一次储蓄操作之后，资金路径仍持续流转。" : "Capital paths keep moving after every savings action."}</h2>
      </div>
      <div className="desktop-flow-stats" aria-hidden="true">
        {stats.map(([label, value]) => (
          <span key={label}><b>{value}</b><small>{label}</small></span>
        ))}
      </div>
      <div data-testid="desktop-flow-lanes" className="desktop-flow-lanes" aria-hidden="true">
        {lanes.map((lane, index) => (
          <div key={index} data-testid="desktop-flow-lane" className={`desktop-flow-lane desktop-flow-lane-${index + 1}`}>
            {[...lane, ...lane].map((item, itemIndex) => (
              <span key={`${item}-${itemIndex}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
