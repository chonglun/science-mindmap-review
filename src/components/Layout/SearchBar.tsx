import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import type { SearchResult } from '../../hooks/useSearch';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { search, results, loading, clear } = useSearch();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      clear();
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(query);
      setOpen(true);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, search, clear]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectResult = useCallback((result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setMobileExpanded(false);
    clear();
    navigate(`/mindmap/${result.examSubjectId}/${result.subjectId}?topic=${encodeURIComponent(result.topicId)}`);
  }, [navigate, clear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === 'Escape') {
        setOpen(false);
        setMobileExpanded(false);
        inputRef.current?.blur();
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
        setOpen(false);
        setMobileExpanded(false);
        inputRef.current?.blur();
        break;
    }
  }, [open, results, activeIndex, selectResult]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const showDropdown = open && (results.length > 0 || loading || query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: inline search input */}
      <div className="hidden md:flex items-center">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-200 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim() && results.length > 0) setOpen(true); }}
            onKeyDown={handleKeyDown}
            placeholder="搜尋主題..."
            className="w-48 focus:w-64 transition-all duration-200 bg-indigo-500/50 text-white placeholder-indigo-200 text-sm rounded-lg pl-8 pr-8 py-1.5 outline-none focus:bg-indigo-500/70 focus:ring-1 focus:ring-indigo-300"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); clear(); setOpen(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile: icon toggle → expanded input */}
      <div className="md:hidden flex items-center">
        {mobileExpanded ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-200 pointer-events-none" />
              <input
                autoFocus
                type="text"
                role="combobox"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜尋主題..."
                className="w-40 bg-indigo-500/50 text-white placeholder-indigo-200 text-sm rounded-lg pl-8 pr-8 py-1.5 outline-none focus:ring-1 focus:ring-indigo-300"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); clear(); setOpen(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => { setMobileExpanded(false); setOpen(false); setQuery(''); clear(); }}
              className="text-indigo-200 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => setMobileExpanded(true)} className="text-indigo-200 hover:text-white p-1">
            <Search size={20} />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div id="search-results" role="listbox" className="absolute top-full mt-1 left-0 md:left-auto md:right-0 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
          {loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">載入搜尋資料中...</div>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-gray-500">找不到相關主題</div>
          )}
          {results.map((result, i) => (
            <button
              key={result.topicId}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => selectResult(result)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-2.5 border-b border-gray-50 last:border-0 transition-colors ${
                i === activeIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">{result.topicName}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {result.examSubjectLabel} › {result.subjectLabel}
                {result.unitName && ` › ${result.unitName}`}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
