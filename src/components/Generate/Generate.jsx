import "./Generate.css";
import Shortcut from "../Shortcut";
import { useEffect, useState } from "react";
import folder from "../../assets/auto.png";

const Generate = ({ activeTool, setActiveTool, openDropdown, isGenerateOpen, setIsGenerateOpen }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openDropdown) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }
    return () => {
      document.body.classList.remove("dropdown-open");
    };
  }, [openDropdown]);

  // Register shortcut for 'g' (open generate)
  Shortcut({ key: "g" }, () => {
    setActiveTool("Generate");
    setOpen(true);
    setIsGenerateOpen(true);
  });
  // Register shortcut for 'escape' (close generate)
  Shortcut({ key: "escape" }, () => {
    if (open) {
      setOpen(false);
      setIsGenerateOpen(false);
    }
  });

  const handleOnClick = () => {
    setActiveTool("Generate");
    setOpen(true);
    setIsGenerateOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsGenerateOpen(false);
  };

  useEffect(() => {
    if (!isGenerateOpen) setOpen(false);
  }, [isGenerateOpen]);

  return (
    <>
      <div
        className={`icon-wrapper${activeTool === "Generate" ? " active" : ""}`}
        onClick={handleOnClick}
      >
        <img src={folder} alt="Generate" className="icon" />
        <span className="tooltip">Generate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G</span>
      </div>
      {open && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Generate;
