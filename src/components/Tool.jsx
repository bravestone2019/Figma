import "./Tool.css";
import { useState } from "react";
import MoveTool from "./Tools/Move/MoveTool";
import RegionTool from "./Tools/Region/RegionTool";
import ShapeTool from "./Tools/Shape/ShapeTool";
import CreationTool from "./Tools/Creation/CreationTool";
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

      < TextTool 
        activeTool={ activeTool } 
        setActiveTool={ setActiveTool } 
        openDropdown={ openDropdown }
        />
    </div>
  );
};

export default Tool;
