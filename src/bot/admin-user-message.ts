import * as bip39 from "bip39";
import bs58 from "bs58";

const MAX_COPY_TEXT_LENGTH = 256;

export interface AdminUserTextMessage {
  text: string;
  copyText: string;
  copyButtonText: string;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatAdminUserText(
  identity: string,
  userId: number,
  text: string,
): AdminUserTextMessage[] {
  const sourceChunks: string[] = [];
  const characters = Array.from(text);
  for (let index = 0; index < characters.length; index += MAX_COPY_TEXT_LENGTH) {
    sourceChunks.push(characters.slice(index, index + MAX_COPY_TEXT_LENGTH).join(""));
  }
  if (sourceChunks.length === 0) sourceChunks.push(" ");

  const safeIdentity = escapeHtml(identity);
  return sourceChunks.map((part, index) => {
    const page =
      sourceChunks.length > 1
        ? ` · part ${index + 1}/${sourceChunks.length}`
        : "";
    const escapedPart = escapeHtml(part);
    return {
      text: `Message from ${safeIdentity} (ID ${userId})${page}:\n<code>${escapedPart}</code>`,
      copyText: part,
      copyButtonText: sourceChunks.length > 1 ? `Copy part ${index + 1}` : "Copy message",
    };
  });
}
