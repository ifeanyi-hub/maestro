import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_RPC_ENDPOINTS } from "../src/config/defaults.js";
import { loadConfig } from "../src/config/env.js";

const requiredEnvironment = {
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_OWNER_ID: "123456",
  VAULT_MASTER_KEY: "a".repeat(64),
};

test("chain RPC configuration falls back to public endpoints without API keys", () => {
  const config = loadConfig(requiredEnvironment);

  assert.equal(config.solanaRpcHttp, DEFAULT_RPC_ENDPOINTS.solanaHttp);
  assert.equal(config.solanaRpcWss, DEFAULT_RPC_ENDPOINTS.solanaWebSocket);
  assert.equal(config.evmRpcHttp, DEFAULT_RPC_ENDPOINTS.evmHttp);
  assert.equal(config.evmRpcWss, DEFAULT_RPC_ENDPOINTS.evmWebSocket);
  assert.equal(
    config.solanaJitoBlockEngine,
    DEFAULT_RPC_ENDPOINTS.solanaJitoBlockEngine,
  );
  assert.equal(config.evmFlashbotsRpc, DEFAULT_RPC_ENDPOINTS.evmFlashbots);
});

test("configured chain endpoints override public RPC defaults", () => {
  const config = loadConfig({
    ...requiredEnvironment,
    SOLANA_RPC_HTTP: "https://solana.example/rpc",
    SOLANA_RPC_WSS: "wss://solana.example/ws",
    EVM_RPC_HTTP: "https://evm.example/rpc",
    EVM_RPC_WSS: "wss://evm.example/ws",
  });

  assert.equal(config.solanaRpcHttp, "https://solana.example/rpc");
  assert.equal(config.solanaRpcWss, "wss://solana.example/ws");
  assert.equal(config.evmRpcHttp, "https://evm.example/rpc");
  assert.equal(config.evmRpcWss, "wss://evm.example/ws");
});

test("invalid configured RPC endpoints are rejected", () => {
  assert.throws(
    () =>
      loadConfig({
        ...requiredEnvironment,
        EVM_RPC_HTTP: "wss://wrong-protocol.example",
      }),
    /EVM_RPC_HTTP must use http: or https:/,
  );
});
