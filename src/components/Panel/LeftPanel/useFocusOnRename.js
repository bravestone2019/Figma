import { useEffect } from 'react';

const useFocusOnRename = (renamingId, inputRef) => {
  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId, inputRef]);
};

export default useFocusOnRename; 