import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import SubjectSelectionPage from './pages/SubjectSelectionPage';
import HomePage from './pages/HomePage';
import MindMapPage from './pages/MindMapPage';
import TopicListPage from './pages/TopicListPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow overflow-hidden">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-grow overflow-auto">
            <Routes>
              <Route path="/" element={<SubjectSelectionPage />} />
              <Route path="/subject/:examSubjectId" element={<HomePage />} />
              <Route path="/mindmap/:examSubjectId" element={<MindMapPage />} />
              <Route path="/mindmap/:examSubjectId/:subjectId" element={<MindMapPage />} />
              <Route path="/topics/:examSubjectId" element={<TopicListPage />} />
              {/* Backward compat redirects for old bookmarks */}
              <Route path="/mindmap" element={<Navigate to="/subject/science" replace />} />
              <Route path="/mindmap/biology" element={<Navigate to="/mindmap/science/biology" replace />} />
              <Route path="/mindmap/physics-chemistry" element={<Navigate to="/mindmap/science/physics-chemistry" replace />} />
              <Route path="/mindmap/earth-science" element={<Navigate to="/mindmap/science/earth-science" replace />} />
              <Route path="/topics" element={<Navigate to="/topics/science" replace />} />
            </Routes>
          </main>
        </div>
        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;