# 貢獻指南

感謝你對本專案的興趣！以下是參與開發的規範與流程。

## 開發環境

### 前置需求

- **Node.js** 20+
- **npm** 9+

### 安裝與啟動

```bash
npm install
npm run dev      # 開發伺服器 → http://localhost:3000
```

> **SSL 注意**：公司代理環境下若 `npm install` 卡住，先執行 `npm config set strict-ssl false`。

### 驗證指令

```bash
npx tsc --noEmit   # TypeScript 型別檢查
npm run build       # 正式版建置
```

提交前請確保以上兩個指令都能通過。

## 專案架構

詳見 [README.md](README.md) 的專案結構章節。重點目錄：

| 目錄 | 用途 |
|------|------|
| `src/components/MindMap/` | ReactFlow 心智圖元件 |
| `src/components/Layout/` | Header, Sidebar, Footer |
| `src/pages/` | 路由頁面 |
| `src/hooks/` | 自訂 Hooks |
| `src/types/` | TypeScript 型別定義 |
| `src/data/subjects/` | 科目 JSON 資料 |

## 程式碼規範

### React 元件

- 型別使用 `React.FC<Props>`，Props 用具名 interface（如 `TopicCardProps`）
- 使用 **default export**
- Props 在函式簽名中解構
- ReactFlow 自定義節點**必須**用 `React.memo()` 包裹

### 樣式

- **Tailwind CSS** utility classes 為主
- `style` prop 僅用於動態資料值（如 `subject.color`）
- **不使用** CSS Modules 或 styled-components

### 資料

- 科目資料位於 `src/data/subjects/<id>.json`
- 新增/修改內容只需編輯對應的 JSON 檔，不需改其他檔案
- ID 命名規則：`<prefix>-u<N>-t<M>`（如 `bio-u1-t1`）
- 所有內容使用**繁體中文**

### TypeScript

- 避免使用 `any`，從 `src/types/index.ts` 匯入正確型別
- 型別推導能解決的不加多餘 annotation

## Git 規範

### Commit Message 格式

```
<type>: <簡短描述>
```

常用 type：

| Type | 說明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修復 bug |
| `content` | 新增/修改學科資料內容 |
| `refactor` | 重構（不改功能） |
| `docs` | 文件更新 |
| `style` | 樣式調整（不改邏輯） |

範例：
```
feat: 新增英文科 4 科目資料
fix: prevent mind map FOV shift when opening side panel
content: 歷史單元加西元年+依年代全排序
docs: sync all documentation with current codebase state
```

### Branch 命名

```
feat/<功能描述>
fix/<問題描述>
content/<科目名稱>
```

## 新增學科資料流程

1. 在 `src/data/subjects/` 新增或編輯 `<id>.json`
2. 若為全新學科，確認已在 `src/data/exam-subjects.json` 註冊（現有科目新增 unit/topic 不需此步）
3. 執行 `npx tsc --noEmit && npm run build` 驗證
4. 提交 commit，type 使用 `content`

## 部署

推送至 `main` 後，GitHub Actions 自動建置並部署至 GitHub Pages。不需手動觸發。

## 提交 PR

1. Fork 本專案並建立分支
2. 完成修改後確認 `npx tsc --noEmit && npm run build` 通過
3. 提交 PR 並描述變更內容
