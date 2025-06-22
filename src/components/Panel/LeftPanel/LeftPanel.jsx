import "./LeftPanel.css"; 
import { useState, useRef, useEffect } from "react";
import Logo from "../../../assets/Logo.png";
import Minimize from "../../../assets/layout.png";

const LeftPanel = ({ collapsed, toggleCollapsed }) => {
    const titleRef = useRef(null);
    const scrollRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    const node = scrollRef.current;

    const handleScroll = () => {
        // const title = title.current;
        if(node) {
            setIsScrolled(node.scrollTop > 0);
            };
        };

        if (node) {
        node.addEventListener("scroll", handleScroll);
        };
        return () => {
        if (node) {
            node.removeEventListener("scroll", handleScroll);
            };
        };
    }, []);


    return (
        <div className={`left-panel ${collapsed ? "collapsed" : ""}`}>
            <div className="left-toggle-panel">
                <div className="logo-area">
                    <img
                        src={Logo}
                        alt="Minimize"
                        className="logo-icon"
                    />
                    <span className="logo-tooltip">Main Menu</span>
                </div>
                <div className="toggle-wrapper" onClick={toggleCollapsed}>
                    <img
                        src={Minimize}
                        alt="Minimize"
                        className="toggle-icon"
                    />
                    <span className="left-toggle"> {collapsed ? "Expand UI" : "Minimize UI"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shift+/</span>
                </div>
            </div>

            {!collapsed && (
                <div className="left-panel-content">
                    <div className="left-panel-header">
                        <div className="left-section-header">Files</div>
                        <div className="left-header-divider" />
                        <div className={`left-section-title ${isScrolled ? "scrolled" : ""}`} ref={titleRef}>Assets</div>
                    </div>

                    {/* Scrolls only this part */}
                    <div className="assets-scroll" ref={scrollRef} >
                        <ul className="assets-list">
                        {[
                            "Layer 1", "Layer 2", "Layer 3", "Background", "Text Box", "Image 1",
                            "Shape 1", "Vector Path", "Group 1", "Button", "Icon", "Rectangle",
                            "Line", "Text Label", "Dropdown", "Checkbox", "Radio Button", "Slider",
                            "Layer 1", "Layer 2", "Layer 3", "Background", "Text Box", "Image 1",
                            "Shape 1", "Vector Path", "Group 1", "Button", "Icon", "Rectangle",
                            "Line", "Text Label", "Dropdown", "Checkbox", "Radio Button", "Slider"
                        ].map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                        <div style={{ height: "35px" }} /> {/* Spacer at the bottom */}
                        </ul>
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default LeftPanel;


