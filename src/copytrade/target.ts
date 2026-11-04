import { PublicKey } from "@solana/web3.js";
import { isAddress } from "ethers";

export type CopyTargetChain = "solana" | "evm";

export function getCopyTargetChain(target: string): CopyTargetChain | null {
  if (isAddress(target)) return "evm";

  try {
    new PublicKey(target);
    return "solana";
  } catch {
    return null;
  }
}
