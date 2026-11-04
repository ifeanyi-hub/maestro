import assert from "node:assert/strict";
import test from "node:test";
import { getCopyTargetChain } from "../src/copytrade/target.js";

test("copy-trade targets are classified by chain", () => {
  assert.equal(
    getCopyTargetChain("So11111111111111111111111111111111111111112"),
    "solana",
  );
  assert.equal(
    getCopyTargetChain("0x0000000000000000000000000000000000000001"),
    "evm",
  );
});

test("invalid copy-trade targets are rejected", () => {
  assert.equal(getCopyTargetChain("not-a-wallet"), null);
});
