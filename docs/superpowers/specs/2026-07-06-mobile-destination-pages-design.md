# Mobile Destination Pages Design

## Goal

Turn the H5 drawer entries into real Next.js routes and add visually complete read-only pages without inventing backend data.

## Routes

- `/` — homepage.
- `/pool` — Pool Data, Plan, Account and Transfer tabs.
- `/loan` — loan amount state, application process and disabled download/upload actions until backend integration.
- `/docs` — US Treasury and Ethereum whitepaper cards with clearly unconfigured actions.
- Language remains an in-drawer control and does not navigate.

## Visual system

- Reuse Header, MarketTicker, MobileBottomNav, panels, gradients and GlowIcon.
- Sparse cards receive bottom/right code-native glow illustrations.
- Desktop uses a centered two-column content grid where useful; H5 uses an independent single-column order.
- Unknown values render as `—` or “连接钱包后显示”, never fabricated statistics.

## Verification

- TDD validates exact drawer hrefs, route headings, disabled actions and non-fabricated states.
- Run full tests, lint and production build.
- In 542×806 Chrome, click drawer entries and verify URL, page heading, fixed bottom nav and no horizontal overflow.

## Non-goals

- No backend, upload, download, wallet, transfer or loan submission implementation.
- No commit, push or deployment.
