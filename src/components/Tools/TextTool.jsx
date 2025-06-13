import '../../components/Tool.css'
import Text from '../../assets/Text.png';
import { useEffect } from 'react';

const TextTool = ({ activeTool, setActiveTool, showTextDropdown }) => {
  // If you ever add a dropdown to TextTool, use this pattern:
  useEffect(() => {
    if (showTextDropdown) {
      document.body.classList.add('dropdown-open');
    } else {
      document.body.classList.remove('dropdown-open');
    }
    return () => {
      document.body.classList.remove('dropdown-open');
    };
  }, [showTextDropdown]);

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

