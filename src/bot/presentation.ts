import { bold, fmt, join, FmtString } from "telegraf/format";

const SECTION_RULE = "━━━━━━━━━━━━━━━━";

export function styleBotResponse(text: string, maxLength?: number): string;
export function styleBotResponse(text: FmtString<string>): FmtString<string>;
export function styleBotResponse(
  text: string | FmtString<string>,
): string | FmtString<string>;
export function styleBotResponse(
  text: string | FmtString<string>,
  maxLength?: number,
): string | FmtString<string> {
  const content = typeof text === "string" ? text : text.text;
  const firstVisibleCharacter = content.trimStart();
  const needsMarker = !/^[\p{Extended_Pictographic}\p{S}]/u.test(
    firstVisibleCharacter,
  );
  const styled =
    typeof text === "string"
      ? needsMarker
        ? `✦ ${text}`
        : text
      : needsMarker
        ? new FmtString(
            `✦ ${text.text}`,
            text.entities?.map((entity) => ({
              ...entity,
              offset: entity.offset + 2,
            })),
          )
        : text;
  return typeof styled === "string" && maxLength !== undefined
    ? Array.from(styled).slice(0, maxLength).join("")
    : styled;
}

export function startWelcome(
  _firstName: string,
  requiresApproval: boolean,
  requiresWallet = requiresApproval,
): FmtString<string> {
  const featureLines = [
    fmt`🔗 ${bold("Chains:")} View available networks.`,
    fmt`💳 ${bold("Wallets:")} Import and manage wallets.`,
    fmt`⚙️ ${bold("Global Settings:")} Customize risk and trading limits.`,
    fmt`🕓 ${bold("Active Orders:")} Review active buy/sell limit orders.`,
    fmt`📈 ${bold("Positions:")} Monitor your portfolio and recent trades.`,
    fmt`📡 ${bold("More:")} Signals, copy trading, auto-snipe, bridge quotes, Premium, presales, and referrals.`,
  ];
  const accessNotice = requiresApproval
    ? requiresWallet
      ? "Choose a network and import a wallet. An admin must approve your account before features unlock."
      : "Your wallet is imported. Wait for admin approval before using account features."
    : requiresWallet
      ? "Choose a network and import a wallet to unlock account features."
      : "Choose a section below to get started.";

  return join(
    [
      fmt`⭐️ Welcome to Maestro, the ${bold("one-stop")} solution for all your trading needs!`,
      "",
      ...featureLines,
      "",
      fmt`⚡ ${bold("Paste a token CA to start a quoted trade, or tap BUY & SELL NOW.")}`,
      "",
      accessNotice,
    ],
    "\n",
  );
}

export function tradingHeading(icon: string, title: string): string {
  return `${icon}  ${title.toUpperCase()}\n${SECTION_RULE}`;
}

export function tradingSide(side: string): string {
  if (side.toLowerCase() === "buy") return "🟢 BUY";
  if (side.toLowerCase() === "sell") return "🔴 SELL";
  return `🔹 ${side.toUpperCase()}`;
}

const STATUS_STYLES: Record<string, string> = {
  active: "🟢 ACTIVE",
  approved: "✅ APPROVED",
  banned: "🔴 BANNED",
  cancelled: "⚪ CANCELLED",
  completed: "✅ COMPLETED",
  confirmed: "✅ CONFIRMED",
  failed: "🔴 FAILED",
  filled: "✅ FILLED",
  open: "🟢 OPEN",
  pending: "🟡 PENDING",
  prepared: "🟡 PREPARED",
  processing: "🟡 PROCESSING",
  queued: "🟡 QUEUED",
  retrying: "🟠 RETRYING",
  submitted: "🟡 SUBMITTED",
  unknown: "🟠 STATUS UNKNOWN",
};

export function tradingStatus(status: string): string {
  return STATUS_STYLES[status.toLowerCase()] ?? `🔹 ${status.toUpperCase()}`;
}

export function triggerDirection(direction: string): string {
  if (direction.toLowerCase() === "above") return "↗️ ABOVE";
  if (direction.toLowerCase() === "below") return "↘️ BELOW";
  return direction.toUpperCase();
}
