import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  clickedTopics: 'science-mindmap-clicked-topics',
  bookmarkedTopics: 'science-mindmap-bookmarked-topics',
  readTopics: 'science-mindmap-read-topics',
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

/**
 * Manage user progress state stored in localStorage.
 *
 * Tracks three independent lists:
 * - **clickedTopics** — topic IDs the user has viewed (auto-added on detail panel open)
 * - **bookmarkedTopics** — topic IDs the user has bookmarked (toggle)
 * - **readTopics** — topic IDs the user has marked as read (toggle)
 *
 * All lists persist across sessions via localStorage with safe JSON parsing.
 */
export function useUserData() {
  const [clickedTopics, setClickedTopics] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.clickedTopics)
  );
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.bookmarkedTopics)
  );
  const [readTopics, setReadTopics] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.readTopics)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.clickedTopics, clickedTopics);
  }, [clickedTopics]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.bookmarkedTopics, bookmarkedTopics);
  }, [bookmarkedTopics]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.readTopics, readTopics);
  }, [readTopics]);

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

  const toggleReadTopic = useCallback((topicId: string) => {
    setReadTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  }, []);

  const isRead = useCallback(
    (topicId: string) => readTopics.includes(topicId),
    [readTopics]
  );

  return {
    clickedTopics,
    bookmarkedTopics,
    readTopics,
    addClickedTopic,
    toggleBookmark,
    toggleReadTopic,
    isClicked,
    isBookmarked,
    isRead,
  };
}
