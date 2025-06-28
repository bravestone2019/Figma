import "./Tool.css";
import { useState } from "react";
import MoveTool from "./Tools/Move/MoveTool";
import RegionTool from "./Tools/Region/RegionTool";
import ShapeTool from "./Tools/Shape/ShapeTool";
import CreationTool from "./Tools/Creation/CreationTool";
import TextTool from "./Tools/TextTool";
import Generate from "../components/Generate/Generate";

const Tool = ({ activeTool, setActiveTool, position, scale, setDrawnRectangles }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Handler to open/close Generate panel and block other tools
  const handleGenerateOpen = (open) => {
    setIsGenerateOpen(open);
    if (open) {
      setActiveTool("Generate");
      setOpenDropdown(null);
    }
  };

  return (
    <div className={`tools-container${isGenerateOpen ? ' tools-disabled' : ''}`}>
      <MoveTool
        activeTool={activeTool}
        setActiveTool={isGenerateOpen ? () => {} : setActiveTool}
        openDropdown={isGenerateOpen ? null : openDropdown}
        setOpenDropdown={isGenerateOpen ? () => {} : setOpenDropdown}
        showTooltip={isGenerateOpen ? false : showTooltip}
        setShowTooltip={setShowTooltip}
        position={position}
        scale={scale}
      />
      <RegionTool
        activeTool={activeTool}
        setActiveTool={isGenerateOpen ? () => {} : setActiveTool}
        openDropdown={isGenerateOpen ? null : openDropdown}
        setOpenDropdown={isGenerateOpen ? () => {} : setOpenDropdown}
        showTooltip={isGenerateOpen ? false : showTooltip}
        setShowTooltip={setShowTooltip}
        position={position}
        scale={scale}
      />
      <ShapeTool 
        activeTool={activeTool} 
        setActiveTool={isGenerateOpen ? () => {} : setActiveTool} 
        openDropdown={isGenerateOpen ? null : openDropdown}
        setOpenDropdown={isGenerateOpen ? () => {} : setOpenDropdown}
        showTooltip={isGenerateOpen ? false : showTooltip}
        setShowTooltip={setShowTooltip}
        position={position}
        scale={scale}
        setDrawnRectangles={setDrawnRectangles}
      />
      <CreationTool 
        activeTool={activeTool} 
        setActiveTool={isGenerateOpen ? () => {} : setActiveTool} 
        openDropdown={isGenerateOpen ? null : openDropdown}
        setOpenDropdown={isGenerateOpen ? () => {} : setOpenDropdown}
        showTooltip={isGenerateOpen ? false : showTooltip}
        setShowTooltip={setShowTooltip}
        position={position}
        scale={scale}
      />
      <TextTool 
        activeTool={activeTool} 
        setActiveTool={isGenerateOpen ? () => {} : setActiveTool} 
        openDropdown={openDropdown}
        position={position}
        scale={scale}
      />
      <Generate 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        openDropdown={openDropdown}
        isGenerateOpen={isGenerateOpen}
        setIsGenerateOpen={handleGenerateOpen}
        position={position}
        scale={scale}
      />
    </div>
  );
};

export default Tool;
