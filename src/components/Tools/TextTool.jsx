import { useEffect } from "react";
import "../../components/Tool.css";
import Shortcut from "../Shortcut";
import Text from "../../assets/Text.png";

const TextTool = ({ activeTool, setActiveTool, openDropdown, position, scale }) => {
  // const [text, setText] = useState([]); // Array to store text objects
  // const [isTextMode, setIsTextMode] = useState(false); // activate text mode 

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

  // useEffect(() => {
  //   document.body.style.cursor = setActiveTool ? "crosshair" : "default";
  // }, [setActiveTool]);

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
