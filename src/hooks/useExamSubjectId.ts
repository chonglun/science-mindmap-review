import { useMatch } from 'react-router-dom';
import { examSubjectRegistry } from './useSubjectData';

/**
 * Extract examSubjectId and activeSubjectId from current route.
 * Works in components outside <Route> (e.g., Header, Sidebar).
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
