import "./LeftPanel.css";
import { useState, useRef, useEffect } from "react";
import Back from "../../../assets/back.png";
import Down from "../../../assets/down.png";
import Minimize from "../../../assets/LeftPanel/Toggle.png";

const LeftPanel = ({
  collapsed,
  toggleCollapsed,
  drawnRectangles,
  selectedShapes,
  setSelectedShapes,
  setDrawnRectangles,
  setActiveTool,
}) => {
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  // Consolidated effect for scroll handling and state (isScrolled)
  useEffect(() => {
    const node = scrollRef.current;

    // Logic for restoring scroll position after expansion
    if (node && !assetsCollapsed) {
      // When assets section is *not* collapsed (i.e., expanding or already open)
      const handleTransitionEnd = () => {
        const computedMaxHeight = window.getComputedStyle(node).maxHeight;

        // Check if the transition ended with a non-zero max-height (i.e., it's now open)
        // and if a previous scroll position exists.
        if (computedMaxHeight !== "0px" && scrollPosition.current > 0) {
          node.scrollTo({
            top: scrollPosition.current,
            behavior: "instant", // Use "instant" for immediate jump after expand animation
          });
        }
        node.removeEventListener("transitionend", handleTransitionEnd);
      };

      // If the assets section is *just* becoming uncollapsed (from being collapsed)
      // or if it's already open and we need to ensure the scroll position on first render
      const currentMaxHeight = window.getComputedStyle(node).maxHeight;
      if (currentMaxHeight === "0px") {
        // If it was collapsed and is now opening
        node.addEventListener("transitionend", handleTransitionEnd);
      } else if (scrollPosition.current > 0) {
        // If it's already open and we have a scroll to restore
        node.scrollTo({
          top: scrollPosition.current,
          behavior: "instant",
        });
      }

      // Logic for `isScrolled` (header shadow)
      const handleScroll = () => {
        setIsScrolled(node.scrollTop > 0);
      };
      node.addEventListener("scroll", handleScroll);
      // Initial check on mount/update
      handleScroll();

      return () => {
        node.removeEventListener("scroll", handleScroll);
        // Ensure transitionend listener is removed if the component unmounts
        node.removeEventListener("transitionend", handleTransitionEnd);
      };
    } else if (node && assetsCollapsed) {
      // When assets section is collapsed, remove scroll listener to avoid unnecessary checks
      // (the isScrolled state becomes irrelevant for a collapsed section)
      const handleScroll = () => {
        setIsScrolled(node.scrollTop > 0);
      };
      node.removeEventListener("scroll", handleScroll); // Ensure removal if it was added
    }
  }, [assetsCollapsed]); // Dependency: run when assetsCollapsed changes

  // Save scroll position before collapsing
  const handleAssetsCollapse = () => {
    if (scrollRef.current && !assetsCollapsed) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
    setAssetsCollapsed(!assetsCollapsed);
  };

  // Focus input when entering rename mode
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Keyboard shortcut: Shift+R to rename selected shape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === "R" || e.key === "r")) {
        if (selectedShapes && selectedShapes.length === 1) {
          const shapeId = selectedShapes[0];
          const shape = drawnRectangles.find((s) => s.id === shapeId);
          if (shape) {
            setRenamingId(shapeId);
            setRenameValue(shape.name || "");
            e.preventDefault();
          }
        }
      }
      // Escape to cancel rename
      if (renamingId && e.key === "Escape") {
        setRenamingId(null);
        if (setActiveTool) setActiveTool("Move");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapes, drawnRectangles, renamingId, setActiveTool]);

  // Handle rename submit
  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (renameValue.trim() && renamingId) {
      setDrawnRectangles((prev) =>
        prev.map((shape) =>
          shape.id === renamingId
            ? { ...shape, name: renameValue.trim() }
            : shape
        )
      );
    }
    setRenamingId(null);
    if (setActiveTool) setActiveTool("Move");
  };

  return (
    <div className={`left-panel ${collapsed ? "collapsed" : ""}`}>
      {!collapsed && (
        <>
          <div className="toggle-wrapper" onClick={toggleCollapsed}>
            <img src={Minimize} alt={Minimize} className="toggle-icon" />
            <span className="left-toggle">
              Minimize UI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shift+/
            </span>
          </div>
          <div className="left-panel-content">
            <div className="left-panel-header">
              <div className="left-section-header">
                <span>Files</span>
              </div>
              <div className="left-header-divider" />
              <div
                className={`left-section-title ${isScrolled ? "scrolled" : ""} 
                        ${assetsCollapsed ? "collapsed" : ""}`}
                ref={titleRef}
                onClick={handleAssetsCollapse}
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <div className="layers-header">
                  <img
                    className="arrow-icon"
                    src={assetsCollapsed ? Back : Down}
                    alt={assetsCollapsed ? "Expand" : "Collapse"}
                    style={{
                      width: "10px",
                      height: "10px",
                      marginLeft: "-16px",
                      marginTop: "-2px",
                      transition: "transform 0.2s ease",
                    }}
                  />
                  <span>Layers</span>
                </div>
              </div>
            </div>

            {/* Scrolls only this part */}
            {!assetsCollapsed && (
              <div className={`assets-scroll ${assetsCollapsed ? "hidden" : ""}`} ref={scrollRef}>
                <ul className="assets-list">
                  {drawnRectangles && drawnRectangles.length > 0 && (
                    drawnRectangles.map((shape, i) => (
                      <li
                        key={shape.id || i}
                        className={selectedShapes && selectedShapes.includes(shape.id) ? "selected" : ""}
                        onClick={() => setSelectedShapes([shape.id])}
                      >
                        {renamingId === shape.id ? (
                          <form onSubmit={handleRenameSubmit} style={{ display: 'inline' }}>
                            <input
                              ref={renameInputRef}
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              onBlur={handleRenameSubmit}
                              style={{ width: '90%', fontSize: 'inherit' }}
                              maxLength={32}
                            />
                          </form>
                        ) : shape.name}
                      </li>
                    ))
                  )}
                  <div style={{ height: "35px" }} />
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
