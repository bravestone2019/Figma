import { useEffect } from "react";
import Shortcut from "../../Shortcut";
import "../../../components/Tools/Tool.css";
import Text from "../../../assets/Tools/Text.png";

const TextTool = ({ activeTool, setActiveTool, openDropdown }) => {

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

  Shortcut({ key: "t" }, () => {
    setActiveTool("Text");
  });

  return (
    <div
      className={`icon-wrapper${activeTool === "Text" ? " active" : ""}`}
      onClick={() => setActiveTool("Text")}
    >
      <img src={Text} alt="Text" className="icon" />
      <span className="tooltip">Text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T</span>
    </div>
  );
};

export default TextTool;
