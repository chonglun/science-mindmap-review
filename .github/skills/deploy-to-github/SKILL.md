---
name: deploy-to-github
description: 'Deploy to GitHub: commit and push with pre-flight checks. Use when: git push, commit, deploy, 進版, 推到 GitHub, push to GitHub, 部署. Runs build verification, documentation sync, and git operations.'
---

# Deploy to GitHub — Pre-flight Check & Push

## When to Use

- User asks to commit, push, deploy, or 進版 to GitHub
- After completing a feature, fix, or content expansion
- Before any `git push` to `main`

## Procedure

### Step 1: Build verification

```bash
npx tsc --noEmit && npx vite build
```

If either fails, fix errors before proceeding. Do NOT skip this step.

### Step 2: Identify changed files

```bash
git diff --stat HEAD
git diff --name-only HEAD
```

Review the list. Categorize changes as:
- **Source code** (`src/`)
- **Documentation** (`.github/`, `README.md`)
- **Config** (`vite.config.ts`, `package.json`, etc.)

### Step 3: Documentation sync (if source code changed)

If any `src/` files changed, check each documentation file for stale references. Compare the **actual file tree** against what each doc describes.

#### 3a. Get actual file tree

```bash
find src -type f | sort
```

#### 3b. Check each doc against reality

| Document | What to verify |
|----------|---------------|
| `.github/copilot-instructions.md` | Architecture tree matches actual files; no deleted files listed; no missing new files; hooks/pages/data sections accurate |
| `README.md` | Project Structure tree matches; feature list current |
| `.github/agents/content-expander.agent.md` | Data file listings match `src/data/subjects/`; ID rules cover all subjects |
| `.github/agents/mindmap-developer.agent.md` | MindMap component listing matches `src/components/MindMap/`; data flow description accurate |
| `.github/agents/ui-developer.agent.md` | File tree matches actual pages, components, hooks |
| `.github/agents/code-quality.agent.md` | Tech debt table reflects current state (resolved items noted) |
| `.github/agents/reviewer.agent.md` | Review criteria still valid |
| `.github/prompts/expand-content.prompt.md` | Data file listings and ID rules cover all subjects |

#### 3c. Fix stale references

For each inconsistency found:
- Remove references to deleted files
- Add references to new files
- Update descriptions that no longer match behavior
- Update feature descriptions for new capabilities

Use `multi_replace_string_in_file` for efficiency when fixing multiple docs.

### Step 4: Re-verify build (if docs were edited)

Only needed if Step 3 modified any source files (rare for doc-only changes):

```bash
npx tsc --noEmit && npx vite build
```

### Step 5: Stage, commit, and push

```bash
git add -A
git status          # Review staged changes one more time
git commit -m "<type>: <concise summary>

<optional body with details>"
git push
```

#### Commit message conventions

| Prefix | When |
|--------|------|
| `feat:` | New feature or capability |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code restructure, no behavior change |
| `style:` | Formatting, Tailwind changes |
| `content:` | Subject data expansion (new topics, exam questions) |
| `chore:` | Config, deps, build changes |

If changes span multiple categories, use the primary category and list others in the body.

## Rules

1. **Never skip the build check** — broken builds must not be pushed
2. **Always sync docs when `src/` changes** — stale docs mislead agents and developers
3. **Don't auto-fix docs without reading them first** — read each file before editing to avoid introducing new errors
4. **Use descriptive commit messages** — future agents and developers rely on git history
5. **One commit per logical change** — don't bundle unrelated changes unless they were developed together

## Quick Mode

If user says "快速進版" or the changes are doc-only / trivial (e.g., typo fix), you may abbreviate:

1. `npx tsc --noEmit && npx vite build`
2. `git add -A && git status`
3. Confirm with user → `git commit -m "..." && git push`

Skip Step 3 (doc sync) only if zero `src/` files changed.
