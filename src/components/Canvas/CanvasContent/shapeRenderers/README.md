# Shape Renderers

This directory contains the refactored shape rendering modules that were extracted from the main `redraw.js` file to improve code organization, maintainability, and testability.

## Structure

```
shapeRenderers/
├── index.js              # Exports all shape renderer functions
├── shapeStyling.js       # Shared styling utilities
├── drawRectangle.js      # Rectangle shape renderer
├── drawLine.js          # Line shape renderer
├── drawCircle.js        # Circle shape renderer
├── drawTriangle.js      # Triangle shape renderer
├── drawImage.js         # Image shape renderer (with caching)
├── drawText.js          # Text shape renderer (with wrapping)
└── README.md            # This file
```

## Usage

### Basic Usage

```javascript
import { 
  drawRectangle, 
  drawLine, 
  drawCircle, 
  drawTriangle, 
  drawImage, 
  drawText 
} from './shapeRenderers';

// Each renderer function takes the same parameters:
// ctx: Canvas 2D context
// shape: Shape object with properties
// options: Rendering options object

const options = {
  isHovered: false,
  isLocked: false,
  scale: 1,
  activeTool: null,
  canvas: null // Only needed for image renderer
};

drawRectangle(ctx, rectangleShape, options);
drawLine(ctx, lineShape, options);
drawCircle(ctx, circleShape, options);
drawTriangle(ctx, triangleShape, options);
drawImage(ctx, imageShape, options);
drawText(ctx, textShape, options);
```

### Shape Types

Each shape renderer expects specific properties on the shape object:

#### Rectangle
```javascript
{
  type: "rectangle",
  x: number,
  y: number,
  width: number,
  height: number,
  backgroundColor: string,
  borderColor: string,
  borderWidth: number,
  opacity: number,
  locked: boolean
}
```

#### Line
```javascript
{
  type: "line",
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  opacity: number,
  locked: boolean
}
```

#### Circle
```javascript
{
  type: "circle",
  x: number,
  y: number,
  radius: number,
  backgroundColor: string,
  borderColor: string,
  borderWidth: number,
  opacity: number,
  locked: boolean
}
```

#### Triangle
```javascript
{
  type: "triangle",
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  backgroundColor: string,
  borderColor: string,
  borderWidth: number,
  opacity: number,
  locked: boolean
}
```

#### Image
```javascript
{
  type: "image",
  x: number,
  y: number,
  width: number,
  height: number,
  src: string,
  opacity: number,
  locked: boolean
}
```

#### Text
```javascript
{
  type: "text",
  x: number,
  y: number,
  width: number,
  text: string,
  color: string,
  fontSize: number,
  opacity: number,
  locked: boolean
}
```

## Features

### Shared Styling
All shape renderers use shared styling utilities from `shapeStyling.js`:
- Consistent hover effects (blue border)
- Consistent locked state (red dashed border)
- Proper scale handling
- Line dash patterns

### Image Caching
The image renderer includes built-in caching and loading management:
- Automatic image loading and caching
- Loading placeholders
- Error handling
- Redraw callbacks when images load

### Text Wrapping
The text renderer includes:
- Automatic text wrapping
- Height measurement
- Proper line spacing
- Bounding box calculation

## Benefits of This Refactoring

1. **Separation of Concerns**: Each shape type has its own renderer
2. **Code Reusability**: Shared styling utilities eliminate duplication
3. **Maintainability**: Easier to modify individual shape rendering
4. **Testability**: Each renderer can be tested independently
5. **Readability**: Main redraw function is much cleaner
6. **Extensibility**: Easy to add new shape types

## Migration from Old Code

The main `redraw.js` file has been updated to use these new modules. The old shape drawing logic has been removed and replaced with calls to the appropriate renderer functions.

### Before (Old Code)
```javascript
// 100+ lines of repetitive shape drawing logic
if (shape.type === "rectangle") {
  // 20+ lines of rectangle drawing code
} else if (shape.type === "line") {
  // 20+ lines of line drawing code
}
// ... etc for each shape type
```

### After (New Code)
```javascript
// Clean, maintainable code
switch (shape.type) {
  case "rectangle":
    drawRectangle(ctx, shape, renderOptions);
    break;
  case "line":
    drawLine(ctx, shape, renderOptions);
    break;
  // ... etc
}
```

## Future Improvements

1. **Configuration**: Move hardcoded values to configuration objects
2. **Performance**: Add shape culling for off-screen shapes
3. **Animation**: Add support for animated shapes
4. **Effects**: Add support for shadows, gradients, etc.
5. **Validation**: Add shape property validation 