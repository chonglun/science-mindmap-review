export interface MindMapNode {
  id: string;
  label: string;
  type: 'topic' | 'subtopic' | 'concept';
  position: { x: number; y: number };
  connections: string[];
}

export interface MindMap {
  title: string;
  nodes: MindMapNode[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  mindMaps: MindMap[];
}

export interface Progress {
  topicId: string;
  completed: boolean;
  lastAccessed: Date;
}