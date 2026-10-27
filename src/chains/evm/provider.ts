import { WebSocketProvider, JsonRpcProvider } from "ethers";
import { DEFAULT_RPC_ENDPOINTS } from "../../config/defaults.js";

/**
 * ethers' WebSocketProvider doesn't attach an error handler to its
 * underlying `ws` socket, so a connection failure emits an unhandled error
 * event. Log the failure without taking down the Telegram bot; the event
 * listener may need a restart if the provider does not reconnect.
 */
export function getEvmWsProvider(
  url: string = DEFAULT_RPC_ENDPOINTS.evmWebSocket,
): WebSocketProvider {
  const provider = new WebSocketProvider(url);
  provider.websocket.onerror = (err: Error) => {
    console.error(
      `[evm] WebSocket connection failed: ${err.message}\n` +
        "The bot will stay online, but EVM event listening may be unavailable until the provider reconnects or the bot is restarted. Configure EVM_RPC_WSS for a more reliable connection."
    );
  };
  return provider;
}

export function getEvmHttpProvider(
  url: string = DEFAULT_RPC_ENDPOINTS.evmHttp,
): JsonRpcProvider {
  return new JsonRpcProvider(url);
}

export const UNISWAP_V2_FACTORY_ABI = [
  "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
];
