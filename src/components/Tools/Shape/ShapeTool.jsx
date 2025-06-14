import '../../../components/Tool.css';
import './ShapeTool.css';
import Image from './Image/images';
import Shortcut from '../../Shortcut';
import { useState, useRef, useEffect } from "react";
import Rectangle from '../../../assets/Shapes/rectangle.png';
import DownArrow from '../../../assets/down.png';
import Line from '../../../assets/Shapes/line.png';
import Circle from '../../../assets/Shapes/circle.png';
import Triangle from '../../../assets/Shapes/triangle.png';
import ImageIcon from '../../../assets/Shapes/image.png';


const shapeTools = [
  { key: "Rectangle", label: "Rectangle", shortcut: "R", icon: Rectangle },
  { key: "Line", label: "Line", shortcut: "L", icon: Line },
  { key: "Circle", label: "Circle", shortcut: "C", icon: Circle },
  { key: "Triangle", label: "Triangle", shortcut: "shift+T", icon: Triangle },
  { key: "Image", label: "Image", shortcut: "ctrl+shift+I", icon: ImageIcon },
];

const ShapeTool = ({ activeTool, setActiveTool, openDropdown, setOpenDropdown, showTooltip, setShowTooltip  }) => {
  const [selected, setSelected] = useState(shapeTools[0]); // Default to Rectangle
  const dropdownRef = useRef();
  const tooltipTimeout = useRef();
  const isThisDropdownOpen = openDropdown === "shape";

  useEffect(() => {
    if (openDropdown) {
      document.body.classList.add('dropdown-open');
    } else {
      document.body.classList.remove('dropdown-open');
    }
    return () => {
      document.body.classList.remove('dropdown-open');
    };
  }, [openDropdown]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenDropdown]);

  useEffect(() => {
  if (isThisDropdownOpen) {
    setShowTooltip(false);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
  } else {
    tooltipTimeout.current = setTimeout(() => setShowTooltip(true), 600);
  }
  return () => clearTimeout(tooltipTimeout.current);
  }, [setShowTooltip, isThisDropdownOpen]);

  //  Keyboard shortcuts for shape tools
  // Rectangle: R
  Shortcut({ key: "r" }, () => {
    handleToolClick("Rectangle");
  });

  // Line: L
  Shortcut({ key: "l" }, () => {
    handleToolClick("Line");
  });

  // Circle: C
  Shortcut({ key: "c" }, () => {
    handleToolClick("Circle");
  });

  // Triangle: Shift+T
  Shortcut({ shift: true, key: "t" }, () => {
    handleToolClick("Triangle");
  });

  // Image: Ctrl+Shift+I
  Shortcut({ ctrl: true, shift: true, key: "i" }, () => {
    handleToolClick("Image");
  });

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    setOpenDropdown(false);
    // If a shape is selected from dropdown, update selected
    const found = shapeTools.find(select => select.key === tool);
    if (found) setSelected(found);
  };

  return (
    <>
      <div
        className={`icon-wrapper${activeTool === selected.key ? " active" : ""}`}
        onClick={() => handleToolClick(selected.key)}
      >
        <img src={selected.icon} alt={selected.label} className="icon" />
        <span className="tooltip">{selected.label}&nbsp;&nbsp;&nbsp;&nbsp;{selected.shortcut}</span>
      </div>
      <div
        className={`icon-wrapper-other${openDropdown ? " active" : ""}`}
        onClick={event => {
          event.stopPropagation();
          const newState = openDropdown === "shape" ? null : "shape";
          setOpenDropdown(newState);
        }}
      >
        <img src={DownArrow} alt="shapes-tools" className="icon-down" />
        <span className={`tooltip${!showTooltip ? " hide-tooltip" : ""}`}>Shape Tools</span>
        {openDropdown === "shape" && (
          <div className="shape-dropdown-panel" ref={dropdownRef}>
            {shapeTools.map(tool => (
              <div
                key={tool.key}
                className={`shape-dropdown-item${activeTool === tool.key ? " selected" : ""}`}
                onClick={() => handleToolClick(tool.key)}
              >
                <span className="shape-dropdown-icon">
                  <img src={tool.icon} alt={tool.label} style={{ width: 15, height: 15 }} />
                </span>
                <span>{tool.label}</span>
                <span className="shape-dropdown-shortcut">{tool.shortcut}</span>
                {/* {activeTool === tool.key && <span className="move-dropdown-check">&#10003;</span>} */}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* {activeTool === "Image" && <Image activeTool={activeTool} />}                 */}
      <Image activeTool={activeTool} />
    </>
  );
};

export default ShapeTool;
