import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Star, X, BookOpen, Lightbulb, HelpCircle, ExternalLink, GripVertical } from 'lucide-react';

interface PastExamQuestion {
  year: string;
  question: string;
  answer: string;
}

interface TopicDetail {
  id: string;
  name: string;
  hook: string;
  coreConcepts: string[];
  pastExamQuestions: PastExamQuestion[];
}

interface SubjectPanelProps {
  topic: TopicDetail | null;
  isBookmarked: boolean;
  onToggleBookmark: (topicId: string) => void;
  onClose: () => void;
}

const MIN_WIDTH = 320;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 384; // sm:w-96

const SubjectPanel: React.FC<SubjectPanelProps> = ({
  topic,
  isBookmarked,
  onToggleBookmark,
  onClose,
}) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startX.current - e.clientX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  if (!topic) return null;

  return (
    <div
      className="fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto"
      style={{ width: isMobile ? '100%' : width }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden sm:flex absolute left-0 top-0 h-full w-2 cursor-col-resize items-center justify-center hover:bg-indigo-100 active:bg-indigo-200 transition-colors group z-10"
      >
        <GripVertical size={14} className="text-gray-300 group-hover:text-indigo-400" />
      </div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 truncate pr-2">
          {topic.name}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggleBookmark(topic.id)}
            className="p-1.5 rounded-full hover:bg-yellow-50 transition-colors"
            title={isBookmarked ? '取消收藏' : '加入最愛'}
          >
            <Star
              size={22}
              className={
                isBookmarked
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }
            />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="關閉"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 生活聯想 Hook */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h3 className="font-semibold text-amber-700">生活聯想</h3>
          </div>
          <p className="text-gray-700 leading-relaxed bg-amber-50 rounded-lg p-3 text-sm">
            {topic.hook}
          </p>
        </section>

        {/* 核心觀念 */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-blue-500" />
            <h3 className="font-semibold text-blue-700">核心觀念</h3>
          </div>
          <ul className="space-y-1.5">
            {topic.coreConcepts.map((concept, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="flex-1">{concept}</span>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(concept + ' 國中自然')}&udm=50`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 mt-0.5 text-blue-400 hover:text-blue-600 transition-colors"
                  title={`用 Google AI 搜尋「${concept}」`}
                >
                  <ExternalLink size={13} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 歷屆考題 */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={18} className="text-purple-500" />
            <h3 className="font-semibold text-purple-700">歷屆考題</h3>
          </div>
          <div className="space-y-3">
            {topic.pastExamQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-block text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    {q.year}
                  </span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(q.question + ' 國中自然')}&udm=50`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-600 transition-colors"
                    title={`用 Google AI 搜尋此題`}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <p className="text-sm text-gray-800 mb-2">{q.question}</p>
                <details className="group">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 select-none">
                    顯示答案
                  </summary>
                  <p className="mt-1.5 text-sm text-green-700 bg-green-50 rounded p-2">
                    {q.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubjectPanel;
