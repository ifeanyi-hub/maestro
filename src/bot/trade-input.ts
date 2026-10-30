import { getAddress, isAddress } from "ethers";
import { PublicKey } from "@solana/web3.js";

export type DetectedTradeToken =
  | { chain: "solana"; address: string }
  | { chain: "evm"; address: string };

export function detectTradeToken(input: string): DetectedTradeToken | null {
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;

  if (isAddress(value)) {
    return { chain: "evm", address: getAddress(value) };
  }

  try {
    return { chain: "solana", address: new PublicKey(value).toBase58() };
  } catch {
    return null;
  }
}
