export const calculateLayout = (nodes: any[], width: number, height: number) => {
    const spacing = 100; // Space between nodes
    const layout: { [key: string]: { x: number; y: number } } = {};
    
    nodes.forEach((node, index) => {
        layout[node.id] = {
            x: (index % 3) * spacing,
            y: Math.floor(index / 3) * spacing,
        };
    });

    return layout;
};

export const adjustNodePosition = (node: any, deltaX: number, deltaY: number) => {
    return {
        ...node,
        position: {
            x: node.position.x + deltaX,
            y: node.position.y + deltaY,
        },
    };
};