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
  const lanes = [flowItems, [...flowItems].reverse()];

  return (
    <section data-testid="desktop-flow-footer" className="desktop-flow-footer panel" aria-label="On-chain data flow">
      <div className="desktop-flow-roots" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="desktop-flow-copy">
        <p>LIVE ON-CHAIN ROUTING</p>
        <h2>Capital paths keep moving after every savings action.</h2>
      </div>
      <div className="desktop-flow-lanes" aria-hidden="true">
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
