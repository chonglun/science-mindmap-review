import { useState, useEffect, useCallback, useRef } from 'react';

export interface SubjectMeta {
  id: string;
  label: string;
  color: string;
}

export interface SubjectIndex {
  center: { id: string; label: string };
  subjects: SubjectMeta[];
}

// Static import for lightweight index (no topic content)
import indexData from '../data/subjects/index.json';

// Cache loaded subject data in memory to avoid re-importing
const subjectCache: Record<string, any> = {};

async function loadSubject(id: string): Promise<any> {
  if (subjectCache[id]) return subjectCache[id];
  // Dynamic import — Vite will code-split each JSON into its own chunk
  const mod = await import(`../data/subjects/${id}.json`);
  const data = mod.default;
  subjectCache[id] = data;
  return data;
}

export function useSubjectIndex(): SubjectIndex {
  return indexData;
}

/**
 * Lazy-load all subject data. Returns subjects array (full data)
 * once all are loaded, or partial results as they stream in.
 */
export function useAllSubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    Promise.all(indexData.subjects.map((s) => loadSubject(s.id))).then((all) => {
      setSubjects(all);
      setLoading(false);
    });
  }, []);

  return { subjects, loading, center: indexData.center };
}

/**
 * Load a single subject's full data on demand.
 */
export function useSubjectDetail(subjectId: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!subjectId) { setData(null); return; }
    setLoading(true);
    loadSubject(subjectId).then((d) => { setData(d); setLoading(false); });
  }, [subjectId]);

  return { data, loading };
}

/**
 * Find a topic by id across all loaded subjects.
 */
export function findTopicInSubjects(subjects: any[], topicId: string): any | null {
  for (const subject of subjects) {
    if (subject.units) {
      for (const unit of subject.units) {
        const found = unit.topics.find((t: any) => t.id === topicId);
        if (found) return found;
      }
    }
    if (subject.topics) {
      const found = subject.topics.find((t: any) => t.id === topicId);
      if (found) return found;
    }
  }
  return null;
}
