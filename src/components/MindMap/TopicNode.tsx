import React from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TopicNodeProps {
  data: {
    label: string;
    color?: string;
    isCenter?: boolean;
    isCollapsed?: boolean;
    childCount?: number;
  };
}

const TopicNode: React.FC<TopicNodeProps> = ({ data }) => {
  const bg = data.color ?? '#3b82f6';
  const size = data.isCenter ? 'text-xl px-6 py-4' : 'text-lg px-5 py-3';
  const hasChildren = data.childCount != null;

  return (
    <div
      className={`text-white rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 ${size}`}
      style={{ backgroundColor: bg }}
    >
      {!data.isCenter && <Handle type="target" position={Position.Left} className="!bg-white" />}
      <div className="font-bold whitespace-nowrap flex items-center gap-1">
        {data.label}
        {hasChildren && (
          <span className="inline-flex items-center ml-1 opacity-80">
            {data.isCollapsed
              ? <><ChevronRight size={16} /><span className="text-xs">({data.childCount})</span></>
              : <ChevronDown size={16} />}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white" />
    </div>
  );
};

export default React.memo(TopicNode);