// Stroke defaults
export const STROKE_DEFAULTS = {
  COLOR: "transparent",
  OPACITY: 100,
  WIDTH: 1,
  POSITION: "inside"
};

// Border sides configuration
export const BORDER_SIDES = {
  ALL: "all",
  TOP: "top", 
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left"
};

// Supported shape types
export const STROKEABLE_SHAPES = ["rectangle", "text", "image", "line"];

// Border icons mapping
export const BORDER_ICONS = {
  all: "border.png",
  top: "top_border.png",
  bottom: "bottom_border.png", 
  left: "border_left.png",
  right: "border_right.png"
};

// Stroke positions
export const STROKE_POSITIONS = {
  INSIDE: "inside",
  CENTER: "center", 
  OUTSIDE: "outside"
};

// Panel positioning offsets
export const PANEL_OFFSETS = {
  COLOR_PANEL: {
    TOP: -250,
    LEFT: -290
  },
  BORDER_PANEL: {
    TOP: -100,
    LEFT: -80
  },
  STROKE_POSITION_PANEL: {
    TOP: -60,
    LEFT: -205
  }
}; 