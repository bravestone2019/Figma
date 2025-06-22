import { useEffect, useRef, useState } from "react";

const Image = ({ activeTool }) => {
  const [image, setImage] = useState([]);
  const fileInputRef = useRef(null);

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

      const x = window.innerWidth / 2 - 50;
      const y = window.innerHeight / 2 - 50;

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
