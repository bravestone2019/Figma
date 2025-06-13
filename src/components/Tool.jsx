import "./Tool.css";
import { useState } from "react";
import MoveTool from "./Tools/MoveTool";
import RegionTool from "./Tools/RegionTool";
import ShapeTool from "./Tools/ShapeTool";
import CreationTool from "./Tools/CreationTool";
import TextTool from "./Tools/TextTool";

const Tool = () => {
  const [ activeTool, setActiveTool ] = useState( null );
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  return (
    <div className="tools-container">
      <MoveTool
        activeTool={ activeTool }
        setActiveTool={ setActiveTool }
        openDropdown={ openDropdown }
        setOpenDropdown={ setOpenDropdown }
        showTooltip={ showTooltip }
        setShowTooltip={ setShowTooltip }
      />
      <RegionTool
        activeTool={ activeTool }
        setActiveTool={ setActiveTool }
        openDropdown={ openDropdown }
        setOpenDropdown={ setOpenDropdown }
        showTooltip={ showTooltip }
        setShowTooltip={ setShowTooltip }
      />
      < ShapeTool 
        activeTool={ activeTool } 
        setActiveTool={ setActiveTool } 
        openDropdown={ openDropdown }
        setOpenDropdown={ setOpenDropdown }
        showTooltip={ showTooltip }
        setShowTooltip={ setShowTooltip }
        />
      < CreationTool 
        activeTool={ activeTool } 
        setActiveTool={ setActiveTool } 
        openDropdown={ openDropdown }
        setOpenDropdown={ setOpenDropdown }
        showTooltip={ showTooltip }
        setShowTooltip={ setShowTooltip }
        />

      < TextTool activeTool={ activeTool } setActiveTool={ setActiveTool } />
    </div>
  );
};

export default Tool;
