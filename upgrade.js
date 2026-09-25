// upgrade.js：升级链（基线：一步到位、直接换字段名）
export function upgrade(record, steps, target) {
  const fields = Object.assign({}, record.fields);
  for (const step of steps) {
    for (const op of step.ops) {
      if (op.op === "rename" && op.from in fields) {
        fields[op.to] = fields[op.from];
        delete fields[op.from];
      }
    }
  }
  return { version: target, fields: fields, path: steps.map((step) => step.to) };
}
