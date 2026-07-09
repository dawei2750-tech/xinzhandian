import type { Locale } from "./locales";

type FinanceCopy = {
  rates: { amount: string; daily: string; flexible: string; flexibleNote: string; fixed: string; fixedNote: string };
  sections: { advantages: string; popular: string; more: string };
  features: readonly [readonly [string,string,string,string,string], readonly [string,string,string,string,string], readonly [string,string,string,string,string]];
  quick: readonly [readonly [string,string], readonly [string,string], readonly [string,string], readonly [string,string]];
  benefits: readonly [readonly [string,string], readonly [string,string], readonly [string,string], readonly [string,string]];
  coins: readonly string[]; coinColumns: readonly string[];
  advantages: readonly string[]; advantageBody: string;
};

type SavingsCalculatorCopy = {
  savingsType: string;
  flexible: string;
  fixed: string;
  deposit: string;
  fixedTerm: string;
  days: string;
  matchedTier: string;
  matchedRate: string;
  maturityInterest: string;
  dailyInterest: string;
  flexibleExplanation: string;
  fixedExplanation: (term: number) => string;
  estimateOnly: string;
};

type SavingsCommandCopy = {
  title: string;
  signal: string;
  metrics: readonly (readonly [string, string])[];
  calculator: SavingsCalculatorCopy;
};

