import "./Tool.css";
import { useState } from "react";
import MoveTool from "./Move/MoveTool";
import RegionTool from "./Region/RegionTool";
import ShapeTool from "./Shape/ShapeTool";
import CreationTool from "./Creation/CreationTool";
import TextTool from "./Text/TextTool";
import Generate from "../Generate/Generate";
import Upload from "../Generate/Upload/Upload";

const Tool = ({ activeTool, setActiveTool, position, scale, setDrawnRectangles, drawnRectangles, collections }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  // Add excelData state
  const [excelData, setExcelData] = useState([]);
  // Add files state for uploaded files
  const [files, setFiles] = useState([]);

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
        drawnRectangles={drawnRectangles} // <-- pass real array
        collections={collections} // <-- pass collections
        excelData={excelData} // <-- pass excelData
        setExcelData={setExcelData} // <-- pass setExcelData
        files={files} // <-- pass files for image mapping
        setFiles={setFiles} // <-- pass setFiles for file management
      />
      <Upload
        setExcelData={setExcelData}
        files={files}
        setFiles={setFiles}
      />
    </div>
  );
};

export default Tool;
