"use client";

import { useState } from "react";
import { advantages } from "@/constants/finance";
import { advantageBodies } from "@/i18n/advantage-bodies";
import { getFinanceCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";

const mobileNodePositions = [
  ["50%", "5%"],
  ["18%", "21%"],
  ["82%", "21%"],
  ["12%", "38%"],
  ["88%", "38%"],
  ["50%", "46%"],
  ["17%", "58%"],
  ["83%", "58%"],
  ["20%", "70%"],
  ["80%", "70%"],
  ["50%", "79%"],
];

export function AdvantagesPanel({
  anchorId,
  instance,
  className = "",
}: {
  anchorId?: string;
  instance: "desktop" | "mobile";
  className?: string;
}) {
  const desktop = instance === "desktop" && !className.includes("advantages-tree-desktop");
  const [openId, setOpenId] = useState<string | null>(null);
  const { locale } = useLocale();
  const c = getFinanceCopy(locale);

  return (
    <section
      id={anchorId}
      data-testid="advantages-panel"
      className={`panel overflow-hidden ${desktop ? "advantages-panel-desktop" : "advantages-tech-tree-panel"} ${className}`}
    >
      <div className={`${desktop ? "advantages-panel-head" : "advantages-tech-tree-head"} p-5`}>
        <p className="text-xs font-semibold tracking-[0.22em] text-warning">WHY BLOCKCHAIN SAVINGS</p>
        <h2 className="mt-2 text-2xl font-semibold">{c.sections.advantages}</h2>
      </div>

      {desktop ? (
        <>
          <div className="advantages-list">
            {advantages.map((x, i) => {
              const expanded = openId === x.id;
              const body = advantageBodies[locale][i] ?? x.body;
              return (
                <div key={x.id} className="advantage-item">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`${instance}-advantage-${x.id}`}
                    onClick={() => setOpenId(expanded ? null : x.id)}
                    className={`advantage-row ${expanded ? "advantage-row-active" : ""}`}
                  >
                    <span className="advantage-number">{x.id}</span>
                    <span className="min-w-0 flex-1 font-medium">{c.advantages[i]}</span>
                    <span aria-hidden="true" className={`text-xl text-muted transition-transform ${expanded ? "rotate-180" : ""}`}>
                      +
                    </span>
                  </button>
                  {expanded && (
                    <div id={`${instance}-advantage-${x.id}`} data-testid={`${instance}-advantage-body-${x.id}`} className="advantage-body-active">
                      {body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div data-testid="advantages-tech-tree-stage" className="advantages-tech-tree-stage">
          <div aria-hidden="true" className="tech-tree-aura" />
          <div data-testid="advantages-tech-tree-trunk" aria-hidden="true" className="tech-tree-trunk">
            <span />
            <span />
            <span />
          </div>
          <div aria-hidden="true" className="tech-tree-branches">
            {Array.from({ length: 14 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="tech-tree-canopy">
            {advantages.map((x, i) => {
              const expanded = openId === x.id;
              return (
                <button
                  key={x.id}
                  type="button"
                  data-testid="advantages-tech-tree-node"
                  aria-expanded={expanded}
                  aria-controls={`${instance}-advantage-${x.id}`}
                  onClick={() => setOpenId(expanded ? null : x.id)}
                  className={`tech-tree-node ${expanded ? "tech-tree-node-active" : ""}`}
                  style={{ left: mobileNodePositions[i][0], top: mobileNodePositions[i][1] }}
                >
                  <span className="tech-tree-node-id">{x.id}</span>
                  <span className="tech-tree-node-title">{c.advantages[i]}</span>
                </button>
              );
            })}
          </div>
          {advantages.map((x, i) => {
            const expanded = openId === x.id;
            const body = advantageBodies[locale][i] ?? x.body;
            return expanded ? (
              <div key={x.id} id={`${instance}-advantage-${x.id}`} data-testid={`${instance}-advantage-body-${x.id}`} className="tech-tree-detail">
                <strong>
                  <span>{x.id}</span> {c.advantages[i]}
                </strong>
                <div className="mt-3 space-y-2">
                  {body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null;
          })}
          <div data-testid="advantages-tech-tree-roots" aria-hidden="true" className="tech-tree-roots">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
