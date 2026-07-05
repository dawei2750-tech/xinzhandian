import { GlowIcon } from "@/components/ui/glow-icon";
import { SecondaryPageShell } from "@/components/layout/secondary-page-shell";

export default function LoanPage() {
  return <SecondaryPageShell eyebrow="LOAN SERVICE" title="贷款服务" description="贷款申请功能正在准备中。页面先展示完整流程，不提交信息，也不生成虚假额度。" icon="coins" tone="cyan">
    <div className="grid gap-3 lg:grid-cols-[.8fr_1.2fr]">
      <section className="panel relative min-h-64 overflow-hidden p-6"><p className="text-sm text-muted">贷款金额</p><p className="mt-3 text-4xl font-semibold">—</p><p className="mt-2 text-sm text-warning">后台接入后开放</p><GlowIcon name="coins" tone="cyan" label="贷款金额" size="xl" className="absolute bottom-5 right-5 opacity-60" /></section>
      <section className="panel p-6"><h2 className="text-xl font-semibold">贷款申请流程</h2><ol className="mt-5 grid gap-3 text-sm text-muted"><li className="rounded-control border border-line bg-surface-soft p-4"><strong className="mr-3 text-warning">01</strong>下载并填写贷款申请表</li><li className="rounded-control border border-line bg-surface-soft p-4"><strong className="mr-3 text-warning">02</strong>核对申请内容与钱包地址</li><li className="rounded-control border border-line bg-surface-soft p-4"><strong className="mr-3 text-warning">03</strong>后台开放后上传申请表</li></ol><div className="mt-5 flex flex-wrap gap-3"><button disabled className="cursor-not-allowed rounded-control border border-line px-5 py-2.5 text-muted">下载申请表</button><button disabled className="cursor-not-allowed rounded-control border border-line px-5 py-2.5 text-muted">上传申请表</button></div></section>
    </div>
  </SecondaryPageShell>;
}
