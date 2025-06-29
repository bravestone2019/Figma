# Box Selection Feature

## Overview
The box selection (marquee selection) feature allows users to select multiple shapes by dragging a selection rectangle around them. This is a common feature in design tools like Figma.

## Architecture

### Modular Structure
The box selection functionality has been extracted into a dedicated module (`boxSelection.js`) for better organization and maintainability:

```
boxSelection.js/
├── createSelectionBox()        # Creates new selection box
├── updateSelectionBox()        # Updates selection box position
├── isShapeInSelectionBox()     # Checks if shape is in selection box
├── getShapesInSelectionBox()   # Gets all shapes in selection box
├── drawSelectionBox()          # Renders selection box on canvas
├── shouldActivateSelectionBox() # Checks if selection should be activated
└── getSelectionBoxBounds()     # Gets selection box bounds
```

### Integration Points
- **Event Handlers**: Use box selection functions for mouse events
- **Rendering**: Selection box is rendered in the main redraw function
- **State Management**: Selection box state is managed in Canvas component

## How It Works

### Activation
- **Tool Required**: Must be in "Move" tool mode
- **Mouse Button**: Right-click and drag (button === 2)
- **Trigger**: When right-clicking on empty canvas space in Move mode

### Visual Feedback
- **Selection Box**: Semi-transparent blue rectangle with dashed border
- **Fill Color**: `rgba(33, 150, 243, 0.1)` (light blue with 10% opacity)
- **Border Color**: `#2196f3` (blue)
- **Border Style**: Dashed line (`[5, 5]` pattern)

### Selection Logic
The selection box uses **containment logic** - shapes are selected only if they are **completely contained** within the selection rectangle:

#### Rectangle, Image, Text
```javascript
shape.x >= x1 && shape.y >= y1 &&
shape.x + shape.width <= x2 && shape.y + shape.height <= y2
```

#### Circle
```javascript
shape.x - shape.radius >= x1 && shape.y - shape.radius >= y1 &&
shape.x + shape.radius <= x2 && shape.y + shape.radius <= y2
```

#### Line
```javascript
shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2
```

#### Triangle
```javascript
shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2 &&
shape.x3 >= x1 && shape.x3 <= x2 && shape.y3 >= y1 && shape.y3 <= y2
```

## Implementation Details

### Event Handlers Integration
```javascript
// Mouse Down
import { createSelectionBox, shouldActivateSelectionBox } from '../CanvasContent/boxSelection';

if (shouldActivateSelectionBox(activeTool, e.button)) {
  setSelectionBox(createSelectionBox(mouseX, mouseY));
  return;
}

// Mouse Move
import { updateSelectionBox } from '../CanvasContent/boxSelection';

if (selectionBox) {
  setSelectionBox(updateSelectionBox(selectionBox, mouseX, mouseY));
  return;
}

// Mouse Up
import { getShapesInSelectionBox } from '../CanvasContent/boxSelection';

if (selectionBox) {
  const selected = getShapesInSelectionBox(drawnRectangles, selectionBox);
  setSelectedShapes(selected);
  setSelectionBox(null);
  return;
}
```

### Rendering Integration
```javascript
// In redraw.js
import { drawSelectionBox } from './boxSelection';

// Draw selection box using the dedicated module
drawSelectionBox(ctx, selectionBox, scale);
```

### State Management
```javascript
const [selectionBox, setSelectionBox] = useState(null);
// selectionBox format: { startX, startY, currentX, currentY }
```

## Usage Instructions
1. Select the "Move" tool
2. Right-click and drag on empty canvas space
3. Drag to create a selection rectangle around desired shapes
4. Release to select all shapes completely contained within the rectangle
5. Selected shapes will show blue bounding boxes and scale handles

## Multi-Selection Behavior
- **Single Click**: Selects individual shape
- **Box Selection**: Selects multiple shapes at once
- **Multi-Move**: When moving a selected shape, all selected shapes move together
- **Scale Handles**: Only shown when exactly one shape is selected

## Benefits of Modular Design

1. **Separation of Concerns**: Box selection logic is isolated from event handlers
2. **Reusability**: Functions can be used in different contexts
3. **Testability**: Each function can be tested independently
4. **Maintainability**: Changes to selection logic are centralized
5. **Readability**: Event handlers are cleaner and more focused
6. **Documentation**: Clear function signatures with JSDoc comments

## Technical Notes
- Selection box coordinates are in canvas space (accounting for pan and zoom)
- Locked shapes are ignored during selection
- Selection box is cleared when starting new interactions
- The feature integrates with existing shape selection and movement systems
- All functions are pure and side-effect free for better testing 