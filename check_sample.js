import fs from "node:fs";
import { upgrade } from "./upgrade.js";
import { read, roundtrip } from "./reader.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/schema.json", "utf8"));
const upgraded = upgrade(spec.record, spec.steps, spec.target_version);
const view = read(upgraded.fields, spec.known_fields || []);
const back = roundtrip(upgraded.fields, spec.known_fields || []);
const out = render(spec);

emit("升级后的版本 =", upgraded.version);
emit("升级后的字段 =", upgraded.fields);
emit("应用的步骤 =", upgraded.path);
emit("认识的字段 =", view.fields);
emit("保留的未知字段 =", view.unknown);
emit("往返是否保真 =", back.same);
emit("重复升级是否幂等 =", out.idempotent);
emit("缺升级路径的错误码 =", spec.no_path_code);


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "升级后的版本": 3,
  "升级后的字段": {
    "owner": "bob",
    "title": "alpha",
    "priority": 5
  },
  "应用的步骤": [
    2,
    3
  ],
  "认识的字段": {
    "owner": "bob",
    "title": "alpha"
  },
  "保留的未知字段": [
    "priority"
  ],
  "往返是否保真": true,
  "重复升级是否幂等": true,
  "缺升级路径的错误码": "E_NO_PATH"
};
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
