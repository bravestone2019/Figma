import { useEffect } from "react";

const useKeyboardShortcuts = (setActiveTool, textInput) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip shortcuts if inside textarea or text input is active
      if (document.activeElement.tagName === "TEXTAREA" || textInput) return;

      // Escape key to cancel current tool and switch to Move
      if (e.key === "Escape") {
        setActiveTool("Move");
        return;
      }

      // Tool shortcuts
      if (e.key.toLowerCase() === "r") {
        setActiveTool("Rectangle");
      } else if (e.key.toLowerCase() === "l") {
        setActiveTool("Line");
      } else if (e.key.toLowerCase() === "c") {
        setActiveTool("Circle");
      } else if (e.key.toLowerCase() === "v") {
        setActiveTool("Move");
      } else if (e.key.toLowerCase() === "h") {
        setActiveTool("Hand");
      } else if (e.key.toLowerCase() === "k") {
        setActiveTool("Scale");
      } else if (e.key.toLowerCase() === "f") {
        setActiveTool("Frame");
      } else if (e.key.toLowerCase() === "s") {
        if (e.ctrlKey) {
          setActiveTool("Section");
        } else {
          setActiveTool("Slice");
        }
      } else if (e.key.toLowerCase() === "p") {
        if (e.ctrlKey) {
          setActiveTool("Pencil");
        } else {
          setActiveTool("Pen");
        }
      } else if (e.key.toLowerCase() === "t") {
        if (e.shiftKey) {
          setActiveTool("Triangle");
        } else {
          setActiveTool("Text");
        }
      } else if (e.key.toLowerCase() === "i" && e.ctrlKey && e.shiftKey) {
        setActiveTool("Image");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveTool, textInput]);
};

export default useKeyboardShortcuts; 