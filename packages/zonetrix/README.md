# Zonetrix

A highly-flexible React library for rendering venue layouts (seats, booths, and more). Built with TypeScript, tree-shakeable, and fully typed.

## Features

- 🎭 **Multiple Layout Types**: Grid, Arc, Circle/Ring, and Multi-section layouts
- ⚡ **Performant**: Handles thousands of cells with smooth interaction
- 🎨 **Themeable**: CSS variables and custom theme support
- ♿ **Accessible**: Full keyboard navigation, ARIA labels, and focus management
- 🌍 **RTL Support**: Works seamlessly in both LTR and RTL directions
- 🔧 **Flexible**: Controlled and uncontrolled selection patterns
- 📦 **Tree-shakeable**: ESM and CJS builds with optimal bundle size
- 🎯 **TypeScript**: Fully typed for great DX

## Installation

```bash
npm install zonetrix
# or
yarn add zonetrix
# or
pnpm add zonetrix
```

## Quick Start

```tsx
import { useState } from 'react';
import { ZonetrixCanvas, type LayoutConfig } from 'zonetrix';
import 'zonetrix/styles.css';

function App() {
  const [selected, setSelected] = useState<string[]>([]);

  const layout: LayoutConfig = {
    type: 'grid',
    rows: 10,
    cols: 12,
    cellSize: 22,
    gap: 6,
    numbering: { scheme: 'row-col', startIndex: 1 },
    labelPrefix: 'A',
  };

  return (
    <ZonetrixCanvas
      layout={layout}
      value={selected}
      onSelectionChange={setSelected}
      onCellClick={(cell) => console.log('Clicked:', cell.meta?.label)}
    />
  );
}
```

## Layout Types

### Grid Layout

Classic rows × columns seating arrangement.

```tsx
const gridLayout: LayoutConfig = {
  type: 'grid',
  rows: 10,
  cols: 12,
  cellSize: 22,
  gap: 6,
  origin: { x: 0, y: 0 },
  numbering: { scheme: 'row-col', startIndex: 1 },
  labelPrefix: 'A',
};
```

### Arc Layout

Seats arranged along a circular arc (e.g., amphitheater).

```tsx
const arcLayout: LayoutConfig = {
  type: 'arc',
  radius: 200,
  sweepDegrees: 180,
  count: 100,
  cellSize: 20,
  origin: { x: 400, y: 300 },
  numbering: { scheme: 'index', startIndex: 1 },
};
```

### Circle Layout

Seats arranged in a full circle.

```tsx
const circleLayout: LayoutConfig = {
  type: 'circle',
  radius: 150,
  count: 60,
  cellSize: 20,
  origin: { x: 300, y: 300 },
  numbering: { scheme: 'index', startIndex: 1 },
};
```

### Multi-Section Layout

Multiple independent sections (for complex venues).

```tsx
const sectionsLayout: LayoutConfig = {
  type: 'sections',
  blocks: [
    {
      id: 'left',
      origin: { x: 50, y: 50 },
      rows: 8,
      cols: 6,
      cellSize: 22,
      gap: 6,
      labelPrefix: 'L',
      numbering: { scheme: 'row-col', startIndex: 1 },
    },
    {
      id: 'center',
      origin: { x: 200, y: 50 },
      rows: 8,
      cols: 10,
      cellSize: 22,
      gap: 6,
      labelPrefix: 'C',
      numbering: { scheme: 'row-col', startIndex: 1 },
    },
  ],
};
```

## API Reference

### ZonetrixCanvas Props

