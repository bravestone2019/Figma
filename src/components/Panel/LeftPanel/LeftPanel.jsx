import "./LeftPanel.css";
import { useState, useEffect } from "react";
import Back from "../../../assets/back.png";
import Down from "../../../assets/down.png";
import Minimize from "../../../assets/LeftPanel/minimize.png";
import "../RightPanel/RightPanel.css";
// import { v4 as uuidv4 } from 'uuid';
import LayerList from "./leftSection/LayerList.jsx";
import PageList from "./leftSection/PageList.jsx";
import useShapeShortcuts from "./utills/useShapeShortcuts.js";
import usePageShortcuts from "./utills/usePageShortcuts.js";
import useScrollCollapse from "./utills/useScrollCollapse.js";
import useRenameState from "./utills/useRenameState.js";
import useDragState from "./utills/useDragState.js";
import usePanelState from "./utills/usePanelState.js";

const LeftPanel = ({
  collapsed,
  toggleCollapsed,
  pages,
  setPages,
  activePageId,
  setActivePageId,
  drawnRectangles,
  selectedShapes,
  setSelectedShapes,
  setDrawnRectangles,
  setActiveTool,
  collection,
  setCollection,
  collections, // now from props
  setCollections, // now from props
}) => {
  const {
    isScrolled,
    assetsCollapsed,
    handleAssetsCollapse,
    scrollRef,
    titleRef,
  } = useScrollCollapse();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  // Replace individual state declarations with grouped hooks
  const {
    renamingId,
    setRenamingId,
    renamingPageId,
    setRenamingPageId,
    renameValue,
    setRenameValue,
    renameInputRef,
  } = useRenameState();
  const {
    draggedShapeId,
    setDraggedShapeId,
    isCollectionDragOver,
    setIsCollectionDragOver,
  } = useDragState();
  // const {
  //   openGroups,
  //   setOpenGroups,
  //   collectionOpen,
  //   setCollectionOpen,
  // } = usePanelState();
  // Page actions
  // const handleAddPage = () => {
  //   const newId = `page-${Date.now()}`;
  //   const newName = `Page ${pages.length + 1}`;
  //   setPages([
  //     ...pages,
  //     {
  //       id: newId,
  //       name: newName,
  //       drawnRectangles: [],
  //       selectedShapes: [],
  //     },
  //   ]);
  //   setActivePageId(newId);
  // };
  // const handleSelectPage = (id) => setActivePageId(id);
  // const handleRenamePage = (id) => {
  //   const newName = prompt('Rename page:', pages.find(p => p.id === id)?.name || '');
  //   if (newName && newName.trim()) {
  //     setPages(pages => pages.map(p => p.id === id ? { ...p, name: newName.trim() } : p));
  //   }
  // };
  // const handleDeletePage = (id) => {
  //   if (pages.length === 1) return; // Prevent deleting last page
  //   const newPages = pages.filter(p => p.id !== id);
  //   setPages(newPages);
  //   if (activePageId === id) {
  //     // Switch to first page if active is deleted
  //     setActivePageId(newPages[0].id);
  //   }
  //   // Reset renaming state if the deleted page was being renamed
  //   if (renamingPageId === id) {
  //     setRenamingPageId(null);
  //     setRenameValue("");
  //   }
  // };

  // Focus input when entering rename mode
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Inline page rename handlers
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
  // const handleRenameInputKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleRenameInputBlur();
  //   } else if (e.key === 'Escape') {
  //     setRenamingPageId(null);
  //     setRenameValue("");
  //   }
  // };

  const handleUngroup = (groupId) => {
    setDrawnRectangles((prev) => {
      // Find the group
      const group = prev.find((s) => s.id === groupId && s.type === "group");
      if (!group || !Array.isArray(group.children)) return prev;
      // Remove the group and add its children to the top level
      const withoutGroup = prev.filter((s) => s.id !== groupId);
      // Remove children from any other group (if needed)
      const childIds = new Set(group.children);
      const updated = withoutGroup.map((s) =>
        s.type === "group" && Array.isArray(s.children)
          ? { ...s, children: s.children.filter((id) => !childIds.has(id)) }
          : s
      );
      // Add children to top level (preserve their order)
      const children = group.children
        .map((id) => prev.find((s) => s.id === id))
        .filter(Boolean);
      return [...updated, ...children];
    });
    // Remove the group from collection if present
    setCollection((prev) => prev.filter((id) => id !== groupId));
    // Deselect the group and select its children
    setSelectedShapes(() => {
      const group = drawnRectangles.find(
        (s) => s.id === groupId && s.type === "group"
      );
      return group && Array.isArray(group.children) ? [...group.children] : [];
    });
  };

  useShapeShortcuts({
    selectedShapes,
    drawnRectangles,
    setRenamingId,
    setRenameValue,
    setActiveTool,
    renamingId,
    setCollection,
    handleUngroup,
    renamingPageId,
  });
  usePageShortcuts({
    activePageId,
    pages,
    startRenamePage,
    renamingId,
  });

  // Keyboard shortcut: Ctrl+G to add selected shapes to collection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "G" || e.key === "g")) {
        if (selectedShapes && selectedShapes.length > 0) {
          setCollection((prev) => {
            // Add only new IDs
            const newIds = selectedShapes.filter((id) => !prev.includes(id));
            const updated = [...prev, ...newIds];
            console.log("Collection:", updated);
            return updated;
          });
        }
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapes]);

  // Keyboard shortcut: Ctrl+Shift+G to ungroup selected group or un-collect selected collection items
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "G" || e.key === "g")) {
        if (selectedShapes && selectedShapes.length > 0) {
          let didUngroup = false;
          selectedShapes.forEach((id) => {
            const shape = drawnRectangles.find((s) => s.id === id);
            if (shape && shape.type === "group") {
              handleUngroup(shape.id);
              didUngroup = true;
            }
          });
          // If no group was ungrouped, un-collect selected collection items
          if (!didUngroup) {
            setCollection((prev) =>
              prev.filter((id) => !selectedShapes.includes(id))
            );
          }
        }
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapes, drawnRectangles]);

  useEffect(() => {
    function updateScrollHeight() {
      const panel = document.querySelector(".left-panel-content");
      const header = document.querySelector(".left-panel-header");
      const section = document.querySelector(".left-section-title");
      if (panel && header && section) {
        const panelRect = panel.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        // Calculate available height for the scroll area
        const available =
          panelRect.height - headerRect.height - sectionRect.height - 32; // 32 for paddings/margins
        setScrollHeight(available > 0 ? available : 200); // fallback to 200px min
      }
    }
    updateScrollHeight();
    window.addEventListener("resize", updateScrollHeight);
    return () => window.removeEventListener("resize", updateScrollHeight);
  }, []);

  const [pagesHeight, setPagesHeight] = useState("50px");

  const handleMouseDown = () => {
    const scrollWrapper = document.querySelector(".pages-scroll-wrapper");
    if (!scrollWrapper) return;

    const startY = window.event.clientY;
    const startHeight = scrollWrapper.getBoundingClientRect().height;

    const handleMouseMove = (e) => {
      const delta = e.clientY - startY;
      const newHeight = startHeight + delta;

      if (newHeight >= 40 && newHeight <= 400) {
        setPagesHeight(`${newHeight}px`);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ns-resize";
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
            </div>
            {/* Pages Section (now below Files) */}
            <PageList
              pages={pages}
              activePageId={activePageId}
              setPages={setPages}
              setActivePageId={setActivePageId}
              pagesHeight={pagesHeight}
              handleMouseDown={handleMouseDown}
            />

            {/* Layer Section */}
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
            {/* Scrolls only this part */}
            {!assetsCollapsed && (
              <div
                className={`assets-scroll ${
                  assetsCollapsed ? "collapsed" : "expanded"
                }`}
                ref={scrollRef}
                // style={{
                //   height: scrollHeight ? `${scrollHeight}px` : undefined,
                // }}
              >
                <LayerList
                  drawnRectangles={drawnRectangles}
                  selectedShapes={selectedShapes}
                  setSelectedShapes={setSelectedShapes}
                  setDrawnRectangles={setDrawnRectangles}
                  setActiveTool={setActiveTool}
                  collection={collection} // keep old prop for now
                  setCollection={setCollection} // keep old prop for now
                  collections={collections} // new prop for future
                  setCollections={setCollections} // new prop for future
                  handleUngroup={handleUngroup}
                  renamingId={renamingId}
                  setRenamingId={setRenamingId}
                  renameValue={renameValue}
                  setRenameValue={setRenameValue}
                  renameInputRef={renameInputRef}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
