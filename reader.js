// reader.js：兼容读（基线：丢掉不认识的字段）
export function read(fields, known) {
  const out = {};
  for (const name of known) if (name in fields) out[name] = fields[name];
  return { fields: out, unknown: [] };
}

export function roundtrip(fields, known) {
  return { same: false };
}
