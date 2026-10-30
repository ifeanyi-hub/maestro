import * as bip39 from "bip39";
import bs58 from "bs58";

const MAX_ESCAPED_TEXT_LENGTH = 3500;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function isWalletSecret(text: string): boolean {
  const trimmed = text.trim();
  if (
    /^(?:0x)?[0-9a-f]{64}$/i.test(trimmed) ||
    bip39.validateMnemonic(trimmed.toLowerCase())
  ) {
    return true;
  }

  if (/^\[\s*\d+(?:\s*,\s*\d+){63}\s*\]$/.test(trimmed)) {
    return true;
  }

  try {
    return bs58.decode(trimmed).length === 64;
  } catch {
    return false;
  }
}

export function formatAdminUserText(
  identity: string,
  userId: number,
  text: string,
): string[] {
  const chunks: string[] = [];
  let chunk = "";
  let escapedLength = 0;

  for (const character of text) {
    const escaped = escapeHtml(character);
    if (
      chunk &&
      escapedLength + escaped.length > MAX_ESCAPED_TEXT_LENGTH
    ) {
      chunks.push(chunk);
      chunk = "";
      escapedLength = 0;
    }
    chunk += escaped;
    escapedLength += escaped.length;
  }
  if (chunk || chunks.length === 0) chunks.push(chunk);

  const safeIdentity = escapeHtml(identity);
  return chunks.map((part, index) => {
    const page = chunks.length > 1 ? ` · part ${index + 1}/${chunks.length}` : "";
    return `Message from ${safeIdentity} (ID ${userId})${page}:\n<code>${part}</code>`;
  });
}
