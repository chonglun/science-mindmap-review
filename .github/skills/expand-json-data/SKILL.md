---
name: expand-json-data
description: 'Generate large JSON data files without timeout. Use when: expanding subject content, adding exam questions, creating new subject JSON files, bulk topic generation, content expansion that produces >50 lines of Chinese text. Prevents "No response was returned" errors.'
---

# Expand JSON Data — Anti-Timeout Pattern

## Problem

Generating large JSON files with Chinese content causes "No response was returned" errors due to:
- `create_file` with >80 lines overflows output tokens
- Long conversation context + large file content = token limit exceeded
- Heredoc (`<<`) with Chinese in zsh causes encoding corruption (`<ffffffff>` garbage)

## Procedure

### Step 1: Plan the split

For each subject JSON (~40 topics), split into script files of **≤2 units per file** (~60 lines each):

```
scripts/<subject>-1.js   # units 1-2
scripts/<subject>-2.js   # units 3-4
scripts/<subject>-3.js   # units 5-6
scripts/<subject>-4.js   # units 7-8
scripts/<subject>-5.js   # units 9-10 (if needed)
scripts/<subject>-write.js  # combines + writes JSON
```

### Step 2: Create data scripts (ONE file per tool call)

Each data script file pushes units to a shared `units` array:

```javascript
// scripts/<subject>-1.js
const units = [];
units.push({
  id:"unit-id", name:"單元名稱", stage:"七年級上學期",
  importance:{stars:3,level:"高出題率",tip:"每年2~3題"},
  topics:[
    {id:"topic-id", name:"主題名",
     hook:"生活化比喻2-3句",
     coreConcepts:["觀念1","觀念2","觀念3"],
     pastExamQuestions:[
       {year:"112年",question:"題目",answer:"答案與解析"},
       {year:"110年",question:"題目",answer:"答案與解析"},
       {year:"108年",question:"題目",answer:"答案與解析"}
     ]},
    // ... more topics
  ]
});
```

**CRITICAL**: Create only ONE script file per `create_file` call. Never create two at once.

### Step 3: Create the write script

```javascript
// scripts/<subject>-write.js
const fs = require('fs');
const units = [];
// Load all parts in order
```

The write script is generated last and includes `require('fs')` + `JSON.stringify` + `writeFileSync`.

### Step 4: Combine and execute

```bash
cat scripts/<subject>-*.js > scripts/all.js && node scripts/all.js
```

Or if using a separate write script:

```bash
cat scripts/<subject>-[0-9]*.js scripts/<subject>-write.js > scripts/all.js
node scripts/all.js
```

### Step 5: Verify

```bash
# Check structure
node -e "const d=JSON.parse(require('fs').readFileSync('src/data/subjects/<id>.json','utf8')); console.log('units:', d.units.length); d.units.forEach(u=>console.log('  '+u.id+' topics:'+u.topics.length))"

# Type check + build
npx tsc --noEmit && npx vite build
```

### Step 6: Cleanup

```bash
rm scripts/<subject>-*.js scripts/all.js
# Only rmdir when all subjects are done
```

## Rules

1. **≤60 lines per script file** — prevents token overflow on `create_file`
2. **≤2 units per script file** — keeps each file small
3. **ONE `create_file` per turn** when context is heavy — if context summary is long, create only 1 file then proceed to next
4. **Chinese text stays as-is in .js files** — Node.js handles UTF-8 natively; no need for `\uXXXX` escapes
5. **Never use heredoc** (`<< 'EOF'`) with Chinese content — causes zsh encoding corruption
6. **Never use `node -e` with inline Chinese** — shell escaping issues
7. **If a step times out, DON'T restart** — previous files are saved on disk; just continue from where it stopped
8. **Each topic needs**: `id`, `name`, `hook` (2-3 sentences, life-connected), `coreConcepts` (≥3), `pastExamQuestions` (≥3 with year+question+answer)

## Recovery from Timeout

If "No response was returned" occurs mid-expansion:
1. Check existing scripts: `ls scripts/<subject>-*.js`
2. Check which units exist: `grep 'id:"<prefix>-u' scripts/<subject>-*.js`
3. Continue from the next unwritten script file
4. DO NOT recreate files that already exist
