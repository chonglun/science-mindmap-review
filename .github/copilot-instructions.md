# Copilot Instructions — 國中會考心智圖複習網站

## Project Overview

Interactive mind-map review site for Taiwan junior-high exam (國中會考). Covers Natural Science and Social Studies; more subjects planned.
Students explore subjects (Biology, Physics & Chemistry, Earth Science, History, Geography, Civics) through a ReactFlow-based mind map, view topic details (life-hooks, core concepts, past exam questions) in a resizable side panel, and track read / bookmarked topics via localStorage.

## Tech Stack

- **Framework**: React 18 + TypeScript 5 (Vite 5, `react-jsx` runtime)
- **Styling**: Tailwind CSS 3 — utility classes preferred; inline `style` only for dynamic colors/sizes
- **Mind Map**: ReactFlow **11** with custom node/edge types (NOT v12/xyflow — API differs)
- **Icons**: lucide-react
- **Routing**: React Router v6 (`HashRouter` — required for GitHub Pages SPA)
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Commands

```bash
npm run dev      # Vite dev server, port 3000, auto-opens browser
npm run build    # Production build → dist/
npm run serve    # Preview dist/ locally
npm run deploy   # Deploy dist/ to GitHub Pages (gh-pages -d dist)
npx tsc --noEmit # Type-check without emitting
```

> **SSL note**: Corporate proxy may block npm registry. If `npm install` hangs, run `npm config set strict-ssl false` first.

## Architecture

```
src/
├── components/
│   ├── Layout/             # Header, Sidebar (collapsible), Footer (app shell)
│   ├── MindMap/
│   │   ├── MindMapCanvas   # 4-level node/edge graph; ReactFlowProvider wrapper; focusSubjectId auto-focus
│   │   ├── TopicNode       # Center + Subject-level nodes (colored bg)
│   │   ├── UnitNode        # Unit-level nodes (importance stars, stage label)
│   │   ├── SubtopicNode    # Leaf topic nodes (green border + ✓ when read)
│   │   └── CustomEdge      # Colored animated edges
│   ├── SubjectPanel.tsx    # Resizable right-side detail panel (hook, concepts, exam Qs)
│   └── UI/                 # SearchBar, TopicCard, ProgressTracker
├── pages/
│   ├── SubjectSelectionPage.tsx  # Landing page (/)
│   ├── HomePage.tsx              # Subject cards (/subject/:examSubjectId)
│   ├── MindMapPage.tsx           # Mind map view (/mindmap/:examSubjectId/:subjectId?)
│   └── TopicListPage.tsx         # Flat topic list (/topics/:examSubjectId)
├── hooks/
│   ├── useSubjectData.ts   # Dynamic import + cache for subject JSON (code splitting)
│   ├── useExamSubjectId.ts # Route-aware exam subject context extraction
│   └── useUserData.ts      # localStorage: clicked / bookmarked / read topics
├── data/
│   ├── exam-subjects.json  # Exam subject registry (自然科, 社會科, etc.)
│   └── subjects/
│       ├── index.json             # Lightweight metadata (id, label, color per subject)
│       ├── biology.json           # 生物 (10 units)
│       ├── physics-chemistry.json # 理化 (12 units)
│       ├── earth-science.json     # 地球科學 (6 units)
│       ├── history.json           # 歷史
│       ├── geography.json         # 地理
│       ├── civics.json            # 公民與社會
│       ├── chinese.json           # 國文 (3 units)
│       └── math.json              # 數學 (13 units)
└── types/                  # SubjectData, Unit, Topic, PastExamQuestion, UnitImportance, ExamStrategy, UnitStrategy
```

## Data Architecture

### Hierarchy: center → subjects → units → topics

```
index.json (static import — metadata only)
  └─ subjects[] → { id, label, color }

<subject>.json (dynamic import — loaded on demand, cached)
  └─ units[]
      ├─ id, name, stage, importance { stars, level, tip }
      └─ topics[]
          ├─ id, name, hook (生活聯想)
          ├─ coreConcepts[] (string[])
          └─ pastExamQuestions[] → { year, question, options?, answer, explanation? }
```

- **Exam subject registry**: `exam-subjects.json` maps exam categories (自然科, 社會科) to their constituent subjects.
- **Code splitting**: `useSubjectData` hook loads subject JSON via `import()` on demand; results cached in module-level `Record`. Vite auto-generates separate chunks.
- **Dual structure**: Subjects may have nested `units[]` or flat `topics[]`. Always handle both paths (see `findTopicWithPath`).
- **Adding/changing subject data**: Edit the individual `src/data/subjects/<id>.json` file. No other files need updating unless the schema changes.

### localStorage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `science-mindmap-clicked-topics` | `string[]` | Topic IDs that have been viewed |
| `science-mindmap-bookmarked-topics` | `string[]` | Bookmarked topic IDs |
| `science-mindmap-read-topics` | `string[]` | Topics marked as read |
| `progress` | `string` | Overall completion percentage (decimal) |

## Key Conventions

### Components
- Type as `React.FC<Props>` with a named interface (`XxxProps`).
- Use **default exports**.
- Destructure props in the function signature.
- **ReactFlow node components must be wrapped in `React.memo`** — they re-render on every pan/zoom.

### Styling
- Tailwind utility classes for layout, spacing, colors.
- Inline `style` prop only for values that come from data (e.g., `subject.color`).
- No CSS modules or styled-components.

### Mind Map
- **4-level left-to-right layout**: Center (x:0) → Subjects (x:240) → Units (x:480) → Topics (x:740).
- Layout constants are hardcoded in `MindMapCanvas.tsx` (`NODE_H`, `UNIT_NODE_H`, `TOPIC_GAP`, etc.).
- **Collapse/expand**: Tracked via `collapsedNodes` Set. Collapsed children are excluded from the node array (not hidden via CSS). Positions recalculate dynamically.
- Node click: if `node.data.childCount != null` → toggle collapse; otherwise → open detail panel.
- Subject node colors come from subject data. Read topics show green border + ✓ badge.
- **Auto-focus**: `MindMapCanvas` accepts `focusSubjectId` prop; wraps inner component in `ReactFlowProvider` and uses `useReactFlow().fitView()` to animate focus to selected subject nodes.

### Language
- UI labels, topic content, and exam questions are all in **Traditional Chinese (繁體中文)**.
- Keep new user-facing text in Chinese to match.

## Pitfalls & Gotchas

- **ReactFlow v11 only** — do NOT use `@xyflow/react` or v12 imports.
- No test framework configured (no Jest/Vitest).
- Path alias `@` → `src/` in `vite.config.ts`.
- Vite base path is `/science-mindmap-review/` for GitHub Pages.
- GitHub Actions deploy uses Node 20.

## Custom Agents

See `.github/agents/` — five specialized agents are defined for content expansion, mind-map development, UI work, code quality, and code review.

## Skills

See `.github/skills/`:
- **expand-json-data** — Anti-timeout pattern for generating large JSON data files with Chinese content.
- **deploy-to-github** — Pre-flight checks (build verification, documentation sync) before committing and pushing to GitHub.