const copy: Record<Locale, FinanceCopy> = {
  en: {
    rates:{amount:"Deposit Amount (USDC)",daily:"Daily Interest",flexible:"Flexible Savings Rates",flexibleNote:"Deposit and withdraw anytime",fixed:"Fixed Savings Rates",fixedNote:"Fixed term"},
    sections:{advantages:"Our Advantages",popular:"Popular Coins",more:"More"},
    features:[["Mystery Box","Every entry wins","Top reward","8888 USDC","Draw Now"],["Invite Friends","Premium rewards","Maximum rebate","15%","Invite Now"],["Flexible Savings","Deposit anytime","Earn","Tiered yield","View Plans"]],
    quick:[["Mystery Box","Every entry wins"],["Invite Friends","Up to 15% rebate"],["Flexible Savings","Earn platform tokens"],["Fixed Savings","Daily interest up to 11%"]],
    benefits:[["Secure and Reliable","Multi-layer audits protect assets"],["Smart Contracts","Transparent and verifiable on-chain"],["Multi-chain Support","Supports 12+ major networks"],["Global Operations","Compliance-oriented global service"]],
    coins:["Bitcoin","Ethereum","BNB","XRP","Dogecoin","Polkadot"], coinColumns:["Coin","Price","24H Change","24H Volume","Trend"],
    advantages:["Rewards Program","Blockchain Savings Cash Service","How to stake USDC in your wallet","How to invite friends","What is Blockchain Savings","How Blockchain Savings works","Is Blockchain Savings secure","Our development journey","Blockchain Savings plans","Participant guide","How to join"],
    advantageBody:"Review the applicable plan, supported network, wallet authorization, fees, returns, and exit rules before participating. All actions are transparent and verifiable on-chain; contact support if you need assistance.",
  },
  "zh-CN": {
    rates:{amount:"存款金额（USDC）",daily:"每日利率（Daily Interest）",flexible:"灵活储蓄利率表",flexibleNote:"随存随取",fixed:"定期储蓄利率表",fixedNote:"固定期限"}, sections:{advantages:"我们的优势",popular:"热门币种",more:"更多"},
    features:[["盲盒抽奖","100%中奖","最高奖励","8888 USDC","去抽奖"],["邀请好友","享高额返佣","最高返佣","15%","立即邀请"],["灵活储蓄","随存随取","赚取","档位收益","查看计划"]], quick:[["盲盒抽奖","100%中奖"],["邀请好友","最高返佣15%"],["灵活储蓄","赚取档位收益"],["定期储蓄","每日利率最高11%"]], benefits:[["安全可靠","多重审计，保障资产安全"],["智能合约","公开透明，链上可验证"],["多链支持","支持12+主流公链"],["全球合规","合规运营，服务全球"]], coins:["比特币","以太坊","币安币","瑞波币","狗狗币","波卡币"], coinColumns:["币种","价格","24H涨跌","24H成交额","趋势"], advantages:["福利活动","Blockchain Savings 现金服务","如何在钱包中质押 USDC","如何邀请朋友加入","什么是 Blockchain Savings","Blockchain Savings 的工作原理","Blockchain Savings 安全可靠吗","Blockchain Savings 的发展历程","Blockchain Savings 储蓄计划","参与者须知","如何加入"], advantageBody:"参与前请核对计划、支持网络、钱包授权、费用、收益和退出规则。所有操作均公开透明并可在链上验证，如需帮助请联系在线支持。",
  },
  "zh-TW": {
    rates:{amount:"存款金額（USDC）",daily:"每日利率（Daily Interest）",flexible:"靈活儲蓄利率表",flexibleNote:"隨存隨取",fixed:"定期儲蓄利率表",fixedNote:"固定期限"}, sections:{advantages:"我們的優勢",popular:"熱門幣種",more:"更多"},
    features:[["盲盒抽獎","100%中獎","最高獎勵","8888 USDC","立即抽獎"],["邀請好友","享高額返佣","最高返佣","15%","立即邀請"],["流動性挖礦","提供流動性","賺取","平台代幣","立即參與"]], quick:[["盲盒抽獎","100%中獎"],["邀請好友","最高返佣15%"],["流動性挖礦","賺取平台代幣"],["定期儲蓄","每日利率最高11%"]], benefits:[["安全可靠","多重稽核保障資產安全"],["智能合約","公開透明，鏈上可驗證"],["多鏈支援","支援12+主流公鏈"],["全球合規","合規營運，服務全球"]], coins:["比特幣","以太幣","幣安幣","瑞波幣","狗狗幣","波卡幣"], coinColumns:["幣種","價格","24H漲跌","24H成交額","趨勢"], advantages:["福利活動","Blockchain Savings 現金服務","如何在錢包中質押 USDC","如何邀請朋友加入","什麼是 Blockchain Savings","Blockchain Savings 的運作方式","Blockchain Savings 安全可靠嗎","Blockchain Savings 的發展歷程","Blockchain Savings 儲蓄計畫","參與者須知","如何加入"], advantageBody:"參與前請核對計畫、支援網路、錢包授權、費用、收益與退出規則。所有操作均公開透明並可在鏈上驗證，如需協助請聯絡線上支援。",
  },
  ja: {
    rates:{amount:"預入金額（USDC）",daily:"日次金利（Daily Interest）",flexible:"フレキシブル貯蓄金利",flexibleNote:"いつでも入出金可能",fixed:"定期貯蓄金利",fixedNote:"固定期間"}, sections:{advantages:"選ばれる理由",popular:"人気の通貨",more:"もっと見る"},
    features:[["ミステリーボックス","必ず当選","最高報酬","8888 USDC","抽選する"],["友達を招待","特別報酬","最大還元","15%","今すぐ招待"],["流動性マイニング","流動性を提供","獲得","プラットフォームトークン","参加する"]], quick:[["ミステリーボックス","必ず当選"],["友達を招待","最大15%還元"],["流動性マイニング","トークンを獲得"],["定期貯蓄","日次金利は最大11%"]], benefits:[["安全性と信頼性","多層監査で資産を保護"],["スマートコントラクト","透明でオンチェーン検証可能"],["マルチチェーン対応","主要12以上のネットワークに対応"],["グローバル運営","コンプライアンス重視のサービス"]], coins:["ビットコイン","イーサリアム","BNB","XRP","ドージコイン","ポルカドット"], coinColumns:["通貨","価格","24H変動","24H取引高","トレンド"], advantages:["特典プログラム","現金サービス","ウォレットでUSDCをステークする方法","友達を招待する方法","Blockchain Savingsとは","仕組みについて","安全性について","サービスの歩み","貯蓄プラン","参加前の確認事項","参加方法"], advantageBody:"参加前にプラン、対応ネットワーク、ウォレット承認、手数料、収益、解約条件をご確認ください。操作はオンチェーンで透明に検証できます。サポートが必要な場合はお問い合わせください。",
  },
  ko: {
    rates:{amount:"예치 금액 (USDC)",daily:"일일 이자율 (Daily Interest)",flexible:"자유 적립 금리",flexibleNote:"언제든 입출금",fixed:"정기 적립 금리",fixedNote:"고정 기간"}, sections:{advantages:"주요 장점",popular:"인기 코인",more:"더보기"},
    features:[["미스터리 박스","100% 당첨","최고 보상","8888 USDC","추첨하기"],["친구 초대","프리미엄 리워드","최대 리베이트","15%","지금 초대"],["유동성 채굴","유동성 제공","획득","플랫폼 토큰","참여하기"]], quick:[["미스터리 박스","100% 당첨"],["친구 초대","최대 15% 리베이트"],["유동성 채굴","플랫폼 토큰 획득"],["정기 적립","일일 이자율 최대 11%"]], benefits:[["안전성과 신뢰성","다중 감사를 통한 자산 보호"],["스마트 계약","투명하고 온체인 검증 가능"],["멀티체인 지원","12개 이상의 주요 네트워크 지원"],["글로벌 운영","규정 준수 중심의 글로벌 서비스"]], coins:["비트코인","이더리움","BNB","XRP","도지코인","폴카닷"], coinColumns:["코인","가격","24H 변동","24H 거래량","추세"], advantages:["리워드 프로그램","현금 서비스","지갑에서 USDC 스테이킹하기","친구 초대 방법","Blockchain Savings 소개","운영 방식","보안 안내","서비스 발전 과정","적립 플랜","참여자 안내","참여 방법"], advantageBody:"참여 전에 플랜, 지원 네트워크, 지갑 승인, 수수료, 수익 및 종료 조건을 확인하세요. 모든 작업은 온체인에서 투명하게 검증할 수 있으며 도움이 필요하면 지원팀에 문의할 수 있습니다.",
  },
  th: {
    rates:{amount:"จำนวนเงินฝาก (USDC)",daily:"ดอกเบี้ยรายวัน (Daily Interest)",flexible:"อัตราออมทรัพย์แบบยืดหยุ่น",flexibleNote:"ฝากและถอนได้ทุกเมื่อ",fixed:"อัตราออมทรัพย์แบบกำหนดเวลา",fixedNote:"ระยะเวลาคงที่"}, sections:{advantages:"จุดเด่นของเรา",popular:"เหรียญยอดนิยม",more:"เพิ่มเติม"},
    features:[["กล่องสุ่ม","ได้รับรางวัลทุกครั้ง","รางวัลสูงสุด","8888 USDC","สุ่มเลย"],["เชิญเพื่อน","รับรางวัลพิเศษ","เงินคืนสูงสุด","15%","เชิญเลย"],["ขุดสภาพคล่อง","เพิ่มสภาพคล่อง","รับ","โทเคนแพลตฟอร์ม","เข้าร่วม"]], quick:[["กล่องสุ่ม","ได้รับรางวัลทุกครั้ง"],["เชิญเพื่อน","เงินคืนสูงสุด 15%"],["ขุดสภาพคล่อง","รับโทเคนแพลตฟอร์ม"],["ออมแบบกำหนดเวลา","ดอกเบี้ยรายวันสูงสุด 11%"]], benefits:[["ปลอดภัยและเชื่อถือได้","การตรวจสอบหลายชั้นช่วยปกป้องสินทรัพย์"],["สมาร์ตคอนแทรกต์","โปร่งใสและตรวจสอบบนเชนได้"],["รองรับหลายเชน","รองรับเครือข่ายหลักมากกว่า 12 แห่ง"],["ดำเนินงานทั่วโลก","บริการที่ให้ความสำคัญกับการปฏิบัติตามกฎ"]], coins:["Bitcoin","Ethereum","BNB","XRP","Dogecoin","Polkadot"], coinColumns:["เหรียญ","ราคา","เปลี่ยนแปลง 24H","ปริมาณ 24H","แนวโน้ม"], advantages:["โปรแกรมรางวัล","บริการเงินสด","วิธีสเตก USDC ในวอลเล็ต","วิธีเชิญเพื่อน","Blockchain Savings คืออะไร","หลักการทำงาน","ความปลอดภัย","เส้นทางการพัฒนา","แผนการออม","คำแนะนำสำหรับผู้เข้าร่วม","วิธีเข้าร่วม"], advantageBody:"โปรดตรวจสอบแผน เครือข่ายที่รองรับ การอนุญาตวอลเล็ต ค่าธรรมเนียม ผลตอบแทน และเงื่อนไขการออกก่อนเข้าร่วม ทุกขั้นตอนโปร่งใสและตรวจสอบได้บนเชน หากต้องการความช่วยเหลือโปรดติดต่อฝ่ายสนับสนุน",
  },
};

