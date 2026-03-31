# Changelog

本專案所有重要變更均記錄於此，格式參考 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

### Added
- `doc-writer` agent — 專案文件撰寫與維護 agent
- `CONTRIBUTING.md` — 貢獻指南
- `CHANGELOG.md` — 版本變更紀錄

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
