# Tooltip Feature - Changelog Entry

## New Feature: Interactive Seat Tooltips 🎉

### Overview
Added a comprehensive tooltip system that displays seat information on hover (desktop) and tap (mobile). Tooltips show section, seat number, pricing, status, and custom metadata with smart positioning to prevent viewport overflow.

### What's New

#### Components
- **`ZonetrixTooltip`**: HTML-based tooltip component with smart viewport boundary detection
- **`useTooltip`**: Custom React hook for tooltip state management and positioning

#### Features
- ✅ **Mouse Following (Desktop)**: Tooltip follows cursor with configurable offset
- ✅ **Touch Support (Mobile)**: Tap-to-show with intelligent positioning near touched seat
- ✅ **Auto-Positioning**: Prevents tooltip from going off-screen
- ✅ **Rich Content Display**: Section, seat label, price, status badge, custom metadata
- ✅ **Customizable**: Full control over delays, offsets, and content rendering
- ✅ **Dark Mode**: Built-in dark mode support with CSS custom properties
- ✅ **TypeScript**: Full type definitions included
- ✅ **Accessibility**: Maintains ARIA labels and doesn't interfere with keyboard navigation

### API

#### New Props on `ZonetrixCanvas`

```typescript
interface ZonetrixProps {
  // ... existing props

  /** Tooltip configuration */
  tooltip?: TooltipConfig;
}

interface TooltipConfig {
  /** Enable tooltip (default: true) */
  enabled?: boolean;

  /** Enable touch mode for mobile (default: true) */
  enableTouch?: boolean;

  /** Offset from cursor/touch point (default: { x: 12, y: 12 }) */
  offset?: { x: number; y: number };

  /** Show delay in ms (default: 0) */
  showDelay?: number;

  /** Hide delay in ms (default: 0) */
  hideDelay?: number;

  /** Custom content renderer */
  renderContent?: (cell: Cell) => React.ReactNode;
}
```

### Usage Examples

#### Basic Usage
```tsx
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{ enabled: true }}
/>
```

#### With Pricing
```tsx
const getCellLabel = (cell: Cell) => {
  if (cell.meta) {
    cell.meta.price = calculatePrice(cell);
    cell.meta.data = { category: 'Premium' };
  }
  return cell.meta?.label || '';
};

<ZonetrixCanvas
  layout={myLayout}
  getCellLabel={getCellLabel}
  tooltip={{ enabled: true }}
/>
```

#### Custom Content
```tsx
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{
    enabled: true,
    renderContent: (cell) => (
      <div className="custom-tooltip">
        <h3>{cell.meta?.label}</h3>
        <p>${cell.meta?.price}</p>
      </div>
    ),
  }}
/>
```

### CSS Customization

```css
:root {
  --ztx-tooltip-bg: #ffffff;
  --ztx-tooltip-border: #e2e8f0;
  --ztx-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --ztx-tooltip-radius: 8px;
  --ztx-tooltip-padding: 12px;
}
```

### Files Added
- `src/hooks/useTooltip.ts` - Tooltip state management hook
- `src/components/ZonetrixTooltip.tsx` - Tooltip component
- `src/styles/tooltip.css` - Tooltip styles
- `docs/tooltip-feature.md` - Complete documentation

### Files Modified
- `src/components/ZonetrixCanvas.tsx` - Integrated tooltip functionality
- `src/components/ZonetrixCell.tsx` - Added touch event support
- `src/core/models.ts` - Added TooltipConfig interface
- `src/index.ts` - Exported new components and types
- `examples/basic/src/App.tsx` - Added tooltip demo with pricing

### Breaking Changes
None. This is a fully backward-compatible addition.

### Migration Guide
No migration needed. Tooltips are enabled by default. To disable:

```tsx
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{ enabled: false }}
/>
```

### Testing
- ✅ Builds successfully without TypeScript errors
- ✅ Hot-reload works in development
- ✅ Touch events properly handled
- ✅ Viewport boundary detection working
- ✅ Dark mode styles applied correctly
- ✅ Example app demonstrates all features

### Documentation
See [tooltip-feature.md](./tooltip-feature.md) for complete documentation.

### Demo
Run the example app to see the tooltip in action:
```bash
npm run dev
```
Then navigate to http://localhost:3001 and:
1. Hover over seats to see tooltips (desktop)
2. Enable "Show pricing in tooltips" to see pricing
3. Tap seats to see tooltips (on touch device/mobile emulation)
