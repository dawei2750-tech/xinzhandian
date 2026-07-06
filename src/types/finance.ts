export type Tone = "blue" | "purple" | "cyan" | "green" | "orange" | "red";
export type IconName = "chain" | "globe" | "wallet" | "home" | "swap" | "mining" | "finance" | "user" | "volume" | "briefcase" | "users" | "chart" | "vault" | "gift" | "coins" | "shield" | "contract" | "bitcoin" | "ethereum" | "bnb" | "xrp" | "doge" | "dot" | "usdc" | "usdt";

export interface NavItem { label: string; href: string; icon?: IconName }
export interface MarketItem { label: string; value?: string; change?: string; trend?: "up" | "down" }
export interface FeatureCard { title: string; subtitle: string; valueLabel?: string; value: string; button: string; icon: IconName; tone: Tone }
export interface Coin { symbol: string; name: string; price: string; change: string; volume: string; icon: IconName; tone: Tone; trend: number[] }
export interface SavingsRate { amount: string; dailyRate: string }
export interface Benefit { title: string; description: string; icon: IconName; tone: Tone }
export interface QuickAction { title: string; description: string; icon: IconName; tone: Tone }
export interface MobileDrawerItem { label: string; href: string; icon: IconName }
export interface PromoBanner { eyebrow: string; title: string; description: string; icon: IconName; tone: Tone; image?: string }
export interface AdvantageItem { id: string; title: string; body: string[] }
