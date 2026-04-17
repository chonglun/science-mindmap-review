---
applyTo: "src/data/**/*.json"
---

# 學科資料 JSON 慣例

- Schema: `{ id, label, color, units: [{ id, name, stage, importance, topics, unitStrategy? }] }`
- Topic schema: `{ id, name, hook, coreConcepts[], pastExamQuestions[], examStrategy? }`
- ID 格式: `{prefix}-u{N}` (unit), `{prefix}-u{N}-t{M}` (topic). Prefixes: bio, pc, es, hist, geo, civ, math, eng-vocab, eng-gram, eng-read, eng-listen.
- `hook`: 2-3 句生活化比喻，國中生能理解。
- `coreConcepts`: 每個 topic 至少 3 條。
- `pastExamQuestions`: 至少 3 題，年份 107-113 年，含 answer + explanation。
- 所有內容使用繁體中文。
- 修改時使用 Node.js 腳本 (`fs.readFileSync` → modify → `fs.writeFileSync`)，避免直接編輯大型 JSON。