export const savingsCommandCopy: Record<Locale, SavingsCommandCopy> = {
  en: {
    title: "SAVINGS COMMAND CENTER",
    signal: "LIVE PLAN DATA",
    metrics: [["Matched Tier", "Auto"], ["Daily Interest", "Tier Based"], ["Maturity", "Once"], ["Settlement", "On Rules"]],
    calculator: {
      savingsType: "Savings type",
      flexible: "Flexible savings",
      fixed: "Fixed savings",
      deposit: "Deposit amount",
      fixedTerm: "Fixed term",
      days: "days",
      matchedTier: "Matched tier",
      matchedRate: "Matched rate",
      maturityInterest: "Maturity interest",
      dailyInterest: "Daily interest",
      flexibleExplanation: "Flexible savings estimates interest generated per day from the matched amount tier.",
      fixedExplanation: (term) => `Fixed savings interest is amount x matched tier rate, paid once at maturity. The ${term}-day term controls the lock duration only.`,
      estimateOnly: "Estimate only. Actual settlement follows the current plan rules.",
    },
  },
  "zh-CN": {
    title: "储蓄数据舱",
    signal: "实时计划数据",
    metrics: [["匹配档位", "自动匹配"], ["每日利息", "按档位计算"], ["到期收益", "一次结算"], ["结算规则", "按计划执行"]],
    calculator: {
      savingsType: "储蓄类型",
      flexible: "灵活储蓄",
      fixed: "定期储蓄",
      deposit: "存入金额",
      fixedTerm: "锁定期限",
      days: "天",
      matchedTier: "匹配档位",
      matchedRate: "匹配利率",
      maturityInterest: "到期收益",
      dailyInterest: "每日利息",
      flexibleExplanation: "灵活储蓄按匹配金额档位估算每日产生的利息。",
      fixedExplanation: (term) => `定期储蓄按金额 x 匹配档位利率计算，到期一次性结算。${term} 天期限只决定锁定时间。`,
      estimateOnly: "仅为估算，实际结算以当前计划规则为准。",
    },
  },
  "zh-TW": {
    title: "儲蓄數據艙",
    signal: "即時計畫數據",
    metrics: [["匹配檔位", "自動匹配"], ["每日利息", "按檔位計算"], ["到期收益", "一次結算"], ["結算規則", "按計畫執行"]],
    calculator: {
      savingsType: "儲蓄類型",
      flexible: "靈活儲蓄",
      fixed: "定期儲蓄",
      deposit: "存入金額",
      fixedTerm: "鎖定期限",
      days: "天",
      matchedTier: "匹配檔位",
      matchedRate: "匹配利率",
      maturityInterest: "到期收益",
      dailyInterest: "每日利息",
      flexibleExplanation: "靈活儲蓄按匹配金額檔位估算每日產生的利息。",
      fixedExplanation: (term) => `定期儲蓄按金額 x 匹配檔位利率計算，到期一次性結算。${term} 天期限只決定鎖定時間。`,
      estimateOnly: "僅為估算，實際結算以目前計畫規則為準。",
    },
  },
  ja: {
    title: "貯蓄コマンドセンター",
    signal: "ライブプランデータ",
    metrics: [["適用ティア", "自動判定"], ["日次利息", "ティア基準"], ["満期利息", "一括精算"], ["精算ルール", "プラン準拠"]],
    calculator: {
      savingsType: "貯蓄タイプ",
      flexible: "フレキシブル貯蓄",
      fixed: "固定貯蓄",
      deposit: "入金額",
      fixedTerm: "ロック期間",
      days: "日",
      matchedTier: "適用ティア",
      matchedRate: "適用利率",
      maturityInterest: "満期利息",
      dailyInterest: "日次利息",
      flexibleExplanation: "フレキシブル貯蓄は、入金額に一致するティアから1日あたりの利息を見積もります。",
      fixedExplanation: (term) => `固定貯蓄は金額 x 適用ティア利率で計算し、満期時に一括精算します。${term}日の期間はロック時間のみを決めます。`,
      estimateOnly: "これは見積もりです。実際の精算は現在のプランルールに従います。",
    },
  },
  ko: {
    title: "저축 커맨드 센터",
    signal: "실시간 플랜 데이터",
    metrics: [["적용 구간", "자동 매칭"], ["일일 이자", "구간 기준"], ["만기 수익", "일괄 정산"], ["정산 규칙", "플랜 기준"]],
    calculator: {
      savingsType: "저축 유형",
      flexible: "유연 저축",
      fixed: "정기 저축",
      deposit: "예치 금액",
      fixedTerm: "잠금 기간",
      days: "일",
      matchedTier: "적용 구간",
      matchedRate: "적용 금리",
      maturityInterest: "만기 수익",
      dailyInterest: "일일 이자",
      flexibleExplanation: "유연 저축은 예치 금액에 맞는 구간으로 하루 이자를 추정합니다.",
      fixedExplanation: (term) => `정기 저축은 금액 x 적용 구간 금리로 계산하며 만기 시 한 번 정산합니다. ${term}일 기간은 잠금 시간만 결정합니다.`,
      estimateOnly: "예상치이며 실제 정산은 현재 플랜 규칙을 따릅니다.",
    },
  },
  th: {
    title: "ศูนย์ควบคุมการออม",
    signal: "ข้อมูลแผนแบบสด",
    metrics: [["ระดับที่ตรงกัน", "จับคู่อัตโนมัติ"], ["ดอกเบี้ยรายวัน", "ตามระดับ"], ["ผลตอบแทนครบกำหนด", "จ่ายครั้งเดียว"], ["กฎการชำระ", "ตามแผน"]],
    calculator: {
      savingsType: "ประเภทการออม",
      flexible: "ออมแบบยืดหยุ่น",
      fixed: "ออมแบบกำหนดเวลา",
      deposit: "จำนวนฝาก",
      fixedTerm: "ระยะเวลาล็อก",
      days: "วัน",
      matchedTier: "ระดับที่ตรงกัน",
      matchedRate: "อัตราที่ตรงกัน",
      maturityInterest: "ดอกเบี้ยครบกำหนด",
      dailyInterest: "ดอกเบี้ยรายวัน",
      flexibleExplanation: "การออมแบบยืดหยุ่นประเมินดอกเบี้ยรายวันจากระดับยอดฝากที่ตรงกัน",
      fixedExplanation: (term) => `การออมแบบกำหนดเวลาคำนวณจากจำนวนเงิน x อัตราระดับที่ตรงกัน และจ่ายครั้งเดียวเมื่อครบกำหนด ระยะเวลา ${term} วันกำหนดเฉพาะเวลาล็อกเท่านั้น`,
      estimateOnly: "เป็นเพียงการประมาณการ การชำระจริงเป็นไปตามกฎแผนปัจจุบัน",
    },
  },
};

