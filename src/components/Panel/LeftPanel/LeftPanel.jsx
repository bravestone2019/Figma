import "./LeftPanel.css";
import { useState, useRef, useLayoutEffect } from "react";
import Back from "../../../assets/back.png";
import Down from "../../../assets/down.png";
import Minimize from "../../../assets/LeftPanel/layout.png";

const LeftPanel = ({ collapsed, toggleCollapsed }) => {
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState(false);

  // Restore scroll position when expanding
  useLayoutEffect(() => {
    const node = scrollRef.current;

    if (!collapsed && !assetsCollapsed && node) {
      node.scrollTop = scrollPosition.current;

      const handleScroll = () => {
        setIsScrolled(node.scrollTop > 0);
      };

      node.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        node.removeEventListener("scroll", handleScroll);
      };
    }
  }, [collapsed, assetsCollapsed]);

  // Save scroll position before collapsing
  const handleAssetsCollapse = () => {
    if (scrollRef.current && !assetsCollapsed) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
    setAssetsCollapsed(!assetsCollapsed);
  };

  return (
    <div className={`left-panel ${collapsed ? "collapsed" : ""}`}>
      {collapsed && (
        <div className="toggle-container">
        <div className="toggle-left">
          <img
            src={Minimize}
            alt={Minimize}
            className="toggle-icon"
            onClick={toggleCollapsed}
          />
          </div>
          <span className="left-toggle-tooltip">Expand UI
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shift+/
          </span>
          
        </div>
      )}

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
              <div className="assets-scroll" ref={scrollRef}>
                <ul className="assets-list">
                  {[
                    "Layer 1",
                    "Layer 2",
                    "Layer 3",
                    "Background",
                    "Text Box",
                    "Image 1",
                    "Shape 1",
                    "Vector Path",
                    "Group 1",
                    "Button",
                    "Icon",
                    "Rectangle",
                    "Line",
                    "Text Label",
                    "Dropdown",
                    "Checkbox",
                    "Radio Button",
                    "Slider",
                    "Layer 1",
                    "Layer 2",
                    "Layer 3",
                    "Background",
                    "Text Box",
                    "Image 1",
                    "Shape 1",
                    "Vector Path",
                    "Group 1",
                    "Button",
                    "Icon",
                    "Rectangle",
                    "Line",
                    "Text Label",
                    "Dropdown",
                    "Checkbox",
                    "Radio Button",
                    "Slider",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                  <div style={{ height: "35px" }} />{" "}
                  {/* Spacer at the bottom */}
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
