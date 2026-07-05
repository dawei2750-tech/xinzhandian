export type Tone = "blue" | "purple" | "cyan" | "green" | "orange" | "red";
export type IconName = "chain" | "globe" | "wallet" | "home" | "swap" | "mining" | "finance" | "user" | "volume" | "briefcase" | "users" | "chart" | "vault" | "gift" | "coins" | "shield" | "contract" | "bitcoin" | "ethereum" | "bnb" | "xrp" | "doge" | "dot" | "usdc" | "usdt";

export interface NavItem { label: string; href: string; icon?: IconName }
export interface MarketItem { label: string; value?: string; change?: string; trend?: "up" | "down" }
export interface PlatformStat { label: string; value: string; change: string; icon: IconName; tone: Tone }
export interface FeatureCard { title: string; subtitle: string; valueLabel?: string; value: string; button: string; icon: IconName; tone: Tone }
export interface Coin { symbol: string; name: string; price: string; change: string; volume: string; icon: IconName; tone: Tone; trend: number[] }
export interface SavingsRate { amount: string; dailyRate: string; annualRate: string }
export interface Benefit { title: string; description: string; icon: IconName; tone: Tone }
export interface SummaryTile { label: string; value: string; icon: IconName; tone: Tone }
export interface QuickAction { title: string; description: string; icon: IconName; tone: Tone }
