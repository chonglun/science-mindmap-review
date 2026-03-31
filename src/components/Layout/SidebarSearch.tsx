import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useExamSubjectId } from '../../hooks/useExamSubjectId';
import { useAllSubjects } from '../../hooks/useSubjectData';
import type { SubjectData, Topic } from '../../types';

interface SidebarSearchResult {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectLabel: string;
  unitName: string;
  matchContext: string; // what matched (empty if topic name matched)
}

const MAX_RESULTS = 20;

const MAX_UNIT_NAME_MATCHES = 3;

function matchTopic(topic: Topic, q: string): { type: 'name' | 'concept'; context: string } | null {
  if (topic.name.toLowerCase().includes(q)) return { type: 'name', context: '' };
  const concept = topic.coreConcepts?.find((c) => c.toLowerCase().includes(q));
  if (concept) return { type: 'concept', context: `概念：${concept}` };
  return null;
}

function buildResults(subjects: SubjectData[], query: string): SidebarSearchResult[] {
  if (!query) return [];
  const q = query.toLowerCase();
  // Two-pass: direct matches first (name/concept), then unit-name matches
  const direct: SidebarSearchResult[] = [];
  const unitOnly: SidebarSearchResult[] = [];

  for (const subject of subjects) {
    if (subject.units) {
      for (const unit of subject.units) {
        const unitNameMatch = unit.name.toLowerCase().includes(q);
        let unitOnlyCount = 0;
        for (const topic of unit.topics) {
          const m = matchTopic(topic, q);
          if (m) {
            direct.push({
              topicId: topic.id, topicName: topic.name,
              subjectId: subject.id, subjectLabel: subject.label,
              unitName: unit.name, matchContext: m.context,
            });
          } else if (unitNameMatch && unitOnlyCount < MAX_UNIT_NAME_MATCHES) {
            unitOnlyCount++;
            unitOnly.push({
              topicId: topic.id, topicName: topic.name,
              subjectId: subject.id, subjectLabel: subject.label,
              unitName: unit.name, matchContext: `單元：${unit.name}`,
            });
          }
        }
      }
    }
    if (subject.topics) {
      for (const topic of subject.topics) {
        const m = matchTopic(topic, q);
        if (m) {
          direct.push({
            topicId: topic.id, topicName: topic.name,
            subjectId: subject.id, subjectLabel: subject.label,
            unitName: '', matchContext: m.context,
          });
        }
      }
    }
  }
  // Merge: direct matches take priority, fill remaining with unit-name matches
  const merged = direct.slice(0, MAX_RESULTS);
  const remaining = MAX_RESULTS - merged.length;
  if (remaining > 0) merged.push(...unitOnly.slice(0, remaining));
  return merged;
}

interface SidebarSearchProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  onAutoFocused?: () => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ inputRef: externalInputRef, autoFocus, onAutoFocused }) => {
  const navigate = useNavigate();
  const { examSubjectId } = useExamSubjectId();
  const { subjects } = useAllSubjects(examSubjectId ?? undefined);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRefToUse = externalInputRef ?? internalInputRef;
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus when requested (e.g. after sidebar expands)
  useEffect(() => {
    if (autoFocus) {
      (inputRefToUse as React.RefObject<HTMLInputElement>).current?.focus();
      onAutoFocused?.();
    }
  }, [autoFocus, inputRefToUse, onAutoFocused]);

  // Debounce query
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('');
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(
    () => buildResults(subjects, debouncedQuery),
    [subjects, debouncedQuery]
  );

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const selectResult = useCallback(
    (result: SidebarSearchResult) => {
      setQuery('');
      setDebouncedQuery('');
      navigate(`/mindmap/${examSubjectId}/${result.subjectId}?topic=${encodeURIComponent(result.topicId)}`);
    },
    [navigate, examSubjectId]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) {
        if (e.key === 'Escape') {
          setQuery('');
          setDebouncedQuery('');
          (inputRefToUse as React.RefObject<HTMLInputElement>).current?.blur();
        }
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            selectResult(results[activeIndex]);
          }
          break;
        case 'Escape':
          setQuery('');
          setDebouncedQuery('');
          (inputRefToUse as React.RefObject<HTMLInputElement>).current?.blur();
          break;
      }
    },
    [results, activeIndex, selectResult, inputRefToUse]
  );

  if (!examSubjectId) return null;

  const showResults = debouncedQuery.length > 0;

  return (
    <div className="mb-3">
      {/* Search input */}
      <div className="relative">
        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRefToUse as React.RefObject<HTMLInputElement>}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜尋本科主題..."
          className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 text-sm rounded-md pl-7 pr-7 py-1.5 outline-none focus:bg-gray-600 focus:ring-1 focus:ring-indigo-400 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setDebouncedQuery(''); }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-0.5"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Results list */}
      {showResults && (
        <div
          ref={listRef}
          className="mt-1.5 max-h-60 overflow-y-auto rounded-md bg-gray-700/80 border border-gray-600"
        >
          {results.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500">找不到相關主題</div>
          ) : (
            results.map((result, i) => (
              <button
                key={result.topicId}
                onClick={() => selectResult(result)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-3 py-2 border-b border-gray-600/50 last:border-0 transition-colors ${
                  i === activeIndex ? 'bg-indigo-600/40' : 'hover:bg-gray-600/50'
                }`}
              >
                <div className="text-sm text-gray-200 leading-tight">{result.topicName}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  {result.subjectLabel}
                  {result.unitName && ` › ${result.unitName}`}
                </div>
                {result.matchContext && (
                  <div className="text-[11px] text-indigo-300 mt-0.5 leading-tight truncate">
                    {result.matchContext}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarSearch;
