import { GlowIcon } from "@/components/ui/glow-icon";
import { SecondaryPageShell } from "@/components/layout/secondary-page-shell";

const documents = [
  { title: "美国财政部白皮书", description: "数字资产、监管与金融体系相关公开资料入口。", tone: "orange" as const },
  { title: "以太坊白皮书", description: "了解以太坊网络、智能合约与去中心化应用基础。", tone: "purple" as const },
];

export default function DocsPage() {
  return <SecondaryPageShell eyebrow="DOCUMENT CENTER" title="文档中心" description="白皮书和规则文件将在审核来源与版本后开放，当前不会跳转到未经确认的外部链接。" icon="contract" tone="orange">
    <section className="grid gap-3 sm:grid-cols-2">{documents.map((document) => <article key={document.title} className="panel relative min-h-60 overflow-hidden p-6"><h2 className="text-xl font-semibold">{document.title}</h2><p className="mt-3 max-w-sm text-sm leading-7 text-muted">{document.description}</p><button disabled className="mt-6 cursor-not-allowed rounded-control border border-line px-5 py-2.5 text-muted">待配置</button><GlowIcon name="contract" tone={document.tone} label={document.title} size="xl" className="absolute bottom-4 right-5 opacity-60" /></article>)}</section>
  </SecondaryPageShell>;
}