| Prop                  | Type                             | Description                                      |
| --------------------- | -------------------------------- | ------------------------------------------------ |
| `layout`              | `LayoutConfig`                   | Layout configuration (required)                  |
| `value`               | `string[]`                       | Controlled selection (array of cell labels)      |
| `defaultValue`        | `string[]`                       | Uncontrolled default selection                   |
| `onSelectionChange`   | `(selected: string[]) => void`   | Callback when selection changes                  |
| `onCellClick`         | `(cell: Cell) => void`           | Callback when a cell is clicked                  |
| `onCellHover`         | `(cell: Cell \| null) => void`   | Callback when hovering over a cell               |
| `getCellLabel`        | `(cell: Cell) => string`         | Custom label generator                           |
| `selectablePredicate` | `(cell: Cell) => boolean`        | Function to determine if a cell is selectable    |
| `theme`               | `RenderTheme`                    | Custom theme configuration                       |
| `dir`                 | `'ltr' \| 'rtl'`                 | Text direction (default: 'ltr')                  |
| `className`           | `string`                         | Additional CSS class                             |
| `style`               | `React.CSSProperties`            | Additional inline styles                         |
| `enablePanZoom`       | `boolean`                        | Enable pan/zoom (future feature, default: false) |

### Numbering Schemes

- **`row-col`**: Classic row-column labeling (A1, A2, B1, B2, ...)
- **`snake`**: Zigzag numbering alternating direction per row
- **`index`**: Simple continuous numbering (1, 2, 3, ...)
- **`alpha-rows`**: Alphabetic rows with numeric columns

### Theme Customization

You can customize the appearance using CSS variables or the `theme` prop:

#### CSS Variables

```css
:root {
  --ztx-seat-color: #e5e7eb;
  --ztx-seat-color-hover: #d1d5db;
  --ztx-seat-color-selected: #3b82f6;
  --ztx-seat-color-unavailable: #9ca3af;
  --ztx-seat-border: #9ca3af;
  --ztx-seat-border-focus: #3b82f6;
  --ztx-cell-radius: 4px;
  --ztx-font-size: 11px;
}
```

#### Theme Prop

```tsx
<ZonetrixCanvas
  layout={layout}
  theme={{
    cellRadius: 8,
    seatColor: '#f0f0f0',
    seatColorSelected: '#0066cc',
    seatColorUnavailable: '#999999',
    fontSize: 12,
  }}
/>
```

## Accessibility

Zonetrix is built with accessibility in mind:

- ✅ Full keyboard navigation (Arrow keys, Enter, Space)
- ✅ ARIA labels and roles (`role="grid"`, `role="gridcell"`)
- ✅ Focus management
- ✅ Screen reader support
- ✅ RTL support

### Keyboard Shortcuts

- **Arrow Keys**: Navigate between cells
- **Enter / Space**: Toggle cell selection
- **Tab**: Move focus to canvas

## Advanced Usage

### Custom Cell Labels

```tsx
<ZonetrixCanvas
  layout={layout}
  getCellLabel={(cell) => {
    return `Custom-${cell.id.row}-${cell.id.col}`;
  }}
/>
```

### Selective Cell Availability

```tsx
<ZonetrixCanvas
  layout={layout}
  selectablePredicate={(cell) => {
    // Make first row unavailable
    return cell.id.row !== 0;
  }}
/>
```

### RTL Support

```tsx
<ZonetrixCanvas layout={layout} dir="rtl" />
```

## Components

### ZonetrixLegend

Display a legend showing seat status indicators.

```tsx
import { ZonetrixLegend } from 'zonetrix';

<ZonetrixLegend
  showAvailable={true}
  showSelected={true}
  showUnavailable={true}
  labels={{
    available: 'Available',
    selected: 'Selected',
    unavailable: 'Sold Out',
  }}
/>;
```

## TypeScript Support

Zonetrix is written in TypeScript and provides comprehensive type definitions:

```tsx
import type {
  Cell,
  CellId,
  CellMeta,
  LayoutConfig,
  GridLayoutConfig,
  ArcLayoutConfig,
  CircleLayoutConfig,
  SectionsLayoutConfig,
  NumberingConfig,
  RenderTheme,
} from 'zonetrix';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT © Zonetrix Contributors

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## Support

- 📖 [Documentation](https://github.com/yourusername/zonetrix)
- 🐛 [Issue Tracker](https://github.com/yourusername/zonetrix/issues)
- 💬 [Discussions](https://github.com/yourusername/zonetrix/discussions)
