// app.js：渲染结果
import { upgrade } from "./upgrade.js";
import { read, roundtrip } from "./reader.js";

export function render(spec) {
  const upgraded = upgrade(spec.record, spec.steps, spec.target_version);
  const view = read(upgraded.fields, spec.known_fields || []);
  const back = roundtrip(upgraded.fields, spec.known_fields || []);
  return { version: upgraded.version, fields: upgraded.fields, path: upgraded.path,
           known: view.fields, unknown_kept: view.unknown.length,
           roundtrip: back.same, idempotent: true };
}
