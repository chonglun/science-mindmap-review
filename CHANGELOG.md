# Changelog

本專案所有重要變更均記錄於此，格式參考 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

### Added
- `doc-writer` agent — 專案文件撰寫與維護 agent
- `CONTRIBUTING.md` — 貢獻指南
- `CHANGELOG.md` — 版本變更紀錄
- Sidebar 搜尋功能（`SidebarSearch`）— 心智圖頁面左側 Sidebar 可搜尋當前考科的主題名稱、單元名稱、核心概念，點擊結果自動聚焦節點並開啟詳情面板
- ESLint TypeScript 支援 — 加入 `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`

### Changed
- `main.tsx` 從 `ReactDOM.render`（已棄用）遷移至 React 18 `createRoot` API
- 搜尋結果兩階段排序：名稱/概念直接匹配優先，單元名稱匹配補充（每 unit 限 3 筆）

### Removed
- 移除未使用的 `isClicked` prop 整條傳遞鏈（useUserData → MindMapPage → MindMapCanvas → SubtopicNode/TopicNode）
- 移除未使用的 hook exports：`useSubjectIndex`、`useSubjectDetail`、`isClicked`、`isRead`、`bookmarkedTopics`
- 移除未使用的 `public/data/mindmaps.json` placeholder 檔案
- 移除 MindMapCanvas 中未使用的 forEach index 參數及 type imports

## [1.0.0]

### Added

**功能**
- ReactFlow 互動式心智圖：四層展開收合（中心 → 學科 → 單元 → 主題）
- 多科目架構：exam-subjects 註冊表支援自然科、社會科、國文、英文、數學
- 可調寬度側邊詳情面板（SubjectPanel）
- 主題已讀勾選功能（SubtopicNode 綠框 ✓）
- localStorage 進度追蹤（已讀、收藏、已點擊）
- 歷屆考題與解析（pastExamQuestions）
- 響應式設計：桌面可收合側邊欄 + 手機底部 Tab Bar
- GitHub Pages 自動部署（GitHub Actions）

**學科內容**
- 自然科：生物（10 單元）、理化（12 單元 48 主題）、地球科學（6 單元 24 主題）
- 社會科：歷史、地理、公民與社會
- 國文（3 單元 17 主題）含應考策略
- 數學（13 單元 54 主題）含解題策略
- 英文：字彙與片語、文法句型、閱讀與題型攻略、聽力測驗

**開發工具**
- Custom agents：content-expander, mindmap-developer, ui-developer, code-quality, reviewer, doc-writer

### Fixed
- 防止開啟側面板時心智圖視角跳動
- 修正 GitHub Pages HashRouter 路由
- 修正絕對路徑問題（fetch 加 BASE_URL）
- 移除 index.html 多餘的 CSS link
