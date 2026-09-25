import assert from "node:assert";
import { upgrade } from "../upgrade.js";
import { read, roundtrip } from "../reader.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const record = { version: 1, fields: { a: 1, extra: 2 } };
const steps = [{ from: 1, to: 2, ops: [{ op: "rename", from: "a", to: "b" }] }];

check("upgrade returns fields", () => {
  assert.strictEqual(typeof upgrade(record, steps, 2).fields, "object");
});

check("upgrade returns path", () => {
  assert.ok(Array.isArray(upgrade(record, steps, 2).path));
});

check("read keeps known fields", () => {
  assert.strictEqual(read({ a: 1 }, ["a"]).fields.a, 1);
});

check("read reports unknown", () => {
  assert.ok(Array.isArray(read({ a: 1, z: 2 }, ["a"]).unknown));
});

check("render exposes roundtrip", () => {
  assert.strictEqual(typeof render({ record: record, steps: steps, target_version: 2, known_fields: ["b"] }).roundtrip, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
