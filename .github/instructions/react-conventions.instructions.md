---
applyTo: "**/*.tsx,**/*.ts"
---

# React + TypeScript 慣例

- Components: `React.FC<Props>` with named interface (`XxxProps`), default export, destructure props in signature.
- ReactFlow custom nodes MUST be wrapped in `React.memo()`.
- Styling: Tailwind utility classes only. Inline `style` only for dynamic data values (e.g., `subject.color`). No CSS modules or styled-components.
- Imports: ReactFlow v11 from `'reactflow'` — NEVER use `@xyflow/react` (v12).
- Icons: `lucide-react` only.
- UI text: Traditional Chinese (繁體中文).
- Path alias: `@` → `src/`.
