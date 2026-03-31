# 國中會考心智圖複習網站

互動式心智圖複習網站，涵蓋國中會考五大科目（自然、社會、國文、英文、數學）。透過 ReactFlow 心智圖瀏覽各單元主題，查看生活聯想、核心觀念與歷屆考題，並以 localStorage 追蹤閱讀與收藏進度。

Built with React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + ReactFlow 11.

## 功能特色

- **五大會考科目**：自然科（生物、理化、地球科學）、社會科（歷史、地理、公民）、國文、英文（字彙、文法、閱讀、聽力）、數學
- **互動式心智圖**：四層展開（中心 → 學科 → 單元 → 主題），可收合展開
- **主題詳情面板**：生活聯想（hook）、核心觀念、歷屆考題與解析
- **應考策略**：部分科目含解題步驟、出題方向、常見陷阱提示
- **閱讀進度追蹤**（localStorage）：已讀 ✓、收藏 ☆
- **可調整寬度**的側邊詳情面板
- **響應式設計**：桌面側邊欄 + 手機底部 Tab Bar
- **GitHub Pages 自動部署**（GitHub Actions）

## 快速開始

```bash
# 1. Clone
git clone https://github.com/chonglun/science-mindmap-review.git
cd science-mindmap-review

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器（自動開啟 http://localhost:3000）
npm run dev
```

> **SSL 注意**：公司代理可能阻斷 npm registry。若 `npm install` 卡住，先執行 `npm config set strict-ssl false`。

## 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | Vite 開發伺服器，port 3000，自動開啟瀏覽器 |
| `npm run build` | 正式版建置 → `dist/` |
| `npm run serve` | 本機預覽 `dist/` |
| `npm run deploy` | 部署 `dist/` 至 GitHub Pages（gh-pages -d dist） |
| `npx tsc --noEmit` | TypeScript 型別檢查（不產出檔案） |

## 專案結構

```
src/
├── App.tsx                          # HashRouter 路由設定、版面骨架
├── main.tsx                         # 應用程式入口
├── index.css                        # Tailwind 全域樣式
├── components/
│   ├── Layout/                      # Header, SearchBar, Sidebar (可收合), Footer
│   ├── MindMap/
│   │   ├── MindMapCanvas.tsx        # 4 層節點/邊圖形；ReactFlowProvider 包裹
│   │   ├── TopicNode.tsx            # 中心 + 科目層節點（彩色背景）
│   │   ├── UnitNode.tsx             # 單元層節點（重要度星級、學期標籤）
│   │   └── SubtopicNode.tsx         # 葉層主題節點（已讀綠框 ✓）
│   ├── SubjectPanel.tsx             # 可調寬度右側詳情面板
│   └── UI/
│       └── TopicCard.tsx            # 科目/主題卡片
├── pages/
│   ├── SubjectSelectionPage.tsx     # 選科首頁 (/)
│   ├── HomePage.tsx                 # 科目卡片 (/subject/:examSubjectId)
│   ├── MindMapPage.tsx              # 心智圖 (/mindmap/:examSubjectId/:subjectId?)
│   └── TopicListPage.tsx            # 主題列表 (/topics/:examSubjectId)
├── hooks/
│   ├── useSubjectData.ts            # 動態載入科目 JSON + 記憶體快取
│   ├── useExamSubjectId.ts          # 路由感知的考試科目 ID
│   ├── useSearch.ts                 # 跨科主題搜尋
│   └── useUserData.ts              # localStorage 狀態管理
├── types/
│   └── index.ts                     # SubjectData, Unit, Topic, PastExamQuestion 等型別
└── data/
    ├── exam-subjects.json           # 考試科目註冊表（5 大科）
    └── subjects/
        ├── index.json               # 輕量科目索引（僅 id, label, color）
        ├── biology.json             # 生物（10 單元）
        ├── physics-chemistry.json   # 理化（12 單元）
        ├── earth-science.json       # 地球科學（6 單元）
        ├── history.json             # 歷史
        ├── geography.json           # 地理
        ├── civics.json              # 公民與社會
        ├── chinese.json             # 國文（3 單元）
        ├── math.json                # 數學（13 單元）
        ├── english-vocabulary.json  # 英文字彙與片語（4 單元）
        ├── english-grammar.json     # 英文文法句型（5 單元）
        ├── english-reading.json     # 英文閱讀與題型攻略（4 單元）
        └── english-listening.json   # 英文聽力測驗（3 單元）
```

## 路由

| 路徑 | 頁面 | 說明 |
|------|------|------|
| `/` | SubjectSelectionPage | 選科首頁 |
| `/subject/:examSubjectId` | HomePage | 科目卡片列表 |
| `/mindmap/:examSubjectId` | MindMapPage | 該科全部心智圖 |
| `/mindmap/:examSubjectId/:subjectId` | MindMapPage | 聚焦至指定學科 |
| `/topics/:examSubjectId` | TopicListPage | 平面主題列表 |

> 使用 `HashRouter`，所有路徑前有 `#`（如 `/#/subject/science`），以相容 GitHub Pages SPA。
> 另有舊版路由自動轉導（`/mindmap` → `/subject/science` 等），詳見 `App.tsx`。

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | React 18 + TypeScript 5 |
| 建置工具 | Vite 5 |
| 樣式 | Tailwind CSS 3 |
| 心智圖 | ReactFlow 11（非 v12/xyflow） |
| 圖示 | lucide-react |
| 路由 | React Router v6（HashRouter） |
| 部署 | GitHub Pages + GitHub Actions |

## 部署

推送至 `main` 分支後，GitHub Actions 會自動建置並部署至 GitHub Pages。

工作流程位於 `.github/workflows/deploy.yml`：
1. Checkout → Node 20 → `npm install` → `npm run build`
2. 上傳 `dist/` 至 GitHub Pages artifact
3. 自動部署

## 貢獻

歡迎提交 Issue 或 Pull Request！詳細規範請參閱 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 授權

本專案採用 MIT 授權。