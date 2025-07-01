import "./upload.css"
import { useRef, useState } from "react";
import Files from "./Files/Files";
import Shortcut from  "../../Shortcut";
import File from "../../../assets/Generate/file.png";
import * as XLSX from "xlsx";

const Upload = ({setPhotoImage, setExcelData}) => {
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const [files, setFiles] = useState([]);

  function handleIconClick() {
    fileInputRef.current.click();
  };

  Shortcut({ctrl: true, shift: true, key: "a" }, () => {
    handleIconClick();
  });

   const handleFileChange = ( event ) => {
    const selectedFiles = Array.from( event.target.files );
    setFiles( prev => [...selectedFiles, ...prev ]); // Add new files to the end of the list (oldest first)

    selectedFiles.forEach((file) => {
      // If filename is all digits (e.g., 6608.jpg), treat as photoImage
      if (/^\d+\./.test(file.name)) {
        const url = URL.createObjectURL(file);
        setPhotoImage(url, file.name);
      }
      // Handle Excel file
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonRaw = XLSX.utils.sheet_to_json(worksheet);
          // Normalize keys: trim whitespace from all keys in each row
          const json = jsonRaw.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
              // Also trim string values to avoid extra spaces
              newRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            });
            return newRow;
          });
          setExcelData(json);
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };


  const handleRemove = ( index ) => {
    const updatedFiles = [...files];
    const [removed] = updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    // Remove photo image and reset filename if photo
    if (/^\d+\./.test(removed.name)) {
      setPhotoImage(null, "");
    }
    // Remove excel data if excel file
    if (removed.name.endsWith('.xlsx') || removed.name.endsWith('.xls') || removed.name.endsWith('.csv')) {
      setExcelData([]);
    }
  };

   const handleClear = () => {
    setFiles([]);
    setPhotoImage(null, "");
    setExcelData([]);
  };

  return (
    <>
    <div className="upload-bar">
      <img
        src={File}
        alt={File}
        className="upload-icon"
        onClick={handleIconClick}
      />
      <span className="uploadtip">Upload&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ctrl+shift+a</span>
      <input
        type='file'
        ref={fileInputRef} 
        onChange={ handleFileChange }
        multiple
        accept='.jpg,.jpeg,.png,.xlsx,.xls'
        style={{ display: 'none' }} 
      />
      </div>
      <div>
      <Files files={ files } onRemove={ handleRemove } onClear={ handleClear } boundsRef={modalRef.current}  />
    </div>
    </>
  );
};

export default Upload;
