# Mobile Content Expansion Design

## Goal

Extend the approved first-round UI with a mobile drawer, an HB Chain-styled banner carousel, and a complete 1–11 “我们的优势” accordion using the reference site's titles and body content.

## Layout

- H5 header gets a hamburger-triggered drawer with 首页、矿池数据、贷款、文档 and language controls. Desktop navigation remains unchanged.
- A three-slide banner carousel sits directly below the shared market ticker and above the page compositions. It uses the existing dark glass, violet/cyan glow and yellow accent palette instead of copying the reference site's yellow-black styling.
- Desktop replaces both reserved statistic placeholders with one advantages column that begins beside the Hero and extends downward. Existing lower content moves up so no blank statistic region remains.
- H5 places the advantages accordion after the two savings tables and before the remaining functional modules.
- Advantages items default collapsed and expose complete body content when opened.

## Data and assets

- Drawer items, three banner definitions, and all eleven FAQ items live in shared constants.
- Banner art is code-native CSS/SVG using the existing icon system; no external hotlinks or copied bitmap assets.
- FAQ 03 uses the screenshot-confirmed title “如何在钱包中质押 USDC？” and the four-step body recovered from the live reference page.

## Verification

- TDD covers shared content counts, mobile-only drawer behavior, banner slides, desktop/mobile placement, and FAQ body expansion.
- Run the full Vitest suite, ESLint, production build and source scan.
- Verify H5 at the user-provided 542×806 viewport, including drawer overlay, banner containment, accordion readability, fixed bottom nav and absence of horizontal overflow.

## Non-goals

- No wallet behavior changes.
- No backend or `shareEnabled` implementation.
- No commit, push or deployment.
