import React, { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

interface SubtopicNodeProps {
  data: {
    label: string;
    color?: string;
    isClicked?: boolean;
    isRead?: boolean;
    onToggleRead?: (topicId: string) => void;
    topicId?: string;
  };
}

const SubtopicNode: React.FC<SubtopicNodeProps> = ({ data }) => {
  const borderColor = data.isRead ? '#22c55e' : (data.color ?? '#93c5fd');
  const borderWidth = data.isRead ? 3 : 2;

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleRead && data.topicId) {
      data.onToggleRead(data.topicId);
    }
  }, [data.onToggleRead, data.topicId]);

  return (
    <div
      className="bg-white px-4 py-2.5 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      style={{ border: `${borderWidth}px solid ${borderColor}` }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-300" />
      <div className="text-left text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            data.isRead
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          title={data.isRead ? '取消已讀' : '標記已讀'}
        >
          {data.isRead && (
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span>{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-300" />
    </div>
  );
};

export default React.memo(SubtopicNode);