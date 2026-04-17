# Copilot Instructions — 國中會考心智圖複習網站

## Project Overview

Interactive mind-map review site for Taiwan junior-high exam (國中會考). Covers all five exam categories: Natural Science (自然科), Social Studies (社會科), Chinese (國文), English (英文), and Math (數學).
Students explore subjects through a ReactFlow-based mind map, view topic details (life-hooks, core concepts, past exam questions) in a resizable side panel, and track read / bookmarked topics via localStorage.

## Tech Stack

- **Framework**: React 18 + TypeScript 5 (Vite 5, `react-jsx` runtime)
- **Styling**: Tailwind CSS 3 — utility classes preferred; inline `style` only for dynamic colors/sizes
- **Mind Map**: ReactFlow **11** with custom node/edge types (NOT v12/xyflow — API differs)
- **Icons**: lucide-react
- **Routing**: React Router v6 (`HashRouter` — required for GitHub Pages SPA)
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Commands

Always run `npm install` first if `node_modules/` is missing or after changing `package.json`.

```bash
# Build & validate (run in this order)
npm install          # Install dependencies (required first)
npx tsc --noEmit     # Type-check without emitting
npm run build        # Production build → dist/ (Vite)

# Development
npm run dev          # Vite dev server, port 3000, auto-opens browser
npm run serve        # Preview dist/ locally

# Deploy
npm run deploy       # Deploy dist/ to GitHub Pages (gh-pages -d dist)

# Lint
npx eslint src/      # Lint check (TypeScript-aware)
```

**Verification command** (always run before claiming work is done):
```bash
npx tsc --noEmit && npx vite build
```

> **SSL note**: Corporate proxy may block npm registry. If `npm install` hangs, run `npm config set strict-ssl false` first.

## Architecture

```
src/
├── components/
│   ├── Layout/             # Header, SearchBar, Sidebar (collapsible), SidebarSearch (mind-map scoped), Footer
│   ├── MindMap/
│   │   ├── MindMapCanvas   # 4-level node/edge graph; ReactFlowProvider wrapper; focusSubjectId/focusTopicId auto-focus
│   │   ├── TopicNode       # Center + Subject-level nodes (colored bg)
│   │   ├── UnitNode        # Unit-level nodes (importance stars, stage label)
│   │   └── SubtopicNode    # Leaf topic nodes (green border + ✓ when read)
│   ├── SubjectPanel.tsx    # Resizable right-side detail panel (hook, concepts, exam Qs)
│   └── UI/
│       └── TopicCard.tsx   # Subject/topic card component
├── pages/
│   ├── SubjectSelectionPage.tsx  # Landing page (/)
│   ├── HomePage.tsx              # Subject cards (/subject/:examSubjectId)
│   ├── MindMapPage.tsx           # Mind map view (/mindmap/:examSubjectId/:subjectId?)
│   └── TopicListPage.tsx         # Flat topic list (/topics/:examSubjectId)
├── hooks/
│   ├── useSubjectData.ts   # Dynamic import + cache for subject JSON (code splitting); useAllSubjects, findTopicWithPath
│   ├── useExamSubjectId.ts # Route-aware exam subject context extraction
│   ├── useSearch.ts        # Global topic search across all exam subjects
│   └── useUserData.ts      # localStorage: bookmarked / read topics tracking
├── data/
│   ├── exam-subjects.json  # Exam subject registry (自然科, 社會科, etc.)
│   └── subjects/
│       ├── biology.json           # 生物 (10 units)
│       ├── physics-chemistry.json # 理化 (12 units)
│       ├── earth-science.json     # 地球科學 (6 units)
│       ├── history.json           # 歷史
│       ├── geography.json         # 地理
│       ├── civics.json            # 公民與社會
│       ├── chinese.json           # 國文 (3 units)
│       ├── math.json              # 數學 (13 units)
│       ├── english-vocabulary.json     # 英文字彙與片語 (4 units)
│       ├── english-grammar.json        # 英文文法句型 (5 units)
│       ├── english-reading.json        # 英文閱讀與題型攻略 (4 units)
│       └── english-listening.json      # 英文聽力測驗 (3 units)
└── types/                  # SubjectData, Unit, Topic, PastExamQuestion, UnitImportance, ExamStrategy, UnitStrategy
```

## Data Architecture

### Hierarchy: center → subjects → units → topics

