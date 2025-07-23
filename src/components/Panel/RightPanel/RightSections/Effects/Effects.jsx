import "../../RightPanel.css";
import "./Effects.css";
import { useState, useEffect, useRef } from "react";
import Dropdown from "../../../../../assets/down.png";
import EffectsDropdown from "./EffectDropdown";
import Hide from "../../../../../assets/RightPanel/hide.png";
import Show from "../../../../../assets/RightPanel/show.png";
import InnerShadowIcon from "../../../../../assets/RightPanel/show.png";
import DropShadowIcon from "../../../../../assets/RightPanel/border.png";
import LayerBlurIcon from "../../../../../assets/RightPanel/border.png";
import BackgroundBlurIcon from "../../../../../assets/RightPanel/show.png";
import NoiseIcon from "../../../../../assets/RightPanel/show.png";
import TextureIcon from "../../../../../assets/RightPanel/show.png";

const effectIcons = {
  "Inner shadow": InnerShadowIcon,
  "Drop shadow": DropShadowIcon,
  "Layer blur": LayerBlurIcon,
  "Background blur": BackgroundBlurIcon,
  Noise: NoiseIcon,
  Texture: TextureIcon,
};

const Effects = () => {
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [showEffectsDropdown, setShowEffectsDropdown] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState("Drop shadow");
  const dropdownRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState(null);
  const effectTriggerRef = useRef(null);
  const [isShown, setIsShown] = useState(true); // true = show icon, false = hide

  useEffect(() => {
    if (showEffectsDropdown && effectTriggerRef.current) {
      const rect = effectTriggerRef.current.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY - 180,
        left: rect.left + window.scrollX - 20,
      });
    }
  }, [showEffectsDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !effectTriggerRef.current.contains(e.target)
      ) {
        setShowEffectsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsEffectsOpen(!isEffectsOpen)}
      >
        Effects
        <button
          className="expand-collapse-btn"
          onClick={() => setIsEffectsOpen(!isEffectsOpen)}
        >
          {isEffectsOpen ? "-" : "+"}
          <span className="tooltip" style={{ left: "80%" }}>
            {isEffectsOpen ? "Remove Effects" : "Add Effects"}
          </span>
        </button>
      </div>

      {isEffectsOpen && (
        <div className="position-grid" style={{ alignItems: "center" }}>
          {/* Icon and dropdown together in a row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "-15px", // align with padding
              gap: "15px", // space between icon and dropdown
            }}
          >
            <img
              src={effectIcons[selectedEffect]}
              alt={selectedEffect}
              style={{ width: "16px", height: "16px" }}
            />

            <div
              ref={effectTriggerRef}
              className="pos-box"
              onClick={() => setShowEffectsDropdown(!showEffectsDropdown)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "none",
                border: "1px solid #e0e0e0",
                width: "135px",
                height: "auto",
                padding: "10px 15px",
                gap: "10px",
              }}
            >
              <span>{selectedEffect}</span>
              <img
                src={Dropdown}
                alt="Dropdown"
                style={{ width: "10px", height: "10px" }}
              />
            </div>
            <button
            className="reset-size-btn"
            onClick={() => setIsShown((prev) => !prev)}
            style={{
              width: "33px",
              height: "15px",
              transform: "translateX(20%)",
              marginBottom: "-2px",
              marginLeft: "-15px",
            }}
          >
            <img
              src={isShown ? Show : Hide}
              alt={isShown ? "Show" : "Hide"}
              style={{ width: 15, height: 15, marginBottom: 2 }}
            />
            <span className="tooltip" style={{ left: 2 }}>
              {isShown ? "Show Effect" : "Hide Effect"}
            </span>
          </button>
          </div>

          
          

          {/* Show/Hide icon */}
          <button
            className="reset-size-btn"
            onClick={() => setIsShown((prev) => !prev)}
            style={{
              width: "33px",
              height: "15px",
              transform: "translateX(20%)",
              marginBottom: "-2px",
              marginLeft: "62px",
            }}
          >
            <img
              src={isShown ? Show : Hide}
              alt={isShown ? "Show" : "Hide"}
              style={{ width: 15, height: 15, marginBottom: 2 }}
            />
            <span className="tooltip" style={{ left: 2 }}>
              {isShown ? "Show Effect" : "Hide Effect"}
            </span>
          </button>

          {/* Effects dropdown */}
          {showEffectsDropdown && dropdownCoords && (
            <EffectsDropdown
              top={dropdownCoords.top}
              left={dropdownCoords.left}
              selectedEffect={selectedEffect}
              onSelect={setSelectedEffect}
              onClose={() => setShowEffectsDropdown(false)}
              dropdownRef={dropdownRef}
            />
          )}
        </div>
      )}

      {/* Thin grey line divider */}
      {!isEffectsOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Effects;
