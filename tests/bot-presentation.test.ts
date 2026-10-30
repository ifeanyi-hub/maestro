import assert from "node:assert/strict";
import test from "node:test";
import { FmtString } from "telegraf/format";
import {
  styleBotResponse,
  startWelcome,
  tradingHeading,
  tradingSide,
  tradingStatus,
  triggerDirection,
} from "../src/bot/presentation.js";
import { ONBOARDING_NETWORKS } from "../src/bot/network-catalog.js";

test("plain bot replies receive a visual marker without duplicating existing styling", () => {
  assert.equal(styleBotResponse("Wallet imported."), "✦ Wallet imported.");
  assert.equal(
    styleBotResponse("✨ Wallet imported."),
    "✨ Wallet imported.",
  );
  assert.equal(styleBotResponse("  Wallet imported."), "✦   Wallet imported.");
});

test("callback response styling respects Telegram's text limit", () => {
  const styled = styleBotResponse("Access denied.".repeat(30), 200);
  assert.equal(Array.from(styled).length, 200);
  assert.ok(styled.startsWith("✦ "));
});

test("response styling preserves formatted text entities", () => {
  const styled = styleBotResponse(
    new FmtString("Wallet", [{ type: "bold", offset: 0, length: 6 }]),
  );
  assert.equal(styled.text, "✦ Wallet");
  assert.deepEqual(styled.entities, [
    { type: "bold", offset: 2, length: 6 },
  ]);
});

test("start welcome stays consistent while explaining account access", () => {
  const activeWelcome = startWelcome("justincallz", false, false);
  const pendingWelcome = startWelcome("justincallz", true, true);

  assert.equal(
    activeWelcome.text.split("\n").slice(0, 8).join("\n"),
    pendingWelcome.text.split("\n").slice(0, 8).join("\n"),
  );
  assert.match(activeWelcome.text, /⭐️ Welcome to Maestro, the one-stop solution/);
  assert.match(activeWelcome.text, /Chains: View available networks/);
  assert.match(activeWelcome.text, /Wallets: Import and manage wallets/);
  assert.match(activeWelcome.text, /Global Settings: Customize risk and trading limits/);
  assert.match(activeWelcome.text, /Active Orders: Review active buy\/sell limit orders/);
  assert.match(activeWelcome.text, /Positions: Monitor your portfolio and recent trades/);
  assert.match(activeWelcome.text, /Paste a token CA to start a quoted trade/);
  assert.ok(activeWelcome.entities?.some((entity) => entity.type === "bold"));
  assert.match(activeWelcome.text, /Choose a section below to get started\./);
  assert.match(pendingWelcome.text, /Choose a network and import a wallet/);
  assert.match(pendingWelcome.text, /admin must approve your account/);
  assert.match(
    startWelcome("justincallz", false, true).text,
    /import a wallet to unlock account features/,
  );
  assert.match(startWelcome("  ", false).text, /⭐️ Welcome to Maestro/);
});

test("onboarding shows twenty unique networks without claiming preview support", () => {
  assert.equal(ONBOARDING_NETWORKS.length, 20);
  assert.equal(
    new Set(ONBOARDING_NETWORKS.map((network) => network.id)).size,
    20,
  );
  assert.equal(
    ONBOARDING_NETWORKS.filter((network) => network.connected).map((network) => network.id).join(","),
    "solana,ethereum",
  );
});

test("trading headings use a consistent uppercase section treatment", () => {
  assert.equal(
    tradingHeading("📊", "Portfolio"),
    "📊  PORTFOLIO\n━━━━━━━━━━━━━━━━"
  );
});

test("buy and sell labels use distinct trading colors", () => {
  assert.equal(tradingSide("buy"), "🟢 BUY");
  assert.equal(tradingSide("sell"), "🔴 SELL");
  assert.equal(tradingSide("swap"), "🔹 SWAP");
});

test("trade statuses distinguish success, risk, and unknown outcomes", () => {
  assert.equal(tradingStatus("confirmed"), "✅ CONFIRMED");
  assert.equal(tradingStatus("failed"), "🔴 FAILED");
  assert.equal(tradingStatus("unknown"), "🟠 STATUS UNKNOWN");
  assert.equal(tradingStatus("processing"), "🟡 PROCESSING");
  assert.equal(tradingStatus("completed"), "✅ COMPLETED");
  assert.equal(tradingStatus("custom"), "🔹 CUSTOM");
});

test("limit-order trigger directions display clear arrows", () => {
  assert.equal(triggerDirection("above"), "↗️ ABOVE");
  assert.equal(triggerDirection("below"), "↘️ BELOW");
  assert.equal(triggerDirection("at"), "AT");
});
