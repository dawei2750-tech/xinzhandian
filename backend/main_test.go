package main

import "testing"

func TestRuntimeConfigReadsBscRpcFromEnvironment(t *testing.T) {
	t.Setenv("RPC_URL", "https://bsc-testnet-dataseed.bnbchain.org")
	t.Setenv("SPENDER_ADDRESS", "0x1111111111111111111111111111111111111111")
	t.Setenv("SERVER_PORT", "18080")
	t.Setenv("MAINTENANCE_MODE", "true")

	cfg := loadRuntimeConfig(defaultConfig())

	if cfg.RpcURL != "https://bsc-testnet-dataseed.bnbchain.org" {
		t.Fatalf("RpcURL = %q", cfg.RpcURL)
	}
	if cfg.SpenderAddress != "0x1111111111111111111111111111111111111111" {
		t.Fatalf("SpenderAddress = %q", cfg.SpenderAddress)
	}
	if cfg.ServerPort != "18080" {
		t.Fatalf("ServerPort = %q", cfg.ServerPort)
	}
	if !cfg.IsMaintaining {
		t.Fatal("IsMaintaining = false")
	}
}
