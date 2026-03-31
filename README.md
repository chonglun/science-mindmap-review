# 國中會考心智圖複習網站

互動式心智圖複習網站，涵蓋國中會考五大科目。目前已上線自然科（生物、理化、地球科學）、社會科（歷史、地理、公民與社會）、國文與數學，英文即將推出。透過 ReactFlow 心智圖瀏覽各單元主題，查看生活聯想、核心觀念與歷屆考題，並以 localStorage 追蹤閱讀與收藏進度。

Built with React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + ReactFlow 11.

## Project Structure

```
science-mindmap-review
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components
│   │   ├── Layout/          # Header, Sidebar, Footer
│   │   ├── MindMap/          # MindMapCanvas, TopicNode, UnitNode, SubtopicNode, CustomEdge
│   │   ├── SubjectPanel.tsx  # Resizable detail panel
│   │   └── UI/              # SearchBar, TopicCard, ProgressTracker
│   ├── pages
│   │   ├── SubjectSelectionPage.tsx  # Landing page (/)
│   │   ├── HomePage.tsx              # Subject cards (/subject/:examSubjectId)
│   │   ├── MindMapPage.tsx           # Mind map view (/mindmap/:examSubjectId/:subjectId?)
│   │   └── TopicListPage.tsx         # Flat topic list (/topics/:examSubjectId)
│   ├── hooks
│   │   ├── useSubjectData.ts   # Dynamic import + cache for subject JSON
│   │   ├── useExamSubjectId.ts # Route-aware exam subject context
│   │   └── useUserData.ts      # localStorage: clicked/bookmarked/read topics
│   ├── types
│   │   └── index.ts            # SubjectData, Unit, Topic, PastExamQuestion, ExamStrategy, UnitStrategy
│   └── data
│       ├── exam-subjects.json         # Exam subject registry
│       └── subjects/
│           ├── index.json             # Subject metadata
│           ├── biology.json
│           ├── physics-chemistry.json
│           ├── earth-science.json
│           ├── history.json
│           ├── geography.json
│           ├── civics.json
│           ├── chinese.json
│           ├── math.json
│           ├── english-vocabulary.json
│           ├── english-grammar.json
│           ├── english-reading.json
│           └── english-listening.json
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── .github/workflows/deploy.yml
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/chonglun/science-mindmap-review.git
   cd science-mindmap-review
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` to view the application.

## Features

- 五大會考科目架構（自然科、社會科已上線；國文、英文、數學即將推出）
- ReactFlow 互動式心智圖：四層展開（中心 → 學科 → 單元 → 主題），可收合展開
- 主題詳情面板：生活聯想、核心觀念、歷屆考題
- 閱讀進度追蹤（localStorage）：已讀 ✓、收藏 ☆
- 可調整寬度的側邊詳情面板
- 響應式設計：桌面側邊欄 + 手機底部 Tab Bar
- GitHub Pages 自動部署（GitHub Actions）

## Deployment

This project is configured for deployment on GitHub Pages. To deploy, ensure you have set up the GitHub Actions workflow located in `.github/workflows/deploy.yml`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.