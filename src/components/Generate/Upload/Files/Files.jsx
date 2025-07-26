import "./Files.css";
import { Rnd } from "react-rnd";
import { useState, useEffect } from "react";
import Image from "../../../../assets/Generate/file.png";
import File from "../../../../assets/Generate/upload.png";

const Files = ({ files, onRemove, onClear }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setIsMinimized(false); // reset to maximized when files are added
    }
  }, [files.length]);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const getFileIcon = (file) => {
    if (file.type?.startsWith("image/")) {
      return Image;
    }
    return File;
  };

  return (
    files.length > 0 && (
      <Rnd
        default={{
          x: 100,
          y: 100,
          width: 320,
          height: "auto",
        }}
        minWidth={250}
        enableResizing={true}
        dragHandleClassName="file-panel-header"
        style={{ zIndex: 1000 }}
      >
        <div className={`file-panel ${isMinimized ? "minimized" : ""}`}>
          <div className="file-panel-header">
            <span>Files</span>
            <div className="window-icons">
              <button type="button" onClick={handleMinimize}>
                –
              </button>
              <button type="button" onClick={handleMaximize}>
                ⛶
              </button>
              <button type="button" onClick={onClear}>
                ×
              </button>
            </div>
          </div>
          {!isMinimized && (
            <div
              className={`file-list${files.length > 3 ? " scrollable" : ""}`}
            >
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <img
                    src={getFileIcon(file)}
                    alt="file"
                    className="file-thumb"
                  />
                  <span className="file-name">{file.name}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => onRemove(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Rnd>
    )
  );
};

export default Files;
