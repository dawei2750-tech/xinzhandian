import { uiText } from "@/constants/finance";

export function TrendSparkline({ values }: { values: number[] }) {
  const points = values.map((value, index) => `${index * 10},${32 - value}`).join(" ");
  return <svg viewBox="0 0 70 34" className="h-8 w-16 text-success" role="img" aria-label={uiText.upwardTrend}><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}
