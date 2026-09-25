// reader.js：兼容读（未知字段原样保留，并列在 unknown 里）
export function read(fields, known) {
  const out = {};
  const unknown = [];
  const knownSet = new Set(known);
  for (const name of Object.keys(fields)) {
    if (knownSet.has(name)) out[name] = fields[name];
    else unknown.push(name);
  }
  return { fields: out, unknown: unknown };
}

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

export function roundtrip(fields, known) {
  const view = read(fields, known);
  const written = {};
  for (const name of Object.keys(fields)) {
    if (name in view.fields) written[name] = view.fields[name];
    else written[name] = fields[name];
  }
  return { same: deepEqual(written, fields) };
}
