"use client";

import { useState, type CSSProperties } from "react";
import { actionLinks } from "@/constants/links";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

type SpotlightKey = "fixed" | "mystery" | "invite" | "contract" | "chain";
type SpotlightItem = { key: SpotlightKey; title: string; eyebrow: string; detail: string; action: string; href?: string };

const spotlightCopy: Record<Locale, SpotlightItem[]> = {
  en: [
  { key: "fixed", title: "Smart Contract", eyebrow: "CONTRACT PATH", detail: "Choose a smart contract plan and view the matched maturity yield route.", href: actionLinks.fixedSavings, action: "View Plans" },
  { key: "mystery", title: "Mystery Box", eyebrow: "REWARD", detail: "Reward events stay visible here while the activity page is prepared.", action: "Preparing" },
  { key: "invite", title: "Invite Friends", eyebrow: "MEMBER", detail: "Non-high-net-worth members cannot share dividend vouchers.", action: "Unavailable" },
  { key: "contract", title: "Contract Proof", eyebrow: "PROOF", detail: "Savings routes are presented with contract-driven proof signals.", href: "/docs", action: "Read Proof" },
  { key: "chain", title: "Multi-chain Proof", eyebrow: "NETWORK", detail: "EVM and TRON paths are organized as separate on-chain settlement lanes.", href: "/docs", action: "Explore" },
  ],
  "zh-CN": [
    { key: "fixed", title: "智能合约", eyebrow: "合约路径", detail: "进入智能合约计划页，查看按钱包资产匹配的收益路线。", href: actionLinks.fixedSavings, action: "查看计划" },
    { key: "mystery", title: "盲盒抽奖", eyebrow: "福利活动", detail: "活动页面准备中，奖励入口保留展示。", action: "敬请期待" },
    { key: "invite", title: "邀请好友", eyebrow: "会员权益", detail: "非高净值会员，无法分享分红凭证。", action: "暂不可用" },
    { key: "contract", title: "合约凭证", eyebrow: "链上证明", detail: "储蓄路线以智能合约信号展示，便于后续核验。", href: "/docs", action: "查看说明" },
    { key: "chain", title: "多链证明", eyebrow: "网络路径", detail: "EVM 与 TRON 分为独立链上结算通道。", href: "/docs", action: "了解更多" },
  ],
  "zh-TW": [
    { key: "fixed", title: "智能合約", eyebrow: "合約路徑", detail: "進入智能合約計畫頁，查看按錢包資產匹配的收益路線。", href: actionLinks.fixedSavings, action: "查看計畫" },
    { key: "mystery", title: "盲盒抽獎", eyebrow: "福利活動", detail: "活動頁面準備中，獎勵入口保留展示。", action: "敬請期待" },
    { key: "invite", title: "邀請好友", eyebrow: "會員權益", detail: "非高淨值會員，無法分享分紅憑證。", action: "暫不可用" },
    { key: "contract", title: "合約憑證", eyebrow: "鏈上證明", detail: "儲蓄路線以智能合約信號展示，便於後續核驗。", href: "/docs", action: "查看說明" },
    { key: "chain", title: "多鏈證明", eyebrow: "網路路徑", detail: "EVM 與 TRON 分為獨立鏈上結算通道。", href: "/docs", action: "了解更多" },
  ],
  ja: [
    { key: "fixed", title: "スマートコントラクト", eyebrow: "CONTRACT", detail: "スマートコントラクト計画ページで、資産に合う収益ルートを確認します。", href: actionLinks.fixedSavings, action: "計画を見る" },
    { key: "mystery", title: "ミステリーボックス", eyebrow: "REWARD", detail: "イベントページの準備中も報酬入口を表示します。", action: "準備中" },
    { key: "invite", title: "友達を招待", eyebrow: "MEMBER", detail: "高純資産会員以外は配当証明を共有できません。", action: "利用不可" },
    { key: "contract", title: "契約証明", eyebrow: "PROOF", detail: "貯蓄ルートは契約シグナルとして表示されます。", href: "/docs", action: "説明を見る" },
    { key: "chain", title: "マルチチェーン証明", eyebrow: "NETWORK", detail: "EVM と TRON は別々の決済レーンで整理されます。", href: "/docs", action: "詳しく見る" },
  ],
  ko: [
    { key: "fixed", title: "스마트 계약", eyebrow: "CONTRACT", detail: "스마트 계약 계획 페이지에서 자산에 맞는 수익 경로를 확인합니다.", href: actionLinks.fixedSavings, action: "계획 보기" },
    { key: "mystery", title: "미스터리 박스", eyebrow: "REWARD", detail: "이벤트 페이지가 준비되는 동안 보상 입구를 표시합니다.", action: "준비 중" },
    { key: "invite", title: "친구 초대", eyebrow: "MEMBER", detail: "고액 순자산 회원이 아니면 배당 바우처를 공유할 수 없습니다.", action: "사용 불가" },
    { key: "contract", title: "계약 증명", eyebrow: "PROOF", detail: "저축 경로는 계약 기반 증명 신호로 표시됩니다.", href: "/docs", action: "설명 보기" },
    { key: "chain", title: "멀티체인 증명", eyebrow: "NETWORK", detail: "EVM 과 TRON 경로는 별도 온체인 결제 레인으로 구성됩니다.", href: "/docs", action: "더 보기" },
  ],
  th: [
    { key: "fixed", title: "สมาร์ตคอนแทรกต์", eyebrow: "CONTRACT", detail: "เข้าสู่หน้าแผนสมาร์ตคอนแทรกต์เพื่อดูเส้นทางผลตอบแทนที่จับคู่กับสินทรัพย์", href: actionLinks.fixedSavings, action: "ดูแผน" },
    { key: "mystery", title: "กล่องสุ่ม", eyebrow: "REWARD", detail: "ทางเข้ารางวัลยังแสดงไว้ระหว่างเตรียมหน้ากิจกรรม", action: "กำลังเตรียม" },
    { key: "invite", title: "เชิญเพื่อน", eyebrow: "MEMBER", detail: "สมาชิกที่ไม่ใช่มูลค่าสุทธิสูงไม่สามารถแชร์ใบรับรองปันผลได้", action: "ยังไม่พร้อม" },
    { key: "contract", title: "หลักฐานสัญญา", eyebrow: "PROOF", detail: "เส้นทางการออมแสดงด้วยสัญญาณหลักฐานจากสัญญา", href: "/docs", action: "อ่านเพิ่ม" },
    { key: "chain", title: "หลักฐานหลายเชน", eyebrow: "NETWORK", detail: "เส้นทาง EVM และ TRON ถูกจัดเป็นเลนชำระบัญชีแยกกัน", href: "/docs", action: "สำรวจ" },
  ],
};

