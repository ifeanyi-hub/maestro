export type NoWalletRoute =
  | "welcome"
  | "wallet-import"
  | "trading"
  | "continue"
  | "not-implemented";

const WALLET_IMPORT_CALLBACKS = new Set([
  "home_chains",
  "home_wallets",
  "wallets_import",
  "wallets_list",
  "wallets_return",
]);

const TRADING_CALLBACK_PREFIXES = [
  "home_trade",
  "home_trades",
  "home_snipe",
  "home_copytrade",
  "home_orders",
  "home_bridge",
  "trade_",
  "order_",
  "copy_sells_",
  "bridge_",
];

const TRADING_COMMANDS = new Set([
  "bridge",
  "copytrade_config",
  "copytrade_off",
  "copytrade_set",
  "limit_buy",
  "limit_sell",
  "orders",
  "snipe_off",
  "snipe_on",
  "snipe_size",
]);

export function routeNoWalletCallback(callbackData: string): NoWalletRoute {
  if (callbackData === "home") return "welcome";
  if (
    WALLET_IMPORT_CALLBACKS.has(callbackData) ||
    callbackData.startsWith("wchain_")
  ) {
    return "wallet-import";
  }
  if (callbackData.startsWith("onboard_")) return "continue";
  if (callbackData === "flow_cancel") return "continue";
  if (
    TRADING_CALLBACK_PREFIXES.some((prefix) =>
      callbackData.startsWith(prefix),
    )
  ) {
    return "trading";
  }
  return "not-implemented";
}

export function routeNoWalletCommand(command: string): NoWalletRoute {
  if (command === "start") return "welcome";
  if (command === "wallets") return "wallet-import";
  if (command === "cancel_import" || command === "cancel") return "continue";
  if (TRADING_COMMANDS.has(command)) return "trading";
  return "not-implemented";
}
