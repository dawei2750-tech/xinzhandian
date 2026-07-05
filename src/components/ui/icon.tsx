import type { IconName } from "@/types/finance";

const paths: Record<IconName, React.ReactNode> = {
  chain: <><path d="M9.5 14.5 7 17a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0"/><path d="m14.5 9.5 2.5-2.5a3.5 3.5 0 0 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0"/><path d="m8.5 15.5 7-7"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></>,
  wallet: <><path d="M4 6.5h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h13"/><path d="M16 11h5v4h-5a2 2 0 1 1 0-4Z"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
  swap: <><path d="M4 7h14M15 4l3 3-3 3M20 17H6M9 14l-3 3 3 3"/></>,
  mining: <><path d="m5 4 14 14M7 2l4 4-3 3-4-4ZM14 14l3-3 5 5-3 3Z"/><path d="M3 21h18"/></>,
  finance: <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h3M14 12h2M8 16h3M14 16h2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  volume: <><circle cx="12" cy="12" r="8"/><path d="M12 7v10M9 10v4M15 9v6"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3"/></>,
  users: <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 14a5 5 0 0 1 7 5"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/><path d="m4 8 6-5 6 6 5-5"/></>,
  vault: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M7 8V5a5 5 0 0 1 10 0v3"/><circle cx="12" cy="14" r="3"/><path d="M12 11v6M9 14h6"/></>,
  gift: <><path d="M3 10h18v11H3zM2 6h20v4H2zM12 6v15"/><path d="M12 6c-3-5-8-2-5 1 2 2 5-1 5-1Zm0 0c3-5 8-2 5 1-2 2-5-1-5-1Z"/></>,
  coins: <><ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><ellipse cx="16" cy="16" rx="6" ry="3"/><path d="M10 16v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-3"/></>,
  shield: <><path d="M12 2 20 5v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z"/><path d="m8 12 2.5 2.5L16 9"/></>,
  contract: <><path d="M6 2h9l4 4v16H6zM15 2v5h4M9 11h6M9 15h6M9 19h4"/></>,
  bitcoin: <><path d="M9 5h5a3 3 0 0 1 0 6H9m0 0h6a3 3 0 0 1 0 6H9M11 3v16M15 3v2M15 17v2M7 5h2M7 17h2"/></>,
  ethereum: <><path d="m12 2-7 11 7 4 7-4-7-11Z"/><path d="m5 13 7 9 7-9-7 4-7-4Z"/></>,
  bnb: <><path d="m12 3 4 4-4 4-4-4 4-4ZM6 9l3 3-3 3-3-3 3-3Zm12 0 3 3-3 3-3-3 3-3Zm-6 6 4 4-4 4-4-4 4-4Z"/></>,
  xrp: <path d="M4 6c2 0 3 1 5 3l3 3 3-3c2-2 3-3 5-3M4 18c2 0 3-1 5-3l3-3 3 3c2 2 3 3 5 3"/>,
  doge: <><path d="M8 4h5a8 8 0 0 1 0 16H8V4Z"/><path d="M4 12h10M8 8h5M8 16h5"/></>,
  dot: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="2.5" r="1"/><circle cx="12" cy="21.5" r="1"/><circle cx="2.5" cy="12" r="1"/><circle cx="21.5" cy="12" r="1"/></>,
  usdc: <><circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-.7-1.8-1-3-1-2 0-3.5 1-3.5 2.6 0 3.9 7 1.7 7 5.4 0 1.6-1.5 2.7-3.5 2.7-1.3 0-2.5-.4-3.4-1.2M12 5.5v13"/></>,
  usdt: <><circle cx="12" cy="12" r="9"/><path d="M7 7h10M12 7v10M8.5 10.5h7M8 14c2.6 1 5.4 1 8 0"/></>,
};

export function Icon({ name, label, className = "" }: { name: IconName; label?: string; className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
