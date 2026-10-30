import assert from "node:assert/strict";
import test from "node:test";
import { Telegraf } from "telegraf";
import { configureBotCommands } from "../src/bot/telegram.js";

test("startup command setup only registers default user commands", async () => {
  let callCount = 0;
  const bot: Pick<Telegraf, "telegram"> = {
    telegram: {
      setMyCommands: async (_commands, extra) => {
        callCount++;
        assert.equal(extra, undefined);
        return true;
      },
    },
  };

  await configureBotCommands(bot);

  assert.equal(callCount, 1);
});
