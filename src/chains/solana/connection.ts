import { Connection } from "@solana/web3.js";
import { DEFAULT_RPC_ENDPOINTS } from "../../config/defaults.js";

/**
 * @solana/web3.js doesn't expose a public API for WebSocket errors, so this
 * attaches to its internal rpc-websockets client to keep connection errors
 * from crashing the Telegram bot. If a future version renames or removes
 * `_rpcWebSocket`, the handler will need updating.
 */
export function getSolanaConnection(
  http: string = DEFAULT_RPC_ENDPOINTS.solanaHttp,
  wss: string = DEFAULT_RPC_ENDPOINTS.solanaWebSocket,
): Connection {
  const connection = new Connection(http, { commitment: "confirmed", wsEndpoint: wss });

  (connection as any)._rpcWebSocket?.on("error", (err: Error) => {
    console.error(
      `[solana] WebSocket connection failed: ${err.message}\n` +
        "The bot will stay online, but Solana event listening may be unavailable until the provider reconnects or the bot is restarted. Configure SOLANA_RPC_WSS for a more reliable connection."
    );
  });

  return connection;
}

// Known program IDs relevant to new-pool detection.
export const RAYDIUM_AMM_V4 = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
export const PUMPFUN_PROGRAM = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
