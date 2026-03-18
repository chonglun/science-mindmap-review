# Copilot Instructions — 國中自然科會考心智圖複習網站

## Project Overview

Interactive mind-map review site for Taiwan junior-high Natural Science exam (會考自然科).
Students explore Biology (生物), Physics & Chemistry (理化), and Earth Science (地球科學) through a ReactFlow-based mind map, view topic details (life-hooks, core concepts, past exam questions) in a side panel, and track visited / bookmarked topics via localStorage.

## Tech Stack

- **Framework**: React 18 + TypeScript 5 (Vite 5, `react-jsx` runtime)
- **Styling**: Tailwind CSS 3 — utility classes preferred; inline `style` only for dynamic colors/sizes
- **Mind Map**: ReactFlow 11 with custom node/edge types
- **Icons**: lucide-react
- **Routing**: React Router v6 (BrowserRouter)
- **Deployment**: GitHub Pages via `gh-pages` package + GitHub Actions

## Commands

```bash
npm run dev      # Vite dev server, port 3000, auto-opens browser
npm run build    # Production build → dist/
npm run serve    # Preview dist/ locally
npm run deploy   # Deploy dist/ to GitHub Pages
npx tsc --noEmit # Type-check without emitting
```

> **SSL note**: Corporate proxy may block npm registry. If `npm install` hangs, run `npm config set strict-ssl false` first.

## Architecture

```
src/
├── components/          # Presentational components
│   ├── Layout/          # Header, Sidebar, Footer (app shell)
│   ├── MindMap/         # ReactFlow nodes & edges
│   │   ├── MindMapCanvas.tsx   # Builds nodes/edges from topics.json
│   │   ├── TopicNode.tsx       # Subject-level node (colored)
│   │   └── SubtopicNode.tsx    # Topic-level node (green border when clicked)
│   └── UI/              # Reusable widgets (SearchBar, TopicCard, ProgressTracker)
├── pages/               # Route-level components (HomePage, MindMapPage, TopicListPage)
├── hooks/               # Custom hooks
│   ├── useUserData.ts   # localStorage: clickedTopics + bookmarkedTopics
│   └── useMindMapData.ts
├── data/
│   └── topics.json      # Single source of truth for all subject/topic content
├── types/               # Shared TypeScript interfaces
└── utils/               # Pure helper functions
```

## Key Conventions

### Components
- Type as `React.FC<Props>` with a named interface (`XxxProps`).
- Use **default exports**.
- Destructure props in the function signature.

### Styling
- Tailwind utility classes for layout, spacing, colors.
- Inline `style` prop only for values that come from data (e.g., `subject.color`).
- No CSS modules or styled-components.

### Data
- All curriculum content lives in `src/data/topics.json` (center → subjects → topics).
- Each topic has: `id`, `name`, `hook` (生活聯想), `coreConcepts[]`, `pastExamQuestions[]`.
- Components import the JSON directly (`import topicsData from '../../data/topics.json'`).
- User state (clicked / bookmarked) is managed by `useUserData` hook via localStorage with JSON validation.

### Mind Map Nodes
- Node positions are calculated with hardcoded spacing constants in `MindMapCanvas.tsx`.
- Clicked topics show a **green border + ✓ 已讀** badge on `SubtopicNode`.
- Subject node colors come from `topics.json`.

### Language
- UI labels, topic content, and exam questions are all in **Traditional Chinese (繁體中文)**.
- Keep new user-facing text in Chinese to match.

## Pitfalls & Gotchas

- `reactflow` v11 — do **not** use v12/xyflow imports (API differs).
- `topics.json` structure changes require updating `MindMapCanvas`, `MindMapPage`, and `TopicListPage`.
- No test framework is configured (no Jest/Vitest).
- Node 16+ required for GitHub Actions deploy workflow.
- Path alias `@` → `src/` is configured in `vite.config.ts`.

## Custom Agents

| Agent | 職責 | 觸發時機 |
|-------|------|----------|
| `content-expander` | 擴增學科 JSON 資料 | 新增考題、補充觀念、擴充單元 |
| `mindmap-developer` | ReactFlow 心智圖開發 | 修改節點、邊、佈局、展開收合 |
| `ui-developer` | UI 元件與頁面開發 | 修改版面、樣式、響應式、路由 |
| `code-quality` | 重構與品質改善 | 清理死碼、型別安全、效能優化 |
| `reviewer` | Code Review（唯讀） | 審查變更、PR review |
