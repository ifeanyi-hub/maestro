import assert from "node:assert/strict";
import test from "node:test";
import {
  formatAdminUserText,
  isWalletSecret,
} from "../src/bot/admin-user-message.js";

test("admin user messages include exact copy-button text", () => {
  assert.deepEqual(
    formatAdminUserText("A & B", 42, "<trade> & \"quote\""),
    [
      {
        text: 'Message from A &amp; B (ID 42):\n<code>&lt;trade&gt; &amp; &quot;quote&quot;</code>',
        copyText: '<trade> & "quote"',
        copyButtonText: "Copy message",
      },
    ],
  );
});

test("long messages split into copy-button chunks within Telegram's limit", () => {
  const text = "😀&".repeat(300);
  const messages = formatAdminUserText("User", 42, text);

  assert.equal(messages.length, 3);
  assert.equal(messages[0].copyButtonText, "Copy part 1");
  assert.equal(messages[1].copyButtonText, "Copy part 2");
  assert.equal(messages[2].copyButtonText, "Copy part 3");
  for (const message of messages) {
    assert.ok(Array.from(message.copyText).length <= 256);
    assert.ok(message.text.length <= 4096);
    assert.match(message.text, /<code>.*<\/code>$/s);
  }
  assert.equal(messages.map((message) => message.copyText).join(""), text);
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
