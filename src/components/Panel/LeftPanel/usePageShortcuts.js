import { useEffect } from 'react';

const isEditing = (event) => {
  const el = document.activeElement;
  const target = event && event.target;
  const check = (elem) =>
    elem && (
      elem.tagName === 'INPUT' ||
      elem.tagName === 'TEXTAREA' ||
      elem.isContentEditable
    );
  return check(el) || check(target);
};

const usePageShortcuts = ({
  activePageId,
  pages,
  startRenamePage,
  renamingId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when editing/renaming
      if (isEditing(e)) {
        return;
      }
      if (e.shiftKey && (e.key === 'R' || e.key === 'r') && !renamingId) {
        const activePage = pages.find(p => p.id === activePageId);
        if (activePage) {
          startRenamePage(activePage.id, activePage.name);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageId, pages, startRenamePage, renamingId]);
};

export default usePageShortcuts; 