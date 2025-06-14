import '../../../components/Tool.css';
import './RegionTool.css';
import Shortcut from '../../Shortcut';
import { useState, useRef, useEffect } from "react";
import Grid from '../../../assets/region/grid.png';
import Section from '../../../assets/region/section.png';
import Slice from '../../../assets/region/slice.png';
import DownArrow from '../../../assets/down.png';

const regionTools = [
  { key: "Grid", label: "Grid", shortcut: "F", icon: Grid },
  { key: "Section", label: "Section ", shortcut: "ctrl+S", icon: Section },
  { key: "Slice", label: "Slice", shortcut: "S", icon: Slice }
];

const RegionTool = ({ activeTool, setActiveTool, openDropdown, setOpenDropdown, showTooltip, setShowTooltip  }) => {
  const [selected, setSelected] = useState(regionTools[0]); // Default to Grid
  const dropdownRef = useRef();
  const tooltipTimeout = useRef();
  const isThisDropdownOpen = openDropdown === "region";

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

  // Grid: F
  Shortcut({ key: "f" }, () => {
    handleToolClick("Grid");
  });

  // Section: Ctrl + S
  Shortcut({ ctrl: true, key: "s" }, () => {
    handleToolClick("Section");
  });

  // Slice: S
  Shortcut({ key: "s" }, () => {
    handleToolClick("Slice");
  });

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    setOpenDropdown(false);
    // If a move is selected from dropdown, update selected
    const found = regionTools.find(select => select.key === tool);
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
          const newState = openDropdown === "region" ? null : "region";
          setOpenDropdown(newState);
        }}
      >
        <img src={DownArrow} alt="move-tools" className="icon-down" />
        <span className={`tooltip${!showTooltip ? " hide-tooltip" : ""}`}>Region Tools</span>
        {openDropdown === "region" && (
          <div className="region-dropdown-panel" ref={dropdownRef}>
            {regionTools.map(tool => (
              <div
                key={tool.key}
                className={`region-dropdown-item${activeTool === tool.key ? " selected" : ""}`}
                onClick={() => handleToolClick(tool.key)}
              >
                <span className="region-dropdown-icon">
                  <img src={tool.icon} alt={tool.label} style={{ width: 15, height: 15 }} />
                </span>
                <span>{tool.label}</span>
                <span className="region-dropdown-shortcut">{tool.shortcut}</span>
                {/* {activeTool === tool.key && <span className="move-dropdown-check">&#10003;</span>} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RegionTool;