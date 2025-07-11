import { useState, useRef } from 'react';

const useRenameState = () => {
  const [renamingId, setRenamingId] = useState(null);
  const [renamingPageId, setRenamingPageId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  return {
    renamingId,
    setRenamingId,
    renamingPageId,
    setRenamingPageId,
    renameValue,
    setRenameValue,
    renameInputRef,
  };
};

export default useRenameState; 