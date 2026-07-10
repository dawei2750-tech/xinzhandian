export const localeOptions = [
  { code: "en", label: "EN", name: "English" },
  { code: "zh-CN", label: "简体", name: "简体中文" },
  { code: "zh-TW", label: "繁体", name: "繁體中文" },
  { code: "ja", label: "日本語", name: "日本語" },
  { code: "ko", label: "한국어", name: "한국어" },
  { code: "th", label: "ไทย", name: "ภาษาไทย" },
] as const;

export type Locale = (typeof localeOptions)[number]["code"];

const localeText = {
  en: { navigation: { home: "Home", trade: "Trade", pool: "Savings", finance: "Finance", mysteryBox: "Mystery Box", invite: "Invite", more: "More", account: "Account", poolData: "Smart Contract", loan: "Loan", documents: "Documents", language: "Language" }, hero: { eyebrow: "SECURE · EFFICIENT · TRANSPARENT", description: "Multi-chain support · Smart contract protection · Traceable asset security", primary: "Start Now", secondary: "Learn More" }, common: { openMenu: "Open mobile menu", closeMenu: "Close mobile menu", mobileMenu: "Mobile side menu", mainNavigation: "Main navigation", mobileNavigation: "Mobile navigation", wallet: "ReceiveVoucher" } },
  "zh-CN": { navigation: { home: "首页", trade: "交易", pool: "储蓄", finance: "理财", mysteryBox: "盲盒", invite: "邀请", more: "更多", account: "我的", poolData: "智能合约", loan: "贷款", documents: "文档", language: "语言" }, hero: { eyebrow: "安全 · 高效 · 透明", description: "多链支持 · 智能合约保障 · 资产安全可追溯", primary: "立即体验", secondary: "了解更多" }, common: { openMenu: "打开移动端菜单", closeMenu: "关闭移动端菜单", mobileMenu: "移动端侧边菜单", mainNavigation: "主导航", mobileNavigation: "移动端导航", wallet: "ReceiveVoucher" } },
  "zh-TW": { navigation: { home: "首頁", trade: "交易", pool: "儲蓄", finance: "理財", mysteryBox: "盲盒", invite: "邀請", more: "更多", account: "我的", poolData: "智能合約", loan: "貸款", documents: "文件", language: "語言" }, hero: { eyebrow: "安全 · 高效 · 透明", description: "多鏈支援 · 智能合約保障 · 資產安全可追溯", primary: "立即體驗", secondary: "了解更多" }, common: { openMenu: "開啟行動版選單", closeMenu: "關閉行動版選單", mobileMenu: "行動版側邊選單", mainNavigation: "主導覽", mobileNavigation: "行動版導覽", wallet: "ReceiveVoucher" } },
  ja: { navigation: { home: "ホーム", trade: "取引", pool: "貯蓄", finance: "資産運用", mysteryBox: "ミステリーボックス", invite: "招待", more: "その他", account: "マイページ", poolData: "スマートコントラクト", loan: "ローン", documents: "ドキュメント", language: "言語" }, hero: { eyebrow: "安全 · 効率的 · 透明", description: "マルチチェーン対応 · スマートコントラクト保護 · 追跡可能な資産管理", primary: "今すぐ始める", secondary: "詳しく見る" }, common: { openMenu: "モバイルメニューを開く", closeMenu: "モバイルメニューを閉じる", mobileMenu: "モバイルサイドメニュー", mainNavigation: "メインナビゲーション", mobileNavigation: "モバイルナビゲーション", wallet: "ReceiveVoucher" } },
  ko: { navigation: { home: "홈", trade: "거래", pool: "적립", finance: "자산 관리", mysteryBox: "미스터리 박스", invite: "초대", more: "더보기", account: "내 계정", poolData: "스마트 계약", loan: "대출", documents: "문서", language: "언어" }, hero: { eyebrow: "안전 · 효율 · 투명", description: "멀티체인 지원 · 스마트 계약 보호 · 추적 가능한 자산 보안", primary: "지금 시작", secondary: "자세히 보기" }, common: { openMenu: "모바일 메뉴 열기", closeMenu: "모바일 메뉴 닫기", mobileMenu: "모바일 사이드 메뉴", mainNavigation: "메인 탐색", mobileNavigation: "모바일 탐색", wallet: "ReceiveVoucher" } },
  th: { navigation: { home: "หน้าหลัก", trade: "ซื้อขาย", pool: "การออม", finance: "การออม", mysteryBox: "กล่องสุ่ม", invite: "เชิญเพื่อน", more: "เพิ่มเติม", account: "บัญชีของฉัน", poolData: "สมาร์ตคอนแทรกต์", loan: "สินเชื่อ", documents: "เอกสาร", language: "ภาษา" }, hero: { eyebrow: "ปลอดภัย · มีประสิทธิภาพ · โปร่งใส", description: "รองรับหลายเชน · ปกป้องด้วยสมาร์ตคอนแทรกต์ · ตรวจสอบสินทรัพย์ย้อนหลังได้", primary: "เริ่มใช้งาน", secondary: "ดูข้อมูลเพิ่มเติม" }, common: { openMenu: "เปิดเมนูมือถือ", closeMenu: "ปิดเมนูมือถือ", mobileMenu: "เมนูด้านข้างบนมือถือ", mainNavigation: "เมนูหลัก", mobileNavigation: "เมนูมือถือ", wallet: "ReceiveVoucher" } },
} as const;

export type LocaleText = {
  navigation: Record<keyof (typeof localeText)["en"]["navigation"], string>;
  hero: Record<keyof (typeof localeText)["en"]["hero"], string>;
  common: Record<keyof (typeof localeText)["en"]["common"], string>;
};
export const translations: Record<Locale, LocaleText> = localeText;
export function isLocale(value: string | null): value is Locale { return localeOptions.some(({ code }) => code === value); }
