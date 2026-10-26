import { FmtString } from "telegraf/format";

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
  firstName: string,
  requiresApproval: boolean,
  requiresWallet = requiresApproval,
): string {
  const greeting = firstName.trim() || "trader";
  return [
    `✨ Welcome, ${greeting}, to Maestro — your on-chain trading desk!`,
    "",
    "Explore chain options; manage wallets and portfolio; trade with fresh quotes and confirmation; set risk limits; create token snipes and limit orders; configure copy trading; view positions, recent trades, and price signals; subscribe to Premium for price alerts and realized P&L; browse curated presales; track referrals; request quote-only bridge routes. Admins also get moderation and stats tools.",
    "",
    "⚡ For a quick trade, tap BUY & SELL NOW. Every trade needs a fresh quote and your confirmation. Bridge routes are quote-only; no bridge transaction is signed or submitted.",
    "Solana and Ethereum mainnet are connected. Other EVM networks in the chain picker are preview-only; network-specific transactions are not enabled yet.",
    requiresApproval
      ? requiresWallet
        ? "Choose a network and import a wallet. An admin must approve your account before features unlock."
        : "Your wallet is imported. Wait for admin approval before using account features."
      : requiresWallet
        ? "Choose a network and import a wallet to unlock account features."
        : "Choose a section below to get started.",
  ].join("\n");
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
