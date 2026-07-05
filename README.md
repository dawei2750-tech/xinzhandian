# HB Chain Finance

HB Chain 理财首页静态 UI。项目使用 Next.js App Router、React、TypeScript 与 Tailwind CSS，不连接 API、钱包、后端或智能合约。

## 启动

```powershell
cd C:\Users\Administrator\heibai-workspace\projects\hb-chain-finance
npm.cmd install --registry=https://registry.npmjs.org
npm.cmd run dev
```

打开 `http://127.0.0.1:3000`。

## 验证

```powershell
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
```

## 主要结构

```text
src/
├─ app/                 # App Router 页面、根布局和全局样式
├─ components/
│  ├─ finance/          # 数据卡、功能卡、利率表、优势栏
│  ├─ hero/             # Hero 和 CSS/SVG ETH 视觉
│  ├─ layout/           # 导航、市场横条、移动底栏
│  ├─ market/           # 热门币种和 SVG 趋势折线
│  └─ ui/               # 通用视觉组件
├─ constants/finance.ts # 全部静态展示数据
├─ types/finance.ts     # 数据类型
└─ __tests__/           # 数据与页面渲染测试
tailwind.config.ts      # 颜色、字体、间距、阴影、渐变等 design tokens
```

## 实现边界

- 所有展示数据来自 `src/constants/finance.ts`。
- 颜色、字体、阴影、边框和渐变由 `tailwind.config.ts` 统一管理。
- ETH 与币种装饰使用 CSS/SVG，不使用 WebGL 或 Three.js。
- 页面为纯静态展示，按钮不执行真实业务。
