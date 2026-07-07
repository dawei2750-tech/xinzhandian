# Desktop Right Rail Design

## Goal

Remove the visible blank area below the desktop savings summary while preserving the existing 9/3 grid, breakpoints, widths, and mobile layout.

## Design

The desktop sidebar remains in the same grid column. It becomes a vertical flex container that stretches to the height of the left content column. `SavingsSnapshot` becomes the flexible final panel, so its visual surface reaches the bottom of the rate tables. The panel keeps the existing plan comparison content and gains compact plan-flow and protection details to make the added height intentional rather than empty.

No mobile component, breakpoint, column ratio, ticker placement, or navigation structure changes.

## Verification

- Component test proves the desktop sidebar and snapshot carry the stretch classes.
- Existing page tests protect the H5 layout and navigation.
- Run focused tests, full tests, lint, and production build.
- Inspect 1536x1100 PC and 540x1100 H5 screenshots.
