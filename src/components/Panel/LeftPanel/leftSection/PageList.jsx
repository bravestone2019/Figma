import { useState, useRef, useEffect } from "react";
import "../LeftPanel.css";
import "./PageList.css";
import Back from "../../../../assets/back.png";
import Down from "../../../../assets/down.png";

const PageList = ({
  pages,
  activePageId,
  setPages,
  setActivePageId,
  pagesHeight,
  handleMouseDown,
}) => {
  const [renamingPageId, setRenamingPageId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [pagesCollapsed, setPagesCollapsed] = useState(false);
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
      // Prevent shortcuts when editing/renaming
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          document.activeElement.isContentEditable)
      ) {
        return;
      }
      const activeIndex = pages.findIndex((p) => p.id === activePageId);
      if (activeIndex === -1) return;
      // Delete key: delete active page if not renaming and more than one page
      if (e.key === "Delete" && !renamingPageId && pages.length > 1) {
        e.preventDefault();
        const id = activePageId;
        const newPages = pages.filter((p) => p.id !== id);
        setPages(newPages);
        // Select next page or previous if last was deleted
        if (newPages.length > 0) {
          const nextIndex = Math.min(activeIndex, newPages.length - 1);
          setActivePageId(newPages[nextIndex].id);
        }
      }
      // Shift+R: rename active page if not already renaming
      if (e.shiftKey && (e.key === "R" || e.key === "r") && !renamingPageId) {
        e.preventDefault();
        const page = pages.find((p) => p.id === activePageId);
        if (page) {
          setRenamingPageId(page.id);
          setRenameValue(page.name);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pages, activePageId, renamingPageId, setPages, setActivePageId]);

  const handleAddPage = (e) => {
    e.stopPropagation();
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
      setPages((pages) =>
        pages.map((p) =>
          p.id === renamingPageId ? { ...p, name: renameValue.trim() } : p
        )
      );
    }
    setRenamingPageId(null);
    setRenameValue("");
  };

  const handleRenameInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRenameInputBlur();
    } else if (e.key === "Escape") {
      setRenamingPageId(null);
      setRenameValue("");
    }
  };

  return (
    <div className={`pages-section ${pagesCollapsed ? "collapsed" : ""}`}>
      <div className="pages-header">
        <img
          className="arrow-icon"
          src={pagesCollapsed ? Back : Down}
          alt={pagesCollapsed ? "Expand" : "Collapse"}
          style={{
            width: "10px",
            height: "10px",
            marginLeft: "-16px",
            marginRight: "5px",
            marginTop: "-2px",
            transition: "transform 0.2s ease",
          }}
        />
        <span
          className="pages-title"
          onClick={() => setPagesCollapsed(!pagesCollapsed)}
        >
          Pages
        </span>
        <button
          className="pages-add-btn"
          onClick={(e) => {
            if (pagesCollapsed) setPagesCollapsed(!pagesCollapsed);
            handleAddPage(e);
            }}
          >
            +<span className="addtip">Add a new Page</span>
          </button>
          </div>

          {!pagesCollapsed && (
          <div className="pages-resize-container">
            <div className="pages-scroll-wrapper" style={{ height: pagesHeight }}>
            <ul className="pages-list" >
              {pages.map((page) => {
              const isActive = page.id === activePageId;
              const isRenaming = renamingPageId === page.id;
              let backgroundColor = "";
              if (isRenaming) {
                backgroundColor = "#fff";
              } else if (isActive) {
                backgroundColor = "#f0f0f0";
              }
              return (
                <li
                key={page.id}
                className={isActive ? "active" : ""}
                onClick={() => handleSelectPage(page.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "4px 0",
                  border:
                  isRenaming
                    ? "1px solid #1976d2"
                    : "1px solid transparent",
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease",
                  background: backgroundColor,
                }}
                >
                {isRenaming ? (
                  <input
                  className="rename-input"
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={handleRenameInputChange}
                  onBlur={handleRenameInputBlur}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    handleRenameInputKeyDown(e);
                  }}
                  maxLength={32}
                  />
                ) : (
                  <span
                  style={{ flex: 1 }}
                  onDoubleClick={() => startRenamePage(page.id, page.name)}
                  >
                  {page.name}
                  </span>
                )}
                </li>
              );
              })}
            </ul>
            </div>
          </div>
          )}

          {/* End Pages Section */}
      <div className="leftpanel-divider" onMouseDown={handleMouseDown} />
    </div>
  );
};

export default PageList;
