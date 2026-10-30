import assert from "node:assert/strict";
import test from "node:test";
import { detectTradeToken } from "../src/bot/trade-input.js";

test("direct token input recognizes checksummed EVM addresses", () => {
  assert.deepEqual(
    detectTradeToken("0x0000000000000000000000000000000000000001"),
    {
      chain: "evm",
      address: "0x0000000000000000000000000000000000000001",
    },
  );
});

test("direct token input recognizes Solana public keys", () => {
  assert.deepEqual(
    detectTradeToken("So11111111111111111111111111111111111111112"),
    {
      chain: "solana",
      address: "So11111111111111111111111111111111111111112",
    },
  );
});

test("direct token input ignores non-address and multi-word messages", () => {
  assert.equal(detectTradeToken("not an address"), null);
  assert.equal(
    detectTradeToken("0x0000000000000000000000000000000000000001 now"),
    null,
  );
});
