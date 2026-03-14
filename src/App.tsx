import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
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
              <Route path="/" element={<HomePage />} />
              <Route path="/mindmap" element={<MindMapPage />} />
              <Route path="/mindmap/:subjectId" element={<MindMapPage />} />
              <Route path="/topics" element={<TopicListPage />} />
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