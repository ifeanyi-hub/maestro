import { TelegramError } from "telegraf";

interface MenuTransitionOptions {
  canEdit: boolean;
  edit: () => Promise<unknown>;
  send: () => Promise<unknown>;
}

const CANNOT_EDIT_MESSAGE =
  /message to edit not found|message can't be edited|there is no text in the message to edit/i;

export async function transitionMenuReply({
  canEdit,
  edit,
  send,
}: MenuTransitionOptions): Promise<unknown> {
  if (!canEdit) return send();

  try {
    return await edit();
  } catch (error) {
    if (!(error instanceof TelegramError)) throw error;
    if (error.description === "Bad Request: message is not modified") {
      return undefined;
    }
    if (!CANNOT_EDIT_MESSAGE.test(error.description)) throw error;

    console.warn(
      `[bot] menu transition unavailable; sending a new message: ${error.description}`,
    );
    return send();
  }
}
