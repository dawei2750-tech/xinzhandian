# HB Chain Finance Admin Dashboard

## 简洁质感的管理后台界面

### 特性

- ✨ **现代设计** - 简洁质感的 UI 设计
- 📊 **实时仪表板** - 系统监控和统计
- 🔐 **多签面板** - 管理和批准转账提案
- ⚙️ **维护面板** - 系统配置和应急控制
- 🎨 **响应式布局** - 适配所有设备
- ⚡ **实时更新** - 自动刷新系统状态

### 快速开始

#### 安装依赖
```bash
cd admin-ui
npm install
```

#### 配置环境
```bash
cp .env.example .env.local
# 编辑 .env.local，确保 NEXT_PUBLIC_API_URL 指向后端 API
```

#### 开发模式
```bash
npm run dev
# 打开 http://localhost:3000
```

#### 生产构建
```bash
npm run build
npm start
```

### 页面说明

#### 1. Dashboard（仪表板）
- 系统实时监控
- RPC 节点状态
- 交易统计
- 系统健康检查

#### 2. Multi-Sig Panel（多签面板）
- 查看所有多签提案
- 创建新提案
- 批准或拒绝提案
- 执行已批准的提案
- 实时进度显示

#### 3. Maintenance Panel（维护面板）
- 启用/禁用维护模式
- RPC 节点热切换
- 快速操作（日志、重启等）
- 应急控制

### 界面组件

- **Header** - 顶部导航和系统状态
- **Sidebar** - 左侧菜单导航
- **Dashboard** - 主仪表板
- **StatCard** - 统计卡片
- **MultiSigPanel** - 多签管理
- **MaintenancePanel** - 维护控制

### 样式配置

使用 Tailwind CSS，配置文件：`tailwind.config.ts`

主要颜色方案：
- 主色：Slate（#0f172a）
- 次色：White（#ffffff）
- 背景：Gradient（Slate 50 → 100）

### API 集成

自动连接到后端 API：
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

所有 API 调用通过 `axios` 进行，见组件中的示例。

### 部署

#### Vercel 部署
```bash
# 连接 GitHub 仓库到 Vercel
# 设置环境变量
# 自动部署
```

#### Docker 部署
```bash
docker build -f AdminUI.Dockerfile -t hb-finance-admin .
docker run -p 3000:3000 hb-finance-admin
```

### 性能优化

- ✓ Image optimization
- ✓ Code splitting
- ✓ Lazy loading
- ✓ CSS optimization

### 浏览器支持

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### License

MIT
