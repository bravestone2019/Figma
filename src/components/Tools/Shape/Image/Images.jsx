import { useEffect, useRef } from "react";

// Utility to get the next available shape name for a given type
function getNextShapeName(type, drawnRectangles) {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
  const sameType = drawnRectangles.filter(s => s.type === type);
  const namePattern = new RegExp(`^${typeName}(?: (\\d+))?$`, 'i');
  const numbers = sameType
    .map(s => {
      const shapeName = s.name || typeName;
      const match = shapeName.match(namePattern);
      return match ? (match[1] ? parseInt(match[1], 10) : 1) : null;
    })
    .filter(n => n !== null);
  let nextNumber = 1;
  while (numbers.includes(nextNumber)) nextNumber++;
  return nextNumber === 1 ? typeName : `${typeName} ${nextNumber}`;
}

const Image = ({ activeTool, setActiveTool, setDrawnRectangles, position, scale }) => {
  const fileInputRef = useRef(null);

  // Remove automatic file selection - let user click to place image
  // useEffect(() => {
  //   if (activeTool === "Image" && fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // }, [activeTool]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      // Reset tool if no file selected
      setActiveTool("Move");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;

      // Create a temporary image to get dimensions
      const tempImage = new window.Image();
      tempImage.onload = () => {
        // Calculate center of viewport in canvas coordinates
        // Using the same formula as mouse events: (screen_coordinate - position) / scale
        const viewportCenterX = (window.innerWidth / 2 - position.x) / scale;
        const viewportCenterY = (window.innerHeight / 2 - position.y) / scale;

        // Calculate proper dimensions while maintaining aspect ratio
        const maxSize = 200; // Maximum size for initial placement
        const minSize = 50;  // Minimum size for better interaction
        let width = tempImage.width;
        let height = tempImage.height;
        
        // Scale down if image is too large
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Scale up if image is too small
        if (width < minSize || height < minSize) {
          const ratio = Math.max(minSize / width, minSize / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Position image at center of viewport, offset by half its size
        const canvasX = viewportCenterX - width / 2;
        const canvasY = viewportCenterY - height / 2;

        // Create complete image shape object for canvas system
        setDrawnRectangles((prev) => {
          const name = getNextShapeName("image", prev);
          const imageShape = {
            type: "image",
            name,
            x: canvasX,
            y: canvasY,
            width: width,
            height: height,
            src: src,
            opacity: 1,
            locked: false,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            originalWidth: tempImage.width,
            originalHeight: tempImage.height,
            id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          return [...prev, imageShape];
        });
        
        // Reset active tool to Move after successful image placement
        setActiveTool("Move");
      };
      
      tempImage.onerror = () => {
        // Fallback if image fails to load
        const viewportCenterX = (window.innerWidth / 2 - position.x) / scale;
        const viewportCenterY = (window.innerHeight / 2 - position.y) / scale;
        
        const fallbackWidth = 100;
        const fallbackHeight = 100;
        const canvasX = viewportCenterX - fallbackWidth / 2;
        const canvasY = viewportCenterY - fallbackHeight / 2;

        // Create complete image shape object for canvas system
        setDrawnRectangles((prev) => {
          const name = getNextShapeName("image", prev);
          const imageShape = {
            type: "image",
            name,
            x: canvasX,
            y: canvasY,
            width: fallbackWidth,
            height: fallbackHeight,
            src: src,
            opacity: 1,
            locked: false,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            originalWidth: fallbackWidth,
            originalHeight: fallbackHeight,
            id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          return [...prev, imageShape];
        });
        
        // Reset active tool to Move after fallback image placement
        setActiveTool("Move");
      };

      tempImage.src = src;
    };
    
    reader.onerror = () => {
      console.error("Failed to read image file");
      // Reset tool if file reading fails
      setActiveTool("Move");
    };

    reader.readAsDataURL(file);
    
    // Clear the file input to allow selecting the same file again
    e.target.value = '';
  };

  // Function to trigger file selection
  const triggerFileSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Trigger file picker immediately when image tool is activated
  useEffect(() => {
    if (activeTool === "Image") {
      // Small delay to ensure the tool activation is complete
      const timeoutId = setTimeout(() => {
        triggerFileSelection();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeTool]);

  // Cleanup when image tool is deactivated
  useEffect(() => {
    // When image tool is deactivated, clear any pending file input
    if (activeTool !== "Image" && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [activeTool]);

  // Simplified click outside handling - only cancel if clicking outside canvas
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle if image tool is active
      if (activeTool === "Image") {
        // Check if click is outside the canvas
        const canvas = document.querySelector('canvas');
        const isClickOnCanvas = canvas && canvas.contains(event.target);
        
        // Don't cancel if clicking on file input or file dialog
        const isClickOnFileInput = fileInputRef.current && fileInputRef.current.contains(event.target);
        const isFileDialogOpen = document.querySelector('input[type="file"]:focus');
        
        // Only cancel if clicking outside canvas and not on file-related elements
        if (!isClickOnCanvas && !isClickOnFileInput && !isFileDialogOpen) {
          setActiveTool("Move");
        }
      }
    };

    if (activeTool === "Image") {
      // Use a longer delay to avoid interfering with file picker
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 200);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeTool, setActiveTool]);
  
  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple={false}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default Image;
