import '../../../components/Tools/Tool.css';
import './MoveTool.css';
import Shortcut from '../../Shortcut';
import DownArrow from '../../../assets/down.png';
import { useState, useRef, useEffect } from "react";
import Move from '../../../assets/Tools/move_Tools/move.png';
import Hand from '../../../assets/Tools/move_Tools/hand.png';
import Scale from '../../../assets/Tools/move_Tools/scale.png';

const moveTools = [
  { key: "Move", label: "Move", shortcut: "V", icon: Move },
  { key: "Hand", label: "Hand", shortcut: "H", icon: Hand },
  { key: "Scale", label: "Scale", shortcut: "K", icon: Scale }
];

const MoveTool = ({ activeTool, setActiveTool, openDropdown, setOpenDropdown, showTooltip, setShowTooltip  }) => {
  const [selected, setSelected] = useState(moveTools[0]); // Default to Move
  const dropdownRef = useRef();
  const tooltipTimeout = useRef();
  const isThisDropdownOpen = openDropdown === "move";

  // Update selected tool when activeTool changes
  useEffect(() => {
    const found = moveTools.find(tool => tool.key === activeTool);
    if (found) {
      setSelected(found);
    }
  }, [activeTool]);
  
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

  useEffect(() => {
    // Set Move as the default active tool and selected on mount
    setActiveTool("Move");
    setSelected(moveTools[0]);
  }, [setActiveTool]);

//   useEffect(() => {
//   const body = document.body;
//   if (activeTool === "Move") {
//     body.classList.add("cursor-move-tool");
//   } else {
//     body.classList.remove("cursor-move-tool");
//   }

//   return () => {
//     body.classList.remove("cursor-move-tool");
//   };
// }, [activeTool]);

  // Move: V
  Shortcut({ key: "v" }, () => {
    handleToolClick("Move");
  });

  // Hand: H
  Shortcut({ key: "h" }, () => {
    handleToolClick("Hand");
  });

  // Scale: K
  Shortcut({ key: "k" }, () => {
    handleToolClick("Scale");
  });

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    setOpenDropdown(false);
    // If a move is selected from dropdown, update selected
    const found = moveTools.find(select => select.key === tool);
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
          const newState = openDropdown === "move" ? null : "move";
          setOpenDropdown(newState);
        }}
      >
        <img src={DownArrow} alt="move-tools" className="icon-down" />
        <span className={`tooltip${!showTooltip ? " hide-tooltip" : ""}`}>Move Tools</span>
        {openDropdown === "move" && (
          <div className="move-dropdown-panel" ref={dropdownRef}>
            {moveTools.map(tool => (
              <div
                key={tool.key}
                className={`move-dropdown-item${activeTool === tool.key ? " selected" : ""}`}
                onClick={() => handleToolClick(tool.key)}
              >
                <span className="move-dropdown-icon">
                  <img src={tool.icon} alt={tool.label} style={{ width: 15, height: 15 }} />
                </span>
                <span>{tool.label}</span>
                <span className="move-dropdown-shortcut">{tool.shortcut}</span>
                {/* {activeTool === tool.key && <span className="move-dropdown-check">&#10003;</span>} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MoveTool;