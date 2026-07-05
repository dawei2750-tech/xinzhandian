import config from "../../tailwind.config";

describe("theme tokens", () => {
  it("does not reuse spacing token names for max widths", () => {
    const spacing = Object.keys(config.theme?.extend?.spacing ?? {});
    const maxWidths = Object.keys(config.theme?.extend?.maxWidth ?? {});

    expect(spacing.filter((token) => maxWidths.includes(token))).toEqual([]);
  });
});
