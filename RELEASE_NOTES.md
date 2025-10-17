# Release Notes

## Version 0.3.0 - Interactive Tooltips & Enhanced UX (2025-10-17)

### 🎉 Major New Features

#### Interactive Seat Tooltips
The headline feature of v0.3.0 is a comprehensive tooltip system that brings seat information to life:

- **Desktop Experience**: Mouse-following tooltips that smoothly track your cursor and display seat details on hover
- **Mobile Experience**: Tap-to-show tooltips with intelligent positioning optimized for touch devices
- **Rich Content Display**:
  - Section identification (when available)
  - Seat label (e.g., "A-12")
  - Dynamic pricing with currency formatting
  - Status badges (available, booked, held, sold)
  - Custom metadata (category, amenities, etc.)
- **Smart Positioning**: Automatic viewport boundary detection prevents tooltips from going off-screen
- **Fully Customizable**: Control delays, offsets, and even provide custom render functions
- **Dark Mode**: Built-in dark mode support via CSS custom properties

### 📦 New Components & APIs

#### Components
- **`ZonetrixTooltip`**: HTML-based tooltip component with smart positioning
- **`useTooltip`**: Custom React hook for tooltip state management

#### New Props
```typescript
interface ZonetrixProps {
  // ... existing props
  tooltip?: TooltipConfig;
}

interface TooltipConfig {
  enabled?: boolean;           // Default: true
  enableTouch?: boolean;        // Default: true
  offset?: { x: number; y: number }; // Default: { x: 12, y: 12 }
  showDelay?: number;          // Default: 0 (ms)
  hideDelay?: number;          // Default: 0 (ms)
  renderContent?: (cell: Cell) => React.ReactNode;
}
```

### 📚 Usage Example

```tsx
import { ZonetrixCanvas, type Cell } from 'zonetrix';

// Add pricing to cells
const getCellLabel = (cell: Cell) => {
  if (cell.meta && cell.id.row !== undefined) {
    const price = 100 - (cell.id.row * 5);
    cell.meta.price = Math.max(25, Math.min(100, price));
    cell.meta.data = {
      category: price >= 75 ? 'Premium' : 'Standard'
    };
  }
  return cell.meta?.label || '';
};

<ZonetrixCanvas
  layout={myLayout}
  getCellLabel={getCellLabel}
  tooltip={{
    enabled: true,
    enableTouch: true,
    showDelay: 0,
  }}
/>
```

### 🎨 Styling & Theming

New CSS variables for tooltip customization:

```css
:root {
  --ztx-tooltip-bg: #ffffff;
  --ztx-tooltip-border: #e2e8f0;
  --ztx-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --ztx-tooltip-radius: 8px;
  --ztx-tooltip-padding: 12px;
  --ztx-tooltip-price-color: #059669;
  /* ... and many more */
}
```

Dark mode automatically applies via `@media (prefers-color-scheme: dark)`.

### 📱 Mobile-First Design

- **Touch Detection**: Automatically detects touch-capable devices
- **Optimized Layout**: Larger text and padding on touch screens
- **Smart Dismissal**: Tap outside or on another seat to hide tooltip
- **Persistent Display**: Tooltips remain visible until explicitly dismissed

### 🔧 Technical Improvements

- **Performance**: Memoized components and callbacks prevent unnecessary re-renders
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Accessibility**: Maintains existing ARIA labels and keyboard navigation
- **Bundle Size**: ~3KB gzipped for tooltip code and styles

### 📖 Documentation

- **Complete Guide**: [docs/tooltip-feature.md](docs/tooltip-feature.md)
- **Implementation Details**: [docs/tooltip-implementation-summary.md](docs/tooltip-implementation-summary.md)
- **Changelog**: [docs/CHANGELOG-tooltip.md](docs/CHANGELOG-tooltip.md)

### 🔄 Breaking Changes

**None!** This release is fully backward compatible. Tooltips are enabled by default but can be disabled:

```tsx
<ZonetrixCanvas layout={layout} tooltip={{ enabled: false }} />
```

### 🐛 Bug Fixes

- Improved touch event handling in ZonetrixCell component
- Better coordinate system management for SVG-based layouts

### 📦 Exports

New exports in v0.3.0:

```typescript
// Components
export { ZonetrixTooltip } from './components/ZonetrixTooltip';
export type { ZonetrixTooltipProps, TooltipPosition } from './components/ZonetrixTooltip';

// Hooks
export { useTooltip } from './hooks/useTooltip';
export type { TooltipState, UseTooltipOptions, UseTooltipReturn } from './hooks/useTooltip';

// Types
export type { TooltipConfig } from './core/models';
```

### 🧪 Testing

- ✅ All TypeScript compilation successful
- ✅ ESM and CJS bundles generated correctly
- ✅ Example app updated with tooltip demo
- ✅ Touch and mouse events tested
- ✅ Viewport boundary detection verified

### 📊 Migration Guide

No migration needed! Simply upgrade:

```bash
npm install zonetrix@0.3.0
```

If you want to disable tooltips:

```tsx
<ZonetrixCanvas
  layout={layout}
  tooltip={{ enabled: false }}
/>
```

### 🙏 Acknowledgments

Special thanks to the community for requesting this feature! The tooltip system was designed with real-world venue booking applications in mind.

### 🔮 What's Next?

Looking ahead to v0.4.0:
- Custom cell shapes (booths, VIP areas)
- Advanced pricing tiers
- Export functionality (SVG/PNG)
- Enhanced accessibility features

---

## Version 0.2.0 - Automatic Overlap Prevention (Previous Release)

### Features
- Automatic section overlap detection and prevention
- Smart spacing algorithms for multi-section layouts
- Enhanced collision detection system

---

## Version 0.1.0 - Initial Release

### Features
- Grid, Arc, Circle, and Multi-section layouts
- Keyboard navigation and accessibility
- RTL support
- Theme customization
- Pan & zoom controls
- Comprehensive TypeScript types

---

**For detailed API documentation, visit [packages/zonetrix/README.md](packages/zonetrix/README.md)**
