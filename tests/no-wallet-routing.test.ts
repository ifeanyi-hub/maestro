import assert from "node:assert/strict";
import test from "node:test";
import {
  routeNoWalletCallback,
  routeNoWalletCommand,
} from "../src/bot/no-wallet-routing.js";

test("no-wallet home and wallet callbacks keep the import path available", () => {
  assert.equal(routeNoWalletCallback("home"), "welcome");
  assert.equal(routeNoWalletCallback("home_chains"), "wallet-import");
  assert.equal(routeNoWalletCallback("home_wallets"), "wallet-import");
  assert.equal(routeNoWalletCallback("wallets_import"), "wallet-import");
  assert.equal(routeNoWalletCallback("onboard_chain_ethereum"), "continue");
});

test("no-wallet trading and transaction callbacks route to chain selection", () => {
  for (const callback of [
    "home_trade",
    "trade_start_buy",
    "trade_chain_buy_solana",
    "trade_confirm_123",
    "home_snipe",
    "home_copytrade",
    "home_orders",
    "order_new_buy",
    "home_bridge",
    "bridge_solana_evm",
  ]) {
    assert.equal(routeNoWalletCallback(callback), "trading", callback);
  }
});

test("other no-wallet feature callbacks are marked not implemented", () => {
  assert.equal(routeNoWalletCallback("home_signals"), "not-implemented");
  assert.equal(routeNoWalletCallback("home_risk_settings"), "not-implemented");
  assert.equal(routeNoWalletCallback("wallets_portfolio"), "not-implemented");
  assert.equal(routeNoWalletCallback("home_presales"), "not-implemented");
});

test("no-wallet commands route by onboarding and trading intent", () => {
  assert.equal(routeNoWalletCommand("start"), "welcome");
  assert.equal(routeNoWalletCommand("wallets"), "wallet-import");
  assert.equal(routeNoWalletCommand("limit_buy"), "trading");
  assert.equal(routeNoWalletCommand("bridge"), "trading");
  assert.equal(routeNoWalletCommand("portfolio"), "not-implemented");
});
