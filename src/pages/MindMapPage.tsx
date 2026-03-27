import React, { useState, useCallback, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MindMapCanvas from '../components/MindMap/MindMapCanvas';
import SubjectPanel from '../components/SubjectPanel';
import { useUserData } from '../hooks/useUserData';
import { useAllSubjects, findTopicInSubjects } from '../hooks/useSubjectData';
import { useExamSubjectId } from '../hooks/useExamSubjectId';
import type { Topic } from '../types';

const MindMapPage: React.FC = () => {
  const { examSubjectId, subjectId } = useParams<{ examSubjectId: string; subjectId?: string }>();
  const { isAvailable } = useExamSubjectId();
  const { clickedTopics, readTopics, addClickedTopic, toggleBookmark, toggleReadTopic, isBookmarked } = useUserData();
  const { subjects, loading, center } = useAllSubjects(examSubjectId);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  if (examSubjectId && !isAvailable) {
    return <Navigate to="/" replace />;
  }

  const filteredSubjects = useMemo(
    () => subjectId ? subjects.filter((s) => s.id === subjectId) : subjects,
    [subjects, subjectId]
  );

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
      <div className="flex items-center justify-center h-[calc(100vh-96px)] md:h-[calc(100vh-130px)]">
        <p className="text-gray-500 text-lg">載入心智圖資料中...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-96px)] md:h-[calc(100vh-130px)]">
      <MindMapCanvas
        clickedTopics={clickedTopics}
        readTopics={readTopics}
        onNodeClick={handleNodeClick}
        onToggleRead={toggleReadTopic}
        subjects={filteredSubjects}
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