export function MobileSpotlightHub() {
  const { locale } = useLocale();
  const spotlightItems = spotlightCopy[locale];
  const [activeKey, setActiveKey] = useState<SpotlightKey>("fixed");
  const active = spotlightItems.find((item) => item.key === activeKey) ?? spotlightItems[0];

  return (
    <section data-testid="spotlight-hub" className="mobile-spotlight-hub lg:hidden" aria-label="Savings feature spotlight">
      <div data-testid="spotlight-core" className="spotlight-core" aria-hidden="true"><span /><span /></div>
      <div className="spotlight-beam-stage">
        {spotlightItems.map((item, index) => (
          <button
            key={item.key}
            type="button"
            data-testid="spotlight-beam"
            className={`spotlight-beam spotlight-beam-${item.key} ${item.key === active.key ? "spotlight-beam-active" : ""}`}
            style={{ "--beam-index": index } as CSSProperties}
            onClick={() => setActiveKey(item.key)}
            onFocus={() => setActiveKey(item.key)}
            onPointerEnter={() => setActiveKey(item.key)}
          >
            <span className="spotlight-beam-ray" aria-hidden="true" />
            <span className="spotlight-beam-label"><span>{item.eyebrow}</span><strong>{item.title}</strong></span>
          </button>
        ))}
      </div>
      <div data-testid="spotlight-active-panel" className="spotlight-active-panel">
        <span>{active.eyebrow}</span>
        <strong>{active.title}</strong>
        <p>{active.detail}</p>
        {active.href ? <a href={active.href}>{active.action}</a> : <button type="button">{active.action}</button>}
      </div>
    </section>
  );
}
