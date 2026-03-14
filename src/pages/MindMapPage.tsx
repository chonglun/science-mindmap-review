import React, { useState, useCallback } from 'react';
import MindMapCanvas from '../components/MindMap/MindMapCanvas';
import SubjectPanel from '../components/SubjectPanel';
import { useUserData } from '../hooks/useUserData';
import { useAllSubjects, findTopicInSubjects } from '../hooks/useSubjectData';

interface TopicDetail {
  id: string;
  name: string;
  hook: string;
  coreConcepts: string[];
  pastExamQuestions: { year: string; question: string; answer: string }[];
}

const MindMapPage: React.FC = () => {
  const { clickedTopics, addClickedTopic, toggleBookmark, isBookmarked } = useUserData();
  const { subjects, loading, center } = useAllSubjects();
  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const topic = findTopicInSubjects(subjects, nodeId);
      if (topic) {
        addClickedTopic(nodeId);
        setSelectedTopic(topic);
      }
    },
    [addClickedTopic, subjects]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-130px)]">
        <p className="text-gray-500 text-lg">載入心智圖資料中...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-130px)]">
      <MindMapCanvas
        clickedTopics={clickedTopics}
        onNodeClick={handleNodeClick}
        subjects={subjects}
        center={center}
      />

      <SubjectPanel
        topic={selectedTopic}
        isBookmarked={selectedTopic ? isBookmarked(selectedTopic.id) : false}
        onToggleBookmark={toggleBookmark}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
};

export default MindMapPage;