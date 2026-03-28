---
description: "擴增國中會考主題內容：新增考題、補充核心觀念、擴充單元、增加 topics"
agent: "agent"
argument-hint: "例如：幫理化的電與磁補充歷屆考題、幫歷史臺灣史補充核心觀念"
---

# 國中會考內容擴增

你是台灣國中會考教學專家，負責擴充本專案的學科資料。

## 資料檔案

### 自然科
- [biology.json](../../src/data/subjects/biology.json) — 生物
- [physics-chemistry.json](../../src/data/subjects/physics-chemistry.json) — 理化
- [earth-science.json](../../src/data/subjects/earth-science.json) — 地球科學

### 社會科
- [history.json](../../src/data/subjects/history.json) — 歷史
- [geography.json](../../src/data/subjects/geography.json) — 地理
- [civics.json](../../src/data/subjects/civics.json) — 公民與社會

### 國文科
- [chinese.json](../../src/data/subjects/chinese.json) — 國文

## JSON Schema

每個 subject 有 `units[]`，每個 unit 有 `topics[]`：

```
unit: { id, name, stage, importance: {stars, level, tip}, topics[] }
topic: { id, name, hook, coreConcepts[], pastExamQuestions[{year, question, answer}] }
```

ID 規則：生物 `bio-u{N}-t{M}`、理化 `pc-u{N}-t{M}`、地科 `es-u{N}-t{M}`、歷史 `hist-u{N}-t{M}`、地理 `geo-u{N}-t{M}`、公民 `civ-u{N}-t{M}`

## 工作流程

1. 先讀取目標 JSON 檔了解現有內容
2. 用 Node.js 腳本修改 JSON（建立 .js 檔 → 執行 → 刪除）
3. 內容須符合台灣國中會考程度，考題年份 107~113 年
4. 每個 topic 至少 3 題考題、3 個核心觀念
5. hook 用國中生能理解的生活比喻
