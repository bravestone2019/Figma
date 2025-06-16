import { useEffect, useRef, useState } from "react";

const Image = ({ activeTool }) => {
  const [image, setImage] = useState([]);
  const fileInputRef = useRef(null);
  // const clickPosition = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleClick = (e) => {
  //     if (activeTool !== "Image") return;
  //     if (e.target.closest(".tools-container")) return;

  //     // Save click position
  //     clickPosition.current = { x: e.clientX, y: e.clientY };

  //     // Trigger file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.click();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClick);
  //   return () => document.removeEventListener("mousedown", handleClick);
  // }, [activeTool]);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const { x, y } = clickPosition.current;

  //   console.log("Image added:", { x, y, src: reader.result });

  //     setImages((prev) => [...prev, { x, y, src: reader.result }]);
  //   };
  //   reader.readAsDataURL(file);
  // };

  useEffect(() => {
    if (activeTool === "Image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [activeTool]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;

      const x = window.innerWidth / 2 - 50; // center-ish
      const y = window.innerHeight / 2 - 50;

      console.log("Image added:", { x, y, src });

      setImage((prev) => [...prev, { x, y, src }]);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {image.map((img, idx) => (
        <img
          key={idx}
          src={img.src}
          alt={`Dropped-${idx}`}
          style={{
            position: "absolute",
            left: img.x,
            top: img.y,
            width: 100,
            height: "auto",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      ))}
    </>
  );
};

export default Image;


{/* Hidden File Input */}
      // <input
      //   type="file"
      //   accept="image/*"
      //   ref={fileInputRef}
      //   multiple
      //   onChange={handleFileChange}
      //   style={{ display: "none" }}
      // />

      // {/* Render Dropped Images */}
      // {images.map((img, idx) => (
      //   <img
      //     key={idx}
      //     src={img.src}
      //     alt={`Dropped-${idx}`}
      //     style={{
      //       position: "absolute",
      //       left: img.x,
      //       top: img.y,
      //       width: 100,
      //       height: "auto",
      //       pointerEvents: "none",
      //       zIndex: 10,
      //     }}
      //   />
      // ))}