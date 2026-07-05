import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#030814", surface: "#071120", "surface-soft": "#0a1628",
        line: "#17263d", "line-bright": "#284567", ink: "#f6f8ff",
        muted: "#8d9ab0", subtle: "#56647a", electric: "#2878ff",
        violet: "#7c3cff", cyan: "#19d8ff", success: "#21dc82",
        danger: "#ff415e", warning: "#ff9d2e",
      },
      fontFamily: { sans: ["Inter", "Segoe UI", "Microsoft YaHei", "sans-serif"] },
      fontSize: { market: ["0.625rem", { lineHeight: "1rem" }] },
      borderRadius: { panel: "1rem", control: "0.65rem" },
      boxShadow: {
        panel: "inset 0 1px 0 rgb(255 255 255 / 0.035), 0 18px 50px rgb(0 0 0 / 0.25)",
        glow: "0 0 28px rgb(65 93 255 / 0.3)",
        cyan: "0 0 28px rgb(25 216 255 / 0.22)",
        "icon-blue": "0 0 22px rgb(40 120 255 / 0.36), inset 0 0 18px rgb(40 120 255 / 0.12)",
        "icon-purple": "0 0 22px rgb(124 60 255 / 0.38), inset 0 0 18px rgb(124 60 255 / 0.13)",
        "icon-cyan": "0 0 22px rgb(25 216 255 / 0.34), inset 0 0 18px rgb(25 216 255 / 0.12)",
        "icon-green": "0 0 22px rgb(33 220 130 / 0.32), inset 0 0 18px rgb(33 220 130 / 0.11)",
        "icon-orange": "0 0 22px rgb(255 157 46 / 0.34), inset 0 0 18px rgb(255 157 46 / 0.12)",
        "icon-red": "0 0 22px rgb(255 65 94 / 0.34), inset 0 0 18px rgb(255 65 94 / 0.12)",
      },
      dropShadow: { icon: "0 0 6px currentColor" },
      backgroundImage: {
        "app-canvas": "radial-gradient(circle at 38% 4%, rgb(43 33 118 / 0.28), transparent 34%), radial-gradient(circle at 80% 35%, rgb(0 118 190 / 0.14), transparent 30%), linear-gradient(180deg, #030814 0%, #020713 100%)",
        grid: "linear-gradient(rgb(84 117 174 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(84 117 174 / 0.045) 1px, transparent 1px)",
        stars: "radial-gradient(circle, rgb(105 151 255 / 0.45) 1px, transparent 1.5px)",
        "brand-gradient": "linear-gradient(100deg, #8a39ff 0%, #2878ff 55%, #19d8ff 100%)",
        "button-gradient": "linear-gradient(105deg, #7c22ff 0%, #235cff 100%)",
        "hero-glow": "radial-gradient(circle, rgb(43 101 255 / 0.38) 0%, rgb(73 27 255 / 0.12) 35%, transparent 68%)",
      },
      backgroundSize: { grid: "2.5rem 2.5rem", stars: "4.5rem 4.5rem" },
      spacing: { page: "1rem", "nav-h": "4rem", "mobile-nav": "4.75rem" },
      maxWidth: { content: "100rem" },
      gridTemplateColumns: { market: "1.35fr 1fr .75fr .9fr .55fr" },
    },
  },
};

export default config;
