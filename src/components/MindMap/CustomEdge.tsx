import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const CustomEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY }) => {
    const [path] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <path
            id={id}
            d={path}
            style={{ stroke: '#94a3b8', strokeWidth: 2, fill: 'none' }}
        />
    );
};

export default CustomEdge;