import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.ok(/<html lang="en">/.test(html), "Declare the page language");
assert.ok(/<meta name="viewport"/.test(html), "Include mobile viewport");
assert.ok(
  /<meta name="robots" content="noindex, nofollow"\s*\/?>/.test(html),
  "Prelaunch pages must remain noindex",
);
assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "Use one page heading");
assert.ok(
  !/mailto:|<form[\s>]|https:\/\/buy\.stripe\.com/i.test(html),
  "No public contact collection or payment link before launch",
);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), `Anchor #${match[1]} must have a target`);
}
console.log(
  "Source checks passed: language, viewport, headings, anchors, and prelaunch safeguards.",
);
