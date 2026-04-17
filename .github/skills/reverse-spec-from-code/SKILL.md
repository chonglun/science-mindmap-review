---
name: reverse-spec-from-code
description: Use when reverse-engineering specifications from an existing codebase, when inheriting undocumented or legacy projects, when onboarding to a project that lacks formal specs, or when needing to document existing system behavior before refactoring
---

# Reverse Spec from Code

## Overview

**Core principle:** 每個規格陳述必須有來源追溯（CODE/GIT/USER/INFER），不臆測。

從原始碼與 Git 歷史反向工程產出完整規格文件（Spec Kit），採用互動式多階段工作流程：掃描專案 → 向使用者提問補足缺口 → 產出草稿 → 審閱確認 → 最終版本。

## When to Use

- 接手無文件的既有專案，需要產出正式規格
- Legacy codebase 需要建立 spec 作為重構依據
- 需要從 git history 還原設計決策脈絡
- 團隊 onboarding，需要快速理解專案全貌
- 準備大規模重構前的現狀盤點

## When NOT to Use

- 新專案（應直接寫 spec，不是反向工程）
- 只需快速了解 codebase（用 README 或 code tour）
- 專案已有完整且最新的文件
- 單一功能的快速修復（過度工程）

---

## 產出文件結構

```text
specs/reverse-engineered/
├── constitution.md    # 核心原則與治理
├── spec.md            # 功能規格與 User Stories
├── plan.md            # 實作計畫與技術脈絡
├── data-model.md      # 資料模型與關聯
├── contracts/
│   ├── rest-api.md    # API 端點契約
│   └── events.md      # 事件契約（若適用）
├── research.md        # 技術棧分析與演進歷程
├── tasks.md           # 現有功能盤點與缺口
├── quickstart.md      # 快速啟動指南
└── checklist.md       # 完整性檢核清單
```

完整文件模板見 [templates.md](templates.md)。

---

## 工作流程

```text
Phase 0 深度掃描 → Phase 1 掃描報告 & 提問 → Phase 2 補充掃描
    ↓                    ↑ 使用者回答              ↓ (若有新問題回 Phase 1)
Phase 3 規格草稿 → Phase 4 草稿審閱 & 提問 → Phase 5 最終版本 → Phase 6 檢核
                         ↑ 使用者確認
```

### Phase 0: 深度掃描

執行完整掃描，涵蓋 5 個面向。完整指令見 [scan-commands.md](scan-commands.md)。

| 掃描類別 | 目標 | 產出 |
|---------|------|------|
| A. 專案結構 | 目錄樹、檔案清單 | `_scan_tree.txt`, `_scan_root.txt` |
| B. 設定檔 | 技術棧、CI/CD、lint | `_scan_config.txt`, `_scan_deploy.txt`, `_scan_ci.txt` |
| C. 文件 | README、CONTRIBUTING | `_scan_docs.txt` |
| D. Git 歷史 | commits、tags、hotspots | `_scan_git_history.json`, `_scan_feat.txt` 等 |
| E. 程式碼 | 入口點、路由、模型、測試 | `_scan_routes.txt`, `_scan_models.txt` 等 |

將掃描結果分為三類：

| 分類 | 定義 | 處理方式 |
|------|------|---------|
| ✅ 已確認 | 程式碼中有明確證據 | 直接寫入文件 |
| ⚠️ 需確認 | 有跡象但不確定 | 列入 Phase 1 提問清單 |
| ❌ 無資料 | 完全無法從程式碼推斷 | 列入 Phase 1 必問清單 |


### Phase 1: 掃描報告 & 第一輪提問

**1.1 呈現掃描報告**

向使用者展示已識別資訊摘要（專案名稱、技術棧、commit 統計、入口點、API 數、模型數、測試數、技術債標記數），以及需確認（⚠️）和無資料（❌）項目。

**1.2 動態生成提問**

根據掃描結果中的 ⚠️ 和 ❌ 項目，從以下類別生成提問：

| 類別 | 代表問題 | 觸發條件 |
|------|---------|---------|
| 專案背景 | 目標、受眾、狀態 | README 不足時 |
| 架構決策 | 架構風格、設計原則、模組職責 | 程式碼不明確時 |
| 功能範圍 | 功能清單完整性、優先順序 | feat commits 不足時 |
| 資料與 API | 實體完整性、端點完整性 | model/route 掃描不完整時 |
| 營運需求 | 效能、可用性、安全性、合規 | 程式碼通常缺乏 |
| 歷史脈絡 | 技術遷移、已知技術債 | git log 無法完全還原 |

**提問格式**：每題先展示掃描發現 `[掃描發現]: {...}`，再請使用者確認或補充 `[需要確認]: ___`。

### Phase 2: 補充掃描

