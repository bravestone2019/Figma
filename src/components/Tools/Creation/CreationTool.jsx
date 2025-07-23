import './CreationTool.css';
import Shortcut from '../../Shortcut';
import "../../../components/Tools/Tool.css";
import { useState, useRef, useEffect } from "react";
import DownArrow from '../../../assets/down.png';
import Pen from '../../../assets/Tools/creation_Tools/pen.png';
import Pencil from '../../../assets/Tools/creation_Tools/pencil.png';

const creationTools = [
  { key: "Pen", label: "Pen", shortcut: "P", icon: Pen },
  { key: "Pencil", label: "Pencil", shortcut: "ctrl+P", icon: Pencil }
];

const CreationTool = ({ activeTool, setActiveTool, openDropdown, setOpenDropdown, showTooltip, setShowTooltip  }) => {
  const [selected, setSelected] = useState(creationTools[0]); // Default to Pen
  const dropdownRef = useRef();
  const tooltipTimeout = useRef();
  const isThisDropdownOpen = openDropdown === "creation";

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

  // Pen : P
  Shortcut({ key: "p" }, () => {
    handleToolClick("Pen");
  });

  // Pencil: Ctrl + P
  Shortcut({ ctrl: true, key: "p" }, () => {
    handleToolClick("Pencil");
  });

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    setOpenDropdown(false);
    // If a shape is selected from dropdown, update selectedShape
    const found = creationTools.find(select => select.key === tool);
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
          const newState = openDropdown === "creation" ? null : "creation";
          setOpenDropdown(newState);
        }}
      >
        <img src={DownArrow} alt="creation-tools" className="icon-down" />
        <span className={`tooltip${!showTooltip ? " hide-tooltip" : ""}`}>Creation Tools</span>
        {openDropdown === "creation" && (
          <div className="creation-dropdown-panel" ref={dropdownRef}>
            {creationTools.map(tool => (
              <div
                key={tool.key}
                className={`creation-dropdown-item${activeTool === tool.key ? " selected" : ""}`}
                onClick={() => handleToolClick(tool.key)}
              >
                <span className="creation-dropdown-icon">
                  <img src={tool.icon} alt={tool.label} style={{ width: 15, height: 15 }} />
                </span>
                <span>{tool.label}</span>
                <span className="creation-dropdown-shortcut">{tool.shortcut}</span>
                {/* {activeTool === tool.key && <span className="move-dropdown-check">&#10003;</span>} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CreationTool;