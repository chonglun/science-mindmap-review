# Junior High School Natural Science Exam Mind Map Review Website

This project is a web application designed to help junior high school students review natural science topics through interactive mind maps. The application is built using React with Vite, TypeScript, and Tailwind CSS, and utilizes the `reactflow` library for rendering mind maps.

## Project Structure

```
science-mindmap-review
├── public
│   └── data
│       └── mindmaps.json
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── components
│   │   ├── Layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── MindMap
│   │   │   ├── MindMapCanvas.tsx
│   │   │   ├── TopicNode.tsx
│   │   │   ├── SubtopicNode.tsx
│   │   │   ├── ConceptNode.tsx
│   │   │   └── CustomEdge.tsx
│   │   └── UI
│   │       ├── SearchBar.tsx
│   │       ├── TopicCard.tsx
│   │       └── ProgressTracker.tsx
│   ├── pages
│   │   ├── HomePage.tsx
│   │   ├── MindMapPage.tsx
│   │   └── TopicListPage.tsx
│   ├── hooks
│   │   ├── useMindMapData.ts
│   │   └── useProgress.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   ├── layoutHelper.ts
│   │   └── mindmapTransform.ts
│   └── data
│       ├── biology.ts
│       ├── chemistry.ts
│       ├── physics.ts
│       └── earthScience.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── .github
│   └── workflows
│       └── deploy.yml
└── README.md
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/science-mindmap-review.git
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

- Interactive mind maps for various natural science topics.
- Search functionality to quickly find topics.
- Progress tracking to monitor learning.
- Responsive design using Tailwind CSS.

## Deployment

This project is configured for deployment on GitHub Pages. To deploy, ensure you have set up the GitHub Actions workflow located in `.github/workflows/deploy.yml`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.