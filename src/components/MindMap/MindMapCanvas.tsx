import React, { useMemo, useState, useCallback } from 'react';
import { ReactFlow, MiniMap, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import TopicNode from './TopicNode';
import SubtopicNode from './SubtopicNode';
import UnitNode from './UnitNode';

const nodeTypes = {
  topic: TopicNode,
  unit: UnitNode,
  subtopic: SubtopicNode,
};

interface MindMapCanvasProps {
  clickedTopics: string[];
  onNodeClick: (topicId: string) => void;
  subjects: any[];
  center: { id: string; label: string };
}

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ clickedTopics, onNodeClick, subjects, center }) => {
  // Track which nodes are collapsed (subject ids and unit ids)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const toggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];

    if (subjects.length === 0) return { nodes: ns, edges: es };

    // Layout constants (left-to-right, 4 levels)
    const NODE_H = 44;
    const UNIT_NODE_H = 68; // multi-line unit nodes (badges + label + stage)
    const TOPIC_GAP = 10;
    const UNIT_GAP = 30;
    const SUBJECT_GAP = 50;
    const CENTER_X = 0;
    const SUBJECT_X = 240;
    const UNIT_X = 480;
    const TOPIC_X = 740;

    // --- Build layout right-to-left (topics → units → subjects → center) ---
    let globalCursorY = 0;

    interface UnitLayout { unitId: string; unitY: number; topicYs: number[] }
    interface SubjectLayout { subjectId: string; subjectY: number; units: UnitLayout[] }
    const subjectLayouts: SubjectLayout[] = [];

    subjects.forEach((subject, si) => {
      const unitLayouts: UnitLayout[] = [];
      const hasUnits = 'units' in subject && Array.isArray((subject as any).units);
      const units = hasUnits ? (subject as any).units : null;
      const flatTopics = !hasUnits ? (subject as any).topics as any[] : null;
      const subjectCollapsed = collapsedNodes.has(subject.id);

      if (units) {
        if (!subjectCollapsed) {
          units.forEach((unit: any, ui: number) => {
            const unitCollapsed = collapsedNodes.has(unit.id);
            const topicYs: number[] = [];

            if (!unitCollapsed) {
              unit.topics.forEach((topic: any, ti: number) => {
                const ty = globalCursorY;
                topicYs.push(ty);
                ns.push({
                  id: topic.id,
                  type: 'subtopic',
                  position: { x: TOPIC_X, y: ty },
                  data: { label: topic.name, color: subject.color, isClicked: clickedTopics.includes(topic.id) },
                });
                globalCursorY += NODE_H + TOPIC_GAP;
              });
              globalCursorY += UNIT_GAP - TOPIC_GAP;
            } else {
              // Unit collapsed — just reserve space for the unit node itself
              topicYs.push(globalCursorY);
              globalCursorY += UNIT_NODE_H + UNIT_GAP;
            }

            const unitY = topicYs.length > 1
              ? (topicYs[0] + topicYs[topicYs.length - 1]) / 2
              : topicYs[0];
            const childCount = unit.topics.length;
            ns.push({
              id: unit.id,
              type: 'unit',
              position: { x: UNIT_X, y: unitY },
              data: { label: unit.name, color: subject.color, stage: unit.stage, isCollapsed: unitCollapsed, childCount, importance: unit.importance },
            });

            // Edges: unit → topics (only if not collapsed)
            if (!unitCollapsed) {
              unit.topics.forEach((topic: any) => {
                es.push({
                  id: `e-${unit.id}-${topic.id}`,
                  source: unit.id,
                  target: topic.id,
                  style: { stroke: subject.color, strokeWidth: 1 },
                  type: 'default',
                });
              });
            }

            unitLayouts.push({ unitId: unit.id, unitY, topicYs });
          });
        } else {
          // Subject collapsed — reserve space for subject node only
          unitLayouts.push({ unitId: subject.id + '-placeholder', unitY: globalCursorY, topicYs: [globalCursorY] });
          globalCursorY += NODE_H + SUBJECT_GAP;
        }
      } else if (flatTopics) {
        if (!subjectCollapsed) {
          flatTopics.forEach((topic: any, ti: number) => {
            const ty = globalCursorY;
            ns.push({
              id: topic.id,
              type: 'subtopic',
              position: { x: UNIT_X, y: ty },
              data: { label: topic.name, color: subject.color, isClicked: clickedTopics.includes(topic.id) },
            });
            unitLayouts.push({ unitId: topic.id, unitY: ty, topicYs: [ty] });
            globalCursorY += NODE_H + TOPIC_GAP;
          });
          globalCursorY += UNIT_GAP - TOPIC_GAP;
        } else {
          unitLayouts.push({ unitId: subject.id + '-placeholder', unitY: globalCursorY, topicYs: [globalCursorY] });
          globalCursorY += NODE_H + SUBJECT_GAP;
        }
      }

      // Subject node at vertical center of its units
      const allUnitYs = unitLayouts.map((u) => u.unitY);
      const subjectY = (Math.min(...allUnitYs) + Math.max(...allUnitYs)) / 2;
      const subjectChildCount = hasUnits
        ? units.length
        : (flatTopics?.length ?? 0);
      ns.push({
        id: subject.id,
        type: 'topic',
        position: { x: SUBJECT_X, y: subjectY },
        data: { label: subject.label, color: subject.color, isClicked: false, isCenter: false, isCollapsed: subjectCollapsed, childCount: subjectChildCount },
      });

      // Edges: subject → units (or direct topics), only if not collapsed
      if (!subjectCollapsed) {
        unitLayouts.forEach((u) => {
          es.push({
            id: `e-${subject.id}-${u.unitId}`,
            source: subject.id,
            target: u.unitId,
            style: { stroke: subject.color, strokeWidth: 1.5 },
            type: 'default',
          });
        });
      }

      subjectLayouts.push({ subjectId: subject.id, subjectY, units: unitLayouts });
      globalCursorY += SUBJECT_GAP;
    });

    // Center node
    const allSubjectYs = subjectLayouts.map((s) => s.subjectY);
    const centerY = (Math.min(...allSubjectYs) + Math.max(...allSubjectYs)) / 2;
    ns.unshift({
      id: center.id,
      type: 'topic',
      position: { x: CENTER_X, y: centerY },
      data: { label: center.label, color: '#6366f1', isClicked: false, isCenter: true },
    });

    subjects.forEach((subject) => {
      es.push({
        id: `e-center-${subject.id}`,
        source: center.id,
        target: subject.id,
        style: { stroke: subject.color, strokeWidth: 2 },
        type: 'default',
      });
    });

    return { nodes: ns, edges: es };
  }, [clickedTopics, subjects, center, collapsedNodes]);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    // If node has children (subject or unit with childCount), toggle collapse
    if (node.data.childCount != null) {
      toggleCollapse(node.id);
    } else {
      onNodeClick(node.id);
    }
  }, [onNodeClick, toggleCollapse]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <div className="hidden md:block">
          <MiniMap />
        </div>
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MindMapCanvas;