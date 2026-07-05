import { tableColumns } from "@/constants/finance";
import type { SavingsRate } from "@/types/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function SavingsRateTable({ title, note, rates, tone }: { title: string; note: string; rates: SavingsRate[]; tone: "violet" | "cyan" }) {
  return <section className={`panel relative overflow-hidden ${tone === "violet" ? "border-violet/40" : "border-cyan/40"}`}><div className="p-5 pb-2"><h2 className="text-lg font-semibold">{title} <span className="text-xs font-normal text-muted">（{note}）</span></h2></div><div className="scrollbar-none relative z-10 overflow-x-auto px-5 pb-5"><table className="w-full min-w-lg text-left text-sm"><thead className="text-xs text-muted"><tr>{tableColumns.map((column) => <th key={column} className="py-2 font-normal">{column}</th>)}</tr></thead><tbody className="divide-y divide-line/60">{rates.map((rate) => <tr key={rate.amount}><td className="py-1.5">{rate.amount}</td><td className="py-1.5 text-violet">{rate.dailyRate}</td><td className="py-1.5 text-cyan">{rate.annualRate}</td></tr>)}</tbody></table></div><div data-testid="rate-illustration" className="pointer-events-none absolute -bottom-4 -right-3 hidden opacity-35 2xl:block"><GlowIcon name={tone === "violet" ? "vault" : "coins"} tone={tone === "violet" ? "purple" : "cyan"} size="xl"/></div></section>;
}
