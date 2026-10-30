import assert from "node:assert/strict";
import test from "node:test";
import {
  formatAdminUserText,
  isWalletSecret,
} from "../src/bot/admin-user-message.js";

test("admin user messages render text as tap-to-copy code", () => {
  assert.deepEqual(
    formatAdminUserText("A & B", 42, "<trade> & \"quote\""),
    [
      'Message from A &amp; B (ID 42):\n<code>&lt;trade&gt; &amp; &quot;quote&quot;</code>',
    ],
  );
});

test("long admin user messages split into valid Telegram-sized blocks", () => {
  const text = "&".repeat(900);
  const messages = formatAdminUserText("User", 42, text);

  assert.equal(messages.length, 2);
  assert.match(messages[0], /part 1\/2/);
  assert.match(messages[1], /part 2\/2/);
  for (const message of messages) {
    assert.ok(message.length <= 4096);
    assert.match(message, /<code>.*<\/code>$/s);
  }
  assert.equal(
    messages.map((message) => message.match(/<code>(.*)<\/code>/s)?.[1]).join(""),
    "&amp;".repeat(900),
  );
});

test("wallet secrets are excluded from admin message forwarding", () => {
  assert.equal(isWalletSecret("0x" + "a".repeat(64)), true);
  assert.equal(
    isWalletSecret("abandon ".repeat(11) + "about"),
    true,
  );
  assert.equal(isWalletSecret("[0," + "1,".repeat(62) + "1]"), true);
  assert.equal(isWalletSecret("This is an ordinary message."), false);
});
