# Scan Commands Reference

Phase 0 深度掃描完整指令集。結果儲存為內部工作資料（`_scan_*.txt`）。

## A. 專案結構掃描
```bash
find . -type f \
  -not -path './.git/*' \
  -not -path './node_modules/*' \
  -not -path './vendor/*' \
  -not -path './__pycache__/*' \
  -not -path './.venv/*' \
  -not -path './dist/*' \
  -not -path './build/*' \
  | head -500 > _scan_tree.txt

ls -la > _scan_root.txt
```

## B. 設定檔與元資料掃描
```bash
cat package.json pyproject.toml Cargo.toml go.mod pom.xml build.gradle \
    composer.json Gemfile mix.exs 2>/dev/null > _scan_config.txt

cat Dockerfile docker-compose*.yml .env.example \
    Makefile Procfile serverless.yml 2>/dev/null > _scan_deploy.txt

find .github/workflows .gitlab-ci.yml .circleci Jenkinsfile \
    -type f 2>/dev/null | xargs cat 2>/dev/null > _scan_ci.txt

cat .eslintrc* .prettierrc* .ruff.toml .flake8 .rubocop.yml \
    .editorconfig tsconfig.json 2>/dev/null > _scan_lint.txt
```

## C. README 與文件掃描
```bash
cat README* CONTRIBUTING* ARCHITECTURE* DESIGN* docs/*.md 2>/dev/null > _scan_docs.txt
```

## D. Git 歷史深度掃描
```bash
git log --pretty=format:'{"hash":"%h","date":"%ad","author":"%an","subject":"%s"}' \
  --date=short > _scan_git_history.json

git log --grep='^feat'     --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_feat.txt
git log --grep='^fix'      --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_fix.txt
git log --grep='^refactor' --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_refactor.txt
git log --grep='BREAKING'  --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_breaking.txt
git log --grep='^docs'     --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_docs_commits.txt
git log --grep='^perf'     --pretty=format:'- [%h] %s (%ad, %an)' --date=short > _scan_perf.txt

git tag --sort=-version:refname > _scan_tags.txt
git log --oneline --decorate --all | grep 'tag:' > _scan_tag_commits.txt
git branch -a > _scan_branches.txt

git log --format= --name-only | sort | uniq -c | sort -rn | head -50 > _scan_hot_files.txt
git log --grep='^fix' --format= --name-only | sort | uniq -c | sort -rn | head -30 > _scan_fix_hotspots.txt

git shortlog -sn --no-merges > _scan_contributors.txt

git log --reverse --format='%h %ad %s' --date=short | head -1 > _scan_first_commit.txt
git log --format='%h %ad %s' --date=short | head -1 > _scan_last_commit.txt
```

## E. 程式碼深度掃描
```bash
find . -name 'main.*' -o -name 'index.*' -o -name 'app.*' -o -name 'server.*' \
  -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null > _scan_entrypoints.txt

grep -rn 'router\.\|@app\.\|@Get\|@Post\|@Put\|@Delete\|@Route\|@Controller\|@RequestMapping\|HandleFunc\|http\.Handle' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  --include='*.java' --include='*.rs' --include='*.rb' \
  . 2>/dev/null > _scan_routes.txt

grep -rn 'class.*Model\|class.*Entity\|class.*Schema\|@Entity\|@Table\|CREATE TABLE\|db\.Model\|Schema({' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  --include='*.java' --include='*.rs' --include='*.rb' \
  . 2>/dev/null > _scan_models.txt

find . -path '*/migration*' -o -path '*/migrate*' -type f 2>/dev/null > _scan_migrations.txt

find . -name '*test*' -o -name '*spec*' -o -name '*_test.*' \
  -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null > _scan_tests.txt
grep -rn 'describe\|it(\|test(\|func Test\|def test_\|#\[test\]' \
  --include='*.test.*' --include='*.spec.*' --include='*_test.*' \
  . 2>/dev/null > _scan_test_descriptions.txt

grep -rn 'middleware\|interceptor\|guard\|filter\|hook\|plugin' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  --include='*.java' . 2>/dev/null > _scan_middleware.txt

grep -rn 'TODO\|FIXME\|HACK\|XXX\|WORKAROUND\|DEPRECATED\|@deprecated' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  --include='*.java' --include='*.rs' --include='*.rb' \
  . 2>/dev/null > _scan_tech_debt.txt

grep -rn 'process\.env\|os\.environ\|os\.Getenv\|env::\|ENV\[' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  --include='*.java' --include='*.rs' --include='*.rb' \
  . 2>/dev/null > _scan_env_vars.txt

grep -rn 'catch\|except\|rescue\|recover\|Error\|panic\|throw' \
  --include='*.ts' --include='*.js' --include='*.py' --include='*.go' \
  . 2>/dev/null | head -100 > _scan_error_handling.txt
```

## 掃描結果分類

| 分類 | 定義 | 處理方式 |
|------|------|---------|
| ✅ **已確認** | 程式碼中有明確證據 | 直接寫入文件 |
| ⚠️ **需確認** | 有跡象但不確定 | 列入 Phase 1 提問清單 |
| ❌ **無資料** | 完全無法從程式碼推斷 | 列入 Phase 1 必問清單 |
