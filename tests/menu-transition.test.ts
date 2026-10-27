import assert from "node:assert/strict";
import test from "node:test";
import { TelegramError } from "telegraf";
import { transitionMenuReply } from "../src/bot/menu-transition.js";

test("text menu callbacks edit the existing menu", async () => {
  let edited = false;
  let sent = false;

  const result = await transitionMenuReply({
    canEdit: true,
    edit: async () => {
      edited = true;
      return "edited";
    },
    send: async () => {
      sent = true;
      return "sent";
    },
  });

  assert.equal(result, "edited");
  assert.equal(edited, true);
  assert.equal(sent, false);
});

test("non-text callback messages send a new response", async () => {
  const result = await transitionMenuReply({
    canEdit: false,
    edit: async () => "edited",
    send: async () => "sent",
  });

  assert.equal(result, "sent");
});

test("an already-current menu is treated as a successful no-op", async () => {
  const result = await transitionMenuReply({
    canEdit: true,
    edit: async () => {
      throw new TelegramError({
        error_code: 400,
        description: "Bad Request: message is not modified",
      });
    },
    send: async () => "sent",
  });

  assert.equal(result, undefined);
});

test("uneditable callback messages fall back to a new response", async () => {
  const result = await transitionMenuReply({
    canEdit: true,
    edit: async () => {
      throw new TelegramError({
        error_code: 400,
        description: "Bad Request: message can't be edited",
      });
    },
    send: async () => "sent",
  });

  assert.equal(result, "sent");
});

test("unexpected edit failures remain visible", async () => {
  const failure = new Error("network unavailable");
  await assert.rejects(
    transitionMenuReply({
      canEdit: true,
      edit: async () => {
        throw failure;
      },
      send: async () => "sent",
    }),
    failure,
  );
});
