// reader.js：兼容读（未知字段原样保留，不丢弃）
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

export function roundtrip(fields, known) {
  const view = read(fields, known);
  const back = Object.assign({}, view.fields);
  for (const name of view.unknown) back[name] = fields[name];
  const keys = Object.keys(fields);
  const backKeys = Object.keys(back);
  let same = keys.length === backKeys.length;
  if (same) {
    for (const name of keys) {
      if (!(name in back) || back[name] !== fields[name]) { same = false; break; }
    }
  }
  return { same: same };
}
