import React, { useState, useRef, useEffect } from 'react';

const PageList = ({
  pages,
  activePageId,
  setPages,
  setActivePageId,
}) => {
  const [renamingPageId, setRenamingPageId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renamingPageId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingPageId]);

  // Keyboard shortcuts: Delete to delete, Shift+R to rename
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeIndex = pages.findIndex(p => p.id === activePageId);
      if (activeIndex === -1) return;
      // Delete key: delete active page if not renaming and more than one page
      if (e.key === 'Delete' && !renamingPageId && pages.length > 1) {
        e.preventDefault();
        const id = activePageId;
        const newPages = pages.filter(p => p.id !== id);
        setPages(newPages);
        // Select next page or previous if last was deleted
        if (newPages.length > 0) {
          const nextIndex = Math.min(activeIndex, newPages.length - 1);
          setActivePageId(newPages[nextIndex].id);
        }
      }
      // Shift+R: rename active page if not already renaming
      if (e.shiftKey && (e.key === 'R' || e.key === 'r') && !renamingPageId) {
        e.preventDefault();
        const page = pages.find(p => p.id === activePageId);
        if (page) {
          setRenamingPageId(page.id);
          setRenameValue(page.name);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages, activePageId, renamingPageId, setPages, setActivePageId]);

  const handleAddPage = () => {
    const newId = `page-${Date.now()}`;
    const newName = `Page ${pages.length + 1}`;
    setPages([
      ...pages,
      {
        id: newId,
        name: newName,
        drawnRectangles: [],
        selectedShapes: [],
      },
    ]);
    setActivePageId(newId);
  };

  const handleSelectPage = (id) => setActivePageId(id);

  const startRenamePage = (id, name) => {
    setRenamingPageId(id);
    setRenameValue(name);
  };

  const handleRenameInputChange = (e) => setRenameValue(e.target.value);

  const handleRenameInputBlur = () => {
    if (renamingPageId && renameValue.trim()) {
      setPages(pages => pages.map(p => p.id === renamingPageId ? { ...p, name: renameValue.trim() } : p));
    }
    setRenamingPageId(null);
    setRenameValue("");
  };

  const handleRenameInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameInputBlur();
    } else if (e.key === 'Escape') {
      setRenamingPageId(null);
      setRenameValue("");
    }
  };

  return (
    <div className="pages-section">
      <div className="pages-header">
        <span className="pages-title">Pages</span>
        <button className="pages-add-btn" title="Add Page" onClick={handleAddPage}>+</button>
      </div>
      <ul className="pages-list">
        {pages.map((page) => (
          <li
            key={page.id}
            className={page.id === activePageId ? 'active' : ''}
            onClick={() => handleSelectPage(page.id)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {renamingPageId === page.id ? (
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={handleRenameInputChange}
                onBlur={handleRenameInputBlur}
                onKeyDown={handleRenameInputKeyDown}
                style={{ width: '90%', fontSize: 'inherit' }}
                maxLength={32}
              />
            ) : (
              <span style={{ flex: 1 }} onDoubleClick={() => startRenamePage(page.id, page.name)}>{page.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList; 