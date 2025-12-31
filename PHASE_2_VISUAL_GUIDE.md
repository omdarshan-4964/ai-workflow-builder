# 🎨 Phase 2 Visual Guide - UI Layout

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Untitled Workflow                          [Save]  [🚀 Deploy] │  ← Floating Header
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│  Core    │                                                       │
│  Nodes   │                                                       │
│          │                                                       │
│  📝 Text │              React Flow Canvas                        │
│  🖼️ Image│              (Dot Grid Background)                    │
│          │                                                       │
│  AI      │                                                       │
│  Models  │                                                       │
│          │              [Drag nodes here]                        │
│  ✨ LLM  │                                                       │
│          │                                                       │
│  Tips    │                                                       │
│  • Drag  │                                                       │
│  • Connect│                                                      │
│  • Delete│                                    [MiniMap]          │
│          │                          [Controls]                   │
└──────────┴──────────────────────────────────────────────────────┘
  280px      Flex-1 (Remaining Space)
  Sidebar    Canvas Area
```

## Component Hierarchy

```
WorkflowLayout (ReactFlowProvider)
  └── EditorPage
      ├── Sidebar (280px fixed)
      │   ├── Header
      │   │   ├── "Workflow Builder"
      │   │   └── "Drag nodes to canvas"
      │   ├── Core Nodes Section
      │   │   ├── Text Node Button (draggable)
      │   │   └── Image Node Button (draggable)
      │   ├── Separator
      │   ├── AI Models Section
      │   │   └── Run Any LLM Button (draggable)
      │   └── Quick Tips Card
      │
      └── Canvas Area (flex-1)
          ├── Floating Header
          │   ├── Workflow Name Input
          │   ├── Save Button
          │   └── Deploy Button
          └── ReactFlow
              ├── Background (Dots, 20px gap)
              ├── Controls (Zoom, Fit View)
              └── MiniMap (Bottom-right)
```

## Color Scheme

### Sidebar
- Background: `#FFFFFF` (white)
- Border: `#E5E7EB` (gray-200)
- Section Headers: `#6B7280` (gray-500)
- Button Border: `#2A2A2A` (weavy-border)
- Button Hover: `#F8FAFC` (weavy-background)

### Canvas
- Background: `#F8FAFC` (weavy-background)
- Grid Dots: `#E2E8F0` (weavy-grid)
- Edge Color: `#7C3AED` (weavy-primary)

### Header
- Background: `rgba(255, 255, 255, 0.8)` with backdrop-blur
- Border: `#E5E7EB` (gray-200)
- Deploy Button: `#7C3AED` (weavy-primary)

## Interactive Features

### 1. Drag and Drop
```typescript
// From Sidebar
onDragStart → Sets nodeType in dataTransfer

// To Canvas
onDrop → Creates new node at drop position
```

### 2. Node Creation
```typescript
const newNode = {
  id: 'node_0',
  type: 'text' | 'image' | 'llm',
  position: { x, y },
  data: { label: 'Text Node' }
}
```

### 3. Edge Animation
```typescript
const edge = {
  animated: true,
  style: { 
    stroke: '#7C3AED',  // Purple
    strokeWidth: 2 
  }
}
```

## Responsive Behavior

- Sidebar: Fixed 280px width
- Canvas: Flex-1 (takes remaining space)
- Header: Spans full width with absolute positioning
- MiniMap: Fixed position bottom-right
- Controls: Fixed position (default React Flow position)

## Icons Used (Lucide React)

- **Text Node**: `<Type />` - Typography icon
- **Image Node**: `<Image />` - Image icon
- **Run Any LLM**: `<Sparkles />` - AI/Magic icon
- **Deploy Button**: `<Rocket />` - Launch icon

## Typography

- Workflow Title: `text-xl font-semibold`
- Sidebar Header: `text-lg font-semibold`
- Section Headers: `text-xs font-semibold uppercase tracking-wider`
- Button Labels: `text-sm font-normal`
- Tips Text: `text-xs`

## Spacing

- Sidebar Padding: `p-6` (header), `p-4` (content)
- Section Gap: `space-y-6`
- Button Gap: `space-y-2`
- Icon-Text Gap: `gap-3`
- Header Padding: `px-6 py-4`

## Shadows & Effects

- Sidebar: No shadow (flat design)
- Header: `backdrop-blur-sm` effect
- Buttons: `shadow-sm` on hover
- Cards: `shadow` (default)
- MiniMap: `shadow-sm`
- Controls: `shadow-sm`

## Current State

✅ **Working**:
- Sidebar renders with all 3 node buttons
- Canvas renders with dot grid background
- Drag and drop creates nodes
- Pan and zoom work
- MiniMap shows workflow overview
- Controls work (zoom, fit view)
- Header is floating and editable

⏳ **Pending** (Phase 3):
- Custom node styling
- Node input/output handles
- Node deletion
- Connection validation
- Node data management
- Actual LLM execution

## Testing Checklist

- [ ] Navigate to `/editor`
- [ ] See sidebar with 3 buttons
- [ ] Drag "Text Node" to canvas
- [ ] Drag "Image Node" to canvas
- [ ] Drag "Run Any LLM" to canvas
- [ ] Pan canvas by dragging background
- [ ] Zoom with scroll wheel
- [ ] See MiniMap update
- [ ] Click controls (zoom in/out, fit view)
- [ ] Edit workflow name in header
- [ ] Hover over buttons (see hover effects)

---

**Phase 2 Status**: ✅ Complete and Ready for Testing  
**Next**: Phase 3 - Custom Node Components