export const getFinanceCopy = (locale: Locale) => copy[locale];

export const chromeCopy: Record<Locale,{promos:readonly (readonly [string,string])[];ticker:readonly string[]}>={
  en:{promos:[["A new way to manage digital assets","Transparent multi-chain savings data"],["Earn USDC with flexible savings","Deposit or withdraw anytime with clear returns"],["Automated on-chain plans","Contract-driven, multi-signature asset management"],["Savings Plan Reward · 3 million ETH","Transparent · Secure · On-chain"]],ticker:["Cryptocurrencies","Exchanges","Market Cap","24H Volume","Market Dominance","On-chain transparency","Multi-signature asset management","Real-time on-chain data","Multi-chain support","Smart contract automation"]},
  "zh-CN":{promos:[["数字资产新方式","多链储蓄与链上透明数据"],["灵活储蓄赚取 USDC","随存随取，收益清晰可见"],["自动执行链上计划","合约驱动，多重签名资产管理"],["储蓄计划奖励 · 3 million ETH","透明 · 安全 · 链上"]],ticker:["加密货币","交易所","市值","24小时量","市场主导","链上公开透明","多重签名资产管理","实时链上数据","多链支持","智能合约自动执行"]},
  "zh-TW":{promos:[["數位資產新方式","多鏈儲蓄與鏈上透明數據"],["靈活儲蓄賺取 USDC","隨存隨取，收益清晰可見"],["自動執行鏈上計畫","合約驅動，多重簽名資產管理"],["儲蓄計畫獎勵 · 3 million ETH","透明 · 安全 · 鏈上"]],ticker:["加密貨幣","交易所","市值","24小時量","市場主導","鏈上公開透明","多重簽名資產管理","即時鏈上數據","多鏈支援","智能合約自動執行"]},
  ja:{promos:[["デジタル資産管理の新しい形","透明なマルチチェーン貯蓄データ"],["フレキシブル貯蓄で USDC を獲得","いつでも入出金でき、収益も明確"],["オンチェーンプランを自動実行","コントラクト駆動のマルチシグ資産管理"],["貯蓄プラン報酬 · 3 million ETH","透明 · 安全 · オンチェーン"]],ticker:["暗号資産","取引所","時価総額","24時間出来高","市場シェア","オンチェーン透明性","マルチシグ資産管理","リアルタイムオンチェーンデータ","マルチチェーン対応","スマートコントラクト自動化"]},
  ko:{promos:[["디지털 자산 관리의 새로운 방식","투명한 멀티체인 적립 데이터"],["자유 적립으로 USDC 획득","언제든 입출금하고 수익을 명확히 확인"],["온체인 플랜 자동 실행","계약 기반 다중 서명 자산 관리"],["적립 플랜 보상 · 3 million ETH","투명 · 안전 · 온체인"]],ticker:["암호화폐","거래소","시가총액","24시간 거래량","시장 점유율","온체인 투명성","다중 서명 자산 관리","실시간 온체인 데이터","멀티체인 지원","스마트 계약 자동화"]},
  th:{promos:[["แนวทางใหม่สำหรับสินทรัพย์ดิจิทัล","ข้อมูลการออมหลายเชนที่โปร่งใส"],["รับ USDC ด้วยการออมแบบยืดหยุ่น","ฝากหรือถอนได้ทุกเมื่อ พร้อมผลตอบแทนที่ชัดเจน"],["ดำเนินแผนบนเชนอัตโนมัติ","จัดการสินทรัพย์แบบหลายลายเซ็นด้วยสัญญา"],["รางวัลแผนการออม · 3 million ETH","โปร่งใส · ปลอดภัย · บนเชน"]],ticker:["คริปโทเคอร์เรนซี","ตลาดซื้อขาย","มูลค่าตลาด","ปริมาณ 24 ชั่วโมง","ส่วนแบ่งตลาด","ความโปร่งใสบนเชน","จัดการสินทรัพย์หลายลายเซ็น","ข้อมูลบนเชนแบบเรียลไทม์","รองรับหลายเชน","สมาร์ตคอนแทรกต์อัตโนมัติ"]},
};
