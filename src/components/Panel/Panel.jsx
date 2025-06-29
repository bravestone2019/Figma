import "./Panel.css";
import { useState, useEffect, useRef } from "react";
// import Shortcut from "../Shortcut";
import LeftPanel from "./LeftPanel/LeftPanel";
import RightPanel from "./RightPanel/RightPanel";

const Panel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(275);
  const [rightPanelWidth, setRightPanelWidth] = useState(275);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  const togglePanel = () => {
    // setCollapsed((prev) => !prev);
    setCollapsed(!collapsed);
  };

  // Shortcut({ key: "/", shift: true }, togglePanel);

  const handleMouseDownLeft = () => {
    isDraggingLeft.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseDownRight = () => {
    isDraggingRight.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e) => {
    if (isDraggingLeft.current) {
      const newLeftWidth = Math.max(275, Math.min(450, e.clientX));
      setLeftPanelWidth(newLeftWidth);
    }

    if (isDraggingRight.current) {
      const windowWidth = window.innerWidth;
      const newRightWidth = Math.max(
        275,
        Math.min(450, windowWidth - e.clientX)
      );
      setRightPanelWidth(newRightWidth);
    }
  };

  const handleMouseUp = () => {
    isDraggingLeft.current = false;
    isDraggingRight.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {!collapsed && (
        <>
          <div
            className="panel-container left"
            style={{ width: `${leftPanelWidth}px` }}
          >
            <LeftPanel collapsed={collapsed} toggleCollapsed={togglePanel} />
            <div className="resize-handle-left" onMouseDown={handleMouseDownLeft} />
          </div>

          <div
            className="panel-container right"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <div className="resize-handle-right" onMouseDown={handleMouseDownRight} />
            <RightPanel collapsed={collapsed} />
          </div>
        </>
      )}

      {/* Optionally, render something when collapsed is true */}
      {collapsed && (
        <LeftPanel collapsed={collapsed} toggleCollapsed={togglePanel} />
      )}
    </>
  );
};

export default Panel;
