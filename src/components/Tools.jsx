import "./tools.css";
import { useState } from "react";
import DownArrow from "../assets/down.png";
import Text from "../assets/text.png";
import Move from "../assets/cursor.png";
import Shapes from "../assets/rectangle.png";

const Tools = () => {
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (tool) => {
    if (activeTool === tool) {
      setActiveTool(null); // Deselect the tool if it's already active
    } else {
      setActiveTool(tool); // Set the clicked tool as active
    }
  };
  return (
    <div className="tools-container">
        {/* Grouped: Move + Down (tighter spacing) */}
      <div className="icon-group-tight">
          {/* MOVE BUTTON  */}
      <div
        className={`icon-wrapper${activeTool === "move" ? " active" : ""}`}
        onClick={() => handleToolClick("move")}
      >
        <img src={ Move } alt="Move" className="icon" />
        <span className="tooltip">Move&nbsp;&nbsp;&nbsp;&nbsp;V</span>
      </div>
        {/* DOWN BUTTON */}
      <div
        className={`icon-wrapper-other${activeTool === "down" ? " active" : ""}`}
        onClick={() => handleToolClick("down")}
      >
        <img src={ DownArrow } alt="down" className="icon-down" />
        <span className="tooltip">Move Tools</span>
      </div>
      </div>
       {/* Grouped: shapes + Down (tighter spacing) */}
      <div className="icon-group-tight">
        {/* SHAPES BUTTON */}
      <div
        className={`icon-wrapper${activeTool === "shapes" ? " active" : ""}`}
        onClick={() => handleToolClick("shapes")}
      >
        <img src={ Shapes } alt="Rectangle" className="icon" />
        <span className="tooltip">Rectangle&nbsp;&nbsp;&nbsp;&nbsp;R</span>
      </div>
        {/* DOWN BUTTON */}
      <div
        className={`icon-wrapper-other${activeTool === "down" ? " active" : ""}`}
        onClick={() => handleToolClick("down")}
      >
        <img src={ DownArrow } alt="down" className="icon-down" />
        <span className="tooltip">Shape Tools</span>
      </div>
      </div>
        {/* TEXT BUTTON */}
      <div
        className={`icon-wrapper${activeTool === "Text" ? " active" : ""}`}
        onClick={() => handleToolClick("Text")}
      >
        <img src={ Text } alt="Text" className="icon" />
        <span className="tooltip">Text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T</span>
      </div>
    </div>
  );
};

export default Tools;