```
exam-subjects.json (static import — exam subject registry)
  └─ examSubjects[] → { id, label, subjects[] → { id, label, color } }

<subject>.json (dynamic import — loaded on demand, cached)
  └─ units[]
      ├─ id, name, stage, importance { stars, level, tip }
      ├─ unitStrategy? → { examinerPerspective, scoringTips[], commonTraps[], thinkingPath }
      └─ topics[]
          ├─ id, name, hook (生活聯想)
          ├─ coreConcepts[] (string[])
          ├─ pastExamQuestions[] → { year, question, options?, answer, explanation? }
          └─ examStrategy? → { examinerThinking, solvingSteps[], thinkingRules[] }
```

- **Exam subject registry**: `exam-subjects.json` maps all 5 exam categories (自然科, 社會科, 國文, 英文, 數學) to their constituent subjects.
- **Code splitting**: `useSubjectData` hook loads subject JSON via `import()` on demand; results cached in module-level `Record`. Vite auto-generates separate chunks.
- **Dual structure**: Subjects may have nested `units[]` or flat `topics[]`. Always handle both paths (see `findTopicWithPath`).
- **Adding/changing subject data**: Edit the individual `src/data/subjects/<id>.json` file. No other files need updating unless the schema changes.

### localStorage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `science-mindmap-clicked-topics` | `string[]` | Topic IDs that have been viewed |
| `science-mindmap-bookmarked-topics` | `string[]` | Bookmarked topic IDs |
| `science-mindmap-read-topics` | `string[]` | Topics marked as read |

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
- **Auto-focus**: `MindMapCanvas` accepts `focusSubjectId` and `focusTopicId` props; wraps inner component in `ReactFlowProvider` and uses `useReactFlow().fitView()` to animate focus to selected subject or topic nodes.

### Language
- UI labels, topic content, and exam questions are all in **Traditional Chinese (繁體中文)**.
- Keep new user-facing text in Chinese to match.

## Pitfalls & Gotchas

- **ReactFlow v11 only** — do NOT use `@xyflow/react` or v12 imports.
- **No test framework configured yet** — Vitest is planned but not installed. TDD workflow applies once configured.
- Path alias `@` → `src/` in `vite.config.ts`.
- Vite base path is `/science-mindmap-review/` for GitHub Pages.
- GitHub Actions deploy uses Node 20.

## Development Workflow

Feature work follows: **Brainstorming → Design Doc → Task Plan → Implementation → Code Review**.
This workflow is driven by the `planner` orchestrator agent with handoffs. Use the agents dropdown to start.
Skills in `.github/skills/` are loaded automatically by agents when relevant — see each SKILL.md for details.

## Custom Agents

See `.github/agents/` for specialized agents. Key agents:

| Agent | Role |
|-------|------|
| `planner` | Orchestrator — brainstorming → planning → implementation → review (use handoffs) |
| `code-reviewer` | Code review against plan + coding standards (read-only) |
| `content-expander` | Expand subject JSON data (exam questions, concepts, hooks) |
| `domain-expert` | Review educational content correctness (read-only) |
| `mindmap-developer` | ReactFlow canvas, nodes, layout |
| `ui-developer` | React + Tailwind pages and components |
| `code-quality` | Refactoring, type safety, dead code cleanup |
| `doc-writer` | Documentation maintenance |

## Skills

See `.github/skills/` — each skill folder contains a SKILL.md with tested instructions. Skills are loaded on-demand by agents.

### Workflow Skills
- **brainstorming** — Explore intent, propose approaches, get design approval before any code.
- **writing-plans** — Create fine-grained task plans from approved specs.
- **executing-plans** / **subagent-driven-development** — Execute plans task-by-task.
- **finishing-a-development-branch** — Verify → merge/PR/keep/discard options.

### Quality Skills
- **test-driven-development** — Red-Green-Refactor cycle (once test framework is configured).
- **requesting-code-review** / **receiving-code-review** — Dispatch and handle code reviews.
- **verification-before-completion** — Evidence before claims.
- **systematic-debugging** — Root cause investigation before fixes.

### Utility Skills
- **expand-json-data** — Anti-timeout pattern for large Chinese JSON content.
- **deploy-to-github** — Pre-flight checks before push.
- **dispatching-parallel-agents** / **using-git-worktrees** / **reverse-spec-from-code** / **writing-skills**
