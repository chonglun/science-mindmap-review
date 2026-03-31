import { useState, useCallback, useRef } from 'react';
import { examSubjectRegistry, loadSubject } from './useSubjectData';
import type { SubjectData } from '../types';

export interface SearchResult {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectLabel: string;
  unitName: string;
  examSubjectId: string;
  examSubjectLabel: string;
}

// Module-level cache — built once, reused across all hook instances
let searchIndex: SearchResult[] | null = null;
let indexPromise: Promise<SearchResult[]> | null = null;

function buildIndex(allSubjects: { examSubjectId: string; examSubjectLabel: string; data: SubjectData }[]): SearchResult[] {
  const index: SearchResult[] = [];
  for (const { examSubjectId, examSubjectLabel, data } of allSubjects) {
    if (data.units) {
      for (const unit of data.units) {
        for (const topic of unit.topics) {
          index.push({
            topicId: topic.id,
            topicName: topic.name,
            subjectId: data.id,
            subjectLabel: data.label,
            unitName: unit.name,
            examSubjectId,
            examSubjectLabel,
          });
        }
      }
    }
    if (data.topics) {
      for (const topic of data.topics) {
        index.push({
          topicId: topic.id,
          topicName: topic.name,
          subjectId: data.id,
          subjectLabel: data.label,
          unitName: '',
          examSubjectId,
          examSubjectLabel,
        });
      }
    }
  }
  return index;
}

async function ensureIndex(): Promise<SearchResult[]> {
  if (searchIndex) return searchIndex;
  if (indexPromise) return indexPromise;

  indexPromise = (async () => {
    try {
      const loadTasks: Promise<{ examSubjectId: string; examSubjectLabel: string; data: SubjectData }>[] = [];
      for (const [examSubjectId, entry] of Object.entries(examSubjectRegistry)) {
        const examSubjectLabel = entry.center.label;
        for (const subjectMeta of entry.subjects) {
          loadTasks.push(
            loadSubject(subjectMeta.id).then((data) => ({ examSubjectId, examSubjectLabel, data }))
          );
        }
      }
      const allSubjects = await Promise.all(loadTasks);
      searchIndex = buildIndex(allSubjects);
      return searchIndex;
    } catch (e) {
      indexPromise = null; // allow retry on next search
      throw e;
    }
  })();

  return indexPromise;
}

const MAX_RESULTS = 15;

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const seqRef = useRef(0);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const seq = ++seqRef.current;
    setLoading(true);

    try {
      const index = await ensureIndex();
      if (seqRef.current !== seq) return; // stale

      const q = trimmed.toLowerCase();
      const matched = index
        .filter((item) => item.topicName.toLowerCase().includes(q))
        .slice(0, MAX_RESULTS);

      setResults(matched);
    } catch {
      if (seqRef.current !== seq) return;
      setResults([]);
    } finally {
      if (seqRef.current === seq) setLoading(false);
    }

  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return { search, results, loading, clear };
}