根據使用者回答，可能需要額外掃描：

- 使用者指出遺漏的模組 → 深入掃描該模組
- 使用者澄清架構風格 → 重新分析目錄結構
- 使用者補充功能清單 → 搜尋相關 commit
- 使用者指出已棄用功能 → 標記排除

**迴圈終止條件**：所有 ❌ 已回答或標記 N/A，所有 ⚠️ 已確認，或使用者說「資訊已足夠」。

### Phase 3: 規格草稿產出

**嚴格按以下順序產出**（後續文件依賴前序文件）：

1. `constitution.md` ← 掃描 + 架構決策回答
2. `research.md` ← 掃描 + 營運/歷史回答
3. `data-model.md` ← 掃描 + 資料實體回答
4. `contracts/` ← 掃描 + API 端點回答
5. `spec.md` ← 掃描 + 背景/功能回答
6. `plan.md` ← 整合 1-5
7. `tasks.md` ← spec + plan + 掃描
8. `quickstart.md` ← plan + 掃描
9. `checklist.md` ← 所有文件

**產出規則**：
1. 每個陳述標注來源：`[CODE: path:line]` `[GIT: hash]` `[USER: Q{n}]` `[INFER: 依據]`
2. 不確定項目標記：`[NEEDS CONFIRMATION: 具體問題]`
3. 信心度標記：🟢 高（證據+確認）、🟡 中（單方證據）、🔴 低（純推斷）
4. 與已產出文件交叉檢查一致性

完整文件模板見 [templates.md](templates.md)。

### Phase 4: 草稿審閱 & 第二輪提問

向使用者呈現：
- 各文件狀態、待確認項目數、信心度分布表
- 所有 🔴 低信心度項目（請使用者確認或修正）
- 產出過程中新發現的 `[NEEDS CONFIRMATION]` 問題
- 交叉驗證結果（矛盾或不一致）

使用者可選擇：逐項確認、整體通過（保留標記）、或要求重新產出特定文件。

### Phase 5: 最終版本產出

1. 整合使用者 Phase 4 的修正
2. 更新信心度（確認的 → 🟢，保留的維持 🔴）
3. 移除內部工作標記（`_scan_*.txt` 引用）
4. 所有 `[NEEDS CONFIRMATION]` 轉為 `[KNOWN LIMITATION]` 或消除

### Phase 6: 完整性檢核

自動驗證：
1. 所有 `[CODE: path]` 引用的檔案存在
2. 所有 `[GIT: hash]` 引用的 commit 存在
3. spec ↔ contracts 端點一致
4. spec ↔ data-model 實體一致
5. tasks 中 ✅ 項對應的檔案存在
6. 🔴 項佔比 < 10%（否則警告）
7. Mermaid 語法正確

---

## Quick Reference

### 來源標記

| 標記 | 含義 | 範例 |
|------|------|------|
| `[CODE: path:line]` | 程式碼證據 | `[CODE: src/auth.ts:42]` |
| `[GIT: hash]` | Commit 證據 | `[GIT: a1b2c3d]` |
| `[USER: Q{n}]` | 使用者回答 | `[USER: Q5]` |
| `[INFER: 依據]` | 推斷 | `[INFER: 從目錄結構]` |

### 信心度

| 等級 | 條件 | 目標佔比 |
|------|------|---------|
| 🟢 高 | 程式碼證據 + 使用者確認 | > 70% |
| 🟡 中 | 單方證據 | — |
| 🔴 低 | 純推斷 | < 10% |

---

## 提問原則

1. **先展示再問** — 每題先呈現掃描發現
2. **每批 ≤ 8 題** — 避免使用者負擔過重
3. **提供選項** — 優先於開放問題
4. **追問機制** — 回答引發新問題時立即追問
5. **允許跳過** — 「不確定」或「跳過」→ 標記 🔴
6. **允許提前結束** — 使用者說「資訊已足夠」即可進入下一 Phase

## Common Mistakes

| 錯誤 | 後果 | 修正 |
|------|------|------|
| 未標注來源就寫入規格 | 無法區分事實與臆測 | 每個陳述必須有 `[CODE/GIT/USER/INFER]` |
| 跳過 Phase 1 直接產出 | 缺口大量存在，返工嚴重 | 必須先掃描再提問 |
| 信心度全標 🟢 | 失去信心度系統價值 | 嚴格按定義：🟢 需雙重證據 |
| 臆測不存在的功能 | 規格與實際不符 | 無證據則不寫，標 `[KNOWN LIMITATION]` |
| 忽略 fix commits | 遺漏 edge cases | fix commits 是 edge case 的最佳來源 |
| 敏感資訊寫入規格 | 安全風險 | 排除 credentials、secrets、API keys |
