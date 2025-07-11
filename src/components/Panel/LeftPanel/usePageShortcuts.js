import { useEffect } from 'react';

const usePageShortcuts = ({
  activePageId,
  pages,
  startRenamePage,
  renamingId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
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