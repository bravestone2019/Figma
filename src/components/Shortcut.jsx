import { useEffect } from "react";

const Shortcut = (keyCombo, callback) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const expectedKey = keyCombo.key.toLowerCase();

      const ctrlMatch = keyCombo.ctrl ? e.ctrlKey : !e.ctrlKey;
      const shiftMatch = keyCombo.shift ? e.shiftKey : !e.shiftKey;
    //   const altMatch = keyCombo.alt ? e.altKey : !e.altKey; && altMatch

      if (key === expectedKey && ctrlMatch && shiftMatch ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, keyCombo]);
};

export default Shortcut;

