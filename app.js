// app.js：渲染结果
import { upgrade } from "./upgrade.js";
import { read, roundtrip } from "./reader.js";

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!(key in b) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}

export function render(spec) {
  const upgraded = upgrade(spec.record, spec.steps, spec.target_version);
  const view = read(upgraded.fields, spec.known_fields || []);
  const back = roundtrip(upgraded.fields, spec.known_fields || []);
  const again = upgrade(
    { version: upgraded.version, fields: upgraded.fields },
    spec.steps,
    spec.target_version
  );
  const idempotent = again.version === upgraded.version &&
    again.path.length === 0 &&
    deepEqual(again.fields, upgraded.fields);
  return { version: upgraded.version, fields: upgraded.fields, path: upgraded.path,
           known: view.fields, unknown_kept: view.unknown.length,
           roundtrip: back.same, idempotent: idempotent };
}
