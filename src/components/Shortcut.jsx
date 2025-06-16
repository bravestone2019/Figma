import { useEffect } from "react";

const Shortcut = (keyCombo, callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const expectedKey = keyCombo.key.toLowerCase();

      const ctrlMatch = keyCombo.ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = keyCombo.shift ? event.shiftKey : !event.shiftKey;
    //   const altMatch = keyCombo.alt ? e.altKey : !e.altKey; && altMatch

      if (key === expectedKey && ctrlMatch && shiftMatch ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, keyCombo]);
};

export default Shortcut;

