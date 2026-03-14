import React from 'react';
import { Handle, Position } from 'reactflow';

interface SubtopicNodeProps {
  data: {
    label: string;
    color?: string;
    isClicked?: boolean;
  };
}

const SubtopicNode: React.FC<SubtopicNodeProps> = ({ data }) => {
  const borderColor = data.isClicked ? '#22c55e' : (data.color ?? '#93c5fd');
  const borderWidth = data.isClicked ? 3 : 2;

  return (
    <div
      className="bg-white px-4 py-2.5 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      style={{ border: `${borderWidth}px solid ${borderColor}` }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-300" />
      <div className="text-left text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        <span>{data.label}</span>
        {data.isClicked && (
          <span className="text-xs text-green-600 whitespace-nowrap">✓</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-300" />
    </div>
  );
};

export default React.memo(SubtopicNode);