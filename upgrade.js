// upgrade.js：升级链（按版本索引逐步推进，支持 rename/add/drop）
export function upgrade(record, steps, target) {
  const byFrom = new Map();
  for (const step of steps) byFrom.set(step.from, step);

  const fields = Object.assign({}, record.fields);
  const path = [];
  let version = record.version;

  while (version !== target) {
    const step = byFrom.get(version);
    if (!step) {
      const error = new Error("no upgrade path from version " + version + " to " + target);
      error.code = "E_NO_PATH";
      throw error;
    }
    for (const op of step.ops) {
      if (op.op === "rename") {
        if (op.from in fields) {
          fields[op.to] = fields[op.from];
          delete fields[op.from];
        }
      } else if (op.op === "add") {
        if (!(op.name in fields)) fields[op.name] = op.value;
      } else if (op.op === "drop") {
        delete fields[op.name];
      }
    }
    version = step.to;
    path.push(step.to);
  }
  return { version: version, fields: fields, path: path };
}
