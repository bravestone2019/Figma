// Utility functions for persisting app state to localStorage

const STORAGE_KEY = 'figma-app-state';

export function saveAppState(pages, activePageId, collection, collections, position, scale) {
  try {
    const data = JSON.stringify({ pages, activePageId, collection, collections, position, scale });
    localStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    // Handle quota exceeded or serialization errors
    console.error('Failed to save app state:', e);
  }
}

export function loadAppState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load app state:', e);
    return null;
  }
} 