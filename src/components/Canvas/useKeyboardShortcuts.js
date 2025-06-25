import { useEffect } from "react";

const useKeyboardShortcuts = (setActiveTool, textInput) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip shortcuts if inside textarea or text input is active
      if (document.activeElement.tagName === "TEXTAREA" || textInput) return;

      // Tool shortcuts
      if (e.key.toLowerCase() === "r") {
        setActiveTool("Rectangle");
      } else if (e.key.toLowerCase() === "l") {
        setActiveTool("Line");
      } else if (e.key.toLowerCase() === "c") {
        setActiveTool("Circle");
      } else if (e.key.toLowerCase() === "t") {
        setActiveTool("Text");
      } else if (e.key.toLowerCase() === "v") {
        setActiveTool("Hand");
      } else if (e.key.toLowerCase() === "p") {
        setActiveTool("Triangle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveTool, textInput]);
};

export default useKeyboardShortcuts; 