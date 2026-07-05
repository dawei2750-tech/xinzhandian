import { render, screen } from "@testing-library/react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/types/finance";

const iconNames: IconName[] = [
  "chain", "globe", "wallet", "home", "swap", "mining", "finance", "user",
  "volume", "briefcase", "users", "chart", "vault", "gift", "coins",
  "shield", "contract", "bitcoin", "ethereum", "bnb", "xrp", "doge", "dot", "usdc", "usdt",
];

describe("icon system", () => {
  it("renders every configured icon as an accessible svg", () => {
    render(<>{iconNames.map((name) => <Icon key={name} name={name} label={name} />)}</>);

    expect(screen.getAllByRole("img")).toHaveLength(iconNames.length);
    for (const name of iconNames) {
      const icon = screen.getByRole("img", { name });
      expect(icon).toBeInTheDocument();
      expect(icon.querySelector("path, circle, rect, ellipse")).not.toBeNull();
    }
  });
});
