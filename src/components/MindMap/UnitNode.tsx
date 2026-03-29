import React from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface UnitNodeProps {
  data: {
    label: string;
    color?: string;
    stage?: string;
    isCollapsed?: boolean;
    childCount?: number;
    importance?: { stars: number; level: string; tip: string };
  };
}

const STAR_COLORS: Record<number, string> = { 5: '#ef4444', 4: '#ef4444', 3: '#ef4444', 2: '#f59e0b', 1: '#22c55e' };

function isTopImportance(stars: number): boolean {
  return stars >= 4;
}

const UnitNode: React.FC<UnitNodeProps> = ({ data }) => {
  const borderColor = data.color ?? '#6366f1';
  const hasChildren = data.childCount != null;
  const imp = data.importance;

  return (
    <div
      className="bg-white px-3 py-1.5 rounded-lg shadow cursor-pointer transition-all hover:shadow-md hover:scale-105"
      style={{ border: `2px solid ${borderColor}`, maxWidth: 180 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-300" />
      {/* Row 1: badges */}
      {imp && (
        <div className="flex items-center gap-1 mb-0.5">
          {isTopImportance(imp.stars) && (
            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">🔥 必考</span>
          )}
          <span className="text-xs" style={{ color: STAR_COLORS[imp.stars] || '#6b7280' }} title={`${imp.level}（${imp.tip}）`}>
            {'★'.repeat(Math.min(imp.stars, 5))}
          </span>
        </div>
      )}
      {/* Row 2: label + collapse toggle */}
      <div className="text-sm font-bold flex items-center gap-1" style={{ color: borderColor }}>
        <span className="leading-tight">{data.label}</span>
        {hasChildren && (
          <span className="inline-flex items-center ml-auto opacity-70 shrink-0">
            {data.isCollapsed
              ? <><ChevronRight size={14} /><span className="text-xs">({data.childCount})</span></>
              : <ChevronDown size={14} />}
          </span>
        )}
      </div>
      {/* Row 3: stage */}
      {data.stage && (
        <div className="text-xs text-gray-400 mt-0.5">{data.stage}</div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-gray-300" />
    </div>
  );
};

export default React.memo(UnitNode);
