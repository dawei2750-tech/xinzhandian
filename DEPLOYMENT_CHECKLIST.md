// 前端部署检查清单

## ✅ 部署前检查清单

### 代码集成
- [x] Web3 钱包服务 (`src/lib/wallet-service.ts`)
- [x] API 客户端 (`src/lib/api-client.ts`)
- [x] 类型定义 (`src/types/web3.ts`)
- [x] 池子页面 (`src/app/pools/page.tsx`)

### 环境配置
- [ ] 复制 `.env.local.example` 为 `.env.local`
- [ ] 确保 `NEXT_PUBLIC_API_URL` 指向后端 API
- [ ] 检查所有合约地址是否正确

### 本地测试
```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发
npm run dev

# 3. 打开浏览器测试
# http://localhost:3000/pools
```

### 部署步骤

#### 步骤 1: 更新代码
```bash
# 将新文件添加到 main 分支
git add .
git commit -m "add web3 wallet integration and api client"
git push origin main
```

#### 步骤 2: Vercel 自动部署
- 前端已连接 Vercel
- push 到 main 分支后，Vercel 会自动部署
- 检查部署状态: https://vercel.com/dashboard

#### 步骤 3: 生产环境配置
在 Vercel 环境变量中添加:
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

### 功能测试

#### 钱包连接
- [ ] MetaMask 连接成功
- [ ] 切换网络成功
- [ ] 显示用户地址

#### 池子信息
- [ ] 加载所有池子
- [ ] 显示 APY 和 TVL
- [ ] 区分定期和活期

#### 授权流程
- [ ] Step 1-6: 初始化授权
- [ ] Step 7: 用户签署
- [ ] Step 8: 后端确认

### 常见问题

**Q: 如何测试与后端的连接？**
A: 打开浏览器开发者工具，检查网络标签中的 API 请求

**Q: 白名单检查不工作？**
A: 确保后端已启动且 `NEXT_PUBLIC_API_URL` 正确配置

**Q: 钱包连接不到？**
A: 确保安装了 MetaMask 或其他 EVM 钱包

### 后续步骤

1. **部署合约**
   - 部署 Token 合约 (USDT, USDC, PYUSD)
   - 部署池子合约 (VIP1-VIP7)
   - 更新 `.env` 中的合约地址

2. **集成签名**
   - 接入合约交互逻辑
   - 实现授权和存款功能

3. **测试网验证**
   - 在 Sepolia 测试网测试
   - 在 BSC 测试网测试

### 需要帮助？

查看项目文档：
- 后端 API: `backend/API_REFERENCE.md`
- 前端: `README.md`
- 工作记录: `WORK_RECORD.md`
