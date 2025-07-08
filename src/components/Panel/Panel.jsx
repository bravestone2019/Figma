import "./Panel.css";
import { useState, useEffect, useRef } from "react";
import Shortcut from "../Shortcut";
import Minimize from "../../assets/LeftPanel/toggle.png"
import LeftPanel from "./LeftPanel/LeftPanel";
import RightPanel from "./RightPanel/RightPanel";

const Panel = ({ selectedShapes, setSelectedShapes, drawnRectangles, setDrawnRectangles, setActiveTool }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(275);
  const [rightPanelWidth, setRightPanelWidth] = useState(275);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  const togglePanel = () => {
    // setCollapsed((prev) => !prev);
    setCollapsed(!collapsed);
  };

  Shortcut({ ctrl:true, key: "/" }, togglePanel);

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
            <LeftPanel 
              collapsed={collapsed} 
              toggleCollapsed={togglePanel}
              drawnRectangles={drawnRectangles}
              selectedShapes={selectedShapes}
              setSelectedShapes={setSelectedShapes}
              setDrawnRectangles={setDrawnRectangles}
              setActiveTool={setActiveTool}
            />
            <div className="resize-handle-left" onMouseDown={handleMouseDownLeft} />
          </div>

          <div
            className="panel-container right"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <div className="resize-handle-right" onMouseDown={handleMouseDownRight} />
            <RightPanel 
              collapsed={collapsed}
              selectedShapes={selectedShapes}
              setSelectedShapes={setSelectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
          </div>
        </>
      )}

      {/* Optionally, render something when collapsed is true */}
      {collapsed && (
        <div className="toggle-container">
        <div className="toggle-left">
          <img
            src={Minimize}
            alt={Minimize}
            className="toggle-icon"
            onClick={togglePanel}
          />
          </div>
          <span className="left-toggle-tooltip">Expand UI
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shift+/
          </span>
        </div>  
      )}
    </>
  );
};

export default Panel;
