import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import MindMapCanvas from '../components/MindMap/MindMapCanvas';
import SubjectPanel from '../components/SubjectPanel';
import { useUserData } from '../hooks/useUserData';
import { useAllSubjects, findTopicWithPath } from '../hooks/useSubjectData';
import { useExamSubjectId } from '../hooks/useExamSubjectId';
import type { Topic, UnitStrategy } from '../types';

const MindMapPage: React.FC = () => {
  const { examSubjectId, subjectId } = useParams<{ examSubjectId: string; subjectId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAvailable } = useExamSubjectId();
  const { clickedTopics, readTopics, addClickedTopic, toggleBookmark, toggleReadTopic, isBookmarked } = useUserData();
  const { subjects, loading, center } = useAllSubjects(examSubjectId);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicPath, setTopicPath] = useState<string>('');
  const [selectedUnitStrategy, setSelectedUnitStrategy] = useState<UnitStrategy | undefined>(undefined);
  const [focusTopicId, setFocusTopicId] = useState<string | undefined>(undefined);

  // Auto-select topic from ?topic= query param (e.g. from search)
  const topicParam = searchParams.get('topic');
  const processedTopicRef = useRef<string | null>(null);
  useEffect(() => {
    if (!topicParam || subjects.length === 0 || processedTopicRef.current === topicParam) return;
    processedTopicRef.current = topicParam;
    const result = findTopicWithPath(subjects, topicParam);
    if (result) {
      addClickedTopic(topicParam);
      setSelectedTopic(result.topic);
      setTopicPath(result.path);
      setSelectedUnitStrategy(result.unitStrategy);
      setFocusTopicId(topicParam);
    }
    // Clear the query param to avoid re-triggering
    setSearchParams({}, { replace: true });
  }, [topicParam, subjects, addClickedTopic, setSearchParams]);

  if (examSubjectId && !isAvailable) {
    return <Navigate to="/" replace />;
  }

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setFocusTopicId(undefined);
      const result = findTopicWithPath(subjects, nodeId);
      if (result) {
        addClickedTopic(nodeId);
        setSelectedTopic(result.topic);
        setTopicPath(result.path);
        setSelectedUnitStrategy(result.unitStrategy);
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
        subjects={subjects}
        center={center}
        focusSubjectId={subjectId}
        focusTopicId={focusTopicId}
      />

      <SubjectPanel
        topic={selectedTopic}
        topicPath={topicPath}
        unitStrategy={selectedUnitStrategy}
        isBookmarked={selectedTopic ? isBookmarked(selectedTopic.id) : false}
        onToggleBookmark={toggleBookmark}
        onClose={() => { setSelectedTopic(null); setFocusTopicId(undefined); }}
      />
    </div>
  );
};

export default MindMapPage;