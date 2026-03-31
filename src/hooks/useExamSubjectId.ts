import { useMatch } from 'react-router-dom';
import { examSubjectRegistry } from './useSubjectData';

/**
 * Extract examSubjectId, activeSubjectId, and label from the current route.
 * Works in components rendered outside `<Route>` (e.g., Header, Sidebar).
 *
 * @returns examSubjectId — e.g. "science", "social", "math"
 * @returns activeSubjectId — specific subject within an exam category (e.g. "biology")
 * @returns examSubjectLabel — display label from registry (e.g. "國中自然")
 * @returns isAvailable — whether examSubjectId exists in the registry
 */
export function useExamSubjectId() {
  const subjectMatch = useMatch('/subject/:examSubjectId');
  const mindmapMatch = useMatch('/mindmap/:examSubjectId/:subjectId');
  const mindmapAllMatch = useMatch('/mindmap/:examSubjectId');
  const topicsMatch = useMatch('/topics/:examSubjectId');

  const examSubjectId = subjectMatch?.params.examSubjectId
    || mindmapMatch?.params.examSubjectId
    || mindmapAllMatch?.params.examSubjectId
    || topicsMatch?.params.examSubjectId
    || null;

  const activeSubjectId = mindmapMatch?.params.subjectId || null;

  const examSubjectLabel = examSubjectId
    ? (examSubjectRegistry[examSubjectId]?.center.label ?? examSubjectId)
    : null;

  const isAvailable = examSubjectId ? examSubjectId in examSubjectRegistry : false;

  return { examSubjectId, activeSubjectId, examSubjectLabel, isAvailable };
}
