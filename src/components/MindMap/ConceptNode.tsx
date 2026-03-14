import React from 'react';
import { Handle, Position } from 'reactflow';

interface ConceptNodeProps {
  data: {
    label: string;
    description: string;
  };
}

const ConceptNode: React.FC<ConceptNodeProps> = ({ data }) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <Handle type="target" position={Position.Top} />
      <div className="font-bold text-lg">{data.label}</div>
      <div className="text-sm">{data.description}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ConceptNode;