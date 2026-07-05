import { PoolDashboard } from "@/components/finance/pool-dashboard";
import { SecondaryPageShell } from "@/components/layout/secondary-page-shell";

export default function PoolPage() {
  return <SecondaryPageShell eyebrow="ON-CHAIN POOL" title="矿池数据" description="查看储蓄计划、账户与资产转移入口。真实链上数据将在数据源接入后显示。" icon="mining" tone="purple"><PoolDashboard /></SecondaryPageShell>;
}
