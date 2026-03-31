import { useState, useEffect, useRef } from 'react';
import type { SubjectData, Topic } from '../types';

/** Metadata for a single subject (id, label, color). Loaded from exam-subjects.json. */
export interface SubjectMeta {
  id: string;
  label: string;
  color: string;
}

/** Top-level index for an exam subject category (e.g. "自然科" contains biology, physics-chemistry, earth-science). */
export interface SubjectIndex {
  center: { id: string; label: string };
  subjects: SubjectMeta[];
}

// Static import — lightweight exam-subject registry (no topic content)
import examSubjectsData from '../data/exam-subjects.json';

export const examSubjectRegistry = examSubjectsData as Record<string, SubjectIndex>;

// Cache loaded subject data in memory to avoid re-importing
const subjectCache: Record<string, SubjectData> = {};

export async function loadSubject(id: string): Promise<SubjectData> {
  if (subjectCache[id]) return subjectCache[id];
  // Dynamic import — Vite will code-split each JSON into its own chunk
  const mod = await import(`../data/subjects/${id}.json`);
  const data = mod.default;
  subjectCache[id] = data;
  return data;
}

/**
 * Lazy-load all subject data for a given exam subject.
 * Returns subjects array (full data) once all are loaded.
 */
export function useAllSubjects(examSubjectId?: string) {
  const key = examSubjectId ?? 'science';
  const index = examSubjectRegistry[key];

  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const loadedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!index) { setLoading(false); return; }
    if (loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;
    setLoading(true);
    const currentKey = key;
    Promise.all(index.subjects.map((s) => loadSubject(s.id))).then((all) => {
      if (loadedKeyRef.current !== currentKey) return; // stale response
      setSubjects(all);
      setLoading(false);
    });
  }, [key, index]);

  const center = index?.center ?? { id: 'center', label: '' };

  return { subjects, loading, center };
}

export interface TopicWithPath {
  topic: Topic;
  /** e.g. "生物 > 生命的特性與細胞" */
  path: string;
  /** Unit-level strategy (if the topic belongs to a unit with strategy data). */
  unitStrategy?: import('../types').UnitStrategy;
}

export function findTopicWithPath(subjects: SubjectData[], topicId: string): TopicWithPath | null {
  for (const subject of subjects) {
    if (subject.units) {
      for (const unit of subject.units) {
        const found = unit.topics.find((t) => t.id === topicId);
        if (found) return { topic: found, path: `${subject.label} > ${unit.name}`, unitStrategy: unit.unitStrategy };
      }
    }
    if (subject.topics) {
      const found = subject.topics.find((t) => t.id === topicId);
      if (found) return { topic: found, path: subject.label };
    }
  }
  return null;
}
