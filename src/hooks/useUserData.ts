import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  clickedTopics: 'science-mindmap-clicked-topics',
  bookmarkedTopics: 'science-mindmap-bookmarked-topics',
} as const;

function loadFromStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useUserData() {
  const [clickedTopics, setClickedTopics] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.clickedTopics)
  );
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.bookmarkedTopics)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.clickedTopics, clickedTopics);
  }, [clickedTopics]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.bookmarkedTopics, bookmarkedTopics);
  }, [bookmarkedTopics]);

  const addClickedTopic = useCallback((topicId: string) => {
    setClickedTopics((prev) =>
      prev.includes(topicId) ? prev : [...prev, topicId]
    );
  }, []);

  const toggleBookmark = useCallback((topicId: string) => {
    setBookmarkedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  }, []);

  const isClicked = useCallback(
    (topicId: string) => clickedTopics.includes(topicId),
    [clickedTopics]
  );

  const isBookmarked = useCallback(
    (topicId: string) => bookmarkedTopics.includes(topicId),
    [bookmarkedTopics]
  );

  return {
    clickedTopics,
    bookmarkedTopics,
    addClickedTopic,
    toggleBookmark,
    isClicked,
    isBookmarked,
  };
}
