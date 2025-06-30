import "./LeftPanel.css";
import { useState, useRef, useEffect } from "react";
import Back from "../../../assets/back.png";
import Down from "../../../assets/down.png";
import Minimize from "../../../assets/LeftPanel/layout.png";

const LeftPanel = ({ collapsed, toggleCollapsed }) => {
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState(false);

  // Consolidated effect for scroll handling and state (isScrolled)
  useEffect(() => {
    const node = scrollRef.current;

    // Logic for restoring scroll position after expansion
    if (node && !assetsCollapsed) { // When assets section is *not* collapsed (i.e., expanding or already open)
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
      if (currentMaxHeight === "0px") { // If it was collapsed and is now opening
        node.addEventListener("transitionend", handleTransitionEnd);
      } else if (scrollPosition.current > 0) { // If it's already open and we have a scroll to restore
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
