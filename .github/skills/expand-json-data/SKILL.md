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
- **Multiple `create_file` calls in ONE response** — combined output exceeds token budget even if each file is individually "small"
- **Unicode escapes (`\uXXXX`) inflate token count 3-4x** — `\u8fa8\u8b58\u53e5\u610f` costs ~8 tokens vs `辨識句意` costs ~2 tokens
- **Dense topic structures** (with `options[]`, `examStrategy`, `unitStrategy`) make each unit much larger than simple topics

## Procedure

### Step 1: Plan the split

For each subject JSON, split into script files following these limits:

| Content density | Units per file | Max lines | Max bytes |
|----------------|---------------|-----------|-----------|
| Simple (no options, short concepts) | ≤2 units | ~60 lines | ~5 KB |
| Medium (5+ coreConcepts, examStrategy) | ≤2 units | ~55 lines | ~6 KB |
| Dense (options[], unitStrategy, examStrategy) | **≤1 unit** | ~50 lines | ~6 KB |

**How to judge density**: If topics have `options[]` arrays (multiple choice), `examStrategy`, AND `unitStrategy`, treat as **dense**. English subjects are typically dense.

```
scripts/<subject>-1.js   # unit 1 (or units 1-2 if simple)
scripts/<subject>-2.js   # unit 2 (or units 3-4 if simple)
scripts/<subject>-N.js   # ... one file per unit for dense content
scripts/<subject>-write.js  # combines + writes JSON
```

### Step 2: Create data scripts (**strictly ONE file per `create_file` call**)

**⚠️ NEVER call `create_file` more than once per response.** Even if each file is small, the combined output tokens from two files can exceed the budget — especially when conversation context is already heavy from prior work.

Each data script file pushes units to a shared `units` array. **Use raw Chinese characters**, NOT Unicode escapes:

```javascript
// scripts/<subject>-1.js — Raw Chinese, NOT \uXXXX escapes!
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

**CRITICAL rules for this step:**
- Create only **ONE** script file per `create_file` call — never two
- **Wait for the response** before creating the next file
- Use **raw Chinese characters** in .js files — Node.js handles UTF-8 natively
- Do NOT use `\uXXXX` escapes — they inflate token count 3-4x and provide no benefit
- After creating a file, verify it with `wc -lc scripts/<file>.js` to check size

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

1. **≤60 lines AND ≤6 KB per script file** — line count alone is insufficient; dense Unicode-escaped content can be 10KB+ in 43 lines
2. **≤2 units per file (simple) or ≤1 unit per file (dense)** — topics with `options[]`, `examStrategy`, and `unitStrategy` are dense
3. **Strictly ONE `create_file` call per response** — NEVER call `create_file` twice in the same response, even if files are small. The combined output tokens overflow the budget.
4. **Use raw Chinese characters in .js files** — Node.js handles UTF-8 natively. `\uXXXX` escapes inflate token count 3-4x and cause timeouts. Example: `name:"辨識句意"` NOT `name:"\u8fa8\u8b58\u53e5\u610f"`
5. **Never use heredoc** (`<< 'EOF'`) with Chinese content — causes zsh encoding corruption
6. **Never use `node -e` with inline Chinese** — shell escaping issues
7. **If a step times out, DON'T restart** — previous files are saved on disk; just continue from where it stopped
8. **Each topic needs**: `id`, `name`, `hook` (2-3 sentences, life-connected), `coreConcepts` (≥3), `pastExamQuestions` (≥3 with year+question+answer)
9. **Context awareness**: After creating 2+ subjects in one conversation, context is heavy — be extra conservative with file sizes (≤40 lines, ≤4 KB)
10. **Verify file size after creation**: Run `wc -lc scripts/<file>.js` to confirm the file is within limits before proceeding

## Recovery from Timeout

If "No response was returned" occurs mid-expansion:
1. Check existing scripts: `ls scripts/<subject>-*.js`
2. Check which units exist: `grep 'id:"<prefix>-u' scripts/<subject>-*.js`
3. Check file sizes: `wc -lc scripts/<subject>-*.js`
4. Continue from the next unwritten script file
5. DO NOT recreate files that already exist
6. If files were created with `\uXXXX` escapes, **delete and recreate with raw Chinese** to reduce token cost

## Timeout Case Studies

### Case 1: Two `create_file` calls in one response (el-1.js + el-2.js)
- **Symptom**: "No response was returned" after creating both files
- **el-1.js**: 43 lines, 10.8 KB (Unicode escapes)
- **el-2.js**: 52 lines, 12.3 KB (Unicode escapes)
- **Root cause**: Two `create_file` calls in one response (23 KB combined) + heavy conversation context (3 subjects already completed)
- **Contributing factor**: `\uXXXX` escapes made files 3-4x larger than necessary
- **Fix**: ONE file per response + raw Chinese characters → each file would be ~3-4 KB instead of 10-12 KB

### Case 2: Single large file with heavy context
- **Symptom**: "No response was returned" during `create_file`
- **Root cause**: File >80 lines AND conversation context already heavy from prior reads/edits
- **Fix**: Split into smaller files, reduce context by avoiding unnecessary `read_file` calls
