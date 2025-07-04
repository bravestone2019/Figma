import { CustomPicker } from "react-color";
import { Saturation, Hue, Alpha } from "react-color/lib/components/common";

const MiniPicker = ({ hsl, hsv, rgb, onChange }) => {
  return (
    <div style={{ width: 220, fontFamily: "sans-serif" }}>
      {/* Saturation Square with custom style */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 180,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Saturation
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
          pointer={SaturationPointer}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
      </div>

      {/* Hue Slider with custom circle */}
      <div style={{
          position: "relative",
          width: "100%",
          height: "14px",
          borderRadius: "6px",
          marginTop: "15px",
          overflow: "hidden",
        }}>
        <Hue
          hsl={hsl}
          onChange={onChange}
          direction="horizontal"
          pointer={HuePointer}
        />
      </div>

      {/* Opacity (Alpha) Slider */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "14px",
          borderRadius: "6px",
          marginTop: "10px",
          overflow: "hidden",
        }}
      >
        <Alpha
          rgb={rgb}
          hsl={hsl}
          onChange={onChange}
          direction="horizontal"
          pointer={AlphaPointer}
        />
      </div>

    </div>
  );
};

// Circle Pointer for Saturation
const SaturationPointer = () => (
  <div
    style={{
      width: 10,
      height: 9,
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 0 0 1px #0000001f",
      transform: "translate(-7px, -7px)",
      background: "transparent",
    //   pointerEvents: "none",
    }}
  />
);

// Circle Pointer for Hue
const HuePointer = () => (
  <div
    style={{
      width: 10,
      height: 9,
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 0 0 1px #0000001f",
      transform: "translate(-6px, -2px)",
      background: "transparent",
    //   pointerEvents: "none",
    }}
  />
);

// Pointer for Alpha
const AlphaPointer = () => (
  <div
    style={{
      width: 10,
      height: 9,
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 0 0 1px #0000001f",
      transform: "translate(-6px, -2px)",
      background: "transparent",
    //   pointerEvents: "none",
    }}
  />
);

export default CustomPicker(MiniPicker);
