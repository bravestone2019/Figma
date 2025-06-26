import "./Panel.css";
import { useState } from "react";
import Canvas from "../Canvas/Canvas";
import LeftPanel from "./LeftPanel/LeftPanel";
import RightPanel from "./RightPanel/RightPanel";

const Panel = () => {
  // { position, setPosition, activeTool, drawnRectangles, setDrawnRectangles,}
  const MAX_WIDTH = 600;
  // const [scale, setScale] = useState(1);
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  const DEFAULT_PANEL_WIDTH = 275;
  // const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  // const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_PANEL_WIDTH);  useEffect, useCallback, useRef
  // const [isResizingLeft, setIsResizingLeft] = useState(false);
  // const [isResizingRight, setIsResizingRight] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  // const [hidden, setHidden] = useState(false);

  // Refs for the left and right panels
  // const mainContentRef = useRef(null);

  // Handle mouse move for resizing
  // const leftResize = useCallback(() => {
  //     setIsResizingLeft(true);
  // });

  // // Handle mouse move for resizing
  // const rightResize = useCallback(() => {
  //     setIsResizingRight(true);
  // });

  // Handles mouse move globally
  // const handleMouseMove = useCallback((e) => {
  //     if (isResizingLeft) {
  //         const newWidth = e.clientX - mainContentRef.current.getBoundingClientRect().left;
  //         if (newWidth >= DEFAULT_PANEL_WIDTH && newWidth <= MAX_WIDTH) {
  //             setLeftPanelWidth(newWidth);
  //         }
  //     } else if (isResizingRight) {
  //         const newWidth = mainContentRef.current.getBoundingClientRect().right - e.clientX;
  //         if (newWidth >= DEFAULT_PANEL_WIDTH && newWidth <= MAX_WIDTH) {
  //             setRightPanelWidth(newWidth);
  //         }
  //     }
  // }, [isResizingLeft, isResizingRight, mainContentRef]);

  // Handle mouse up to stop resizing
  // const handleMouseUp = useCallback(() => {
  //     setIsResizingLeft(false);
  //     setIsResizingRight(false);
  // }, []);

  // Attach event listeners for mouse move and mouse up
  // useEffect(() => {
  //     document.addEventListener('mousemove', handleMouseMove);
  //     document.addEventListener('mouseup', handleMouseUp);

  //     return () => {
  //         document.removeEventListener('mousemove', handleMouseMove);
  //         document.removeEventListener('mouseup', handleMouseUp);
  //     };
  // }, [handleMouseMove, handleMouseUp]);

  const togglePanel = () => {
    // setCollapsed(!collapsed);
    setCollapsed((prev) => !prev);
    // setHidden(hidden);
  };

  // const hideThePanels = () => {
  //   setCollapsed(true);
  //   setHidden(true);
  // };

  return (
    <>
      {/* <div className="panel-wrapper"> */}
      {!collapsed && (
        <>
          <div className="panel-container left">
            <LeftPanel collapsed={collapsed} toggleCollapsed={togglePanel} />
          </div>

          <div className="panel-container right">
            <RightPanel collapsed={collapsed} />
          </div>
        </>
      )}
      {/* </div> */}

      {/* Optionally, render something when collapsed is true */}
      {collapsed && (
        <>
          <div className="toggle-left">
            <LeftPanel collapsed={collapsed} toggleCollapsed={togglePanel} />
          </div>

          {/* <div className="toggle-right">
            <RightPanel collapsed={collapsed}  />
          </div> */}
        </>
      )}
    </>
  );
};

export default Panel;
